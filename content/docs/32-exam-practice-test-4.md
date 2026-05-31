---
title: "Practice Test 4"
weight: 32
bookToc: true
---

# Practice Test 4

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

What is the Google SRE approach to SLIs and SLOs?

- [ ] A) Define SLIs first, then set SLO targets based on observed performance
- [ ] B) Define SLOs first, then work backward to identify SLIs
- [ ] C) Define both simultaneously
- [ ] D) Implement monitoring first, then define SLIs

<details>
<summary>Show Answer</summary>
**B)** Google recommends defining target SLOs first based on user expectations, then identifying the SLIs that measure them.
</details>

---

### Question 2 (Prometheus Fundamentals)

What is the role of the TSDB in Prometheus?

- [ ] A) To execute PromQL queries
- [ ] B) To store and retrieve time-series data efficiently
- [ ] C) To manage scrape targets
- [ ] D) To send alerts

<details>
<summary>Show Answer</summary>
**B)** The TSDB stores scraped metrics and serves data to the PromQL engine for queries.
</details>

---

### Question 3 (PromQL)

What does `histogram_quantile(0.50, rate(http_duration_seconds_bucket[5m]))` estimate?

- [ ] A) The 50th percentile (median) of request duration
- [ ] B) The 50th request duration
- [ ] C) The average request duration
- [ ] D) The minimum request duration

<details>
<summary>Show Answer</summary>
**A)** It estimates the median (50th percentile) request duration from the histogram.
</details>

---

### Question 4 (Instrumentation & Exporters)

What is the purpose of the `probe_ssl_earliest_cert_expiry` metric?

- [ ] A) To check if SSL is enabled
- [ ] B) To show the earliest SSL certificate expiry timestamp
- [ ] C) To measure SSL handshake time
- [ ] D) To count SSL certificates

<details>
<summary>Show Answer</summary>
**B)** It shows the Unix timestamp of the earliest SSL certificate expiry for the probed endpoint.
</details>

---

### Question 5 (Alerting)

What does `alertmanager_notifications_failed_total` indicate?

- [ ] A) Total notifications sent successfully
- [ ] B) Total failed notification delivery attempts
- [ ] C) Total alerts fired
- [ ] D) Total configured receivers

<details>
<summary>Show Answer</summary>
**B)** It counts the number of notification delivery failures.
</details>

---

### Question 6 (Observability)

What is a key characteristic of good SLIs?

- [ ] A) They should be complex and detailed
- [ ] B) They should be measurable and meaningful to users
- [ ] C) They should only focus on infrastructure
- [ ] D) They should change frequently

<details>
<summary>Show Answer</summary>
**B)** Good SLIs are measurable, user-meaningful, and stable over time.
</details>

---

### Question 7 (Prometheus Fundamentals)

What is the purpose of the `retention.size` configuration in Prometheus?

- [ ] A) To set the maximum number of metrics stored
- [ ] B) To limit TSDB storage to a specified byte size
- [ ] C) To set the time-based retention period
- [ ] D) To limit the total number of time series

<details>
<summary>Show Answer</summary>
**B)** `retention.size` sets a maximum storage size for the TSDB; oldest data is deleted first.
</details>

---

### Question 8 (PromQL)

Which function returns the number of counter resets in a time range?

- [ ] A) `resets()`
- [ ] B) `changes()`
- [ ] C) `delta()`
- [ ] D) `increase()`

<details>
<summary>Show Answer</summary>
**A)** `resets()` returns the number of counter resets over a time range.
</details>

---

### Question 9 (Instrumentation & Exporters)

What does the Node Exporter's `node_load1` metric measure?

- [ ] A) CPU usage percentage
- [ ] B) System load average over 1 minute
- [ ] C) Number of running processes
- [ ] D) Number of waiting processes

<details>
<summary>Show Answer</summary>
**B)** `node_load1` is the system load average over 1 minute.
</details>

---

### Question 10 (Alerting)

