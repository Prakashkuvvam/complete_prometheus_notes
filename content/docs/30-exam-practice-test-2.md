---
title: "Practice Test 2"
weight: 30
bookToc: true
---

# Practice Test 2

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

What is black-box monitoring?

- [ ] A) Monitoring based on internal application metrics
- [ ] B) Monitoring based on external probing of visible behavior
- [ ] C) Monitoring without any dashboards
- [ ] D) Monitoring with limited access to the system

<details>
<summary>Show Answer</summary>
**B)** Black-box monitoring tests externally visible behavior (e.g., probing HTTP endpoints).
</details>

---

### Question 2 (Prometheus Fundamentals)

Which component is responsible for collecting metrics from targets in Prometheus?

- [ ] A) TSDB
- [ ] B) PromQL engine
- [ ] C) Scrape manager
- [ ] D) Alertmanager

<details>
<summary>Show Answer</summary>
**C)** The scrape manager handles scheduling and executing metric scrapes from targets.
</details>

---

### Question 3 (PromQL)

What does `increase(http_requests_total[5m])` return?

- [ ] A) Per-second rate over 5 minutes
- [ ] B) Total increase in the counter over 5 minutes
- [ ] C) Average value over 5 minutes
- [ ] D) Maximum value over 5 minutes

<details>
<summary>Show Answer</summary>
**B)** `increase()` returns the absolute increase of a counter over the specified time range.
</details>

---

### Question 4 (Instrumentation & Exporters)

What port does the Blackbox Exporter listen on by default?

- [ ] A) 9090
- [ ] B) 9100
- [ ] C) 9115
- [ ] D) 9121

<details>
<summary>Show Answer</summary>
**C)** Blackbox Exporter defaults to port 9115.
</details>

---

### Question 5 (Alerting)

What is the purpose of a silence in Alertmanager?

- [ ] A) To permanently delete alerts
- [ ] B) To temporarily suppress notifications for matching alerts
- [ ] C) To reduce alert volume by grouping
- [ ] D) To prevent alert rules from being evaluated

<details>
<summary>Show Answer</summary>
**B)** Silences temporarily mute notifications for matching alerts (e.g., during maintenance).
</details>

---

### Question 6 (Observability)

What is a service-level objective (SLO)?

- [ ] A) A quantitative measure of service performance
- [ ] B) A target value or range for a service level indicator
- [ ] C) An agreement between provider and customer
- [ ] D) A measure of customer satisfaction

<details>
<summary>Show Answer</summary>
**B)** An SLO is a target for an SLI (e.g., "p99 latency < 500ms").
</details>

---

### Question 7 (Prometheus Fundamentals)

What is the purpose of the `external_labels` configuration?

- [ ] A) To add labels to all scraped metrics for global identification
- [ ] B) To label external targets
- [ ] C) To exclude labels from external systems
- [ ] D) To configure alert labels

<details>
<summary>Show Answer</summary>
**A)** `external_labels` adds labels to all metrics and alerts when communicating with external systems (like Alertmanager or remote storage).
</details>

---

### Question 8 (PromQL)

Which function returns the difference between the first and last value of a gauge over a time range?

- [ ] A) `increase()`
- [ ] B) `rate()`
- [ ] C) `delta()`
- [ ] D) `change()`

<details>
<summary>Show Answer</summary>
**C)** `delta()` calculates the difference between the first and last values of a gauge over a range.
</details>

---

### Question 9 (Instrumentation & Exporters)

What metric does the Blackbox Exporter use to indicate probe success?

- [ ] A) `probe_up`
- [ ] B) `probe_success`
- [ ] C) `probe_healthy`
- [ ] D) `probe_available`

<details>
<summary>Show Answer</summary>
**B)** `probe_success` returns 1 for success and 0 for failure.
</details>

---

### Question 10 (Alerting)

Which Alertmanager configuration section defines who receives notifications?

