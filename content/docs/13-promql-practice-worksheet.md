---
title: "PromQL Practice Worksheet — 30+ Exercises"
weight: 13
bookToc: true
---

# PromQL Practice Worksheet

This worksheet contains 30+ exercises covering all PromQL topics. Use the interactive exam mode to check your answers.

## Section 1: Basic Vector Selection

### Exercise 1.1
Query to return the current CPU usage metric.

<details>
<summary>Show Solution</summary>

```promql
node_cpu_seconds_total
```
</details>

### Exercise 1.2
Query to return CPU usage for `mode="user"` only.

<details>
<summary>Show Solution</summary>

```promql
node_cpu_seconds_total{mode="user"}
```
</details>

### Exercise 1.3
Query to return CPU usage for modes `user` OR `system`.

<details>
<summary>Show Solution</summary>

```promql
node_cpu_seconds_total{mode=~"user|system"}
```
</details>

### Exercise 1.4
Query to return CPU usage for modes that are NOT `idle`.

<details>
<summary>Show Solution</summary>

```promql
node_cpu_seconds_total{mode!="idle"}
```
</details>

### Exercise 1.5
Chain two label matchers: CPUs on instance `localhost:9100` with mode `user`.

<details>
<summary>Show Solution</summary>

```promql
node_cpu_seconds_total{instance="localhost:9100", mode="user"}
```
</details>

## Section 2: Rate & Increase

### Exercise 2.1
Calculate the per-second rate of HTTP requests over 5 minutes.

<details>
<summary>Show Solution</summary>

```promql
rate(http_requests_total[5m])
```
</details>

### Exercise 2.2
Get the per-second rate of 200-status HTTP responses over 5 minutes.

<details>
<summary>Show Solution</summary>

```promql
rate(http_requests_total{status="200"}[5m])
```
</details>

### Exercise 2.3
Calculate the total number of HTTP requests in the last 1 hour.

<details>
<summary>Show Solution</summary>

```promql
increase(http_requests_total[1h])
```
</details>

### Exercise 2.4
Calculate per-second rate of CPU user time using `irate()`.

<details>
<summary>Show Solution</summary>

```promql
irate(node_cpu_seconds_total{mode="user"}[5m])
```
</details>

### Exercise 2.5
Calculate total disk read bytes in the last 5 minutes.

<details>
<summary>Show Solution</summary>

```promql
increase(node_disk_read_bytes_total[5m])
```
</details>

## Section 3: Arithmetic & Percentage Calculations

### Exercise 3.1
Calculate memory usage in bytes (Total - Free).

<details>
<summary>Show Solution</summary>

```promql
node_memory_MemTotal_bytes - node_memory_MemFree_bytes
```
</details>

### Exercise 3.2
Calculate memory usage as a percentage.

<details>
<summary>Show Solution</summary>

```promql
(node_memory_MemTotal_bytes - node_memory_MemFree_bytes) / node_memory_MemTotal_bytes * 100
```
</details>

### Exercise 3.3
Double a metric's value.

<details>
<summary>Show Solution</summary>

```promql
node_memory_MemTotal_bytes * 2
```
</details>

### Exercise 3.4
Calculate available memory as a ratio (0.0 to 1.0).

<details>
<summary>Show Solution</summary>

```promql
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes
```
</details>

## Section 4: Aggregation

### Exercise 4.1
Total CPU seconds across all cores.

<details>
<summary>Show Solution</summary>

```promql
sum(node_cpu_seconds_total)
```
</details>

### Exercise 4.2
Average CPU usage per instance.

<details>
<summary>Show Solution</summary>

```promql
avg by (instance) (rate(node_cpu_seconds_total{mode="user"}[5m]))
```
</details>

### Exercise 4.3
Total request rate per job.

<details>
<summary>Show Solution</summary>

```promql
sum by (job) (rate(http_requests_total[5m]))
```
</details>

### Exercise 4.4
Top 5 nodes by memory usage.

<details>
<summary>Show Solution</summary>

```promql
topk(5, node_memory_MemTotal_bytes - node_memory_MemFree_bytes)
```
</details>

### Exercise 4.5
Count the number of instances per job.

<details>
<summary>Show Solution</summary>

```promql
count by (job) (up)
```
</details>

### Exercise 4.6
95th percentile of request duration.

<details>
<summary>Show Solution</summary>

```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```
</details>

## Section 5: Comparison & Boolean

