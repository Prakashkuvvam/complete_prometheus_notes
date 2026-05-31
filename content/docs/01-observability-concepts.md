---
title: "Chapter 1: Observability Fundamentals & Concepts"
weight: 1
bookFlatSection: false
bookToc: true
---

# Chapter 1: Observability Fundamentals & Concepts

## 🎯 Learning Objectives

- Understand what observability means and why it matters
- Define SLIs, SLOs, and SLAs with real-world examples
- Learn the four golden signals of monitoring
- Understand the USE and RED methods for resource and service monitoring
- Distinguish between monitoring, observability, and alerting
- Understand the MTT* metrics family (MTTR, MTBF, MTTD)

---

## 1.1 What is Observability?

**Observability** is the ability to understand the internal state of a system by examining its outputs — metrics, logs, and traces. The term originated in control theory: a system is "observable" if you can infer its internal state from its external outputs.

### Why Observability Matters

Modern systems are complex distributed architectures with dozens or hundreds of moving parts:

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Client  │────▶│  API GW  │────▶│  Service │────▶│  Queue   │
└─────────┘     └─────────┘     │    A     │     └─────────┘
                                └─────────┘          │
                                      │               ▼
                                      │          ┌─────────┐
                                      ▼          │  Worker  │
                                ┌─────────┐     │  Pool    │
                                │  Service │     └─────────┘
                                │    B     │          │
                                └─────────┘          ▼
                                      │          ┌─────────┐
                                      ▼          │   DB     │
                                ┌─────────┐     └─────────┘
                                │  Cache   │
                                └─────────┘
```

When something breaks in this architecture, you need observability to answer:
- **What** is broken? (metrics)
- **Why** is it broken? (logs)
- **Where** is the bottleneck? (traces)

### Monitoring vs Observability

| Aspect | Monitoring | Observability |
|--------|-----------|---------------|
| **Focus** | Known unknowns | Unknown unknowns |
| **Approach** | Collect predefined metrics and alert on thresholds | Explore system behavior through data exploration |
| **Questions** | "Is the system up?" "Is CPU high?" | "Why is latency spiking?" "What's the root cause?" |
| **Data** | Metrics with predefined dashboards | Metrics + logs + traces correlated together |
| **Goal** | Detect known failure modes | Understand any unexpected behavior |

> **Exam Tip:** Monitoring tells you something is wrong; observability tells you **why** it's wrong.

---

## 1.2 The Four Golden Signals

Google's SRE book defines **four golden signals** for monitoring distributed systems:

### 1. Latency
The time it takes to service a request.

- **Example:** 95th percentile response time < 200ms
- **Why it matters:** High latency degrades user experience even if the service is "up"
- **Important:** Distinguish between *success* latency and *error* latency (a failing request may return quickly)

```promql
# 95th percentile latency (successful requests)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{status=~"2..|3.."}[5m]))
```

### 2. Traffic
The demand placed on your system.

- **Example:** 10,000 requests per second (RPS)
- **Why it matters:** Traffic spikes can indicate success (viral growth) or problems (DDoS attack)
- **Common metrics:** HTTP requests/sec, active users, queries per second (QPS)

```promql
# Request rate per second
rate(http_requests_total[5m])
```

### 3. Errors
The rate of failed requests.

- **Examples:** HTTP 5xx, 4xx, application-level errors (e.g., "item not in stock" on a checkout page)
- **Why it matters:** Errors directly impact users
- **Important:** Define errors broadly — any response that doesn't meet the SLO

```promql
# Error rate percentage
sum(rate(http_requests_total{status=~"5.."}[5m])) 
/ 
sum(rate(http_requests_total[5m])) * 100
```

### 4. Saturation
How "full" your service is.

- **Example:** CPU utilization 85%, memory 70%, disk 90%
- **Why it matters:** Saturation often precedes degraded performance or outages
- **Key insight:** Saturation often increases before latency increases

```promql
# CPU saturation (1 - idle rate)
1 - rate(node_cpu_seconds_total{mode="idle"}[5m])
```

### Golden Signals Cheatsheet

| Signal | What it measures | Example Metric | Alert Threshold |
|--------|-----------------|----------------|-----------------|
| **Latency** | Time to serve requests | `http_request_duration_seconds` | p99 > 500ms |
| **Traffic** | Demand on system | `http_requests_total` | > 2x normal |
| **Errors** | Failed requests | `http_requests_total{status="5xx"}` | > 1% of total |
| **Saturation** | Resource utilization | `node_cpu_seconds_total` | > 80% |

---

## 1.3 SLIs, SLOs & SLAs

These three concepts form the foundation of service-level management.

### SLI — Service Level Indicator

A **quantitative measure** of some aspect of service performance.

**Examples:**
- Request latency (p95 < 200ms)
- Availability (proportion of successful requests)
- Throughput (requests per second)
- Error rate (percentage of failed requests)

```promql
# SLI: Proportion of successful requests over 5 minutes
sum(rate(http_requests_total{status!~"5.."}[5m])) 
/ 
sum(rate(http_requests_total[5m]))
```

### SLO — Service Level Objective

The **target value** for an SLI that you commit to achieving internally.

**Examples:**
- 99.9% of requests complete in < 200ms (p99 latency)
- 99.99% availability over a rolling 30-day window
- < 0.1% error rate over 5 minutes

**SLO Tiers:**

| Tier | Name | Availability | Downtime/Month | Use Case |
|------|------|-------------|----------------|----------|
| 1 | Full Managed | 99.995% | ~2 minutes | Critical infrastructure |
| 2 | Enterprise | 99.99% | ~4 minutes | Core business services |
| 3 | Standard | 99.9% | ~43 minutes | Internal tools |
| 4 | Best Effort | 99% | ~7 hours | Non-critical services |

### SLA — Service Level Agreement

A **contractual commitment** to a customer, often with penalties for breach.

- **SLAs are always stricter** than SLOs (you give yourself a buffer)
- Example: Internal SLO is 99.95%, but customer SLA is 99.9%
- This buffer is called the **error budget**

### Relationship Diagram

```
SLI  ←  What we measure (e.g., request latency)
 │
 ▼
