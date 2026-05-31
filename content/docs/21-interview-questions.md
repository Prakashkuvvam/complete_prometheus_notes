---
title: "Interview Questions & Real-World Scenarios"
weight: 21
bookToc: true
---

# Interview Questions & Real-World Scenarios

This chapter covers common interview questions for Prometheus/SRE roles and real-world scenarios encountered in production monitoring.

## Interview Questions

### Basic Concepts

**Q1: What is the difference between Prometheus pull model and traditional push-based monitoring?**

Prometheus uses a **pull model** where it scrapes metrics from targets at regular intervals. This provides:
- Better control over data collection frequency
- Automatic health detection (failed scrapes = down target)
- Easier security (no need to open ports from targets to Prometheus)
- Higher scalability (can add more Prometheus servers)

Traditional push-based systems (like Graphite) require targets to send metrics to a central server, which can be harder to scale and troubleshoot.

---

**Q2: What are the four metric types in Prometheus?**

1. **Counter** — Cumulative value that only increases (requests, errors, bytes sent)
2. **Gauge** — Value that goes up and down (memory usage, temperature, queue size)
3. **Histogram** — Samples observations and counts them in configurable buckets (latency, response sizes)
4. **Summary** — Similar to histogram but also provides configurable quantiles on the client side

---

**Q3: When would you use a Summary over a Histogram?**

Use a Summary when:
- You need accurate pre-calculated quantiles on the client side
- You can't aggregate quantiles across multiple instances
- The metric has very low cardinality

Use a Histogram when:
- You need to aggregate quantiles across multiple instances
- You want to calculate multiple quantiles from one metric
- You're unsure which buckets to choose (can change later)

---

### PromQL

**Q4: Explain `rate()` vs `irate()` vs `increase()`.**

```promql
# Per-second average rate over 5 minutes
rate(http_requests_total[5m])

# Instantaneous rate using last 2 data points
irate(http_requests_total[5m])

# Total increase over 5 minutes
increase(http_requests_total[5m])
```

- `rate()` — Smoothed, handles counter resets, best for most use cases
- `irate()` — More spike-sensitive, noisier, better for sparsely scraped metrics
- `increase()` — Absolute increase, relationship: `increase(x[5m]) ≈ rate(x[5m]) * 300`

---

**Q5: What happens when two vectors in a PromQL operation have different label sets?**

The operation returns **no results** if the label sets don't match. Use:
- `on(labels)` — Match only on specified labels
- `ignoring(labels)` — Match on all except specified labels
- `group_left` / `group_right` — For many-to-one / one-to-many matching

---

**Q6: How do you calculate a 95th percentile from a histogram?**

