---
title: "Chapter 8: Storage & Retention"
weight: 8
bookFlatSection: false
bookToc: true
---

# Chapter 8: Storage & Retention

## 🎯 Learning Objectives

- Understand Prometheus TSDB architecture and block storage
- Configure storage retention policies
- Understand remote write and remote read
- Learn about storage best practices and optimization
- Compare local vs remote storage architectures

---

## 8.1 Local Storage Architecture

Prometheus stores all time series data locally on disk using its custom TSDB.

### Storage Directory Structure

```
/data/prometheus/
├── wal/                          # Write-Ahead Log
│   ├── 000001.wal
│   ├── 000002.wal
│   └── 000003.wal
├── chunks_head                   # Head block chunks
├── index                         # Head block index
├── 01EM6Q6A1YPX4Z9J3Y3X4Z9J3Y/  # Persisted block (ULID)
│   ├── chunks/
│   │   ├── 000001
│   │   └── 000002
│   ├── index
│   ├── meta.json
│   └── tombstones
├── 01EM6Q6A1YPX4Z9J3Y3X4Z9J3Z/  # Another persisted block
├── queries.active                # Currently running queries
└── lock                          # Prevents multiple Prometheus instances
```

### Block Lifecycle

```
                   ┌─────────────────────┐
                   │   Prometheus TSDB    │
                   └─────────────────────┘
                            │
                    Ingested Samples
                            │
                            ▼
                   ┌───────────────┐
                   │      WAL       │  ← Write-ahead log
                   │  (current)    │     (crash recovery)
                   └───────┬───────┘
                           │
                           ▼
                   ┌───────────────┐
                   │   Head Block   │  ← In-memory ~2h of data
                   │  (memory)     │     (fast queries for recent data)
                   └───────┬───────┘
                           │
              (when full, ~2h)
                           │
                           ▼
                   ┌───────────────────┐
                   │ Persisted Block    │  ← Immutable 2h block on disk
                   │ (ULID directory)   │     (compressed, indexed)
                   └───────────────────┘
                           │
              (compaction merges blocks)
                           │
                           ▼
                   ┌───────────────────┐
                   │  Larger Blocks     │  ← Merged blocks up to 10% of retention
                   │  (up to 10% of    │     (improves query performance)
                   │   retention)       │
                   └───────────────────┘
                           │
              (retention expires)
                           │
                           ▼
                   ┌───────────────────┐
                   │   Block Deleted    │  ← Removed by retention
                   └───────────────────┘
```

---

## 8.2 Storage Configuration

### Command-Line Flags

```bash
# Core storage flags
--storage.tsdb.path="./data"              # Storage directory
--storage.tsdb.retention.time=15d         # Retention by time (default: 15d)
--storage.tsdb.retention.size=0           # Retention by size (0 = unlimited)
--storage.tsdb.wal-compression            # Enable WAL compression (recommended)

# Advanced storage flags
--storage.tsdb.min-block-duration=30m     # Minimum block duration
--storage.tsdb.max-block-duration=36m     # Maximum block duration
--storage.tsdb.no-lockfile                # Disable lock file (not recommended)
--storage.tsdb.head-chunks-write-queue-size=0
```

### Retention Configuration Examples

```bash
# 30-day retention
prometheus \
  --storage.tsdb.path=/data/prometheus \
  --storage.tsdb.retention.time=30d

# Retention by size (max 50GB)
prometheus \
  --storage.tsdb.path=/data/prometheus \
  --storage.tsdb.retention.size=50GB

# Both limits (whichever is reached first)
prometheus \
  --storage.tsdb.path=/data/prometheus \
  --storage.tsdb.retention.time=30d \
  --storage.tsdb.retention.size=100GB

# Long-term retention with WAL compression
prometheus \
  --storage.tsdb.path=/data/prometheus \
  --storage.tsdb.retention.time=90d \
  --storage.tsdb.wal-compression
```

### Retention Behavior

