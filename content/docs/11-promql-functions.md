---
title: "PromQL Functions — rate, increase, histogram_quantile & More"
weight: 11
bookToc: true
---

# PromQL Functions

PromQL provides a rich set of built-in functions for working with time series data. This chapter covers the most important functions for the PCA exam and real-world monitoring.

## Counter Functions

Counters are metrics that only increase (e.g., total requests, total errors, bytes sent).

### `rate()`

The most critical PromQL function. Calculates the **per-second average rate of increase** over a time range:

```promql
rate(http_requests_total[5m])
```

Key properties:
- Only works with **counter** metrics
- Computes (last_value - first_value) / (time_difference_in_seconds) over the range
- Handles **counter resets** automatically (e.g., when a process restarts)
- Always returns a float value
- Best practice: use `[5m]` for most dashboards

**Choosing the right range:**
- `[1m]` — More responsive, noisier (good for alerts)
- `[5m]` — Smoother, standard for dashboards
- `[30m]` — Very smooth, used for long-term trends

```promql
# CPU usage per second
rate(node_cpu_seconds_total{mode="user"}[5m])

# Network bytes received per second
rate(node_network_receive_bytes_total[5m])

# Request rate per second
rate(http_requests_total{status="200"}[5m])
```

### `irate()`

Calculates the **instantaneous per-second rate** based only on the last two data points:

```promql
irate(http_requests_total[5m])
```

Key differences from `rate()`:
- More sensitive to spikes — better for short-lived bursts
- Noisier — worse for steady-state views
- Better for faster-moving counters with sparse data
- `rate()` is generally preferred for most use cases

### `increase()`

Returns the **absolute increase** in a counter over a time range:

```promql
# Total requests in the last 1 hour
increase(http_requests_total[1h])

# Bytes transferred in the last 5 minutes
increase(node_network_transmit_bytes_total[5m])
```

Relationship: `increase(x[d])` ≈ `rate(x[d]) * d_seconds`

### `resets()`

Returns the number of **counter resets** in a time range:

```promql
# Check how many times a counter has reset
resets(http_requests_total[1h])
```

High reset counts may indicate frequent process restarts.

## Gauge Functions

Gauges represent values that can go up or down (e.g., temperature, memory usage).

### `delta()`

Calculates the **difference** between the first and last value of a gauge:

```promql
# Temperature change in the last hour
delta(node_temperature_celsius[1h])
```

### `deriv()`

Calculates the **per-second derivative** of a gauge using linear regression:

```promql
# Rate of memory change per second
deriv(node_memory_MemFree_bytes[30m])
```

### `predict_linear()`

Predicts the value of a gauge at a future time using linear regression:

```promql
# Predicted disk usage in 4 hours
predict_linear(node_filesystem_free_bytes{device="/dev/sda1"}[1h], 4 * 3600)
```

Useful for capacity planning and proactive alerting.

### `holt_winters()`

Produces a smoothed value using Holt-Winters exponential smoothing:

```promql
# Smoothed CPU usage
holt_winters(rate(node_cpu_seconds_total{mode="user"}[5m]), 0.5, 0.1)
```

The two parameters are `alpha` (smoothing factor) and `beta` (trend smoothing factor).

## Aggregation Over Time Functions

These functions aggregate multiple **range vectors** into a single value per time series.

### `avg_over_time()`

Average of all values in the interval:

```promql
# Average CPU over 5 minutes
avg_over_time(node_cpu_seconds_total{mode="user"}[5m])
```

### `min_over_time()` / `max_over_time()`

Minimum/maximum value in the interval:

```promql
# Peak memory usage in the last hour
max_over_time(process_resident_memory_bytes[1h])
```

### `sum_over_time()`

Sum of all values in the interval:

```promql
# Total bytes received in 5 minutes
sum_over_time(node_network_receive_bytes_total[5m])
```

### `count_over_time()`

Count of raw samples in the interval:

```promql
# Number of data points per time series in 5 minutes
count_over_time(up[5m])
```

### `quantile_over_time()`

φ-quantile of values in the interval:

```promql
# 95th percentile of request duration over 1 hour
quantile_over_time(0.95, http_request_duration_seconds[1h])
```

### `stddev_over_time()` / `stdvar_over_time()`

Standard deviation/variance over time:

```promql
# Variability of latency
stddev_over_time(http_request_duration_seconds[5m])
```

## Histogram Functions

Histograms track the distribution of values across configurable buckets.

### `histogram_quantile()`

Calculates the φ-quantile from a histogram metric:

```promql
# 95th percentile request duration
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

Important usage notes:
- Always use `rate()` or `increase()` on the `_bucket` metric
- Works with the `_bucket` suffix metric containing `le` labels
- The bucket boundaries must be defined in the application
- More buckets = more accurate quantiles

```promql
# Multiple quantiles from histogram
histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))  # Median
histogram_quantile(0.90, rate(http_request_duration_seconds_bucket[5m]))  # 90th
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))  # 95th
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))  # 99th
```

### `histogram_stddev()` / `histogram_stdvar()`

Calculates estimated standard deviation/variance from histogram buckets:

```promql
histogram_stddev(rate(http_request_duration_seconds_bucket[5m]))
histogram_stdvar(rate(http_request_duration_seconds_bucket[5m]))
```

## Label Modification Functions

### `label_join()`

Joins multiple label values into a new label:

```promql
# Create a "full_name" label from "instance" and "job"
label_join(up{job="node"}, "full_name", ": ", "instance", "job")
```

Result: `{full_name="localhost:9100: node", instance="localhost:9100", job="node"}`

### `label_replace()`

Modifies or creates a label using regex matching:

```promql
# Extract the IP address from an instance label (e.g., "192.168.1.1:9100")
label_replace(up, "ip", "$1", "instance", "(.*):.*")
```

Result: `{ip="192.168.1.1", instance="localhost:9100", ...}`

## Sorting Functions

```promql
# Sort by value (ascending)
sort(node_memory_MemTotal_bytes)

# Sort by value (descending)
sort_desc(node_memory_MemTotal_bytes)
```

## Timestamp & Time Functions

```promql
# Current Unix timestamp
time()

# Timestamp of the current data point for each time series
timestamp(up)

# Number of days in the current month
days_in_month()

# Day of the month (1-31)
day_of_month()

# Day of the week (0=Sunday, 6=Saturday)
day_of_week()

# Hour of the day (0-23)
hour()
```

### Common Time-Based Patterns

```promql
# Alerts only during business hours (9AM-5PM, Mon-Fri)
up{job="api"} == 0 and on() day_of_week() > 0 and on() day_of_week() < 6 and on() hour() >= 9 and on() hour() < 17
```

## Math & Trigonometric Functions

```promql
abs()       # Absolute value
ceil()      # Round up
floor()     # Round down
round()     # Round to nearest integer
sqrt()      # Square root
ln()        # Natural logarithm
log2()      # Base-2 logarithm
log10()     # Base-10 logarithm
exp()       # Exponential
clamp()     # Clamp values within a range
clamp_max() # Clamp values below a maximum
clamp_min() # Clamp values above a minimum

# Trigonometric (radians)
sin(), cos(), tan(), asin(), acos(), atan(), atan2()
```

## Missing Signal Functions

```promql
# Returns 1 if the time series has no data
absent(up{job="api"})

