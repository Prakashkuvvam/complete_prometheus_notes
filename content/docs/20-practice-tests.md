---
title: "Practice Tests & Exam Preparation"
weight: 20
bookToc: true
---

# Practice Tests & Exam Preparation

The PCA exam requires a mix of theoretical knowledge and practical PromQL skills. This chapter provides a structured approach to exam preparation.

## PCA Exam Overview

| Detail | Value |
|--------|-------|
| **Questions** | 60 |
| **Duration** | 90 minutes |
| **Passing Score** | 70% (42/60) |
| **Cost** | $250 (retake: $125) |
| **Format** | Multiple choice & Multiple select |
| **Validity** | 2 years |

### Domains & Weights

| Domain | Weight | Questions (approx.) |
|--------|--------|-------------------|
| Observability Concepts | 18% | ~11 |
| Prometheus Fundamentals | 20% | ~12 |
| PromQL | 28% | ~17 |
| Instrumentation & Exporters | 16% | ~10 |
| Alerting & Dashboarding | 18% | ~11 |

## Study Strategy

### 8-Week Study Plan

| Week | Focus | Hours |
|------|-------|-------|
| 1 | Observability concepts (SLIs, SLOs, three pillars) | 3-4 |
| 2 | Prometheus architecture, installation, configuration | 3-4 |
| 3 | Data model, metric types, service discovery | 3-4 |
| 4 | PromQL basics and operators | 5-6 |
| 5 | PromQL functions and advanced concepts | 5-6 |
| 6 | Instrumentation and exporters | 3-4 |
| 7 | Alerting and dashboarding | 3-4 |
| 8 | Practice tests and review | 4-6 |

### Key Topics to Master

**Must-Know (High Frequency):**
1. PromQL `rate()` vs `irate()` vs `increase()` — **most tested topic**
2. Histogram quantiles: `histogram_quantile()`
3. Metric types: Counter, Gauge, Histogram, Summary
4. Four metric name labels: `__name__`, `job`, `instance`, `__metrics_path__`
5. Service discovery mechanisms
6. Alertmanager routing and inhibition
7. Recording rules naming convention
8. Pushgateway use cases and caveats

### Practice Test Schedule

Take practice tests in exam conditions (90 min, 60 questions):

1. **Week 4:** Baseline test (identify weak areas)
2. **Week 6:** Mid-point check (should score 60%+)
3. **Week 7:** Progress check (should score 70%+)
4. **Week 8:** Final readiness (should score 80%+)

## Exam Day Tips

1. **Time management:** ~90 seconds per question
2. **Skip difficult questions** — come back later
3. **Read carefully** — look for key words: "always", "never", "best"
4. **Process of elimination** — remove clearly wrong answers first
5. **Watch for unit traps** — bytes vs bits, seconds vs milliseconds
6. **Know when PromQL returns empty results** — label mismatches

### Common Tricky Topics

```promql
# What does this return?
rate(my_counter[5m])

# Trick: rate() requires at least 2 samples in the range
# If the counter has fewer than 2 samples, rate() returns nothing
```

```promql
# What's the difference?
histogram_quantile(0.95, http_duration_seconds_bucket)
histogram_quantile(0.95, rate(http_duration_seconds_bucket[5m]))

# Trick: Without rate(), histogram_quantile works on cumulative values
# With rate(), it works on per-second rates — always use rate() for dashboarding
```

### Key Facts to Memorize

| Concept | Key Point |
|---------|-----------|
| Prometheus default port | 9090 |
| Alertmanager default port | 9093 |
| Pushgateway default port | 9091 |
| Node Exporter default port | 9100 |
| Blackbox Exporter default port | 9115 |
| Grafana default port | 3000 |
| Pull vs Push | Prometheus pulls; Pushgateway pushes |
| Storage type | Time-series database (TSDB) |
| Retention default | 15 days |
| `rate()` requires | Counter with at least 2 samples |
| `irate()` uses | Last 2 data points only |
| Histogram contains | `_bucket`, `_count`, `_sum` |

## Common Exam Scenarios

### Scenario 1: High Cardinality

