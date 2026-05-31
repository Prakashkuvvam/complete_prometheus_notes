---
title: "Alerting Rules & Alertmanager Configuration"
weight: 17
bookToc: true
---

# Alerting Rules & Alertmanager

Alerting is a core Prometheus feature. This chapter covers alerting rules, the Alertmanager, and how to build effective alerting pipelines.

## Alerting Architecture

```
Prometheus ──alerts──> Alertmanager ──notifications──> Email, PagerDuty, Slack, etc.
     │                                                      │
     │                                                  Deduplication
     │                                                  Grouping
     │                                                  Silencing
     │                                                  Inhibition
```

1. **Prometheus** evaluates alerting rules and sends firing/resolved alerts to Alertmanager
2. **Alertmanager** handles deduplication, grouping, routing, silencing, and inhibition
3. **Alertmanager** sends notifications via configured receivers

## Alerting Rules

Alerting rules are defined in rule files and loaded by Prometheus.

### Rule File Format

```yaml
# /etc/prometheus/alerting-rules.yml
groups:
  - name: node_alerts
    interval: 30s        # How often to evaluate (default: prometheus evaluation interval)
    rules:
      - alert: HighCPULoad
        expr: rate(node_cpu_seconds_total{mode="user"}[5m]) > 0.8
        for: 10m         # Must be true for 10 minutes before firing
        labels:
          severity: critical
          team: platform
        annotations:
          summary: "High CPU load on {{ $labels.instance }}"
          description: "CPU usage is at {{ $value | printf '%.1f' }} for over 10 minutes"
          runbook: "https://runbook.internal/cpu-load"
```

### Rule Components

| Component | Description | Required |
|-----------|-------------|----------|
| `alert` | Alert name — must be unique within a group | Yes |
| `expr` | PromQL expression that returns a vector when true | Yes |
| `for` | Duration the condition must hold before firing | No |
| `labels` | Additional labels added to the alert | No |
| `annotations` | Human-readable information (summary, description, runbook) | No |

### The `for` Clause

The `for` clause prevents flapping — alerts only fire after persisting:

```yaml
# Alert fires after 5 minutes of sustained high CPU
- alert: HighCPULoad
  expr: rate(node_cpu_seconds_total{mode="user"}[5m]) > 0.8
  for: 5m
```

**States:**
1. `pending` — expr is true, `for` duration not yet reached
2. `firing` — expr has been true for >= `for` duration
3. `resolved` — expr becomes false after firing

### Template Variables

Use template variables to create dynamic alert messages:

```yaml
- alert: HighMemoryUsage
  expr: (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 > 90
  for: 5m
  annotations:
    summary: "High memory usage on {{ $labels.instance }}"
    description: |
      Memory usage is {{ $value | humanizePercentage }} 
      ({{ humanize1024 $value }} used of {{ humanize1024 node_memory_MemTotal_bytes }})
    runbook: "https://wiki.internal/alerts/memory"

- alert: InstanceDown
  expr: up == 0
  for: 1m
  annotations:
    summary: "Instance {{ $labels.instance }} is down"
    description: "{{ $labels.instance }} of job {{ $labels.job }} has been down for more than 1 minute."
```

### Common Alerting Patterns

**1. Threshold Alerts:**
```yaml
- alert: DiskSpaceLow
  expr: (node_filesystem_free_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 10
  for: 5m
```

**2. Rate Anomaly Alerts:**
```yaml
- alert: ErrorRateHigh
  expr: |
    sum(rate(http_requests_total{status=~"5.."}[5m])) 
    / sum(rate(http_requests_total[5m])) * 100 > 5
  for: 5m
```

