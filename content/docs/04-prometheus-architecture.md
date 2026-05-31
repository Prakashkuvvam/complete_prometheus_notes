---
title: "Chapter 4: Prometheus Architecture & Core Concepts"
weight: 4
bookFlatSection: false
bookToc: true
---

# Chapter 4: Prometheus Architecture & Core Concepts

## 🎯 Learning Objectives

- Understand Prometheus architecture and its key components
- Learn the pull model and scrape lifecycle in detail
- Understand time series data model
- Learn about Prometheus TSDB internals
- Understand the difference between Prometheus server and Alertmanager

---

## 4.1 Prometheus Architecture Overview

```
                          ┌─────────────────────┐
                          │      Prometheus       │
                          │       Server          │
                          │                       │
  ┌────────────────┐      │ ┌─────────────────┐   │     ┌──────────────┐
  │  Service        │      │ │  TSDB (Storage)  │   │     │   Grafana     │
  │  Discovery      │──────▶│                   │───┼────▶│  (Dashboards) │
  │  (K8s, Consul,  │      │ │  ┌─────────┐     │   │     └──────────────┘
  │   EC2, File)    │      │ │  │ WAL    │     │   │
  └────────────────┘      │ │  │ (write-│     │   │     ┌──────────────┐
                           │ │  │ ahead) │     │   │     │Alertmanager  │
  ┌────────────────┐      │ │  └─────────┘     │   │     │              │
  │  Targets        │──────▶│  ┌─────────┐     ├───┼────▶│  Deduplicate │
  │  (Exporters,    │      │ │  │ Blocks  │     │   │     │  Route       │
  │  Applications)  │      │ │  │ (stored)│     │   │     │  Silence     │
  └────────────────┘      │ │  └─────────┘     │   │     └──────┬───────┘
                           │ └─────────────────┘   │            │
  ┌────────────────┐      │ ┌─────────────────┐   │     ┌──────▼───────┐
  │ Pushgateway     │──────▶│ │HTTP API         │   │     │ Notifications│
  │ (Short-lived    │      │ │(query, manage)   │   │     │ (Slack,      │
  │  jobs)          │      │ └─────────────────┘   │     │  Email, etc) │
  └────────────────┘      └───────────────────────┘     └──────────────┘
```

### Core Components

| Component | Role | Port (Default) |
|-----------|------|----------------|
| **Prometheus Server** | Scrapes metrics, stores data, serves queries | 9090 |
| **TSDB** | Time series database built into Prometheus | — |
| **Alertmanager** | Handles alerts (dedup, routing, silencing) | 9093 |
| **Exporters** | Expose third-party metrics as /metrics | Varies |
| **Pushgateway** | Accepts pushes from short-lived jobs | 9091 |
| **Service Discovery** | Dynamically discovers scrape targets | — |
| **Grafana** | Visualization and dashboards | 3000 |

---

## 4.2 The Pull Model in Detail

Prometheus uses a **pull model** — it initiates connections to targets to collect metrics.

### Scrape Lifecycle

```
1. DISCOVERY ──▶ 2. SCRAPE ──▶ 3. STORE ──▶ 4. QUERY
                      │
                      ▼
                5. EVALUATE RULES ──▶ 6. ALERT
```

### Step-by-Step Scrape Process

```
┌──────────────────────────────────────────────────────┐
│                  Scrape Cycle                         │
├──────────────────────────────────────────────────────┤
│                                                       │
│  1. Service Discovery                                 │
│     └─ Prometheus queries SD provider (K8s API,      │
│        file, Consul, etc.) to get target list         │
│                                                       │
│  2. Target Selection                                  │
│     └─ Apply relabel_configs to filter/modify targets │
│        Default: all targets are scraped               │
│                                                       │
│  3. HTTP GET /metrics                                  │
│     └─ Send HTTP request to target_ip:port/metrics    │
│        Timeout configured by scrape_timeout (10s)     │
│                                                       │
│  4. Parse Response                                    │
│     └─ Parse Prometheus text format                    │
│        Validate metric names, labels, types           │
│                                                       │
│  5. Store Samples                                     │
│     └─ Append samples to TSDB (WAL → blocks)          │
│        Each sample: (metric, labels, timestamp, value) │
│                                                       │
│  6. Update Metadata                                   │
│     └─ Update target UP status, scrape duration       │
│        Built-in metrics: up{job, instance}            │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Scrape Configuration

```yaml
# prometheus.yml — scrape configuration
scrape_configs:
  - job_name: 'node'
    scrape_interval: 15s        # How often to scrape (default: 1m)
    scrape_timeout: 10s          # HTTP request timeout (default: 10s)
    metrics_path: /metrics       # Path to scrape (default: /metrics)
    scheme: http                 # http or https
    static_configs:
      - targets: ['localhost:9100']
        labels:
          environment: 'production'
