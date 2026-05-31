---
title: "Advanced PromQL — Vector Matching, Subqueries & Recording Rules"
weight: 12
bookToc: true
---

# Advanced PromQL

This chapter covers advanced PromQL concepts that appear in the PCA exam and are critical for production monitoring at scale.

## Vector Matching Deep Dive

### One-to-One Matching with `on()` and `ignoring()`

When two vectors have different label sets, you must control which labels are used for matching.

**`on()` — Match only on specified labels:**

```promql
# Match only on "instance" — all other labels are ignored
rate(http_requests_total[5m]) / on(instance) rate(http_errors_total[5m])
```

**`ignoring()` — Match on all labels except specified ones:**

```promql
# Match on all labels except "status"
rate(http_requests_total[5m]) / ignoring(status) rate(http_errors_total[5m])
```

### Many-to-One & One-to-Many Matching

Use when one side has additional labels that create extra time series.

**`group_left` — Many-to-One:**

The left side has more time series than the right side:

```promql
# Left side has {job, instance, status}, right side has {job, instance}
# We want to keep the "status" labels from the left side
sum by (job, instance, verb) (rate(http_requests_total[5m]))
  / ignoring(verb) group_left
  sum by (job, instance) (rate(http_requests_total[5m]))
```

This produces an error rate per verb, as a fraction of total requests.

**`group_right` — One-to-Many:**

The right side has more time series:

```promql
# Less common — use group_left by flipping the expression
```

### Common Matching Pitfalls

**Mismatched labels cause empty results:**

```promql
# This returns nothing if label sets don't match
node_memory_MemTotal_bytes / node_memory_MemFree_bytes
```

**Fix with `on()` or `ignoring()`:**

```promql
# Match only on instance
node_memory_MemTotal_bytes / on(instance) node_memory_MemFree_bytes
```

## Subqueries

Subqueries allow you to perform range-vector operations on instant-vector expressions.

### Syntax

```
<instant_query>[<range>:<resolution>]
```

- `instant_query` — any instant vector expression
- `<range>` — the lookback window
- `<resolution>` — how often to sample (optional)

### Simple Subquery

```promql
# Average of per-second request rates over the last 30 minutes, sampled every 5 minutes
avg_over_time(rate(http_requests_total[5m])[30m:5m])
```

This takes 6 samples (30m / 5m) and averages them:
- Sample 1: rate at t-30m, t-25m range
- Sample 2: rate at t-25m, t-20m range
- ...etc

### Subquery Without Resolution

Without specifying a resolution, Prometheus uses the default evaluation interval:

```promql
# Default resolution applies
max_over_time(rate(http_requests_total[5m])[1h:])
```

### Why Use Subqueries?

Subqueries are useful when you need **two levels of aggregation**:

```promql
# Max of averages — find peaks in average request rate over 1 hour
max_over_time(avg by (instance)(rate(http_requests_total[5m]))[1h:5m])
```

Without subquery, this would just give you the max of the current rate.

### Performance Warning

Subqueries are **expensive** — they execute the inner query multiple times. Use them sparingly and prefer recording rules when possible.

## Recording Rules

Recording rules pre-compute expensive queries and store the results as new time series. They are defined in a rule file and loaded by Prometheus.

### Why Recording Rules?

1. **Performance** — Pre-compute complex queries that run repeatedly in dashboards
2. **Reusability** — Define once, reference everywhere
3. **Stability** — Reduce load on Prometheus during dashboard refreshes
4. **Aggregation** — Roll up high-cardinality data

### Rule File Format

```yaml
# /etc/prometheus/recording-rules.yml
groups:
  - name: node_rules
    interval: 30s
    rules:
      - record: job:node_memory_usage:percent
        expr: |
          (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100

      - record: instance:node_cpu:avg_rate5m
        expr: |
          avg by (instance) (rate(node_cpu_seconds_total{mode="user"}[5m]))

  - name: aggregated_rates
    interval: 1m
    rules:
      - record: job:http_requests:rate5m
        expr: |
          sum by (job) (rate(http_requests_total[5m]))
```

### Naming Convention

Follow the recommended naming pattern:

```
level:metric_name:operation
```

| Component | Examples |
|-----------|----------|
| `level` | `instance`, `job`, `cluster` |
| `metric_name` | `node_memory`, `http_requests` |
| `operation` | `avg_rate5m`, `percent`, `sum` |

```promql
# Good naming
instance:node_cpu:avg_rate5m
job:http_errors:ratio
cluster:disk_usage:percent

# Poor naming
my_custom_metric
cpu_rule_1
```

### Loading Recording Rules

In `prometheus.yml`:

```yaml
rule_files:
  - "/etc/prometheus/recording-rules.yml"
  - "/etc/prometheus/alerting-rules.yml"
```

### Recording Rules vs Subqueries

| Aspect | Recording Rules | Subqueries |
|--------|----------------|------------|
| Computation | Pre-computed, stored | On-the-fly, every query |
| Performance | Fast | Slow |
| Storage | Uses disk | No storage |
| Use case | Dashboard queries | Ad-hoc analysis |
| Maintenance | Needs config reload | No setup needed |

### Common Recording Rule Patterns

**Error ratio per job:**
```yaml
- record: job:http_errors:ratio5m
  expr: |
    sum by (job) (rate(http_requests_total{status=~"5.."}[5m]))
    /
    sum by (job) (rate(http_requests_total[5m]))
```

**Apdex score:**
```yaml
- record: job:http_apdex:score
  expr: |
    (
      sum by (job) (rate(http_request_duration_seconds_bucket{le="0.5"}[5m]))
      +
      sum by (job) (rate(http_request_duration_seconds_bucket{le="1.0"}[5m]))
      / 2
    )
    /
    sum by (job) (rate(http_request_duration_seconds_count[5m]))
```

