---
title: "Practice Test 3"
weight: 31
bookToc: true
---

# Practice Test 3

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

What does saturation measure in the USE method?

- [ ] A) How full a resource is
- [ ] B) The degree of queuing or contention (how much extra work is waiting)
- [ ] C) The error rate
- [ ] D) The response time

<details>
<summary>Show Answer</summary>
**B)** Saturation measures the extent to which a resource has queued or contended work.
</details>

---

### Question 2 (Prometheus Fundamentals)

Which component in Prometheus handles query evaluation?

- [ ] A) Scrape manager
- [ ] B) TSDB
- [ ] C) HTTP API
- [ ] D) PromQL engine

<details>
<summary>Show Answer</summary>
**D)** The PromQL engine evaluates and executes PromQL queries.
</details>

---

### Question 3 (PromQL)

What does `rate(node_cpu_seconds_total[5m])` return when the counter has only one data point in the range?

- [ ] A) 0
- [ ] B) The single data point value
- [ ] C) Nothing (empty result)
- [ ] D) The data point divided by 300

<details>
<summary>Show Answer</summary>
**C)** `rate()` requires at least 2 samples in the range to calculate a rate. Returns empty otherwise.
</details>

---

### Question 4 (Instrumentation & Exporters)

What does the `process_resident_memory_bytes` metric measure?

- [ ] A) Virtual memory of the process
- [ ] B) Resident (physical) memory used by the process
- [ ] C) Swap memory used
- [ ] D) Total system memory

<details>
<summary>Show Answer</summary>
**B)** `process_resident_memory_bytes` shows the physical (resident) memory used by the process.
</details>

---

### Question 5 (Alerting)

What is the purpose of `amtool silence query`?

- [ ] A) To create a new silence
- [ ] B) To query and list existing silences
- [ ] C) To expire a silence
- [ ] D) To test a silence

<details>
<summary>Show Answer</summary>
**B)** `amtool silence query` lists existing silences with optional matcher filters.
</details>

---

### Question 6 (Observability)

What is a multi-window, multi-burn-rate alert?

- [ ] A) An alert with multiple conditions
- [ ] B) An alert comparing multiple time windows for faster detection of SLO violations
- [ ] C) An alert with multiple receivers
- [ ] D) An alert that fires multiple times

<details>
<summary>Show Answer</summary>
**B)** Multi-window, multi-burn-rate alerts use short and long windows to detect SLO violations quickly without false positives.
</details>

---

### Question 7 (Prometheus Fundamentals)

What is the maximum number of scrape targets Prometheus can handle?

- [ ] A) 100
- [ ] B) 1000
- [ ] C) 10,000
- [ ] D) It depends on hardware and configuration

<details>
<summary>Show Answer</summary>
**D)** The maximum scrape targets depend on available CPU, memory, and scrape frequency.
</details>

---

### Question 8 (PromQL)

Which function would you use to get a smooth moving average?

- [ ] A) `avg()`
- [ ] B) `avg_over_time()`
- [ ] C) `holt_winters()`
- [ ] D) `smooth()`

<details>
<summary>Show Answer</summary>
**C)** `holt_winters()` applies Holt-Winters exponential smoothing to produce a smooth moving average.
</details>

---

### Question 9 (Instrumentation & Exporters)

What port does the PostgreSQL Exporter use by default?

- [ ] A) 5432
- [ ] B) 9187
- [ ] C) 9104
- [ ] D) 9114

<details>
<summary>Show Answer</summary>
**B)** The PostgreSQL Exporter listens on port 9187 by default.
</details>

---

### Question 10 (Alerting)

What is the default value of `resolve_timeout` in Alertmanager's global configuration?

- [ ] A) 1m
- [ ] B) 5m
- [ ] C) 15m
- [ ] D) 1h

<details>
<summary>Show Answer</summary>
**B)** The default `resolve_timeout` is 5 minutes.
</details>

---

### Question 11 (Observability)

What is the primary purpose of a dashboard?

- [ ] A) To page on-call engineers
- [ ] B) To provide visual answers to predefined questions about system health
- [ ] C) To store historical data
- [ ] D) To generate reports

<details>
<summary>Show Answer</summary>
**B)** Dashboards answer predefined questions about system health and performance at a glance.
</details>

---

### Question 12 (Prometheus Fundamentals)

What is the `remote_write` configuration used for?

- [ ] A) To write metrics to database
- [ ] B) To send Prometheus metrics to remote storage systems
- [ ] C) To write alerts to external systems
- [ ] D) To write configuration changes

