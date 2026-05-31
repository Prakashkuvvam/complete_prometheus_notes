---
title: "PromQL Query Patterns"
weight: 1
bookToc: true
---

# PromQL Query Patterns

> 40+ categorized PromQL queries organized by use case. Each query includes an explanation.

---

## 🔵 CPU Monitoring

```promql
# CPU utilisation per instance (percentage)
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# CPU utilisation per mode
sum by (mode) (rate(node_cpu_seconds_total[5m]))

# CPU load per CPU core
node_load1 / count(node_cpu_seconds_total{mode="idle"}) by (instance)

# Top 5 most CPU-intensive instances
topk(5, avg by (instance) (rate(node_cpu_seconds_total{mode!="idle"}[5m])))

# CPU steal time (virtualized environments)
rate(node_cpu_seconds_total{mode="steal"}[5m])
```

---

## 🟢 Memory Monitoring

```promql
# Memory utilisation (percentage)
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100

# Available memory in MiB
node_memory_MemAvailable_bytes / 1024 / 1024

# Memory used by application vs cache
node_memory_MemTotal_bytes - node_memory_MemFree_bytes - node_memory_Buffers_bytes - node_memory_Cached_bytes

# Swap usage
node_memory_SwapTotal_bytes - node_memory_SwapFree_bytes
```

---

## 🟠 Disk Monitoring

```promql
# Disk space usage per mountpoint (percentage)
100 - (node_filesystem_free_bytes{mountpoint!=""} / node_filesystem_size_bytes{mountpoint!=""} * 100)

# Disk I/O read/write rate
rate(node_disk_read_bytes_total[5m])
rate(node_disk_written_bytes_total[5m])

# Disk I/O operations per second (IOPS)
rate(node_disk_reads_completed_total[5m])
rate(node_disk_writes_completed_total[5m])

# Disk space prediction (will fill in N days)
predict_linear(node_filesystem_free_bytes{mountpoint="/"}[7d], 7*86400)

# Top 5 disks by I/O
topk(5, rate(node_disk_io_time_seconds_total[5m]))
```

---

## 🔴 Network Monitoring

```promql
# Network bytes in/out per second
rate(node_network_receive_bytes_total[5m])
rate(node_network_transmit_bytes_total[5m])

# Network errors per second
rate(node_network_receive_errors_total[5m])
rate(node_network_transmit_errors_total[5m])

# Network packets dropped
rate(node_network_receive_drop_total[5m])
rate(node_network_transmit_drop_total[5m])

# Total bandwidth utilisation by interface
sum by (device) (rate(node_network_receive_bytes_total[5m]) + rate(node_network_transmit_bytes_total[5m]))
```

---

## 🟣 Application Monitoring

```promql
# Request rate per second
sum by (endpoint) (rate(http_requests_total[5m]))

# Error rate (5xx) percentage
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100

# Request latency (p50, p95, p99)
histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))

# Slowest endpoints (p95 > 1s)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1.0

# Active users / connections
http_requests_in_progress

# Success rate (proportion of successful requests)
sum(rate(http_requests_total{status!~"5.."}[5m])) / sum(rate(http_requests_total[5m]))
```

---

## 🟡 Prometheus Self-Monitoring

```promql
# Scrape duration per target
scrape_duration_seconds

# Samples scraped per target
scrape_samples_scraped

# Number of targets up per job
count by (job) (up == 1)

# Number of targets down per job
count by (job) (up == 0)

# Prometheus memory usage
process_resident_memory_bytes

# Prometheus CPU usage
rate(process_cpu_seconds_total[5m])

# Slow queries (duration > 1s)
prometheus_engine_query_duration_seconds{slice="inner_eval"} > 1.0

# Active queries
prometheus_engine_queries
```

---

## 🟤 Aggregation Patterns

```promql
# Sum by a label
sum by (job) (rate(http_requests_total[5m]))

# Average by multiple labels
avg by (job, instance) (rate(node_cpu_seconds_total[5m]))

# Count of series (cardinality check)
count(node_cpu_seconds_total)

# Count of distinct label values
count(count by (instance) (node_cpu_seconds_total))

# Group by without aggregation (returns 1 per series)
group by (job) (up)

# Quantile across series
quantile(0.95, rate(http_request_duration_seconds_count[5m]))
```

---

## ⚪ Binary Operators

```promql
# Arithmetic
memory_usage_bytes / memory_total_bytes * 100   # Percentage
requests_total / duration_seconds                 # Rate (manually)

# Comparison (returns 0 or 1)
cpu_usage > 0.8                                   # 1 if > 80%, 0 otherwise

# Comparison with bool modifier
cpu_usage > bool 0.8                              # Explicit boolean output

# Logical/set
up{job="api"} or up{job="web"}                    # Union of two vectors
up{job="api"} and up{job="web"}                   # Intersection (same labels)
up{job="api"} unless up{job="web"}                # Subtraction (series only in api)
```

