---
title: "Practice Test 1"
weight: 29
bookToc: true
---

# Practice Test 1

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

What is an SLI (Service Level Indicator)?

- [ ] A) A target value or range of values for a service level
- [ ] B) A carefully defined quantitative measure of some aspect of service level
- [ ] C) A formal agreement between service provider and customer
- [ ] D) A measure of error budget consumption

<details>
<summary>Show Answer</summary>
**B)** An SLI is a carefully defined quantitative measure of some aspect of service level (e.g., latency, error rate, throughput).
</details>

---

### Question 2 (Observability)

Which of the following are the "three pillars" of observability? (Select all that apply)

- [ ] A) Metrics
- [ ] B) Alerts
- [ ] C) Logs
- [ ] D) Traces
- [ ] E) Dashboards

<details>
<summary>Show Answer</summary>
**A, C, D)** The three pillars of observability are Metrics, Logs, and Traces.
</details>

---

### Question 3 (Prometheus Fundamentals)

What port does Prometheus use by default?

- [ ] A) 8080
- [ ] B) 9090
- [ ] C) 9100
- [ ] D) 3000

<details>
<summary>Show Answer</summary>
**B)** Prometheus listens on port 9090 by default.
</details>

---

### Question 4 (PromQL)

Which function is used to calculate the per-second average rate of change for a Counter metric?

- [ ] A) `increase()`
- [ ] B) `delta()`
- [ ] C) `rate()`
- [ ] D) `avg()`

<details>
<summary>Show Answer</summary>
**C)** `rate()` calculates the per-second average rate of increase for Counter metrics.
</details>

---

### Question 5 (Instrumentation & Exporters)

Which Node Exporter collector allows including custom metrics from scripts?

- [ ] A) systemd collector
- [ ] B) textfile collector
- [ ] C) custom collector
- [ ] D) script collector

<details>
<summary>Show Answer</summary>
**B)** The textfile collector reads `.prom` files from a directory to include custom metrics.
</details>

---

### Question 6 (Alerting)

In an alerting rule, what does the `for` clause specify?

- [ ] A) How long the alert has been firing
- [ ] B) How long the condition must be true before the alert fires
- [ ] C) How often the alert rule is evaluated
- [ ] D) How long to wait before re-sending a notification

<details>
<summary>Show Answer</summary>
**B)** The `for` clause specifies the duration the condition must be true before the alert transitions from pending to firing.
</details>

---

### Question 7 (Observability)

What is an error budget?

- [ ] A) The total number of errors a service can tolerate
- [ ] B) 1 minus the SLO target (e.g., 1 - 0.999 = 0.001 or 0.1%)
- [ ] C) The amount of money allocated for error monitoring
- [ ] D) The number of errors tracked per day

<details>
<summary>Show Answer</summary>
**B)** The error budget is 1 - SLO. It defines how much "unreliability" is acceptable.
</details>

---

### Question 8 (Prometheus Fundamentals)

What type of database does Prometheus use for storage?

- [ ] A) Relational database (PostgreSQL)
- [ ] B) Time-series database (TSDB)
- [ ] C) Document database (MongoDB)
- [ ] D) Key-value store (Redis)

<details>
<summary>Show Answer</summary>
**B)** Prometheus uses its own custom Time-Series Database (TSDB).
</details>

---

### Question 9 (PromQL)

What is the difference between `rate()` and `irate()`?

- [ ] A) `rate()` works on gauges; `irate()` works on counters
- [ ] B) `rate()` uses all data points in the range; `irate()` uses only the last two
- [ ] C) `rate()` is for instant vectors; `irate()` is for range vectors
- [ ] D) There is no difference; they are aliases

<details>
<summary>Show Answer</summary>
**B)** `rate()` computes average over all data points in the range, while `irate()` uses only the last two data points for a more instantaneous rate.
</details>

---

### Question 10 (Alerting)

Which Alertmanager feature prevents alert storms by suppressing low-severity alerts when critical ones are firing?

- [ ] A) Silences
- [ ] B) Inhibition rules
- [ ] C) Grouping
- [ ] D) Deduplication

<details>
<summary>Show Answer</summary>
**B)** Inhibition rules suppress lower-severity alerts when higher-severity alerts for the same source are firing.
</details>

---

### Question 11 (Observability)

Which of the following is an example of an SLI?

- [ ] A) "99.9% uptime"
- [ ] B) "Average response time < 200ms"
- [ ] C) "Latency p99 < 500ms over the last 5 minutes"
- [ ] D) "We will respond within 1 hour"

