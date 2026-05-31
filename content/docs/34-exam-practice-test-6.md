---
title: "Practice Test 6"
weight: 34
bookToc: true
---

# Practice Test 6

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

What is the difference between a metric-based SLI and a log-based SLI?

- [ ] A) Metric SLIs are faster; log SLIs are more accurate
- [ ] B) Metric SLIs come from time-series data; log SLIs come from event data
- [ ] C) Metric SLIs are for infrastructure; log SLIs are for applications
- [ ] D) There is no difference

<details>
<summary>Show Answer</summary>
**B)** Metric SLIs use aggregated time-series data; log SLIs are calculated by counting events in logs.
</details>

---

### Question 2 (Prometheus Fundamentals)

What is the Prometheus data model fundamentally based on?

- [ ] A) Relational model
- [ ] B) Key-value pairs with metric names and labels
- [ ] C) Document model
- [ ] D) Graph model

<details>
<summary>Show Answer</summary>
**B)** Prometheus uses a metric name + label key-value pairs to identify time series.
</details>

---

### Question 3 (PromQL)

What happens when a PromQL query includes a time range beyond the available data?

- [ ] A) Prometheus fills with zeros
- [ ] B) The query returns only data within the available range
- [ ] C) An error is returned
- [ ] D) Prometheus extrapolates the data

<details>
<summary>Show Answer</summary>
**B)** Prometheus returns results only for timestamps where data exists within the retention period.
</details>

---

### Question 4 (Instrumentation & Exporters)

What is the purpose of the `go_gc_duration_seconds` metric?

- [ ] A) Total garbage collection time
- [ ] B) GC pause duration in seconds (summary/histogram)
- [ ] C) Number of GC cycles
- [ ] D) Memory reclaimed by GC

<details>
<summary>Show Answer</summary>
**B)** `go_gc_duration_seconds` is a summary of GC pause durations.
</details>

---

### Question 5 (Alerting)

What is the purpose of alerting rules in Prometheus?

- [ ] A) To send notifications
- [ ] B) To define conditions that generate alerts for Alertmanager
- [ ] C) To manage alerts
- [ ] D) To configure notification channels

<details>
<summary>Show Answer</summary>
**B)** Alerting rules define PromQL conditions that, when true, generate alerts sent to Alertmanager.
</details>

---

### Question 6 (Observability)

What is a "service" in the context of SRE?

- [ ] A) A microservice
- [ ] B) A component that provides functionality to users
- [ ] C) An API endpoint
- [ ] D) A server instance

<details>
<summary>Show Answer</summary>
**B)** A service is any component that provides a defined capability to its users.
</details>

---

### Question 7 (Prometheus Fundamentals)

What is the purpose of the `--log.format` flag?

- [ ] A) To set the log file format
- [ ] B) To set the log output format (logfmt, json)
- [ ] C) To configure log rotation
- [ ] D) To set the timestamp format

<details>
<summary>Show Answer</summary>
**B)** `--log.format` sets the structured logging format (default: logfmt).
</details>

---

### Question 8 (PromQL)

What does `irate(node_cpu_seconds_total[5m])` return when the scrape interval is 15s?

- [ ] A) Rate based on last 2 data points (~30s range)
- [ ] B) Average rate over 5 minutes
- [ ] C) Rate based on last 5 data points
- [ ] D) Total increase over 5 minutes

<details>
<summary>Show Answer</summary>
**A)** `irate()` uses the last 2 samples in the range, so ~30s for a 15s scrape interval.
</details>

---

### Question 9 (Instrumentation & Exporters)

What does the `node_processes_running` metric represent?

- [ ] A) Number of running threads
- [ ] B) Number of currently running processes
- [ ] C) Total processes since boot
- [ ] D) Number of zombies

<details>
<summary>Show Answer</summary>
**B)** `node_processes_running` shows the current number of running processes.
</details>

---

### Question 10 (Alerting)