What is the difference between `pending` and `firing` alert states?

- [ ] A) Pending means the condition is false; firing means true
- [ ] B) Pending means condition is true but `for` not elapsed; firing means `for` was exceeded
- [ ] C) Pending means no data; firing means data exists
- [ ] D) They are the same

<details>
<summary>Show Answer</summary>
**B)** Pending = condition met, waiting for `for` duration. Firing = condition met for >= `for` duration.
</details>

---

### Question 11 (Observability)

What is the primary difference between latency and response time?

- [ ] A) Latency includes network time; response time is application time only
- [ ] B) They are synonymous
- [ ] C) Latency is the time a request spends waiting; response time includes processing
- [ ] D) Latency is measured in milliseconds; response time in seconds

<details>
<summary>Show Answer</summary>
**C)** Latency = wait time; response time = total time including processing.
</details>

---

### Question 12 (Prometheus Fundamentals)

What happens when you set `honor_timestamps: false` in scrape config?

- [ ] A) Timestamps from the target are ignored, and Prometheus assigns scrape time
- [ ] B) Timestamps from the target are honored
- [ ] C) No timestamps are collected
- [ ] D) Timestamps are stored in a separate field

<details>
<summary>Show Answer</summary>
**A)** When `honor_timestamps: false`, Prometheus ignores the target's timestamps and uses its own scrape time.
</details>

---

### Question 13 (PromQL)

What does the `changes()` function return?

- [ ] A) Number of label changes
- [ ] B) Number of times a gauge has changed value in a time range
- [ ] C) Number of metric name changes
- [ ] D) Number of configuration changes

<details>
<summary>Show Answer</summary>
**B)** `changes()` returns the number of times a gauge's value changed in the time range.
</details>

---

### Question 14 (Instrumentation & Exporters)

What does `process_open_fds` metric from Node Exporter indicate?

- [ ] A) Number of open file descriptors in the Node Exporter process
- [ ] B) Total number of open files on the system
- [ ] C) Number of directories being monitored
- [ ] D) Number of configuration files

<details>
<summary>Show Answer</summary>
**A)** `process_open_fds` shows the number of open file descriptors in the Node Exporter process.
</details>

---

### Question 15 (Alerting)

What is the purpose of the `webhook_configs` in Alertmanager?

- [ ] A) To configure the Alertmanager web interface
- [ ] B) To send alert notifications to custom HTTP endpoints
- [ ] C) To receive webhooks
- [ ] D) To configure webhook receivers for metric scraping

<details>
<summary>Show Answer</summary>
**B)** `webhook_configs` sends alert notifications to custom HTTP endpoints any format.
</details>

---

### Question 16 (Observability)

What does "traffic" refer to in the four golden signals?

- [ ] A) Network bandwidth usage
- [ ] B) Demand on the system measured in requests per second
- [ ] C) Number of concurrent users
- [ ] D) Data transfer volume

<details>
<summary>Show Answer</summary>
**B)** Traffic measures the demand on the system, typically in requests/second or transactions/second.
</details>

---

### Question 17 (Prometheus Fundamentals)

What is the purpose of the `write_relabel_configs` in remote_write?

- [ ] A) To relabel metrics before writing to remote storage
- [ ] B) To relabel targets before scraping
- [ ] C) To relabel alerts
- [ ] D) To configure metric retention

<details>
<summary>Show Answer</summary>
**A)** `write_relabel_configs` modifies or filters metrics before sending them to remote storage.
</details>

---

### Question 18 (PromQL)

What does `avg by (job) (rate(http_requests_total[5m]))` return?

- [ ] A) Average of HTTP request rates aggregated by job
- [ ] B) Total requests per job
- [ ] C) Per-second request rate per instance
- [ ] D) Average number of requests

<details>
<summary>Show Answer</summary>
**A)** It calculates the per-second request rate and averages across instances, grouped by job.
</details>

---

### Question 19 (Instrumentation & Exporters)

