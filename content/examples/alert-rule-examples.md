---
title: "Alert Rule Examples"
weight: 4
bookToc: true
---

# Alert Rule Examples

> Production-ready Prometheus alerting rules. Each includes the rationale and runbook link.

---

## 🔴 Infrastructure Alerts

### Node Down

```yaml
- alert: NodeDown
  expr: up{job="node_exporter"} == 0
  for: 1m
  labels:
    severity: critical
  annotations:
    summary: "Node {{ $labels.instance }} is down"
    description: "Node has been unreachable for more than 1 minute."
```

### CPU Saturation

```yaml
- alert: CPUSaturation
  expr: |
    avg by (instance) (
      rate(node_cpu_seconds_total{mode="user"}[5m])
    ) > 0.9
  for: 15m
  labels:
    severity: warning
  annotations:
    summary: "CPU saturated on {{ $labels.instance }}"
    description: "CPU user mode is above 90% for 15 minutes ({{ $value | humanizePercentage }})."
```

### Memory Pressure

```yaml
- alert: MemoryPressure
  expr: |
    (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 > 90
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: "Memory pressure on {{ $labels.instance }}"
    description: "Memory usage is {{ $value | humanizePercentage }} for over 10 minutes."
```

### Disk Space

```yaml
- alert: DiskSpaceCritical
  expr: |
    (node_filesystem_free_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 5
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "Critical disk space on {{ $labels.instance }}"
    description: "Only {{ $value | humanizePercentage }} free on {{ $labels.mountpoint }}."
    runbook: "https://wiki.internal/runbooks/disk-space"
```

### Disk IO Saturation

```yaml
- alert: DiskIOSaturation
  expr: rate(node_disk_io_time_seconds_total[5m]) > 0.5
  for: 15m
  labels:
    severity: warning
  annotations:
    summary: "Disk I/O saturation on {{ $labels.instance }}"
    description: "I/O utilization is over 50% for 15 minutes."
```

### Network Errors

```yaml
- alert: NetworkErrors
  expr: rate(node_network_receive_errors_total[5m]) > 0.01
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: "Network errors detected on {{ $labels.instance }}"
    description: "Interface {{ $labels.device }} has {{ $value | humanizePercentage }} error rate."
```

---

## 🟡 Application Alerts

### High Error Rate

```yaml
- alert: HighErrorRate
  expr: |
    sum(rate(http_requests_total{status=~"5.."}[5m]))
    /
    sum(rate(http_requests_total[5m]))
    * 100 > 5
  for: 3m
  labels:
    severity: critical
  annotations:
    summary: "High HTTP error rate ({{ $value | humanizePercentage }})"
    description: "Error rate is {{ $value | humanizePercentage }} over the last 5 minutes (threshold: 5%)."
    runbook: "https://wiki.internal/runbooks/high-error-rate"
```

### High Latency

```yaml
- alert: HighLatency
  expr: |
    histogram_quantile(0.95,
      sum by (le) (rate(http_request_duration_seconds_bucket{job="api"}[5m]))
    ) > 2.0
  for: 10m
  labels:
    severity: critical
  annotations:
    summary: "High p95 latency on API ({{ $value }}s)"
    description: "p95 latency is {{ $value }}s for over 10 minutes (threshold: 2s)."
```

### No Traffic / Dead Service

```yaml
- alert: NoTraffic
  expr: absent(rate(http_requests_total[5m])) or rate(http_requests_total[5m]) == 0
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "No traffic detected for {{ $labels.job }}"
    description: "{{ $labels.job }} has received 0 requests for 5 minutes."
```

### Application Down (via Blackbox)

```yaml
- alert: ProbeFailed
  expr: probe_success == 0
  for: 1m
  labels:
    severity: critical
  annotations:
    summary: "Probe failed for {{ $labels.instance }}"
    description: "Blackbox probe to {{ $labels.instance }} has been failing for 1 minute."
```

### Certificate Expiry

