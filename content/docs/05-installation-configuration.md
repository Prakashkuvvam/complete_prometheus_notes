---
title: "Chapter 5: Installation & Configuration"
weight: 5
bookFlatSection: false
bookToc: true
---

# Chapter 5: Installation & Configuration

## 🎯 Learning Objectives

- Install Prometheus server on Linux
- Configure Prometheus from scratch
- Understand all configuration file sections
- Run Prometheus with Docker
- Work with promtool for validation
- Set up the basic monitoring stack

---

## 5.1 Installing Prometheus

### Method 1: Pre-compiled Binary (Recommended)

```bash
# Download the latest version
wget https://github.com/prometheus/prometheus/releases/download/v2.53.0/prometheus-2.53.0.linux-amd64.tar.gz

# Extract
tar xvf prometheus-2.53.0.linux-amd64.tar.gz

# Move to /usr/local
sudo mv prometheus-2.53.0.linux-amd64 /usr/local/prometheus

# Create symlink
sudo ln -s /usr/local/prometheus/prometheus /usr/local/bin/prometheus

# Check version
prometheus --version
```

### Method 2: Docker

```bash
# Quick start
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus:latest

# With additional config files
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  -v $(pwd)/rules:/etc/prometheus/rules \
  -v prometheus-data:/prometheus \
  prom/prometheus:latest \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/prometheus \
  --storage.tsdb.retention.time=30d
```

### Method 3: Kubernetes (kube-prometheus-stack)

```bash
# Add Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install the kube-prometheus-stack
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# This installs: Prometheus, Alertmanager, Grafana, Node Exporter, kube-state-metrics
```

### Method 4: Package Manager

```bash
# macOS
brew install prometheus

# Verify installation location
which prometheus
# /opt/homebrew/bin/prometheus

# Start as service
brew services start prometheus
```

---

## 5.2 Basic Configuration File

### Minimal `prometheus.yml`

```yaml
# Minimal working configuration
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

### Running with Custom Config

```bash
# Create config directory
mkdir -p /etc/prometheus

# Save config
cat > /etc/prometheus/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['localhost:9093']

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
EOF

# Run prometheus
prometheus --config.file=/etc/prometheus/prometheus.yml
```

---

## 5.3 Configuration File Deep Dive

### Section 1: `global` Settings

```yaml
global:
  # How frequently to scrape targets
  scrape_interval: 15s

  # How frequently to evaluate rules
  evaluation_interval: 15s

  # How long to wait before timing out a scrape
  scrape_timeout: 10s

  # Labels added to every time series and alert
  external_labels:
    cluster: 'production'
    region: 'us-east-1'
    environment: 'prod'
```

### Section 2: `alerting` Configuration

```yaml
alerting:
  alert_relabel_configs:      # Relabel alerts before sending
    - source_labels: [dc]
      regex: (.+)
      target_label: datacenter

  alertmanagers:
    - scheme: http
      path_prefix: /
      timeout: 10s
      api_version: v2
      static_configs:
        - targets:
          - alertmanager:9093
          - alertmanager-backup:9093
```

### Section 3: `rule_files`

```yaml
rule_files:
  - "rules/*.yml"               # All rule files in rules directory
  - "first_rules.yml"           # Single file
  - "/etc/prometheus/*.rules"   # Wildcard path
```

### Section 4: `scrape_configs`

```yaml
scrape_configs:
  # Job definition
  - job_name: 'node'

    # Scrape interval (overrides global)
    scrape_interval: 30s

    # HTTP path
    metrics_path: /metrics

    # HTTP scheme
    scheme: http

    # Scrape timeout (must be < scrape_interval)
    scrape_timeout: 10s

    # Static targets (one method)
    static_configs:
      - targets:
          - 'localhost:9100'
          - 'node-1:9100'
        labels:
          environment: 'production'

    # Relabeling
    relabel_configs:
      - source_labels: [__address__]
        regex: '(.*):10250'
        replacement: '${1}:9100'
        target_label: __address__

    # Metric relabeling
    metric_relabel_configs:
      - source_labels: [__name__]
        regex: 'container_(.*)'
        action: keep

    # Authorization
    authorization:
      type: Bearer
      credentials_file: /etc/prometheus/token