<details>
<summary>Show Answer</summary>
**B)** `remote_write` sends scraped metrics to long-term storage or external systems.
</details>

---

### Question 13 (PromQL)

What does the `label_join()` function do?

- [ ] A) Joins two metrics together
- [ ] B) Concatenates label values into a new label
- [ ] C) Joins two time series
- [ ] D) Joins two query results

<details>
<summary>Show Answer</summary>
**B)** `label_join()` concatenates values from multiple existing labels into a new label.
</details>

---

### Question 14 (Instrumentation & Exporters)

Which metric type should be used to track the duration of database queries?

- [ ] A) Counter
- [ ] B) Gauge
- [ ] C) Histogram
- [ ] D) Summary (or Histogram)

<details>
<summary>Show Answer</summary>
**D)** Duration tracking with distribution analysis should use Histogram or Summary.
</details>

---

### Question 15 (Alerting)

What is the purpose of the Alertmanager clustering feature?

- [ ] A) Load balancing
- [ ] B) High availability and deduplication of alerts
- [ ] C) Scaling scrape operations
- [ ] D) Storing alert history

<details>
<summary>Show Answer</summary>
**B)** Alertmanager clustering provides HA and ensures each alert is only sent once across the cluster.
</details>

---

### Question 16 (Observability)

What does "monitoring" refer to in the SRE context?

- [ ] A) Analyzing system internals through debugging
- [ ] B) Collecting, processing, and displaying metrics and system state
- [ ] C) Forecasting future system failures
- [ ] D) Automating incident response

<details>
<summary>Show Answer</summary>
**B)** Monitoring is the collection and visualization of metrics and system state data.
</details>

---

### Question 17 (Prometheus Fundamentals)

What does `keep` relabeling action do?

- [ ] A) Keeps the target if the regex matches a label
- [ ] B) Keeps all labels
- [ ] C) Keeps the metric value
- [ ] D) Keeps the configuration

<details>
<summary>Show Answer</summary>
**A)** `keep` drops targets that don't match the regex against the specified source label.
</details>

---

### Question 18 (PromQL)

What is the difference between `sum(x)` and `sum without (instance)(x)`?

- [ ] A) `sum(x)` removes all labels; `sum without (instance)(x)` removes only the `instance` label
- [ ] B) There is no difference
- [ ] C) `sum(x)` is faster
- [ ] D) `sum without (instance)(x)` removes all labels

<details>
<summary>Show Answer</summary>
**A)** `sum(x)` removes all labels, summing everything; `sum without (instance)` removes only `instance`, keeping other labels.
</details>

---

### Question 19 (Instrumentation & Exporters)

What is the purpose of the `collector.textfile.directory` flag in Node Exporter?

- [ ] A) To collect text logs
- [ ] B) To specify the directory containing `.prom` files with custom metrics
- [ ] C) To set the output directory
- [ ] D) To configure text file logging

<details>
<summary>Show Answer</summary>
**B)** It specifies the directory where Node Exporter looks for `.prom` files to expose as metrics.
</details>

---

### Question 20 (Alerting)

What happens when an alerting rule's `expr` returns no results?

- [ ] A) The alert stays in its current state
- [ ] B) The alert is resolved (if it was firing)
- [ ] C) An error is logged
- [ ] D) The rule is deleted

<details>
<summary>Show Answer</summary>
**B)** When an alerting rule expression returns no results, any firing alert is resolved.
</details>

---

### Question 21 (Observability)

What is the difference between monitoring and observability?

- [ ] A) Monitoring requires dashboards; observability requires alerts
- [ ] B) Monitoring tells you what's happening; observability lets you ask why
- [ ] C) They are interchangeable terms
- [ ] D) Monitoring is manual; observability is automated

<details>
<summary>Show Answer</summary>
**B)** Monitoring tells you the state (what's broken); observability lets you understand why.
</details>

---

### Question 22 (Prometheus Fundamentals)

What does the `drop` relabeling action do?

- [ ] A) Drops labels from the label set
- [ ] B) Drops targets if the regex matches
- [ ] C) Drops metric values
- [ ] D) Drops configuration

<details>
<summary>Show Answer</summary>
**B)** `drop` removes targets where the source label matches the regex.
</details>

---

### Question 23 (PromQL)

What does `quantile_over_time(0.95, http_duration_seconds[1h])` calculate?