```

### The `up` Metric

For every scrape target, Prometheus generates:

```promql
# 1 if target is reachable (HTTP 200), 0 if not
up{job="node", instance="localhost:9100"} 1
```

This is the **most important metric** for alerting on target health.

### Pull Model Advantages vs Push

| Aspect | Pull (Prometheus) | Push (Graphite, Datadog) |
|--------|------------------|--------------------------|
| **Control** | Server controls scrape rate | Server must handle any rate |
| **Health check** | Built-in (up metric) | Requires heartbeat |
| **Discovery** | Dynamic via SD providers | Targets must know where to push |
| **Security** | Server accesses targets | Targets access server (DDoS risk) |
| **Network** | Targets must be reachable | Targets can be behind NAT |

---

## 4.3 Time Series Data Model

### What is a Time Series?

A **time series** is a stream of timestamped values belonging to the same metric and label set.

```
Time Series = Metric Name + Labels = stream of (timestamp, value) pairs

Example:
http_requests_total{job="api", method="GET", status="200", instance="web-1"}

  (t1, 1024) → (t2, 1056) → (t3, 1089) → ...
```

### Data Model Components

| Component | Description | Example |
|-----------|-------------|---------|
| **Metric name** | What is being measured | `http_requests_total` |
| **Labels** | Key-value pairs identifying dimensions | `{job="api", method="GET"}` |
| **Sample** | Single data point | `(t=123456789, v=1024)` |
| **Timestamp** | When the sample was collected | Unix timestamp in milliseconds |
| **Value** | The actual measurement | Float64 |

### Sample Representation

```text
# Storage format (each line = one sample)
node_cpu_seconds_total{cpu="0",mode="idle"} 28347.53 1710818400
node_cpu_seconds_total{cpu="0",mode="system"} 847.21 1710818400
node_cpu_seconds_total{cpu="1",mode="idle"} 28912.18 1710818400
#          │                    │            │         │
#    metric name              labels       value   timestamp
#                                         (float64)  (int64 ms)
```

### Cardinality Explained

**Cardinality** = number of unique time series for a metric.

```
# Low cardinality (3 time series)
node_cpu_seconds_total{cpu="0", mode="idle"}
node_cpu_seconds_total{cpu="0", mode="user"}
node_cpu_seconds_total{cpu="1", mode="idle"}

# Exploding cardinality ❌
http_request_duration_seconds{user_id="user-001"}  ← unique per user
http_request_duration_seconds{user_id="user-002"}  ← 1M users = 1M time series
http_request_duration_seconds{user_id="user-003"}
```

> **⚠️ Exam Critical:** Cardinality explosion is the #1 cause of Prometheus TSDB crashes. Never use unbounded values (user IDs, email addresses, session IDs) as label values.

---

## 4.4 TSDB Internals

The Prometheus TSDB (Time Series Database) is a custom storage engine optimized for time series data.

### Write Path

```
[Scrape] → [WAL (Write-Ahead Log)]
                       │
                       ▼
                   [Head Block] (in-memory, ~2h)
                       │
                       ▼ (when full)
              ┌────────────────┐
              │ Persisted Block │ (on disk, 2h chunks)
              │  ┌──────────┐   │
              │  │ index    │   │  ── Inverted index for labels
              │  │ chunks   │   │  ── Raw sample data
              │  │ meta.json│   │  ── Metadata
              │  │ tombstones│  │  ── Deletion markers
              │  └──────────┘   │
              └────────────────┘
                       │
                       ▼ (compaction)
              ┌────────────────┐
              │ Larger Blocks   │ (up to 10% of retention)
              │  (merged)      │
              └────────────────┘
```

### TSDB Key Properties

| Property | Description |
|----------|-------------|
| **WAL** | Write-ahead log for crash recovery (writes are durable) |
| **Head block** | In-memory buffer (~2 hours of data) |
| **Persisted blocks** | Immutable, compressed blocks on disk |
| **Compaction** | Merges smaller blocks into larger ones (reduces overhead) |
| **Retention** | Configurable (`--storage.tsdb.retention.time`, default 15d) |
| **Block size** | 2 hours of data per block (configurable) |

### Storage Format

```
/data/
├── 01EM6Q6A1YPX4Z9J3Y3X4Z9J3Y/   ← Block directory (ULID)
│   ├── chunks/
│   │   └── 000001                  ← Raw sample data
│   ├── index                       ← Inverted index
│   ├── meta.json                   ← Block metadata
│   └── tombstones                  ← Deletion markers
├── 01EM6Q6A1YPX4Z9J3Y3X4Z9J3Z/   ← Another block
├── wal/                            ← Write-ahead log
│   ├── 000001.wal
│   └── 000002.wal
└── lock                            ← Prevents multiple instances
```

### Retention Configuration

```bash
# Command line flags
--storage.tsdb.retention.time=15d   # Default: 15 days
--storage.tsdb.retention.size=0    # Max disk size (0 = unlimited)
--storage.tsdb.path="./data"        # Data directory
--storage.tsdb.wal-compression      # Enable WAL compression