```

---

## 5.4 Service Discovery Configuration

### Static Service Discovery

```yaml
scrape_configs:
  - job_name: 'static'
    static_configs:
      - targets: ['server1:9100', 'server2:9100']
        labels:
          datacenter: 'dc1'
      - targets: ['server3:9100']
        labels:
          datacenter: 'dc2'
```

### File-Based Service Discovery

```yaml
scrape_configs:
  - job_name: 'file_sd'
    file_sd_configs:
      - files:
          - 'targets/*.json'
          - 'targets/*.yaml'
        refresh_interval: 5m
```

Target files format:

```json
[
  {
    "targets": ["10.0.1.1:9100", "10.0.1.2:9100"],
    "labels": {
      "environment": "production",
      "service": "web"
    }
  }
]
```

```yaml
# targets/web.yaml
- targets:
    - "10.0.1.1:9100"
    - "10.0.1.2:9100"
  labels:
    environment: production
    service: web
```

### Kubernetes Service Discovery

```yaml
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
      - source_labels: [__meta_kubernetes_pod_label_app]
        target_label: app
      - source_labels: [__meta_kubernetes_namespace]
        target_label: namespace
```

---

## 5.5 promtool — The Validation Tool

`promtool` is included with every Prometheus release.

### Common promtool Commands

```bash
# Check configuration file syntax
promtool check config prometheus.yml

# Check rules file syntax
promtool check rules rules/alerts.yml

# Test alert rules against scenarios
promtool test rules test.yml

# Query instant
promtool query instant http://localhost:9090 'up'

# Query range
promtool query range http://localhost:9090 \
  'rate(http_requests_total[5m])' \
  '2024-01-01T00:00:00Z' \
  '2024-01-02T00:00:00Z' \
  5m

# Debug metrics
promtool debug metrics http://localhost:9090

# TSDB analysis
promtool tsdb analyze ./data
```

### Example: Validating Configuration

```bash
$ promtool check config prometheus.yml
Checking prometheus.yml
  SUCCESS: 0 rule files found

 # If there's an error:
$ promtool check config broken.yml
Checking broken.yml
  FAILED: parsing YAML file broken.yml: yaml: line 8: found character that cannot start any token
```

---

## 5.6 Running Prometheus as a Service

### Systemd Service File

```ini
# /etc/systemd/system/prometheus.service
[Unit]
Description=Prometheus Time Series Collection and Processing Server
Documentation=https://prometheus.io/docs/introduction/overview/
After=network.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/var/lib/prometheus/ \
  --storage.tsdb.retention.time=30d \
  --web.console.templates=/etc/prometheus/consoles \
  --web.console.libraries=/etc/prometheus/console_libraries \
  --web.listen-address=0.0.0.0:9090

Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
# Create prometheus user
sudo useradd --no-create-home --shell /bin/false prometheus

# Create directories
sudo mkdir -p /var/lib/prometheus
sudo mkdir -p /etc/prometheus/rules
sudo mkdir -p /etc/prometheus/consoles
sudo mkdir -p /etc/prometheus/console_libraries

# Copy binaries and config
sudo cp prometheus /usr/local/bin/
sudo cp promtool /usr/local/bin/
sudo cp prometheus.yml /etc/prometheus/

# Set ownership
sudo chown -R prometheus:prometheus /var/lib/prometheus
sudo chown -R prometheus:prometheus /etc/prometheus

# Enable and start
sudo systemctl enable prometheus
sudo systemctl start prometheus
sudo systemctl status prometheus
```

---

## 5.7 Web UI and API

### Accessing Prometheus UI

```
http://localhost:9090    → Prometheus UI
http://localhost:9090/graph  → Graph/Query tab
http://localhost:9090/alerts → Alert rules status
http://localhost:9090/targets → Scrape targets
http://localhost:9090/flags  → Server flags
http://localhost:9090/config → Applied configuration
http://localhost:9090/rules  → Rule evaluation status
http://localhost:9090/tsdb-status → TSDB statistics
```

### Key API Endpoints

```bash
# Query instant
curl 'http://localhost:9090/api/v1/query?query=up'

