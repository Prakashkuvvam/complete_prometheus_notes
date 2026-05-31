---
title: "Alertmanager Routing, Inhibition & Silences"
weight: 18
bookToc: true
---

# Alertmanager — Routing, Inhibition & Silences

This chapter covers advanced Alertmanager features: routing trees, inhibition rules, silences, and notification integrations.

## Route Trees

Routes form a tree structure — alerts traverse the tree and match against each node's conditions.

### Route Tree Structure

```yaml
route:                          # Root route — always matches
  receiver: 'default'
  group_by: ['alertname']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:                       # Child routes — evaluated in order
    - match:                    # Match by label (exact)
        severity: critical
      receiver: 'pagerduty'
      repeat_interval: 15m
      routes:
        - match_re:             # Match by regex
            alertname: '.*Down$'
          receiver: 'pagerduty-db'
          
    - match_re:
        team: 'platform|infra'
      receiver: 'slack-platform'
      continue: true            # Continue to sibling routes after match
      
    - match:
        severity: warning
      receiver: 'slack-alerts'
```

### Route Matching Options

| Directive | Description | Example |
|-----------|-------------|---------|
| `match` | Exact label matching | `match: { severity: critical }` |
| `match_re` | Regex label matching | `match_re: { alertname: '.*Down$' }` |
| `continue` | Continue to next route after match | Default: `false` |

### Grouping Settings

Control how alerts are grouped into notifications:

| Setting | Description | Recommended |
|---------|-------------|-------------|
| `group_by` | Labels to group by | `['alertname', 'severity']` |
| `group_wait` | Wait time before sending first notification | `30s` |
| `group_interval` | Wait time before sending new alerts in group | `5m` |
| `repeat_interval` | How often to re-send if still firing | `4h` (non-critical), `1h` (critical) |

### Grouping Examples

**Group by severity and alertname:**
```yaml
route:
  group_by: ['severity', 'alertname']
```

**Group by environment + alertname:**
```yaml
route:
  group_by: ['env', 'alertname']
```

## Inhibition Rules

Inhibition suppresses notifications for certain alerts when other alerts are firing. Use to prevent alert storms.

### Syntax

```yaml
inhibit_rules:
  - source_match:         # Source alerts (the ones causing the problem)
      severity: critical
    target_match:         # Target alerts (the ones to suppress)
      severity: warning
    equal: ['instance']   # Only inhibit if labels match

  - source_match:
      alertname: InstanceDown
    target_match:
      alertname: HighCPU     # No point alerting about CPU if instance is down
    equal: ['instance']
```

### Common Inhibition Patterns

**1. Downstream Inhibition:**

```yaml
# If a node is down, don't alert on its services
- source_match:
    alertname: NodeDown
  target_match:
    severity: warning
  equal: ['instance']
```

**2. Maintenance Inhibition:**

```yaml
# If maintenance mode is active, suppress operational alerts
- source_match:
    alertname: MaintenanceMode
  target_match_re:
    severity: 'warning|info'
  equal: ['instance']
```

**3. Dependency Inhibition:**

```yaml
# If database is down, don't alert on app errors
- source_match:
    alertname: DatabaseDown
  target_match:
    alertname: '.*ErrorRate.*'
  equal: ['env']
```

## Silences

Silences temporarily mute alerts based on label matchers.

### Creating Silences via CLI

```bash
# Create a silence for 2 hours
amtool silence add --alertmanager.url=http://localhost:9093 \
  --duration=2h \
  --comment="Scheduled maintenance" \
  --author="admin" \
  instance=server01

# Create with multiple matchers
amtool silence add \
  --duration=1d \
  --comment="Database migration" \
  alertname=~".*Down$" \
  severity=critical

# List silences
amtool silence query --alertmanager.url=http://localhost:9093

# Expire a silence
amtool silence expire --alertmanager.url=http://localhost:9093 <silence-id>
```

### Creating Silences via API

```bash
curl -X POST http://localhost:9093/api/v2/silences \
  -H "Content-Type: application/json" \
  -d '{
    "matchers": [
      {"name": "instance", "value": "server01", "isRegex": false},
      {"name": "alertname", "value": ".*Down", "isRegex": true}
    ],
    "startsAt": "2024-01-01T00:00:00Z",
    "endsAt": "2024-01-02T00:00:00Z",
    "createdBy": "admin",
    "comment": "Maintenance window"
  }'
```

### Silence Status

| Status | Description |
|--------|-------------|
| `active` | Silence is currently in effect |
| `pending` | Silence is scheduled for the future |
| `expired` | Silence has passed its end time |

## Notification Receivers

### Email

```yaml
receivers:
  - name: 'email-team'
    email_configs:
      - to: 'team@example.com'
        from: 'alertmanager@example.com'
        smarthost: 'smtp.example.com:587'
        auth_username: 'alertmanager'
        auth_password: 'password'
        require_tls: true
        html: '{{ template "email.default.html" . }}'
        headers:
          subject: '[{{ .GroupLabels.severity }}] {{ .GroupLabels.alertname }}'
```

