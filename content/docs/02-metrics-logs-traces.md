---
title: "Chapter 2: Metrics, Logs & Traces"
weight: 2
bookFlatSection: false
bookToc: true
---

# Chapter 2: Metrics, Logs & Traces — The Three Pillars of Observability

## 🎯 Learning Objectives

- Understand the three pillars of observability and their roles
- Compare metrics, logs, and traces with pros and cons of each
- Learn when to use each data type and how they complement each other
- Understand correlation techniques across pillars
- Explore OpenTelemetry and its role in unified observability

---

## 2.1 The Three Pillars Overview

Observability rests on three data pillars:

```
                    ┌─────────────────────┐
                    │    OBSERVABILITY     │
                    ├─────────┬───────────┤
                    │         │           │
              ┌─────▼──┐ ┌───▼────┐ ┌────▼────┐
              │ METRICS │ │ LOGS   │ │ TRACES  │
              │         │ │        │ │         │
              │ Numbers │ │ Events │ │ Requests│
              │ over    │ │ with   │ │ through │
              │ time    │ │ context │ │ system  │
              └────┬────┘ └───┬────┘ └────┬────┘
                   │          │           │
                   └──────────┼───────────┘
                              │
                    ┌─────────▼─────────┐
                    │   CORRELATION     │
                    │ (timestamps, IDs) │
                    └───────────────────┘
```

| Pillar | What It Is | Examples | Tools |
|--------|-----------|----------|-------|
| **Metrics** | Numeric data over time | CPU usage, request count, latency | Prometheus, Grafana |
| **Logs** | Discrete events with timestamps | Error messages, access logs | Loki, Elasticsearch, Splunk |
| **Traces** | End-to-end request flow | Request paths across services | Jaeger, Zipkin, Tempo |

### The Primary Question Each Answers

| Pillar | Answers | Example Question |
|--------|---------|-----------------|
| Metrics | **What** is happening? | Is my error rate spiking? |
| Logs | **Why** is it happening? | What specific errors occurred? |
| Traces | **Where** is it happening? | Which service is causing the latency? |

---

## 2.2 Metrics — The Numeric Signal

**Metrics** are numeric representations of data measured over intervals of time. They are the most efficient way to track system health at scale.

### Characteristics of Metrics

| Feature | Description |
|---------|-------------|
| **Data type** | Numeric (integers, floats) |
| **Cardinality** | Low (bounded number of label combinations) |
| **Storage efficiency** | Very high — each sample is ~2 bytes after compression |
| **Queryability** | Excellent — PromQL provides powerful aggregation |
| **Retention** | Typically 15-30 days (Prometheus default: 15 days) |
| **Primary use** | Dashboards, alerting, trend analysis |

### What Metrics Excel At

- **Alerting:** "Error rate > 5% for 5 minutes" — simple threshold
- **Dashboards:** Real-time system overview (CPU, memory, requests)
- **Trend analysis:** Capacity planning, growth tracking
- **Long-term storage:** Efficient retention over weeks/months

### What Metrics Don't Do Well

- **Debugging specific errors:** A metric tells you error count increased, but not the actual error message
- **Context-rich analysis:** Metrics lack detailed event context (user IDs, stack traces)
- **Low-cardinality exploration:** High-cardinality labels (user IDs, emails) explode metric cardinality

### Common Metric Types in Prometheus

```promql
# Counter — cumulative count (only increases)
http_requests_total{method="GET", status="200"} 1024

# Gauge — can go up and down
node_memory_MemAvailable_bytes 8472236032

# Histogram — bucketed observations
http_request_duration_seconds_bucket{le="0.1"} 500
http_request_duration_seconds_count 1500

# Summary — pre-computed quantiles
rpc_duration_seconds{quantile="0.95"} 0.15
```

---

## 2.3 Logs — The Event Record

**Logs** are timestamped records of discrete events. They provide rich context that metrics cannot.

