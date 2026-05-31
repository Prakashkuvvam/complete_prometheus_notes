---
title: "Practice Test 7"
weight: 35
bookToc: true
---

# Practice Test 7

**Time:** 90 minutes | **Questions:** 60 | **Passing Score:** 42/60 (70%)

{{< exam-timer time="90" >}}

## Instructions

- Answer all 60 questions
- Each question has one or more correct answers
- Mark your answers using the interactive checkboxes
- Click **Check Answer** to verify
- Use the timer above to track your time

---

### Question 1 (Observability)

What is "black-box monitoring" primarily used for?

- [ ] A) Monitoring application internals
- [ ] B) Verifying that a system is behaving correctly from the outside
- [ ] C) Monitoring database performance
- [ ] D) Debugging code errors

<details>
<summary>Show Answer</summary>
**B)** Black-box monitoring verifies externally visible behavior.
</details>

---

### Question 2 (Prometheus Fundamentals)

What is the fundamental storage unit in Prometheus TSDB?

- [ ] A) Database
- [ ] B) Block
- [ ] C) Table
- [ ] D) Index

<details>
<summary>Show Answer</summary>
**B)** The TSDB stores data in blocks (read-only, compressed chunks of time-series data).
</details>

---

### Question 3 (PromQL)

What does `rate(up[5m])` return when a target was up for 3 minutes and down for 2 minutes?

- [ ] A) 0.6
- [ ] B) An error — rate() only works with counter metrics
- [ ] C) 0.5
- [ ] D) The average of up values (0 or 1)

<details>
<summary>Show Answer</summary>
**B)** `rate()` is only valid for Counter metrics. `up` is a Gauge.
</details>

---

### Question 4 (Instrumentation & Exporters)

Which metric from the Blackbox Exporter shows the SSL certificate expiration?

- [ ] A) `probe_ssl_expiry`
- [ ] B) `probe_ssl_earliest_cert_expiry`
- [ ] C) `probe_cert_expiry`
- [ ] D) `ssl_expiry_seconds`

<details>
<summary>Show Answer</summary>
**B)** `probe_ssl_earliest_cert_expiry` returns the Unix timestamp of the earliest SSL certificate expiry.
</details>

---

### Question 5 (Alerting)

What does the `# HELP` line provide in an alerting rule context?

- [ ] A) Documentation for the rule
- [ ] B) Not applicable to alerting rules
- [ ] C) Alert annotations
- [ ] D) Alert type

<details>
<summary>Show Answer</summary>
**B)** `# HELP` is part of the metrics exposition format, not alerting rules.
</details>

---

### Question 6 (Observability)

What is the recommended approach for determining SLO targets?

- [ ] A) Use industry benchmarks
- [ ] B) Measure what users need and work backward
- [ ] C) Set 99.99% for everything
- [ ] D) Use the highest achievable number

<details>
<summary>Show Answer</summary>
**B)** Start from user expectations and define SLOs that meet their requirements.
</details>

---

### Question 7 (Prometheus Fundamentals)

What is the effect of the `--storage.tsdb.retention.signals` flag?

- [ ] A) Enables deletion of TSDB blocks based on OS signals
- [ ] B) Configures retention signal handling
- [ ] C) Not a valid flag
- [ ] D) Controls retention signal logs

<details>
<summary>Show Answer</summary>
**C)** There is no such flag.
</details>

---

### Question 8 (PromQL)

What does `avg by (device) (rate(node_disk_read_bytes_total[5m]))` return?

- [ ] A) Average total bytes read per device
- [ ] B) Per-second read rate per disk device
- [ ] C) Average read speed across all devices
- [ ] D) Total reads per device

<details>
<summary>Show Answer</summary>
**B)** It averages the per-second disk read rate across instances, grouped by device.
</details>

---

### Question 9 (Instrumentation & Exporters)

What is the purpose of the `node_filesystem_device_error` metric?