What is the purpose of the `slack_configs` `channel` field?

- [ ] A) To set the Slack channel name where notifications are sent
- [ ] B) To set the Slack API channel
- [ ] C) To configure the Slack webhook
- [ ] D) To set the notification type

<details>
<summary>Show Answer</summary>
**A)** The `channel` field specifies which Slack channel receives the alert notification.
</details>

---

### Question 11 (Observability)

What is a GOOD approach to setting SLO targets?

- [ ] A) Set 100% targets for everything
- [ ] B) Start with user expectations and work backward
- [ ] C) Set targets based on competitors
- [ ] D) Use industry standards

<details>
<summary>Show Answer</summary>
**B)** Start from user expectations and define SLOs that meet their needs.
</details>

---

### Question 12 (Prometheus Fundamentals)

What is the purpose of TSDB compaction in Prometheus?

- [ ] A) To compress data to reduce storage
- [ ] B) To merge blocks and perform data deduplication
- [ ] C) To delete old data
- [ ] D) To reorganize WAL files

<details>
<summary>Show Answer</summary>
**B)** Compaction merges smaller TSDB blocks into larger ones and deduplicates samples.
</details>

---

### Question 13 (PromQL)

What does `rate(node_cpu_seconds_total{mode="user"}[5m]) * 100` calculate?

- [ ] A) CPU user percentage
- [ ] B) Per-second user CPU rate as percentage
- [ ] C) Total user CPU seconds
- [ ] D) User CPU as a ratio

<details>
<summary>Show Answer</summary>
**A)** When multiplied by 100, `rate()` gives a percentage (not true percentage — use `avg by (instance)(rate()[5m]))` for proper CPU%).
</details>

---

### Question 14 (Instrumentation & Exporters)

What is the purpose of the `--collector.disable-defaults` flag?

- [ ] A) To disable default metrics and enable only specific collectors
- [ ] B) To disable all metrics
- [ ] C) To disable the default port
- [ ] D) To disable the default configuration

<details>
<summary>Show Answer</summary>
**A)** It starts Node Exporter with no collectors, allowing selective enabling.
</details>

---

### Question 15 (Alerting)

What is the purpose of the `email_configs` `require_tls` field?

- [ ] A) To require TLS encryption for SMTP connection
- [ ] B) To require TLS for web access
- [ ] C) To require TLS for scraping
- [ ] D) To require TLS for remote write

<details>
<summary>Show Answer</summary>
**A)** `require_tls: true` forces the SMTP connection to use TLS encryption.
</details>

---

### Question 16 (Observability)

What is a common SLI for throughput?

- [ ] A) Response time
- [ ] B) Requests per second
- [ ] C) Error count
- [ ] D) CPU usage

<details>
<summary>Show Answer</summary>
**B)** Throughput SLIs measure how much work the system is doing (e.g., requests/second).
</details>

---

### Question 17 (Prometheus Fundamentals)

What does the `__metrics_path__` label default to in Prometheus scraping?

- [ ] A) `/metrics`
- [ ] B) `metrics`
- [ ] C) `/probe`
- [ ] D) `/health`

<details>
<summary>Show Answer</summary>
**A)** `__metrics_path__` defaults to `/metrics`.
</details>

---

### Question 18 (PromQL)

What does `avg_over_time(rate(http_requests_total[5m])[1h:5m])` compute?

- [ ] A) Average request rate over the last hour
- [ ] B) Max request rate over the last hour
- [ ] C) Average of per-second rates sampled every 5 minutes for 1 hour
- [ ] D) Total requests in the last hour

<details>
<summary>Show Answer</summary>
**C)** The subquery samples `rate()[5m]` every 5 minutes for 1 hour, then averages the samples.
</details>

---

### Question 19 (Instrumentation & Exporters)

What does the `node_disk_io_time_seconds_total` metric represent?