- [ ] A) `route`
- [ ] B) `receivers`
- [ ] C) `inhibit_rules`
- [ ] D) `global`

<details>
<summary>Show Answer</summary>
**B)** The `receivers` section defines notification destinations (email, Slack, PagerDuty, etc.).
</details>

---

### Question 11 (Observability)

What does "RED method" stand for?

- [ ] A) Resources, Events, Data
- [ ] B) Rate, Errors, Duration
- [ ] C) Requests, Errors, Duration
- [ ] D) Rate, Efficiency, Data

<details>
<summary>Show Answer</summary>
**C)** RED: Requests (rate), Errors (failed requests), Duration (latency).
</details>

---

### Question 12 (Prometheus Fundamentals)

What is the default port for Prometheus metrics exposition?

- [ ] A) 8080
- [ ] B) 9090
- [ ] C) 80
- [ ] D) 443

<details>
<summary>Show Answer</summary>
**B)** Prometheus exposes its own metrics on port 9090 by default.
</details>

---

### Question 13 (PromQL)

What does the `or` operator return in PromQL?

- [ ] A) Only elements common to both sides
- [ ] B) All elements from left side plus right-side elements not in left
- [ ] C) Only elements from the right side
- [ ] D) Elements sorted by value

<details>
<summary>Show Answer</summary>
**B)** `or` returns union: all left-side elements plus right-side elements not present in left.
</details>

---

### Question 14 (Instrumentation & Exporters)

What is the primary use case for the SNMP Exporter?

- [ ] A) Monitoring Java applications
- [ ] B) Monitoring network devices (routers, switches)
- [ ] C) Monitoring Linux servers
- [ ] D) Monitoring web applications

<details>
<summary>Show Answer</summary>
**B)** The SNMP Exporter monitors network devices like routers and switches.
</details>

---

### Question 15 (Alerting)

What is the purpose of the `continue` directive in Alertmanager route configuration?

- [ ] A) To restart the alert evaluation
- [ ] B) To continue matching subsequent routes after a match
- [ ] C) To continue sending notifications after an error
- [ ] D) To continue grouping alerts

<details>
<summary>Show Answer</summary>
**B)** When `continue: true`, the route will also try subsequent sibling routes after matching.
</details>

---

### Question 16 (Observability)

Which of the following is a valid SLO example?

- [ ] A) "99.9% of requests complete in under 500ms over a 30-day window"
- [ ] B) "Server is running"
- [ ] C) "No errors today"
- [ ] D) "Response time under 500ms"

<details>
<summary>Show Answer</summary>
**A)** A proper SLO includes the target, measurement, and time window.
</details>

---

### Question 17 (Prometheus Fundamentals)

What happens when Prometheus cannot scrape a target?

- [ ] A) The target is removed from configuration
- [ ] B) The `up` metric is set to 0 for that target
- [ ] C) Prometheus restarts
- [ ] D) An alert is automatically created

<details>
<summary>Show Answer</summary>
**B)** The `up{instance="..."}` metric becomes 0 for a failed scrape, 1 for successful.
</details>

---

### Question 18 (PromQL)

What is the purpose of the `by` clause in aggregation operations?

- [ ] A) To group aggregation results by specified labels
- [ ] B) To specify the aggregation function
- [ ] C) To order results by value
- [ ] D) To limit results by count

<details>
<summary>Show Answer</summary>
**A)** `by (labels)` groups and aggregates results by the specified labels while preserving them.
</details>

---

### Question 19 (Instrumentation & Exporters)

Which function does the Blackbox Exporter use to probe HTTPS endpoints?

- [ ] A) `icmp` module
- [ ] B) `tcp_connect` module
- [ ] C) `http_2xx` module
- [ ] D) `ssl_check` module

<details>
<summary>Show Answer</summary>
**C)** The `http_2xx` module probes HTTP/HTTPS endpoints.
</details>

---

### Question 20 (Alerting)

What is the default `group_interval` in Alertmanager?

