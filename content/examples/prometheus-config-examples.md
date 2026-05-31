---
title: "Prometheus Config Examples"
weight: 3
bookToc: true
---

# Prometheus Config Examples

## 🏗️ Basic Scrape Configuration

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  scrape_timeout: 10s

scrape_configs:
  - job_name: 'my_app'
    static_configs:
      - targets: ['localhost:8080']
        labels:
          environment: 'production'
```

---

## 🔍 Service Discovery Examples

### File-Based SD

```yaml
scrape_configs:
  - job_name: 'file_sd'
    file_sd_configs:
      - files:
          - 'targets/*.json'
          - 'targets/*.yaml'
        refresh_interval: 30s
```

### Kubernetes SD

```yaml
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      # Only scrape pods with prometheus.io/scrape: "true"
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      # Use the annotation's port if available
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        target_label: __address__
        regex: (.+)
        replacement: $1
      # Rename pod labels
      - source_labels: [__meta_kubernetes_pod_label_app]
        target_label: app
      - source_labels: [__meta_kubernetes_namespace]
        target_label: namespace
```

### EC2 SD

```yaml
scrape_configs:
  - job_name: 'ec2'
    ec2_sd_configs:
      - region: us-east-1
        access_key: AKIA...
        secret_key: ...
        port: 9100
    relabel_configs:
      - source_labels: [__meta_ec2_tag_Name]
        target_label: instance_name
      - source_labels: [__meta_ec2_tag_Environment]
        target_label: environment
```

### Consul SD

```yaml
scrape_configs:
  - job_name: 'consul'
    consul_sd_configs:
      - server: 'localhost:8500'
        services: ['web', 'api', 'worker']
    relabel_configs:
      - source_labels: [__meta_consul_service]
        target_label: service_name
      - source_labels: [__meta_consul_node]
        target_label: node
```

---

## 🔄 Relabeling Examples

```yaml
# 1. Keep only targets with specific label
relabel_configs:
  - source_labels: [__meta_ec2_tag_Environment]
    action: keep
    regex: production

# 2. Drop targets with specific label
  - source_labels: [__meta_kubernetes_pod_phase]
    action: drop
    regex: Succeeded|Failed

# 3. Replace label value
  - source_labels: [__address__]
    action: replace
    target_label: instance
    regex: (.+):.*
    replacement: $1

# 4. Create new label from source
  - source_labels: [__meta_ec2_tag_Service, __meta_ec2_tag_Environment]
    separator: '-'
    target_label: service_full_name
    action: replace

# 5. Map all __meta_* labels to user-friendly names
  - action: labelmap
    regex: __meta_kubernetes_pod_label_(.+)

# 6. Set a hardcoded label
  - target_label: team
    replacement: platform

# 7. Hash a high-cardinality label (to reduce cardinality while retaining correlation)
  - source_labels: [__meta_kubernetes_pod_name]
    action: hashmod
    target_label: pod_hash
    modulus: 100
```

---

## 📊 Recording Rules

```yaml
groups:
  - name: cpu_recording_rules
    interval: 1m
    rules:
      - record: instance:node_cpu_utilisation:rate5m
        expr: 1 - rate(node_cpu_seconds_total{mode="idle"}[5m])

  - name: memory_recording_rules
    interval: 1m
    rules:
      - record: instance:node_memory_utilisation:ratio
        expr: 1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes

  - name: app_recording_rules
    interval: 1m
    rules:
      - record: job:http_errors:rate5m
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) by (job)
      - record: instance:http_request_latency:p95_5m
        expr: histogram_quantile(0.95, sum by (instance, le) (rate(http_request_duration_seconds_bucket[5m])))
```

### Naming Convention

```
<level>:<metric_name>:<operation>
  level:      aggregation level (instance, job, etc.)
  metric:     original metric name
  operation:  what was done (rate5m, p95, ratio)
```

Examples:
- `instance:cpu_utilisation:rate5m`
- `job:error_rate:ratio`
- `instance:request_latency_seconds:p95_5m`
- `cluster:memory_usage:avg1h`

---

## ⚙️ Prometheus CLI Flags

```bash
# Basic configuration
prometheus --config.file=/etc/prometheus/prometheus.yml

# Storage
prometheus --storage.tsdb.path=/data/prometheus
           --storage.tsdb.retention.time=30d
           --storage.tsdb.retention.size=50GB
           --storage.tsdb.wal-compression

# Query performance
prometheus --query.max-concurrency=20
           --query.timeout=2m
           --query.max-samples=50000000

# Web
prometheus --web.listen-address=:9090
           --web.enable-lifecycle  # Enable POST /-/reload
           --web.enable-remote-write-receiver  # Accept remote writes

# Alerting
prometheus --alertmanager.timeout=10s
           --alertmanager.notification-queue-capacity=10000

# TSDB
prometheus --storage.remote.read-concurrent-limit=10
           --storage.remote.write-max-conns=100

# Logging
prometheus --log.level=info
           --log.format=logfmt
```

---

## 🐳 Prometheus in Docker

```bash
# Basic run
docker run -d \
  --name=prometheus \
  -p 9090:9090 \
  -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  -v prometheus-data:/prometheus \
  prom/prometheus \
  --config.file=/etc/prometheus/prometheus.yml

# With all flags
docker run -d \
  --name=prometheus \
  --restart=unless-stopped \
  -p 9090:9090 \
  -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  -v $(pwd)/alert.rules.yml:/etc/prometheus/alert.rules.yml \
  -v prometheus-data:/prometheus \
  prom/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.retention.time=30d \
  --web.enable-lifecycle
```

---

## 🌐 Remote Write/Read

```yaml
# prometheus.yml
remote_write:
  - url: "https://cortex.example.com/api/v1/push"
    basic_auth:
      username: "prometheus"
      password: "secret"
    write_relabel_configs:
      - source_labels: [__name__]
        regex: "expensive_.*"
        action: drop
    queue_config:
      max_samples_per_send: 5000
      capacity: 10000

remote_read:
  - url: "https://cortex.example.com/api/v1/read"
    read_recent: true
    basic_auth:
      username: "prometheus"
      password: "secret"
```