# Query range
curl 'http://localhost:9090/api/v1/query_range?query=up&start=2024-01-01T00:00:00Z&end=2024-01-02T00:00:00Z&step=15s'

# List all series
curl 'http://localhost:9090/api/v1/series?match[]=up'

# Get label values
curl 'http://localhost:9090/api/v1/label/__name__/values'

# Get target status
curl 'http://localhost:9090/api/v1/targets'

# Get rules
curl 'http://localhost:9090/api/v1/rules'

# Get alerts
curl 'http://localhost:9090/api/v1/alerts'

# TSDB stats
curl 'http://localhost:9090/api/v1/status/tsdb'

# Config reload (POST)
curl -X POST http://localhost:9090/-/reload
```

---

## 5.8 Configuration Reload

Prometheus supports reloading configuration **without restarting**:

### Method 1: SIGHUP Signal

```bash
# Send SIGHUP to reload
kill -HUP $(pidof prometheus)

# Or if running as systemd
sudo systemctl reload prometheus
```

### Method 2: HTTP Endpoint

```bash
# POST to reload endpoint (--web.enable-lifecycle required)
curl -X POST http://localhost:9090/-/reload
```

> **Note:** To use the HTTP endpoint, you must start Prometheus with `--web.enable-lifecycle`.

---

## 🌐 Real-World Scenario: Production Deployment Walkthrough

### The Challenge

You're tasked with deploying Prometheus to monitor a production e-commerce platform: 50 microservices, 200+ pods across 3 Kubernetes namespaces, plus 10 bare-metal database servers.

### Step 1: Design the Scrape Strategy

```yaml
# prometheus.yml — production config
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'prod-us-east'
    environment: 'production'

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - '/etc/prometheus/rules/*.yml'

scrape_configs:
  # Self-monitoring
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Kubernetes pods (with annotation-based discovery)
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: 'true'
      - source_labels: [__meta_kubernetes_namespace]
        target_label: namespace
      - source_labels: [__meta_kubernetes_pod_name]
        target_label: pod
      - source_labels: [__meta_kubernetes_pod_label_app]
        target_label: app

  # Bare-metal database servers
  - job_name: 'database-servers'
    file_sd_configs:
      - files: ['/etc/prometheus/targets/databases.yml']
        refresh_interval: 1m

  # Node exporters on all servers
  - job_name: 'node'
    static_configs:
      - targets:
          - 'db-1:9100'
          - 'db-2:9100'
          - 'k8s-node-1:9100'
          - 'k8s-node-2:9100'
          - 'k8s-node-3:9100'
```

### Step 2: Validate with promtool

```bash
# Validate the config before deploying
$ promtool check config prometheus.yml
Checking prometheus.yml
  SUCCESS: 2 rule files found, 0 parsing errors

# Test rule files
$ promtool check rules /etc/prometheus/rules/alerts.yml
Checking /etc/prometheus/rules/alerts.yml
  SUCCESS: 15 rules found

# Dry-run TSDB analysis to estimate storage
$ promtool tsdb analyze --extend=true ./data
```

### Step 3: Deploy with Systemd

```bash
# Create service file
sudo tee /etc/systemd/system/prometheus.service << 'SERVICEEOF'
[Unit]
Description=Prometheus
Documentation=https://prometheus.io/docs/introduction/overview/
After=network.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/data/prometheus \
  --storage.tsdb.retention.time=30d \
  --storage.tsdb.wal-compression \
  --web.enable-lifecycle

Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Start the service
sudo systemctl daemon-reload
sudo systemctl enable prometheus
sudo systemctl start prometheus
sudo systemctl status prometheus
```

### Step 4: Verify Deployment

```bash
# Check the targets page
curl http://localhost:9090/api/v1/targets | jq '.data.activeTargets | length'
# Expected: ~210 targets (200 pods + 5 nodes + 5 databases)

# Check all targets are UP
curl http://localhost:9090/api/v1/query?query=count(up==0)
# Expected: 0 (no targets down)

# Check scrape duration
curl http://localhost:9090/api/v1/query?query=scrape_duration_seconds
# Expected: < 1s per target