- [ ] A) Number of filesystem errors
- [ ] B) 1 if there were errors getting filesystem stats for a mount
- [ ] C) Filesystem read errors
- [ ] D) Disk error count

<details>
<summary>Show Answer</summary>
**B)** It flags whether there were errors retrieving metrics for a specific filesystem.
</details>

---

### Question 10 (Alerting)

What is the purpose of the `slack_configs` `text` field?

- [ ] A) The main text content of the Slack notification
- [ ] B) The Slack message title
- [ ] C) The Slack channel name
- [ ] D) The notification footer

<details>
<summary>Show Answer</summary>
**A)** The `text` field provides the main body content of the Slack alert message.
</details>

---

### Question 11 (Observability)

What is an example of a utilization metric in the USE method?

- [ ] A) CPU usage percentage
- [ ] B) Queue length
- [ ] C) Error count
- [ ] D) Response time

<details>
<summary>Show Answer</summary>
**A)** Utilization measures how busy a resource is (e.g., CPU at 70%).
</details>

---

### Question 12 (Prometheus Fundamentals)

What is the `--storage.tsdb.wal-segments-max` flag used for?

- [ ] A) Maximum number of WAL segments
- [ ] B) Maximum size of WAL segments
- [ ] C) Not a valid flag
- [ ] D) Controls WAL compression

<details>
<summary>Show Answer</summary>
**A)** It limits the number of WAL segment files to prevent excessive disk usage.
</details>

---

### Question 13 (PromQL)

What does `rate(node_cpu_seconds_total{mode="idle"}[5m]) < 0.2` return?

- [ ] A) True/false vector for idle rate below 0.2
- [ ] B) Filtered list of idle rates below 0.2
- [ ] C) Boolean vector of 0s and 1s
- [ ] D) Error — comparison with rate()

<details>
<summary>Show Answer</summary>
**B)** Comparison operators filter results by default, returning only series where condition is true.
</details>

---

### Question 14 (Instrumentation & Exporters)

What does the `node_memory_Cached_bytes` metric represent on Linux systems?

- [ ] A) Filesystem cache memory in bytes
- [ ] B) Cached disk data in memory
- [ ] C) Buffer cache memory
- [ ] D) Swap cache

<details>
<summary>Show Answer</summary>
**A)** It shows the amount of memory used for the Linux page cache (filesystem cache).
</details>

---

### Question 15 (Alerting)

What is the purpose of the `http_config` `tls_config` in Alertmanager?

- [ ] A) To configure TLS for the Alertmanager web server
- [ ] B) To configure TLS for outgoing webhook requests
- [ ] C) To configure TLS for scraping
- [ ] D) To configure TLS for remote write

<details>
<summary>Show Answer</summary>
**B)** `tls_config` sets TLS client certificates for outgoing webhook notification connections.
</details>

---

### Question 16 (Observability)

What is a "composite SLI"?

- [ ] A) An SLI that combines multiple measurements into one score
- [ ] B) An SLI for composite services
- [ ] C) An SLI with multiple SLOs
- [ ] D) An SLI with multiple targets

<details>
<summary>Show Answer</summary>
**A)** Composite SLIs combine several measurements (e.g., latency + availability) into a single indicator.
</details>

---

### Question 17 (Prometheus Fundamentals)

What does `--query.max-concurrency` control in Prometheus?

- [ ] A) Maximum concurrent queries
- [ ] B) Maximum concurrent scrapes
- [ ] C) Maximum concurrent remote writes
- [ ] D) Maximum connections to the web UI

<details>
<summary>Show Answer</summary>
**A)** It limits the number of queries that can execute simultaneously.
</details>

---

### Question 18 (PromQL)

What does `quantile(0.95, rate(http_requests_total[5m]))` do?

- [ ] A) Returns the 95th percentile of request rates
- [ ] B) Returns the 95th percentile of the metric across time series
- [ ] C) Error — `quantile()` is not a valid PromQL function
- [ ] D) Returns the 95th value