**Problem:** A colleague added `user_id` and `email` as labels to a metric. Now Prometheus is slow and consuming too much memory.

**Solution:** Remove high-cardinality labels. Use separate log storage or a different metrics system for user-level data.

### Scenario 2: Missing Metrics

**Problem:** A batch job completes but no metrics appear.

**Solution:** Use Pushgateway for short-lived jobs, or the textfile collector via Node Exporter.

### Scenario 3: Alert Fatigue

**Problem:** Too many alerts during an outage.

**Solution:** Implement Alertmanager inhibition rules, grouping, and appropriate `for` clauses.

### Scenario 4: Histogram Performance

**Problem:** Histogram queries are slow.

**Solution:** Use recording rules to pre-compute histogram quantiles.

## 🌐 Real-World Scenario: Mock Exam Walkthrough

### Question 1: Rate vs Increase

**Question:** Your application reports `my_counter{instance="web-1"}` with value 0 at t=0 and 100 at t=60s. What does `rate(my_counter[1m])` return?

```promql
# Step-by-step:
# rate = (last_value - first_value) / duration_in_seconds
# rate = (100 - 0) / 60
# rate = 1.667 per second
```

**Answer:** Approximately **1.67/s**

### Question 2: Histogram Quantile

**Question:** Given histogram buckets: `le=0.1: 100, le=0.5: 300, le=1.0: 400, le=+Inf: 500`, what is the p95 latency?

```promql
# First, apply rate() to convert to per-second rates:
rate(http_duration_seconds_bucket[5m])

# histogram_quantile(0.95, ...) estimates where 95% of requests fall
# 95% of 500 = 475th request falls between le=0.5 (300) and le=1.0 (400)
# Interpolated: ~0.88s
```

**Answer:** Approximately **0.88 seconds**

### Question 3: Relabeling Logic

**Question:** A pod has label `__meta_kubernetes_pod_label_app="my-app"`. After this relabel config:
```yaml
- action: labelmap
  regex: __meta_kubernetes_pod_label_(.+)
```
What label appears on the target?

**Answer:** `app="my-app"` — `labelmap` captures the group `(.+)` and creates a label named after the captured group.

### Question 4: Alert For Duration

**Question:** An alert rule has `for: 5m`. The expression becomes true at 10:00. At what time does the alert fire?

**Answer:** 10:05 — 10:00 to 10:04 is `pending`, at 10:05 it becomes `firing`.

### Question 5: Vector Matching

**Question:** `metric_a{status="200"} / metric_b` returns no data. The difference is `metric_a` has a `status` label and `metric_b` doesn't. What's the fix?

**Answer:** Add `ignoring(status)` or `on(instance, job)` to the division:
```promql
metric_a / ignoring(status) metric_b
```

---

**Key Takeaways:**
- Focus 40% of study time on PromQL (28% weight + foundation for everything)
- Take all 7 practice tests under timed conditions
- Understand the "why" behind Prometheus design decisions
- Pay special attention to `rate()`, `increase()`, and `histogram_quantile()`
- Review common misconceptions and tricky scenarios

---

## 🔗 Related Chapters

- [Chapter 1: Observability Fundamentals]({{< relref "01-observability-concepts" >}}) — Review all chapters 1-19 for comprehensive exam preparation
- [Chapter 21: Interview Questions & Real-World Scenarios]({{< relref "21-interview-questions" >}}) — Additional practice with interview-style questions
- [Practice Test 1]({{< relref "29-exam-practice-test-1" >}}) through [Practice Test 7]({{< relref "35-exam-practice-test-7" >}}) — Full-length timed practice exams

## 📚 Additional Resources

- [PCA Exam Guide](https://training.linuxfoundation.org/certification/prometheus-certified-associate-pca/)
- [Linux Foundation Prometheus Training](https://training.linuxfoundation.org/training/prometheus-fundamentals-lfs242/)
- [CNCF Prometheus Certification](https://www.cncf.io/certification/pca/)

---

*Continue to → [Chapter 21: Interview Questions & Real-World Scenarios]({{< relref "21-interview-questions" >}})*