<details>
<summary>Show Answer</summary>
**C)** An SLI is an actual measured value, not a target or agreement.
</details>

---

### Question 12 (Prometheus Fundamentals)

What is the default retention period for Prometheus TSDB?

- [ ] A) 7 days
- [ ] B) 15 days
- [ ] C) 30 days
- [ ] D) 90 days

<details>
<summary>Show Answer</summary>
**B)** The default retention period is 15 days.
</details>

---

### Question 13 (PromQL)

Which operator would you use to find time series that exist in both the left and right vectors?

- [ ] A) `or`
- [ ] B) `and`
- [ ] C) `unless`
- [ ] D) `union`

<details>
<summary>Show Answer</summary>
**B)** The `and` operator returns the intersection of two vectors.
</details>

---

### Question 14 (Instrumentation & Exporters)

Which exporter would you use to monitor a MySQL database?

- [ ] A) Node Exporter
- [ ] B) Blackbox Exporter
- [ ] C) MySQL Exporter
- [ ] D) JMX Exporter

<details>
<summary>Show Answer</summary>
**C)** The MySQL Exporter (port 9104) is used to monitor MySQL databases.
</details>

---

### Question 15 (Alerting)

What protocol do Alertmanager instances use for clustering and gossip communication?

- [ ] A) HTTP
- [ ] B) gRPC
- [ ] C) TCP on port 9094
- [ ] D) UDP on port 9093

<details>
<summary>Show Answer</summary>
**C)** Alertmanager uses TCP on port 9094 for cluster gossip communication.
</details>

---

### Question 16 (Observability)

What does RED method stand for in monitoring?

- [ ] A) Rate, Errors, Duration
- [ ] B) Resources, Events, Data
- [ ] C) Reliability, Efficiency, Durability
- [ ] D) Requests, Errors, Duration

<details>
<summary>Show Answer</summary>
**D)** RED method: Rate (requests per second), Errors (failed requests), Duration (latency).
</details>

---

### Question 17 (Prometheus Fundamentals)

Which service discovery mechanism is built into Prometheus for Kubernetes?

- [ ] A) Consul SD
- [ ] B) Kubernetes SD
- [ ] C) DNS SD
- [ ] D) File SD

<details>
<summary>Show Answer</summary>
**B)** Prometheus has native Kubernetes service discovery built in.
</details>

---

### Question 18 (PromQL)

What does `sum by (job) (rate(http_requests_total[5m]))` do?

- [ ] A) Sums the total HTTP requests per job
- [ ] B) Calculates per-second request rate, aggregated by job
- [ ] C) Counts the number of HTTP requests per job
- [ ] D) Averages the HTTP request rate

<details>
<summary>Show Answer</summary>
**B)** It calculates the per-second request rate and sums the result by the `job` label.
</details>

---

### Question 19 (Instrumentation & Exporters)

What port does the Node Exporter listen on by default?

- [ ] A) 9090
- [ ] B) 9091
- [ ] C) 9100
- [ ] D) 9115

<details>
<summary>Show Answer</summary>
**C)** Node Exporter defaults to port 9100.
</details>

---

### Question 20 (Alerting)

In Alertmanager, what is the purpose of `group_wait`?

- [ ] A) How long to wait before sending a notification for grouped alerts
- [ ] B) How long to buffer alerts before sending the first notification for a new group
- [ ] C) How often to re-send notifications for firing alerts
- [ ] D) How long to wait for the group to be created

<details>
<summary>Show Answer</summary>
**B)** `group_wait` specifies how long to wait before sending the first notification for a new group of alerts.
</details>

---

### Question 21 (Observability)

What is the USE method focused on?

- [ ] A) Requests, Errors, Duration
- [ ] B) Utilization, Saturation, Errors
- [ ] C) Users, Services, Endpoints
- [ ] D) Uptime, Speed, Efficiency

<details>
<summary>Show Answer</summary>
**B)** USE: Utilization (how busy?), Saturation (how overloaded?), Errors (what's broken?).
</details>

---

### Question 22 (Prometheus Fundamentals)

What is the default scrape interval in Prometheus configuration?

- [ ] A) 10s
- [ ] B) 15s
- [ ] C) 30s
- [ ] D) 60s

<details>
<summary>Show Answer</summary>
**D)** The default scrape interval is 60s.
</details>

---

