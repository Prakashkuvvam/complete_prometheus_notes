---
title: "Chapter 6: Data Model & Metric Types"
weight: 6
bookFlatSection: false
bookToc: true
---

# Chapter 6: Data Model & Metric Types

## 🎯 Learning Objectives

- Understand Prometheus metric types and when to use each
- Master the four core metric types: Counter, Gauge, Histogram, Summary
- Understand metric naming conventions and best practices
- Learn about labels and label best practices
- Understand the difference between Histogram and Summary
- Recognize and prevent cardinality explosions

---

## 6.1 The Four Metric Types

Prometheus has **four core metric types** that cover virtually all monitoring scenarios.

| Type | Can Go Down? | Use Case | Example |
|------|-------------|----------|---------|
| **Counter** | No (only up/ reset) | Cumulative counts | Requests served, errors occurred |
| **Gauge** | Yes (up and down) | Current values | CPU usage, memory, temperature |
| **Histogram** | Yes (buckets) | Distribution of values | Request latency, response sizes |
| **Summary** | Yes (quantiles) | Pre-computed quantiles | Latency p95, request durations |

### The Four Types Visualization

```
Counter:            Gauge:
  5 ┤              100 ┤
  4 ┤               80 ┤╱╲    ╱╲
  3 ┤╱╲    ╱╲       60 ┤  ╲╱  ╲╱╲
  2 ┤  ╲╱  ╲╱       40 ┤        ╲
  1 ┤        ╲      20 ┤
    └───time───▶       └───time───▶
  only up or reset    can go up and down

Histogram:          Summary:
  Count of requests  Pre-computed quantiles
  in buckets:        p50: 0.12s
  0-100ms: 500      p90: 0.35s
  100-200ms: 300    p95: 0.50s
  200-500ms: 150    p99: 0.80s
  500ms+: 50
```

---

## 6.2 Counter

A **Counter** is a cumulative metric that only increases (or resets to zero on restart).

### Characteristics
- Starts at 0, only increases
- Resets when the process restarts
- Cannot decrease
- Used for counting events or volumes

### When to Use Counter

| Good For | Not Good For |
|----------|--------------|
| Request counts | Temperature |
| Error counts | Memory usage |
| Bytes processed | Active connections |
| Tasks completed | Queue length |
| Time spent (in seconds) | Any value that can decrease |

### Counter Examples

```promql
# Total HTTP requests
http_requests_total{job="api", method="GET", status="200"}

# Total errors by type
errors_total{type="database", severity="critical"}

# Bytes sent over network
network_bytes_sent_total{interface="eth0"}

# Tasks processed
jobs_processed_total{queue="main", worker="1"}
```

### Working with Counters

```promql
# Rate of increase per second (most common Counter function)
rate(http_requests_total[5m])

# Total increase over a time window
increase(http_requests_total[1h])

# Check if counter is increasing (liveness)
changes(http_requests_total[5m]) > 0
```

### Counter Reset Handling

Prometheus automatically handles counter resets. When a process restarts and counters go back to zero, Prometheus tracks this correctly:

```promql
# Before restart: http_requests_total = 1000
# After restart:  http_requests_total = 0 (reset)
# rate() handles this correctly:
rate(http_requests_total[5m])  # Shows ~3.33 req/s (assuming constant rate)
```

---

## 6.3 Gauge

A **Gauge** is a metric that can go up or down arbitrarily.

### Characteristics
- Can increase and decrease
- Represents a current value (snapshot)
- No rate calculations needed
- Most natural for resource utilization

### When to Use Gauge

| Good For | Not Good For |
|----------|--------------|
| CPU / Memory usage | Event counters |
| Temperature | Task durations (use Histogram) |
| Queue size | Bytes transferred over time |
| Active connections | Any accumulated value |
| Disk space | Batch job progress |

### Gauge Examples

```promql
# System resources
node_memory_MemAvailable_bytes
node_cpu_seconds_total{mode="idle"}  # Actually a counter, often used as gauge
node_disk_free_bytes{mountpoint="/"}
node_load1  # 1-minute load average

# Application metrics
queue_size{queue="orders"}
active_connections{service="api"}
temperature_celsius{sensor="cpu-0"}

# Prometheus self-monitoring
prometheus_tsdb_head_series       # Current number of series
go_memstats_alloc_bytes           # Go heap usage
```