- [ ] A) 30 seconds
- [ ] B) 1 minute
- [ ] C) 5 minutes
- [ ] D) 15 minutes

<details>
<summary>Show Answer</summary>
**C)** The default `group_interval` is 5 minutes.
</details>

---

### Question 21 (Observability)

What is the difference between SLI and SLO?

- [ ] A) SLI is a target; SLO is a measurement
- [ ] B) SLI is a measurement; SLO is a target
- [ ] C) They are the same thing
- [ ] D) SLI is for services; SLO is for infrastructure

<details>
<summary>Show Answer</summary>
**B)** SLI is the actual measured value; SLO is the target for that value.
</details>

---

### Question 22 (Prometheus Fundamentals)

What is the WAL (Write-Ahead Log) in Prometheus used for?

- [ ] A) Storing long-term metrics
- [ ] B) Durability before data is compressed into TSDB blocks
- [ ] C) Logging query performance
- [ ] D) Caching frequently accessed metrics

<details>
<summary>Show Answer</summary>
**B)** The WAL ensures durability by recording incoming samples before they are compacted into read-only TSDB blocks.
</details>

---

### Question 23 (PromQL)

What does `avg_over_time(node_load1[1h])` calculate?

- [ ] A) The average of per-second rates over 1 hour
- [ ] B) The average load over the last hour
- [ ] C) The minimum load over the last hour
- [ ] D) The load average per core

<details>
<summary>Show Answer</summary>
**B)** `avg_over_time()` calculates the arithmetic average of all raw samples in the range.
</details>

---

### Question 24 (Instrumentation & Exporters)

What metric would you use to check if a Node Exporter is still scraping data?

- [ ] A) `node_exporter_build_info`
- [ ] B) `up{job="node"}`
- [ ] C) `scrape_duration_seconds`
- [ ] D) `node_scrape_duration_seconds`

<details>
<summary>Show Answer</summary>
**B)** The `up` metric indicates whether a target was successfully scraped.
</details>

---

### Question 25 (Alerting)

What command-line tool is used to interact with Alertmanager for managing silences?

- [ ] A) `promtool`
- [ ] B) `amtool`
- [ ] C) `alertmanagerctl`
- [ ] D) `silencetool`

<details>
<summary>Show Answer</summary>
**B)** `amtool` is the command-line interface for Alertmanager operations.
</details>

---

### Question 26 (Observability)

What does a high burn rate indicate?

- [ ] A) High CPU usage
- [ ] B) Rapid consumption of error budget
- [ ] C) High request rate
- [ ] D) Fast alert processing

<details>
<summary>Show Answer</summary>
**B)** Burn rate measures how quickly the error budget is being consumed.
</details>

---

### Question 27 (Prometheus Fundamentals)

How does Prometheus handle target labels from service discovery?

- [ ] A) All SD labels are automatically included
- [ ] B) Targets are discovered with `__meta_*` labels that can be relabeled
- [ ] C) SD labels are ignored by default
- [ ] D) Only the `job` label is preserved

<details>
<summary>Show Answer</summary>
**B)** Service discovery provides `__meta_*` prefix labels that can be used via relabeling.
</details>

---

### Question 28 (PromQL)

What is the difference between `sum(x)` and `sum by (job)(x)`?

- [ ] A) `sum(x)` sums everything into one result; `sum by (job)(x)` sums per job
- [ ] B) There is no difference
- [ ] C) `sum(x)` includes all labels; `sum by (job)(x)` removes all labels
- [ ] D) `sum(x)` is faster

<details>
<summary>Show Answer</summary>
**A)** `sum(x)` aggregates into a single time series; `sum by (job)(x)` preserves the `job` label and sums per job.
</details>

---

### Question 29 (Instrumentation & Exporters)

What is the purpose of the textfile collector in Node Exporter?

- [ ] A) To read metrics from log files
- [ ] B) To include custom metrics from scripts that write `.prom` files
- [ ] C) To collect text-based configuration
- [ ] D) To read application logs

