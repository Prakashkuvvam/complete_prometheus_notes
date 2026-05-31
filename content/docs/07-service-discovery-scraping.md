---
title: "Chapter 7: Service Discovery & Scraping"
weight: 7
bookFlatSection: false
bookToc: true
---

# Chapter 7: Service Discovery & Scraping

## 🎯 Learning Objectives

- Understand how Prometheus discovers targets to scrape
- Configure static and dynamic service discovery
- Master relabeling for target and metric manipulation
- Understand scrape lifecycle and timing parameters
- Configure Kubernetes SD for container monitoring

---

## 7.1 Service Discovery Overview

Service Discovery (SD) is how Prometheus finds targets to scrape. Instead of hardcoding IP addresses, SD dynamically discovers targets from various providers.

```
                    ┌─────────────────────────┐
                    │   Service Discovery       │
                    │   Providers               │
                    │                           │
  ┌──────────────┐  │  ┌─────────────────────┐  │
  │ Static       │───▶  │ Target List          │  │
  │ (config)     │  │  │ (set of IP:port)     │  │
  └──────────────┘  │  └──────────┬──────────┘  │
  ┌──────────────┐  │             │              │
  │ Kubernetes   │───▶            ▼              │
  └──────────────┘  │  ┌─────────────────────┐  │
  ┌──────────────┐  │  │ Relabeling Rules     │──▶ Scrape
  │ Consul        │───▶  │ (filter, modify,    │  │
  └──────────────┘  │  │  add/remove labels)  │  │
  ┌──────────────┐  │  └─────────────────────┘  │
  │ EC2 / GCE    │───▶                          │
  └──────────────┘  └──────────────────────────┘
  ┌──────────────┐
  │ File-based   │───
  └──────────────┘
```

### Supported Service Discovery Methods

| Method | Provider | Best For |
|--------|----------|----------|
| `static_configs` | Manual | Simple, fixed targets |
| `file_sd_configs` | File-based | Dynamic targets from files |
| `kubernetes_sd_configs` | Kubernetes | Kubernetes-native monitoring |
| `consul_sd_configs` | Consul | Service mesh / registry |
| `ec2_sd_configs` | AWS EC2 | AWS instances |
| `gce_sd_configs` | GCP GCE | GCP instances |
| `azure_sd_configs` | Azure | Azure VMs |
| `dns_sd_configs` | DNS | DNS-based discovery |
| `openstack_sd_configs` | OpenStack | OpenStack instances |
| `docker_sd_configs` | Docker | Docker containers |
| `nerve_sd_configs` | Airbnb Nerve | Nerve-based SD |
| `serverset_sd_configs` | Google Serverset | Serverset-based SD |

---

## 7.2 Static Configuration

The simplest form of SD — targets are listed directly in the config file.

```yaml
scrape_configs:
  - job_name: 'static-servers'
    static_configs:
      - targets:
          - 'web-1:9090'
          - 'web-2:9090'
          - 'api-1:9090'
        labels:
          environment: 'production'
          team: 'platform'
      - targets:
          - 'staging-web:9090'
        labels:
          environment: 'staging'
```

### Static SD Use Cases

- Permanent infrastructure (load balancers, databases)
- Monitoring infrastructure itself (Prometheus, Alertmanager)
- Small deployments (< 20 targets)
- Testing and development environments

---

## 7.3 File-Based Service Discovery

File-based SD watches YAML or JSON files for target changes.

```yaml
scrape_configs:
  - job_name: 'file-sd'
    file_sd_configs:
      - files:
          - 'targets/*.json'
          - 'targets/*.yaml'
        refresh_interval: 5m  # How often to check for file changes
```

### Target File Formats

```json
// targets/web.json
[
  {
    "targets": ["10.0.1.1:9100", "10.0.1.2:9100", "10.0.1.3:9100"],
    "labels": {
      "service": "web",
      "environment": "production"
    }
  },
  {
    "targets": ["10.0.2.1:9100"],
    "labels": {
      "service": "web",
      "environment": "staging"
    }
  }
]
```

```yaml
# targets/db.yaml
- targets:
    - "db-1:9100"
    - "db-2:9100"
  labels:
    service: database
    role: primary

- targets:
    - "db-3:9100"
  labels:
    service: database
    role: replica
```

### When to Use File-Based SD