---

## 🔵 Rate Functions Comparison

```promql
# rate() — average per-second rate over a window (smoothed)
rate(counter_metric[5m])

# irate() — instant rate using last 2 samples (more volatile)
irate(counter_metric[5m])

# increase() — total increase over the window
increase(counter_metric[5m])

# delta() — difference for gauges over a window
delta(gauge_metric[5m])

# deriv() — per-second derivative for gauges (linear regression)
deriv(gauge_metric[5m])

# idelta() — instant delta using last 2 samples
idelta(gauge_metric[5m])
```

---

## 🟢 Over-Time Functions

```promql
# Average over time (smoothed gauge)
avg_over_time(node_load1[15m])

# Max over time (peak value)
max_over_time(node_load1[1h])

# Min over time (trough value)
min_over_time(node_load1[1h])

# Sum over time (total value)
sum_over_time(node_load1[1h])

# Count over time (number of samples)
count_over_time(node_load1[1h])

# Quantile over time
quantile_over_time(0.95, node_load1[1h])

# Standard deviation over time
stddev_over_time(node_load1[1h])

# Standard variance over time
stdvar_over_time(node_load1[1h])
```

---

## 🟠 Vector Matching

```promql
# One-to-one (default — labels match)
node_memory_MemFree_bytes / node_memory_MemTotal_bytes

# One-to-one with on() — match on specific labels only
node_memory_MemFree_bytes / on(instance) node_memory_MemTotal_bytes

# One-to-one with ignoring() — ignore specific labels
metric_a / ignoring(status) metric_b

# Many-to-one with group_left
rate(http_requests_total[5m]) / on(job) group_left group:http_requests_count

# Many-to-one with group_right
threshold_info * on(job) group_right rate(http_requests_total[5m])
```

---

## ⚪ Histogram & Summary

```promql
# P95 latency from histogram (using rate — correct for dashboards)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Percentage of requests under a threshold (SLI)
sum(rate(http_request_duration_seconds_bucket{le="0.5"}[5m]))
/
sum(rate(http_request_duration_seconds_count[5m]))

# Count of requests
rate(http_request_duration_seconds_count[5m])

# Average request duration from histogram
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])

# Summary quantile (can't be aggregated across instances)
http_request_duration_seconds{quantile="0.95"}
```

---

## 🔴 Recording Rule Patterns

```promql
# Pre-computed CPU utilisation
record: instance:node_cpu_utilisation:rate5m
expr: 1 - rate(node_cpu_seconds_total{mode="idle"}[5m])

# Pre-computed memory utilisation
record: instance:node_memory_utilisation:ratio
expr: 1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes

# Pre-computed error ratio
record: job:http_errors:rate5m
expr: sum(rate(http_requests_total{status=~"5.."}[5m])) by (job)

# Pre-computed latency p99
record: instance:http_request_latency:p99_5m
expr: histogram_quantile(0.99, sum by (instance, le) (rate(http_request_duration_seconds_bucket[5m])))
```

---

## 🟣 Subqueries

```promql
# Average CPU over 1h with 5m resolution (subquery)
avg_over_time(rate(node_cpu_seconds_total[5m])[1h:5m])

# Max request rate over last 24h with 1h intervals
max_over_time(rate(http_requests_total[5m])[24h:1h])

# Subquery for anomaly detection (current vs last week)
rate(http_requests_total[5m]) / avg_over_time(rate(http_requests_total[5m])[1h:5m])
```

---

## 🟤 Useful Utility Queries

```promql
# How long has a target been up?
time() - process_start_time_seconds{job="prometheus"}

# Detect metric staleness
absent(node_load1) == 1                           # 1 if metric is missing

# Count of times series per metric (cardinality check)
count by (__name__) ({__name__=~".+"})

# Label cardinality check (count distinct values)
count(count by (instance) (node_cpu_seconds_total))

# Time since last successful scrape
time() - prometheus_last_successful_scrape_time{job="node_exporter"}

# Percentage of time a condition was true over 1h
avg_over_time((cpu_usage > 0.8)[1h:15s]) * 100
```

---

## 📝 PCA Exam Quick Reference

| Pattern | Query | Used For |
|---------|-------|----------|
| Rate | `rate(counter[5m])` | Per-second average of counters |
| Increase | `increase(counter[1h])` | Total increase over 1h |
| Percentage | `(a / b) * 100` | CPU, memory, disk utilisation |
| Latency (p95) | `histogram_quantile(0.95, rate(bucket[5m]))` | Request latency SLOs |
| Error ratio | `sum(rate(errors[5m])) / sum(rate(total[5m]))` | Error budget tracking |
| Availability | `avg(up)` | Target availability |
| Smoothed | `avg_over_time(gauge[15m])` | Noise reduction |
| Historical | `metric offset 1w` | Week-over-week comparison |
| Prediction | `predict_linear(metric[7d], 86400)` | Capacity planning |