### Question 23 (PromQL)

Which metric type does `histogram_quantile()` require as input?

- [ ] A) Counter
- [ ] B) Gauge
- [ ] C) Histogram `_bucket` metric
- [ ] D) Summary

<details>
<summary>Show Answer</summary>
**C)** `histogram_quantile()` operates on histograms, specifically the `_bucket` suffixed metrics.
</details>

---

### Question 24 (Instrumentation & Exporters)

Which type of metrics does the Pushgateway store?

- [ ] A) Metrics from long-running services
- [ ] B) Metrics from short-lived batch jobs
- [ ] C) Metrics from network devices
- [ ] D) Metrics from databases

<details>
<summary>Show Answer</summary>
**B)** Pushgateway is designed for short-lived batch jobs.
</details>

---

### Question 25 (Alerting)

What does the `repeat_interval` setting control in Alertmanager?

- [ ] A) How often to re-evaluate alert rules
- [ ] B) How often to re-send notifications for still-firing alerts
- [ ] C) How often to check for expired silences
- [ ] D) How often to attempt failed notification delivery

<details>
<summary>Show Answer</summary>
**B)** `repeat_interval` controls how often notifications are re-sent for alerts that continue to fire.
</details>

---

### Question 26 (Observability)

What is the difference between monitoring and observability?

- [ ] A) They are the same thing
- [ ] B) Monitoring tells you what's broken; observability lets you ask why
- [ ] C) Monitoring uses metrics; observability uses logs
- [ ] D) Observability is only for distributed systems

<details>
<summary>Show Answer</summary>
**B)** Monitoring tells you the system state; observability enables you to understand the internal state from external outputs.
</details>

---

### Question 27 (Prometheus Fundamentals)

What is the function of relabeling in Prometheus?

- [ ] A) To modify metric values before scraping
- [ ] B) To modify or filter labels on targets or metrics
- [ ] C) To rename metric names
- [ ] D) To aggregate time series

<details>
<summary>Show Answer</summary>
**B)** Relabeling modifies or filters labels on targets (before scrape) or metrics (after scrape).
</details>

---

### Question 28 (PromQL)

What is the result of `1 + 2 * 3` in PromQL?

- [ ] A) 7
- [ ] B) 9
- [ ] C) 6
- [ ] D) 5

<details>
<summary>Show Answer</summary>
**A)** 7 — multiplication has higher precedence than addition.
</details>

---

### Question 29 (Instrumentation & Exporters)

Which of the following would be inappropriate to use with the Pushgateway?

- [ ] A) A CI/CD build job
- [ ] B) A cron job that runs hourly
- [ ] C) A long-running web service
- [ ] D) A data processing batch job

<details>
<summary>Show Answer</summary>
**C)** Long-running services should be instrumented directly and scraped, not pushed to Pushgateway.
</details>

---

### Question 30 (Alerting)

What is a "dead man's switch" alert?

- [ ] A) An alert that never fires
- [ ] B) An alert for missing data or expected metrics
- [ ] C) An alert for high latency
- [ ] D) An alert for when a team member is on leave

<details>
<summary>Show Answer</summary>
**B)** A dead man's switch fires when expected metrics are absent (e.g., `absent(up{job="critical"})`).
</details>

---

### Question 31 (Observability)

What is a burn rate in SRE context?

- [ ] A) How fast the error budget is being consumed
- [ ] B) The rate of CPU usage
- [ ] C) How fast alerts are generated
- [ ] D) The rate of service requests

<details>
<summary>Show Answer</summary>
**A)** Burn rate measures how quickly the error budget is being consumed relative to its total.
</details>

---

### Question 32 (Prometheus Fundamentals)

What is the purpose of `__metrics_path__`?

- [ ] A) The path to the rule files
- [ ] B) The HTTP path to scrape metrics from (default: `/metrics`)
- [ ] C) The path to the storage directory
- [ ] D) The path to the configuration file

<details>
<summary>Show Answer</summary>
**B)** `__metrics_path__` is the HTTP path used for scraping, defaulting to `/metrics`.
</details>

---

### Question 33 (PromQL)

How do you select all metrics except those with a specific label value?

- [ ] A) `metric{label!="value"}`
- [ ] B) `metric{label~="value"}`
- [ ] C) `metric{label=!"value"}`
- [ ] D) `metric{label!=~"value"}`

<details>
<summary>Show Answer</summary>
**A)** `!=` is the negative equality matcher.
</details>

---