- Dynamic targets without a service registry
- Integration with configuration management (Ansible, Chef)
- Targets discovered by external scripts
- CICD pipeline artifacts with target lists

---

## 7.4 Consul Service Discovery

```yaml
scrape_configs:
  - job_name: 'consul-services'
    consul_sd_configs:
      - server: 'localhost:8500'
        datacenter: 'dc1'
        scheme: 'http'
        services: ['web', 'api', 'worker']  # Optional: filter by service names
        tags: ['production']  # Optional: filter by tags

    relabel_configs:
      # Map Consul service meta to labels
      - source_labels: [__meta_consul_service]
        target_label: service
      - source_labels: [__meta_consul_dc]
        target_label: datacenter
      - source_labels: [__meta_consul_node]
        target_label: node
      - source_labels: [__meta_consul_tags]
        target_label: tags
      - source_labels: [__meta_consul_service_address]
        target_label: __address__
```

### Consul Metadata Labels

| Label | Source | Description |
|-------|--------|-------------|
| `__meta_consul_address` | Consul | Node address |
| `__meta_consul_dc` | Consul | Datacenter name |
| `__meta_consul_node` | Consul | Node name |
| `__meta_consul_service` | Consul | Service name |
| `__meta_consul_service_address` | Consul | Service address |
| `__meta_consul_service_id` | Consul | Service instance ID |
| `__meta_consul_service_port` | Consul | Service port |
| `__meta_consul_tags` | Consul | Comma-separated tags |
| `__meta_consul_service_metadata_*` | Consul | Service metadata |

---

## 7.5 Kubernetes Service Discovery

Kubernetes SD is the most widely used dynamic SD method.

### Available Roles

```yaml
kubernetes_sd_configs:
  - role: pod           # Discover individual pods
  - role: service       # Discover services
  - role: endpoints     # Discover endpoints (pods behind services)
  - role: node          # Discover nodes
  - role: ingress       # Discover ingress resources
```

### Pod Discovery Example

```yaml
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      # Only scrape pods with prometheus.io/scrape: "true" annotation
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true

      # Use annotation for metrics path
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
        replacement: $1

      # Use annotation for port
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__

      # Add namespace label
      - source_labels: [__meta_kubernetes_namespace]
        target_label: namespace

      # Add pod name label
      - source_labels: [__meta_kubernetes_pod_name]
        target_label: pod

      # Add pod labels
      - source_labels: [__meta_kubernetes_pod_label_app]
        target_label: app
      - source_labels: [__meta_kubernetes_pod_label_component]
        target_label: component
```

### Kubernetes Pod Annotations

```yaml
# Required annotations on pods to enable scraping
apiVersion: v1
kind: Pod
metadata:
  annotations:
    prometheus.io/scrape: "true"      # Scrape this pod
    prometheus.io/path: "/metrics"     # Custom metrics path (default: /metrics)
    prometheus.io/port: "8080"         # Custom port (default: 9100 or container port)
    prometheus.io/scheme: "http"       # http or https
spec:
  containers:
    - name: app
      image: my-app:latest
      ports:
        - containerPort: 8080
```

### Endpoints Discovery

```yaml
scrape_configs:
  - job_name: 'kubernetes-service-endpoints'
    kubernetes_sd_configs:
      - role: endpoints
    relabel_configs:
      # Only scrape endpoints with prometheus.io/scrape annotation
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scheme]
        action: replace
        target_label: __scheme__
        regex: (https?)
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_service_annotation_prometheus_io_port]
        action: replace
        target_label: __address__
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
      - action: labelmap
        regex: __meta_kubernetes_service_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        target_label: namespace
      - source_labels: [__meta_kubernetes_service_name]
        target_label: service
```

---

## 7.6 Relabeling — The Power of Target Transformation

Relabeling modifies target metadata **before** scraping. It's one of Prometheus's most powerful features.

### Relabeling Actions

| Action | Description | Example |
|--------|-------------|---------|
| `keep` | Keep targets matching regex, drop others | Only keep targets with specific label |
| `drop` | Drop targets matching regex | Remove blacklisted targets |
| `replace` | Replace label value (default action) | Extract port from address |
| `labelmap` | Map labels from source to new names | Rename Kubernetes labels |
| `labeldrop` | Drop labels matching regex | Remove high-cardinality labels |
| `labelkeep` | Keep only labels matching regex |

