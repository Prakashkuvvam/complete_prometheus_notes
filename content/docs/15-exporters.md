---
title: "Exporters — Node Exporter, Blackbox & More"
weight: 15
bookToc: true
---

# Exporters

Exporters bridge the gap between systems that don't natively expose Prometheus metrics and the Prometheus ecosystem. They collect metrics from third-party systems and convert them to Prometheus format.

## What is an Exporter?

An exporter is a service that:
1. Reads metrics from a source system (OS, database, hardware)
2. Converts them to Prometheus metric format
3. Exposes an HTTP `/metrics` endpoint for scraping

## Official Prometheus Exporters

| Exporter | What It Monitors | Port |
|----------|-----------------|------|
| Node Exporter | Linux/Unix systems (CPU, memory, disk, network) | 9100 |
| Blackbox Exporter | External endpoints (HTTP, HTTPS, TCP, ICMP) | 9115 |
| Windows Exporter | Windows systems | 9182 |
| SNMP Exporter | Network devices (routers, switches) | 9116 |
| JMX Exporter | Java applications (JVM metrics) | varies |
| Postgres Exporter | PostgreSQL databases | 9187 |
| MySQL Exporter | MySQL/MariaDB databases | 9104 |
| MongoDB Exporter | MongoDB databases | 9216 |
| Redis Exporter | Redis instances | 9121 |
| RabbitMQ Exporter | RabbitMQ queues | 9419 |
| HAProxy Exporter | HAProxy load balancers | 9101 |
| Consul Exporter | HashiCorp Consul | 9107 |
| Elasticsearch Exporter | Elasticsearch clusters | 9114 |

## Node Exporter (Deep Dive)

The most widely used exporter — metrics about the host system.

### Installation

```bash
# Download and extract
wget https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz
tar xvf node_exporter-1.7.0.linux-amd64.tar.gz
cd node_exporter-1.7.0.linux-amd64

# Run
./node_exporter

# As a systemd service
cat > /etc/systemd/system/node_exporter.service <<EOF
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=nobody
ExecStart=/usr/local/bin/node_exporter
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```

### Key Metrics

**CPU Metrics:**
```promql
# CPU seconds per mode
node_cpu_seconds_total{cpu="0", mode="user"}

# CPU usage percentage
avg by (instance) (rate(node_cpu_seconds_total{mode!="idle"}[5m])) * 100
```

**Memory Metrics:**
```promql
# Total memory
node_memory_MemTotal_bytes

# Available memory
node_memory_MemAvailable_bytes

# Memory usage percentage
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100
```

**Disk Metrics:**
```promql
# Disk size and usage
node_filesystem_size_bytes{mountpoint="/"}
node_filesystem_free_bytes{mountpoint="/"}
node_filesystem_avail_bytes{mountpoint="/"}

# Disk I/O
rate(node_disk_read_bytes_total[5m])
rate(node_disk_written_bytes_total[5m])
```

**Network Metrics:**
```promql
# Network throughput
rate(node_network_receive_bytes_total[5m])
rate(node_network_transmit_bytes_total[5m])

# Network errors
rate(node_network_receive_errors_total[5m])
```

**System Metrics:**
```promql
# System load
node_load1     # 1-minute average
node_load5     # 5-minute average
node_load15    # 15-minute average

# Processes
node_processes_running
node_processes_blocked

# Uptime
node_time_seconds
node_boot_time_seconds
```

### Optional Collectors

Enable/disable specific collectors:

```bash
# Enable all collectors (default)
./node_exporter --collector.disable-defaults --collector.cpu --collector.meminfo

# Disable specific collectors
./node_exporter --no-collector.ntp --no-collector.zfs

# Enable additional collectors
./node_exporter --collector.textfile.directory=/var/lib/node_exporter/textfile
```

### Textfile Collector

For custom metrics that can't be instrumented directly:

```bash
# Write metrics to a file
echo 'cluster_health{env="prod"} 1' > /var/lib/node_exporter/textfile/cluster.prom

# Node Exporter picks up all .prom files in the directory
```

## Blackbox Exporter

Probes external endpoints and services.

### Installation

```bash
wget https://github.com/prometheus/blackbox_exporter/releases/download/v0.24.0/blackbox_exporter-0.24.0.linux-amd64.tar.gz
tar xvf blackbox_exporter-0.24.0.linux-amd64.tar.gz
./blackbox_exporter
```

### Configuration

