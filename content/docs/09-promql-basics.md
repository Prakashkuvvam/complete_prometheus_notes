---
title: "Chapter 9: PromQL Basics"
weight: 9
bookFlatSection: false
bookToc: true
---

# Chapter 9: PromQL Basics

## 🎯 Learning Objectives

- Understand PromQL data types: instant vector, range vector, scalar, string
- Master metric selectors and label matchers
- Learn instant and range vector queries
- Understand offset modifier for historical queries
- Learn about the `@` modifier for querying at specific timestamps

---

## 9.1 PromQL Data Types

PromQL has **four data types** that every query operates on:

| Type | Description | Example |
|------|-------------|---------|
| **Instant Vector** | Set of time series with a single sample per series at the same timestamp | `node_load1` |
| **Range Vector** | Set of time series with a range of samples per series over time | `node_load1[5m]` |
| **Scalar** | A single numeric value | `1`, `3.14`, `42` |
| **String** | A string value (rarely used) | `"hello"` |

### Instant Vector

An **instant vector** is the most common PromQL result. It returns the **latest value** for each matching time series at the query timestamp.

```
Query: node_load1

Result (at query time t):
node_load1{instance="web-1", job="node"}  1.25
node_load1{instance="web-2", job="node"}  0.85
node_load1{instance="db-1", job="node"}   2.10
```

Each result has:
- A set of labels (identifying the time series)
- A single sample value (the latest value)
- A timestamp

### Range Vector

A **range vector** returns a range of samples over a time window for each matching time series.

```
Query: node_load1[5m]

Result:
node_load1{instance="web-1", job="node"}
  → (t-5m, 1.10) → (t-4m, 1.15) → (t-3m, 1.20) → (t-2m, 1.25) → (t-1m, 1.25) → (t, 1.25)

node_load1{instance="web-2", job="node"}
  → (t-5m, 0.90) → (t-4m, 0.88) → (t-3m, 0.85) → (t-2m, 0.85) → (t-1m, 0.85) → (t, 0.85)
```

**Range vectors cannot be displayed directly** in graphs or used in binary expressions — they must first be processed with range functions like `rate()`, `increase()`, `avg_over_time()`, etc.

### Key Distinction

```promql
# Instant vector — CAN be graphed directly
node_load1

# Range vector — MUST use a function first
rate(http_requests_total[5m])   # ✅ rate() converts range to instant
http_requests_total[5m]          # ❌ Cannot graph raw range vector
```

---

## 9.2 Selectors and Label Matchers

### Metric Name Selector

The simplest selector — just the metric name:

```promql
# Returns all time series with this metric name
node_cpu_seconds_total
prometheus_http_requests_total
```

### Label Matchers

Filter time series by label values:

| Matcher | Meaning | Example | Matches |
|---------|---------|---------|---------|
| `=` | Equals | `job="node"` | Exactly "node" |
| `!=` | Not equals | `job!="node"` | Everything except "node" |
| `=~` | Regex matches | `job=~"node|api"` | "node" or "api" |
| `!~` | Regex not matches | `job!~"dev.*"` | Not matching "dev.*" |

### Selector Examples

```promql
# Single label matcher
node_cpu_seconds_total{cpu="0"}

# Multiple label matchers (AND logic — all must match)
node_cpu_seconds_total{cpu="0", mode="idle"}

# Not equals
node_cpu_seconds_total{mode!="idle"}

# Regex match (contains "user" or "system")
node_cpu_seconds_total{mode=~"user|system"}

# Regex not match (exclude idle and iowait)
node_cpu_seconds_total{mode!~"idle|iowait"}

# Match any metric with a specific label
{job="node"}

# Match any metric with multiple labels
{job="node", instance="localhost:9100"}

# Match metric by pattern (using regex on __name__)
{__name__=~"node_.*", job="node"}
```

### Important Selector Rules

| Rule | Example | Why |
|------|---------|-----|
| **Empty selector matches nothing** | `{job=""}` | Matches series with empty job label |
| **Missing selector matches all** | `{job!=""}` | Matches series with any job label |
| **Regex is anchored** | `mode=~"user"` | Same as `mode=~"^user$"` |
| **Multiple matchers are ANDed** | `{a="1", b="2"}` | Must match BOTH a=1 AND b=2 |