### Relabeling Lifecycle

```
1. Service Discovery creates initial target metadata
   → Labels with "__" prefix are temporary/reloadable

2. relabel_configs process targets
   → Filter (keep/drop), modify (replace), map (labelmap)

3. After relabeling, "__" prefixed labels are removed
   → Only non-"__" labels remain on scraped metrics
```

### Common Relabeling Patterns

```yaml
# Pattern 1: Keep only specific targets
relabel_configs:
  - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
    action: keep
    regex: true

# Pattern 2: Extract port from address
relabel_configs:
  - source_labels: [__address__]
    regex: '(.*):(.*)'
    replacement: '${1}'
    target_label: host
  - source_labels: [__address__]
    regex: '(.*):(.*)'
    replacement: '${2}'
    target_label: port

# Pattern 3: Rename labels
relabel_configs:
  - source_labels: [__meta_kubernetes_namespace]
    target_label: namespace

# Pattern 4: Map all Kubernetes labels
relabel_configs:
  - action: labelmap
    regex: __meta_kubernetes_pod_label_(.+)

# Pattern 5: Remove high-cardinality labels
relabel_configs:
  - action: labeldrop
    regex: 'temporary_id|session_id'

# Pattern 6: Add static labels to all targets
relabel_configs:
  - target_label: environment
    replacement: 'production'

# Pattern 7: Modify metrics path
relabel_configs:
  - source_labels: [__meta_consul_service_metadata_metrics_path]
    action: replace
    target_label: __metrics_path__
    regex: (.+)
```

### Reserved Labels (__ prefix)

| Label | Description | Set By |
|-------|-------------|--------|
| `__address__` | Target address (host:port) | All SD methods |
| `__metrics_path__` | Path to scrape (/metrics) | Default /metrics |
| `__scheme__` | HTTP scheme (http/https) | Default http |
| `__param_*` | URL query parameters | Manual |
| `__meta_*` | Service discovery metadata | SD providers |

> **Exam Tip:** Labels prefixed with `__` are removed after relabeling. Only non-`__` labels persist on metrics.

---

## 7.7 Metric Relabeling

**Metric relabeling** happens **after** scraping but **before** storage. It operates on the scraped metric data.

```yaml
scrape_configs:
  - job_name: 'example'
    static_configs:
      - targets: ['localhost:9090']

    # Target relabeling (before scrape)
    relabel_configs:
      - source_labels: [__address__]
        target_label: datacenter
        replacement: 'us-east-1'

    # Metric relabeling (after scrape, before storage)
    metric_relabel_configs:
      # Keep only specific metrics
      - source_labels: [__name__]
        regex: 'prometheus_http_.*'
        action: keep

      # Drop metrics with high cardinality labels
      - source_labels: [handler]
        regex: '/api/v1/.*'
        action: drop

      # Rename metrics
      - source_labels: [__name__]
        regex: 'old_metric_name'
        replacement: 'new_metric_name'
        action: replace
```

### Metric Relabeling Use Cases

| Use Case | Configuration |
|----------|--------------|
| **Keep only needed metrics** | `action: keep` on `__name__` |
| **Drop expensive metrics** | `action: drop` with label condition |
| **Remove high-cardinality labels** | `action: labeldrop` |
| **Rename metrics** | `action: replace` on `__name__` |
| **Add labels from metric values** | `action: replace` with source labels |

---

## 7.8 Scrape Configuration Deep Dive

### All Scrape Configuration Options

```yaml
scrape_configs:
  - job_name: 'example'

    # Timing
    scrape_interval: 30s         # How often to scrape (default: global)
    scrape_timeout: 10s           # Scrape request timeout
    sample_limit: 1000            # Max samples per scrape
    body_size_limit: 10MB         # Max response body size

    # HTTP configuration
    metrics_path: /metrics        # HTTP path
    scheme: http                  # http or https
    params:
      name: ['value']             # URL query parameters

    # Authentication
    basic_auth:
      username: admin
      password_file: /etc/prometheus/passwords
    authorization:
      type: Bearer
      credentials_file: /etc/prometheus/token
    oauth2:
      client_id: xxx
      client_secret: yyy
      token_url: https://auth.example.com/token
    tls_config:
      ca_file: /etc/prometheus/ca.pem
      cert_file: /etc/prometheus/cert.pem
      key_file: /etc/prometheus/key.pem
      insecure_skip_verify: false

    # Honor labels (usually true)
    honor_labels: false          # Whether to preserve target labels over server labels
    honor_timestamps: true       # Whether to use target's timestamp

    # Target management
    static_configs:
      - targets: ['localhost:9090']
```