```yaml
# blackbox.yml
modules:
  http_2xx:
    prober: http
    http:
      preferred_ip_protocol: ip4
      
  http_post_2xx:
    prober: http
    http:
      method: POST
      
  tcp_connect:
    prober: tcp
    
  icmp_check:
    prober: icmp
    
  https_2xx:
    prober: http
    http:
      preferred_ip_protocol: ip4
      tls: true
      valid_status_codes: [200, 201, 202]
```

### Prometheus Scrape Config

```yaml
scrape_configs:
  - job_name: 'blackbox-http'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets:
        - https://example.com
        - https://api.example.com/health
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: localhost:9115
```

### Key Blackbox Metrics

```promql
# Probe success (1=up, 0=down)
probe_success{instance="https://example.com"}

# Probe duration in seconds
probe_duration_seconds{instance="https://example.com"}

# HTTP status code
probe_http_status_code{instance="https://example.com"}

# DNS resolution time
probe_dns_lookup_time_seconds

# SSL certificate expiry
probe_ssl_earliest_cert_expiry
```

## Additional Exporters

### JMX Exporter (Java)

```yaml
# jmx_exporter_config.yml
rules:
  - pattern: 'java.lang<type=Memory><>HeapMemoryUsage'
    name: jvm_memory_heap_bytes
    type: GAUGE
  - pattern: 'java.lang<type=Threading><>ThreadCount'
    name: jvm_threads
    type: GAUGE
```

Run: `java -javaagent:jmx_prometheus_javaagent-0.20.0.jar=8080:config.yml -jar app.jar`

### Postgres Exporter

```yaml
# postgres_exporter configuration
scrape_configs:
  - job_name: postgres
    static_configs:
      - targets: ['localhost:9187']
```

Key metrics:
```promql
# Connections
pg_stat_database_numbackends
pg_stat_database_xact_commit + pg_stat_database_xact_rollback

# Replication lag
pg_replication_lag_seconds
```

### SNMP Exporter

For network devices (Cisco, Juniper, etc.):

```yaml
# snmp.yml (generated from MIBs)
modules:
  if_mib:
    walk:
      - 1.3.6.1.2.1.2    # interfaces
      - 1.3.6.1.2.1.31.1.1  # ifXTable
```

## Best Practices

1. **Run exporters as non-root users**
2. **Protect exporter endpoints** — use firewall rules or authentication
3. **Monitor the exporters themselves** — create alerts for down exporters
4. **Use the textfile collector** for custom scripts
5. **Keep exporters up to date** for security and new metrics
6. **Label consistently** — use the same instance/job naming across exporters

### Common Alert Rules

```yaml
groups:
  - name: exporters
    rules:
      - alert: NodeExporterDown
        expr: absent(up{job="node"})
        for: 5m
        annotations:
          summary: "Node Exporter is down"

      - alert: BlackboxProbeFailing
        expr: probe_success == 0
        for: 2m
        annotations:
          summary: "Blackbox probe failed"
```

---

## 🌐 Real-World Scenario: Building a Complete Node Exporter Alert Suite

### The Challenge

You've deployed Node Exporter on 50 production servers. Now you need to build a comprehensive alerting suite that catches real issues without causing alert fatigue.

### Step 1: Create Tiered Alerts (Not Everything is Critical)

```yaml
groups:
  - name: node_exporter_alerts
    interval: 30s
    rules:
      # ⚠️ CRITICAL: Page the on-call engineer
      - alert: NodeDown
        expr: up{job="node"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Node {{ $labels.instance }} is down"

      - alert: DiskFull
        expr: node_filesystem_free_bytes{mountpoint="/",job="node"} / node_filesystem_size_bytes{mountpoint="/",job="node"} * 100 < 5
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Disk is almost full on {{ $labels.instance }}"
          description: "Only {{ $value | humanize }}% disk space remaining"

      # ⚠️ WARNING: Create a ticket, investigate in business hours
      - alert: HighCPUUsage
        expr: avg by (instance) (rate(node_cpu_seconds_total{mode!="idle"}[5m])) * 100 > 85
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "High CPU on {{ $labels.instance }}"
          description: "CPU usage is at {{ $value | humanize }}% for 15+ minutes"

      - alert: HighMemoryUsage
        expr: (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 > 90
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "High memory on {{ $labels.instance }}"

      # 🛈 INFO: Log for capacity planning
      - alert: DiskFullIn7Days
        expr: predict_linear(node_filesystem_free_bytes{mountpoint="/"}[7d], 7*86400) < 0
        for: 1h
        labels:
          severity: info
        annotations:
          summary: "{{ $labels.instance }} disk will fill in 7 days"
```