### Slack

```yaml
receivers:
  - name: 'slack-alerts'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/T.../B.../xxx'
        channel: '#alerts'
        title: '{{ .GroupLabels.alertname }}'
        text: >-
          {{ range .Alerts }}
            {{ .Annotations.description }}
          {{ end }}
        color: '{{ if eq .CommonLabels.severity "critical" }}danger{{ else }}warning{{ end }}'
```

### PagerDuty

```yaml
receivers:
  - name: 'pagerduty'
    pagerduty_configs:
      - routing_key: 'your-pagerduty-key'
        severity: '{{ .CommonLabels.severity }}'
        description: '{{ .CommonAnnotations.summary }}'
        client: 'Prometheus'
```

### Webhook

```yaml
receivers:
  - name: 'webhook'
    webhook_configs:
      - url: 'https://hooks.example.com/alerts'
        send_resolved: true
        http_config:
          basic_auth:
            username: 'admin'
            password: 'password'
```

### OpsGenie / VictorOps / Pushover

```yaml
receivers:
  - name: 'opsgenie'
    opsgenie_configs:
      - api_key: 'your-opsgenie-key'
        teams: 'platform'
        responders:
          - type: team
            name: 'oncall'

  - name: 'victorops'
    victorops_configs:
      - routing_key: 'your-routing-key'
        api_key: 'your-api-key'

  - name: 'pushover'
    pushover_configs:
      - user_key: 'your-user-key'
        token: 'your-app-token'
```

## Alertmanager Monitoring

Monitor Alertmanager itself:

```promql
# Alertmanager uptime
up{job="alertmanager"}

# Total alerts received
rate(alertmanager_alerts_received_total[5m])

# Total notifications sent
rate(alertmanager_notifications_total[5m])

# Failed notifications
rate(alertmanager_notifications_failed_total[5m])

# Current active alerts
alertmanager_alerts
```

### Key Dashboard Metrics

```promql
# Notification failure rate by receiver
rate(alertmanager_notifications_failed_total[5m]) / rate(alertmanager_notifications_total[5m]) * 100

# Alert grouping effectiveness
histogram_quantile(0.95, rate(alertmanager_http_request_duration_seconds_bucket[5m]))
```

## High Availability

Run Alertmanager in cluster mode for HA:

```bash
# Node 1
./alertmanager --cluster.listen-address=0.0.0.0:9094 --cluster.peer=node2:9094

# Node 2
./alertmanager --cluster.listen-address=0.0.0.0:9094 --cluster.peer=node1:9094
```

Point Prometheus to both:

```yaml
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager1:9093', 'alertmanager2:9093']
```

---

## 🌐 Real-World Scenario: Building a Complete Alertmanager Routing Tree

### The Challenge

Your organization has 3 teams (Platform, Database, Security), each responsible for different services. You need alerts routed to the right team with the right urgency.

### Step 1: Design the Route Tree

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  slack_api_url: 'https://hooks.slack.com/services/T.../B.../xxx'
  pagerduty_url: 'https://events.pagerduty.com/v2/enqueue'

route:
  # Root route — catches everything not matched below
  receiver: 'default-team'
  group_by: ['alertname', 'severity']
  group_wait: 30s        # Wait 30s before sending first notification
  group_interval: 5m     # Wait 5m before sending new alerts in group
  repeat_interval: 4h    # Re-send every 4 hours if still firing

  routes:
    # ==========================================
    # Team: Platform (critical infrastructure)
    # ==========================================
    - matchers:
        - team = platform
        - severity = critical
      receiver: 'platform-critical'
      repeat_interval: 15m  # Critical = re-notify every 15m
      continue: false

    - matchers:
        - team = platform
        - severity = warning
      receiver: 'platform-warning'
      repeat_interval: 1h

    # ==========================================
    # Team: Database (DBA team)
    # ==========================================
    - matchers:
        - team = database
      receiver: 'database-team'
      group_by: ['alertname', 'instance']  # Group by instance for DB
      routes:
        - matchers:
            - severity = critical
          receiver: 'dba-critical'
        - matchers:
            - severity = warning
          receiver: 'dba-warning'

    # ==========================================
    # Team: Security (security-related alerts)
    # ==========================================
    - matchers:
        - team = security
      receiver: 'security-team'
      repeat_interval: 30m

    # ==========================================
    # Maintenance mode — suppress everything
    # ==========================================
    - matchers:
        - alertname = MaintenanceMode
      receiver: 'null'  # Silence all maintenance alerts
      continue: false