SLO  ←  What we aim for (e.g., p99 < 200ms)
 │
 ▼
SLA  ←  What we promise (e.g., 99.9% availability)
```

### Error Budgets

The **error budget** is the acceptable amount of failure within an SLO.

```
Error Budget = 100% - SLO

Example: 99.9% SLO → 0.1% error budget
→ 0.1% of 30 days = ~43 minutes of allowed downtime per month
```

**Key principles:**
- If you haven't exhausted your error budget, you can deploy with confidence
- If you've exhausted your error budget, stop deploying and focus on reliability
- Error budgets align velocity vs. reliability trade-offs

---

## 1.4 The USE Method

The **USE Method** (Utilization, Saturation, Errors) is for **resources** (hardware/infrastructure):

| Component | Utilization | Saturation | Errors |
|-----------|------------|------------|--------|
| **CPU** | `node_cpu_seconds_total{mode="user"}` / total | Load average / run queue length | Machine check errors |
| **Memory** | Memory used / total | OOM kills, swap usage | ECC errors |
| **Disk** | Disk I/O time / interval | I/O queue length | Disk errors, bad sectors |
| **Network** | Bandwidth used / total | Packet drops, retransmits | Interface errors |
| **Database** | Connections / max | Connection pool wait time | Query errors |

### USE Method Worksheet

For every resource, ask three questions:

```
┌─────────────────────────────────────────────────┐
│               USE Method                         │
│                                                   │
│  1. Utilization: How busy is the resource?        │
│     (Average over time)                           │
│                                                   │
│  2. Saturation: How much extra work is queued?    │
│     (Indicates capacity issues)                   │
│                                                   │
│  3. Errors: How many errors is it reporting?      │
│     (Indicates problems)                          │
└─────────────────────────────────────────────────┘
```

---

## 1.5 The RED Method

The **RED Method** (Rate, Errors, Duration) is for **services** (microservices, APIs):

| Method | What | Example Query |
|--------|------|---------------|
| **R**ate | Requests per second | `rate(http_requests_total[5m])` |
| **E**rrors | Failed requests per second | `rate(http_requests_total{status=~"5.."}[5m])` |
| **D**uration | Request latency distribution | `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))` |

### RED Method Dashboard Example

```promql
# Rate — Requests per second
sum(rate(http_requests_total[5m]))

# Errors — Error rate per second
sum(rate(http_requests_total{status=~"5.."}[5m]))