<details>
<summary>Show Answer</summary>
**C)** There is no standalone `quantile()` function in PromQL. Use `quantile_over_time()` or `histogram_quantile()`.
</details>

---

### Question 19 (Instrumentation & Exporters)

What is the purpose of the `go_memstats_alloc_bytes` metric?

- [ ] A) Total allocated bytes since start
- [ ] B) Current heap memory allocation
- [ ] C) Number of memory allocations
- [ ] D) Memory freed by GC

<details>
<summary>Show Answer</summary>
**B)** `go_memstats_alloc_bytes` is a gauge of current heap memory allocation.
</details>

---

### Question 20 (Alerting)

What is the purpose of the `VictorOps` `routing_key` field?

- [ ] A) To set the VictorOps API routing key
- [ ] B) To route alerts to specific VictorOps teams
- [ ] C) To configure the VictorOps URL
- [ ] D) To set the API endpoint

<details>
<summary>Show Answer</summary>
**A)** The `routing_key` identifies the VictorOps routing configuration for alerts.
</details>

---

### Question 21 (Observability)

What is the "four golden signals" latency measure typically expressed as?

- [ ] A) Average latency
- [ ] B) 50th percentile
- [ ] C) High percentiles (p95, p99)
- [ ] D) Minimum latency

<details>
<summary>Show Answer</summary>
**C)** High percentiles reveal the experience of the slowest users.
</details>

---

### Question 22 (Prometheus Fundamentals)

What is the effect of setting `honor_labels: false` (default) for Pushgateway scraping?

- [ ] A) Pushed job/instance labels are replaced with scrape config values
- [ ] B) Pushed labels are honored
- [ ] C) All labels are dropped
- [ ] D) Duplicate labels cause an error

<details>
<summary>Show Answer</summary>
**A)** With `honor_labels: false` (default), Prometheus overwrites `job` and `instance` labels with scrape config values.
</details>

---

### Question 23 (PromQL)

What does `topk(5, sum by (instance) (rate(node_cpu_seconds_total[5m])))` return?

- [ ] A) Top 5 instances by CPU rate
- [ ] B) Top 5 CPU rates per instance
- [ ] C) Top 5 CPU metrics
- [ ] D) Top 5 rate values

<details>
<summary>Show Answer</summary>
**A)** It returns the 5 instances with the highest CPU rates.
</details>

---

### Question 24 (Instrumentation & Exporters)

What is the purpose of the `node_softnet_processed_total` metric?

- [ ] A) Total processed network packets
- [ ] B) Total softnet processing
- [ ] C) Network processing load
- [ ] D) Interrupt processing count

<details>
<summary>Show Answer</summary>
**A)** It tracks the total number of processed network packets by the softnet subsystem.
</details>

---

### Question 25 (Alerting)

What is the purpose of the `email_configs` `auth_password` field?

- [ ] A) SMTP authentication password
- [ ] B) Email account password
- [ ] C) Webhook password
- [ ] D) API key

<details>
<summary>Show Answer</summary>
**A)** It provides the password for SMTP server authentication.
</details>

---

### Question 26 (Observability)

What is a "canary" in the context of SLI monitoring?

- [ ] A) A test user
- [ ] B) A small subset of users or servers tested with changes
- [ ] C) A monitoring tool
- [ ] D) A type of alert

<details>
<summary>Show Answer</summary>
**B)** Canaries monitor a small subset of servers/requests to detect issues before full rollout.
</details>

---

### Question 27 (Prometheus Fundamentals)

What is the maximum number of open file descriptors that `--web.max-connections` configures?

- [ ] A) Maximum HTTP connections
- [ ] B) Maximum concurrent connections
- [ ] C) Maximum file descriptors
- [ ] D) Maximum remote connections

<details>
<summary>Show Answer</summary>
**B)** `--web.max-connections` limits concurrent HTTP connections to the web UI/API.
</details>

---

### Question 28 (PromQL)

What does `sum by (instance) (rate(node_network_receive_bytes_total[5m]))` calculate?

