---
title: "Pushgateway & Short-Lived Jobs"
weight: 16
bookToc: true
---

# Pushgateway & Short-Lived Jobs

The Pushgateway allows ephemeral and batch jobs to push their metrics to Prometheus. This chapter covers when to use it, how to configure it, and important caveats.

## What is the Pushgateway?

The Pushgateway is an intermediary that accepts metrics pushed from short-lived jobs, stores them, and serves them to Prometheus via scraping.

```
Batch Job ──POST──> Pushgateway ──scrape──> Prometheus
```

### When to Use

**Appropriate uses:**
- Batch jobs (ETL pipelines, data processing)
- CI/CD pipeline metrics (build time, test counts)
- Cron job outcomes (success/failure, duration)
- Jobs that run for seconds then exit

**Inappropriate uses:**
- Long-running services (use direct instrumentation)
- High-cardinality metrics (Pushgateway stores indefinitely)
- Metrics where timeliness matters (push ≠ pull timestamp)

## Installation & Configuration

### Install

```bash
wget https://github.com/prometheus/pushgateway/releases/download/v1.7.0/pushgateway-1.7.0.linux-amd64.tar.gz
tar xvf pushgateway-1.7.0.linux-amd64.tar.gz
cd pushgateway-1.7.0.linux-amd64
./pushgateway
```

Default port: **9091**

### Prometheus Scrape Config

```yaml
scrape_configs:
  - job_name: pushgateway
    honor_labels: true   # IMPORTANT: preserve pushed labels
    static_configs:
      - targets: ['localhost:9091']
```

**Crucially, set `honor_labels: true`** — this preserves the job/instance labels pushed by the batch job rather than overwriting them.

### Systemd Service

```bash
cat > /etc/systemd/system/pushgateway.service <<EOF
[Unit]
Description=Pushgateway
After=network.target

[Service]
User=pushgateway
ExecStart=/usr/local/bin/pushgateway
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```

## Pushing Metrics

### Using cURL

Push metrics via HTTP POST to the Pushgateway API:

```bash
# Push a single metric
echo 'batch_job_duration_seconds 42.5' | curl --data-binary @- http://localhost:9091/metrics/job/my_batch_job

# Push with labels
echo 'batch_job_completed{status="success"} 1' | curl --data-binary @- http://localhost:9091/metrics/job/my_batch_job/instance/server1

# Push counter values
cat <<EOF | curl --data-binary @- http://localhost:9091/metrics/job/backup/instance/db1
# HELP backup_files_total Number of files backed up
# TYPE backup_files_total counter
backup_files_total{type="database"} 42
backup_files_total{type="config"} 15
backup_duration_seconds 120.5
EOF
```

### Using Client Libraries

**Python Example:**
```python
from prometheus_client import CollectorRegistry, Gauge, push_to_gateway

registry = CollectorRegistry()
g = Gauge('batch_duration_seconds', 'Duration of batch job', registry=registry)
g.set(42.5)
push_to_gateway('localhost:9091', job='my_batch', registry=registry)
```

**Go Example:**
```go
import "github.com/prometheus/client_golang/prometheus/push"

duration := prometheus.NewGauge(prometheus.GaugeOpts{
    Name: "batch_duration_seconds",
    Help: "Duration of batch job",
})

duration.Set(42.5)
if err := push.New("localhost:9091", "my_batch").
    Collector(duration).
    Push(); err != nil {
    log.Fatal(err)
}
```

## Understanding Push vs Replace

### `Push()` — Add to existing metrics

```python
push_to_gateway('localhost:9091', job='my_batch', registry=registry)
```

If the same job/instance already has metrics, new metrics are added to them. Old metrics from previous pushes for this job remain.

### `PushAdd()` — Replace specific metrics

```python
from prometheus_client import pushadd_to_gateway

pushadd_to_gateway('localhost:9091', job='my_batch', registry=registry)
```

Replaces metrics in the registry within the job, but leaves other metrics for that job unchanged.

### `Delete()` — Remove all metrics for a job

```bash
# Delete all metrics for a job
curl -X DELETE http://localhost:9091/metrics/job/my_batch_job

# Delete metrics with specific labels
curl -X DELETE http://localhost:9091/metrics/job/my_batch_job/instance/server1
```

**Always delete after push!** Otherwise stale metrics accumulate:

```python
push_to_gateway('localhost:9091', job='my_batch', registry=registry)
# ... after scraping, delete
import requests
requests.delete('http://localhost:9091/metrics/job/my_batch')
```

## Important Caveats

### 1. Stale Metrics

Pushgateway does not expire metrics. A metric pushed once persists until:
- A new push with the same metric replaces it
- Explicit deletion via the API
- The Pushgateway restarts

### 2. No Alerting on Staleness

Since Pushgateway always serves the last-pushed value, Prometheus's `for` clause still works, but `absent()` won't trigger if the job fails silently.

**Workaround:** Include a push timestamp metric:

```bash
echo 'batch_last_success_timestamp_seconds 1700000000' | curl --data-binary @- http://localhost:9091/metrics/job/my_batch
```

Then alert if the timestamp is too old:

```promql
time() - batch_last_success_timestamp_seconds{job="my_batch"} > 3600
```

### 3. Single Point of Failure

The Pushgateway itself must be monitored and highly available if critical.

### 4. Security

Enable authentication for the push endpoint:

```bash
./pushgateway --web.config.file=web-config.yml
```

### 5. Resource Management

Set resource limits for batch pushes to prevent large pushes from consuming all memory:

```yaml
# In docker-compose.yml
services:
  pushgateway:
    image: prom/pushgateway
    deploy:
      resources:
        limits:
          memory: 256M
```

## Pushgateway Metrics

The Pushgateway itself exposes metrics:

```promql
# Number of metrics being stored in Pushgateway
pushgateway_build_info

# Number of pushes
rate(pushgateway_http_push_duration_seconds_count[5m])

# Push request size
pushgateway_http_push_size_bytes

# Number of metrics per group
pushgateway_metrics_total
```

## Alternative Approaches

### For Batch Jobs (When Pushgateway Isn't Ideal)

1. **Write to a file and use Node Exporter textfile collector:**
   ```bash
   echo 'batch_duration_seconds 42.5' > /var/lib/node_exporter/textfile/batch.prom
   ```

2. **Use a client library with HTTP endpoint** (long-lived sidecar)

3. **Log metrics to stdout** and use a log scraper

---

## 🌐 Real-World Scenario: CI/CD Pipeline Monitoring with Pushgateway

### The Challenge

Your team runs a CI/CD pipeline (Jenkins/GitHub Actions) that runs build and deploy jobs. These jobs last 2-15 minutes and then terminate. You need to capture metrics from every pipeline run.

### Step 1: Design the Push Strategy

```bash
#!/bin/bash
# deploy.sh — CI/CD pipeline script

# Set job identifier
JOB_NAME="deploy"
INSTANCE="${BUILD_NUMBER:-local}"
PUSHGATEWAY="pushgateway.monitoring:9091"

# Record start time
START_TIME=$(date +%s)

echo "Starting deployment..."

# Run the actual deployment
./run-deploy.sh
DEPLOY_EXIT_CODE=$?

# Record end time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Determine status
if [ $DEPLOY_EXIT_CODE -eq 0 ]; then
    STATUS="success"
else
    STATUS="failure"
fi

# Push metrics to Pushgateway
cat <<EOF | curl -s --data-binary @- "http://${PUSHGATEWAY}/metrics/job/${JOB_NAME}/instance/${INSTANCE}"
# HELP deploy_duration_seconds Duration of deployment in seconds
# TYPE deploy_duration_seconds gauge
deploy_duration_seconds{status="${STATUS}"} ${DURATION}
# HELP deploy_exit_code Exit code of deployment
# TYPE deploy_exit_code gauge
deploy_exit_code{status="${STATUS}"} ${DEPLOY_EXIT_CODE}
# HELP deploy_timestamp Unix timestamp of deployment run
# TYPE deploy_timestamp gauge
deploy_timestamp{status="${STATUS}"} ${END_TIME}
EOF

# Clean up old metrics for this job (if needed)
# curl -X DELETE "http://${PUSHGATEWAY}/metrics/job/${JOB_NAME}"

exit $DEPLOY_EXIT_CODE
```

### Step 2: Alert on Pipeline Failures

```promql
# Has any deploy failed in the last hour?
time() - deploy_timestamp{status="failure"} < 3600

# Deploy success rate (last 100 runs)
# Need a counter for this — use Pushgateway's ability to accumulate
```

### Step 3: Advanced Push with Python