<details>
<summary>Show Answer</summary>
**B)** The textfile collector reads `.prom` files written by cron jobs or scripts.
</details>

---

### Question 30 (Alerting)

What happens when `resolve_timeout` is reached in Alertmanager?

- [ ] A) The alert is automatically resolved
- [ ] B) The notification is re-sent
- [ ] C) The alert is deleted
- [ ] D) The Alertmanager restarts

<details>
<summary>Show Answer</summary>
**A)** If Prometheus stops sending alerts to Alertmanager, unresolved alerts are automatically resolved after `resolve_timeout` (default: 5m).
</details>

---

### Question 31 (Observability)

What is the USE method for resource monitoring?

- [ ] A) Utilization, Saturation, Errors
- [ ] B) Usage, Speed, Efficiency
- [ ] C) Uptime, Service, Events
- [ ] D) Users, Systems, Endpoints

<details>
<summary>Show Answer</summary>
**A)** USE: Utilization (saturation), Saturation (queue length), Errors (error count).
</details>

---

### Question 32 (Prometheus Fundamentals)

What does `__address__` represent in Prometheus target labels?

- [ ] A) The IP address of the Prometheus server
- [ ] B) The host:port of the target to scrape
- [ ] C) The address of the Alertmanager
- [ ] D) The address of the TSDB

<details>
<summary>Show Answer</summary>
**B)** `__address__` is automatically set to the target's host:port for scraping.
</details>

---

### Question 33 (PromQL)

What does `topk(3, node_memory_MemTotal_bytes)` return?

- [ ] A) The top 3 nodes by memory
- [ ] B) 3 time series with the highest memory values
- [ ] C) The first 3 nodes alphabetically
- [ ] D) 3 random time series

<details>
<summary>Show Answer</summary>
**B)** `topk(3, ...)` returns the 3 time series with the highest values.
</details>

---

### Question 34 (Instrumentation & Exporters)

Which client library feature is automatically registered when using Prometheus client libraries?

- [ ] A) Application-specific metrics
- [ ] B) Process and runtime metrics (CPU, memory, goroutines, etc.)
- [ ] C) Database query metrics
- [ ] D) Network request metrics

<details>
<summary>Show Answer</summary>
**B)** Client libraries automatically register process and runtime metrics (e.g., `process_cpu_seconds_total`, `go_goroutines`).
</details>

---

### Question 35 (Alerting)

What does the `match_re` directive allow in Alertmanager routing?

- [ ] A) Exact label matching
- [ ] B) Regex-based label matching
- [ ] C) Matching on metric values
- [ ] D) Matching on alert annotations

<details>
<summary>Show Answer</summary>
**B)** `match_re` applies regex pattern matching on alert labels.
</details>

---

### Question 36 (Observability)

What is the difference between white-box and black-box monitoring?

- [ ] A) White-box uses internal metrics; black-box uses external probes
- [ ] B) White-box is better than black-box
- [ ] C) White-box uses logs; black-box uses metrics
- [ ] D) There is no difference

<details>
<summary>Show Answer</summary>
**A)** White-box monitors internal metrics (e.g., application instrumentation); black-box probes externally visible behavior (e.g., HTTP health checks).
</details>

---

### Question 37 (Prometheus Fundamentals)

What is the purpose of the `scrape_configs` section in prometheus.yml?

- [ ] A) To define which metrics to scrape
- [ ] B) To define which targets and how to scrape them
- [ ] C) To configure TSDB retention
- [ ] D) To configure alerting

<details>
<summary>Show Answer</summary>
**B)** `scrape_configs` defines scrape targets, frequency, and other scraping parameters.
</details>

---

### Question 38 (PromQL)

What is the result of `count by (job) (up == 1)`?

- [ ] A) The number of up targets per job
- [ ] B) The number of total targets per job
- [ ] C) The count of targets with up=1, per job
- [ ] D) The count of targets with any status