# Duration — p50, p95, p99 latency
histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
```

### USE vs RED — When to Use Which

| Method | Focus | Applies To | Example |
|--------|-------|------------|---------|
| **USE** | Resources | Infrastructure (CPU, memory, disk, network) | "Is the database server overloaded?" |
| **RED** | Services | Applications, APIs, microservices | "Is the checkout service slow?" |

---

## 1.6 The MTT* Family

Mean Time metrics describe reliability and incident response:

| Metric | Definition | Formula | Relevance |
|--------|-----------|---------|-----------|
| **MTBF** | Mean Time Between Failures | Total uptime / # of failures | How reliable is the system? |
| **MTTR** | Mean Time to Repair/Recover | Total downtime / # of incidents | How fast can you recover? |
| **MTTD** | Mean Time to Detect | Time from failure to detection | How good is your monitoring? |
| **MTTF** | Mean Time to Failure | Time from deployment to failure | How long before it breaks? |

```
Timeline:
  [Deploy]─────[Failure]─────[Detected]─────[Resolved]
       │           │              │              │
       ▼           ▼              ▼              ▼
      MTTF        MTTD           MTTR
       ├──────────┴──────────────┤
       │      Total Downtime      │
       └─────────────────────────┘
               
  MTBF = Time between failures (from resolution to next failure)
```

---

## 1.7 Observability Maturity Model

| Level | Name | Characteristics | Tools |
|-------|------|----------------|-------|
| **L1** | Reactive | Manual checks, alert fatigue, no dashboards | Nagios, bash scripts |
| **L2** | Basic | Basic dashboards, simple alerts, some metrics | Prometheus + Grafana basics |
| **L3** | Proactive | SLOs, error budgets, instrumented apps, structured logs | Prometheus, Loki, OpenTelemetry |
| **L4** | Predictive | Auto-scaling, capacity planning, ML-driven anomaly detection | Advanced PromQL, ML tools |
| **L5** | Autonomous | Self-healing, auto-remediation | Kubernetes operators, AIOps |

**For the PCA exam, you need to be at L3.** Understanding SLIs/SLOs, writing PromQL, instrumenting applications, and setting up alerting are the core skills tested.

---

## 1.8 Real-World Scenario: Debugging a Production Outage

Let's walk through a realistic incident to see how observability concepts apply in practice.

### The Scenario

You're an SRE at an e-commerce company. Users report that the checkout page is slow or timing out. Your monitoring stack includes Prometheus, Grafana, and structured logging.

### Step 1: Check the Golden Signals (Metrics)

```promql
# Latency — Checkout p95 response time
histogram_quantile(0.95, rate(checkout_request_duration_seconds_bucket[5m]))
# Result: 8.5s ← Normally 0.3s! Something is wrong.

# Traffic — Checkout request rate
rate(checkout_requests_total[5m])
# Result: 120 req/s ← Normal (100-150 req/s)

# Errors — Checkout error rate
sum(rate(checkout_requests_total{status=~"5.."}[5m])) / sum(rate(checkout_requests_total[5m])) * 100
# Result: 12% ← Normally < 1%! Critical.

# Saturation — Database connection pool
pg_stat_database_numbackends{datname="checkout_db"}
# Result: 95 connections ← Max pool is 100! Nearly saturated.
```

**Finding:** Latency is 28x normal, error rate is spiking, and the database connection pool is nearly full.

### Step 2: Apply the RED Method to the Checkout Service

```promql
# Rate — Request rate per pod
sum by (pod) (rate(checkout_requests_total[5m]))
# Result: pod-a=40, pod-b=38, pod-c=42 ← All pods receiving traffic

# Errors — Error rate per pod
sum by (pod) (rate(checkout_requests_total{status=~"5.."}[5m]))
# Result: pod-a=5, pod-b=4, pod-c=6 ← All pods failing similarly

# Duration — P99 latency per pod
histogram_quantile(0.99, rate(checkout_request_duration_seconds_bucket[5m]))
# Result: all pods > 8s ← Not a single-pod issue, it's systemic
```

**Finding:** The issue affects all pods equally — likely a downstream dependency problem.

### Step 3: Check Dependencies (USE Method for Resources)

```promql
# Database — USE method
# Utilization: CPU
rate(postgresql_cpu_seconds_total{mode="user"}[5m])
# Result: 85% ← High utilization

# Saturation: Active connections
pg_stat_database_numbackends{datname="checkout_db"}
# Result: 95/100 ← Nearly full