- [ ] A) Total bytes received per instance
- [ ] B) Average per-second network receive rate per instance
- [ ] C) Total network throughput
- [ ] D) Number of network interfaces

<details>
<summary>Show Answer</summary>
**B)** It calculates per-second network receive rate aggregated by instance.
</details>

---

### Question 29 (Instrumentation & Exporters)

What is the purpose of the `--collector.systemd` flag in Node Exporter?

- [ ] A) Enable systemd unit metrics collection
- [ ] B) Configure systemd service
- [ ] C) Enable system monitoring
- [ ] D) Configure system logging

<details>
<summary>Show Answer</summary>
**A)** It enables the systemd collector to expose unit states (active, inactive, failed).
</details>

---

### Question 30 (Alerting)

What is the purpose of the `inhibit_rules` `source_match` field?

- [ ] A) Match the source Alertmanager
- [ ] B) Match the source alert that triggers inhibition
- [ ] C) Match the source target
- [ ] D) Match the source metric

<details>
<summary>Show Answer</summary>
**B)** `source_match` specifies which alerts (the "cause") trigger the inhibition.
</details>

---

### Question 31 (Observability)

What is the relationship between SLO tightness and engineering velocity?

- [ ] A) Tighter SLOs increase velocity
- [ ] B) Tighter SLOs reduce velocity (more caution needed)
- [ ] C) No relationship
- [ ] D) Looser SLOs always reduce velocity

<details>
<summary>Show Answer</summary>
**B)** Tighter (stricter) SLOs require more caution, potentially reducing deployment velocity.
</details>

---

### Question 32 (Prometheus Fundamentals)

What does the `--alertmanager.notification-queue-capacity` flag do?

- [ ] A) Limits the Alertmanager notification queue size
- [ ] B) Limits the Prometheus alert queue size
- [ ] C) Not a valid Prometheus flag
- [ ] D) Controls Alertmanager capacity

<details>
<summary>Show Answer</summary>
**B)** It limits the number of alerts that can be queued for sending to Alertmanager.
</details>

---

### Question 33 (PromQL)

What does `sum(rate(http_requests_total[5m])) by (job, instance)` return?

- [ ] A) Error — incorrect syntax
- [ ] B) Request rate aggregated by both job and instance
- [ ] C) Request rate per instance
- [ ] D) Total requests per job

<details>
<summary>Show Answer</summary>
**A)** Correct syntax: `sum by (job, instance) (rate(http_requests_total[5m]))`.
</details>

---

### Question 34 (Instrumentation & Exporters)

What does the `node_arp_entries` metric measure?

- [ ] A) ARP cache size on the system
- [ ] B) Number of ARP entries
- [ ] C) ARP request rate
- [ ] D) ARP table size

<details>
<summary>Show Answer</summary>
**B)** It shows the number of entries in the ARP cache.
</details>

---

### Question 35 (Alerting)

What is the purpose of the `wechat_configs` in Alertmanager?

- [ ] A) To send alerts via WeChat messaging platform
- [ ] B) To configure WeChat integration
- [ ] C) To receive WeChat messages
- [ ] D) To configure WeChat API

<details>
<summary>Show Answer</summary>
**A)** `wechat_configs` sends alert notifications through the WeChat messaging platform.
</details>

---

### Question 36 (Observability)

What is a "traffic" SLI for a billing service?

- [ ] A) Number of billing API calls per second
- [ ] B) Amount billed per day
- [ ] C) Number of customers
- [ ] D) Total transaction value

<details>
<summary>Show Answer</summary>
**A)** Traffic SLIs measure the request rate to the service's API.
</details>

---

### Question 37 (Prometheus Fundamentals)

What is the default value of `--query.max-concurrency` in Prometheus?

- [ ] A) 10
- [ ] B) 20
- [ ] C) 30
- [ ] D) No limit

<details>
<summary>Show Answer</summary>
**B)** The default max concurrency is 20.
</details>

