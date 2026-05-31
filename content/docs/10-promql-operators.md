---
title: "PromQL Operators — Arithmetic, Comparison & Logical"
weight: 10
bookToc: true
---

# PromQL Operators

Operators in PromQL allow you to combine, compare, and filter metric values. They are essential for building meaningful queries beyond simple metric retrieval.

## Arithmetic Operators

Arithmetic operators perform mathematical operations on instant vectors, range vectors, or scalars.

### Binary Arithmetic Operators

| Operator | Description |
|----------|-------------|
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Modulo |
| `^` | Power/exponentiation |

### Scalar-to-Vector Operations

When a scalar is used with an instant vector, the operation applies to every element:

```promql
# Double all values
node_memory_MemTotal_bytes * 2

# Add 10 seconds to all timestamps
process_start_time_seconds + 10
```

### Vector-to-Vector Operations

When two instant vectors are used, PromQL matches elements by label sets:

```promql
# Memory usage percentage
(node_memory_MemTotal_bytes - node_memory_MemFree_bytes) / node_memory_MemTotal_bytes * 100

# Disk space utilization
node_filesystem_size_bytes{device="/dev/sda1"} - node_filesystem_free_bytes{device="/dev/sda1"}
```

## Comparison Operators

Comparison operators filter or produce boolean results:

| Operator | Description |
|----------|-------------|
| `==` | Equal to |
| `!=` | Not equal to |
| `<` | Less than |
| `>` | Greater than |
| `<=` | Less than or equal to |
| `>=` | Greater than or equal to |

### Filter Mode (Default)

In filter mode, comparison operators return only the elements where the condition is true:

```promql
# Nodes with more than 80% memory usage
(node_memory_MemTotal_bytes - node_memory_MemFree_bytes) / node_memory_MemTotal_bytes * 100 > 80

# HTTP requests with 5xx status codes
http_requests_total{status=~"5.."} > 0
```

### Boolean Mode

By appending `bool`, the operator returns 1 (true) or 0 (false) instead of filtering:

```promql
# Returns 1 if > 80% memory usage, 0 otherwise (for every time series)
(node_memory_MemTotal_bytes - node_memory_MemFree_bytes) / node_memory_MemTotal_bytes * 100 > bool 80

# Check if any node is overloaded (as a boolean signal)
node_load1 > bool 10
```

## Logical/Set Operators

Logical operators work on **instant vectors** based on label sets:

| Operator | Description |
|----------|-------------|
| `and` | Intersection — returns elements present in both sides |
| `or` | Union — returns all elements from left + right sides (right side elements not in left) |
| `unless` | Subtraction — returns elements from left side that are NOT in right side |

### `and` — Intersection

Returns only time series that exist in **both** the left and right side:

```promql
# Returns time series that are BOTH in the "dev" environment AND have high CPU
node_cpu_seconds_total{env="dev"} and node_cpu_seconds_total > 100000
```

### `or` — Union

Returns all time series from the left side, plus right side series not present in the left:

```promql
# CPU metrics from dev and staging environments
node_cpu_seconds_total{env="dev"} or node_cpu_seconds_total{env="staging"}
```

### `unless` — Subtraction

Returns time series on the left that are **not** present on the right:

```promql
# All nodes that are NOT in the "staging" environment
up{job="node"} unless up{env="staging"}
```

## Operator Precedence

PromQL evaluates operators in the following order (highest to lowest):

1. `^` (right-associative)
2. `*`, `/`, `%` (left-associative)
3. `+`, `-` (left-associative)
4. `==`, `!=`, `<`, `<=`, `>`, `>=` (left-associative)
5. `and`, `unless` (left-associative)
6. `or` (left-associative)

**Tip:** Use parentheses to make operator precedence explicit and avoid surprises:

```promql
# Without parentheses — ambiguous
node_memory_MemTotal_bytes - node_memory_MemFree_bytes / node_memory_MemTotal_bytes * 100

# With parentheses — clear and correct
(node_memory_MemTotal_bytes - node_memory_MemFree_bytes) / node_memory_MemTotal_bytes * 100
```

## Vector Matching

When performing operations between two vectors, PromQL must match elements by label sets.

### One-to-One Matching

Default matching matches identical label sets:

```promql
# Matches time series with identical label sets
rate(http_requests_total[5m]) / rate(http_requests_total[5m])
```

Use `on()` or `ignoring()` to control matching labels:

```promql
# Match only on the "instance" label, ignoring others
rate(http_requests_total[5m]) / on(instance) rate(http_errors_total[5m])

# Match on all labels EXCEPT "status"
rate(http_requests_total[5m]) / ignoring(status) rate(http_errors_total[5m])
```

### Many-to-One / One-to-Many Matching

Use `group_left` or `group_right` when one side has more labels:

```promql
# Many-to-one: left side has "status" label, right side doesn't
rate(http_requests_total[5m]) / on(job, instance) group_left rate(http_errors_total[5m])
```

## Aggregation Operators

While covered in more detail in PromQL functions, aggregation operators are technically operators:

| Operator | Description |
|----------|-------------|
| `sum` | Sum over dimensions |
| `min` | Minimum |
| `max` | Maximum |
| `avg` | Average |
| `stddev` | Standard deviation |
| `stdvar` | Standard variance |
| `count` | Count of elements |
| `count_values` | Count of distinct values |
| `bottomk` | Smallest k elements |
| `topk` | Largest k elements |
| `quantile` | φ-quantile (0 ≤ φ ≤ 1) |