### Characteristics of Logs

| Feature | Description |
|---------|-------------|
| **Data type** | Text (structured or unstructured) |
| **Cardinality** | Unlimited (each event is unique) |
| **Storage efficiency** | Low — full text is costly |
| **Queryability** | Moderate — regex, JSON queries |
| **Retention** | Typically 7-30 days (cost-sensitive) |
| **Primary use** | Debugging, auditing, root cause analysis |

### Structured vs Unstructured Logs

**Unstructured Log:**
```
2024-03-15T10:30:00Z Error connecting to database server node-3
```

**Structured Log (JSON):**
```json
{
  "timestamp": "2024-03-15T10:30:00Z",
  "level": "ERROR",
  "service": "user-service",
  "message": "Connection failed",
  "db_host": "node-3",
  "error": "connection refused",
  "duration_ms": 5032,
  "request_id": "abc-123-def"
}
```

**Always use structured logging** — it's infinitely more queryable.

### Log Levels (Standard)

| Level | Severity | When to Use | Example |
|-------|----------|-------------|---------|
| **DEBUG** | 0 | Detailed troubleshooting (not in production) | Variable values, entry/exit |
| **INFO** | 1 | Normal operations | Service started, request completed |
| **WARN** | 2 | Something unexpected but not an error | Retry attempts, rate limit approaching |
| **ERROR** | 3 | A problem occurred but service is still running | Query failed, connection error |
| **FATAL** | 4 | The service must shut down | Out of memory, config corruption |

### Logging Best Practices

```python
# ❌ Bad — unstructured, no context
logger.error(f"Failed to process user {user_id}")

# ✅ Good — structured, searchable, contextual
logger.error("user_processing_failed", extra={
    "user_id": user_id,
    "order_id": order_id,
    "error_type": "validation_error",
    "duration_ms": elapsed_ms
})
```

### What Logs Excel At

- **Detailed debugging:** Full error messages with stack traces
- **Audit trails:** Compliance, security forensics
- **Business analytics:** User behavior patterns
- **Root cause analysis:** Correlating specific errors with timestamps

### What Logs Don't Do Well

- **Real-time alerting:** Too noisy, high volume, costly to index
- **Trend analysis:** Raw logs are not aggregated
- **Long-term storage:** Cost prohibitive at scale

---

## 2.4 Traces — The Request Flow

**Traces** track a single request as it travels through a distributed system.

### Trace Concepts

```
                ┌──────────────────────────┐
                │         TRACE            │
                │   Request: POST /order   │
                └──────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
    ┌─────▼────┐  ┌─────▼────┐  ┌────▼─────┐
    │ SPAN 1   │  │ SPAN 2   │  │ SPAN 3    │
    │ API GW   │  │ Orders   │  │ Payment   │
    │ 5ms      │  │ Service  │  │ Service   │
    └──────────┘  │ 120ms    │  │ 90ms      │
                  └──────────┘  └───────────┘
                        │
                  ┌─────▼────┐
                  │ SPAN 2.1 │
                  │ Database │
                  │ 80ms     │
                  └──────────┘
```

| Term | Description |
|------|-------------|
| **Trace** | The entire journey of a request through the system |
| **Span** | A single unit of work within a trace (one service call) |
| **Span Context** | Metadata passed between spans (trace ID, span ID, parent span ID) |
| **Root Span** | The first span in a trace (the entry point) |
| **Child Span** | A span called by another span |

### Trace Data Model

```json
{
  "trace_id": "abc123def456",
  "spans": [
    {
      "span_id": "span-1",
      "parent_span_id": null,
      "name": "POST /order",
      "service": "api-gateway",
      "start_time": "2024-03-15T10:30:00.000Z",
      "duration_ms": 5,
      "status": "OK",
      "attributes": {
        "http.method": "POST",
        "http.route": "/order"
      }
    },
    {
      "span_id": "span-2",
      "parent_span_id": "span-1",
      "name": "create_order",
      "service": "orders-service",
      "start_time": "2024-03-15T10:30:00.001Z",
      "duration_ms": 120,
      "status": "ERROR",
      "attributes": {
        "db.query": "INSERT INTO orders"
      }
    }
  ]
}
```

