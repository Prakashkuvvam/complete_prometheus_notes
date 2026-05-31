---
title: "Alertmanager Config Examples"
weight: 6
bookToc: true
---

# Alertmanager Configuration Examples

> Production-ready Alertmanager configurations for routing, inhibition, receivers, and high availability.

---

## 🏗️ Complete Alertmanager Configuration

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  slack_api_url: 'https://hooks.slack.com/services/T.../B.../xxx'
  pagerduty_url: 'https://events.pagerduty.com/v2/enqueue'

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
      repeat_interval: 15m

    - match:
        severity: warning
      receiver: 'slack-warning'
      continue: true

    - match_re:
        team: 'platform|infra'
      receiver: 'slack-platform'

inhibit_rules:
  - source_match:
      severity: critical
    target_match:
      severity: warning
    equal: ['instance']

  - source_match:
      alertname: NodeDown
    target_match:
      severity: warning
    equal: ['instance']

receivers:
  - name: 'default'
    slack_configs:
      - channel: '#alerts'

  - name: 'pagerduty'
    pagerduty_configs:
      - routing_key: 'your-pagerduty-key'
        severity: '{{ .CommonLabels.severity }}'

  - name: 'slack-warning'
    slack_configs:
      - channel: '#alerts-warning'
        title: '⚠️ {{ .GroupLabels.alertname }}'
        text: '{{ .CommonAnnotations.description }}'

  - name: 'slack-platform'
    slack_configs:
      - channel: '#platform-alerts'
        title: '{{ .GroupLabels.alertname }}'
```

---

## 🔀 Route Tree Examples

### Simple Two-Tier Routing

```yaml
route:
  receiver: 'default-team'
  group_by: ['alertname']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - match:
        severity: critical
      receiver: 'oncall-team'
      repeat_interval: 30m

    - match:
        severity: warning
      receiver: 'slack-alerts'
```

### Multi-Team Routing with Nested Routes

```yaml
route:
  receiver: 'default'
  group_by: ['alertname', 'severity', 'tier']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    # Team Platform — critical infrastructure
    - matchers:
        - team = platform
        - severity = critical
      receiver: 'pagerduty-platform'
      repeat_interval: 15m
      routes:
        - matchers:
            - alertname =~ '.*Down$'
          receiver: 'pagerduty-platform-db'

    # Team Platform — warnings
    - matchers:
        - team = platform
        - severity = warning
      receiver: 'slack-platform'

    # Team Database
    - matchers:
        - team = database
      receiver: 'slack-database'
      group_by: ['alertname', 'instance']
      routes:
        - matchers:
            - severity = critical
          receiver: 'pagerduty-database'

    # Team Security
    - matchers:
        - team = security
      receiver: 'slack-security'
      repeat_interval: 30m
```

### Environment-Based Routing

```yaml
route:
  receiver: 'default'
  routes:
    - matchers:
        - env = production
      receiver: 'pagerduty-prod'
      routes:
        - matchers:
            - severity = critical
          receiver: 'pagerduty-prod-critical'
          repeat_interval: 15m
        - matchers:
            - severity = warning
          receiver: 'slack-prod-warning'

    - matchers:
        - env = staging
      receiver: 'slack-staging'

    - matchers:
        - env = development
      receiver: 'null'  # Drop dev alerts entirely
```

---

## 🚫 Inhibition Rule Examples

### Downstream Suppression

```yaml
# If a host is down, don't alert on its services
inhibit_rules:
  - source_matchers:
      - alertname = NodeDown
    target_matchers:
      - severity = warning
    equal: ['instance']

  # If database is down, suppress app-level alerts
  - source_matchers:
      - alertname = DatabaseDown
    target_matchers:
      - alertname =~ '.*ErrorRate.*'
    equal: ['cluster']

  # During network outage, suppress per-service alerts
  - source_matchers:
      - alertname = NetworkOutage
    target_matchers:
      - tier =~ '2|3'
    equal: ['datacenter']
```

### Maintenance Mode

```yaml
inhibit_rules:
  - source_matchers:
      - alertname = MaintenanceMode
    target_matchers:
      - severity != critical
    equal: ['instance']

  - source_matchers:
      - alertname = MaintenanceMode
    target_matchers:
      - team != security
    equal: ['instance']