```promql
# Total CPU across all cores
sum(node_cpu_seconds_total{mode="user"})

# Top 5 nodes by memory usage
topk(5, node_memory_MemTotal_bytes - node_memory_MemFree_bytes)

# Average request duration by job
avg(rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])) by (job)
```

## Common Operator Patterns

### Percentage Calculations

```promql
# CPU usage percentage per mode
avg by (instance, mode) (rate(node_cpu_seconds_total[5m])) * 100

# Memory usage percentage
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100
```

### Rate Comparisons

```promql
# Error rate vs total rate
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
```

### Conditional Alerting Signals

```promql
# Boolean signal for alert thresholds
(disk_usage_percent > 85) or (memory_usage_percent > 90)
```

---

## 🌐 Real-World Scenario: Building an Error Budget Dashboard with Operators

### The Challenge

You need to build a query that shows the **error budget burn rate** for your SLO. This requires combining arithmetic, comparison, and logical operators together.

### Step 1: Define the Error Budget

```promql
# SLO target: 99.9% availability over 30 days
# Error budget = 100% - SLO target = 0.1% = 0.001 error ratio
slo_target = 0.999
```

### Step 2: Calculate Current Error Ratio

```promql
# Error ratio = 5xx errors / total requests
sum(rate(http_requests_total{status=~"5.."}[30d]))
/
sum(rate(http_requests_total[30d]))
```

### Step 3: Using Comparison (bool) for Status

```promql
# Is error ratio exceeding budget?
(
  sum(rate(http_requests_total{status=~"5.."}[30d]))
  /
  sum(rate(http_requests_total[30d]))
) > bool (1 - 0.999)

# Returns 1 (budget exhausted) or 0 (budget remaining)
```

### Step 4: Burn Rate with Arithmetic

```promql
# Burn rate = how fast we're consuming the budget
# Budget remaining / time remaining
(
  1 - (
    sum(rate(http_requests_total{status=~"5.."}[30d]))
    /
    sum(rate(http_requests_total[30d]))
  ) / (1 - 0.999)
) / 30 * 100
```

### Step 5: Logical Operators for Multi-Window Analysis

```promql
# Fast burn (5m window) AND slow burn (30d window) = real issue
(
  # Fast burn rate: > 2x budget in 5m
  sum(rate(http_requests_total{status=~"5.."}[5m]))
  /
  sum(rate(http_requests_total[5m])) > bool (2 * (1 - 0.999))
) and (
  # Slow burn: > budget in 30d
  sum(rate(http_requests_total{status=~"5.."}[30d]))
  /
  sum(rate(http_requests_total[30d])) > bool (1 - 0.999)
)
```

### Operator Precedence Walkthrough

```promql
# Without parens — evaluated as:
# 1 + (2 * 3) / (4 - 5) ^ 6
1 + 2 * 3 / 4 - 5 ^ 6

# Step by step:
# 5 ^ 6 = 15625
# 2 * 3 = 6
# 6 / 4 = 1.5
# 1 + 1.5 = 2.5
# 2.5 - 15625 = -15622.5 ❌ (probably not what you wanted)

# With parens — clear intent:
((1 + 2) * 3) / (4 - (5 ^ 6))
```

### Common Pitfall: Missing `on()` Causes Empty Results

```promql
# These two metrics have different label sets:
# node_memory_MemTotal_bytes has {instance, job}
# node_memory_MemFree_bytes has {instance, job}
# Division works because label sets match!

# But what about:
# http_errors_total has {instance, job, status}
# http_requests_total has {instance, job}
# This returns EMPTY because label sets differ!

# ❌ Empty result:
rate(http_errors_total[5m]) / rate(http_requests_total[5m])

# ✅ Fix with ignoring():
rate(http_errors_total[5m]) / ignoring(status) rate(http_requests_total[5m])
```

---

**Key Takeaways:**
- Arithmetic operators work element-wise between vectors and scalars
- Comparison operators can filter or return boolean results with `bool`
- Logical operators combine time series by label sets
- Use `on()`, `ignoring()`, `group_left`, `group_right` for vector matching
- Parentheses improve readability and correctness

---

## 🔗 Related Chapters

- [Chapter 9: PromQL Basics]({{< relref "09-promql-basics" >}}) — Selectors, label matchers, and range vectors
- [Chapter 11: PromQL Functions]({{< relref "11-promql-functions" >}}) — rate(), increase(), histogram_quantile() & more
- [Chapter 12: Advanced PromQL]({{< relref "12-advanced-promql" >}}) — Subqueries, recording rules & vector matching
- [Chapter 13: PromQL Practice Worksheet]({{< relref "13-promql-practice-worksheet" >}}) — Hands-on operator exercises

## 📚 Additional Resources

- [PromQL Operators Reference](https://prometheus.io/docs/prometheus/latest/querying/operators/)
- [PromQL Vector Matching](https://prometheus.io/docs/prometheus/latest/querying/operators/#vector-matching)
- [PromQL Aggregation](https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators)

---

*Continue to → [Chapter 11: PromQL Functions]({{< relref "11-promql-functions" >}})*