---

### Question 38 (PromQL)

What does `avg_over_time(up[1h])` return for a target that was down for 30 minutes?

- [ ] A) 0.5 (average of 0s and 1s)
- [ ] B) 0 (because there were zeros)
- [ ] C) 1 (because up was sometimes 1)
- [ ] D) Nothing — up is not a counter

<details>
<summary>Show Answer</summary>
**A)** `avg_over_time()` averages the raw sample values over the range.
</details>

---

### Question 39 (Instrumentation & Exporters)

What is the purpose of the `go_info` metric from the Go client library?

- [ ] A) Go runtime information
- [ ] B) Build info including Go version
- [ ] C) Application info
- [ ] D) Version info

<details>
<summary>Show Answer</summary>
**B)** `go_info` provides Go version information (useful for inventory purposes).
</details>

---

### Question 40 (Alerting)

What is the purpose of the `opsgenie_configs` `api_key` field?

- [ ] A) OpsGenie API key for authentication
- [ ] B) OpsGenie team API key
- [ ] C) OpsGenie service key
- [ ] D) OpsGenie integration key

<details>
<summary>Show Answer</summary>
**A)** The `api_key` authenticates with the OpsGenie API.
</details>

---

### Question 41 (Observability)

What is a "dashboard as a service level agreement"?

- [ ] A) A dashboard that serves as the agreement
- [ ] B] A dashboard that visualizes SLO compliance
- [ ] C) A dashboard for service level agreements
- [ ] D) A dashboard for legal agreements

<details>
<summary>Show Answer</summary>
**B)** An SLO dashboard tracks compliance with defined service level objectives.
</details>

---

### Question 42 (Prometheus Fundamentals)

What does `--web.cors.origin` flag configure in Prometheus?

- [ ] A) CORS origin for web requests
- [ ] B) Web UI origin
- [ ] C) API origin
- [ ] D) Authentication origin

<details>
<summary>Show Answer</summary>
**A)** It sets the CORS (Cross-Origin Resource Sharing) origin policy for the HTTP API.
</details>

---

### Question 43 (PromQL)

What does `sort(sum by (instance) (rate(http_requests_total[5m])))` return?

- [ ] A) Sorted request rates ascending
- [ ] B) Sorted request rates descending
- [ ] C) Total sorted requests
- [ ] D) Alphabetically sorted instances

<details>
<summary>Show Answer</summary>
**A)** `sort()` returns results in ascending order by value.
</details>

---

### Question 44 (Instrumentation & Exporters)

What is the purpose of the `node_vmstat_oom_kill` metric?

- [ ] A) Number of OOM kills since boot
- [ ] B) Current OOM status
- [ ] C) OOM kill rate
- [ ] D) Memory pressure level

<details>
<summary>Show Answer</summary>
**A)** It counts the number of out-of-memory kills that have occurred.
</details>

---

### Question 45 (Alerting)

What is the purpose of the `pagerduty_configs` `routing_key` field?

- [ ] A) PagerDuty API routing key for event integration
- [ ] B) PagerDuty service routing
- [ ] C) PagerDuty team routing
- [ ] D) PagerDuty escalation routing

<details>
<summary>Show Answer</summary>
**A)** The `routing_key` identifies the PagerDuty integration for the service.
</details>

---

### Question 46 (Observability)

What is a common SLI for a key-value store like Redis?

- [ ] A) Query latency
- [ ] B) Number of keys
- [ ] C) Memory usage
- [ ] D) All of the above

<details>
<summary>Show Answer</summary>
**D)** Key-value stores commonly track latency, operations count, cache hit ratio, and memory usage.
</details>

---

### Question 47 (Prometheus Fundamentals)

What is the purpose of `--log.level=debug` in Prometheus configuration?

- [ ] A) Enable debug logging for troubleshooting
- [ ] B) Enable debug mode
- [ ] C) Enable debug API endpoints
- [ ] D) Enable debug scraping

