---
title: "PromQL Anti-Patterns"
weight: 2
bookToc: true
---

# PromQL Anti-Patterns

> Common mistakes that lead to incorrect results, slow queries, or data loss.

---

## ❌ Anti-Pattern 1: Using `rate()` on a Gauge

```promql
# ❌ Wrong: rate() is for counters only
rate(node_memory_MemFree_bytes[5m])
# This produces meaningless results since gauges can go up AND down

# ✅ Correct: For gauges, use avg_over_time(), delta(), or derivate()
avg_over_time(node_memory_MemFree_bytes[5m])
delta(node_memory_MemFree_bytes[5m])
```

**Why:** `rate()` is designed for counters (monotonically increasing). On a gauge, it can return negative `_` or spurious values if the gauge resets.

---

## ❌ Anti-Pattern 2: Using `increase()` with Short Ranges on Slow Metrics

```promql
# ❌ Wrong: Range too short — metric updates every 60s but range is 1m
increase(slow_counter[1m])
# May return 0 or fractional values due to insufficient data points

# ✅ Correct: Use at least 4x the scrape interval as the range
increase(slow_counter[5m])  # scrape_interval=15s, so 5m = 20 samples
```

**Rule of Thumb:** Range duration should be at least `4 × scrape_interval`.

---

## ❌ Anti-Pattern 3: Graphing a Range Vector Directly

```promql
# ❌ Wrong: This can't be displayed as a graph
node_load1[5m]

# ✅ Correct: Process with an over-time function first
avg_over_time(node_load1[5m])
```

**Why:** Range vectors return multiple values per time series. Graph panels need instant vectors (one value per series).

---

## ❌ Anti-Pattern 4: Forgetting `rate()` with `histogram_quantile()`

```promql
# ❌ Wrong: histogram_quantile on raw cumulative data
histogram_quantile(0.95, http_request_duration_seconds_bucket)

# ✅ Correct: Always use rate() with histogram_quantile()
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

**Why:** Without `rate()`, `histogram_quantile()` works on cumulative counters, giving incorrect results over time windows. With `rate()`, it computes quantiles on per-second rates.

---

## ❌ Anti-Pattern 5: Missing Label in Vector Matching

```promql
# ❌ Wrong: Label mismatch causes empty result
# metric_a has labels {instance, status}
# metric_b has labels {instance}
metric_a / metric_b  # Fails — "status" label only exists on metric_a

# ✅ Correct: Use ignoring() or on()
metric_a / ignoring(status) metric_b
metric_a / on(instance) metric_b
```

**Why:** Binary operators in PromQL require matching labels. Extra labels on one side cause empty results.

---

## ❌ Anti-Pattern 6: High Cardinality Labels

```promql
# ❌ Wrong: Unbounded labels cause TSDB explosion
http_requests_total{user_id="12345", session_id="abc-def"}
# Every new user/session creates a new time series!

# ✅ Correct: Use bounded labels
http_requests_total{method="GET", endpoint="/api/users", status="200"}
```

**Warning:** Cardinality explosion is one of the fastest ways to crash Prometheus. Avoid user IDs, email addresses, request IDs, or timestamps as label values.

---

## ❌ Anti-Pattern 7: `count(...)` vs `count(...) by (...)`

```promql
# ❌ Wrong: This counts one value per time series, not what you might think
count(node_cpu_seconds_total)  # Returns total time series count

# ✅ Correct: Count by meaningful labels
count by (instance) (node_cpu_seconds_total)  # Returns count per instance
count by (job) (up == 1)                       # Returns count of UP targets per job
```

---

## ❌ Anti-Pattern 8: Case Sensitivity Mistakes

```promql
# ❌ Wrong: Labels are case-sensitive
node_load1{Job="node"}  # "Job" ≠ "job"

# ✅ Correct: Use the exact case
node_load1{job="node"}

# ❌ Wrong: Metric names are case-sensitive
NODE_LOAD1  # Not the same as node_load1

# ✅ Correct
node_load1
```

---

## ❌ Anti-Pattern 9: Regex Anchoring Confusion

```promql
# PromQL anchors regex to BOTH the start AND end of the string
# __name__=~"cpu" means __name__ must be EXACTLY "cpu"

# ❌ This matches NOTHING if you meant "contains cpu"
{__name__=~"cpu"}

# ✅ Correct:
{__name__=~".*cpu.*"}   # Contains "cpu" anywhere
{__name__=~"node_.*"}    # Starts with "node_"
```

---

## ❌ Anti-Pattern 10: Using `sum()` Without `by()`

```promql
# ❌ This collapses ALL time series into a single value
sum(rate(http_requests_total[5m]))

# ✅ This preserves meaningful dimensions
sum by (job) (rate(http_requests_total[5m]))
sum by (instance, job) (rate(http_requests_total[5m]))
```

**Why:** Bare `sum()` aggregates across all labels. You usually want to keep at least `job` or `instance`.

---

## ❌ Anti-Pattern 11: Wrong Histogram Calculation

```promql
# ❌ Wrong: Using histogram_quantile on count/sum
histogram_quantile(0.95, http_request_duration_seconds_count)

# ✅ Correct: Use the _bucket metric
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

**Why:** `histogram_quantile()` needs the `_bucket` metric with `le` labels to interpolate quantile values.

---

## ❌ Anti-Pattern 12: Ignoring Counter Resets

```promql
# ❌ Wrong: This breaks on counter reset (e.g., process restart)
http_requests_total - http_requests_total offset 1h

# ✅ Correct: rate() and increase() handle resets automatically
increase(http_requests_total[1h])
rate(http_requests_total[1h])
```

**Why:** Direct subtraction breaks when the counter resets to 0. `rate()` and `increase()` detect and adjust for resets.

---

## ❌ Anti-Pattern 13: Absent on Wrong Metric

```promql
# ❌ Wrong: This is always NaN if the metric exists (because != is always true)
absent(node_load1 != 0)

# ✅ Correct: absent returns 1 ONLY if the metric is missing entirely
absent(node_load1)           # Returns 1 if node_load1 doesn't exist
absent(up{job="api"})       # Returns 1 if the api job has no targets
```

**Why:** `absent()` returns 1 only when the inner metric has **no matching series at all**.

---

## ❌ Anti-Pattern 14: `offset` Instead of `avg_over_time`

```promql
# ❌ Wrong: This compares to a single point in time
node_load1 - node_load1 offset 5m

# ✅ This compares to the average over the last 5 minutes
node_load1 - avg_over_time(node_load1[5m])
```

**Why:** A single offset value can vary wildly. Use `avg_over_time()` for a smoother baseline.

---

## Summary Table

| Anti-Pattern | Fix | Impact |
|---|---|---|
| `rate()` on gauge | Use `avg_over_time()` or `delta()` | Wrong results |
| `increase()` with short range | Use 4× scrape interval range | Wrong count |
| Graph range vector directly | Use `avg_over_time()` | No graph rendered |
| `histogram_quantile()` without `rate()` | Add `rate()` | Wrong quantile values |
| Missing vector matching labels | Use `ignoring()` or `on()` | Empty results |
| High cardinality labels | Use bounded label values | Prometheus crash |
| `sum()` without `by()` | Add `by (label)` | Data loss |
| Counter subtraction directly | Use `rate()` or `increase()` | Break on reset |
