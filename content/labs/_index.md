---
title: "Hands-On Labs"
weight: 20
chapter: true
---

# Hands-On Labs 🛠️

> **Practice makes perfect!** These labs take you from Prometheus basics to production-grade monitoring.

## Lab Environment

All labs use a Docker Compose stack with the following components:

```bash
# Start the Prometheus stack
cd labs
docker compose up -d
```

| Service | URL | Credentials |
|---------|-----|-------------|
| Prometheus | http://localhost:9090 | — |
| Alertmanager | http://localhost:9093 | — |
| Grafana | http://localhost:3000 | admin/admin |
| Node Exporter | http://localhost:9100/metrics | — |
| Sample App | http://localhost:8080/metrics | — |

## Lab Progression

| Lab | Topic | Difficulty | Time |
|-----|-------|------------|------|
| 01 | Install Prometheus with Docker Compose | ⭐ Beginner | 10 min |
| 02 | Configure Scrape Targets & Service Discovery | ⭐ Beginner | 15 min |
| 03 | Write and Test PromQL Queries | ⭐⭐ Intermediate | 20 min |
| 04 | Instrument a Python Application | ⭐⭐ Intermediate | 25 min |
| 05 | Set Up Node Exporter & Alertmanager | ⭐⭐ Intermediate | 20 min |
| 06 | Build a Grafana Dashboard | ⭐⭐⭐ Advanced | 30 min |
| 07 | Configure Alert Routing & Silences | ⭐⭐⭐ Advanced | 25 min |

---

## Lab 01: Install Prometheus with Docker Compose

### Objectives
- Set up a complete Prometheus stack using Docker Compose
- Verify all components are running
- Access Prometheus UI and query a target

### Prerequisites
- Docker Desktop installed
- Git installed

### Steps

Create the following `docker-compose.yml`:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - ./alert.rules.yml:/etc/prometheus/alert.rules.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
      - '--web.console.libraries=/usr/share/prometheus/console_libraries'
      - '--web.console.templates=/usr/share/prometheus/consoles'

  node_exporter:
    image: prom/node-exporter:latest
    container_name: node_exporter
    ports:
      - "9100:9100"
    command:
      - '--path.rootfs=/host'

  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana

  sample-app:
    build: ./sample-app
    container_name: sample-app
    ports:
      - "8080:8080"

volumes:
  prometheus-data:
  grafana-data:
```

Create `prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

rule_files:
  - "alert.rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node_exporter'
    static_configs:
      - targets: ['node_exporter:9100']

  - job_name: 'sample_app'
    static_configs:
      - targets: ['sample-app:8080']
```

Create `alertmanager.yml`:

```yaml
route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'default'

receivers:
  - name: 'default'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/...'
        channel: '#alerts'
```

### Commands

```bash
docker compose up -d
docker compose ps
curl http://localhost:9090/-/ready
curl http://localhost:9100/metrics | head -20
```

### Validation
- Open http://localhost:9090 — Status → Targets should show 3 targets UP
- Open http://localhost:9090/graph — try `prometheus_http_requests_total`
- Open http://localhost:3000 — login with admin/admin

---

## Lab 02: Configure Scrape Targets & Service Discovery

### Objectives
- Configure static and dynamic scrape targets
- Use file-based service discovery
- Apply relabeling rules
- Understand scrape lifecycle

### Steps

**File-based Service Discovery**

```yaml
# prometheus.yml addition
scrape_configs:
  - job_name: 'file_sd'
    file_sd_configs:
      - files:
          - 'targets/*.json'
        refresh_interval: 30s
```

Create `targets/web.json`:

```json
[
  {
    "targets": ["localhost:8080", "localhost:8081"],
    "labels": {
      "service": "web",
      "environment": "dev"
    }
  }
]
```

**Relabeling Example**

```yaml
scrape_configs:
  - job_name: 'relabeled'
    static_configs:
      - targets: ['localhost:8080']
        labels:
          env: 'production'
          region: 'us-east-1'
    relabel_configs:
      - target_label: 'app'
        replacement: 'my-app'
      - source_labels: ['__meta_ec2_tag_Name']
        target_label: 'instance_name'
      - source_labels: ['env']
        target_label: 'environment'
```

### Commands

```bash
# Reload Prometheus configuration
curl -X POST http://localhost:9090/-/reload