```
Time-based retention (--storage.tsdb.retention.time):
┌────────┬────────┬────────┬────────┬────────┬────────┐
│ Block1 │ Block2 │ Block3 │ Block4 │ Block5 │ Block6 │
│ Day 1  │ Day 2  │ Day 3  │ Day 4  │ Day 5  │ Day 6  │
└────────┴────────┴────────┴────────┴────────┴────────┘
         │                              │
         │           retention.time=3d  │
         └──────────────────────────────┘
         Blocks 1-3 are deleted         Blocks 4-6 are kept

Size-based retention (--storage.tsdb.retention.size):
Total size exceeds limit → oldest blocks deleted first
Until total size ≤ limit (not exact — deletes whole blocks)
```

---

## 8.3 Write-Ahead Log (WAL)

The WAL is the first stop for all ingested samples. It provides crash recovery.

### WAL Structure

```
/data/prometheus/wal/
├── 000001.wal    ← Current WAL segment
├── 000002.wal    ← Older segment (being replayed on startup)
└── checkpoint.000003/  ← WAL checkpoint
    └── 000001
```

### WAL Lifecycle

```
1. Sample arrives from scrape
2. Written to current WAL segment immediately
3. Also written to in-memory head block
4. WAL segment fills up (128MB default)
5. New WAL segment created
6. Old segments are deleted after data is persisted to blocks
7. Checkpoints created periodically to compact WAL
```

### WAL on Crash Recovery

```
Prometheus starts:
1. Read WAL from disk
2. Rebuild in-memory head block
3. Resume normal operation

Without WAL: Recent data (up to 2h) would be lost on crash
With WAL: All data is recovered on restart
```

### WAL Compression

```bash
# Enable WAL compression (recommended for production)
--storage.tsdb.wal-compression

# Impact:
# - WAL size: ~40% smaller
# - CPU: Slightly more (compression overhead)
# - Write throughput: Minor impact
```

---

## 8.4 Compaction

Compaction merges smaller blocks into larger ones for query efficiency.

### Compaction Process

```
Before Compaction:
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  ← 4 blocks (2h each = 8h data)
│ B1   │ │ B2   │ │ B3   │ │ B4   │
│ 2h   │ │ 2h   │ │ 2h   │ │ 2h   │
└──────┘ └──────┘ └──────┘ └──────┘
              │
              ▼ Compaction
              │
After Compaction:
┌──────────────┐ ┌──────────────┐  ← 2 blocks (4h each)
│ B1 + B2      │ │ B3 + B4      │
│ 4h           │ │ 4h           │
└──────────────┘ └──────────────┘
```

### Compaction Benefits

| Benefit | Description |
|---------|-------------|
| **Fewer blocks** | Reduces number of blocks to query |
| **Better compression** | Larger blocks compress better |
| **Faster queries** | Fewer index lookups |
| **Deletion** | Applies tombstoned deletions |

### Compaction Limits

Blocks are compacted up to **10% of the retention period**:

| Retention | Max Block Size |
|-----------|---------------|
| 15 days | ~36 hours |
| 30 days | ~72 hours |
| 90 days | ~216 hours (9 days) |

---

## 8.5 Remote Write

**Remote write** sends data from Prometheus to a remote storage system for long-term retention or HA.

### Architecture

```
                    ┌──────────────┐
                    │  Prometheus   │
                    │  (short-term) │
                    └──────┬───────┘
                           │
                    remote write
                    (snappy compressed
                     protobuf)
                           │
                           ▼
              ┌─────────────────────┐
              │  Remote Storage      │
              │  (Thanos, Cortex,    │
              │   Mimir, Victoria,   │
              │   InfluxDB)          │
              └─────────────────────┘
```

### Remote Write Configuration

```yaml
# prometheus.yml
remote_write:
  - url: "http://thanos-receive:19291/api/v1/receive"
    name: "thanos-receive"
    # Batch settings
    remote_timeout: 30s
    queue_config:
      capacity: 2500              # Max samples per shard (default: 2500)
      max_shards: 200              # Max concurrent shards (default: 200)
      min_shards: 1               # Min shards (default: 1)
      max_samples_per_send: 500   # Max samples per request (default: 500)
      batch_send_deadline: 5s     # Max wait before sending batch (default: 5s)
      min_backoff: 30ms           # Min retry backoff (default: 30ms)
      max_backoff: 100ms          # Max retry backoff (default: 100ms)

  - url: "https://mimir.example.com/api/v1/push"
    name: "mimir"
    # Authentication
    basic_auth:
      username: "user"
      password_file: "/etc/prometheus/mimir-passwd"
    # Write relabeling (filter before sending)
    write_relabel_configs:
      - source_labels: [__name__]
        regex: "expensive_metric_.*"
        action: drop
```