### honor_labels Explained

```yaml
# Scenario: Target exposes metric with label "job" or "instance"
honor_labels: false (default)
# ❌ Target's job/instance labels are replaced by server's values

honor_labels: true
# ✅ Target's job/instance labels are preserved (server values ignored)
```

> **Use `honor_labels: true` when** targets export metrics with meaningful `job` or `instance` labels that must be preserved.

---

## 7.9 Scrape Performance Considerations

### Scrape Lifecycle Performance

```
[SD Lookup] → [Relabel] → [HTTP Scrape] → [Parse] → [Metric Relabel] → [Store]

Timing breakdown:
- SD lookup: 1-5s (depends on provider)
- HTTP scrape: 0.1-10s (depends on target)
- Parse + relabel: 0.1-1s
- Store: 0.01-0.1s
```

### Optimization Tips

```yaml
# 1. Set appropriate sample_limit to prevent overload
scrape_configs:
  - job_name: 'user-apps'
    sample_limit: 5000         # Max 5000 samples per scrape
    body_size_limit: 50MB      # Max response body size

# 2. Increase scrape interval for non-critical targets
  - job_name: 'batch-jobs'
    scrape_interval: 5m        # Less frequent scraping
    scrape_timeout: 30s        # Longer timeout for slow targets

# 3. Drop unnecessary metrics early
    metric_relabel_configs:
      - source_labels: [__name__]
        regex: '.*_total$'
        action: keep           # Only keep counter metrics
```

---

## 🌐 Real-World Scenario: Troubleshooting Missing Targets in Kubernetes

### The Problem

You deployed a new microservice to Kubernetes with Prometheus annotations, but the target isn't appearing in the Prometheus targets page. Here's how to systematically debug this.

### Step 1: Verify Pod Annotations

```bash
# Check if the pod has the correct scrape annotations
kubectl get pod my-service-7d8f9c -n production -o yaml | grep -A 5 prometheus.io

# Expected output:
#   prometheus.io/scrape: "true"
#   prometheus.io/port: "8080"
#   prometheus.io/path: "/metrics"
#   prometheus.io/scheme: "http"
```

### Step 2: Check Prometheus Target Status

```promql
# Are any targets being discovered from this namespace?
up{namespace="production"}

# Check for scrape errors
rate(prometheus_target_scrapes_exceeded_sample_limit_total{job="kubernetes-pods"}[5m])

# Check total scraped targets
count(up{job="kubernetes-pods"})
```

### Step 3: Debug Relabeling with promtool

```yaml
# Create a test relabel config (prometheus.yml test snippet)
# Use promtool to simulate relabeling:
scrape_configs:
  - job_name: 'test'
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
```

### Common Kubernetes SD Issues & Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Wrong annotation** | Target not discovered | Check annotation values match regex (e.g. `"true"` not `true` without quotes) |
| **Wrong port** | Target discovered but scrape fails | Verify `prometheus.io/port` matches containerPort |
| **RBAC missing** | SD errors in logs | Add ClusterRole permissions for pods/endpoints |
| **Network policy** | Scrape timeout | Add NetworkPolicy allowing Prometheus to scrape |
| **Label mismatch** | Target kept but wrong labels | Check `relabel_configs` regex matches metadata |
| **Too many targets** | Some targets dropped | Increase `sample_limit` or add more Prometheus instances |

### Step 4: RBAC Configuration (Critical Fix)

```yaml
# Without this, Kubernetes SD won't discover anything
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
  - apiGroups: [""]
    resources:
      - nodes
      - nodes/proxy
      - services
      - endpoints
      - pods
    verbs: ["get", "list", "watch"]
  - apiGroups: ["extensions"]
    resources:
      - ingresses
    verbs: ["get", "list", "watch"]
  - nonResourceURLs: ["/metrics"]
    verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: prometheus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: prometheus
subjects:
  - kind: ServiceAccount
    name: prometheus
    namespace: monitoring
```