<details>
<summary>Show Answer</summary>
**C)** It counts the number of time series where `up == 1`, grouped by job.
</details>

---

### Question 39 (Instrumentation & Exporters)

Which of the following is true about Counter metrics?

- [ ] A) They can decrease
- [ ] B) They can only increase or reset to zero
- [ ] C) They are always negative
- [ ] D) They represent instantaneous values

<details>
<summary>Show Answer</summary>
**B)** Counters are cumulative and can only increase or be reset to zero.
</details>

---

### Question 40 (Alerting)

What is the purpose of the root route in Alertmanager configuration?

- [ ] A) It is optional and only used for debug alerts
- [ ] B) It is the default route that matches all alerts if no sub-route matches
- [ ] C) It defines the Alertmanager's IP address
- [ ] D) It configures alert storage

<details>
<summary>Show Answer</summary>
**B)** The root route is the default — all alerts start here and fall back to it if no sub-route matches.
</details>

---

### Question 41 (Observability)

What is a service-level agreement (SLA)?

- [ ] A) An internal team target
- [ ] B) A formal contract between provider and customer with consequences
- [ ] C) A technical metric
- [ ] D) A performance baseline

<details>
<summary>Show Answer</summary>
**B)** An SLA is a formal agreement with customers that includes consequences for violations.
</details>

---

### Question 42 (Prometheus Fundamentals)

What is the purpose of `metric_relabel_configs`?

- [ ] A) To relabel targets before scraping
- [ ] B) To relabel metrics after scraping
- [ ] C) To relabel Alertmanager alerts
- [ ] D) To configure metric names

<details>
<summary>Show Answer</summary>
**B)** `metric_relabel_configs` applies relabeling rules to scraped metrics before storage.
</details>

---

### Question 43 (PromQL)

What does the `absent()` function return?

- [ ] A) 0 if the metric exists, 1 if it doesn't
- [ ] B) 1 if the metric is present, 0 if absent
- [ ] C) The last known value if absent
- [ ] D) The average of missing values

<details>
<summary>Show Answer</summary>
**A)** `absent()` returns 1 if the metric doesn't exist, empty otherwise.
</details>

---

### Question 44 (Instrumentation & Exporters)

How does Prometheus typically collect metrics from applications?

- [ ] A) Applications push metrics to Prometheus
- [ ] B) Prometheus pulls/scrapes metrics from applications
- [ ] C) Both A and B
- [ ] D) Metrics are sent via webhooks

<details>
<summary>Show Answer</summary>
**B)** Prometheus uses a pull model, scraping HTTP `/metrics` endpoints.
</details>

---

### Question 45 (Alerting)

What is the purpose of the `equal` field in an inhibition rule?

- [ ] A) To specify which labels must match between source and target alerts
- [ ] B) To set threshold values
- [ ] C) To configure label equality
- [ ] D) To specify metric equality

<details>
<summary>Show Answer</summary>
**A)** `equal` specifies which label values must match between source and target alerts for inhibition to apply.
</details>

---

### Question 46 (Observability)

What is the "four golden signals" of monitoring for distributed systems?

- [ ] A) CPU, Memory, Disk, Network
- [ ] B) Latency, Traffic, Errors, Saturation
- [ ] C) Availability, Performance, Capacity, Cost
- [ ] D) Rate, Errors, Duration, Saturation

<details>
<summary>Show Answer</summary>
**B)** Google SRE's four golden signals: Latency, Traffic, Errors, Saturation.
</details>

---

### Question 47 (Prometheus Fundamentals)

What does setting `scrape_timeout` higher than `scrape_interval` cause?

- [ ] A) More accurate metrics
- [ ] B) Overlapping scrapes and potential resource issues
- [ ] C) Faster metric collection
- [ ] D) No effect