# Retention based on time vs size:
# - retention.time: Delete data older than N
# - retention.size: Delete data when total exceeds N bytes
# - Both can be set; first limit reached wins
```

### Compression Efficiency

| Data | Size Before | Size After | Ratio |
|------|-------------|------------|-------|
| Raw samples (1M) | ~32 MB | ~1.5 MB | 20:1 |
| 1000 time series × 30 days | ~8 GB | ~400 MB | 20:1 |
| Labels index | Varies | Very small | Efficient |

---

## 4.5 Prometheus Server Configuration

### Key Command-Line Flags

```bash
# Basic flags
--config.file="prometheus.yml"     # Configuration file
--web.listen-address="0.0.0.0:9090"  # Web UI/API port
--web.external-url=<URL>           # External URL for links

# Storage flags
--storage.tsdb.path="./data"       # Data directory
--storage.tsdb.retention.time=15d  # Retention period
--storage.tsdb.retention.size=0    # Retention size limit
--storage.tsdb.wal-compression     # Compress WAL (recommended)

# Query flags
--query.timeout=2m                 # Query timeout
--query.max-concurrency=20         # Max concurrent queries
--query.max-samples=50000000       # Max samples per query

# Rule flags
--rules.alert.for-outage-tolerance=1h
--rules.alert.for-grace-period=10m
--rules.alert.resend-delay=1m
```

### Key Configuration File Sections

```yaml
# prometheus.yml structure
# 1. Global settings
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'prod-us-east'

# 2. Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

# 3. Rule files
rule_files:
  - "rules/*.yml"

# 4. Scrape configuration
scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

---

## 4.6 Prometheus Components Deep Dive

### Prometheus Server
- **Core responsibilities:** Scraping, storage, querying, rule evaluation
- **Single binary:** Everything in one process
- **Ports:** 9090 (UI + API), also serves `/metrics` for self-monitoring

### Alertmanager
- **Separate binary** that handles alert lifecycle
- **Responsibilities:** Deduplication, grouping, routing, silencing, inhibition
- **Port:** 9093
- **Integrates with:** Slack, PagerDuty, Email, OpsGenie, etc.

### Exporters
- **Purpose:** Translate third-party metrics into Prometheus format
- **How it works:** Exporter exposes `/metrics` endpoint, Prometheus scrapes it
- **No agents needed:** Just run the exporter and add scrape config

### Pushgateway
- **Purpose:** Accept metrics from short-lived/batch jobs
- **Port:** 9091
- **When to use:** Batch jobs, CI/CD pipelines, jobs that finish before next scrape
- **⚠️ Caution:** Not a workaround for firewalls; use for batch jobs only

---

## 4.7 Key Configuration Concepts

### scrape_interval vs evaluation_interval

| Setting | Purpose | Default | Example |
|---------|---------|---------|---------|
| `scrape_interval` | How often to collect metrics | 1m | 15s for high-fidelity data |
| `evaluation_interval` | How often to evaluate rules | 1m | 15s for critical alerts |

```yaml
global:
  scrape_interval: 1m       # Global default
  evaluation_interval: 1m   # Rule evaluation frequency

# Per-job override
scrape_configs:
  - job_name: 'high-freq'
    scrape_interval: 5s     # Override for this job
    scrape_timeout: 3s      # Must be less than scrape_interval
```

### External Labels

```yaml
global:
  external_labels:
    cluster: 'prod-us-east'
    region: 'us-east-1'
    team: 'platform'
```

External labels are added to **every** time series and are especially important when:
- Running multi-cluster deployments
- Using remote write to central storage
- Using Thanos or Cortex for global querying

---

## 🌐 Real-World Scenario: Debugging a Sudden Drop in `up` Metrics

### The Problem

You're on-call and get an alert: "Prometheus target down" — multiple targets show `up == 0`. You need to diagnose the root cause quickly.

### Step 1: Check Global Target Status

```promql
# How many targets are down right now?
count(up == 0) by (job)

# Total targets per job
count(up) by (job)

# Percentage of targets down
(
  count(up == 0) by (job)
  /
  count(up) by (job)
) * 100
```

### Step 2: Identify the Problem Pattern