- [ ] A) Total disk I/O time in seconds since boot
- [ ] B) Current disk I/O speed
- [ ] C) Number of I/O operations
- [ ] D) Average I/O latency

<details>
<summary>Show Answer</summary>
**A)** It's a counter of total time spent doing disk I/O operations since boot.
</details>

---

### Question 20 (Alerting)

What is the difference between `silence` and `inhibit` in Alertmanager?

- [ ] A) Same thing
- [ ] B) Silence is manual and expires; inhibition is automatic based on rules
- [ ] C) Silence is automatic; inhibition is manual
- [ ] D) Silence works on metrics; inhibition works on alerts

<details>
<summary>Show Answer</summary>
**B)** Silences are manually created with expiration; inhibition rules are automatic and always active.
</details>

---

### Question 21 (Observability)

What is a key metric for monitoring message queue systems?

- [ ] A) Queue depth (number of pending messages)
- [ ] B) Message content
- [ ] C) Consumer names
- [ ] D) Message size

<details>
<summary>Show Answer</summary>
**A)** Queue depth indicates how many messages are waiting to be processed.
</details>

---

### Question 22 (Prometheus Fundamentals)

What is the effect of the `--storage.tsdb.retention.size=10GB` flag?

- [ ] A) Keep at most 10GB of TSDB data
- [ ] B) Keep all data smaller than 10GB
- [ ] C) Keep at least 10GB of data
- [ ] D) Allocate 10GB for TSDB

<details>
<summary>Show Answer</summary>
**A)** Oldest data is deleted when TSDB size exceeds 10GB.
</details>

---

### Question 23 (PromQL)

What does `days_in_month()` return in PromQL?

- [ ] A) Number of days in current month (28-31)
- [ ] B) Number of days in current year
- [ ] C) Current day of the month
- [ ] D) Days remaining in month

<details>
<summary>Show Answer</summary>
**A)** `days_in_month()` returns the number of days in the current month.
</details>

---

### Question 24 (Instrumentation & Exporters)

What is the primary use case for the `--no-collector.*` flags in Node Exporter?

- [ ] A) To disable specific collectors that are not needed
- [ ] B) To add new collectors
- [ ] C) To configure collector parameters
- [ ] D) To list all collectors

<details>
<summary>Show Answer</summary>
**A)** `--no-collector.<name>` disables specific collectors to reduce resource usage.
</details>

---

### Question 25 (Alerting)

What is the purpose of the `alert_relabel_configs` `replacement` field?

- [ ] A) The label to modify
- [ ] B) The replacement value for matched groups
- [ ] C) The metric to replace
- [ ] D) The target to replace

<details>
<summary>Show Answer</summary>
**B)** `replacement` defines the replacement value using captured groups from the regex.
</details>

---

### Question 26 (Observability)

What is a common SLI for a data pipeline service?

- [ ] A) Processing latency per record
- [ ] B) Number of data sources
- [ ] C) Storage capacity
- [ ] D) Network bandwidth

<details>
<summary>Show Answer</summary>
**A)** Processing latency per record is a key performance SLI for data pipelines.
</details>

---

### Question 27 (Prometheus Fundamentals)

What does the `labelmap` action do during relabeling?

- [ ] A) Creates new labels from the metric value
- [ ] B) Creates new labels from existing label names using regex
- [ ] C) Maps label values to new names
- [ ] D) Maps metric names to labels

<details>
<summary>Show Answer</summary>
**B)** `labelmap` matches regex against existing label names and creates new labels from matches.
</details>

---

### Question 28 (PromQL)

What does `rate(http_requests_total[5m]) > bool 0.5` return?

- [ ] A) Only request rates above 0.5
- [ ] B) 1 for rates above 0.5, 0 for others (no filtering)
- [ ] C) Boolean vector of request rates
- [ ] D) Filtered list of rates

<details>
<summary>Show Answer</summary>
**B)** `bool` returns 1 (true) or 0 (false) without filtering results.
</details>

---

### Question 29 (Instrumentation & Exporters)