### Sampling

Tracing every request at scale is expensive. **Sampling** solves this:

| Strategy | Description | Use Case |
|----------|-------------|----------|
| **Head-based** | Decide at trace start (e.g., 1% of all requests) | Simple, uniform |
| **Tail-based** | Keep all traces, sample after seeing full result | Keep all errors, sample successes |
| **Probability** | Random sampling (e.g., 5% of all traffic) | General purpose |
| **Rate limiting** | Max N traces per second | High-traffic systems |

### What Traces Excel At

- **Pinpointing bottlenecks:** Find the slowest service in a request chain
- **Distributed debugging:** See full request path across services
- **Dependency mapping:** Understand service topology
- **Latency breakdown:** Determine where time is spent

### What Traces Don't Do Well

- **Aggregated metrics:** Traces are individual, not aggregated
- **Long-term trend analysis:** Sampled data is not representative
- **Alerting:** Too expensive to process in real-time at scale
- **Every request coverage:** Sampling means missing data

---

## 2.5 Correlation Across Pillars

The real power of observability comes from **correlating** across all three pillars.

### Correlation Strategies

**Method 1: Timestamp Correlation**
```
14:30:00 — Metric: Error rate spikes to 15%
14:30:01 — Log: "connection timeout to db-primary"
14:30:02 — Trace: db queries timing out at 5s
```

**Method 2: Request ID Correlation**
```
Trace:      trace_id = "abc-123" passed through spans
Log:       request_id = "abc-123" in structured log
Metric:    http_requests_total{request_id=???} ❌ cardinality explosion
```

> **Exam Tip:** High-cardinality labels (like request IDs) in metrics cause Prometheus TSDB performance issues. Use traces for request-level debugging, not metrics.

### The Ideal Workflow

```
1. Dashboard (Metrics)
   "Error rate is spiking!"

2. Drill into Logs (Correlated by time)
   "The errors are 'database connection refused'"

3. Open Trace (Correlated by trace ID)
   "The db service is timing out, but only for orders-service"

4. Fix identified
   "Connection pool exhausted for the orders-service database pool"
```

### Modern Tools for Correlation

| Tool | Pillar | Integration |
|------|--------|-------------|
| **Grafana** | Metrics + Logs + Traces | Unified UI, Loki + Tempo data sources |
| **Prometheus** | Metrics | Alertmanager integration |
| **Loki** | Logs | Grafana native, Prometheus-like labels |
| **Tempo** | Traces | Grafana native, cheap object storage |
| **Jaeger** | Traces | OpenTelemetry compatible |
| **OpenTelemetry** | All 3 | Vendor-neutral standard |

---

## 2.6 OpenTelemetry (OTel)

**OpenTelemetry** is the vendor-neutral standard for collecting metrics, logs, and traces.

### Architecture

```
┌──────────┐    ┌─────────────┐    ┌────────────┐
│  App      │───▶│ OpenTelemetry│───▶│ Backend    │
│  (SDK)   │    │ Collector    │    │ (Prometheus│
└──────────┘    └─────────────┘    │  + Loki +  │
                                    │  Tempo)    │
                                    └────────────┘
```

### Key Components

| Component | Role |
|-----------|------|
| **OTel SDK** | Instrument your application code |
| **OTel Collector** | Receives, processes, and exports telemetry data |
| **OTel Protocol (OTLP)** | Standard protocol for sending telemetry data |
| **Exporters** | Send data to backends (Prometheus, Jaeger, etc.) |

### Why OpenTelemetry for PCA Exam