```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

Two key points: (1) Always use `rate()` or `increase()` on `_bucket` metrics, (2) The result is an approximation based on bucket boundaries.

---

### Architecture & Operations

**Q7: How do you handle Prometheus high availability?**

- Run two or more Prometheus servers scraping the same targets
- Use **Alertmanager clustering** for deduplicated alerts (Gossip protocol on port 9094)
- Use **Thanos** or **Cortex** for long-term storage and global query view
- Store configurations in version control

---

**Q8: What is the Pushgateway and when should you use it?**

The Pushgateway is an intermediary for metrics from **short-lived jobs** that can't be scraped.

**Use for:** Batch jobs, CI/CD pipelines, cron jobs
**Don't use for:** Long-running services, high-cardinality metrics

Key warning: Pushgateway does not expire metrics automatically — you must delete them.

---

**Q9: How would you alert on a batch job failure?**

```promql
# Job runs once, pushes success timestamp
time() - batch_last_success_timestamp_seconds{job="backup"} > 86400
```

Alert if the last successful run was more than 24 hours ago.

---

**Q10: Explain how recording rules help with Prometheus performance.**

Recording rules pre-compute expensive queries and store results as new time series. Benefits:
- Dashboards load faster (no repeated complex queries)
- Reduce CPU and memory load on Prometheus
- Enable queries that would be too expensive to run ad-hoc
- Simplify dashboard queries (use the recorded metric name)

---

### Troubleshooting

**Q11: A PromQL query returns no data but the metric exists. What could be wrong?**

1. **Label mismatch** — The query labels don't match the stored labels
2. **No data in time range** — Expand the time range
3. **Metric not scraped** — Check target status in `/targets`
4. **Metric expired** — Check retention settings (default: 15 days)
5. **Metric is a counter but using gauge functions** — Wrong function type

**Q12: Prometheus is using too much memory. What do you check?**

1. **High cardinality metrics** — Check which metrics have the most label combinations
2. **Scrape frequency** — Reduce scrape interval for high-cardinality targets
3. **Retention period** — Reduce from default 15 days if needed
4. **Query load** — Check for expensive queries and add recording rules
5. **TSDB block size** — Check for excessive WAL growth

---

### Design & Architecture

**Q13: Design a monitoring solution for a microservices application with 50 services.**

1. **Service instrumentation** — Client libraries for each service (Counter, Gauge, Histogram)
2. **Prometheus servers** — 2-3 Prometheus servers for HA
3. **Service discovery** — Kubernetes SD or Consul for dynamic targets
4. **Exporters** — Node Exporter for hosts, cAdvisor for containers
5. **Alertmanager** — Clustered, with appropriate routing and inhibition
6. **Grafana** — Dashboards for each service + overview dashboard
7. **Long-term storage** — Thanos or Cortex for data beyond 15 days
8. **Recording rules** — Pre-compute high-level service metrics

---

**Q14: How would you reduce alert fatigue in a large organization?**

1. **Use `for` clauses** — Prevent flapping alerts
2. **Implement inhibition rules** — Suppress related low-severity alerts
3. **Group alerts by labels** — Reduce notification volume
4. **Set appropriate repeat intervals** — 4h for warnings, 30m for critical
5. **Triage severity** — Critical (page on-call), Warning (ticket), Info (dashboard only)
6. **Route alerts to the right team** — Label-based routing
7. **Maintain runbooks** — Ensure every alert has clear remediation steps

---

## 🌐 Real-World Scenario: Full Incident Response Walkthrough

### The Incident

At 2:30 PM, PagerDuty pages you: **"HighErrorRate — API service error rate > 5%"**. Your job is to triage, diagnose, and resolve.

### Step 1: Triage (First 2 Minutes)

```bash
# Check who else is affected
# Open: http://prometheus:9090/alerts
# Look for other firing alerts — is it just one service or widespread?

# Quick query to check blast radius:
count(ALERTS{alertstate="firing"}) by (severity)
```

### Step 2: Diagnose the Error (Next 5 Minutes)

```promql
# Which endpoint is failing?
topk(5, sum by (endpoint) (
  rate(http_requests_total{job="api", status=~"5.."}[5m])
))

# Is it a specific instance?
topk(5, sum by (instance) (
  rate(http_requests_total{job="api", status=~"5.."}[5m])
))

# Is the error rate increasing or stable?
delta(
  sum(rate(http_requests_total{job="api", status=~"5.."}[5m]))[15m]
) > 0  # Increasing → worse, Stable → investigate
```

### Step 3: Correlate with Changes (Next 3 Minutes)

```promql
# Was there a recent deploy? (check process restarts)
changes(process_start_time_seconds{job="api"}[30m]) > 0

# Did database latency increase?
histogram_quantile(0.95,
  rate(db_query_duration_seconds_bucket{job="api"}[5m])
) > 1  # > 1 second = slow DB