### Step 2: Build a Node Exporter Debug Dashboard Query

```promql
# Quick health check — all nodes status
# Returns 0 if healthy, 1+ if issues

# CPU health:
avg by (instance) (rate(node_cpu_seconds_total{mode!="idle"}[5m])) * 100 > 85

# Memory health:
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 > 90

# Disk health (for / mount):
(node_filesystem_free_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 10

# Combined health score (0 = healthy, 3 = all unhealthy):
(
  (avg by (instance) (rate(node_cpu_seconds_total{mode!="idle"}[5m])) * 100 > 85)
  +
  ((1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 > 90)
  +
  ((node_filesystem_free_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 10)
)
```

### Step 3: Textfile Collector for Custom Scripts

```bash
#!/bin/bash
# /usr/local/bin/node_custom_metrics.sh

# Custom metric: Number of failed SSH login attempts
# (Parses /var/log/auth.log)

FAILED_SSH=$(grep "Failed password" /var/log/auth.log | wc -l)
echo "# HELP node_failed_ssh_logins_total Total failed SSH login attempts"
echo "# TYPE node_failed_ssh_logins_total counter"
echo "node_failed_ssh_logins_total $FAILED_SSH"

# Custom metric: Certificate expiry days
CERT_DAYS=$(openssl x509 -checkend $((86400 * 30)) -in /etc/ssl/cert.pem && echo "30" || echo "$(openssl x509 -checkend 0 -in /etc/ssl/cert.pem && echo "0" || echo "-1")")
echo "# HELP node_cert_days_until_expiry Days until SSL certificate expires"
echo "# TYPE node_cert_days_until_expiry gauge"
echo "node_cert_days_until_expiry $CERT_DAYS"
```

```bash
# Run via cron every 5 minutes
*/5 * * * * /usr/local/bin/node_custom_metrics.sh > /var/lib/node_exporter/textfile/custom.prom
```

### Step 4: Node Exporter Troubleshooting

```bash
# Problem: Node Exporter not showing metrics

# 1. Is it running?
systemctl status node_exporter

# 2. Is the port open?
ss -tlnp | grep 9100

# 3. Can we scrape it?
curl http://localhost:9100/metrics | head

# 4. Is Prometheus reaching it?
# Check: http://prometheus:9090/targets → look for job="node"

# 5. Check firewall
sudo iptables -L -n | grep 9100

# 6. Check SELinux
sudo ausearch -m avc -ts recent | grep node_exporter
```

### Common Node Exporter Issues

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Permission denied** | Can't read /proc/diskstats | Run as root or use capabilities |
| **Missing metrics** | Some collectors empty | Enable with `--collector.disable-defaults --collector.xxx` |
| **Textfile dir missing** | Textfile collector not working | `mkdir -p /var/lib/node_exporter/textfile` |
| **Too many metrics** | Scrape takes > 10s | Disable unused collectors |
| **Port conflict** | Can't bind to 9100 | Use `--web.listen-address=:9101` |

---

**Key Takeaways:**
- Node Exporter is the foundation for host-level monitoring
- Blackbox Exporter probes external endpoints (HTTP, TCP, ICMP)
- Each database/middleware has a dedicated exporter
- Use the textfile collector for custom metrics from scripts
- Relabeling is essential for proper Blackbox Exporter integration
- Monitor your exporters with alerting rules

---

## 🔗 Related Chapters

- [Chapter 7: Service Discovery & Scraping]({{< relref "07-service-discovery-scraping" >}}) — Configuring Prometheus to scrape exporters
- [Chapter 14: Client Libraries & Instrumentation]({{< relref "14-client-libraries-instrumentation" >}}) — Instrumenting applications directly
- [Chapter 16: Pushgateway]({{< relref "16-pushgateway" >}}) — Alternative for short-lived jobs

## 📚 Additional Resources

- [Prometheus Exporters List](https://prometheus.io/docs/instrumenting/exporters/)
- [Node Exporter GitHub](https://github.com/prometheus/node_exporter)
- [Blackbox Exporter GitHub](https://github.com/prometheus/blackbox_exporter)
- [Exporters Best Practices](https://prometheus.io/docs/instrumenting/exporters/#best-practices)

---

*Continue to → [Chapter 16: Pushgateway]({{< relref "16-pushgateway" >}})*