---

## 9.3 Instant Vector Queries

### Basic Instant Queries

```promql
# All CPU metrics
node_cpu_seconds_total

# CPU metrics for idle mode only
node_cpu_seconds_total{mode="idle"}

# CPU metrics for cpu 0 across all modes
node_cpu_seconds_total{cpu="0"}

# Multiple label filters
node_cpu_seconds_total{cpu="0", mode="idle"}
```

### Query with Multiple Time Series

```promql
# Returns one value per matching series
node_memory_MemTotal_bytes
# node_memory_MemTotal_bytes{instance="server-1"} 17179869184
# node_memory_MemTotal_bytes{instance="server-2"} 17179869184
```

### Arithmetic in Instant Queries

```promql
# Memory utilization percentage
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100

# Free disk space as percentage
node_disk_free_bytes / node_disk_total_bytes * 100

# Load per CPU
node_load1 / count(node_cpu_seconds_total{mode="idle"}) by (instance)
```

### Boolean Expressions

```promql
# Returns 1 if condition is true, 0 if false
node_load1 > 2.0

# Filter to only show values > threshold
node_load1 > bool 2.0
```

---

## 9.4 Range Vector Queries

### Range Vector Syntax

```promql
# Syntax: <metric_selector>[<duration>]
node_load1[5m]       # Last 5 minutes of data
node_load1[1h]       # Last 1 hour of data
node_load1[1d]       # Last 24 hours of data (be careful with large ranges)
```

### Time Durations

| Duration | Meaning | Shorthand |
|----------|---------|-----------|
| `ms` | Milliseconds | `500ms` |
| `s` | Seconds | `30s`, `5m` |
| `m` | Minutes | `5m`, `30m` |
| `h` | Hours | `1h`, `6h` |
| `d` | Days | `1d`, `7d` |
| `w` | Weeks | `1w`, `2w` |
| `y` | Years | `1y` |

### Range Vectors with Functions

Range vectors are almost always used with functions:

```promql
# Rate of increase per second (counters)
rate(http_requests_total[5m])

# Total increase over window (counters)
increase(http_requests_total[1h])

# Average value over time (gauges)
avg_over_time(node_load1[15m])

# Max value over time
max_over_time(node_load1[5m])

# Min value over time
min_over_time(node_load1[5m])

# Standard deviation
stddev_over_time(node_load1[5m])

# Quantile over time
quantile_over_time(0.95, node_load1[5m])
```

---

## 9.5 Literal Values

### Scalar Literals

```promql
# Integer
42

# Float
3.14159

# Scientific notation
1.5e3    # 1500
1.5e-3   # 0.0015
```

### String Literals

```promql
# Double-quoted string
"hello prometheus"

# Backtick (raw string) — no escape processing
`C:\path\to\file`

# Concatenation (not supported)
# "hello" + " world" ✗ Does NOT work in PromQL
```

---

## 9.6 Offsetting Time

### The `offset` Modifier

The `offset` modifier shifts a query's time window backward:

```promql
# Current value
node_load1

# Value 1 hour ago
node_load1 offset 1h

# Value 7 days ago (for week-over-week comparison)
node_load1 offset 7d

# Rate from 1 hour ago
rate(http_requests_total[5m]) offset 1h
```

### Use Cases for Offset

```promql
# Week-over-week comparison
rate(http_requests_total[5m]) - rate(http_requests_total[5m]) offset 1w

# Day-over-day comparison
rate(http_requests_total[5m]) - rate(http_requests_total[5m]) offset 1d

# YoY comparison
rate(http_requests_total[5m]) - rate(http_requests_total[5m]) offset 1y

# Anomaly detection (compare current to same time last week)
rate(http_requests_total[5m]) / rate(http_requests_total[5m]) offset 1w > 1.5
```

### Offset with Range Vectors

```promql
# 5-minute rate from 1 hour ago
rate(http_requests_total[5m] offset 1h)

# This shifts the ENTIRE query window backward
# ──► Queries the range [t-1h-5m, t-1h]
```