# Is memory spiking?
delta(process_resident_memory_bytes{job="api"}[15m]) > 100 * 1024 * 1024  # > 100MB increase
```

### Step 4: Declare Root Cause & Mitigate

| Symptom | Diagnosis | Action |
|---------|-----------|--------|
| `/checkout` endpoint returning 502s | Payment gateway timeout | Failover to backup gateway |
| DB query latency >2s | Missing index on new migration | Rollback migration |
| Memory spike + OOM kills | Memory leak in new release | Rollback to previous version |
| All instances failing | Config pushed with wrong DB URL | Fix config and reload |

### Step 5: Document the Timeline

```
14:30 — PagerDuty alert: High error rate
14:32 — Confirmed /checkout endpoint failing (500s)
14:33 — Checked DB latency: normal ✅
14:34 — Checked memory: no spike ✅
14:35 — Checked recent deploy: new gateway config pushed 10m ago
14:36 — Declared root cause: Stripe API key rotated in config
14:38 — Pushed corrected config, rolled back bad change
14:40 — Error rate dropping, service recovering
14:45 — All clear, post-mortem drafted
```

### Post-Mortem Questions

```
1. What was the root cause?
2. How did it get past testing/CI?
3. How could Prometheus have detected it earlier?
4. What alerting improvements should we make?
5. What dashboard improvements would help next time?
```

## More Real-World Scenarios

### Scenario: Database Migration Monitoring

**Problem:** A database migration needs to be monitored for progress and errors.

**Solution:**
```python
from prometheus_client import Counter, Gauge, push_to_gateway

registry = CollectorRegistry()
rows_migrated = Counter('migration_rows_total', 'Rows migrated', registry=registry)
migration_duration = Gauge('migration_duration_seconds', 'Duration', registry=registry)
errors = Counter('migration_errors_total', 'Migration errors', registry=registry)

# Migrate and push every 1000 rows
for batch in migration:
    rows_migrated.inc(len(batch))
    push_to_gateway('pushgateway:9091', job='db_migration', registry=registry)

migration_duration.set(duration_seconds)
push_to_gateway('pushgateway:9091', job='db_migration', registry=registry)
```

### Scenario: Anomaly Detection

**Problem:** Detect sudden spikes in error rates that deviate from normal patterns.

**Solution:**
```promql
# Compare current rate to rolling average
rate(http_errors_total[5m]) > 3 * avg_over_time(rate(http_errors_total[5m])[1h:5m])
```

### Scenario: Capacity Planning

**Problem:** Predict when disk usage will reach capacity.

**Solution:**
```promql
# Alert if disk full within 7 days
predict_linear(node_filesystem_free_bytes{mountpoint="/"}[7d], 7 * 86400) < 0
```

### Scenario: Multi-Tenant Monitoring

**Problem:** Monitor multiple teams' services with separate alerting and dashboards.

**Solution:**
- Use label-based multi-tenancy (`team`, `project` labels)
- Routing rules per team in Alertmanager
- Grafana organization or folder-based access
- Recording rules per team for aggregation

---

**Key Takeaways:**
- Understand pull vs push model tradeoffs deeply — it's the most fundamental design decision
- `rate()` + `histogram_quantile()` = the most common production query pattern
- Always plan for HA — Prometheus is not fully HA by default
- Alert fatigue is the #1 operational concern — design inhibition and grouping carefully
- Practice translating interview concepts into working PromQL queries

---

## 🔗 Related Chapters

- [Chapter 1: Observability Fundamentals]({{< relref "01-observability-concepts" >}}) — Start from the beginning for a full review across all 20 chapters
- [Practice Test 1]({{< relref "29-exam-practice-test-1" >}}) through [Practice Test 7]({{< relref "35-exam-practice-test-7" >}}) — Test your knowledge with full-length exams
- [Chapter 13: PromQL Practice Worksheet]({{< relref "13-promql-practice-worksheet" >}}) — Refresh your PromQL skills

## 📚 Additional Resources

- [Prometheus Community](https://prometheus.io/community/)
- [Awesome Prometheus](https://github.com/roaldnefs/awesome-prometheus)
- [Prometheus GitHub Discussions](https://github.com/prometheus/prometheus/discussions)

---

*🏁 You've completed all 21 chapters! Start your practice tests to assess your readiness.*