- [ ] A) 95th percentile of the rate over 1 hour
- [ ] B) 95th percentile of raw sample values over 1 hour
- [ ] C) 95th percentile across instances
- [ ] D) Average over 95% of the time range

<details>
<summary>Show Answer</summary>
**B)** `quantile_over_time()` calculates the φ-quantile of raw sample values over the range.
</details>

---

### Question 24 (Instrumentation & Exporters)

What does the `node_filesystem_avail_bytes` metric represent?

- [ ] A) Total filesystem size
- [ ] B) Filesystem space available to non-root users
- [ ] C) Filesystem space used
- [ ] D) Filesystem free space including reserved blocks

<details>
<summary>Show Answer</summary>
**B)** `node_filesystem_avail_bytes` is the space available to unprivileged users (excludes reserved blocks).
</details>

---

### Question 25 (Alerting)

What is the purpose of `amtool alert`?

- [ ] A) To create alert rules
- [ ] B) To query current Alertmanager alerts
- [ ] C) To silence alerts
- [ ] D) To test alert routing

<details>
<summary>Show Answer</summary>
**B)** `amtool alert` queries and lists currently active alerts in Alertmanager.
</details>

---

### Question 26 (Observability)

What is a common multi-SLO example?

- [ ] A) A service with 99.9% uptime AND 99% latency SLO
- [ ] B) A service with one SLO
- [ ] C) A service with multiple environments
- [ ] D) A service with multiple error budgets

<details>
<summary>Show Answer</summary>
**A)** A multi-SLO service has targets for different dimensions, e.g., availability and latency.
</details>

---

### Question 27 (Prometheus Fundamentals)

What does `__param_target` represent in Blackbox Exporter scraping?

- [ ] A) The target to probe (URL or host)
- [ ] B) The Prometheus scrape target
- [ ] C) The metric target
- [ ] D) The alert target

<details>
<summary>Show Answer</summary>
**A)** `__param_target` holds the actual endpoint URL or host that Blackbox Exporter should probe.
</details>

---

### Question 28 (PromQL)

What does the `clamp()` function do?

- [ ] A) Clamps metric values to a specified range
- [ ] B) Clamps labels to a specified set
- [ ] C) Clamps time ranges
- [ ] D) Clamps query results

<details>
<summary>Show Answer</summary>
**A)** `clamp()` restricts metric values to a specified min/max range.
</details>

---

### Question 29 (Instrumentation & Exporters)

What is the correct way to instrument a Python web service?

- [ ] A) Use the Prometheus Pushgateway
- [ ] B) Use the `prometheus_client` library and expose `/metrics`
- [ ] C) Use the Node Exporter
- [ ] D) Use remote write

<details>
<summary>Show Answer</summary>
**B)** Python services should use `prometheus_client` to expose a `/metrics` endpoint for scraping.
</details>

---

### Question 30 (Alerting)

What is the purpose of the `send_resolved` option in Alertmanager receivers?

- [ ] A) To send notifications when alerts are resolved
- [ ] B) To resolve alerts automatically
- [ ] C) To mark notifications as resolved
- [ ] D) To resolve conflicts in alert routing

<details>
<summary>Show Answer</summary>
**A)** `send_resolved: true` sends a notification when an alert transitions back to resolved state.
</details>

---

### Question 31 (Observability)

What does the "service" in service-level indicator refer to?

- [ ] A) A microservice
- [ ] B) Any component that provides a capability to users
- [ ] C) A web server
- [ ] D) An API endpoint

<details>
<summary>Show Answer</summary>
**B)** A "service" in SRE terms is any component that provides a defined capability to its users.
</details>

---

### Question 32 (Prometheus Fundamentals)

What does `scrape_interval: 15s` mean?

- [ ] A) Scrape takes 15 seconds
- [ ] B) Prometheus scrapes the target every 15 seconds
- [ ] C) The scrape timeout is 15 seconds
- [ ] D) Metrics are stored for 15 seconds

<details>
<summary>Show Answer</summary>
**B)** `scrape_interval: 15s` means Prometheus scrapes targets in this job every 15 seconds.
</details>

---

### Question 33 (PromQL)

What is the result of `count_values("mode", node_cpu_seconds_total)`?

- [ ] A) Counts the number of time series per distinct value
- [ ] B) Counts the number of values per label
- [ ] C) Counts the number of CPUs
- [ ] D) Counts total CPU time