### Question 34 (Instrumentation & Exporters)

What does the Blackbox Exporter check when using the `icmp` module?

- [ ] A) HTTP status codes
- [ ] B) TCP port availability
- [ ] C) Host reachability via ping
- [ ] D) SSL certificate expiry

<details>
<summary>Show Answer</summary>
**C)** The `icmp` module checks host reachability via ping (ICMP echo).
</details>

---

### Question 35 (Alerting)

What must you configure in Prometheus to enable alerting?

- [ ] A) `alerting` section pointing to Alertmanager(s)
- [ ] B) `alerts` section with rule files
- [ ] C) `notification` section
- [ ] D) `receivers` section

<details>
<summary>Show Answer</summary>
**A)** The `alerting` section in prometheus.yml configures Alertmanager endpoints.
</details>

---

### Question 36 (Observability)

What is a cardinality problem in Prometheus?

- [ ] A) Too many metrics being collected
- [ ] B) Too many unique label combinations for a metric
- [ ] C) Too many alerts firing
- [ ] D) Too many Prometheus servers

<details>
<summary>Show Answer</summary>
**B)** High cardinality means too many unique label combinations, which causes memory and performance issues.
</details>

---

### Question 37 (Prometheus Fundamentals)

How does Prometheus handle counter resets?

- [ ] A) It cannot handle counter resets
- [ ] B) It ignores the reset and continues from zero
- [ ] C) Functions like `rate()` and `increase()` automatically handle resets
- [ ] D) It requires a relabeling rule to handle resets

<details>
<summary>Show Answer</summary>
**C)** Both `rate()` and `increase()` automatically handle counter resets by detecting decreases and adjusting the calculation.
</details>

---

### Question 38 (PromQL)

What is the correct syntax for a subquery in PromQL?

- [ ] A) `metric[5m:1m]`
- [ ] B) `metric{5m:1m}`
- [ ] C) `metric:5m:1m`
- [ ] D) `metric[5m][1m]`

<details>
<summary>Show Answer</summary>
**A)** Subquery syntax: `<instant_query>[<range>:<resolution>]`
</details>

---

### Question 39 (Instrumentation & Exporters)

Which label should you avoid adding to a Prometheus metric?

- [ ] A) `status`
- [ ] B) `method`
- [ ] C) `user_id`
- [ ] D) `endpoint`

<details>
<summary>Show Answer</summary>
**C)** `user_id` is high cardinality — user IDs can reach millions of unique values.
</details>

---

### Question 40 (Alerting)

What is the recommended naming convention for recording rules?

- [ ] A) `metric:level:operation`
- [ ] B) `level:metric:operation`
- [ ] C) `operation:metric:level`
- [ ] D) `level:operation:metric`

<details>
<summary>Show Answer</summary>
**B)** The recommended format is `level:metric:operation`, e.g., `instance:node_cpu:avg_rate5m`.
</details>

---

### Question 41 (Observability)

What does "four golden signals" refer to?

- [ ] A) Latency, Traffic, Errors, Saturation
- [ ] B) CPU, Memory, Disk, Network
- [ ] C) Availability, Performance, Capacity, Cost
- [ ] D) Rate, Errors, Duration, Saturation

<details>
<summary>Show Answer</summary>
**A)** Google's four golden signals: Latency, Traffic, Errors, Saturation.
</details>

---

### Question 42 (Prometheus Fundamentals)

What is the purpose of `honor_labels` in scrape configuration?

- [ ] A) To honor the metric name from the target
- [ ] B) To preserve labels already set in the scraped data
- [ ] C) To ignore all labels from the target
- [ ] D) To add labels from the scrape config

<details>
<summary>Show Answer</summary>
**B)** When `honor_labels: true`, Prometheus preserves labels from the scraped target instead of overwriting them.
</details>

---

### Question 43 (PromQL)

Which PromQL function would you use to predict future disk usage?

- [ ] A) `rate()`
- [ ] B) `delta()`
- [ ] C) `predict_linear()`
- [ ] D) `deriv()`

<details>
<summary>Show Answer</summary>
**C)** `predict_linear()` predicts future values based on linear regression.
</details>

---

### Question 44 (Instrumentation & Exporters)

What is the primary use case for the JMX Exporter?

- [ ] A) Monitoring network devices
- [ ] B) Monitoring Java applications
- [ ] C) Monitoring Linux systems
- [ ] D) Monitoring web endpoints