```promql
# Are all targets in a job down, or just specific ones?
# If all targets in 'node' job are down → scrape config issue
# If specific instances are down → network/infra issue

# Check if it's a specific instance
up{instance="web-1:9100"}

# Check if alerts triggered recently
ALERTS{alertstate="firing"}
```

### Step 3: Check Prometheus Self-Monitoring

```promql
# Is Prometheus itself healthy?
prometheus_tsdb_head_series
prometheus_target_scrapes_total
rate(prometheus_target_scrapes_exceeded_sample_limit_total[5m]) > 0

# Any scrape errors?
rate(prometheus_target_scrapes_exceeded_body_size_limit_total[5m]) > 0
```

### Step 4: Investigate the SD Provider

```promql
# If using Kubernetes SD, check if API server is reachable
prometheus_sd_kubernetes_workqueue_depth  # Queue depth > 0 indicates backlog
rate(prometheus_sd_kubernetes_failures_total[5m]) > 0  # SD failures
```

### Root Cause Diagnosis Walkthrough

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| All targets down in one job | Scrape config error | Check `promtool check config` |
| All targets down across all jobs | Prometheus network issue | Check firewall/DNS |
| One instance down | That target is offline | Restart the target application |
| Intermittent failures | Timeout or resource issues | Increase `scrape_timeout` or resources |
| SD failures increasing | SD provider unreachable | Check Consul/K8s API health |

### Prevention

```yaml
# Alert on any single target being down for >5m
groups:
  - name: target_health
    rules:
      - alert: TargetDown
        expr: up == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Target {{ $labels.instance }} is down"
```

---

## 📝 Exam Tips

1. **Pull model** — Prometheus pulls metrics; targets do not push
2. **TSDB write path:** Scrape → WAL → Head Block → Persisted Blocks → Compaction
3. **`scrape_timeout` must be less than `scrape_interval`**
4. **Cardinality explosion** is the most dangerous Prometheus antipattern
5. **External labels** are added to every metric (useful for multi-cluster)
6. **Alertmanager is separate** — it's not part of the Prometheus server binary
7. **`up` metric** indicates target health (1 = up, 0 = down)
8. **Default retention:** 15 days
9. **Block size:** 2 hours per persisted block

---

## ✅ Chapter 4 Quiz

1. **What port does the Prometheus server listen on by default?**
   - a) 9091
   - b) 9090
   - c) 9093
   - d) 3000

2. **What does the `up` metric indicate?**
   - a) The uptime of the Prometheus server
   - b) 1 if the scrape target is reachable, 0 otherwise
   - c) The number of CPUs in the system
   - d) The total requests served

3. **What is the default retention period for Prometheus TSDB?**
   - a) 7 days
   - b) 15 days
   - c) 30 days
   - d) 90 days

4. **What happens to data in the head block?**
   - a) It is immediately written to disk
   - b) It is stored in memory for ~2 hours, then persisted to a block
   - c) It is sent to remote storage
   - d) It is discarded after evaluation

5. **Which of the following causes cardinality explosion?**
   - a) Adding a `status` label with values "200", "404", "500"
   - b) Adding a `user_id` label with unique values per request
   - c) Adding a `method` label with values "GET", "POST"
   - d) Adding a `job` label with 5 different values

<details>
<summary>📌 Answers</summary>

1. **b** — Prometheus server default port is 9090
2. **b** — `up` is 1 when the target responds with HTTP 200, 0 otherwise
3. **b** — Default retention is 15 days (`--storage.tsdb.retention.time=15d`)
4. **b** — The head block holds ~2 hours of data in memory, then is persisted as a block on disk
5. **b** — `user_id` is unbounded — each unique value creates a new time series, causing cardinality explosion
</details>

---

## 🔗 Related Chapters

- [Chapter 5: Installation & Configuration]({{< relref "05-installation-configuration" >}}) — Setting up Prometheus in production
- [Chapter 6: Data Model & Metric Types]({{< relref "06-data-model-metric-types" >}}) — Understanding metric types and labels
- [Chapter 7: Service Discovery & Scraping]({{< relref "07-service-discovery-scraping" >}}) — How Prometheus finds and scrapes targets
- [Chapter 8: Storage & Retention]({{< relref "08-storage-retention" >}}) — TSDB internals and data lifecycle

## 📚 Additional Resources

- [Prometheus Architecture Documentation](https://prometheus.io/docs/introduction/overview/)
- [Prometheus TSDB Deep Dive](https://prometheus.io/blog/2018/10/15/tsdb-format/)
- [Understanding Prometheus Storage](https://ganeshvernekar.com/blog/prometheus-tsdb-the-design-and-concepts-behind-it/)
- [Prometheus Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)

---

*Continue to → [Chapter 5: Installation & Configuration]({{< relref "05-installation-configuration" >}})*