### Exercise 5.1
Find nodes with CPU usage greater than 0.5 (50%).

<details>
<summary>Show Solution</summary>

```promql
rate(node_cpu_seconds_total{mode="user"}[5m]) > 0.5
```
</details>

### Exercise 5.2
Return boolean (0 or 1) for the comparison above.

<details>
<summary>Show Solution</summary>

```promql
rate(node_cpu_seconds_total{mode="user"}[5m]) > bool 0.5
```
</details>

### Exercise 5.3
Find instances with memory usage over 80%.

<details>
<summary>Show Solution</summary>

```promql
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 > 80
```
</details>

## Section 6: Logical Operators

### Exercise 6.1
Return only the `dev` instances from `up`.

<details>
<summary>Show Solution</summary>

```promql
up{env="dev"}
```
or using `and`:
```promql
up and on(instance) up{env="dev"}
```
</details>

### Exercise 6.2
Return time series for both `dev` and `staging` environments.

<details>
<summary>Show Solution</summary>

```promql
up{env="dev"} or up{env="staging"}
```
</details>

### Exercise 6.3
Return instances that are up but NOT in `staging`.

<details>
<summary>Show Solution</summary>

```promql
up == 1 unless on(instance) up{env="staging"}
```
</details>

## Section 7: Over-Time Functions

### Exercise 7.1
Average value over 5 minutes.

<details>
<summary>Show Solution</summary>

```promql
avg_over_time(node_cpu_seconds_total{mode="user"}[5m])
```
</details>

### Exercise 7.2
Maximum memory usage in the last hour.

<details>
<summary>Show Solution</summary>

```promql
max_over_time(process_resident_memory_bytes[1h])
```
</details>

### Exercise 7.3
Count of data points in 5 minutes.

<details>
<summary>Show Solution</summary>

```promql
count_over_time(up[5m])
```
</details>

### Exercise 7.4
95th percentile of latency using raw values over 1 hour.

<details>
<summary>Show Solution</summary>

```promql
quantile_over_time(0.95, http_request_duration_seconds[1h])
```
</details>

## Section 8: Label Functions

### Exercise 8.1
Replace the `instance` label to remove the port number.

<details>
<summary>Show Solution</summary>

```promql
label_replace(up, "host", "$1", "instance", "(.*):.*")
```
</details>

### Exercise 8.2
Create a new label combining `job` and `instance`.

<details>
<summary>Show Solution</summary>

```promql
label_join(up, "job_instance", ":", "job", "instance")
```
</details>

## Section 9: Advanced Patterns

### Exercise 9.1
Error ratio as a percentage of total requests.

<details>
<summary>Show Solution</summary>

```promql
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
```
</details>

### Exercise 9.2
Predict disk full in 6 hours.

<details>
<summary>Show Solution</summary>

```promql
predict_linear(node_filesystem_free_bytes{device="/dev/sda1"}[1h], 6 * 3600) < 0
```
</details>

### Exercise 9.3
Alert only during business hours (9AM-5PM weekdays).

<details>
<summary>Show Solution</summary>

```promql
up{job="api"} == 0 and on() day_of_week() > 0 and on() day_of_week() < 6 and on() hour() >= 9 and on() hour() < 17
```
</details>

### Exercise 9.4
Return 1 if a job has no metrics.

<details>
<summary>Show Solution</summary>

```promql
absent(up{job="critical-service"})
```
</details>

### Exercise 9.5
Smoothed CPU using exponential moving average.

<details>
<summary>Show Solution</summary>

```promql
holt_winters(rate(node_cpu_seconds_total{mode="user"}[5m]), 0.5, 0.1)
```
</details>

## Section 10: Subquery Challenge

### Exercise 10.1
Max of average request rates over 1 hour.

<details>
<summary>Show Solution</summary>

```promql
max_over_time(avg by (instance) (rate(http_requests_total[5m]))[1h:5m])
```
</details>

### Exercise 10.2
Average of max request rates over 1 hour.

<details>
<summary>Show Solution</summary>

```promql
avg_over_time(max by (instance) (rate(http_requests_total[5m]))[1h:5m])
```
</details>

---

## 🌐 Real-World Scenario: PromQL for Incident Response

### The Scenario

You're on-call and receive an alert: **Error rate is high on the API service**. You need to investigate using PromQL to find the root cause.

### Step 1: Assess the Blast Radius