What does the `jvm_memory_bytes_used` metric measure?

- [ ] A) JVM heap memory usage
- [ ] B) JVM memory usage split by area (heap, non-heap)
- [ ] C) Total system memory
- [ ] D) Garbage collector memory

<details>
<summary>Show Answer</summary>
**B)** It measures JVM memory used, with labels for `heap` and `nonheap` areas.
</details>

---

### Question 30 (Alerting)

What is the purpose of the `http_config` `basic_auth` in Alertmanager?

- [ ] A) To authenticate users to Alertmanager UI
- [ ] B) To authenticate outgoing webhook requests
- [ ] C) To authenticate Alertmanager to Prometheus
- [ ] D) To authenticate scrape requests

<details>
<summary>Show Answer</summary>
**B)** `basic_auth` in `http_config` sets credentials for outgoing webhook notification requests.
</details>

---

### Question 31 (Observability)

What is "white-box monitoring" best at?

- [ ] A) Detecting external issues
- [ ] B) Understanding internal system details and root causes
- [ ] C) Measuring user experience
- [ ] D) Testing endpoints

<details>
<summary>Show Answer</summary>
**B)** White-box monitoring provides insight into internal system state and health.
</details>

---

### Question 32 (Prometheus Fundamentals)

What is the difference between `__meta_` and `__` prefixed labels?

- [ ] A) `__meta_` comes from SD; `__` are internal Prometheus labels
- [ ] B) They are the same
- [ ] C) `__meta_` is for alerts; `__` is for targets
- [ ] D) `__meta_` is deprecated

<details>
<summary>Show Answer</summary>
**A)** `__meta_*` labels from service discovery; `__*` labels (like `__address__`) are internal.
</details>

---

### Question 33 (PromQL)

What does `sum(rate(http_requests_total[5m])) by (status)` do?

- [ ] A) Error — incorrect syntax
- [ ] B) Sum total requests per status
- [ ] C) Aggregate request rate by status
- [ ] D) Count requests by status

<details>
<summary>Show Answer</summary>
**A)** Correct syntax is `sum by (status) (rate(...))`. The `by` clause comes before the expression.
</details>

---

### Question 34 (Instrumentation & Exporters)

What does the `pg_stat_database_numbackends` metric from Postgres Exporter show?

- [ ] A) Number of background workers
- [ ] B) Number of active connections to the database
- [ ] C) Number of databases
- [ ] D) Number of running queries

<details>
<summary>Show Answer</summary>
**B)** It shows the current number of backends (connections) to the database.
</details>

---

### Question 35 (Alerting)

What is the purpose of the `webhook_configs` `send_resolved` field?

- [ ] A) To mark alerts as resolved
- [ ] B) To send a notification when the alert resolves
- [ ] C) To resolve webhook errors
- [ ] D) To send notification only on resolution

<details>
<summary>Show Answer</summary>
**B)** `send_resolved: true` sends a webhook notification when the alert state changes to resolved.
</details>

---

### Question 36 (Observability)

What is an appropriate error budget policy for a service with 99.9% SLO?

- [ ] A) Stop deploying when 100% of budget is consumed
- [ ] B) Stop deploying when 50% of budget is consumed
- [ ] C) Stop deploying when budget consumed in a specific time window (e.g., 30d)
- [ ] D) Never stop deploying

<details>
<summary>Show Answer</summary>
**C)** Common policy: stop feature deployments if remaining budget projects exhaustion within the window.
</details>

---

### Question 37 (Prometheus Fundamentals)

What is the default value of `--storage.tsdb.min-block-duration`?

- [ ] A) 1h
- [ ] B) 2h
- [ ] C) 12h
- [ ] D) 24h

<details>
<summary>Show Answer</summary>
**B)** The default minimum block duration is 2 hours.
</details>

---

### Question 38 (PromQL)

What does `label_replace(up, "ip", "$1", "instance", "(.+):\\d+")` do?