---

## 9.7 The `@` Modifier (Terraform 2.40+)

The `@` modifier queries at an **absolute timestamp**:

```promql
# Value at specific Unix timestamp
node_load1 @ 1710818400

# Rate at specific timestamp
rate(http_requests_total[5m]) @ 1710818400

# Offset and @ can be combined (rare)
node_load1 @ 1710818400 offset 1h
```

### Practical Use Cases

```promql
# Query at the time of an incident for comparison
# Use the incident timestamp from your incident management tool
rate(errors_total[5m]) @ 1710818400

# Can be used for reproducible queries
# Return the same result regardless of when the query is executed
```

---

## 9.8 Common Query Patterns

### Basic Patterns

```promql
# Pattern 1: Current value
node_load1

# Pattern 2: Rate over time (for counters)
rate(http_requests_total[5m])

# Pattern 3: Total increase
increase(errors_total[1h])

# Pattern 4: Percentage
(node_memory_MemFree_bytes / node_memory_MemTotal_bytes) * 100

# Pattern 5: Comparison across instances
node_load1 > 2

# Pattern 6: Difference over time
node_load1 - node_load1 offset 5m

# Pattern 7: Aggregation
avg(node_load1) by (instance)
```

### Filtering Patterns

```promql
# Only show jobs matching regex
{job=~"api|web|worker"}

# Exclude specific instances
up{instance!="localhost:9090"}

# Only metrics with specific prefix
{__name__=~"node_cpu_.*"}

# Complex filtering
node_cpu_seconds_total{mode=~"^(user|system|nice)$", cpu!="1"}
```

---

## 9.9 Common Mistakes

### ❌ Range Vector in Graphs

```promql
# ❌ Wrong: Can't graph a range vector directly
node_load1[5m]

# ✅ Right: Use a function on the range vector
avg_over_time(node_load1[5m])
```

### ❌ Case Sensitivity

```promql
# ❌ Wrong: Labels are case-sensitive
node_load1{Job="node"}  # "Job" ≠ "job"

# ✅ Right: Correct case
node_load1{job="node"}
```

### ❌ Regex Anchoring

```promql
# ❌ Wrong: This means "starts with node_ AND ends with node_cpu"
{__name__=~"node_cpu_.*"}  # ✅ This works (anchored internally)

# Actually: PromQL anchors regex to BOTH start and end
# So __name__=~"cpu" matches ONLY metrics named exactly "cpu"
{__name__=~".*cpu.*"}  # Contains "cpu" anywhere in the name
```

### ❌ Selector Default

```promql
# ❌ Wrong: Bare metric with no labels returns ALL series
http_requests_total

# ✅ Add specific labels to narrow results
http_requests_total{job="api", method="GET"}
```

---

## 🌐 Real-World Scenario: Debugging a Slow Dashboard with PromQL

### The Problem

Your team's Grafana dashboard is loading very slowly. Users are complaining it takes 10+ seconds to refresh. You suspect a PromQL query is the culprit.

### Step 1: Identify Expensive Queries

Check which queries are taking the most time:

```promql
# Prometheus self-monitoring — slow queries
prometheus_engine_query_duration_seconds{slice="inner_eval"}

# Check query queue length
prometheus_engine_queries_concurrent_max

# Top 10 slowest query durations (if you have custom query logging)
sort_desc(prometheus_engine_query_duration_seconds_sum / prometheus_engine_query_duration_seconds_count)
```

### Step 2: Profile the Suspect Query

```promql
# Expensive query — querying raw high-cardinality data without aggregation
# ❌ Bad: Returns thousands of time series
node_network_receive_bytes_total

# ✅ Good: Aggregated with rate() and sum
sum by (instance) (rate(node_network_receive_bytes_total[5m]))
```

### Step 3: The Range Vector Trap

```promql
# ❌ This query is extremely expensive on large time ranges:
# It loads ALL samples for ALL series into memory
quantile_over_time(0.95, 
  rate(http_request_duration_seconds_bucket[5m])[30d:1m]
)

# ✅ Better: Use a recording rule
# Record: instance:http_latency:p95_5m
# Then query: instance:http_latency:p95_5m
```

