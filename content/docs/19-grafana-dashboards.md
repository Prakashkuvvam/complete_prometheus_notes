---
title: "Grafana Dashboards & Visualization"
weight: 19
bookToc: true
---

# Grafana Dashboards & Visualization

Grafana is the standard visualization layer for Prometheus metrics. This chapter covers connecting Grafana to Prometheus, building dashboards, and best practices.

## Introduction

```
Prometheus ──pull/data──> Grafana ──visualize──> Users
    
    ┌─ Queries: PromQL
    ├─ Data source: Prometheus
    └─ Visualization: Graphs, tables, heatmaps
```

### Installation

```bash
# Ubuntu/Debian
sudo apt-get install -y software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
sudo apt-get update
sudo apt-get install grafana

# Start
sudo systemctl start grafana-server
sudo systemctl enable grafana-server

# Or via Docker
docker run -d -p 3000:3000 --name=grafana grafana/grafana
```

Default access: `http://localhost:3000` (admin/admin)

## Adding Prometheus Data Source

### Via UI

1. Navigate to **Configuration** → **Data Sources** → **Add data source**
2. Select **Prometheus**
3. Configure:
   - **URL:** `http://localhost:9090`
   - **Access:** Server (default)
   - **Scrape interval:** `15s`
   - **Query timeout:** `60s`
4. Click **Save & Test**

### Via Provisioning

```yaml
# /etc/grafana/provisioning/datasources/prometheus.yml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://localhost:9090
    isDefault: true
    editable: false
    jsonData:
      timeInterval: 15s
      queryTimeout: 60s
      httpMethod: POST
```

## Building Dashboards

### Dashboard Components

| Component | Description |
|-----------|-------------|
| **Panel** | A single visualization (graph, gauge, table, etc.) |
| **Row** | Groups related panels together |
| **Dashboard** | Collection of rows and panels |
| **Variables** | Dynamic values that drive panel queries |

### Panel Types for Prometheus

| Panel Type | Best Use Case |
|------------|---------------|
| **Time Series** | Line/area charts for time-series data (rate, CPU, memory) |
| **Stat** | Single numeric value with optional sparkline |
| **Gauge** | Single value within a min/max range |
| **Bar Gauge** | Horizontal/vertical bars for comparisons |
| **Table** | Tabular data with multiple columns |
| **Heatmap** | Histogram data over time (latency distributions) |
| **State Timeline** | State changes over time (up/down) |

### Essential Queries

**CPU Usage (Time Series):**
```promql
avg by (instance) (rate(node_cpu_seconds_total{mode!="idle"}[5m])) * 100
```

**Memory Usage (Stat):**
```promql
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100
```

**Request Rate (Time Series):**
```promql
sum by (status_class) (rate(http_requests_total[5m]))
```

**Error Rate (Stat):**
```promql
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
```

### Example: System Dashboard

Create a dashboard for node monitoring:

1. **CPU Panel** — Time series, percent (0-100), area fill
   ```promql
   avg by (instance) (rate(node_cpu_seconds_total{mode!="idle"}[5m])) * 100
   ```

2. **Memory Panel** — Time series, percent
   ```promql
   (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100
   ```

3. **Disk Panel** — Time series, percent per mountpoint
   ```promql
   (1 - node_filesystem_free_bytes / node_filesystem_size_bytes) * 100
   ```

4. **Network Panel** — Time series, bytes/sec
   ```promql
   rate(node_network_receive_bytes_total[5m])
   rate(node_network_transmit_bytes_total[5m])
   ```

5. **Load Panel** — Time series
   ```promql
   node_load1
   node_load5
   node_load15
   ```

## Variables

Variables make dashboards interactive and reusable.

### Defining Variables

Go to **Dashboard Settings** → **Variables** → **Add variable**.

**Query Variable (instance list):**
```sql
label_values(node_cpu_seconds_total, instance)
```

**Query Variable (job list):**
```sql
label_values(up, job)
```

**Interval Variable:**
```
Values: 1m,5m,15m,30m,1h,6h,12h,24h
Default: 5m
```

### Using Variables

Use `$variable_name` in queries:

```promql
avg by (instance) (rate(node_cpu_seconds_total{mode!="idle", instance="$instance"}[$interval]))
```

### Variable Types

| Type | Description | Example |
|------|-------------|---------|
| **Query** | Dynamically populated from a query | `label_values(up, instance)` |
| **Custom** | Manually defined list | `prod,staging,dev` |
| **Interval** | Time interval selector | `1m,5m,15m,1h` |
| **Data source** | Switch between Prometheus instances | |

## Advanced Grafana Features

### Annotations

Add events to graphs — useful for deployments, incidents:

```promql
# Annotate deployments from a metric
deploy_timestamp_seconds
```

Configure in panel settings: **Panel** → **Annotations**.

### Alerting in Grafana

Grafana can also create alerts (alternative to Prometheus alerting rules):

```
Panel → Alert → Create Alert
```

```promql
avg by (instance) (rate(node_cpu_seconds_total{mode!="idle"}[5m])) * 100 > 90
```