What is the purpose of the Windows Exporter?

- [ ] A) To monitor Windows applications
- [ ] B) To expose Windows system metrics to Prometheus
- [ ] C) To run Windows services
- [ ] D) To manage Windows updates

<details>
<summary>Show Answer</summary>
**B)** The Windows Exporter exposes Windows OS metrics (CPU, memory, disk, network) in Prometheus format.
</details>

---

### Question 20 (Alerting)

What does `amtool config show` display?

- [ ] A) Current Prometheus configuration
- [ ] B) Current Alertmanager configuration
- [ ] C) Active alerts
- [ ] D) Silence configuration

<details>
<summary>Show Answer</summary>
**B)** `amtool config show` displays the currently loaded Alertmanager configuration.
</details>

---

### Question 21 (Observability)

What defines a service level (the "S" in SLI)?

- [ ] A) Any component that provides a capability to a user
- [ ] B) A microservice
- [ ] C) An API endpoint
- [ ] D) A server

<details>
<summary>Show Answer</summary>
**A)** A "service" is any component providing a defined capability to its users (internal or external).
</details>

---

### Question 22 (Prometheus Fundamentals)

What does the `hashmod` relabeling action do?

- [ ] A) Hashes target labels and distributes targets mod N
- [ ] B) Modifies metric names
- [ ] C) Hashes metric values
- [ ] D) Creates hash-based labels

<details>
<summary>Show Answer</summary>
**A)** `hashmod` hashes a source label and takes modulo N, useful for distributing across shards.
</details>

---

### Question 23 (PromQL)

What is the result of `sum(http_requests_total) without (instance)`?

- [ ] A) Sum all HTTP requests, remove the instance label
- [ ] B) Sum all HTTP requests, keep all labels except instance
- [ ] C) Sum all HTTP requests, keep only instance
- [ ] D) Error — invalid syntax

<details>
<summary>Show Answer</summary>
**B)** `without (instance)` removes only the `instance` label, keeping all others, and sums by the remaining labels.
</details>

---

### Question 24 (Instrumentation & Exporters)

What does the `node_disk_read_bytes_total` metric represent?

- [ ] A) Current disk read speed
- [ ] B) Total bytes read from disk since boot
- [ ] C) Number of disk read operations
- [ ] D) Average disk read size

<details>
<summary>Show Answer</summary>
**B)** It's a counter of total bytes read from disk since system boot.
</details>

---

### Question 25 (Alerting)

What is the purpose of the `alertmanager_http_request_duration_seconds` metric?

- [ ] A) To measure Prometheus request duration
- [ ] B) To measure Alertmanager API request duration
- [ ] C) To measure scrape duration
- [ ] D) To measure probe duration

<details>
<summary>Show Answer</summary>
**B)** It measures the HTTP request duration for the Alertmanager API.
</details>

---

### Question 26 (Observability)

What is the recommended number of SLOs for a service according to Google SRE?

- [ ] A) As many as possible
- [ ] B) 1-3 per service
- [ ] C) At least 10
- [ ] D) One per team member

<details>
<summary>Show Answer</summary>
**B)** Google recommends 1-3 SLOs per service to focus on what matters most.
</details>

---

### Question 27 (Prometheus Fundamentals)

What is the purpose of `scrape_config_files` in Prometheus configuration?

- [ ] A) To include external scrape configuration files
- [ ] B) To log scrape results to files
- [ ] C) To save scrape configuration to files
- [ ] D) To archive old scrape configurations

<details>
<summary>Show Answer</summary>
**A)** `scrape_config_files` allows including scrape configuration from separate files.
</details>

---

### Question 28 (PromQL)

What does `max_over_time(up[5m])` return?

- [ ] A) 1 if the target was up at any point in the last 5 minutes
- [ ] B) Average of up values over 5 minutes
- [ ] C) Minimum up value over 5 minutes
- [ ] D) Total time up over 5 minutes