**Available memory ratio:**
```yaml
- record: instance:node_memory_available:ratio
  expr: |
    node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes
```

## Binary Operator Edge Cases

### `^` (Power) is Right-Associative

```promql
# Evaluated as: 2 ^ (3 ^ 4)
2 ^ 3 ^ 4
```

Always use parentheses with chained exponentiation.

### Matching with Multiple Time Series

When vector matching fails due to label mismatch, check:
1. Are there common labels between both sides?
2. Do you need `on()` or `ignoring()`?
3. Do you need `group_left` or `group_right`?

## Common Advanced Patterns

### Ratio of Two Metrics

```promql
# Cache hit ratio
sum(rate(cache_hits_total[5m])) / sum(rate(cache_requests_total[5m]))
```

### Rolling Average Comparison

```promql
# Compare current 5m average to 1h average
avg_over_time(rate(http_requests_total[5m])[1h:5m]) > rate(http_requests_total[5m]) * 1.5
```

### Dynamic Thresholding

```promql
# Alert if rate is > 2x the rolling average
rate(http_requests_total[5m]) > 2 * avg_over_time(rate(http_requests_total[5m])[1h:5m])
```

---

## 🌐 Real-World Scenario: Reducing Dashboard Load with Recording Rules

### The Problem

Your team's "Services Overview" dashboard has 20 panels. Each panel uses a complex PromQL query with aggregation and rate calculations. The dashboard takes 15+ seconds to load and times out during peak hours.

### Step 1: Identify the Expensive Queries

```promql
# Each panel runs a query like this:
sum by (service, namespace) (
  rate(http_request_duration_seconds_count[5m])
)

# 20 panels × 100 services × ~30 data points = 60,000 rate calculations per dashboard refresh!
```

### Step 2: Create Recording Rules for the Common Patterns

```yaml
# /etc/prometheus/recording-rules.yml
groups:
  - name: service_dashboard
    interval: 30s
    rules:
      # Pre-compute request rates per service
      - record: service:http_requests:rate5m
        expr: |
          sum by (service, namespace) (rate(http_requests_total[5m]))

      - record: service:http_errors:rate5m
        expr: |
          sum by (service, namespace) (
            rate(http_requests_total{status=~"5.."}[5m])
          )

      # Pre-compute latency p50, p95, p99
      - record: service:http_latency:p50_5m
        expr: |
          histogram_quantile(0.50,
            sum by (service, namespace, le) (
              rate(http_request_duration_seconds_bucket[5m])
            )
          )

      - record: service:http_latency:p95_5m
        expr: |
          histogram_quantile(0.95,
            sum by (service, namespace, le) (
              rate(http_request_duration_seconds_bucket[5m])
            )
          )

      - record: service:http_latency:p99_5m
        expr: |
          histogram_quantile(0.99,
            sum by (service, namespace, le) (
              rate(http_request_duration_seconds_bucket[5m])
            )
          )

      # Error ratio
      - record: service:http_errors:ratio5m
        expr: |
          service:http_errors:rate5m
          /
          service:http_requests:rate5m
```

### Step 3: Simplify Dashboard Queries

```promql
# Before (runs every panel refresh):
sum by (service) (rate(http_requests_total[5m]))

# After (just reads pre-computed times series):
service:http_requests:rate5m
```

### Step 4: Measure the Improvement

```promql
# Check how much query load decreased
# Before:
rate(prometheus_engine_queries_total[5m])  # e.g., 50 qps

# After:
rate(prometheus_engine_queries_total[5m])  # e.g., 10 qps (5x reduction!)
```

### Subquery vs Recording Rule Decision Tree

```
Do you need this query frequently?
│
├─ YES → Is it OK to store the result?
│  ├─ YES → Use Recording Rule
│  │  (Pre-computed, fast, uses disk)
│  └─ NO  → Use Subquery
│     (On-the-fly, slower, no storage)
│
└─ NO  → Use Subquery
   (Ad-hoc analysis, one-time queries)
```

### Performance Impact Comparison

| Approach | Query Speed | Storage Cost | Dashboard Load | Use Case |
|----------|------------|--------------|----------------|----------|
| Raw query | Slow | None | High panel load | Ad-hoc analysis |
| Subquery | Very slow | None | Very high | Nested aggregation |
| Recording rule | Fast disk read | ~2 bytes/sample | Minimal | Dashboard queries |

---

**Key Takeaways:**
- Use `on()` and `ignoring()` to control vector matching labels
- Use `group_left`/`group_right` for many-to-one matching
- Subqueries enable two-level aggregation but are expensive
- Recording rules pre-compute queries for dashboards
- Name recording rules with the `level:metric:operation` convention
- Prefer recording rules over subqueries for repeated use

---

## 🔗 Related Chapters

- [Chapter 9: PromQL Basics]({{< relref "09-promql-basics" >}}) — Foundational PromQL concepts
- [Chapter 10: PromQL Operators]({{< relref "10-promql-operators" >}}) — Arithmetic, comparison & logical operators
- [Chapter 11: PromQL Functions]({{< relref "11-promql-functions" >}}) — rate(), increase(), histogram_quantile() & more
- [Chapter 13: PromQL Practice Worksheet]({{< relref "13-promql-practice-worksheet" >}}) — Advanced exercise challenges

## 📚 Additional Resources

- [PromQL Recording Rules](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)
- [PromQL Subqueries](https://prometheus.io/docs/prometheus/latest/querying/basics/#subqueries)
- [Recording Rules Best Practices](https://prometheus.io/docs/practices/rules/)

---

*Continue to → [Chapter 13: PromQL Practice Worksheet]({{< relref "13-promql-practice-worksheet" >}})*