# Check discovered targets
curl http://localhost:9090/api/v1/targets | jq .
```

---

## Lab 03: Write and Test PromQL Queries

### Objectives
- Write basic PromQL queries using selectors and matchers
- Use rate(), irate(), increase() functions
- Aggregate with sum(), avg(), topk()
- Understand vector matching

### Practice Queries

```promql
# Basic selectors
node_cpu_seconds_total
node_cpu_seconds_total{mode="idle"}
node_cpu_seconds_total{mode=~"user|system"}
{__name__=~"node_.*", job="node_exporter"}

# Rate (per-second average)
rate(node_cpu_seconds_total[5m])
rate(prometheus_http_requests_total[5m])

# Increase (total increase over interval)
increase(node_cpu_seconds_total[1h])

# Aggregation
sum(rate(node_cpu_seconds_total[5m])) by (mode)
avg(rate(node_cpu_seconds_total[5m])) by (instance)
topk(3, rate(node_cpu_seconds_total{mode="user"}[5m]))

# Quantile
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### Validation
Use the Prometheus UI's graph tab or `promtool`:

```bash
# Install promtool
# Verify rule files
promtool check rules alert.rules.yml
```

---

## Lab 04: Instrument a Python Application

### Objectives
- Add Prometheus client library to a Python app
- Create custom metrics (Counter, Gauge, Histogram)
- Use the `/metrics` endpoint
- Understand metric naming conventions

### Sample Application

```python
# sample-app/app.py
from prometheus_client import start_http_server, Counter, Gauge, Histogram, Summary
import random
import time
import os

# Metrics
requests_total = Counter('app_requests_total', 'Total requests', ['method', 'endpoint'])
requests_in_progress = Gauge('app_requests_in_progress', 'Requests currently being processed')
request_duration = Histogram('app_request_duration_seconds', 'Request duration in seconds',
                             buckets=[0.1, 0.25, 0.5, 1, 2.5, 5, 10])
request_size = Summary('app_request_size_bytes', 'Request size in bytes')

def process_request(method, endpoint):
    requests_in_progress.inc()
    start = time.time()
    
    # Simulate work
    duration = random.expovariate(1.0 / 0.5)  # avg 500ms
    time.sleep(min(duration, 2.0))
    
    requests_total.labels(method=method, endpoint=endpoint).inc()
    request_duration.observe(time.time() - start)
    request_size.observe(random.randint(100, 10000))
    
    requests_in_progress.dec()

if __name__ == '__main__':
    start_http_server(8000)
    while True:
        process_request(
            method=random.choice(['GET', 'POST', 'PUT', 'DELETE']),
            endpoint=random.choice(['/users', '/items', '/orders', '/health'])
        )
        time.sleep(random.uniform(0.5, 2.0))
```

### Dockerfile

```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN pip install prometheus_client
COPY app.py .
CMD ["python", "app.py"]
```

### Commands

```bash
# Build and run
docker compose up -d sample-app

# Check metrics
curl http://localhost:8080/metrics

# Verify in Prometheus
# Query: app_requests_total
# Query: rate(app_requests_total[5m])
```

---

## Lab 05: Set Up Node Exporter & Alertmanager

### Objectives
- Configure Node Exporter with custom collectors
- Set up Alertmanager with email/Slack notifications
- Create alerting rules
- Test alert lifecycle

### Alert Rules

```yaml
# alert.rules.yml
groups:
  - name: node_alerts
    interval: 30s
    rules:
      - alert: HighCPULoad
        expr: node_load1 > 2.0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU load on {{ $labels.instance }}"
          description: "CPU load is {{ $value }} (threshold: 2.0)"

      - alert: NodeDown
        expr: up{job="node_exporter"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Node {{ $labels.instance }} is down"
```

---

## Lab 06: Build a Grafana Dashboard

Create a comprehensive dashboard with panels for:
1. CPU Usage (graph, gauge)
2. Memory Usage
3. Disk I/O
4. Network traffic
5. Application request rate
6. Error rate (4xx/5xx)
7. Request latency (p50, p95, p99)
8. Service health status

---

## Lab 07: Configure Alert Routing & Silences

### Alertmanager Configuration with Routing

```yaml
route:
  receiver: 'default'
  group_by: ['alertname', 'cluster']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty'
      repeat_interval: 10m
    - match:
        severity: warning
      receiver: 'slack-warning'
    - match_re:
        service: ^(web|api)$
      receiver: 'slack-devops'

receivers:
  - name: 'slack-warning'
    slack_configs:
      - channel: '#alerts-warning'

  - name: 'slack-devops'
    slack_configs:
      - channel: '#devops-alerts'

  - name: 'pagerduty'
    pagerduty_configs:
      - routing_key: 'your-key'
```

---

> 🎉 **Congratulations!** You've completed all 7 labs. You're now ready to tackle the practice tests and ace the PCA exam!