### Step-by-Step Relabeling Debug Walkthrough

```yaml
# Imagine you have a pod with these metadata labels:
# __meta_kubernetes_pod_label_app: "my-app"
# __meta_kubernetes_pod_label_version: "v2"
# __meta_kubernetes_namespace: "production"
# __meta_kubernetes_pod_name: "my-app-7d8f9c-x3k2j"
# __meta_kubernetes_pod_annotation_prometheus_io_scrape: "true"

# After relabel_configs:
# 1. keep: matches __meta_kubernetes_pod_annotation_prometheus_io_scrape == "true" ✅
# 2. replace: namespace = "production" ✅
# 3. replace: pod = "my-app-7d8f9c-x3k2j" ✅
# 4. labelmap: app = "my-app" (from __meta_kubernetes_pod_label_app) ✅
#    version = "v2" (from __meta_kubernetes_pod_label_version) ✅

# Final target labels after __ prefix cleanup:
# {job="kubernetes-pods", instance="10.0.1.5:8080",
#  namespace="production", pod="my-app-7d8f9c-x3k2j",
#  app="my-app", version="v2"}
```

---

## 📝 Exam Tips

1. **Service Discovery** finds targets dynamically; no need to hardcode IPs
2. **Relabeling happens BEFORE scrape** (target relabeling) and AFTER scrape (metric relabeling)
3. **`__` prefixed labels are temporary** — removed after relabeling
4. **Target relabeling:** `relabel_configs` (before scrape)
5. **Metric relabeling:** `metric_relabel_configs` (after scrape)
6. **SD roles in Kubernetes:** pod, service, endpoints, node, ingress
7. **`keep` vs `drop`** — keep retains matching targets, drop removes them
8. **`labelmap`** maps SD metadata labels to target labels
9. **Kubernetes annotations** control pod scraping behavior
10. **`refresh_interval`** controls how often file-based SD checks for changes

---

## ✅ Chapter 7 Quiz

1. **What is the difference between `relabel_configs` and `metric_relabel_configs`?**
   - a) They are the same thing
   - b) `relabel_configs` runs before scrape, `metric_relabel_configs` runs after
   - c) `relabel_configs` runs after scrape, `metric_relabel_configs` runs before
   - d) One is for Kubernetes, the other is for static configs

2. **Which relabeling action keeps only targets that match a regex?**
   - a) `keep`
   - b) `drop`
   - c) `labelkeep`
   - d) `labeldrop`

3. **In Kubernetes SD, which role discovers individual pods?**
   - a) `service`
   - b) `node`
   - c) `pod`
   - d) `endpoints`

4. **What happens to labels prefixed with `__` after relabeling?**
   - a) They are preserved
   - b) They are removed
   - c) They are renamed
   - d) They are converted to annotations

5. **Which annotation tells a Prometheus Kubernetes SD to scrape a pod?**
   - a) `prometheus.io/port`
   - b) `prometheus.io/scrape`
   - c) `prometheus.io/path`
   - d) `prometheus.io/enable`

<details>
<summary>📌 Answers</summary>

1. **b** — `relabel_configs` applies to targets before scraping; `metric_relabel_configs` applies to metrics after scraping
2. **a** — `keep` action retains targets matching the regex and drops all others
3. **c** — The `pod` role discovers individual pods in Kubernetes
4. **b** — Labels prefixed with `__` (like `__meta_*`) are removed after relabeling completes
5. **b** — `prometheus.io/scrape: "true"` annotation tells Prometheus to scrape that pod
</details>

---

## 🔗 Related Chapters

- [Chapter 4: Prometheus Architecture & Core Concepts]({{< relref "04-prometheus-architecture" >}}) — The scrape lifecycle overview
- [Chapter 5: Installation & Configuration]({{< relref "05-installation-configuration" >}}) — Configuring scrape jobs
- [Chapter 15: Exporters]({{< relref "15-exporters" >}}) — What Prometheus scrapes from targets

## 📚 Additional Resources

- [Prometheus Service Discovery](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)
- [Kubernetes SD Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#kubernetes_sd_config)
- [Relabeling Guide](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#relabel_config)
- [Prometheus Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)

---

*Continue to → [Chapter 8: Storage & Retention]({{< relref "08-storage-retention" >}})*