# Errors: Query errors
rate(postgresql_errors_total[5m])
# Result: Spiking to 50 errors/min ← Clear signal!
```

### Step 4: Correlate with Logs

Looking at structured logs from the checkout service:

```json
{"level": "ERROR", "service": "checkout", "query": "SELECT inventory...", "error": "connection timed out", "db_host": "checkout-db-1", "timestamp": "..."}
{"level": "ERROR", "service": "checkout", "query": "UPDATE orders...", "error": "connection pool exhausted", "db_host": "checkout-db-1", "timestamp": "..."}
```

### Step 5: Root Cause Identified

The checkout database has a connection pool of 100. During a flash sale, a surge in checkout traffic (still within normal RPS) caused long-running inventory queries to pile up, exhausting the pool and causing cascading timeouts.

### Step 6: Fix and Verify

**Immediate fix:** Increase the database connection pool from 100 → 200 and add query timeout.

```yaml
# Database pool configuration (after fix)
connection_pool: 200
statement_timeout: 5s  # Kill long-running queries
```

**Verify with metrics (after fix):**

```promql
# Verify: Connection pool usage dropped
pg_stat_database_numbackends{datname="checkout_db"}
# Before: 95/100 (95%), After: 85/200 (42%) ✓

# Verify: Error rate returned to normal
sum(rate(checkout_requests_total{status=~"5.."}[5m])) / sum(rate(checkout_requests_total[5m])) * 100
# Before: 12%, After: 0.3% ✓

# Verify: Latency returned to normal
histogram_quantile(0.95, rate(checkout_request_duration_seconds_bucket[5m]))
# Before: 8.5s, After: 0.3s ✓
```

### Lessons Learned

This scenario demonstrates why you need ALL the concepts:
- **Golden signals** caught the problem immediately
- **RED method** showed it was a systemic issue, not a single pod
- **USE method** pinpointed the database as the bottleneck
- **SLIs** (latency, error rate) confirmed the SLO was breached
- **Correlation** between metrics and logs identified the root cause

---

## 1.9 Error Budget Burn Rate — Operational Reality

The error budget isn't just a calculation — it's an operational tool. The **error budget burn rate** tells you how fast you're consuming it:

```
Error Budget = 100% - SLO = 0.1% (for a 99.9% SLO)

Burn Rate = Actual error rate / Maximum allowed error rate

Example:
- Rolling 30-day error rate: 0.05%
- SLO: 99.9% (max error rate: 0.1%)
- Burn rate: 0.05% / 0.1% = 0.5x
- You're burning your budget at half the allowed rate  ✓

Danger zone:
- Rolling 30-day error rate: 0.15%
- Burn rate: 1.5x
- You'll exhaust your budget in 20 days! 🚨
```

### Error Budget Policy Example

```text
┌──────────────────────────────────────────────────────┐
│                  Error Budget Policy                   │
├──────────────────────────────────────────────────────┤
│ SLO: 99.9% availability (30-day rolling window)       │
│                                                       │
│ Budget remaining > 50%  → Normal deployments allowed   │
│ Budget remaining 20-50% → Deploy with caution         │
│ Budget remaining < 20%  → Deployments frozen          │
│ Budget exhausted (0%)   → Stop all changes, fix first │
│                                                       │
│ Weekly review: Every Monday check burn rate           │
│ Escalation: Budget < 30% → VP of Engineering notified │
└──────────────────────────────────────────────────────┘
```

### PromQL for Error Budget Tracking

```promql
# Current error budget remaining (0.0 to 1.0)
1 - (
  sum(rate(http_requests_total{status=~"5.."}[30d]))
  /
  sum(rate(http_requests_total[30d]))
) / 0.001  # 0.001 = 100% - 99.9% SLO