# Verify alert rules are loaded
curl http://localhost:9090/api/v1/rules | jq '.data.groups[].rules | length'
# Expected: 15 alert rules
```

### Step 5: Common Deployment Issues & Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Config error** | Prometheus won't start | Run `promtool check config` first |
| **Permission denied** | Can't read config or data dir | `chown prometheus:prometheus` |
| **Port in use** | `bind: address already in use` | Check with `ss -tlnp \| grep 9090` |
| **Too many targets** | `scrape_timeout` exceeded | Increase `scrape_interval` or add another Prometheus |
| **DNS resolution** | Targets show as unknown | Check `nslookup target-name` |
| **WAL corruption** | Prometheus crashes on restart | Delete WAL (lose ~2h data), let it rebuild |

### Step 6: Ongoing Operations

```bash
# Reload config without restarting
curl -X POST http://localhost:9090/-/reload

# Check resource usage
curl http://localhost:9090/api/v1/query?query=process_resident_memory_bytes
curl http://localhost:9090/api/v1/query?query=prometheus_tsdb_head_series

# Backup TSDB
sudo tar czf /backup/prometheus-$(date +%Y%m%d).tar.gz /data/prometheus
```

---

## 📝 Exam Tips

1. **Default ports:** Prometheus = 9090, Alertmanager = 9093, Pushgateway = 9091
2. **`scrape_timeout` must be less than `scrape_interval`**
3. **Default scrape_interval:** 1 minute (but 15s is typical)
4. **promtool** is the validation tool — know `check config` and `check rules`
5. **Configuration reload:** SIGHUP or `/-/reload` (with `--web.enable-lifecycle`)
6. **`global` section** sets defaults for all jobs
7. **`evaluation_interval`** controls how often rules are evaluated (not scraping)
8. **`external_labels`** are added to every metric and alert

---

## ✅ Chapter 5 Quiz

1. **What is the default scrape interval in Prometheus?**
   - a) 15s
   - b) 30s
   - c) 1m
   - d) 5m

2. **Which command validates a Prometheus configuration file?**
   - a) `prometheus validate`
   - b) `promtool check config`
   - c) `prometheus --check`
   - d) `validate-prometheus`

3. **How can you reload Prometheus configuration without restarting?**
   - a) Restart the process
   - b) Send SIGTERM
   - c) Send SIGHUP or POST to /-/reload
   - d) Delete the config file

4. **What is the default port for the Prometheus web interface?**
   - a) 9093
   - b) 9091
   - c) 9090
   - d) 3000

5. **Which configuration flag enables the HTTP reload endpoint?**
   - a) `--web.enable-admin-api`
   - b) `--web.enable-lifecycle`
   - c) `--config.reload`
   - d) `--http.reload`

<details>
<summary>📌 Answers</summary>

1. **c** — Default scrape interval is 1 minute (60s)
2. **b** — `promtool check config` validates the configuration file
3. **c** — SIGHUP signal or POST to `/-/reload` with `--web.enable-lifecycle`
4. **c** — Prometheus web interface defaults to port 9090
5. **b** — `--web.enable-lifecycle` enables the HTTP reload endpoint
</details>

---

## 🔗 Related Chapters

- [Chapter 4: Prometheus Architecture & Core Concepts]({{< relref "04-prometheus-architecture" >}}) — Understanding Prometheus components
- [Chapter 7: Service Discovery & Scraping]({{< relref "07-service-discovery-scraping" >}}) — Dynamic target discovery
- [Chapter 8: Storage & Retention]({{< relref "08-storage-retention" >}}) — Configuring storage and retention

## 📚 Additional Resources

- [Prometheus Installation Guide](https://prometheus.io/docs/prometheus/latest/installation/)
- [Prometheus Configuration Reference](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)
- [promtool Documentation](https://prometheus.io/docs/prometheus/latest/command-line/promtool/)
- [Prometheus API Reference](https://prometheus.io/docs/prometheus/latest/querying/api/)

---

*Continue to → [Chapter 6: Data Model & Metric Types]({{< relref "06-data-model-metric-types" >}})*