<details>
<summary>Show Answer</summary>
**A)** `max_over_time(up[5m])` returns 1 if up was 1 at any time in the range.
</details>

---

### Question 29 (Instrumentation & Exporters)

What does the `node_memory_MemAvailable_bytes` metric represent?

- [ ] A) Total memory installed
- [ ] B) Memory available for starting new applications
- [ ] C) Free memory only
- [ ] D) Memory used by applications

<details>
<summary>Show Answer</summary>
**B)** `MemAvailable` estimates how much memory is available for starting new applications (includes reclaimable cache).
</details>

---

### Question 30 (Alerting)

What is the purpose of the `OpsGenie` integration in Alertmanager?

- [ ] A) To send alerts to OpsGenie incident management platform
- [ ] B) To configure alert rules
- [ ] C) To monitor OpsGenie
- [ ] D) To visualize alerts

<details>
<summary>Show Answer</summary>
**A)** OpsGenie integration forwards alerts to the OpsGenie incident management platform.
</details>

---

### Question 31 (Observability)

What does "latency" in the four golden signals measure?

- [ ] A) Network round-trip time
- [ ] B) The time taken to serve a request
- [ ] C) Database query time
- [ ] D) Application startup time

<details>
<summary>Show Answer</summary>
**B)** Latency measures the time taken to serve a request (including processing time).
</details>

---

### Question 32 (Prometheus Fundamentals)

What does the `--storage.tsdb.retention.time` flag control?

- [ ] A) How long Prometheus stores data
- [ ] B) How much storage space is used
- [ ] C) How long scraped data is cached
- [ ] D) How often TSDB compaction runs

<details>
<summary>Show Answer</summary>
**A)** `--storage.tsdb.retention.time` sets the maximum time to retain data (default: 15d).
</details>

---

### Question 33 (PromQL)

What does `predict_linear(node_filesystem_free_bytes[1h], 86400)` predict?

- [ ] A) Disk usage after 1 hour
- [ ] B) Free bytes after 24 hours from now
- [ ] C) Free bytes after 86400 seconds (1 day)
- [ ] D) Disk write rate

<details>
<summary>Show Answer</summary>
**C)** It predicts the free bytes value 86400 seconds (1 day) into the future.
</details>

---

### Question 34 (Instrumentation & Exporters)

What is the correct way to instrument a Go application for Prometheus?

- [ ] A) Use `prometheus/client_golang` and expose `/metrics`
- [ ] B) Use Pushgateway
- [ ] C) Use Node Exporter
- [ ] D) Use the Go standard library

<details>
<summary>Show Answer</summary>
**A)** Go applications should use `prometheus/client_golang` to expose metrics.
</details>

---

### Question 35 (Alerting)

How can you test alert rules before deploying them?

- [ ] A) Use `promtool test rules`
- [ ] B) Deploy to production and observe
- [ ] C) Use `amtool test`
- [ ] D) Use `curl` to test rule files

<details>
<summary>Show Answer</summary>
**A)** `promtool test rules` runs unit tests on alerting and recording rules.
</details>

---

### Question 36 (Observability)

What is the purpose of an error budget?

- [ ] A) To track all errors in the system
- [ ] B) To allow controlled deployment velocity even when SLOs are at risk
- [ ] C) To budget for monitoring tools
- [ ] D) To calculate system capacity

<details>
<summary>Show Answer</summary>
**B)** Error budgets balance reliability with feature velocity — when budget is exhausted, deployments stop.
</details>

---

### Question 37 (Prometheus Fundamentals)

What does the `metric_relabel_configs` action do?

- [ ] A) Relabels targets before scraping
- [ ] B) Relabels scraped metric labels before storage
- [ ] C) Relabels alert labels
- [ ] D) Configures metric naming

<details>
<summary>Show Answer</summary>
**B)** `metric_relabel_configs` modifies or filters metric labels after scraping but before storage.
</details>

---

### Question 38 (PromQL)

What does `1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)` calculate?

