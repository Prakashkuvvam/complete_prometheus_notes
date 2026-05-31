---
title: "Client Libraries & Instrumentation"
weight: 14
bookToc: true
---

# Client Libraries & Instrumentation

Instrumentation is the process of adding Prometheus metrics to your application code. This chapter covers the official Prometheus client libraries and best practices for measuring application behavior.

## Official Client Libraries

Prometheus provides first-party client libraries for major languages:

| Language | Library | Key Features |
|----------|---------|--------------|
| Go | `prometheus/client_golang` | Most feature-rich, histogram buckets, exemplars |
| Java | `simpleclient` or `micrometer` | JVM metrics, Spring Boot integration |
| Python | `prometheus_client` | Flask/Django integration, multiprocess support |
| Ruby | `prometheus-client` | Ruby on Rails middleware |
| Rust | `prometheus` | Native Rust, tokio support |
| Node.js | `prom-client` | Express middleware, async hooks |
| .NET | `prometheus-net` | ASP.NET Core middleware |

### General Pattern

All client libraries follow the same structure:

1. **Define** a metric with a name, help string, and labels
2. **Record** observations at relevant points in your code
3. **Expose** an HTTP endpoint (`/metrics`) for Prometheus to scrape

## Instrumentation Metrics Types

### Counter

Counters track values that only increase (requests, errors, bytes sent):

**Go Example:**
```go
var (
    requestsTotal = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "path", "status"},
    )
)

func handler(w http.ResponseWriter, r *http.Request) {
    requestsTotal.WithLabelValues(r.Method, r.URL.Path, "200").Inc()
}
```

**Python Example:**
```python
from prometheus_client import Counter

REQUESTS = Counter('http_requests_total', 'Total HTTP requests',
                   ['method', 'path', 'status'])

def handler(request):
    REQUESTS.labels(method=request.method, 
                    path=request.path, 
                    status='200').inc()
```

**Node.js Example:**
```javascript
const client = require('prom-client');
const requestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'path', 'status'],
});

app.use((req, res, next) => {
    res.on('finish', () => {
        requestsTotal.inc({ 
            method: req.method, 
            path: req.path, 
            status: res.statusCode 
        });
    });
    next();
});
```

### Gauge

Gauges measure values that go up and down (queue size, memory, active connections):

**Go Example:**
```go
var (
    activeConnections = promauto.NewGauge(
        prometheus.GaugeOpts{
            Name: "active_connections",
            Help: "Number of active connections",
        },
    )
)

func onConnect() {
    activeConnections.Inc()
}

func onDisconnect() {
    activeConnections.Dec()
}
```

**Gauge with Set:**
```go
var (
    queueSize = promauto.NewGauge(prometheus.GaugeOpts{
        Name: "queue_size",
        Help: "Current queue size",
    })
)

func monitorQueue() {
    queueSize.Set(float64(queue.Len()))
}
```

### Histogram

Histograms track distributions (request latency, response sizes):

**Go Example:**
```go
var (
    requestDuration = promauto.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "HTTP request duration in seconds",
            Buckets: prometheus.DefBuckets, // .005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5, 10
        },
        []string{"method", "path"},
    )
)

func handler(w http.ResponseWriter, r *http.Request) {
    timer := prometheus.NewTimer(requestDuration.WithLabelValues(r.Method, r.URL.Path))
    defer timer.ObserveDuration()
    // ... handle request ...
}
```

**Custom Buckets:**
```go
buckets := []float64{.01, .05, .1, .25, .5, 1, 2.5, 5, 10, 30}
```

### Summary

Similar to histogram but also provides configurable quantiles:

```go
var (
    requestDuration = promauto.NewSummaryVec(
        prometheus.SummaryOpts{
            Name:       "http_request_duration_seconds",
            Help:       "HTTP request duration in seconds",
            Objectives: map[float64]float64{
                0.5:  0.05,   // 50th percentile ±5%
                0.9:  0.01,   // 90th percentile ±1%
                0.99: 0.001,  // 99th percentile ±0.1%
            },
        },
        []string{"method"},
    )
)
```

**Histogram vs Summary:**

| Feature | Histogram | Summary |
|---------|-----------|---------|
| Configurable buckets | Yes | No (quantiles) |
| Aggregation across instances | Yes (server-side) | No (client-side) |
| Quantile accuracy | Depends on buckets | Configurable |
| Storage cost | Higher (many buckets) | Lower |
| PCA Exam Focus | **High** | Low |

## Best Practices

### Naming Conventions

```
# Base unit in metric name
<namespace>_<metric_name>_<unit>

# Examples
http_request_duration_seconds  # ✓ Good — includes unit
http_requests_total             # ✓ Good — counter suffix
active_users                    # ✗ No unit or suffix
```

