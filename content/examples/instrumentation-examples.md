---
title: "Instrumentation Examples"
weight: 5
bookToc: true
---

# Instrumentation Examples

> Minimal, copy-paste ready instrumentation for Go, Python, Java, and Node.js.

---

## 🐹 Go Instrumentation

```go
package main

import (
    "net/http"
    "time"

    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promauto"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

// ---- Metrics Definition ----

var (
    requestsTotal = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "endpoint", "status"},
    )

    requestDuration = promauto.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "HTTP request latency in seconds",
            Buckets: prometheus.DefBuckets,
        },
        []string{"method", "endpoint"},
    )

    requestsInProgress = promauto.NewGauge(
        prometheus.GaugeOpts{
            Name: "http_requests_in_progress",
            Help: "Number of HTTP requests in progress",
        },
    )
)

// ---- Instrumented Handler ----

func instrumentedHandler(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        requestsInProgress.Inc()
        start := time.Now()

        // Wrap ResponseWriter to capture status code
        wrapper := &responseWriter{ResponseWriter: w, statusCode: 200}
        next(wrapper, r)

        duration := time.Since(start).Seconds()
        requestsTotal.WithLabelValues(r.Method, r.URL.Path, http.StatusText(wrapper.statusCode)).Inc()
        requestDuration.WithLabelValues(r.Method, r.URL.Path).Observe(duration)
        requestsInProgress.Dec()
    }
}

type responseWriter struct {
    http.ResponseWriter
    statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
    rw.statusCode = code
    rw.ResponseWriter.WriteHeader(code)
}

// ---- Main ----

func main() {
    http.Handle("/metrics", promhttp.Handler())
    http.HandleFunc("/api/users", instrumentedHandler(usersHandler))
    http.HandleFunc("/api/items", instrumentedHandler(itemsHandler))

    http.ListenAndServe(":8080", nil)
}
```

---

## 🐍 Python Instrumentation

```python
from prometheus_client import Counter, Gauge, Histogram, Summary, generate_latest, REGISTRY
from prometheus_client import start_http_server
import time
import random
from http.server import HTTPServer, BaseHTTPRequestHandler

# ---- Metrics Definition ----

REQUESTS = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUESTS_IN_PROGRESS = Gauge(
    'http_requests_in_progress',
    'Requests in progress',
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'Request duration in seconds',
    ['method', 'endpoint'],
    buckets=[0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
)

REQUEST_SIZE = Summary(
    'http_request_size_bytes',
    'Request size in bytes',
    ['method']
)

ERRORS = Counter(
    'app_errors_total',
    'Application errors',
    ['error_type']
)


# ---- Instrumented Request Handler ----

class MetricsHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self._handle_request('GET')

    def do_POST(self):
        self._handle_request('POST')

    def _handle_request(self, method):
        if self.path == '/metrics':
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain; version=0.0.4')
            self.end_headers()
            self.wfile.write(generate_latest(REGISTRY))
            return

        REQUESTS_IN_PROGRESS.inc()
        start = time.time()
        status = 200

        try:
            # Simulate work
            time.sleep(random.uniform(0.01, 0.5))
            if random.random() < 0.05:
                status = 500
                ERRORS.labels(error_type='internal').inc()

            REQUESTS.labels(method=method, endpoint=self.path, status=status).inc()
            REQUEST_DURATION.labels(method=method, endpoint=self.path).observe(
                time.time() - start
            )
            REQUEST_SIZE.labels(method=method).observe(random.randint(100, 10000))

            self.send_response(status)
            self.end_headers()
            self.wfile.write(b'{"status": "ok"}')
        finally:
            REQUESTS_IN_PROGRESS.dec()


if __name__ == '__main__':
    start_http_server(8000)  # Expose /metrics on port 8000
    server = HTTPServer(('0.0.0.0', 8080), MetricsHandler)
    server.serve_forever()
```

---

## ☕ Java (Micrometer) Instrumentation