Set conditions:
- **Evaluate every:** `30s`
- **For:** `5m`
- **Condition:** `WHEN avg() OF query(A, 5m, now) IS ABOVE 90`

### Dashboard Provisioning

Define dashboards as code:

```yaml
# /etc/grafana/provisioning/dashboards/node.yml
apiVersion: 1

providers:
  - name: 'Node Exporter'
    orgId: 1
    folder: 'Infrastructure'
    type: file
    disableDeletion: true
    updateIntervalSeconds: 30
    options:
      path: /etc/grafana/dashboards
```

Then drop JSON dashboard files in `/etc/grafana/dashboards/`.

### Template Dashboard JSON

```json
{
  "title": "Node Exporter Full",
  "uid": "node-exporter-full",
  "panels": [
    {
      "title": "CPU Usage",
      "type": "timeseries",
      "targets": [
        {
          "expr": "avg by (instance) (rate(node_cpu_seconds_total{mode!=\"idle\"}[5m])) * 100",
          "legendFormat": "{{ instance }}"
        }
      ]
    }
  ]
}
```

## Dashboard Design Best Practices

### Layout

1. **Top row:** Critical overview (CPU, memory, disk, network summary)
2. **Second row:** Per-instance detailed breakdown
3. **Third row:** Historical trends and predictions
4. **Bottom row:** Debugging and raw metrics

### Visualization Choices

| Data Type | Recommended Panel |
|-----------|-------------------|
| Rate over time | Time series (line) |
| Current utilization | Stat + sparkline |
| Pre/post comparison | Time series with transformations |
| Latency percentiles | Time series (multiple lines for p50, p95, p99) |
| Latency distribution | Heatmap |
| Binary state (up/down) | State timeline |
| Resource usage across hosts | Bar gauge |

### Color Coding

- **Green:** Normal/healthy (0-70%)
- **Yellow:** Warning (70-85%)
- **Red:** Critical (>85% or error states)

### Common Dashboard Templates

| Dashboard | Grafana ID | Description |
|-----------|------------|-------------|
| Node Exporter Full | 1860 | Complete system monitoring |
| Prometheus 2.0 Stats | 3662 | Prometheus self-monitoring |
| Blackbox Exporter | 7587 | External endpoint monitoring |
| Docker Monitoring | 893 | Container metrics |

Import via: `+` → **Import** → Enter Grafana ID.

## Grafana PromQL Tips

### Use Template Variables

```promql
# Without variable — hardcoded
sum(rate(http_requests_total{instance="server01"}[5m]))

# With variable — reusable across instances
sum(rate(http_requests_total{instance="$instance"}[5m]))
```

### Handle Missing Data

```promql
# Fill missing values with 0 for cleaner graphs
avg by (instance) (rate(http_requests_total[5m])) or vector(0)
```

### Transformations

Use Grafana transformations for post-processing:
- **Reduce** — aggregate multiple series
- **Calculate field** — add/edit fields with formulas
- **Group by** — group and aggregate by label
- **Join** — join multiple queries by label

---

## 🌐 Real-World Scenario: Building a Production Application Dashboard

### The Challenge

You're asked to build a Grafana dashboard for a new microservice called "order-service." The dashboard needs to show:
- Request rate, error rate, latency (the "Golden Signals")
- Business metrics (orders placed, revenue)
- Dependencies health (database, queue)
- Deployments annotated

### Step 1: Design the Layout

```
┌─────────────────────────────────────────────────────┐
│  Title: "Order Service Overview"                     │
│  Variables: [Environment ▼] [Instance ▼] [Timerange] │
├─────────────────────────────────────────────────────┤
│              ROW 1: Golden Signals                    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│  │ Request Rate  │ │ Error Rate   │ │ P95 Latency  │ │
│  │ (stat+spark)  │ │ (stat+spark) │ │ (stat+spark) │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ │
├─────────────────────────────────────────────────────┤
│              ROW 2: Traffic & Errors                  │
│  ┌────────────────────────────────────────────────┐ │
│  │ Request Rate by Status (stacked area chart)     │ │
│  │ 2xx / 4xx / 5xx                                │ │
│  └────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│              ROW 3: Latency                          │
│  ┌──────────────────────┬─────────────────────────┐ │
│  │ Latency Heatmap       │ Latency Percentiles     │ │
│  │ (histogram over time) │ (p50/p95/p99 lines)    │ │
│  └──────────────────────┴─────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│              ROW 4: Dependencies                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│  │ DB Queries    │ │ Queue Size   │ │ Cache Hit    │ │
│  │ (latency)     │ │ (gauge)      │ │ Ratio        │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Step 2: Define Dashboard Variables

| Variable | Type | Query | Default |
|----------|------|-------|---------|
| `$env` | Custom | `production,staging,dev` | production |
| `$instance` | Query | `label_values(up{job="order-service"}, instance)` | All |
| `$interval` | Interval | `1m,5m,15m,30m,1h` | 5m |

```promql
# Using variables in queries:
sum by (status_class) (
  rate(order_requests_total{env="$env", instance=~"$instance"}[$interval])
)
```

### Step 3: Panel Configurations

**Panel 1: Request Rate (Stat)**
```
Query: sum(rate(order_requests_total{env="$env"}[5m]))
Unit: req/s
Threshold: Warning at 100, Critical at 200
Color: Green / Yellow / Red
```

**Panel 2: Error Rate (Stat)**
```
Query: sum(rate(order_requests_total{env="$env", status=~"5.."}[5m])) / sum(rate(order_requests_total{env="$env"}[5m])) * 100
Unit: %
Threshold: Warning at 1%, Critical at 5%