**3. Absence Alerts (Dead Man's Switch):**
```yaml
- alert: NoData
  expr: absent(up{job="api"}) == 1
  for: 5m
```

**4. Prediction Alerts:**
```yaml
- alert: DiskFullIn24h
  expr: predict_linear(node_filesystem_free_bytes[1h], 24*3600) < 0
  for: 10m
```

**5. Comparison Alerts:**
```yaml
- alert: CPUAnomaly
  expr: |
    rate(node_cpu_seconds_total{mode="user"}[5m]) 
    > 2 * avg_over_time(rate(node_cpu_seconds_total{mode="user"}[5m])[1h:5m])
  for: 10m
```

## Alertmanager Configuration

The Alertmanager is a separate binary that handles alert routing and notifications.

### Installation

```bash
wget https://github.com/prometheus/alertmanager/releases/download/v0.27.0/alertmanager-0.27.0.linux-amd64.tar.gz
tar xvf alertmanager-0.27.0.linux-amd64.tar.gz
cd alertmanager-0.27.0.linux-amd64
./alertmanager
```

### Configuration

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  smtp_smarthost: 'smtp.example.com:587'
  smtp_from: 'alertmanager@example.com'
  smtp_auth_username: 'alertmanager'
  smtp_auth_password: 'password'

route:
  receiver: 'default'
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty'
      repeat_interval: 1h
    - match:
        team: platform
      receiver: 'slack-platform'

receivers:
  - name: 'default'
    email_configs:
      - to: 'team@example.com'

  - name: 'pagerduty'
    pagerduty_configs:
      - routing_key: 'your-pagerduty-key'

  - name: 'slack-platform'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/T.../B.../xxx'
        channel: '#alerts-platform'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ .CommonAnnotations.description }}'
```

## Prometheus → Alertmanager Integration

Configure Prometheus to send alerts:

```yaml
# prometheus.yml
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['localhost:9093']

rule_files:
  - "/etc/prometheus/alerting-rules.yml"
```

Check alert status: `http://prometheus:9090/alerts`

## Alert Lifecycle

```
Rule evaluation ──> Labels ──> Annotations
                        │
                        ▼
                  pending state
                        │
                    (for duration)
                        │
                        ▼
                  firing state
                        │
                        ▼
              ┌─── Alertmanager ───┐
              │ Group by labels    │
              │ Deduplicate        │
              │ Inhibit/Silence    │
              │ Route to receiver  │
              └────────────────────┘
                        │
                        ▼
                Notification sent
```

## Testing Alert Rules

Before deploying, test rules offline:

```bash
# Validate rule files
promtool check rules /etc/prometheus/alerting-rules.yml

# Test rules against metrics
promtool test rules /etc/prometheus/alerting-rules.yml
```

## Best Practices

1. **Use `for` clauses** — prevent flapping alerts (minimum 1-5 minutes)
2. **Include runbook URLs** — every alert should link to a runbook
3. **Keep alert names unique** — follow naming convention: `MeaningfulName`
4. **Add severity labels** — `critical`, `warning`, `info`
5. **Set appropriate grouping** — prevent alert fatigue
6. **Test rules with `promtool`** before deploying
7. **Don't alert on everything** — focus on actionable conditions
8. **Include metric values** in annotations for context

---

## 🌐 Real-World Scenario: Designing a Multi-Tier Alerting Strategy

### The Challenge

You're building an alerting system for a production e-commerce platform. You need to alert on the right things, at the right severity, without overwhelming the on-call team.

### Step 1: Define Alert Tiers

```yaml
# Tier 1 — Page on-call immediately (critical production issues)
groups:
  - name: tier1_critical
    interval: 30s
    rules:
      - alert: ServiceDown
        expr: up{job=~"api|web|worker"} == 0
        for: 1m
        labels:
          severity: critical
          tier: 1
          pager: true

      - alert: HighErrorRate
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.05
        for: 2m
        labels:
          severity: critical
          tier: 1
          pager: true

      - alert: NoTrafficDropped
        expr: rate(http_requests_total[5m]) == 0
        for: 5m
        labels:
          severity: critical
          tier: 1
          pager: true

# Tier 2 — Create ticket, investigate in business hours
groups:
  - name: tier2_warning
    interval: 1m
    rules:
      - alert: HighCPUUsage
        expr: avg by (instance) (rate(node_cpu_seconds_total{mode!="idle"}[5m])) * 100 > 85
        for: 15m
        labels:
          severity: warning
          tier: 2

      - alert: DiskSpaceLow
        expr: (node_filesystem_free_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 15
        for: 10m
        labels:
          severity: warning
          tier: 2

# Tier 3 — Log only, for capacity planning dashboard
groups:
  - name: tier3_info
    interval: 5m
    rules:
      - alert: DiskFullIn7Days
        expr: predict_linear(node_filesystem_free_bytes[7d], 7*86400) < 0
        for: 1h
        labels:
          severity: info
          tier: 3
```

