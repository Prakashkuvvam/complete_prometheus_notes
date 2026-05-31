"""
Sample Python Application — Instrumented with Prometheus Client Library

This application simulates a realistic web service with:
- Counter: Request counts by method, endpoint, status
- Gauge: Active requests and queue size
- Histogram: Request duration distribution
- Summary: Request size distribution
- Simulated random behavior (errors, latency spikes)

PCA Exam Topics Covered:
  - Counter, Gauge, Histogram, Summary metric types
  - Label usage and cardinality best practices
  - Metric naming conventions
  - /metrics endpoint exposure
  - Default process and Python runtime metrics
"""

import os
import random
import time
import signal
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler

from prometheus_client import (
    start_http_server,
    Counter,
    Gauge,
    Histogram,
    Summary,
    generate_latest,
    REGISTRY,
    CONTENT_TYPE_LATEST,
)

# ──────────────────────────────────────────────
# Metrics Definitions
# ──────────────────────────────────────────────

# Counter: Cumulative total of HTTP requests
# Labels are bounded (method, endpoint, status) — good cardinality practices
HTTP_REQUESTS_TOTAL = Counter(
    'http_requests_total',
    'Total number of HTTP requests processed',
    ['method', 'endpoint', 'status'],
)

# Counter: Cumulative error count by type
ERRORS_TOTAL = Counter(
    'app_errors_total',
    'Total number of application errors',
    ['error_type'],
)

# Gauge: Number of requests currently being processed
REQUESTS_IN_PROGRESS = Gauge(
    'http_requests_in_progress',
    'Number of HTTP requests currently being processed',
)

# Gauge: Simulated queue size (can go up and down)
QUEUE_SIZE = Gauge(
    'app_queue_size',
    'Current number of items in the processing queue',
    ['queue_name'],
)

# Histogram: Request latency distribution
# Custom buckets match common SLO targets
REQUEST_DURATION_SECONDS = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency in seconds',
    ['method', 'endpoint'],
    buckets=[0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0],
)

# Summary: Request size with configurable quantiles
REQUEST_SIZE_BYTES = Summary(
    'http_request_size_bytes',
    'HTTP request size in bytes',
    ['method'],
)

# Summary: Response size
RESPONSE_SIZE_BYTES = Summary(
    'http_response_size_bytes',
    'HTTP response size in bytes',
    ['endpoint'],
)

# Gauge: Database connection pool size (simulated)
DB_CONNECTIONS = Gauge(
    'app_db_connections_active',
    'Number of active database connections',
    ['db_name'],
)

# Counter: Database queries
DB_QUERIES_TOTAL = Counter(
    'app_db_queries_total',
    'Total number of database queries',
    ['db_name', 'query_type'],
)

# Histogram: Database query duration
DB_QUERY_DURATION_SECONDS = Histogram(
    'app_db_query_duration_seconds',
    'Database query latency in seconds',
    ['db_name', 'query_type'],
    buckets=[0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0],
)

# ──────────────────────────────────────────────
# Application State
# ──────────────────────────────────────────────

ENDPOINTS = ['/users', '/items', '/orders', '/health', '/checkout', '/search']
METHODS = ['GET', 'POST', 'PUT', 'DELETE']
DB_NAMES = ['users_db', 'orders_db', 'inventory_db']
QUERY_TYPES = ['SELECT', 'INSERT', 'UPDATE', 'DELETE']

running = True


def handle_signal(signum, frame):
    """Graceful shutdown on SIGTERM/SIGINT."""
    global running
    print(f'\nReceived signal {signum}, shutting down...')
    running = False


signal.signal(signal.SIGTERM, handle_signal)
signal.signal(signal.SIGINT, handle_signal)


def simulate_db_query():
    """Simulate a database query with random latency."""
    db = random.choice(DB_NAMES)
    query_type = random.choice(QUERY_TYPES)

    # Simulate connection pool
    DB_CONNECTIONS.labels(db_name=db).inc()

    # Simulate query duration (exponential distribution, avg 50ms)
    duration = min(random.expovariate(1.0 / 0.05), 2.0)
    time.sleep(duration)

    DB_QUERIES_TOTAL.labels(db_name=db, query_type=query_type).inc()
    DB_QUERY_DURATION_SECONDS.labels(db_name=db, query_type=query_type).observe(duration)

    DB_CONNECTIONS.labels(db_name=db).dec()

    # Simulate occasional query errors (1%)
    if random.random() < 0.01:
        ERRORS_TOTAL.labels(error_type='db_timeout').inc()
        return False
    return True