- [ ] A) Extracts the IP/host from instance label
- [ ] B) Replaces the instance label
- [ ] C) Removes the IP from instance
- [ ] D) Creates a new label with port number

<details>
<summary>Show Answer</summary>
**A)** It creates an `ip` label with the hostname/IP part of the `instance` label.
</details>

---

### Question 39 (Instrumentation & Exporters)

What is the purpose of the `--web.listen-address` flag in Prometheus components?

- [ ] A) To set the listening address (IP:port) for HTTP endpoints
- [ ] B) To configure the scrape target address
- [ ] C) To set the metrics push address
- [ ] D) To set the alert forwarding address

<details>
<summary>Show Answer</summary>
**A)** It sets the IP address and port for the HTTP server to listen on.
</details>

---

### Question 40 (Alerting)

What is the purpose of the `PagerDuty` `client` field?

- [ ] A) To set the client URL
- [ ] B) To display in the PagerDuty notification as the source
- [ ] C) To configure PagerDuty API endpoint
- [ ] D) To set the PagerDuty routing key

<details>
<summary>Show Answer</summary>
**B)** The `client` field provides a human-readable source name in PagerDuty notifications.
</details>

---

### Question 41 (Observability)

What is a key characteristic of a good dashboard?

- [ ] A) Shows all available data
- [ ] B) Provides clear answers to specific operational questions
- [ ] C) Has many panels
- [ ] D) Uses multiple colors

<details>
<summary>Show Answer</summary>
**B)** Good dashboards answer clear, predefined questions about system health.
</details>

---

### Question 42 (Prometheus Fundamentals)

What does the `--web.external-url` flag configure?

- [ ] A) The internal address for scraping
- [ ] B) The external URL under which Prometheus is reachable (for reverse proxy)
- [ ] C) The remote storage URL
- [ ] D) The alertmanager URL

<details>
<summary>Show Answer</summary>
**B)** It sets the external URL for correct link generation behind a reverse proxy.
</details>

---

### Question 43 (PromQL)

What does `absent_over_time(up{job="api"}[5m])` return?

- [ ] A) 1 if the metric has no data in the last 5 minutes
- [ ] B) The last seen value
- [ ] C) The average value
- [ ] D) 0 if data exists

<details>
<summary>Show Answer</summary>
**A)** `absent_over_time()` returns 1 if there were no samples in the specified time range.
</details>

---

### Question 44 (Instrumentation & Exporters)

What does the `node_network_receive_errors_total` metric measure?

- [ ] A) Network error rate
- [ ] B) Total network errors since boot
- [ ] C) Current network errors
- [ ] D) Dropped packets

<details>
<summary>Show Answer</summary>
**B)** It's a counter of total network receive errors since system boot.
</details>

---

### Question 45 (Alerting)

What is the purpose of the `email_configs` `smarthost` field?

- [ ] A) The SMTP server address for sending emails
- [ ] B) The smart hostname
- [ ] C) The email server type
- [ ] D) The SMTP port

<details>
<summary>Show Answer</summary>
**A)** `smarthost` specifies the SMTP server `host:port` for email delivery.
</details>

---

### Question 46 (Observability)

What is a common approach to setting SLIs for infrastructure components?

- [ ] A) Use the USE method (Utilization, Saturation, Errors)
- [ ] B) Use the RED method (Rate, Errors, Duration)
- [ ] C) Use the four golden signals
- [ ] D) All of the above

<details>
<summary>Show Answer</summary>
**D)** Different methodologies apply to different contexts: USE for resources, RED for services, four golden signals for distributed systems.
</details>

---

### Question 47 (Prometheus Fundamentals)

What is the effect of `--storage.tsdb.retention.time=0` flag?

- [ ] A) No retention limit (keep forever)
- [ ] B) Unlimited retention time
- [ ] C) Delete all data immediately
- [ ] D) Disable time-based retention