### Remote Write Queue

```
[Prometheus TSDB] → [Shard 1] ──▶ [Remote Storage]
                  → [Shard 2] ──▶ [Remote Storage]
                  → [Shard 3] ──▶ [Remote Storage]
                  → ...

Shard Management:
- Shards increase automatically when queue backs up
- Up to max_shards default (200)
- Each shard sends samples in batches
- Retries with exponential backoff on failure
```

### Remote Write Best Practices

```yaml
remote_write:
  - url: "http://remote:19291/api/v1/receive"
    # Filter metrics to reduce costs
    write_relabel_configs:
      - source_labels: [__name__]
        regex: ".*_total$"
        action: keep               # Only send counter metrics

    # Compress data
    remote_timeout: 30s
    queue_config:
      capacity: 10000              # Larger buffer for spikes
      max_shards: 200
      min_shards: 10               # Start with 10 shards
      max_samples_per_send: 1000
      batch_send_deadline: 5s
```

---

## 8.6 Remote Read

**Remote read** queries remote storage as an extension of local Prometheus data.

```yaml
# prometheus.yml
remote_read:
  - url: "http://thanos-query:10901/api/v1/read"
    name: "thanos"
    read_recent: true             # Read from Thanos for recent data
    required_matchers:
      cluster: "us-east-1"        # Only read matching data
```

### Remote Read Use Cases

- Querying long-term data not stored locally
- Global query view across multiple Prometheus instances
- Reading from Thanos, Cortex, or Mimir

### Remote Read Limitations

- **Not cached locally** — queries are sent to remote on every request
- **Latency** — network round-trip adds query time
- **No deduplication** — Prometheus doesn't deduplicate remote read results

---

## 8.7 Long-Term Storage Solutions

### Comparison

| Solution | Description | HA | Multi-Tenant | Query |
|----------|-------------|-----|--------------|-------|
| **Thanos** | Sidecar + store + query | ✅ Global view | ✅ | PromQL |
| **Cortex** | HA Prometheus as a service | ✅ Built-in | ✅ | PromQL |
| **Mimir** | Grafana's Cortex successor | ✅ Built-in | ✅ | PromQL |
| **VictoriaMetrics** | Single-node or cluster | ✅ Cluster | ✅ | PromQL-compatible |
| **InfluxDB** | General TSDB | ✅ Enterprise | ❌ | Flux/InfluxQL |

### Thanos Architecture

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Prometheus   │    │  Prometheus   │    │  Prometheus   │
│  + Thanos     │    │  + Thanos     │    │  + Thanos     │
│  Sidecar      │    │  Sidecar      │    │  Sidecar      │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       ▼                   ▼                   ▼
       ┌───────────────────────────────────────┐
       │             Thanos Query               │
       │         (Global PromQL View)           │
       └───────────────────────────────────────┘
```

---

## 8.8 Storage Capacity Planning

### Estimating Storage Requirements

```
Formula (rough estimate):
  Storage = Series × Samples/sec × Bytes/sample × Retention

Where:
  Series    = number of unique time series
  Samples   = 1 per scrape interval (default: 60s → 1/60 per sec)
  Bytes     = ~2 bytes per sample after compression
  Retention = retention period in seconds

Example:
  100,000 series × (1/60 samples/sec) × 2 bytes × (30 × 86400 sec)
  = 100,000 × 0.0167 × 2 × 2,592,000
  = ~8.6 GB

  Additional overhead: ~50% for index, WAL, metadata
  Realistic estimate: ~13 GB