receivers:
  - name: 'default-team'
    slack_configs:
      - channel: '#alerts-general'
        title: '{{ .GroupLabels.alertname }}'

  - name: 'platform-critical'
    pagerduty_configs:
      - routing_key: 'pagerduty-platform-key'
        severity: critical
    slack_configs:
      - channel: '#alerts-platform'
        title: '🚨 {{ .GroupLabels.alertname }}'
        color: danger

  - name: 'platform-warning'
    slack_configs:
      - channel: '#alerts-platform'
        title: '⚠️ {{ .GroupLabels.alertname }}'
        color: warning

  - name: 'database-team'
    slack_configs:
      - channel: '#alerts-database'
  - name: 'dba-critical'
    pagerduty_configs:
      - routing_key: 'pagerduty-dba-key'
  - name: 'dba-warning'
    slack_configs:
      - channel: '#alerts-database'
        title: '⚠️ DB Warning'

  - name: 'security-team'
    slack_configs:
      - channel: '#alerts-security'
  - name: 'null'
    # Empty receiver — alerts are silently dropped
```

### Step 2: Add Inhibition Rules to Reduce Alert Fatigue

```yaml
inhibit_rules:
  # If a host is down, suppress all host-level warnings
  - source_matchers:
      - alertname = NodeDown
    target_matchers:
      - severity = warning
    equal: ['instance']

  # If database master is down, suppress replica lag alerts
  - source_matchers:
      - alertname = DatabasePrimaryDown
    target_matchers:
      - alertname = ReplicaLagHigh
    equal: ['cluster']

  # During maintenance, suppress all but critical security alerts
  - source_matchers:
      - alertname = MaintenanceMode
    target_matchers:
      - severity != critical
      - team != security
    equal: ['instance']
```

### Step 3: Set Up Silences for Planned Maintenance

```bash
# Create a silence for this weekend's maintenance window
amtool silence add \
  --alertmanager.url=http://alertmanager:9093 \
  --duration=2h \
  --comment="Scheduled Kubernetes upgrade" \
  --author="sre-team" \
  --matcher="instance=~k8s-node.*" \
  --matcher="severity!=critical"

# Verify the silence
amtool silence query --alertmanager.url=http://alertmanager:9093
# ID: abc123-..., Matchers: [instance=~k8s-node.*], Duration: 2h, Active: true

# Expire the silence if maintenance finishes early
amtool silence expire abc123-...
```

### Step 4: Test the Routing

```bash
# Send a test alert via amtool
amtool alert add \
  --alertmanager.url=http://alertmanager:9093 \
  --duration=30m \
  --annotation=summary="Test alert" \
  alertname="TestAlert" team="platform" severity="critical"

# Check where it was routed
curl http://alertmanager:9093/api/v2/alerts | jq '.[].receiver'
# Expected output: "platform-critical"
```

### Step 5: Monitor Notification Health

```promql
# Notification success rate by receiver
rate(alertmanager_notifications_total[5m])
-
rate(alertmanager_notifications_failed_total[5m])

# Identify failing receivers
topk(5, rate(alertmanager_notifications_failed_total[5m])) by (integration)

# Alertmanager HA cluster health
# Check if all peers are connected
rate(alertmanager_cluster_messages_received_total[5m])
rate(alertmanager_cluster_messages_sent_total[5m])
```

### Common Alertmanager Routing Pitfalls

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Alert not firing** | Alert doesn't appear in Alertmanager | Check Prometheus `alerting:` config targets port 9093 |
| **Wrong receiver** | Alert goes to wrong channel | Check route matchers — `match` is exact, `match_re` is regex |
| **Too many notifications** | Alert fatigue | Increase `group_wait`, `group_interval`, or use inhibition |
| **Notifications not sent** | Receiver config error | Check receiver credentials (Slack webhook, PagerDuty key) |
| **Duplicate alerts** | Multiple Alertmanagers | Set up cluster mode with gossip protocol |
| **Alerts during maintenance** | Unwanted pages | Create silences BEFORE starting maintenance |

---

**Key Takeaways:**
- Route trees match alerts by labels and determine notification channels
- `group_by`, `group_wait`, `group_interval`, `repeat_interval` control notification grouping
- Inhibition rules suppress low-priority alerts when critical alerts fire
- Silences temporarily mute alerts during maintenance
- Multiple notification integrations available (Email, Slack, PagerDuty, webhooks)
- Run Alertmanager in clusters for high availability
- Monitor Alertmanager's own metrics for notification health

---

## 🔗 Related Chapters

- [Chapter 4: Prometheus Architecture & Core Concepts]({{< relref "04-prometheus-architecture" >}}) — Alertmanager's role in the Prometheus ecosystem
- [Chapter 17: Alerting Rules & Alertmanager]({{< relref "17-alerting-rules" >}}) — Alert rules and basic Alertmanager setup
- [Chapter 19: Grafana Dashboards]({{< relref "19-grafana-dashboards" >}}) — Visualizing alert data

## 📚 Additional Resources

- [Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/)
- [Alertmanager Clustering](https://prometheus.io/docs/alerting/latest/alertmanager/#high-availability)
- [amtool CLI](https://prometheus.io/docs/alerting/latest/amtool/)
- [Inhibition Rules](https://prometheus.io/docs/alerting/latest/configuration/#inhibit_rule)

---

*Continue to → [Chapter 19: Grafana Dashboards]({{< relref "19-grafana-dashboards" >}})*