The PCA exam tests understanding of:
- The need for standardized instrumentation (OTel is the answer)
- How OTel relates to Prometheus (OTel Collector can export to Prometheus)
- The three signals (metrics, logs, traces) as separate but complementary

---

## 2.7 Real-World Scenario: Full Incident Investigation

Let's trace through a complete incident investigation using all three pillars.

### The Alert

A Prometheus alert fires:
```
HighErrorRate on service "user-signup" — Error rate is 15% (threshold: 5%)
```

### Step 1: Start with Metrics (The "What")

```promql
# Error rate by error type
sum by (error_type) (rate(user_signup_errors_total[5m]))

# Result:
# {error_type="validation_error"}  2 req/s  ← Normal
# {error_type="database_error"}    45 req/s  ← SPIKE! 10x normal
# {error_type="timeout_error"}     30 req/s  ← Also elevated
```

```promql
# Database query latency — is the DB slow?
histogram_quantile(0.95, rate(db_query_duration_seconds_bucket{service="user-signup"}[5m]))

# Result: p95 = 4.2s ← Normally 0.05s! Database is extremely slow.
```

### Step 2: Check Logs (The "Why")

```json
// From Loki / Elasticsearch, searching for "user-signup" and "ERROR"
{
  "time": "2024-06-15T14:30:01Z",
  "level": "ERROR",
  "service": "user-signup",
  "message": "User creation failed",
  "error": "could not reach primary database",
  "db_endpoint": "user-db-primary.internal:5432",
  "attempt": 1
}
{
  "time": "2024-06-15T14:30:01Z",
  "level": "ERROR",
  "service": "user-signup",
  "message": "User creation failed",
  "error": "fallback to read-replica also timed out",
  "db_endpoint": "user-db-replica.internal:5432",
  "attempt": 2
}
```

The logs reveal that both the primary database AND the read replica are unreachable.

### Step 3: Open Traces (The "Where")

Using Jaeger/Tempo, you examine a trace for a failed signup request:

```
Trace ID: abc-123-def-456
Service: user-signup → Span: HTTP POST /api/signup (45ms)
  ├─ Span: Validate input (2ms)   ← Fast
  ├─ Span: Check email uniqueness (3ms)  ← Fast
  ├─ Span: Create user in database (12,500ms) ← TIMEOUT! The bottleneck
  └─ Span: Send welcome email (N/A)  ← Never reached
```

**Finding:** The `Create user in database` span took 12.5 seconds and timed out. This is where the problem is.

### Step 4: Correlate and Fix

**Correlation:**
- **Metrics** showed database errors spiking and latency soaring
- **Logs** showed "could not reach primary" with both endpoints failing
- **Traces** confirmed database operations as the bottleneck

**Root Cause:** The database primary had a failover event that caused a DNS propagation delay, and the replica was overloaded handling all traffic.

**Fix:** Implement connection retry with backoff, cache database endpoints to avoid DNS delays, and add a read-through cache for common queries.

**Verify after fix:**
```promql
# Error rate returned to normal
rate(user_signup_errors_total[5m])  # Before: 75 req/s error, After: 2 req/s ✓

# Database latency back to normal
histogram_quantile(0.95, rate(db_query_duration_seconds_bucket{service="user-signup"}[5m]))
# Before: 4.2s, After: 0.05s ✓
```

### Why This Matters for the Exam

The PCA tests your understanding of how the three pillars work **together**, not in isolation. A metric spike tells you *something* is wrong. Logs tell you *why*. Traces tell you *where*. You need all three to solve a production issue.

---

## 2.8 When to Use Each Pillar

| Scenario | Use | Why |
|----------|-----|-----|
| "Is the site up?" | Metrics | Simple up/down check |
| "Why is the checkout failing?" | Logs + Traces | Detailed error context + full request path |
| "How many users signed up today?" | Metrics | Aggregated count |
| "Which service is the slowest?" | Traces | Span duration breakdown |
| "Debug this user's specific issue" | Logs | User ID in structured logs |
| "Should we add more servers?" | Metrics | CPU/memory utilization trend |
| "What happened at 3 AM?" | Logs + Metrics | Metrics show spike, logs show why |
| "Capacity planning for next quarter" | Metrics | Long-term trend analysis |
| "Compliance auditing" | Logs | Immutable event records for forensics |