<details>
<summary>Show Answer</summary>
**B)** The JMX Exporter monitors Java/JVM applications by exposing MBean attributes as Prometheus metrics.
</details>

---

### Question 45 (Alerting)

What is the default `repeat_interval` in Alertmanager?

- [ ] A) 1h
- [ ] B) 4h
- [ ] C) 6h
- [ ] D) 24h

<details>
<summary>Show Answer</summary>
**B)** The default `repeat_interval` is 4 hours.
</details>

---

### Question 46 (Observability)

What is a multi-SLO service?

- [ ] A) A service with multiple SLIs
- [ ] B) A service with multiple targets for different dimensions (e.g., latency AND availability)
- [ ] C) A service with multiple error budgets
- [ ] D) A service with multiple customers

<details>
<summary>Show Answer</summary>
**B)** Multi-SLO services have SLO targets for different dimensions (e.g., availability, latency, durability).
</details>

---

### Question 47 (Prometheus Fundamentals)

What does the `__scheme__` label control?

- [ ] A) The port number for scraping
- [ ] B) Whether to use HTTP or HTTPS for scraping
- [ ] C) The metric naming scheme
- [ ] D) The authentication scheme

<details>
<summary>Show Answer</summary>
**B)** `__scheme__` controls whether scraping uses HTTP or HTTPS.
</details>

---

### Question 48 (PromQL)

What does the `bool` modifier do in a comparison operation?

- [ ] A) Filters out results that don't match
- [ ] B) Returns 1 (true) or 0 (false) instead of filtering
- [ ] C) Returns a boolean vector
- [ ] D) Casts values to boolean type

<details>
<summary>Show Answer</summary>
**B)** `bool` modifier makes comparisons return 0 or 1 instead of filtering the result set.
</details>

---

### Question 49 (Instrumentation & Exporters)

Which Blackbox Exporter module would you use to check if a TCP port is open?

- [ ] A) `http_2xx`
- [ ] B) `tcp_connect`
- [ ] C) `icmp_check`
- [ ] D) `port_check`

<details>
<summary>Show Answer</summary>
**B)** The `tcp_connect` module checks TCP port availability.
</details>

---

### Question 50 (Alerting)

How do you pause alert notifications for a planned maintenance window?

- [ ] A) Modify alerting rules
- [ ] B) Create a silence in Alertmanager
- [ ] C) Stop the Alertmanager service
- [ ] D) Remove the scrape target

<details>
<summary>Show Answer</summary>
**B)** Create a silence in Alertmanager for the duration of the maintenance window.
</details>

---

### Question 51 (Observability)

What is the relationship between SLO and error budget?

- [ ] A) Error budget = SLO target
- [ ] B) Error budget = 1 - SLO target
- [ ] C) Error budget = SLI / SLO
- [ ] D) Error budget = SLO - SLI

<details>
<summary>Show Answer</summary>
**B)** Error budget = 1 - SLO target (e.g., 99.9% SLO = 0.1% error budget).
</details>

---

### Question 52 (Prometheus Fundamentals)

What is the maximum time range for `rate()` function?

- [ ] A) It depends on the metric
- [ ] B) The scrape interval multiplied by 2
- [ ] C) It depends on retention settings
- [ ] D) There's no hard limit

<details>
<summary>Show Answer</summary>
**D)** There's no hard limit, but practical limits are determined by available data and memory.
</details>

---

### Question 53 (PromQL)

What is the result of `up unless up{job="node"}`?

- [ ] A) All `up` metrics
- [ ] B) All `up` metrics except those with `job="node"`
- [ ] C) Only `up` metrics with `job="node"`
- [ ] D) An empty result

<details>
<summary>Show Answer</summary>
**B)** `unless` returns left-side elements that are not present in the right-side set.
</details>

---

### Question 54 (Instrumentation & Exporters)

Which metric type would you use to track the number of active connections to a database?

- [ ] A) Counter
- [ ] B) Gauge
- [ ] C) Histogram
- [ ] D) Summary

<details>
<summary>Show Answer</summary>
**B)** Gauge — active connections can go up and down.
</details>

---

### Question 55 (Alerting)

What is the purpose of the `group_by` setting in Alertmanager?

- [ ] A) To group alerts by severity
- [ ] B) To group alerts by the specified labels for notification bundling
- [ ] C) To group alerts by receiver
- [ ] D) To group alerts by time

<details>
<summary>Show Answer</summary>
**B)** `group_by` specifies which labels to group alerts by for bundling notifications.
</details>