### Working with Gauges

```promql
# Current value (no aggregation needed)
node_memory_MemAvailable_bytes

# Aggregation across dimensions
avg(node_memory_MemAvailable_bytes) by (instance)

# Difference between current and previous
delta(node_memory_MemAvailable_bytes[5m])

# Rate of change (per second)
deriv(node_memory_MemAvailable_bytes[5m])

# Predict future value
predict_linear(node_disk_free_bytes[1h], 3600)  # Predicted free space in 1 hour

# Clamp values
clamp_min(temperature_celsius, 0)
clamp_max(active_connections, 100)
```

### Common Gauge Patterns

```promql
# Percentage calculation
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Ratio of two gauges
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes

# Checking if gauge exceeds threshold
node_load1 > 2.0
```

---

## 6.4 Histogram

A **Histogram** samples observations and counts them in configurable buckets.

### Characteristics
- Counts observations in pre-defined buckets
- Provides total count and sum of observed values
- Enables server-side quantile calculation
- Most accurate for aggregation across instances

### Histogram Components

When you define a Histogram, Prometheus generates **three time series**:

```promql
# 1. Cumulative counters for each bucket
http_request_duration_seconds_bucket{le="0.1"}    # ≤ 100ms
http_request_duration_seconds_bucket{le="0.25"}   # ≤ 250ms
http_request_duration_seconds_bucket{le="0.5"}    # ≤ 500ms
http_request_duration_seconds_bucket{le="1"}      # ≤ 1s
http_request_duration_seconds_bucket{le="2.5"}    # ≤ 2.5s
http_request_duration_seconds_bucket{le="5"}      # ≤ 5s
http_request_duration_seconds_bucket{le="+Inf"}   # All requests

# 2. Total count of observations
http_request_duration_seconds_count

# 3. Sum of all observed values
http_request_duration_seconds_sum
```

### When to Use Histogram

| Good For | Not Good For |
|----------|--------------|
| Request latency | Exact percentiles needed (client-side) |
| Response sizes | Limited to configured buckets |
| Batch job durations | Values requiring exact individual tracking |
| Any percentile-based SLO | When p99 accuracy is critical |

### Calculating Quantiles from Histograms

```promql
# p50 (median) latency
histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))

# p95 latency (most common SLO target)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# p99 latency (tail latency)
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
```

### Bucket Configuration

```yaml
# Default buckets (in seconds)
buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]

# Custom buckets for specific use cases
buckets: [0.05, 0.1, 0.2, 0.4, 0.8, 1.6, 3.2, 6.4]

# Linear buckets (start, width, count)
buckets: [0, 10, 20, 30, 40, 50]  # For HTTP response sizes in KB

# Fewer buckets (lower precision but less storage)
buckets: [0.1, 0.5, 1, 2, 5]
```

> **⚠️ Exam Critical:** `histogram_quantile()` must ALWAYS be used with `rate()`. The formula is:
> ```
> histogram_quantile(φ, rate(http_bucket[5m]))
> ```

### Histogram Example — Full Pattern

```promql
# Average request duration
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])

# p95 latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Apdex score (Application Performance Index)
# Satisfied: ≤ 0.1s, Tolerating: ≤ 0.5s, Frustrated: > 0.5s
(
  sum(rate(http_request_duration_seconds_bucket{le="0.1"}[5m]))
  +
  sum(rate(http_request_duration_seconds_bucket{le="0.5"}[5m]))
  - sum(rate(http_request_duration_seconds_bucket{le="0.1"}[5m]))
) / 2
/
sum(rate(http_request_duration_seconds_count[5m]))
```

---

## 6.5 Summary

A **Summary** is similar to a Histogram but calculates **quantiles on the client side**.

### Characteristics
- Pre-computes quantiles on the client (application side)
- Cannot be aggregated across instances
- Useful when exact quantiles are needed (not bucket approximations)
- Simpler to query (no `histogram_quantile()` needed)