# Error budget burn rate (how fast we're consuming it)
(
  sum(rate(http_requests_total{status=~"5.."}[1h]))
  /
  sum(rate(http_requests_total[1h]))
) / 0.001  / 30  # Normalized to monthly rate
```

---

## 1.10 Practical Analogy: The Car Dashboard

A car dashboard is the perfect analogy for observability:

| Car Dashboard | Observability Equivalent |
|--------------|--------------------------|
| **Speedometer** | Metric — current speed (Gauge) |
| **Odometer** | Metric — total distance (Counter) |
| **Check Engine Light** | Event-based alert (Warning) |
| **Fuel Gauge** | Metric — remaining capacity (Gauge) |
| **Diagnostic Trouble Codes** | Logs — specific error details |
| **GPS Route History** | Trace — complete journey through the system |
| **Dashboard Warning Lights** | Alertmanager notifications |

**Key insight:** You don't drive by looking at raw diagnostic codes. You need high-level gauges (speed, fuel) AND the ability to drill into logs (trouble codes) when something goes wrong.

---

## 📝 PCA Exam Quick Reference

| Concept | Key Fact |
|---------|----------|
| Four Golden Signals | Latency, Traffic, Errors, Saturation |
| USE Method | For resources (Utilization, Saturation, Errors) |
| RED Method | For services (Rate, Errors, Duration) |
| SLI vs SLO vs SLA | Measure vs Aim vs Promise |
| Error Budget | 100% - SLO |
| MTTR | Time to recover from failure |
| MTBF | Time between failures |
| Three Pillars | Metrics (what), Logs (why), Traces (where) |
| CAR Analogy | Speedometer=Gauge, Odometer=Counter, DTC=Logs |

---

## 📝 Exam Tips

1. **SLI vs SLO vs SLA:** SLI = what you measure, SLO = what you aim for, SLA = what you promise
2. **Golden signals (4):** Latency, Traffic, Errors, Saturation
3. **USE vs RED:** USE = resources (Utilization, Saturation, Errors), RED = services (Rate, Errors, Duration)
4. **Error budget = 100% - SLO:** Burn it down slowly, stop deploying if exhausted
5. **MTTR vs MTBF:** MTTR = time to recover, MTBF = time between failures
6. **Monitoring tells you something is wrong; observability tells you why**
7. **Know the difference** between success latency and error latency (error responses may be fast)
8. **RED is for services, USE is for resources** — this is frequently tested

---

## ✅ Chapter 1 Quiz

1. **Which of the following is NOT one of the four golden signals?**
   - a) Latency
   - b) Traffic
   - c) Cost
   - d) Saturation

2. **What does SLI stand for?**
   - a) Service Level Infrastructure
   - b) Service Level Indicator
   - c) Service Level Integration
   - d) System Level Indicator

3. **The USE method applies to which type of component?**
   - a) Microservices
   - b) Databases only
   - c) Resources (infrastructure)
   - d) Applications

4. **If your SLO is 99.9%, what is your monthly error budget (in minutes)?**
   - a) ~4 minutes
   - b) ~43 minutes
   - c) ~7 hours
   - d) ~2 minutes

5. **Which MTT* metric measures how quickly you detect a failure?**
   - a) MTBF
   - b) MTTR
   - c) MTTD
   - d) MTTF

<details>
<summary>📌 Answers</summary>

1. **c** — The four golden signals are Latency, Traffic, Errors, and Saturation
2. **b** — SLI = Service Level Indicator
3. **c** — The USE method (Utilization, Saturation, Errors) applies to resources/infrastructure
4. **b** — 99.9% SLO = 0.1% error budget. 0.1% of 30 days = 0.1% × 43,200 minutes ≈ 43 minutes
5. **c** — MTTD (Mean Time to Detect) measures detection time
</details>

---

## 🔗 Related Chapters

- [Chapter 2: Metrics, Logs & Traces]({{< relref "02-metrics-logs-traces" >}}) — Deep dive into the three pillars
- [Chapter 3: Prometheus vs Other Monitoring Tools]({{< relref "03-prometheus-vs-other-tools" >}}) — Comparing monitoring solutions
- [Chapter 4: Prometheus Architecture & Core Concepts]({{< relref "04-prometheus-architecture" >}}) — How Prometheus implements observability

## 📚 Additional Resources

- Google SRE Book — Chapter 6: Monitoring Distributed Systems
- [Prometheus Documentation — Best Practices](https://prometheus.io/docs/practices/naming/)
- [USE Method by Brendan Gregg](https://www.brendangregg.com/usemethod.html)
- [RED Method by Tom Wilkie](https://grafana.com/blog/2018/08/02/the-red-method-how-to-instrument-your-services/)
- [Four Golden Signals — Google SRE](https://sre.google/sre-book/monitoring-distributed-systems/)

---

*Continue to → [Chapter 2: Metrics, Logs & Traces]({{< relref "02-metrics-logs-traces" >}})*