<details>
<summary>Show Answer</summary>
**A)** `count_values()` creates a new metric that counts how many time series have each distinct value.
</details>

---

### Question 34 (Instrumentation & Exporters)

What is the default metrics path for most Prometheus exporters?

- [ ] A) `/health`
- [ ] B) `/status`
- [ ] C) `/metrics`
- [ ] D) `/prometheus`

<details>
<summary>Show Answer</summary>
**C)** The default metrics endpoint path is `/metrics`.
</details>

---

### Question 35 (Alerting)

What happens when an alert remains in pending state?

- [ ] A) The alert condition is true but hasn't exceeded the `for` duration yet
- [ ] B) The alert is not configured correctly
- [ ] C) The alert has been silenced
- [ ] D) The Alertmanager is down

<details>
<summary>Show Answer</summary>
**A)** Pending means the condition is met but hasn't lasted long enough (per `for` setting).
</details>

---

### Question 36 (Observability)

What is a common SLI for storage systems?

- [ ] A) Requests per second
- [ ] B) Error rate
- [ ] C) Latency
- [ ] D) All of the above

<details>
<summary>Show Answer</summary>
**D)** Storage systems commonly track IOPS (traffic), error rates, and latency.
</details>

---

### Question 37 (Prometheus Fundamentals)

How do you enable HTTPS for Prometheus's web interface?

- [ ] A) Via command-line flags `--web.config.file`
- [ ] B) Via environment variables
- [ ] C) Via a reverse proxy
- [ ] D) All of the above are valid approaches

<details>
<summary>Show Answer</summary>
**D)** You can use Prometheus's built-in TLS via `--web.config.file`, or use a reverse proxy like nginx.
</details>

---

### Question 38 (PromQL)

What does `time() - node_boot_time_seconds` calculate?

- [ ] A) Current time
- [ ] B) System uptime in seconds
- [ ] C) Boot duration
- [ ] D) System downtime

<details>
<summary>Show Answer</summary>
**B)** `time() - node_boot_time_seconds` calculates the system's uptime in seconds.
</details>

---

### Question 39 (Instrumentation & Exporters)

What is the recommended approach to reduce Pushgateway metrics staleness?

- [ ] A) Set a TTL in Pushgateway
- [ ] B) Push a timestamp metric and alert on staleness
- [ ] C) Restart Pushgateway after each job
- [ ] D) Use a shorter scrape interval

<details>
<summary>Show Answer</summary>
**B)** Push a timestamp metric and alert if `time() - last_push_timestamp > threshold`.
</details>

---

### Question 40 (Alerting)

What does the `alertmanager_alerts` metric show?

- [ ] A) Number of configured alerts
- [ ] B) Current number of active alerts in Alertmanager
- [ ] C) Total alerts fired historically
- [ ] D) Alert notification count

<details>
<summary>Show Answer</summary>
**B)** `alertmanager_alerts` shows the current count of active alerts in Alertmanager.
</details>

---

### Question 41 (Observability)

What is the purpose of defining SLIs for infrastructure components?

- [ ] A) To track business metrics
- [ ] B) To understand the component's health from the user's perspective
- [ ] C) To optimize costs
- [ ] D) To meet compliance requirements

<details>
<summary>Show Answer</summary>
**B)** Infrastructure SLIs measure health as perceived by dependent services and users.
</details>

---

### Question 42 (Prometheus Fundamentals)

What does `labelmap` relabeling action do?

- [ ] A) Maps metric names to new names
- [ ] B) Creates new labels by matching regex against existing label names
- [ ] C) Maps metric values to labels
- [ ] D) Maps targets to labels

<details>
<summary>Show Answer</summary>
**B)** `labelmap` matches regex against existing label names and creates new labels from matches.
</details>

---

### Question 43 (PromQL)

What does the `deriv()` function compute?

- [ ] A) The derivative of a counter
- [ ] B) The per-second rate of change of a gauge using linear regression
- [ ] C) The difference in values
- [ ] D) The rate of increase

<details>
<summary>Show Answer</summary>
**B)** `deriv()` calculates the per-second derivative of a gauge using simple linear regression.
</details>

---

### Question 44 (Instrumentation & Exporters)

What is the purpose of `probe_duration_seconds` metric from Blackbox Exporter?

- [ ] A) Total probe execution time
- [ ] B) How long the Blackbox Exporter has been running
- [ ] C) DNS resolution time
- [ ] D) HTTP request time