<details>
<summary>Show Answer</summary>
**C)** Setting retention to 0 deletes all data immediately (not recommended in production).
</details>

---

### Question 48 (PromQL)

What does `clamp_min(node_load1, 0.5)` do?

- [ ] A) Clamps load values to a minimum of 0.5
- [ ] B) Clamps load values above 0.5
- [ ] C) Returns 0.5 for values below 0.5
- [ ] D) Sets minimum threshold

<details>
<summary>Show Answer</summary>
**A)** `clamp_min()` ensures no value is below 0.5 (replaces values < 0.5 with 0.5).
</details>

---

### Question 49 (Instrumentation & Exporters)

What is the recommended way to expose Prometheus metrics from a Java application?

- [ ] A) Use the Prometheus Java Simpleclient
- [ ] B) Use JMX Exporter as a Java agent
- [ ] C) Use Micrometer (if already using Spring Boot)
- [ ] D) All of the above are valid

<details>
<summary>Show Answer</summary>
**D)** Java applications can use Simpleclient directly, JMX agent, or Micrometer integration.
</details>

---

### Question 50 (Alerting)

What is the purpose of the `OpsGenie` `teams` field in alertmanager config?

- [ ] A) To specify OpsGenie teams responsible for the alert
- [ ] B) To configure OpsGenie team integrations
- [ ] C) To set team name
- [ ] D) To configure API teams

<details>
<summary>Show Answer</summary>
**A)** The `teams` field designates which OpsGenie teams receive the alert notification.
</details>

---

### Question 51 (Observability)

What is a "tolerance" in SLO context?

- [ ] A) Maximum acceptable error budget consumption
- [ ] B) The allowed deviation from target
- [ ] C) The minimum performance level
- [ ] D) The maximum request rate

<details>
<summary>Show Answer</summary>
**A)** Tolerance defines how much of the error budget can be consumed before action is required.
</details>

---

### Question 52 (Prometheus Fundamentals)

What does the `--storage.tsdb.wal-compression` flag enable?

- [ ] A) Compress the WAL to save disk space
- [ ] B) Compress TSDB blocks
- [ ] C) Enable WAL compression for faster writes
- [ ] D) Disable WAL compression

<details>
<summary>Show Answer</summary>
**A)** Enabling WAL compression reduces disk usage for the write-ahead log.
</details>

---

### Question 53 (PromQL)

What does `(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes` calculate?

- [ ] A) Available memory ratio
- [ ] B) Memory usage ratio (0.0-1.0)
- [ ] C) Free memory ratio
- [ ] D) Buffer cache ratio

<details>
<summary>Show Answer</summary>
**B)** It calculates the fraction of total memory currently in use.
</details>

---

### Question 54 (Instrumentation & Exporters)

What is the purpose of the `--collector.perf.cpus` flag in Node Exporter?

- [ ] A) To specify which CPUs to collect perf metrics for
- [ ] B) To set CPU performance level
- [ ] C) To configure CPU sampling rate
- [ ] D) To enable CPU profiling

<details>
<summary>Show Answer</summary>
**A)** It limits perf metrics collection to specified CPUs to reduce overhead.
</details>

---

### Question 55 (Alerting)

What is the purpose of the `email_configs` `html` field?

- [ ] A) To set the email body as HTML
- [ ] B) To define a Go template for HTML-formatted email body
- [ ] C) To set the email headers
- [ ] D) To configure email attachments

<details>
<summary>Show Answer</summary>
**B)** The `html` field contains a Go template that generates the HTML email body.
</details>

---

### Question 56 (Observability)

What is the key to effective alerting?

- [ ] A) Alert on everything
- [ ] B) Alert on actionable conditions that require a human response
- [ ] C) Alert only on production issues
- [ ] D) Alert on all errors

<details>
<summary>Show Answer</summary>
**B)** Alerts should fire only when human intervention is needed.
</details>

---

### Question 57 (Prometheus Fundamentals)