### Summary Components

When you define a Summary, Prometheus generates:

```promql
# Pre-computed quantiles (from client-side calculation)
rpc_duration_seconds{quantile="0.5"}     # Median
rpc_duration_seconds{quantile="0.9"}     # 90th percentile
rpc_duration_seconds{quantile="0.95"}    # 95th percentile
rpc_duration_seconds{quantile="0.99"}    # 99th percentile

# Total count
rpc_duration_seconds_count

# Sum of all observations
rpc_duration_seconds_sum
```

### When to Use Summary vs Histogram

| Aspect | Histogram | Summary |
|--------|-----------|---------|
| **Aggregation** | ✅ Can aggregate across instances | ❌ Cannot aggregate (only per-instance) |
| **Precision** | Approximate (buckets) | Exact (from client-side algorithm) |
| **Flexibility** | Configurable buckets | Fixed quantiles at creation time |
| **Query** | Must use `histogram_quantile()` | Direct quantile access |
| **Storage** | More time series (buckets + count + sum) | Fewer (quantiles + count + sum) |
| **Use case** | Need aggregated percentiles | Need exact, non-aggregated percentiles |

### When to Choose Histogram Over Summary

```
Need aggregated percentiles?
│
├─ YES → Histogram
│   (e.g., "What's the p95 latency across all instances?")
│
└─ NO → Summary
    (e.g., "What's the exact p99 on this specific instance?")
```

> **⚠️ Exam Critical:** Histograms can be aggregated using `histogram_quantile()`; Summaries cannot be aggregated across instances.

---

## 6.6 Metric Naming Conventions

### Naming Rules

```
metric_name: Must match regex [a-zA-Z_:][a-zA-Z0-9_:]*
label_name:  Must match regex [a-zA-Z_][a-zA-Z0-9_]*
```

### Best Practices

```promql
# ✅ Good naming
http_requests_total{method="GET", status="200"}
node_cpu_seconds_total{cpu="0", mode="user"}
prometheus_tsdb_head_series

# ❌ Bad naming
HttpRequests  (CamelCase — use snake_case)
Http_Requests (mixed case)
requests/sec   (contains "/" — invalid)
1st_request   (starts with number)
```

### Convention: Metric Suffixes

| Base Unit | Suffix | Example |
|-----------|--------|---------|
| **seconds** | `_seconds` | `http_request_duration_seconds` |
| **bytes** | `_bytes` | `node_memory_MemFree_bytes` |
| **count** | `_total` (counter) | `http_requests_total` |
| **ratio** | `_ratio` | `node_cpu_seconds_total{mode="idle"}` |
| **info** | `_info` | `build_info{version="2.53.0"}` |

### Counter Naming Pattern

```promql
# Counter: <metric_name>_total
http_requests_total
errors_total
jobs_completed_total

# When using rate(), strip _total in display
rate(http_requests_total[5m]) → "HTTP Requests/s"
```

### Unit Conventions

```promql
# Time: always in seconds
http_request_duration_seconds     # ✅
http_request_duration_ms          # ❌ Don't, convert to seconds
http_request_duration_millisec    # ❌

# Data: always in bytes
node_memory_MemFree_bytes         # ✅
node_memory_MemFree_megabytes     # ❌

# Counters: always use _total suffix
http_requests_total               # ✅
http_requests                     # ❌
```

---

## 6.7 Labels — The Key to Multi-Dimensional Monitoring

### What Labels Do

Labels add **dimensions** to metrics, allowing you to slice and aggregate data:

```promql
# Without labels: single time series
cpu_usage 85

# With labels: 8 time series, filterable
cpu_usage{host="web-1", core="0", type="user"}   85
cpu_usage{host="web-1", core="0", type="system"} 12
cpu_usage{host="web-1", core="1", type="user"}   65
cpu_usage{host="web-1", core="1", type="system"} 8
cpu_usage{host="web-2", core="0", type="user"}   90
cpu_usage{host="web-2", core="0", type="system"} 15
cpu_usage{host="web-2", core="1", type="user"}   45
cpu_usage{host="web-2", core="1", type="system"} 5
```