<details>
<summary>Show Answer</summary>
**A)** `probe_duration_seconds` measures the total time taken for a probe (includes DNS, TCP, TLS, HTTP).
</details>

---

### Question 45 (Alerting)

What is the default `group_wait` time in Alertmanager?

- [ ] A) 10s
- [ ] B) 30s
- [ ] C) 1m
- [ ] D) 5m

<details>
<summary>Show Answer</summary>
**B)** Default `group_wait` is 30 seconds.
</details>

---

### Question 46 (Observability)

What is the "USE" method primarily designed for?

- [ ] A) Application monitoring
- [ ] B) Infrastructure resource monitoring
- [ ] C) Business metrics
- [ ] D) User experience monitoring

<details>
<summary>Show Answer</summary>
**B)** The USE method is primarily designed for infrastructure resource monitoring (CPU, memory, disk, network).
</details>

---

### Question 47 (Prometheus Fundamentals)

What happens when `max_samples_per_send` is reached in `remote_write`?

- [ ] A) Extra samples are dropped
- [ ] B) The write request is split into multiple requests
- [ ] C) An error is logged
- [ ] D) Prometheus stops scraping

<details>
<summary>Show Answer</summary>
**B)** When `max_samples_per_send` is reached, the request is split into batches.
</details>

---

### Question 48 (PromQL)

What is the result of `count by (mode) (node_cpu_seconds_total)`?

- [ ] A) Number of CPUs per mode
- [ ] B) Total CPU seconds per mode
- [ ] C) Number of time series per mode label value
- [ ] D) Count of cores per mode

<details>
<summary>Show Answer</summary>
**C)** `count` counts the number of time series (elements) per group.
</details>

---

### Question 49 (Instrumentation & Exporters)

When should you consider using a Summary instead of a Histogram?

- [ ] A) When you need aggregated quantiles across instances
- [ ] B) When you cannot aggregate quantiles and need pre-calculated client-side percentiles
- [ ] C) When you need buckets
- [ ] D) Always prefer Histogram over Summary

<details>
<summary>Show Answer</summary>
**B)** Use Summary when you cannot aggregate server-side and need pre-calculated quantiles (e.g., for per-instance dashboards).
</details>

---

### Question 50 (Alerting)

How do you configure Alertmanager to send alerts to multiple receivers for the same alert?

- [ ] A) Use multiple routing rules with the same matchers
- [ ] B) Use the `continue: true` directive in the route
- [ ] C) Configure multiple receivers in the root route
- [ ] D) Duplicate the alert rules

<details>
<summary>Show Answer</summary>
**B)** Set `continue: true` on a route so alerts continue matching subsequent routes to other receivers.
</details>

---

### Question 51 (Observability)

What is the Google SRE recommended reliability for most internal services?

- [ ] A) 99.999%
- [ ] B) 99.99%
- [ ] C) 99.9%
- [ ] D) 99% or less

<details>
<summary>Show Answer</summary>
**D)** Most internal services target 99% or less; 99.99%+ is reserved for critical customer-facing services.
</details>

---

### Question 52 (Prometheus Fundamentals)

What is the purpose of `relabel_configs` in Prometheus configuration?

- [ ] A) To modify metric values
- [ ] B) To modify or filter scrape targets based on labels
- [ ] C) To configure alerting rules
- [ ] D) To set retention policies

<details>
<summary>Show Answer</summary>
**B)** `relabel_configs` modifies or filters targets before scraping.
</details>

---

### Question 53 (PromQL)

What does `label_replace(up, "new_label", "$1", "instance", "(.*):.*")` do?

- [ ] A) Replaces the `instance` label value
- [ ] B) Creates a `new_label` with the hostname extracted from the `instance` label
- [ ] C) Removes the port from the instance label
- [ ] D) All of the above

<details>
<summary>Show Answer</summary>
**D)** It creates `new_label` containing the hostname (without port) extracted from `instance`.
</details>

---

### Question 54 (Instrumentation & Exporters)

What does `node_network_receive_bytes_total` measure?

- [ ] A) Total network bytes received since boot
- [ ] B) Network bytes received per second
- [ ] C) Network bandwidth usage
- [ ] D) Network packets received

<details>
<summary>Show Answer</summary>
**A)** `node_network_receive_bytes_total` is a counter of total network bytes received.
</details>

---

### Question 55 (Alerting)

What is the purpose of inhibition rules in Alertmanager?

- [ ] A) To speed up alert delivery
- [ ] B) To suppress certain alerts when other alerts are firing
- [ ] C) To inhibit alert creation
- [ ] D) To inhibit metrics collection