- [ ] A) Available memory ratio
- [ ] B) Memory usage ratio (0.0 to 1.0)
- [ ] C) Free memory ratio
- [ ] D) Buffer cache ratio

<details>
<summary>Show Answer</summary>
**B)** It calculates the fraction of total memory that is currently in use.
</details>

---

### Question 39 (Instrumentation & Exporters)

What is the purpose of the `--collector.disable-defaults` flag in Node Exporter?

- [ ] A) To disable the default metrics collection
- [ ] B) To start with no collectors enabled (add specific ones)
- [ ] C) To disable the web interface
- [ ] D) To disable textfile collector

<details>
<summary>Show Answer</summary>
**B)** It starts Node Exporter with no collectors, then you enable specific ones as needed.
</details>

---

### Question 40 (Alerting)

What is the purpose of routing labels in Alertmanager?

- [ ] A) To label the route
- [ ] B) To match alerts based on their labels for routing
- [ ] C) To label notifications
- [ ] D) To label Alertmanager instances

<details>
<summary>Show Answer</summary>
**B)** Routing matchers (match, match_re) determine which alerts go to which receiver based on label values.
</details>

---

### Question 41 (Observability)

What is the difference between errors and failures in SRE terminology?

- [ ] A) Errors are operational; failures are customer-impacting
- [ ] B) Errors are counted in SLIs; failures counted in SLOs
- [ ] C) Errors are internal; failures are always detected by users
- [ ] D) They are interchangeable

<details>
<summary>Show Answer</summary>
**A)** Errors are any failed operations; failures are errors that affect users or breach SLOs.
</details>

---

### Question 42 (Prometheus Fundamentals)

What is the difference between `scrape_timeout` and `scrape_interval`?

- [ ] A) scrape_timeout must be less than scrape_interval
- [ ] B) They are the same
- [ ] C) scrape_timeout is how long to wait; scrape_interval is how often to scrape
- [ ] D) scrape_interval must be less than scrape_timeout

<details>
<summary>Show Answer</summary>
**C)** `scrape_interval` = how often to scrape; `scrape_timeout` = how long to wait before giving up.
</details>

---

### Question 43 (PromQL)

What does the `ln()` function compute in PromQL?

- [ ] A) Natural logarithm base 10
- [ ] B) Natural logarithm (base e)
- [ ] C) Logarithm base 2
- [ ] D) Linear normalization

<details>
<summary>Show Answer</summary>
**B)** `ln()` computes the natural logarithm (base e).
</details>

---

### Question 44 (Instrumentation & Exporters)

What is the purpose of `node_time_seconds` metric?

- [ ] A) Node Exporter uptime
- [ ] B) Current system time as Unix timestamp
- [ ] C) Time since last scrape
- [ ] D) Time since last boot

<details>
<summary>Show Answer</summary>
**B)** `node_time_seconds` shows the current system time as a Unix timestamp.
</details>

---

### Question 45 (Alerting)

What is the purpose of the VictorOps integration in Alertmanager?

- [ ] A) To forward alerts to VictorOps incident management
- [ ] B) To configure alert rules
- [ ] C) To visualize metrics
- [ ] D) To create dashboards

<details>
<summary>Show Answer</summary>
**A)** VictorOps integration sends alert notifications to the VictorOps platform.
</details>

---

### Question 46 (Observability)

What does a burn rate of 2 indicate in terms of error budget consumption?

- [ ] A) Using budget at normal rate
- [ ] B) Using budget twice as fast as expected
- [ ] C) Using budget half as fast
- [ ] D) No budget being used

<details>
<summary>Show Answer</summary>
**B)** Burn rate of 2 means consuming the error budget at twice the expected rate.
</details>

---

### Question 47 (Prometheus Fundamentals)

What does the `relabel_configs` `target_label` field specify?

- [ ] A) The target to relabel
- [ ] B) The label to create or modify
- [ ] C) The target metric
- [ ] D) The target value