### Label Naming Conventions

```promql
# ✅ Good labels
job          # The configured job name
instance     # The scraped target (host:port)
method       # HTTP method (GET, POST)
status       # HTTP status code
environment  # prod, staging, dev
service      # Service name
version      # Software version

# ❌ Bad labels
user_id      # High cardinality (unique per user)
session_id   # High cardinality (unique per session)
email        # High cardinality + PII
timestamp    # Not useful as a label
ip_address   # High cardinality

# Convention: Use lowercase with underscores
method: "GET"     # ✅
method: "get"     # ✅
Method: "GET"     # ❌
HTTP_Method: GET  # ❌
```

### Label Cardinality — The Critical Concept

```promql
# LOW cardinality (GOOD) — bounded values
http_requests_total{method="GET", status="200"}
# methods: GET, POST, PUT, DELETE (4 values)
# status: 200, 201, 400, 404, 500 (10 values)
# Total time series: 4 × 10 = 40 ← manageable

# HIGH cardinality (BAD) — unbounded values
api_latency_seconds{user_id="user-123", session_id="abc-xyz"}
# user_id: 1,000,000+ unique values
# Total time series: 1,000,000+ ← Explosion!
```

---

## 6.8 Type Mixing Anti-Patterns

### ❌ Using a Counter as a Gauge

```promql
# ❌ Wrong: rate() should be applied to counters displayed over time
up  # up is actually a gauge (0 or 1), but it's not a counter

# ✅ Right: Check if up metric has changed
changes(up[5m]) > 0
```

### ❌ Using a Gauge for a Counter

```promql
# ❌ Wrong: rate() on a gauge makes no sense
rate(active_connections[5m])  # Gauge can increase and decrease

# ✅ Right: Gauge shows snapshot value
active_connections
```

### ❌ Using Histogram for Exact Values

```promql
# ❌ Wrong: histograms approximate, don't use for exact counting
# ❌ Wrong: histogram_quantile without rate
histogram_quantile(0.95, http_request_duration_seconds_bucket)

# ✅ Right: rate() is required before histogram_quantile
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

---

## 🌐 Real-World Scenario: Metric Type Selection Guide

### The Scenario

You're instrumenting a new payment processing service. Here's how to choose the right metric type for each signal.

### Payment Service Metrics

```python
# Counter: Total transactions processed (only increases)
payments_processed_total{status="success"}
payments_processed_total{status="failed"}

# Counter: Total amount processed
payments_amount_total{currency="USD"}

# Gauge: Currently pending payments (can go up/down)
payments_pending_count

# Gauge: Available payment gateway balance
payment_gateway_balance{gateway="stripe"}

# Histogram: Transaction latency distribution
payment_processing_duration_seconds  # For p95/p99 latency SLOs

# Summary: Gateway response times (exact quantile per instance)
payment_gateway_response_seconds{quantile="0.95"}
```

### Step-by-Step Decision Flow

```
What are you measuring?
│
├─ A count of events?
│  ├─ Can only increase → Counter
│  │  Example: Total requests, errors, bytes sent
│  └─ Can increase and decrease → Gauge
│     Example: Active transactions, queue depth
│
├─ A current value/snapshot?
│  └─ Gauge
│     Example: CPU usage, memory, temperature, balance
│
├─ A distribution of values?
│  ├─ Need aggregated percentiles (p95 across all instances)?
│  │  └─ Histogram
│  │     Example: Request latency for SLO tracking
│  └─ Need exact per-instance quantiles?
│     └─ Summary
│        Example: Per-container memory usage percentiles
└─ A duration/time?
   └─ Histogram (almost always)
      Example: API response time, DB query time, job duration
```

### Common Mistakes with This Scenario

```python
# ❌ Wrong: Using a counter for pending transactions
# Pending count goes up AND down — this is a gauge
payments_pending_total  # Counter will break when pending decreases

# ✅ Right: Gauge for pending count
payments_pending{status="pending"}  # Gauge, can go up and down

# ❌ Wrong: Using a gauge for total processed (resets on restart?)
payments_processed  # Gauge — will show wrong rate on restart