### Step 4: Fix the Dashboard

| Problem Query | Fixed Query | Improvement |
|--------------|-------------|-------------|
| `node_memory_MemTotal_bytes` | `avg by(instance)(node_memory_MemTotal_bytes)` | Groups duplicates |
| `rate(x[1m])` on 1000 series | `sum by(job)(rate(x[5m]))` | Wider range, aggregation |
| Raw `_bucket` metrics | `histogram_quantile(0.95, rate(_bucket[5m]))` | Only compute quantiles |
| Every panel queries raw data | Use recording rules | Pre-computed |

### Key Takeaway

```promql
# Always ask: "How many time series does this query touch?"
# Rule of thumb:
# < 1000 series: fine
# 1000-10000: use aggregation or recording rules
# > 10000: definitely use recording rules
```

---

## 📝 Exam Tips

1. **Four data types:** Instant Vector, Range Vector, Scalar, String
2. **Instant Vector** = latest value per series (can graph directly)
3. **Range Vector** = range of values over time (must use functions like `rate()`)
4. **Label matchers:** `=` exact, `!=` not, `=~` regex, `!~` not regex
5. **Multiple matchers = AND** (all conditions must match)
6. **Regex is anchored** — `mode=~"user"` means `^user$`
7. **`offset`** shifts query backward in time
8. **`@`** queries at absolute timestamp
9. **Range vector functions:** `rate()`, `increase()`, `avg_over_time()`, etc.
10. **`[5m]`** is the range duration for range vectors

---

## ✅ Chapter 9 Quiz

1. **Which PromQL data type returns a set of time series with a single sample per series at the same timestamp?**
   - a) Scalar
   - b) Instant Vector
   - c) Range Vector
   - d) String

2. **What does `node_load1 offset 1h` return?**
   - a) The value of node_load1 1 hour in the future
   - b) The value of node_load1 from 1 hour ago
   - c) The average of node_load1 over the last hour
   - d) The difference between current and 1 hour ago

3. **Which label matcher matches a regex pattern?**
   - a) `=`
   - b) `!=`
   - c) `=~`
   - d) `!~`

4. **True or False: Range vectors can be displayed directly in a graph.**
   - a) True
   - b) False

5. **What does `{__name__=~"node_.*"}` do?**
   - a) Selects all metrics with exactly "node_" in the name
   - b) Selects all metrics whose name matches the regex "node_.*"
   - c) Selects all metrics with a label called "node_"
   - d) Selects all metrics from the "node" job

<details>
<summary>📌 Answers</summary>

1. **b** — Instant Vector returns the latest value for each matching time series at the query time
2. **b** — `offset 1h` shifts the query backward: it returns the value from 1 hour ago
3. **c** — `=~` is the regex match operator
4. **b** — False. Range vectors must be processed with functions like `rate()` or `avg_over_time()` first
5. **b** — `{__name__=~"node_.*"}` selects all metrics whose name starts with "node_"
</details>

---

## 🔗 Related Chapters

- [Chapter 10: PromQL Operators]({{< relref "10-promql-operators" >}}) — Arithmetic, comparison & logical operators
- [Chapter 11: PromQL Functions]({{< relref "11-promql-functions" >}}) — rate(), increase(), histogram_quantile() & more
- [Chapter 12: Advanced PromQL]({{< relref "12-advanced-promql" >}}) — Subqueries, recording rules & vector matching
- [Chapter 13: PromQL Practice Worksheet]({{< relref "13-promql-practice-worksheet" >}}) — 30+ hands-on exercises

## 📚 Additional Resources

- [PromQL Basics](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [PromQL Operators](https://prometheus.io/docs/prometheus/latest/querying/operators/)
- [Prometheus Query Examples](https://prometheus.io/docs/prometheus/latest/querying/examples/)
- [PromLabs PromQL Cheat Sheet](https://promlabs.com/promql-cheat-sheet/)

---

*Continue to → [Chapter 10: PromQL Operators]({{< relref "10-promql-operators" >}})*