<details>
<summary>Show Answer</summary>
**B)** Inhibition suppresses notification for some alerts when other, more critical alerts are firing.
</details>

---

### Question 56 (Observability)

What does "burn rate" of 1 represent in SLO terms?

- [ ] A) The error budget is being consumed exactly at the expected rate
- [ ] B) The error budget is being consumed twice as fast as expected
- [ ] C) No error budget is being consumed
- [ ] D) All error budget is consumed

<details>
<summary>Show Answer</summary>
**A)** A burn rate of 1 means exactly on track to exhaust the error budget by the end of the window.
</details>

---

### Question 57 (Prometheus Fundamentals)

What does the `labeldrop` relabeling action do?

- [ ] A) Drops targets with certain labels
- [ ] B) Drops labels matching the regex
- [ ] C) Drops metric values
- [ ] D) Drops scrape targets

<details>
<summary>Show Answer</summary>
**B)** `labeldrop` removes labels from the label set where the name matches the regex.
</details>

---

### Question 58 (PromQL)

What is the result of the expression `1 + 2 * 3 ^ 2` in PromQL?

- [ ] A) 19
- [ ] B) 55
- [ ] C) 37
- [ ] D) 28

<details>
<summary>Show Answer</summary>
**A)** Precedence: `^` first (3^2=9), then `*` (2*9=18), then `+` (1+18=19).
</details>

---

### Question 59 (Instrumentation & Exporters)

What is the correct scrape path for Blackbox Exporter?

- [ ] A) `/metrics`
- [ ] B) `/probe`
- [ ] C) `/health`
- [ ] D) `/check`

<details>
<summary>Show Answer</summary>
**B)** Blackbox Exporter exposes its probe endpoint at `/probe`.
</details>

---

### Question 60 (Alerting)

What is the format of Alertmanager API for managing silences?

- [ ] A) REST API v1
- [ ] B) REST API v2
- [ ] C) gRPC
- [ ] D) GraphQL

<details>
<summary>Show Answer</summary>
**B)** Alertmanager uses the REST API v2 for silence management and other operations.
</details>

---

## Answer Key

| Q | Answer | Domain | Q | Answer | Domain |
|---|--------|--------|---|--------|--------|
| 1 | B | Observability | 31 | B | Observability |
| 2 | D | Fundamentals | 32 | B | Fundamentals |
| 3 | C | PromQL | 33 | A | PromQL |
| 4 | B | Instrumentation | 34 | C | Instrumentation |
| 5 | B | Alerting | 35 | A | Alerting |
| 6 | B | Observability | 36 | D | Observability |
| 7 | D | Fundamentals | 37 | D | Fundamentals |
| 8 | C | PromQL | 38 | B | PromQL |
| 9 | B | Instrumentation | 39 | B | Instrumentation |
| 10 | B | Alerting | 40 | B | Alerting |
| 11 | B | Observability | 41 | B | Observability |
| 12 | B | Fundamentals | 42 | B | Fundamentals |
| 13 | B | PromQL | 43 | B | PromQL |
| 14 | D | Instrumentation | 44 | A | Instrumentation |
| 15 | B | Alerting | 45 | B | Alerting |
| 16 | B | Observability | 46 | B | Observability |
| 17 | A | Fundamentals | 47 | B | Fundamentals |
| 18 | A | PromQL | 48 | C | PromQL |
| 19 | B | Instrumentation | 49 | B | Instrumentation |
| 20 | B | Alerting | 50 | B | Alerting |
| 21 | B | Observability | 51 | D | Observability |
| 22 | B | Fundamentals | 52 | B | Fundamentals |
| 23 | B | PromQL | 53 | D | PromQL |
| 24 | B | Instrumentation | 54 | A | Instrumentation |
| 25 | B | Alerting | 55 | B | Alerting |
| 26 | A | Observability | 56 | A | Observability |
| 27 | A | Fundamentals | 57 | B | Fundamentals |
| 28 | A | PromQL | 58 | A | PromQL |
| 29 | B | Instrumentation | 59 | B | Instrumentation |
| 30 | A | Alerting | 60 | B | Alerting |

## Score Calculation

| Score | Result |
|-------|--------|
| 42-60 (70-100%) | ✅ Pass |
| 30-41 (50-69%) | 🔄 Review weak domains |
| 0-29 (0-49%) | 📚 Study more before retaking |