<details>
<summary>Show Answer</summary>
**A)** Debug logging provides verbose output for diagnosing issues.
</details>

---

### Question 48 (PromQL)

What does `histogram_stddev(rate(http_duration_seconds_bucket[5m]))` estimate?

- [ ] A) The standard deviation of request durations from histogram data
- [ ] B) The standard deviation of rates
- [ ] C) The variance of request durations
- [ ] D) The mean request duration

<details>
<summary>Show Answer</summary>
**A)** `histogram_stddev()` estimates the standard deviation from histogram bucket data.
</details>

---

### Question 49 (Instrumentation & Exporters)

What is the purpose of the `--path.procfs` flag in Node Exporter?

- [ ] A) Path to the proc filesystem (default: /proc)
- [ ] B) Path to process files
- [ ] C) Path to configuration
- [ ] D) Path to logs

<details>
<summary>Show Answer</summary>
**A)** It specifies the path to the proc filesystem, useful for containerized environments.
</details>

---

### Question 50 (Alerting)

What is the purpose of the `telegram_configs` in Alertmanager?

- [ ] A) To send alerts via Telegram messaging
- [ ] B) To configure Telegram integration
- [ ] C) To receive Telegram messages
- [ ] D) To configure Telegram bot

<details>
<summary>Show Answer</summary>
**A)** Telegram integration sends alert notifications through the Telegram messaging platform.
</details>

---

### Question 51 (Observability)

What is the recommended error budget burn rate to trigger a rollback?

- [ ] A) Burn rate > 1
- [ ] B) Burn rate > 2 for a sustained period
- [ ] C) Burn rate > 6
- [ ] D) Any positive burn rate

<details>
<summary>Show Answer</summary>
**C)** High burn rates (e.g., > 6) indicate severe issues requiring immediate rollback.
</details>

---

### Question 52 (Prometheus Fundamentals)

What is the purpose of `--storage.tsdb.retention.no-compact` flag?

- [ ] A) Disable TSDB compaction
- [ ] B) Enable no-compaction mode
- [ ] C) Not a valid flag
- [ ] D) Optimizes for read-only scenarios

<details>
<summary>Show Answer</summary>
**D)** In no-compaction mode, Prometheus doesn't compact TSDB blocks, useful for read-only scenarios.
</details>

---

### Question 53 (PromQL)

What does `avg by (instance) (rate(node_cpu_seconds_total{mode!="idle"}[5m])) * 100` calculate?

- [ ] A) CPU usage percentage (non-idle time)
- [ ] B) Total non-idle CPU seconds
- [ ] C) Per-second non-idle CPU rate
- [ ] D) Average non-idle CPU

<details>
<summary>Show Answer</summary>
**A)** It calculates the average non-idle CPU rate per instance as a percentage.
</details>

---

### Question 54 (Instrumentation & Exporters)

What is the purpose of the `--path.sysfs` flag in Node Exporter?

- [ ] A) Path to sysfs filesystem (default: /sys)
- [ ] B) Path to system files
- [ ] C) Path to configuration
- [ ] D) Path to system stats

<details>
<summary>Show Answer</summary>
**A)** It specifies the path to the sysfs filesystem, used in containerized environments.
</details>

---

### Question 55 (Alerting)

What is the purpose of the `pushover_configs` `user_key` field?

- [ ] A) Pushover user key for sending push notifications
- [ ] B) Pushover API key
- [ ] C) Pushover device key
- [ ] D) Pushover group key

<details>
<summary>Show Answer</summary>
**A)** The `user_key` identifies the Pushover user or group receiving the notification.
</details>

---

### Question 56 (Observability)

What is a "synthetic" SLI?

- [ ] A) An SLI from synthetic transactions (simulated user actions)
- [ ] B) A fake SLI
- [ ] C) A calculated SLI
- [ ] D) An estimated SLI

<details>
<summary>Show Answer</summary>
**A)** Synthetic SLIs come from automated tests simulating real user behavior.
</details>

---