def simulate_business_logic(endpoint):
    """Simulate business logic processing with random behavior."""
    # Simulate variable processing time
    if endpoint == '/checkout':
        # Checkout is complex — takes longer
        time.sleep(random.uniform(0.1, 1.5))
        # Simulate occasional checkout failures (3%)
        if random.random() < 0.03:
            ERRORS_TOTAL.labels(error_type='checkout_failed').inc()
            return 502
    elif endpoint == '/search':
        # Search depends on database
        time.sleep(random.uniform(0.05, 0.5))
        db_ok = simulate_db_query()
        if not db_ok:
            return 503
        # Simulate occasional search errors (2%)
        if random.random() < 0.02:
            ERRORS_TOTAL.labels(error_type='search_timeout').inc()
            return 504
    elif endpoint == '/orders':
        time.sleep(random.uniform(0.05, 0.3))
        db_ok = simulate_db_query()
        if not db_ok:
            return 503
    else:
        # Simple endpoints respond faster
        time.sleep(random.uniform(0.01, 0.1))

    # Simulate 4xx errors (5%)
    if random.random() < 0.05:
        return random.choice([400, 404, 422])

    return 200


class MetricsHandler(BaseHTTPRequestHandler):
    """HTTP request handler that serves application endpoints and metrics."""

    def do_GET(self):
        self.handle_request('GET')

    def do_POST(self):
        self.handle_request('POST')

    def do_PUT(self):
        self.handle_request('PUT')

    def do_DELETE(self):
        self.handle_request('DELETE')

    def handle_request(self, method):
        """Handle an HTTP request with full instrumentation."""
        endpoint = self.path

        # Serve /metrics endpoint for Prometheus scraping
        if endpoint == '/metrics':
            self.send_response(200)
            self.send_header('Content-Type', CONTENT_TYPE_LATEST)
            self.end_headers()
            self.wfile.write(generate_latest(REGISTRY))
            return

        # Serve /health endpoint
        if endpoint == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status": "healthy"}')
            return

        # ── Instrument the request ──
        REQUESTS_IN_PROGRESS.inc()
        QUEUE_SIZE.labels(queue_name='main').inc()
        start_time = time.time()

        try:
            # Simulate business logic
            status_code = simulate_business_logic(endpoint)

            # Record metrics
            latency = time.time() - start_time
            HTTP_REQUESTS_TOTAL.labels(
                method=method,
                endpoint=endpoint,
                status=str(status_code),
            ).inc()
            REQUEST_DURATION_SECONDS.labels(
                method=method,
                endpoint=endpoint,
            ).observe(latency)
            REQUEST_SIZE_BYTES.labels(method=method).observe(
                random.randint(100, 10000)
            )
            RESPONSE_SIZE_BYTES.labels(endpoint=endpoint).observe(
                random.randint(200, 50000)
            )

            # Send response
            response_body = f'{{"status": {status_code}, "endpoint": "{endpoint}"}}'.encode()
            self.send_response(status_code)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(response_body)))
            self.end_headers()
            self.wfile.write(response_body)

        except Exception as e:
            ERRORS_TOTAL.labels(error_type='handler_exception').inc()
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status": 500, "error": "internal server error"}')

        finally:
            REQUESTS_IN_PROGRESS.dec()
            QUEUE_SIZE.labels(queue_name='main').dec()

    def log_message(self, format, *args):
        """Suppress default HTTP server logging for cleaner output."""
        pass


def simulate_background_work():
    """Simulate background processing with metrics."""
    while running:
        # Simulate periodic batch processing
        QUEUE_SIZE.labels(queue_name='batch').set(random.randint(0, 50))
        DB_CONNECTIONS.labels(db_name='users_db').set(random.randint(1, 20))
        DB_CONNECTIONS.labels(db_name='orders_db').set(random.randint(1, 15))
        DB_CONNECTIONS.labels(db_name='inventory_db').set(random.randint(1, 10))

        # Simulate periodic errors (1% chance)
        if random.random() < 0.01:
            ERRORS_TOTAL.labels(error_type='background_worker').inc()

        time.sleep(5)


def main():
    port = int(os.environ.get('APP_PORT', 8080))
    metrics_port = int(os.environ.get('METRICS_PORT', 8080))

    print(f'🚀 Starting sample Prometheus-instrumented application...')
    print(f'   Application: http://localhost:{port}')
    print(f'   Metrics:     http://localhost:{metrics_port}/metrics')
    print(f'   Health:      http://localhost:{port}/health')
    print()
    print('📊 Available endpoints:')
    for ep in ENDPOINTS:
        print(f'   - {ep}')

    # Start background worker in a thread
    import threading
    bg_thread = threading.Thread(target=simulate_background_work, daemon=True)
    bg_thread.start()

    # Start HTTP server
    server = HTTPServer(('0.0.0.0', port), MetricsHandler)
    print(f'\n✅ Server started. Press Ctrl+C to stop.\n')

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down...')
        server.shutdown()


if __name__ == '__main__':
    main()