<details>
<summary>Show Answer</summary>
**B)** `target_label` specifies which label to create or modify in the relabeling operation.
</details>

---

### Question 48 (PromQL)

What is the result of `sum(rate(http_requests_total[5m])) / sum(rate(http_requests_total[5m]))`?

- [ ] A) 0
- [ ] B) 1 (if both have the same data)
- [ ] C) Total error rate
- [ ] D) Percentage

<details>
<summary>Show Answer</summary>
**B)** The same metric divided by itself equals 1 (for matching time series).
</details>

---

### Question 49 (Instrumentation & Exporters)

What is the purpose of the `--web.config.file` flag in Prometheus components?

- [ ] A) To configure the web UI
- [ ] B) To enable TLS and basic authentication for web endpoints
- [ ] C) To set the web root path
- [ ] D) To configure web server parameters

<details>
<summary>Show Answer</summary>
**B)** `--web.config.file` provides TLS certificate and basic auth configuration for HTTP endpoints.
</details>

---

### Question 50 (Alerting)

What does the `inhibit_rules` `target_match` field match against?

- [ ] A) The source alert
- [ ] B) The target alert to be suppressed
- [ ] C) The Alertmanager route
- [ ] D) The notification receiver

<details>
<summary>Show Answer</summary>
**B)** `target_match` specifies which alerts should be suppressed (the target of inhibition).
</details>

---

### Question 51 (Observability)

What is the purpose of defining reliability targets?

- [ ] A) To achieve 100% reliability
- [ ] B) To set acceptable levels of unreliability and focus engineering effort
- [ ] C) To ensure maximum uptime
- [ ] D) To meet compliance requirements

<details>
<summary>Show Answer</summary>
**B)** Targets define acceptable unreliability, balancing feature velocity with stability.
</details>

---

### Question 52 (Prometheus Fundamentals)

What is the purpose of the `alertmanager_config` section in prometheus.yml?

- [ ] A) To configure Alertmanager (deprecated — use alerting section)
- [ ] B) To define alert rules
- [ ] C) To configure notification receivers
- [ ] D) To set alert thresholds

<details>
<summary>Show Answer</summary>
**A)** The `alertmanager_config` section has been deprecated in favor of the `alerting` section.
</details>

---

### Question 53 (PromQL)

What does `rate(up[5m])` return?

- [ ] A) Rate of state changes for up/down status
- [ ] B) Error — rate() only works on counters
- [ ] C) 0.2 if up was 1 for the entire 5 minutes
- [ ] D) The average of up values

<details>
<summary>Show Answer</summary>
**B)** `rate()` works on counters only. `up` is a gauge (0 or 1), so this will not work as expected.
</details>

---

### Question 54 (Instrumentation & Exporters)

What port does the Elasticsearch Exporter listen on by default?

- [ ] A) 9200
- [ ] B) 9114
- [ ] C) 9107
- [ ] D) 9187

<details>
<summary>Show Answer</summary>
**B)** The Elasticsearch Exporter defaults to port 9114.
</details>

---

### Question 55 (Alerting)

What is the purpose of `pagerduty_configs` severity field?

- [ ] A) To set the PagerDuty severity level based on alert labels
- [ ] B) To configure PagerDuty URL
- [ ] C) To set the PagerDuty API key
- [ ] D) To configure PagerDuty teams

<details>
<summary>Show Answer</summary>
**A)** It maps alert severity to PagerDuty notification severity (e.g., `critical` → `critical`).
</details>

---

### Question 56 (Observability)

What is a common approach for setting SLIs for batch processing systems?

- [ ] A) Request latency
- [ ] B) Freshness (time since last successful update)
- [ ] C) Number of users
- [ ] D) CPU usage

<details>
<summary>Show Answer</summary>
**B)** For batch systems, freshness and throughput are common SLIs.
</details>

---

### Question 57 (Prometheus Fundamentals)

What does `labelkeep` relabeling action do?