### Question 57 (Prometheus Fundamentals)

What does the `--web.enable-remote-write-receiver` flag do?

- [ ] A) Enables Prometheus to receive remote writes from other Prometheus servers
- [ ] B) Enables remote write to external storage
- [ ] C) Enables write API
- [ ] D) Enables write receiver

<details>
<summary>Show Answer</summary>
**A)** It allows Prometheus to accept remote_write requests (enables OTLP ingestion or multi-hop setups).
</details>

---

### Question 58 (PromQL)

What does `absent(up{job="critical"})` return when Prometheus has never scraped the job?

- [ ] A) 1
- [ ] B) Nothing (no data)
- [ ] C) 0
- [ ] D) Error

<details>
<summary>Show Answer</summary>
**A)** `absent()` returns 1 when the metric doesn't exist (never scraped or expired).
</details>

---

### Question 59 (Instrumentation & Exporters)

What is the purpose of the `--path.rootfs` flag in Node Exporter?

- [ ] A) Path to root filesystem for containerized deployments
- [ ] B) Path to root configuration
- [ ] C) Path to root directory
- [ ] D) Path to metrics root

<details>
<summary>Show Answer</summary>
**A)** It specifies the host root filesystem path, allowing Node Exporter to collect host metrics from Docker containers.
</details>

---

### Question 60 (Alerting)

What is the recommended approach for managing Alertmanager configuration?

- [ ] A) Manually through the UI
- [ ] B) Via configuration file in version control
- [ ] C) Through environment variables
- [ ] D) Via API calls

<details>
<summary>Show Answer</summary>
**B)** Manage Alertmanager configuration as code through version-controlled YAML files.
</details>

---

## Answer Key

| Q | Answer | Domain | Q | Answer | Domain |
|---|--------|--------|---|--------|--------|
| 1 | B | Observability | 31 | B | Observability |
| 2 | B | Fundamentals | 32 | B | Fundamentals |
| 3 | B | PromQL | 33 | A | PromQL |
| 4 | B | Instrumentation | 34 | B | Instrumentation |
| 5 | B | Alerting | 35 | A | Alerting |
| 6 | B | Observability | 36 | A | Observability |
| 7 | C | Fundamentals | 37 | B | Fundamentals |
| 8 | B | PromQL | 38 | A | PromQL |
| 9 | B | Instrumentation | 39 | B | Instrumentation |
| 10 | A | Alerting | 40 | A | Alerting |
| 11 | A | Observability | 41 | B | Observability |
| 12 | A | Fundamentals | 42 | A | Fundamentals |
| 13 | B | PromQL | 43 | A | PromQL |
| 14 | A | Instrumentation | 44 | A | Instrumentation |
| 15 | B | Alerting | 45 | A | Alerting |
| 16 | A | Observability | 46 | D | Observability |
| 17 | A | Fundamentals | 47 | A | Fundamentals |
| 18 | C | PromQL | 48 | A | PromQL |
| 19 | B | Instrumentation | 49 | A | Instrumentation |
| 20 | A | Alerting | 50 | A | Alerting |
| 21 | C | Observability | 51 | C | Observability |
| 22 | A | Fundamentals | 52 | D | Fundamentals |
| 23 | A | PromQL | 53 | A | PromQL |
| 24 | A | Instrumentation | 54 | A | Instrumentation |
| 25 | A | Alerting | 55 | A | Alerting |
| 26 | B | Observability | 56 | A | Observability |
| 27 | B | Fundamentals | 57 | A | Fundamentals |
| 28 | B | PromQL | 58 | A | PromQL |
| 29 | A | Instrumentation | 59 | A | Instrumentation |
| 30 | B | Alerting | 60 | B | Alerting |

## Score Calculation

| Score | Result |
|-------|--------|
| 42-60 (70-100%) | ✅ Pass |
| 30-41 (50-69%) | 🔄 Review weak domains |
| 0-29 (0-49%) | 📚 Study more before retaking |