What does `--storage.tsdb.retention.size=0` do?

- [ ] A) Disables size-based retention
- [ ] B) Removes all data
- [ ] C) Sets unlimited size
- [ ] D) Default retention

<details>
<summary>Show Answer</summary>
**A)** `0` means no size-based retention limit (only time-based retention applies).
</details>

---

### Question 58 (PromQL)

What does `bottomk(5, rate(http_requests_total[5m]))` return?

- [ ] A) Bottom 5 request rates
- [ ] B) 5 time series with the lowest request rates
- [ ] C) Bottom 5 percent of requests
- [ ] D) Lowest 5 requests

<details>
<summary>Show Answer</summary>
**B)** `bottomk(5, ...)` returns the 5 time series with the lowest values.
</details>

---

### Question 59 (Instrumentation & Exporters)

What is the purpose of the `--collector.ntp.server` flag in Node Exporter?

- [ ] A) To specify NTP server for time checks
- [ ] B) To configure NTP sync
- [ ] C) To set the Node Exporter's NTP server
- [ ] D) To disable NTP monitoring

<details>
<summary>Show Answer</summary>
**A)** It sets the NTP server address that the NTP collector queries for offset measurement.
</details>

---

### Question 60 (Alerting)

What is the purpose of the `slack_configs` `color` field?

- [ ] A) To set the attachment color based on severity
- [ ] B) To set the Slack theme
- [ ] C) To configure notification colors
- [ ] D) To set the channel color

<details>
<summary>Show Answer</summary>
**A)** The `color` field sets the Slack message attachment color (e.g., "danger" for critical, "warning" for warning).
</details>

---

## Answer Key

| Q | Answer | Domain | Q | Answer | Domain |
|---|--------|--------|---|--------|--------|
| 1 | B | Observability | 31 | B | Observability |
| 2 | B | Fundamentals | 32 | A | Fundamentals |
| 3 | B | PromQL | 33 | A | PromQL |
| 4 | B | Instrumentation | 34 | B | Instrumentation |
| 5 | B | Alerting | 35 | B | Alerting |
| 6 | B | Observability | 36 | C | Observability |
| 7 | B | Fundamentals | 37 | B | Fundamentals |
| 8 | A | PromQL | 38 | A | PromQL |
| 9 | B | Instrumentation | 39 | A | Instrumentation |
| 10 | A | Alerting | 40 | B | Alerting |
| 11 | B | Observability | 41 | B | Observability |
| 12 | B | Fundamentals | 42 | B | Fundamentals |
| 13 | A | PromQL | 43 | A | PromQL |
| 14 | A | Instrumentation | 44 | B | Instrumentation |
| 15 | A | Alerting | 45 | A | Alerting |
| 16 | B | Observability | 46 | D | Observability |
| 17 | A | Fundamentals | 47 | C | Fundamentals |
| 18 | C | PromQL | 48 | A | PromQL |
| 19 | A | Instrumentation | 49 | D | Instrumentation |
| 20 | B | Alerting | 50 | A | Alerting |
| 21 | A | Observability | 51 | A | Observability |
| 22 | A | Fundamentals | 52 | A | Fundamentals |
| 23 | A | PromQL | 53 | B | PromQL |
| 24 | A | Instrumentation | 54 | A | Instrumentation |
| 25 | B | Alerting | 55 | B | Alerting |
| 26 | A | Observability | 56 | B | Observability |
| 27 | B | Fundamentals | 57 | A | Fundamentals |
| 28 | B | PromQL | 58 | B | PromQL |
| 29 | B | Instrumentation | 59 | A | Instrumentation |
| 30 | B | Alerting | 60 | A | Alerting |

## Score Calculation

| Score | Result |
|-------|--------|
| 42-60 (70-100%) | ✅ Pass |
| 30-41 (50-69%) | 🔄 Review weak domains |
| 0-29 (0-49%) | 📚 Study more before retaking |