```java
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import io.micrometer.prometheus.PrometheusConfig;
import io.micrometer.prometheus.PrometheusMeterRegistry;
import org.springframework.web.bind.annotation.*;

@RestController
public class InstrumentedController {

    private final Counter requestsTotal;
    private final Timer requestDuration;
    private final PrometheusMeterRegistry registry;

    public InstrumentedController() {
        registry = new PrometheusMeterRegistry(PrometheusConfig.DEFAULT);
        
        requestsTotal = Counter.builder("http_requests_total")
            .description("Total HTTP requests")
            .tags("method", "endpoint")
            .register(registry);

        requestDuration = Timer.builder("http_request_duration_seconds")
            .description("Request duration in seconds")
            .publishPercentiles(0.5, 0.95, 0.99)
            .register(registry);
    }

    @GetMapping("/api/users")
    public String getUsers(@RequestParam(value = "method", defaultValue = "GET") String method) {
        return requestDuration.record(() -> {
            requestsTotal.increment();
            // ... business logic ...
            return "users";
        });
    }

    @GetMapping("/metrics")
    public String metrics() {
        return registry.scrape();
    }
}
```

---

## 🟩 Node.js (prom-client) Instrumentation

```javascript
const express = require('express');
const client = require('prom-client');

// ---- Metrics Definition ----
const requestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'endpoint', 'status'],
});

const requestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Request duration in seconds',
    labelNames: ['method', 'endpoint'],
    buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0],
});

const requestsInProgress = new client.Gauge({
    name: 'http_requests_in_progress',
    help: 'Requests in progress',
});

// Enable default metrics (CPU, memory, event loop lag)
client.collectDefaultMetrics({ timeout: 5000 });

// ---- Instrumented Express App ----
const app = express();

// Instrumentation middleware
app.use((req, res, next) => {
    const end = requestDuration.startTimer();
    requestsInProgress.inc();

    res.on('finish', () => {
        requestsTotal.inc({
            method: req.method,
            endpoint: req.path,
            status: res.statusCode,
        });
        end({ method: req.method, endpoint: req.path });
        requestsInProgress.dec();
    });

    next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// Application routes
app.get('/api/users', (req, res) => {
    res.json({ users: [] });
});

app.listen(8080, () => {
    console.log('App listening on port 8080');
});
```

---

## 🦀 Rust Instrumentation

```rust
use actix_web::{web, App, HttpServer, HttpRequest, HttpResponse};
use prometheus::{Counter, Histogram, HistogramOpts, Registry, TextEncoder, opts};
use std::sync::Arc;

#[derive(Clone)]
struct Metrics {
    registry: Registry,
    requests_total: Counter,
    request_duration: Histogram,
}

impl Metrics {
    fn new() -> Self {
        let registry = Registry::new();
        
        let requests_total = Counter::with_opts(
            opts!("http_requests_total", "Total HTTP requests")
                .namespace("app")
                .const_label("service", "my-app"),
        ).unwrap();
        
        let request_duration = Histogram::with_opts(
            HistogramOpts::new(
                "http_request_duration_seconds",
                "Request duration in seconds"
            ).buckets(vec![0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5]),
        ).unwrap();

        registry.register(Box::new(requests_total.clone())).unwrap();
        registry.register(Box::new(request_duration.clone())).unwrap();

        Metrics { registry, requests_total, request_duration }
    }
}

async fn metrics_handler(metrics: web::Data<Metrics>) -> HttpResponse {
    let encoder = TextEncoder::new();
    let metric_families = metrics.registry.gather();
    let mut response = String::new();
    encoder.encode(&metric_families, &mut response).unwrap();
    HttpResponse::Ok().content_type("text/plain").body(response)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let metrics = web::Data::new(Metrics::new());
    
    HttpServer::new(move || {
        App::new()
            .app_data(metrics.clone())
            .route("/metrics", web::get().to(metrics_handler))
            .route("/api/users", web::get().to(|| async { HttpResponse::Ok().json("users") }))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
```

---

## 📝 Instrumentation Best Practices Summary

| Practice | ✅ Do | ❌ Don't |
|----------|-------|----------|
| Naming | `http_requests_total`, `db_query_duration_seconds` | `requests`, `time` |
| Labels (bounded) | `method`, `endpoint`, `status` | `user_id`, `email`, `session_id` |
| Units | `_seconds`, `_bytes`, `_total` | No suffix |
| Counter | `.Inc()` for events | `.Set()` on counters |
| Gauge | `.Set()`, `.Inc()`, `.Dec()` | Never use gauge for cumulative events |
| Histogram | Use for latency distributions | Default buckets are fine, custom is better |
| Summary | Only if client-side quantiles needed | Prefer histogram for aggregatable quantiles |
| Registry | Use default registry | Don't create custom registries (unless needed) |
| Expose | `/metrics` endpoint | Don't expose to public internet |