- [ ] A) Keeps all labels
- [ ] B) Keeps only labels whose names match the regex
- [ ] C) Keeps labels with matching values
- [ ] D) Keeps metric labels

<details>
<summary>Show Answer</summary>
**B)** `labelkeep` removes all labels whose names don't match the specified regex.
</details>

---

### Question 58 (PromQL)

What is the correct way to calculate error ratio percentage?

- [ ] A) `errors / total * 100`
- [ ] B) `sum(errors) / sum(total) * 100`
- [ ] C) `errors - total * 100`
- [ ] D) `rate(errors) / rate(total) * 100`

<details>
<summary>Show Answer</summary>
**D)** Error ratio = `rate(errors[5m]) / rate(total[5m]) * 100`. Using `rate()` on both sides is correct for counters.
</details>

---

### Question 59 (Instrumentation & Exporters)

What is the recommended way to expose custom metrics from a cron job?

- [ ] A) Run a web server just for the job
- [ ] B) Push metrics to Pushgateway when job completes
- [ ] C) Log metrics to a file
- [ ] D) Email metrics to the team

<details>
<summary>Show Answer</summary>
**B)** Push metrics to Pushgateway at the end of the cron job execution.
</details>

---

### Question 60 (Alerting)

What is the purpose of `http_config` in Alertmanager receiver configuration?

- [ ] A) To configure HTTP receivers
- [ ] B) To configure HTTP client settings (auth, TLS) for webhook notifications
- [ ] C) To configure the Alertmanager HTTP server
- [ ] D) To configure HTTP probes

<details>
<summary>Show Answer</summary>
**B)** `http_config` allows configuring auth, TLS, and proxy settings for outgoing webhook notifications.
</details>

---

## Answer Key

| Q | Answer | Domain | Q | Answer | Domain |
|---|--------|--------|---|--------|--------|
| 1 | B | Observability | 31 | B | Observability |
| 2 | B | Fundamentals | 32 | A | Fundamentals |
| 3 | A | PromQL | 33 | C | PromQL |
| 4 | B | Instrumentation | 34 | A | Instrumentation |
| 5 | B | Alerting | 35 | A | Alerting |
| 6 | B | Observability | 36 | B | Observability |
| 7 | B | Fundamentals | 37 | B | Fundamentals |
| 8 | A | PromQL | 38 | B | PromQL |
| 9 | B | Instrumentation | 39 | B | Instrumentation |
| 10 | B | Alerting | 40 | B | Alerting |
| 11 | C | Observability | 41 | A | Observability |
| 12 | A | Fundamentals | 42 | C | Fundamentals |
| 13 | B | PromQL | 43 | B | PromQL |
| 14 | A | Instrumentation | 44 | B | Instrumentation |
| 15 | B | Alerting | 45 | A | Alerting |
| 16 | B | Observability | 46 | B | Observability |
| 17 | A | Fundamentals | 47 | B | Fundamentals |
| 18 | A | PromQL | 48 | B | PromQL |
| 19 | B | Instrumentation | 49 | B | Instrumentation |
| 20 | B | Alerting | 50 | B | Alerting |
| 21 | A | Observability | 51 | B | Observability |
| 22 | A | Fundamentals | 52 | A | Fundamentals |
| 23 | B | PromQL | 53 | B | PromQL |
| 24 | B | Instrumentation | 54 | B | Instrumentation |
| 25 | B | Alerting | 55 | A | Alerting |
| 26 | B | Observability | 56 | B | Observability |
| 27 | A | Fundamentals | 57 | B | Fundamentals |
| 28 | A | PromQL | 58 | D | PromQL |
| 29 | B | Instrumentation | 59 | B | Instrumentation |
| 30 | A | Alerting | 60 | B | Alerting |

## Score Calculation

| Score | Result |
|-------|--------|
| 42-60 (70-100%) | ✅ Pass |
| 30-41 (50-69%) | 🔄 Review weak domains |
| 0-29 (0-49%) | 📚 Study more before retaking |