<details>
<summary>Show Answer</summary>
**B)** If `scrape_timeout > scrape_interval`, a new scrape starts before the previous one finishes, causing overlap.
</details>

---

### Question 48 (PromQL)

What is the correct syntax for a negative label matcher using regular expression?

- [ ] A) `metric{label!~"regex"}`
- [ ] B) `metric{label!="regex"}`
- [ ] C) `metric{label~!"regex"}`
- [ ] D) `metric{label!=~"regex"}`

<details>
<summary>Show Answer</summary>
**A)** `!=` is for negative equality, `!~` is for negative regex matching.
</details>

---

### Question 49 (Instrumentation & Exporters)

What is the recommended way to generate metrics for cron jobs?

- [ ] A) Direct instrumentation with a server
- [ ] B) Pushgateway or textfile collector
- [ ] C) Remote write
- [ ] D) Custom exporter

<details>
<summary>Show Answer</summary>
**B)** Cron jobs are short-lived—Pushgateway or textfile collector are the recommended approaches.
</details>

---

### Question 50 (Alerting)

What does the `group_wait: 30s` setting do in Alertmanager?

- [ ] A) Waits 30 seconds before creating the alert group
- [ ] B) Waits 30 seconds to accumulate alerts before sending the first notification
- [ ] C) Waits 30 seconds between alerts in the same group
- [ ] D) Waits 30 seconds before re-sending

<details>
<summary>Show Answer</summary>
**B)** `group_wait` buffers alerts for the specified time before sending the first notification for a new group.
</details>

---

### Question 51 (Observability)

What is an error budget policy?

- [ ] A) How to spend financial budgets
- [ ] B) Rules for consuming and managing the error budget
- [ ] C) A budgeting tool for cloud costs
- [ ] D) Error tracking software

<details>
<summary>Show Answer</summary>
**B)** An error budget policy defines how the error budget is consumed and when to stop deploying.
</details>

---

### Question 52 (Prometheus Fundamentals)

What is the purpose of `sample_limit` in scrape configuration?

- [ ] A) Limits the number of samples Prometheus stores
- [ ] B) Limits the number of samples accepted per scrape
- [ ] C) Limits the number of targets
- [ ] D) Limits the number of metrics per target

<details>
<summary>Show Answer</summary>
**B)** `sample_limit` prevents a target from returning too many samples in a single scrape.
</details>

---

### Question 53 (PromQL)

What does the `stddev_over_time()` function calculate?

- [ ] A) Standard deviation of metric values over a time range
- [ ] B) Standard deviation of labels
- [ ] C) Standard deviation of metrics across targets
- [ ] D) Average of standard deviations

<details>
<summary>Show Answer</summary>
**A)** `stddev_over_time()` calculates the standard deviation of raw values over a time range.
</details>

---

### Question 54 (Instrumentation & Exporters)

What is the default port for the Redis Exporter?

- [ ] A) 6379
- [ ] B) 9121
- [ ] C) 9104
- [ ] D) 9114

<details>
<summary>Show Answer</summary>
**B)** The Redis Exporter listens on port 9121 by default.
</details>

---

### Question 55 (Alerting)

What is the purpose of the `alert_relabel_configs` option?

- [ ] A) To relabel metrics before alerting
- [ ] B) To modify alert labels before sending to Alertmanager
- [ ] C) To create alerting rules
- [ ] D) To configure alert thresholds

<details>
<summary>Show Answer</summary>
**B)** `alert_relabel_configs` modifies alert labels before they are sent to Alertmanager.
</details>

---

### Question 56 (Observability)

What does traffic measure in the four golden signals?

- [ ] A) Network bandwidth
- [ ] B) Demand on the system (e.g., requests per second)
- [ ] C) Number of users
- [ ] D) Data transfer size

<details>
<summary>Show Answer</summary>
**B)** Traffic measures the demand on the system, typically requests per second.
</details>

---

### Question 57 (Prometheus Fundamentals)

Which of the following is NOT a valid relabeling action in Prometheus?