```promql
# How much higher is the error rate vs normal?
# Current error rate:
sum(rate(http_requests_total{job="api", status=~"5.."}[5m]))
/
sum(rate(http_requests_total{job="api"}[5m]))

# Compare to same time yesterday:
(
  sum(rate(http_requests_total{job="api", status=~"5.."}[5m]))
  /
  sum(rate(http_requests_total{job="api"}[5m]))
) / (
  sum(rate(http_requests_total{job="api", status=~"5.."}[5m] offset 1d))
  /
  sum(rate(http_requests_total{job="api"}[5m] offset 1d))
) > 5  # 5x increase from yesterday
```

### Step 2: Pinpoint the Failing Endpoint

```promql
# Which endpoint has the most errors?
topk(5, sum by (path) (rate(http_requests_total{job="api", status=~"5.."}[5m])))

# Which HTTP method?
topk(3, sum by (method) (rate(http_requests_total{job="api", status=~"5.."}[5m])))
```

### Step 3: Check for a Recent Deployment

```promql
# Was there a recent deploy? (Check process start times)
# If process_start_time_seconds changed recently, something restarted
changes(process_start_time_seconds{job="api"}[30m]) > 0
```

### Step 4: Check Dependencies

```promql
# Is the database slowing down?
# Database query latency
histogram_quantile(0.95,
  rate(db_query_duration_seconds_bucket{service="api"}[5m])
)

# Database connection pool exhaustion
sum(db_connections_active{service="api"}) / sum(db_connections_max{service="api"}) * 100
```

### Step 5: Correlate with System Metrics

```promql
# Is the API pod running out of memory?
go_memstats_heap_inuse_bytes{job="api"}

# Is the API pod CPU throttled?
rate(process_cpu_seconds_total{job="api"}[5m])

# Are we hitting open file limits?
process_open_fds{job="api"} / process_max_fds{job="api"}
```

### Root Cause Analysis Flow

```
High Error Rate Alert
       │
       ▼
  Check: Which endpoint? Which method? Which instance?
       │
       ▼
  Check: Recent deploy? (process_start_time_seconds)
       │
       ▼
  Check: Dependencies healthy? (DB latency, pool)
       │
       ▼
  Check: System resources? (Memory, CPU, FDs)
       │
       ▼
  Root cause identified! → Fix → Monitor → Close
```

---

## Quick Reference Card

```promql
# Counter → rate
rate(metric[5m])                    # Per-second rate
increase(metric[1h])                # Absolute increase
irate(metric[5m])                   # Instantaneous rate

# Aggregation
sum by (label) (metric)             # Sum per label
avg by (label) (metric)             # Average per label
topk(5, metric)                     # Top 5 values

# Comparison
metric > 10                         # Filter
metric > bool 10                    # Boolean

# Logical
metric_a and metric_b               # Intersection
metric_a or metric_b                # Union
metric_a unless metric_b            # Subtraction

# Vector matching
metric_a / on(label) metric_b       # Match on label
metric_a / ignoring(label) metric_b # Ignore label
metric_a / on(label) group_left     # Many-to-one

# Over-time
avg_over_time(metric[5m])           # Average over range
max_over_time(metric[1h])           # Max over range
quantile_over_time(0.95, metric[5m]) # Quantile over range

# Special
histogram_quantile(0.95, rate(bucket[5m]))  # Quantile from histogram
predict_linear(metric[1h], 3600)            # Future prediction
absent(metric)                              # Missing metric detection
```

---

## 🔗 Related Chapters

- [Chapter 9: PromQL Basics]({{< relref "09-promql-basics" >}}) — Foundational PromQL concepts
- [Chapter 10: PromQL Operators]({{< relref "10-promql-operators" >}}) — Arithmetic, comparison & logical operators
- [Chapter 11: PromQL Functions]({{< relref "11-promql-functions" >}}) — rate(), increase(), histogram_quantile() & more
- [Chapter 12: Advanced PromQL]({{< relref "12-advanced-promql" >}}) — Subqueries, recording rules & vector matching

## 📚 Additional Resources

- [PromLabs PromQL Cheat Sheet](https://promlabs.com/promql-cheat-sheet/)
- [PromQL Prometheus Docs](https://prometheus.io/docs/prometheus/latest/querying/basics/)

---

*Continue to → [Chapter 14: Client Libraries & Instrumentation]({{< relref "14-client-libraries-instrumentation" >}})*