# Returns one of the given values if a metric is missing
absent_over_time(up{job="api"}[5m])
```

## Practical Function Combinations

### Error Budget Calculation

```promql
# SLO: 99.9% uptime, window: 30 days
1 - (sum(rate(http_requests_total{status=~"5.."}[30d])) / sum(rate(http_requests_total[30d])))
```

### Capacity Planning

```promql
# Predict disk full time in hours
predict_linear(node_filesystem_free_bytes{device="/dev/sda1"}[7d], 24 * 30) < 0
```

### Spike Detection

```promql
# Detect sudden CPU spikes
rate(node_cpu_seconds_total{mode="user"}[5m]) / avg_over_time(rate(node_cpu_seconds_total{mode="user"}[5m])[1h:]) > 2
```

---

## 🌐 Real-World Scenario: Composing Functions for Capacity Planning

### The Challenge

Your team needs to predict when the production database will run out of disk space, and alert proactively if it's projected to happen within the next 7 days.

### Step 1: Get the Raw Free Space

```promql
# Disk free space on the database mount point
node_filesystem_free_bytes{instance="db-01", mountpoint="/data"}
```

### Step 2: Smooth Out Noise with avg_over_time

```promql
# Average free space over last 6 hours (smooths transient spikes/dips)
avg_over_time(node_filesystem_free_bytes{instance="db-01", mountpoint="/data"}[6h])
```

### Step 3: Predict the Future with predict_linear

```promql
# Predict free space 7 days from now using 2 weeks of trend data
predict_linear(
  avg_over_time(node_filesystem_free_bytes{instance="db-01", mountpoint="/data"}[6h])[14d:1h],
  7 * 86400
)
```

### Step 4: Add the Comparison Operator

```promql
# Alert if predicted free space < 10GB in 7 days
predict_linear(
  avg_over_time(node_filesystem_free_bytes{instance="db-01", mountpoint="/data"}[6h])[14d:1h],
  7 * 86400
) < 10 * 1024 * 1024 * 1024  # 10GB in bytes
```

### Step 5: Complete Alert Rule

```yaml
- alert: DiskFullIn7Days
  expr: |
    predict_linear(
      avg_over_time(node_filesystem_free_bytes{mountpoint="/data"}[6h])[14d:1h],
      7 * 86400
    ) < 10 * 1024 * 1024 * 1024
  for: 1h
  labels:
    severity: critical
  annotations:
    summary: "{{ $labels.instance }} disk will be full in 7 days"
    description: |
      Predicted free space in 7 days: 
      {{ $value | humanize1024 }}
```

### Function Composition Flow

```
avg_over_time(smooth)[14d:1h] → predict_linear(…, 7d) → < 10GB → alert
      │                            │                    │
  Smooth noise                 Learn trend          Check threshold
```

### What If We Used the Wrong Function?

```promql
# ❌ Wrong: rate() on a gauge makes no sense
rate(node_filesystem_free_bytes[5m])
# rate() is for counters that only increase!

# ❌ Wrong: increase() on free space
increase(node_filesystem_free_bytes[1h])
# Free space goes DOWN over time, increase() expects UP

# ❌ Wrong: irate() for prediction
irate(node_filesystem_free_bytes[5m])
# irate() is for instantaneous rate, not trend analysis

# ✅ Right: predict_linear() on smoothed data
predict_linear(avg_over_time(node_filesystem_free_bytes[6h])[14d:1h], 7*86400)
```

---

**Key Takeaways:**
- `rate()` is the #1 function for counter metrics — understand it deeply
- `increase()` gives absolute values over time ranges
- `histogram_quantile()` requires rate() or increase() on `_bucket` metrics
- `predict_linear()` is essential for capacity planning
- Over-time functions like `avg_over_time()` aggregate range vectors
- Label functions modify time series identity — use sparingly

---

## 🔗 Related Chapters

- [Chapter 9: PromQL Basics]({{< relref "09-promql-basics" >}}) — Selectors, label matchers, and range vectors
- [Chapter 10: PromQL Operators]({{< relref "10-promql-operators" >}}) — Arithmetic, comparison & logical operators
- [Chapter 12: Advanced PromQL]({{< relref "12-advanced-promql" >}}) — Subqueries, recording rules & vector matching
- [Chapter 13: PromQL Practice Worksheet]({{< relref "13-promql-practice-worksheet" >}}) — Hands-on function exercises

## 📚 Additional Resources

- [PromQL Functions Reference](https://prometheus.io/docs/prometheus/latest/querying/functions/)
- [PromQL Examples](https://prometheus.io/docs/prometheus/latest/querying/examples/)
- [histogram_quantile Deep Dive](https://prometheus.io/docs/practices/histograms/)

---

*Continue to → [Chapter 12: Advanced PromQL]({{< relref "12-advanced-promql" >}})*