- [ ] A) `replace`
- [ ] B) `keep`
- [ ] C) `merge`
- [ ] D) `hashmod`

<details>
<summary>Show Answer</summary>
**C)** `merge` is not a valid relabeling action. Valid actions: `replace`, `keep`, `drop`, `hashmod`, `labelmap`, `labeldrop`, `labelkeep`.
</details>

---

### Question 58 (PromQL)

What is the result of `sort_desc(sum by (instance) (rate(http_requests_total[5m])))`?

- [ ] A) Sorted list of request rates per instance, highest first
- [ ] B) Sorted list of total requests, highest first
- [ ] C) Random order of request rates
- [ ] D) Alphabetically sorted instances

<details>
<summary>Show Answer</summary>
**A)** It calculates per-second request rates per instance and sorts them in descending order.
</details>

---

### Question 59 (Instrumentation & Exporters)

What is the purpose of `params` in a scrape configuration for Blackbox Exporter?

- [ ] A) To set HTTP headers
- [ ] B) To pass query parameters (like `module`) to the probe
- [ ] C) To configure authentication
- [ ] D) To set timeouts

<details>
<summary>Show Answer</summary>
**B)** `params` in Blackbox scrape config passes the module parameter to specify the probe type (e.g., `http_2xx`).
</details>

---

### Question 60 (Alerting)

What format does the `amtool silence add` command output?

- [ ] A) The alert name
- [ ] B) The silence ID
- [ ] C) The receiver name
- [ ] D) The silence duration

<details>
<summary>Show Answer</summary>
**B)** `amtool silence add` outputs the newly created silence ID.
</details>

---

## Answer Key

| Q | Answer | Domain | Q | Answer | Domain |
|---|--------|--------|---|--------|--------|
| 1 | B | Observability | 31 | A | Observability |
| 2 | C | Fundamentals | 32 | B | Fundamentals |
| 3 | B | PromQL | 33 | B | PromQL |
| 4 | C | Instrumentation | 34 | B | Instrumentation |
| 5 | B | Alerting | 35 | B | Alerting |
| 6 | B | Observability | 36 | A | Observability |
| 7 | A | Fundamentals | 37 | B | Fundamentals |
| 8 | C | PromQL | 38 | C | PromQL |
| 9 | B | Instrumentation | 39 | B | Instrumentation |
| 10 | B | Alerting | 40 | B | Alerting |
| 11 | C | Observability | 41 | B | Observability |
| 12 | B | Fundamentals | 42 | B | Fundamentals |
| 13 | B | PromQL | 43 | A | PromQL |
| 14 | B | Instrumentation | 44 | B | Instrumentation |
| 15 | B | Alerting | 45 | A | Alerting |
| 16 | A | Observability | 46 | B | Observability |
| 17 | B | Fundamentals | 47 | B | Fundamentals |
| 18 | A | PromQL | 48 | A | PromQL |
| 19 | C | Instrumentation | 49 | B | Instrumentation |
| 20 | C | Alerting | 50 | B | Alerting |
| 21 | B | Observability | 51 | B | Observability |
| 22 | B | Fundamentals | 52 | B | Fundamentals |
| 23 | B | PromQL | 53 | A | PromQL |
| 24 | B | Instrumentation | 54 | B | Instrumentation |
| 25 | B | Alerting | 55 | B | Alerting |
| 26 | B | Observability | 56 | B | Observability |
| 27 | B | Fundamentals | 57 | C | Fundamentals |
| 28 | A | PromQL | 58 | A | PromQL |
| 29 | B | Instrumentation | 59 | B | Instrumentation |
| 30 | A | Alerting | 60 | B | Alerting |

## Score Calculation

| Score | Result |
|-------|--------|
| 42-60 (70-100%) | ✅ Pass |
| 30-41 (50-69%) | 🔄 Review weak domains |
| 0-29 (0-49%) | 📚 Study more before retaking |