### Label Best Practices

**DO:**
```go
// Good labels — limited cardinality
http_requests_total{method="GET", path="/api/users", status="200"}
```

**DON'T:**
```go
// Bad — high cardinality (user_id, request_id, email)
http_requests_total{user_id="12345", session_id="abc-def"}
```

**Cardinality Guidelines:**
- Keep total label combinations < 100,000 per metric
- Avoid user IDs, email addresses, session IDs as labels
- Prefer lower-cardinality dimensions like `status`, `method`
- Use separate metrics for high-cardinality data

### Instrumentation Points

**Request-Level (HTTP/gRPC):**
```go
// Middleware pattern
func instrumentMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        duration := time.Since(start).Seconds()
        
        requestDuration.WithLabelValues(r.Method, r.URL.Path).Observe(duration)
        requestsTotal.WithLabelValues(r.Method, r.URL.Path, statusCode).Inc()
    })
}
```

**Database:**
```go
// Query duration
dbQueryDuration.WithLabelValues("SELECT").Observe(t.Seconds())
dbQueriesTotal.WithLabelValues("SELECT", "users").Inc()
```

**Background Jobs:**
```go
// Job counters
jobsProcessed.WithLabelValues("email_notification").Inc()
jobDuration.WithLabelValues("email_notification").Observe(t.Seconds())
jobErrors.WithLabelValues("email_notification").Inc()
```

### Custom Collectors

For complex metrics that can't use standard types:

```go
type clusterCollector struct {
    sizeDesc *prometheus.Desc
}

func (c *clusterCollector) Describe(ch chan<- *prometheus.Desc) {
    ch <- c.sizeDesc
}

func (c *clusterCollector) Collect(ch chan<- prometheus.Metric) {
    // Compute metric value at scrape time
    ch <- prometheus.MustNewConstMetric(
        c.sizeDesc, prometheus.GaugeValue, float64(clusterSize()),
    )
}
```

## Default Metrics

### Go Applications

The Go client library automatically registers these metrics:

```promql
# Process metrics
process_cpu_seconds_total
process_resident_memory_bytes
process_virtual_memory_bytes
process_open_fds
process_max_fds
process_start_time_seconds

# Go runtime metrics
go_goroutines
go_threads
go_gc_duration_seconds
go_memstats_alloc_bytes
go_memstats_heap_inuse_bytes
```

### Java Applications

The Java client library automatically registers:

```promql
jvm_memory_bytes_used{area="heap"}
jvm_memory_bytes_used{area="nonheap"}
jvm_gc_collection_seconds_sum
jvm_threads_current
```

## Exposing the Metrics Endpoint

### Go:
```go
http.Handle("/metrics", promhttp.Handler())
log.Fatal(http.ListenAndServe(":8080", nil))
```

### Python:
```python
from prometheus_client import start_http_server

start_http_server(8000)
app.run()
```

### Node.js:
```javascript
const express = require('express');
const client = require('prom-client');

const app = express();
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});
```

---

## 🌐 Real-World Scenario: Instrumenting a Payment Service End-to-End

### The Challenge

You need to instrument a Go-based payment processing service end-to-end. The service:
- Accepts HTTP payment requests
- Validates and processes payments
- Calls external payment gateways (Stripe, PayPal)
- Updates a database

### Step 1: Define the Metrics

```go
package main

import (
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promauto"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    // Counter: Total payments attempted (only increases)
    paymentsTotal = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "payments_processed_total",
            Help: "Total number of payment processing attempts",
        },
        []string{"status", "gateway"},
    )

    // Counter: Total amount processed in cents
    paymentAmountTotal = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "payments_amount_total",
            Help: "Total amount of payments processed in cents",
        },
        []string{"currency"},
    )

    // Histogram: Payment processing duration
    paymentDuration = promauto.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "payment_processing_duration_seconds",
            Help:    "Duration of payment processing in seconds",
            Buckets: prometheus.DefBuckets,
        },
        []string{"gateway"},
    )

    // Gauge: Currently active payment count
    activePayments = promauto.NewGauge(
        prometheus.GaugeOpts{
            Name: "payments_active",
            Help: "Number of payments currently being processed",
        },
    )

    // Customer balance query duration
    dbQueryDuration = promauto.NewHistogram(
        prometheus.HistogramOpts{
            Name:    "db_query_duration_seconds",
            Help:    "Duration of database queries in seconds",
            Buckets: []float64{.001, .005, .01, .025, .05, .1, .25, .5, 1},
        },
    )
)
```

### Step 2: Instrument the Payment Handler