```yaml
- alert: SSLCertExpiring
  expr: probe_ssl_earliest_cert_expiry - time() < 86400 * 14  # 14 days
  for: 1h
  labels:
    severity: warning
  annotations:
    summary: "SSL certificate expiring on {{ $labels.instance }}"
    description: "Certificate expires in {{ $value | humanizeDuration }}."
    runbook: "https://wiki.internal/runbooks/cert-renewal"
```

---

## 🟣 Prometheus Self-Monitoring

### Prometheus Down

```yaml
- alert: PrometheusDown
  expr: absent(up{job="prometheus"})
  for: 1m
  labels:
    severity: critical
  annotations:
    summary: "Prometheus is down"
    description: "Prometheus instance {{ $labels.instance }} is unreachable."
```

### Scrape Target Missing

```yaml
- alert: ScrapeTargetMissing
  expr: up == 0
  for: 2m
  labels:
    severity: warning
  annotations:
    summary: "Scrape target {{ $labels.instance }} is down"
    description: "Target {{ $labels.instance }} (job: {{ $labels.job }}) has been down for 2 minutes."
```

### Too Many Samples

```yaml
- alert: TooManySamples
  expr: rate(prometheus_tsdb_head_samples_appended_total[5m]) > 1000000
  for: 15m
  labels:
    severity: warning
  annotations:
    summary: "High sample ingestion rate"
    description: "Prometheus is ingesting {{ $value | humanize }} samples/second. Consider reducing cardinality."
```

### TSDB Block Corruption

```yaml
- alert: TSDBErrors
  expr: rate(prometheus_tsdb_failed_compactions_total[5m]) > 0
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "TSDB compaction errors on {{ $labels.instance }}"
    description: "TSDB is experiencing compaction failures."
```

---

## 🟠 Prediction-Based Alerts

### Disk Full Prediction

```yaml
- alert: DiskFullIn7Days
  expr: predict_linear(node_filesystem_free_bytes{mountpoint="/"}[7d], 7*86400) < 0
  for: 1h
  labels:
    severity: info
  annotations:
    summary: "Disk will be full in 7 days on {{ $labels.instance }}"
    description: "Current trend indicates disk exhaustion within 7 days."
```

### Memory Exhaustion Prediction

```yaml
- alert: MemoryExhaustionImminent
  expr: predict_linear(node_memory_MemAvailable_bytes[6h], 6*3600) < 100 * 1024 * 1024  # < 100MB
  for: 30m
  labels:
    severity: warning
  annotations:
    summary: "Memory exhaustion imminent on {{ $labels.instance }}"
    description: "Memory is projected to drop below 100MB in 6 hours."
```

---

## 🟤 SLO Burn Rate Alerts

### Fast Burn (Multi-Window, Multi-Burn-Rate)

```yaml
# Alert when error budget is burning fast
- alert: SLOErrorBudgetBurnRate
  expr: |
    (
      sum(rate(http_requests_total{status=~"5.."}[5m]))
      /
      sum(rate(http_requests_total[5m]))
    ) > 0.001  # 99.9% SLO = 0.001 error budget
  for: 1h
  labels:
    severity: critical
  annotations:
    summary: "SLO error budget burning too fast"
    description: |
      Error budget burn rate is {{ $value | humanizePercentage }}.
      Budget will exhaust in {{ humanizeDuration (0.001 / $value * 30 * 24) }}.
```

---

## 🔵 Alert Rule Writing Principles

1. **Be specific** — Alert on concrete, observable conditions, not vague symptoms
2. **Use `for:`** — Prevent flapping (minimum 1-5m for most alerts)
3. **Include runbook URLs** — Every alert should link to resolution steps
4. **Set appropriate severity** — Not everything is critical
5. **Add meaningful annotations** — Include the actual metric value
6. **Group by service tier** — Separate infra vs app vs capacity alerts
7. **Use inhibition** — Silence lower-priority alerts during outages
8. **Test with `promtool`** — Validate rules before deploying
9. **Monitor your alerts** — Track alert fatigue and adjust thresholds
10. **Keep the noise down** — If an alert hasn't been actionable, adjust or remove it