# Stat display options:
# - Show: Current value
# - Sparkline: Show 1h trend
# - Color mode: Background (fills whole stat)
```

**Panel 3: P95 Latency (Stat)**
```
Query: histogram_quantile(0.95, sum by (le) (rate(order_duration_seconds_bucket{env="$env"}[5m])))
Unit: s
Threshold: Warning at 0.5, Critical at 1.0
```

**Panel 4: Traffic by Status (Time Series)**
```
Query A (2xx): sum by (status_class) (rate(order_requests_total{env="$env", status_class="2xx"}[$interval]))
Query B (4xx): sum by (status_class) (rate(order_requests_total{env="$env", status_class="4xx"}[$interval]))
Query C (5xx): sum by (status_class) (rate(order_requests_total{env="$env", status_class="5xx"}[$interval]))

Display: Stacked area, transparent
Legend: {{status_class}}
```

**Panel 5: Latency Heatmap**
```
Query: sum by (le) (rate(order_duration_seconds_bucket{env="$env"}[$interval]))

Display:
- Panel type: Heatmap
- Buckets: From metric's `le` labels
- Colors: Blue (low) → Red (high)
```

**Panel 6: Latency Percentiles**
```
Query A (p50): histogram_quantile(0.50, sum by (le) (rate(order_duration_seconds_bucket{env="$env"}[$interval])))
Query B (p95): histogram_quantile(0.95, sum by (le) (rate(order_duration_seconds_bucket{env="$env"}[$interval])))
Query C (p99): histogram_quantile(0.99, sum by (le) (rate(order_duration_seconds_bucket{env="$env"}[$interval])))

Display: Lines, p50 dotted, p95 dashed, p99 solid thick
```

### Step 4: Add Deployment Annotations

```promql
# Show deployments as vertical lines on graphs
# Query for annotation:
changes(process_start_time_seconds{job="order-service"}[1m]) > 0

# Config:
# Title: {{ $labels.instance }} deployed
# Text: Process restarted at {{ $labels.instance }}
```

### Step 5: Dashboard Links and References

```json
{
  "links": [
    {
      "title": "Runbook",
      "url": "https://wiki.internal/runbooks/order-service",
      "type": "link"
    },
    {
      "title": "Order Service Alerts",
      "type": "dashboards",
      "tags": ["alerts", "order-service"]
    }
  ]
}
```

### Step 6: Provisioning as Code

```yaml
# /etc/grafana/provisioning/dashboards/order-service.yml
apiVersion: 1

providers:
  - name: 'Order Service'
    orgId: 1
    folder: 'Applications'
    type: file
    updateIntervalSeconds: 30
    options:
      path: /etc/grafana/dashboards/order-service

  - name: 'Infrastructure'
    orgId: 1
    folder: 'Infrastructure'
    type: file
    options:
      path: /etc/grafana/dashboards/infrastructure
```

### Key Techniques Used

```
1. Stat panels for quick-glance health (request rate, error rate, latency)
2. Time series for trends (traffic breakdown by status)
3. Heatmap for latency distribution (spot slow periods)
4. Variables for environment switching
5. Annotations for deployment tracking
6. Thresholds for color-coded health
7. Dashboard links to runbooks
8. Provisioning for version-controlled dashboards
```

---

**Key Takeaways:**
- Grafana connects to Prometheus as a data source via simple URL configuration
- Use variables for reusable, interactive dashboards
- Match panel types to data: time series for rates, heatmaps for distributions
- Provision dashboards as YAML/JSON for version control
- Follow dashboard layout hierarchy: overview → details → historical
- Combine PromQL queries with Grafana transformations for powerful visualizations
- Import community dashboard templates as starting points

---

## 🔗 Related Chapters

- [Chapter 4: Prometheus Architecture & Core Concepts]({{< relref "04-prometheus-architecture" >}}) — Understanding the data Grafana visualizes
- [Chapter 17: Alerting Rules & Alertmanager]({{< relref "17-alerting-rules" >}}) — Alerting on dashboard trends
- [Chapter 20: Practice Tests & Exam Preparation]({{< relref "20-practice-tests" >}}) — Testing your Prometheus knowledge

## 📚 Additional Resources

- [Grafana Documentation](https://grafana.com/docs/)
- [Grafana Prometheus Data Source](https://grafana.com/docs/grafana/latest/datasources/prometheus/)
- [Grafana Dashboard Provisioning](https://grafana.com/docs/grafana/latest/administration/provisioning/#dashboards)
- [Grafana Dashboard Library](https://grafana.com/grafana/dashboards/)

---

*Continue to → [Chapter 20: Practice Tests & Exam Preparation]({{< relref "20-practice-tests" >}})*