```

### Planning Guidelines

| Targets | Series | Retention | Estimated Storage |
|---------|--------|-----------|-------------------|
| 100 | 10,000 | 15 days | ~500 MB |
| 1,000 | 100,000 | 15 days | ~5 GB |
| 10,000 | 1,000,000 | 15 days | ~50 GB |
| 10,000 | 1,000,000 | 30 days | ~100 GB |
| 100,000 | 10,000,000 | 30 days | ~1 TB |

### Monitoring Storage

```promql
# Current number of series
prometheus_tsdb_head_series

# Storage size
prometheus_tsdb_storage_blocks_bytes

# Series added per second
rate(prometheus_tsdb_head_series_appended_total[5m])

# Compaction stats
prometheus_tsdb_compactions_total
prometheus_tsdb_compaction_duration_seconds

# WAL stats
prometheus_tsdb_wal_storage_size_bytes
prometheus_tsdb_wal_corruptions_total

# Memory usage
process_resident_memory_bytes
go_memstats_alloc_bytes
```

---

## 8.9 Storage Best Practices

### Production Recommendations

```bash
# 1. Use a dedicated data volume (SSD)
--storage.tsdb.path=/data/prometheus

# 2. Enable WAL compression
--storage.tsdb.wal-compression

# 3. Set retention limits
--storage.tsdb.retention.time=30d
--storage.tsdb.retention.size=100GB

# 4. Use remote write for long-term storage
# (Configure remote_write in prometheus.yml)

# 5. Monitor TSDB health
# Alert on high cardinality, storage errors
```

### Performance Optimization

| Technique | Impact | Configuration |
|-----------|--------|---------------|
| **WAL compression** | Saves ~40% WAL space | `--storage.tsdb.wal-compression` |
| **SSD storage** | Faster writes/queries | Use SSD, not HDD |
| **Separate data volume** | No disk contention | Mount separate volume |
| **Monitor cardinality** | Prevent TSDB crash | Alert on series count |
| **Remote write filtering** | Reduce costs | `write_relabel_configs` |

---

## 🌐 Real-World Scenario: Storage Capacity Crisis Walkthrough

### The Problem

Your Prometheus is running out of disk space. The `/data` partition is at 92% and growing. You need to diagnose the issue and resolve it without losing critical monitoring data.

### Step 1: Assess the Situation

```promql
# How many time series are we storing?
prometheus_tsdb_head_series

# How fast are we adding new series?
rate(prometheus_tsdb_head_series_appended_total[5m])

# Total storage used
prometheus_tsdb_storage_blocks_bytes

# WAL size
prometheus_tsdb_wal_storage_size_bytes

# Memory usage (correlated with series count)
process_resident_memory_bytes
```

### Step 2: Check for Cardinality Explosion

```promql
# Which metrics have the most series?
topk(10, count by (__name__) ({__name__=~".+"}))

# Check if a specific metric is growing unboundedly
count(node_network_receive_bytes_total) by (device)
# If device includes pod IDs or container hashes → cardinality blast!

# Check recent spikes in series count
delta(prometheus_tsdb_head_series[1h])
```

### Step 3: Immediate Mitigation (Emergency Actions)

```yaml
# Option A: Reduce retention time immediately
# Change from --storage.tsdb.retention.time=30d to 7d
# This is drastic but recovers space quickly

# Option B: Set a size-based limit
# --storage.tsdb.retention.size=50GB
# Prometheus will delete oldest blocks until under 50GB

# Option C: Drop expensive metrics via metric_relabel_configs
scrape_configs:
  - job_name: 'problematic-exporter'
    metric_relabel_configs:
      # Drop high-cardinality metrics
      - source_labels: [__name__]
        regex: 'high_cardinality_metric.*'
        action: drop
      # Drop metrics with specific labels that cause explosion
      - source_labels: [container_id]
        action: labeldrop
```

### Step 4: Long-Term Fix — Capacity Planning

```bash
# Calculate required storage
# Formula: Series × (1/scrape_interval) × 2 bytes × retention_seconds × 1.5

# Example: 500K series, 15s interval, 30d retention
# 500,000 × (1/15) × 2 × (30 × 86400) × 1.5
# = 500,000 × 0.0667 × 2 × 2,592,000 × 1.5
# = ~259 GB