---

### Question 56 (Observability)

What does "white-box monitoring" mean?

- [ ] A) Monitoring based on external probes
- [ ] B) Monitoring based on internal metrics exposed by the system
- [ ] C) Monitoring using only built-in tools
- [ ] D) Monitoring with no configuration

<details>
<summary>Show Answer</summary>
**B)** White-box monitoring uses internal metrics exposed by the system (e.g., application instrumentation).
</details>

---

### Question 57 (Prometheus Fundamentals)

Where are rule files specified in Prometheus configuration?

- [ ] A) In the `scrape_configs` section
- [ ] B) In the `rule_files` section
- [ ] C) In the `alerting` section
- [ ] D) In the `storage` section

<details>
<summary>Show Answer</summary>
**B)** Rule files are specified in the `rule_files` section of prometheus.yml.
</details>

---

### Question 58 (PromQL)

What does the `group_left` modifier do in vector matching?

- [ ] A) Groups results by left-side labels
- [ ] B) Allows many-to-one matching where the left side has more elements
- [ ] C) Discards left-side labels
- [ ] D) Performs a left join

<details>
<summary>Show Answer</summary>
**B)** `group_left` enables many-to-one matching when the left vector has more labels/elements.
</details>

---

### Question 59 (Instrumentation & Exporters)

What is the purpose of the `honor_labels: true` setting when scraping the Pushgateway?

- [ ] A) To preserve job/instance labels from pushed metrics
- [ ] B) To override pushed labels with scrape config labels
- [ ] C) To honor the Pushgateway's TLS settings
- [ ] D) To honor the default scrape port

<details>
<summary>Show Answer</summary>
**A)** When scraping Pushgateway, `honor_labels: true` preserves the job and instance labels set by batch jobs.
</details>

---

### Question 60 (Alerting)

Which tool validates alerting rules before deployment?

- [ ] A) `promtool`
- [ ] B) `amtool`
- [ ] C) `alertmanagerctl`
- [ ] D) `promcheck`

<details>
<summary>Show Answer</summary>
**A)** `promtool check rules` validates alerting and recording rule files.
</details>

---

## Answer Key

| Q | Answer | Domain | Q | Answer | Domain |
|---|--------|--------|---|--------|--------|
| 1 | B | Observability | 31 | A | Observability |
| 2 | A,C,D | Observability | 32 | B | Fundamentals |
| 3 | B | Fundamentals | 33 | A | PromQL |
| 4 | C | PromQL | 34 | C | Instrumentation |
| 5 | B | Instrumentation | 35 | A | Alerting |
| 6 | B | Alerting | 36 | B | Observability |
| 7 | B | Observability | 37 | C | Fundamentals |
| 8 | B | Fundamentals | 38 | A | PromQL |
| 9 | B | PromQL | 39 | C | Instrumentation |
| 10 | B | Alerting | 40 | B | Alerting |
| 11 | C | Observability | 41 | A | Observability |
| 12 | B | Fundamentals | 42 | B | Fundamentals |
| 13 | B | PromQL | 43 | C | PromQL |
| 14 | C | Instrumentation | 44 | B | Instrumentation |
| 15 | C | Alerting | 45 | B | Alerting |
| 16 | D | Observability | 46 | B | Observability |
| 17 | B | Fundamentals | 47 | B | Fundamentals |
| 18 | B | PromQL | 48 | B | PromQL |
| 19 | C | Instrumentation | 49 | B | Instrumentation |
| 20 | B | Alerting | 50 | B | Alerting |
| 21 | B | Observability | 51 | B | Observability |
| 22 | D | Fundamentals | 52 | D | Fundamentals |
| 23 | C | PromQL | 53 | B | PromQL |
| 24 | B | Instrumentation | 54 | B | Instrumentation |
| 25 | B | Alerting | 55 | B | Alerting |
| 26 | B | Observability | 56 | B | Observability |
| 27 | B | Fundamentals | 57 | B | Fundamentals |
| 28 | A | PromQL | 58 | B | PromQL |
| 29 | C | Instrumentation | 59 | A | Instrumentation |
| 30 | B | Alerting | 60 | A | Alerting |

## Score Calculation

| Score | Result |
|-------|--------|
| 42-60 (70-100%) | ✅ Pass |
| 30-41 (50-69%) | 🔄 Review weak domains |
| 0-29 (0-49%) | 📚 Study more before retaking |