```

### Multi-Level Suppression

```yaml
inhibit_rules:
  # Tier 1: Infrastructure down → suppress all host alerts
  - source_matchers:
      - alertname = InstanceDown
    target_matchers:
      - severity = warning
    equal: ['instance']

  # Tier 2: Service down → suppress latency/error alerts
  - source_matchers:
      - alertname = ServiceDown
    target_matchers:
      - alertname =~ 'HighLatency|HighErrorRate'
    equal: ['service']

  # Tier 3: Cluster degradation → suppress per-node alerts
  - source_matchers:
      - alertname = ClusterDegraded
    target_matchers:
      - tier =~ '2|3'
    equal: ['cluster']
```

---

## 📬 Receiver Examples

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
        headers:
          subject: '[{{ .GroupLabels.severity | toUpper }}] {{ .GroupLabels.alertname }}'
        html: |
          <h2>{{ .GroupLabels.alertname }}</h2>
          <p><strong>Severity:</strong> {{ .GroupLabels.severity }}</p>
          <p><strong>Description:</strong> {{ .CommonAnnotations.description }}</p>
          <hr>
          <ul>
          {{ range .Alerts }}
            <li>{{ .Annotations.summary }} ({{ .Labels.instance }})</li>
          {{ end }}
          </ul>
```

### Slack (Multiple Channels)

```yaml
receivers:
  - name: 'slack-alerts'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/T.../B.../xxx'
        channel: '#alerts-critical'
        title: '🚨 {{ .GroupLabels.alertname }}'
        text: >-
          {{ range .Alerts }}
            • {{ .Annotations.summary }}
          {{ end }}
        color: 'danger'
        fields:
          - title: 'Severity'
            value: '{{ .CommonLabels.severity }}'
          - title: 'Instance'
            value: '{{ .CommonLabels.instance }}'
          - title: 'Runbook'
            value: '{{ .Annotations.runbook }}'

  - name: 'slack-warning'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/T.../B.../xxx'
        channel: '#alerts-warning'
        title: '⚠️ {{ .GroupLabels.alertname }}'
        text: '{{ .CommonAnnotations.description }}'
        color: 'warning'
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
        client_url: 'https://prometheus.example.com/alerts'
        images:
          - src: 'https://example.com/alert-dashboard.png'
            href: 'https://grafana.example.com/d/alerting'
```

### Webhook (for custom integrations)

```yaml
receivers:
  - name: 'webhook'
    webhook_configs:
      - url: 'https://hooks.example.com/alerts'
        send_resolved: true
        http_config:
          basic_auth:
            username: 'admin'
            password: 'secret'
        max_alerts: 50

  - name: 'teams-webhook'
    webhook_configs:
      - url: 'https://outlook.office.com/webhook/.../IncomingWebhook/...'
        send_resolved: false
```

### OpsGenie

```yaml
receivers:
  - name: 'opsgenie'
    opsgenie_configs:
      - api_key: 'your-opsgenie-key'
        api_url: 'https://api.opsgenie.com/v2/alerts'
        teams: 'platform,infra'
        tags: 'prometheus,{{ .CommonLabels.severity }}'
        priority: '{{ if eq .CommonLabels.severity "critical" }}P1{{ else }}P3{{ end }}'
        responders:
          - type: team
            name: 'on-call'
          - type: escalation
            name: 'sre-escalation'
```

### Pushover

```yaml
receivers:
  - name: 'pushover'
    pushover_configs:
      - user_key: 'your-user-key'
        token: 'your-app-token'
        title: '{{ .GroupLabels.alertname }}'
        message: '{{ .CommonAnnotations.description }}'
        priority: '{{ if eq .CommonLabels.severity "critical" }}1{{ else }}0{{ end }}'
        sound: 'siren'
```

---

## 🔇 Silence Examples

### CLI (amtool)

```bash
# Create a silence for 2 hours during maintenance
amtool silence add \
  --alertmanager.url=http://localhost:9093 \
  --duration=2h \
  --comment="Scheduled kubernetes upgrade" \
  --author="sre-team" \
  --matcher="instance=~k8s-node.*" \
  --matcher="severity!=critical"

# Create a silence until a specific time
amtool silence add \
  --alertmanager.url=http://localhost:9093 \
  --expire-on="2024-12-31T23:59:59Z" \
  --comment="End of year maintenance" \
  --matcher="alertname=~'.*'" \
  --matcher="env=production"

# List active silences
amtool silence query --alertmanager.url=http://localhost:9093

# Expire a silence early
amtool silence expire --alertmanager.url=http://localhost:9093 <silence-id>
```