# ✅ Right: Counter for cumulative totals
payments_processed_total  # Counter — rate() handles resets

# ❌ Wrong: Using Summary for cross-instance p95
# Summaries from different instances CANNOT be aggregated

# ✅ Right: Histogram for p95 across all instances
histogram_quantile(0.95, rate(payment_processing_duration_seconds_bucket[5m]))
```

### Practical Query Examples

```promql
# Transaction success rate (last 5 minutes)
rate(payments_processed_total{status="success"}[5m])
/
rate(payments_processed_total[5m])

# P95 payment processing latency
histogram_quantile(0.95,
  rate(payment_processing_duration_seconds_bucket[5m])
)

# Payment gateway balance remaining
payment_gateway_balance{gateway="stripe"}

# Active vs total payment gateways
count(payment_gateway_balance > 1000) / count(payment_gateway_balance)
```

---

## 📝 Exam Tips

1. **Four metric types:** Counter, Gauge, Histogram, Summary
2. **Counter** = only increases (use `rate()` or `increase()`)
3. **Gauge** = up and down (direct value access)
4. **Histogram** = bucketed observations (`histogram_quantile()` with `rate()`)
5. **Summary** = pre-computed quantiles (cannot aggregate)
6. **`histogram_quantile()` MUST be used with `rate()`** — never on raw buckets
7. **Cardinality explosion** is the #1 TSDB killer — never use unbounded label values
8. **Histograms can be aggregated; Summaries cannot** — critical distinction
9. **Metric naming:** snake_case, units in suffix (seconds, bytes, total)
10. **`_total` suffix** for counters (stripped when displayed as rate)

---

## ✅ Chapter 6 Quiz

1. **Which metric type should you use for tracking CPU temperature?**
   - a) Counter
   - b) Gauge
   - c) Histogram
   - d) Summary

2. **Which function must always be used with `histogram_quantile()`?**
   - a) `increase()`
   - b) `rate()`
   - c) `avg()`
   - d) `delta()`

3. **What happens when you aggregate a Summary across instances?**
   - a) It works correctly
   - b) It gives an approximate percentile
   - c) It gives incorrect results (Summary cannot be aggregated)
   - d) It doubles the values

4. **Which of the following would cause cardinality explosion?**
   - a) `http_requests_total{method="GET"}`
   - b) `http_requests_total{user_id="abc-123"}`
   - c) `cpu_usage{core="0"}`
   - d) `disk_free{mountpoint="/"}`

5. **Which suffix is used for counters in Prometheus?**
   - a) `_count`
   - b) `_counter`
   - c) `_total`
   - d) `_sum`

<details>
<summary>📌 Answers</summary>

1. **b** — Gauge, because temperature can go up and down
2. **b** — `rate()` must always wrap the histogram buckets before `histogram_quantile()`
3. **c** — Summaries calculate quantiles client-side and cannot be aggregated server-side
4. **b** — `user_id` is unbounded (each unique user creates a new time series)
5. **c** — Counters use the `_total` suffix (e.g., `http_requests_total`)
</details>

---

## 🔗 Related Chapters

- [Chapter 4: Prometheus Architecture & Core Concepts]({{< relref "04-prometheus-architecture" >}}) — Understanding the TSDB that stores these metric types
- [Chapter 9: PromQL Basics]({{< relref "09-promql-basics" >}}) — Querying metrics with PromQL
- [Chapter 14: Client Libraries & Instrumentation]({{< relref "14-client-libraries-instrumentation" >}}) — Implementing metric types in code

## 📚 Additional Resources

- [Prometheus Metric Types](https://prometheus.io/docs/concepts/metric_types/)
- [Prometheus Naming Best Practices](https://prometheus.io/docs/practices/naming/)
- [Histograms and Summaries](https://prometheus.io/docs/practices/histograms/)
- [Cardinality Best Practices](https://prometheus.io/docs/practices/instrumentation/#counter-vs-gauge-cumulative-vs-pending)

---

*Continue to → [Chapter 7: Service Discovery & Scraping]({{< relref "07-service-discovery-scraping" >}})*