```python
#!/usr/bin/env python3
"""
CI/CD pipeline metrics pusher with staleness detection
"""
import time
import requests
from prometheus_client import CollectorRegistry, Gauge, Counter, push_to_gateway

PUSHGATEWAY = "pushgateway.monitoring:9091"

def push_pipeline_metrics(job_name: str, status: str, duration: float, stage: str):
    """Push pipeline metrics with proper cleanup."""
    registry = CollectorRegistry()
    
    # Gauge: Current run duration (replaces on each push)
    duration_gauge = Gauge(
        'pipeline_duration_seconds',
        'Duration of pipeline run',
        ['status', 'stage'],
        registry=registry
    )
    duration_gauge.labels(status=status, stage=stage).set(duration)
    
    # Counter: Total runs (accumulates across pushes)
    # Note: This will persist indefinitely — use with caution!
    total_counter = Counter(
        'pipeline_runs_total',
        'Total pipeline runs',
        ['status', 'stage'],
        registry=registry
    )
    total_counter.labels(status=status, stage=stage).inc()
    
    # Timestamp gauge for staleness detection
    timestamp_gauge = Gauge(
        'pipeline_last_run_timestamp',
        'Timestamp of last pipeline run',
        ['status', 'stage'],
        registry=registry
    )
    timestamp_gauge.labels(status=status, stage=stage).set(time.time())
    
    # Push to Pushgateway
    push_to_gateway(
        PUSHGATEWAY,
        job=job_name,
        registry=registry,
        # Use pushadd to replace only our metrics
        # Use push to append (creates duplicates!)
    )
    print(f"Pushed metrics for {job_name}: {status} ({duration:.1f}s)")

# Usage in pipeline
push_pipeline_metrics(
    job_name="deploy-prod",
    status="success",
    duration=142.5,
    stage="deploy"
)
```

### Step 4: Monitor Pushgateway Staleness

```promql
# Alert if no successful deploy in 24 hours
time() - pipeline_last_run_timestamp{job="deploy-prod", status="success"} > 86400

# Check if Pushgateway itself is healthy
up{job="pushgateway"}

# How many metrics is Pushgateway storing?
pushgateway_metrics_total

# Is Pushgateway receiving pushes?
rate(pushgateway_http_push_duration_seconds_count[5m])
```

### Step 5: The Manual Cleanup Procedure

```bash
# When a batch job has a bug and pushes wrong metrics:

# 1. List all metrics in Pushgateway
# (Visit http://pushgateway:9091 in browser)

# 2. Delete specific job
curl -X DELETE http://pushgateway:9091/metrics/job/deploy-prod

# 3. Delete with specific labels
curl -X DELETE http://pushgateway:9091/metrics/job/deploy-prod/instance/42

# 4. Verify deletion
curl http://pushgateway:9091/metrics
```

### Push vs Textfile Collector Decision

```
Your job runs for...
│
├─ < 1 minute AND runs infrequently (cron, batch)
│  └─ Pushgateway best option
│     (Job finishes before next scrape cycle)
│
├─ 1-15 minutes AND runs on a managed host
│  └─ Either Pushgateway or Textfile collector works
│     (Node Exporter scrapes every 15-60s)
│
├─ > 15 minutes (long-running job)
│  └─ Textfile collector preferred
│     (No extra dependency on Pushgateway)
│
└─ Running in ephemeral container (no Node Exporter)
   └─ Pushgateway is the only option
```

---

**Key Takeaways:**
- Pushgateway is for short-lived/batch jobs only, not services
- Always delete metrics after the job completes to avoid staleness
- Set `honor_labels: true` in the scrape config
- Include a push timestamp for staleness detection
- Monitor Pushgateway itself as a single point of failure
- Consider the textfile collector as a simpler alternative for some cases

---

## 🔗 Related Chapters

- [Chapter 14: Client Libraries & Instrumentation]({{< relref "14-client-libraries-instrumentation" >}}) — Instrumenting long-running services
- [Chapter 15: Exporters]({{< relref "15-exporters" >}}) — Pre-built integrations including Node Exporter textfile collector

## 📚 Additional Resources

- [Pushgateway GitHub](https://github.com/prometheus/pushgateway)
- [Pushgateway Best Practices](https://prometheus.io/docs/practices/pushing/)
- [Client Library Push Examples](https://prometheus.io/docs/instrumenting/pushing/)

---

*Continue to → [Chapter 17: Alerting Rules & Alertmanager]({{< relref "17-alerting-rules" >}})*