```go
func processPaymentHandler(w http.ResponseWriter, r *http.Request) {
    // Gauge: Increment active payments at start
    activePayments.Inc()
    start := time.Now()

    // Defer cleanup — always runs even on panic
    defer func() {
        activePayments.Dec()
        duration := time.Since(start).Seconds()
        paymentDuration.WithLabelValues(gatewayName).Observe(duration)
    }()

    // Parse payment request
    var req PaymentRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        paymentsTotal.WithLabelValues("failed", "validation").Inc()
        http.Error(w, "bad request", 400)
        return
    }

    // Record amount for tracking
    paymentAmountTotal.WithLabelValues(req.Currency).Add(float64(req.Amount))

    // Process via payment gateway
    err := processWithGateway(req)
    if err != nil {
        paymentsTotal.WithLabelValues("failed", req.Gateway).Inc()
        http.Error(w, "payment failed", 502)
        return
    }

    paymentsTotal.WithLabelValues("success", req.Gateway).Inc()
    w.WriteHeader(http.StatusOK)
}
```

### Step 3: Instrument Database Queries

```go
func queryDatabase(query string) (Result, error) {
    start := time.Now()
    defer func() {
        dbQueryDuration.Observe(time.Since(start).Seconds())
    }()
    
    // execute query...
    return result, nil
}
```

### Step 4: Expose the Metrics Endpoint

```go
func main() {
    // Metrics endpoint
    http.Handle("/metrics", promhttp.Handler())

    // Health endpoint
    http.HandleFunc("/health", healthHandler)
    
    // Payment endpoint (instrumented)
    http.HandleFunc("/api/payments", processPaymentHandler)

    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

### Step 5: Verify the Instrumentation

```bash
# Scrape the metrics endpoint and check output
curl http://localhost:8080/metrics | head -20

# Expected output:
# HELP payments_processed_total Total number of payment processing attempts
# TYPE payments_processed_total counter
payments_processed_total{gateway="stripe",status="success"} 42
payments_processed_total{gateway="stripe",status="failed"} 3
# HELP payment_processing_duration_seconds Duration of payment processing
# TYPE payment_processing_duration_seconds histogram
payment_processing_duration_seconds_bucket{gateway="stripe",le="0.005"} 5
payment_processing_duration_seconds_bucket{gateway="stripe",le="0.01"} 15
...
```

### Step 6: Create SLO-Focused Queries

```promql
# Payment success rate (last hour)
sum(increase(payments_processed_total{status="success"}[1h]))
/
sum(increase(payments_processed_total[1h]))

# P95 payment processing latency per gateway
histogram_quantile(0.95,
  sum by (gateway, le) (
    rate(payment_processing_duration_seconds_bucket[5m])
  )
)

# Active payments over time (gauge)
payments_active

# Amount processed per minute
sum(rate(payments_amount_total[5m]))

# Database query performance
histogram_quantile(0.99,
  rate(db_query_duration_seconds_bucket[5m])
)
```

### What We Learned

```
Metric type selection:
- payments_total = Counter (cumulative events)
- payment_amount_total = Counter (cumulative value)
- payment_duration = Histogram (latency distribution for SLO)
- active_payments = Gauge (current snapshot)
- db_query_duration = Histogram (latency distribution)

Label strategy:
- status: success/failed (bounded ✓)
- gateway: stripe/paypal/validation (bounded ✓)
- currency: USD/EUR/GBP (bounded ✓)
- NO user_id, NO payment_id, NO session_id (cardinality explosion!)
```

---

**Key Takeaways:**
- Use counters for cumulative values, gauges for instantaneous values
- Histograms are preferred over summaries for most use cases
- Keep label cardinality low — avoid user IDs and request IDs
- Follow naming conventions (`metric_total`, `metric_seconds`)
- Use middleware patterns for consistent request-level instrumentation
- Enable default runtime metrics (Go, Java, etc.)

---

## 🔗 Related Chapters

- [Chapter 6: Data Model & Metric Types]({{< relref "06-data-model-metric-types" >}}) — Understanding the metric types you're instrumenting
- [Chapter 15: Exporters]({{< relref "15-exporters" >}}) — Pre-built integrations for third-party systems
- [Chapter 16: Pushgateway]({{< relref "16-pushgateway" >}}) — Instrumenting short-lived batch jobs

## 📚 Additional Resources

- [Prometheus Client Libraries](https://prometheus.io/docs/instrumenting/clientlibs/)
- [Instrumentation Best Practices](https://prometheus.io/docs/practices/instrumentation/)
- [Prometheus Go Client Library](https://github.com/prometheus/client_golang)
- [Prometheus Python Client Library](https://github.com/prometheus/client_python)

---

*Continue to → [Chapter 15: Exporters]({{< relref "15-exporters" >}})*