### Step 2: Create Inhibition Rules to Reduce Noise

```yaml
# alertmanager.yml
inhibit_rules:
  # If a service is down, don't alert on its CPU/memory/disk
  - source_match:
      alertname: ServiceDown
    target_match:
      severity: warning
    equal: ['instance']

  # If the entire datacenter has network issues, suppress per-service alerts
  - source_match:
      alertname: NetworkOutage
    target_match:
      tier: '2|3'
    equal: ['datacenter']

  # During maintenance, suppress everything
  - source_match:
      alertname: MaintenanceMode
    target_match_re:
      severity: 'warning|info'
    equal: ['instance']
```

### Step 3: Build Alertmanager Routing for the Tiers

```yaml
route:
  receiver: 'default'
  group_by: ['alertname', 'severity', 'tier']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - match:
        pager: 'true'
      receiver: 'pagerduty-critical'
      repeat_interval: 15m  # Re-notify every 15m for critical
      routes:
        - match:
            tier: '1'
          receiver: 'pagerduty-critical'

    - match:
        tier: '2'
      receiver: 'slack-warning'
      continue: true  # Also try next matching route

    - match:
        severity: info
      receiver: 'log-only'
```

### Step 4: Test Your Alert Rules with promtool

```yaml
# test-alerts.yml
rule_files:
  - alerting-rules.yml

evaluation_interval: 1m

tests:
  - interval: 1m
    input_series:
      - series: 'up{job="api", instance="api-1:8080"}'
        values: '1 1 1 0 0 0 1 1'  # Goes down at step 4, up at step 7

    alert_rule_test:
      - eval_time: 2m
        alertname: ServiceDown
        exp_alerts: []  # Not firing yet — up is 1

      - eval_time: 5m
        alertname: ServiceDown
        exp_alerts:
          - exp_labels:
              job: api
              severity: critical
              tier: '1'
              pager: 'true'
            exp_annotations:
              summary: 'Instance api-1:8080 is down'
```

```bash
# Run the test
promtool test rules test-alerts.yml
# SUCCESS: 1 tests passed
```

### Step 5: Monitoring Alert Health

```promql
# How many alerts are firing right now?
count(ALERTS{alertstate="firing"}) by (severity)

# How many alerts per rule?
count by (alertname) (ALERTS{alertstate="firing"})

# Alert rate over time
rate(ALERTS{alertstate="firing"}[1h])

# Which instances have the most alerts?
topk(5, count by (instance) (ALERTS{alertstate="firing"}))

# Mean time to acknowledge/resolve
# (Custom metric needed from incident management tool)
```

---

**Key Takeaways:**
- Alerting rules are PromQL expressions that return firing alerts when true
- The `for` clause prevents flapping by requiring sustained conditions
- Annotations provide human-readable alert context
- Alertmanager handles routing, grouping, deduplication, silencing
- Route configuration determines which notifications go where
- Always test rules with `promtool` before deploying

---

## 🔗 Related Chapters

- [Chapter 8: Storage & Retention]({{< relref "08-storage-retention" >}}) — Storage considerations for alerting data
- [Chapter 18: Alertmanager Routing, Inhibition & Silences]({{< relref "18-alertmanager-routing" >}}) — Advanced alert routing and noise reduction
- [Chapter 19: Grafana Dashboards]({{< relref "19-grafana-dashboards" >}}) — Visualizing alert trends

## 📚 Additional Resources

- [Alerting Rules Documentation](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)
- [Alerting Best Practices](https://prometheus.io/docs/practices/alerting/)
- [promtool Rule Check](https://prometheus.io/docs/prometheus/latest/command-line/promtool/#promtool-check-rules)

---

*Continue to → [Chapter 18: Alertmanager Routing, Inhibition & Silences]({{< relref "18-alertmanager-routing" >}})*