### API

```bash
# Create silence via API
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

# List silences
curl http://localhost:9093/api/v2/silences | jq '.[] | {id: .id, status: .status.state, matchers: .matchers}'

# Expire a silence
curl -X DELETE http://localhost:9093/api/v2/silence/<silence-id>
```

---

## 🔄 High Availability Configuration

### Two-Node Cluster

```bash
# Node 1
./alertmanager \
  --config.file=alertmanager.yml \
  --cluster.listen-address=0.0.0.0:9094 \
  --cluster.peer=alertmanager2:9094 \
  --storage.path=/data/alertmanager

# Node 2
./alertmanager \
  --config.file=alertmanager.yml \
  --cluster.listen-address=0.0.0.0:9094 \
  --cluster.peer=alertmanager1:9094 \
  --storage.path=/data/alertmanager
```

### Three-Node Cluster (Docker Compose)

```yaml
version: '3.8'
services:
  alertmanager-1:
    image: prom/alertmanager:latest
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--cluster.listen-address=0.0.0.0:9094'
      - '--cluster.peer=alertmanager-2:9094'
      - '--cluster.peer=alertmanager-3:9094'
      - '--storage.path=/alertmanager'
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml

  alertmanager-2:
    image: prom/alertmanager:latest
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--cluster.listen-address=0.0.0.0:9094'
      - '--cluster.peer=alertmanager-1:9094'
      - '--cluster.peer=alertmanager-3:9094'
      - '--storage.path=/alertmanager'
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml

  alertmanager-3:
    image: prom/alertmanager:latest
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--cluster.listen-address=0.0.0.0:9094'
      - '--cluster.peer=alertmanager-1:9094'
      - '--cluster.peer=alertmanager-2:9094'
      - '--storage.path=/alertmanager'
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
```

### Prometheus Configuration for HA Alertmanager

```yaml
# prometheus.yml
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager-1:9093
            - alertmanager-2:9093
            - alertmanager-3:9093
      scheme: http
      timeout: 10s
      api_version: v2
```

---

## 📊 Alertmanager Monitoring Metrics

```promql
# Alertmanager uptime
up{job="alertmanager"}

# Total alerts received
rate(alertmanager_alerts_received_total[5m])

# Alerts currently firing (by state)
alertmanager_alerts

# Notification rates by integration
rate(alertmanager_notifications_total[5m])

# Failed notifications
rate(alertmanager_notifications_failed_total[5m])

# Notification failure rate (%)
rate(alertmanager_notifications_failed_total[5m])
/ rate(alertmanager_notifications_total[5m])
* 100

# Alertmanager cluster health (gossip)
alertmanager_cluster_members

# Cluster message rates
rate(alertmanager_cluster_messages_received_total[5m])
rate(alertmanager_cluster_messages_sent_total[5m])
```

---

## ⚡ Common Alertmanager CLI Commands

```bash
# Check config validity
amtool check-config alertmanager.yml

# Reload config (SIGHUP)
killall -HUP alertmanager

# Send a test alert
amtool alert add \
  --alertmanager.url=http://localhost:9093 \
  --duration=30m \
  --annotation=summary="Test alert" \
  alertname="TestAlert" \
  severity="critical" \
  team="platform"

# Query alerts
amtool alert query --alertmanager.url=http://localhost:9093

# Silence management
amtool silence add --alertmanager.url=http://localhost:9093 --duration=1h --comment="test" alertname=TestAlert
amtool silence query --alertmanager.url=http://localhost:9093
amtool silence expire --alertmanager.url=http://localhost:9093 <silence-id>
```

---

## 🔧 Troubleshooting Tips

| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| Alerts not reaching Alertmanager | Prometheus `alerting:` section misconfigured | Verify targets point to correct Alertmanager port (9093) |
| Wrong receiver | Route matcher misconfigured | `match` is exact match, `match_re` is regex — check which you're using |
| Too many notifications | `group_wait`/`group_interval` too short | Increase to 30s/5m respectively |
| Notifications not sending | Invalid receiver credentials | Verify Slack webhook URL, PagerDuty routing key |
| Duplicate alerts in HA mode | Clustering not configured | Set `--cluster.peer` for all nodes |
| Config syntax error on reload | YAML indentation | Validate with `amtool check-config` |
| Silence not working | Matcher doesn't match alert labels | Check exact label names and values |