---

## 📝 PCA Exam Quick Reference

| Pillar | Primary Question | Strength | Weakness |
|--------|-----------------|----------|----------|
| **Metrics** | What is happening? | Alerts, trends, efficiency | No detailed context |
| **Logs** | Why is it happening? | Rich context, debugging | Costly, noisy |
| **Traces** | Where is it happening? | Bottleneck detection | Sampling required |

**Correlation Method:** Metrics → Logs → Traces (drill-down pattern)

---

## 📝 Exam Tips

1. **Three pillars:** Metrics (what), Logs (why), Traces (where)
2. **Prometheus = Metrics only** — Does NOT natively store logs or traces
3. **Don't put high-cardinality labels in Prometheus** — Use logs/traces instead
4. **OpenTelemetry is becoming the standard** — Know it's vendor-neutral
5. **Structured logging > unstructured logging** — Always use JSON or key=value
6. **Trace sampling is essential** — 100% tracing is too expensive
7. **Correlation is key** — The three pillars complement each other
8. **Grafana can query all three** — Prometheus (metrics), Loki (logs), Tempo (traces)

---

## ✅ Chapter 2 Quiz

1. **Which pillar is best suited for answering "Why is my error rate high?"**
   - a) Metrics
   - b) Logs
   - c) Traces
   - d) All of the above

2. **Why shouldn't you add request_id as a label to a Prometheus metric?**
   - a) It's not allowed by PromQL
   - b) It causes high cardinality and TSDB performance issues
   - c) Labels don't support strings
   - d) It's only allowed in histograms

3. **What is a span in distributed tracing?**
   - a) The entire trace duration
   - b) A single unit of work within a trace
   - c) A metric type
   - d) The trace ID

4. **Which tool is used for log aggregation in the Grafana ecosystem?**
   - a) Prometheus
   - b) Grafana
   - c) Loki
   - d) Jaeger

5. **What is OpenTelemetry?**
   - a) A Prometheus feature
   - b) A vendor-neutral standard for collecting telemetry data
   - c) A log aggregation tool
   - d) A tracing tool from Google

<details>
<summary>📌 Answers</summary>

1. **b** — Logs provide the detailed context needed to understand why something happened
2. **b** — request_id is high cardinality (unique per request), which causes TSDB bloat and performance degradation in Prometheus
3. **b** — A span represents a single unit of work (like one service call) within a trace
4. **c** — Loki is Grafana's log aggregation system
5. **b** — OpenTelemetry is a vendor-neutral standard and SDK for collecting metrics, logs, and traces
</details>

---

## 🔗 Related Chapters

- [Chapter 1: Observability Fundamentals & Concepts]({{< relref "01-observability-concepts" >}}) — Foundational observability concepts
- [Chapter 4: Prometheus Architecture & Core Concepts]({{< relref "04-prometheus-architecture" >}}) — How Prometheus implements the metrics pillar
- [Chapter 6: Data Model & Metric Types]({{< relref "06-data-model-metric-types" >}}) — Deep dive into Prometheus metric types

## 📚 Additional Resources

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Grafana Loki Documentation](https://grafana.com/oss/loki/)
- [Grafana Tempo Documentation](https://grafana.com/oss/tempo/)
- [Jaeger Tracing](https://www.jaegertracing.io/)
- [The Three Pillars of Observability](https://www.oreilly.com/library/view/distributed-systems-observability/9781492033431/)

---

*Continue to → [Chapter 3: Prometheus vs Other Monitoring Tools]({{< relref "03-prometheus-vs-other-tools" >}})*