# Recommendation: Provision 300GB for this workload
```

yaml
# Add to your alerting rules to catch this early
groups:
  - name: storage
    rules:
      - alert: DiskSpaceRunningLow
        expr: (node_filesystem_avail_bytes{mountpoint="/data"} / node_filesystem_size_bytes{mountpoint="/data"}) < 0.15
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Disk space below 15% on {{ $labels.instance }}"

      - alert: HighCardinalityExplosion
        expr: delta(prometheus_tsdb_head_series[1h]) > 50000
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Potential cardinality explosion: {{ $value }} new series in 1h"
```

### Step 5: Set Up Remote Write for Long-Term Storage

```yaml
# After fixing the immediate issue, set up Thanos for long-term retention
remote_write:
  - url: "http://thanos-receiver:19291/api/v1/receive"
    queue_config:
      max_shards: 50
      min_shards: 5
      capacity: 10000
    write_relabel_configs:
      # Only send aggregated/important metrics to long-term storage
      - source_labels: [__name__]
        regex: '.(total|count|sum|seconds_bucket)$'
        action: keep
      - source_labels: [__name__]
        regex: 'prometheus_sd_.*|scrape_.*'
        action: drop  # Don't forward internal Prometheus metrics
```

---

## 📝 Exam Tips

1. **Default retention:** 15 days
2. **WAL** provides crash recovery (recent data is safe)
3. **Head block** is in-memory (~2 hours) for fast recent-data queries
4. **Persisted blocks** are immutable 2h chunks on disk
5. **Compaction** merges small blocks into larger ones (up to 10% of retention)
6. **Remote write** sends data to long-term storage
7. **Remote read** queries external storage for historical data
8. **Retention can be time-based or size-based**
9. **Block ULID** is the directory name format for persisted blocks
10. **Never let retention.size exceed available disk space**

---

## ✅ Chapter 8 Quiz

1. **What is the default retention period for Prometheus local storage?**
   - a) 7 days
   - b) 15 days
   - c) 30 days
   - d) 90 days

2. **What is the purpose of the WAL (Write-Ahead Log)?**
   - a) To compact blocks
   - b) To provide crash recovery for recent data
   - c) To store queries
   - d) To serve as the main query engine

3. **How long does the head block hold data before persisting?**
   - a) 15 minutes
   - b) 1 hour
   - c) ~2 hours
   - d) 24 hours

4. **What happens during compaction?**
   - a) Data is deleted
   - b) Small blocks are merged into larger blocks
   - c) New metrics are added
   - d) The WAL is replayed

5. **Which remote write queue parameter controls the maximum number of concurrent shards?**
   - a) `capacity`
   - b) `max_samples_per_send`
   - c) `max_shards`
   - d) `batch_send_deadline`

<details>
<summary>📌 Answers</summary>

1. **b** — Default retention is 15 days (`--storage.tsdb.retention.time=15d`)
2. **b** — The WAL records all ingested samples for crash recovery
3. **c** — The head block holds ~2 hours of data in memory before being persisted to disk
4. **b** — Compaction merges smaller blocks into larger ones for better query performance
5. **c** — `max_shards` controls the maximum number of concurrent shards for remote write
</details>

---

## 🔗 Related Chapters

- [Chapter 4: Prometheus Architecture & Core Concepts]({{< relref "04-prometheus-architecture" >}}) — TSDB internals and block structure
- [Chapter 5: Installation & Configuration]({{< relref "05-installation-configuration" >}}) — Configuring storage flags
- [Chapter 17: Alerting Rules & Alertmanager]({{< relref "17-alerting-rules" >}}) — Alerting on storage and retention issues

## 📚 Additional Resources

- [Prometheus TSDB Format](https://prometheus.io/docs/concepts/tsdb/)
- [Remote Write Specification](https://prometheus.io/docs/concepts/remote_write_spec/)
- [Thanos Documentation](https://thanos.io/)
- [Grafana Mimir Documentation](https://grafana.com/oss/mimir/)

---

*Continue to → [Chapter 9: PromQL Basics]({{< relref "09-promql-basics" >}})*
