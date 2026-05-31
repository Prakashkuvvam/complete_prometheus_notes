---
title: "Practice Test 5"
weight: 33
bookToc: true
---

# Practice Test 5

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

What is a key difference between monitoring and observability?

- [ ] A) Monitoring requires dashboards; observability requires alerts
- [ ] B) Monitoring is for known failures; observability helps discover unknown unknowns
- [ ] C) Monitoring is pull-based; observability is push-based
- [ ] D) They are synonyms

<details>
<summary>Show Answer</summary>
**B)** Monitoring validates known failure modes; observability helps understand unknown issues.
</details>

---

### Question 2 (Prometheus Fundamentals)

What does the term "dimensionality" refer to in Prometheus data model?

- [ ] A) The number of metrics collected
- [ ] B) The number of label dimensions per metric
- [ ] C) The dimension of the storage
- [ ] D) The time dimension

<details>
<summary>Show Answer</summary>
**B)** Dimensionality refers to the number of label key-value pairs that identify a time series.
</details>

---

### Question 3 (PromQL)

What does `rate(node_cpu_seconds_total[5m])` return when the target has been up for exactly 5 minutes?

- [ ] A) Total CPU seconds used
- [ ] B) Per-second rate of CPU time accumulation
- [ ] C) CPU percentage
- [ ] D) Instantaneous CPU time

<details>
<summary>Show Answer</summary>
**B)** `rate()` returns the per-second average rate of increase across all matching time series.
</details>

---

### Question 4 (Instrumentation & Exporters)

Which exporter would you use to monitor HAProxy load balancers?

- [ ] A) HAProxy Exporter
- [ ] B) Node Exporter
- [ ] C) Blackbox Exporter
- [ ] D) SNMP Exporter

<details>
<summary>Show Answer</summary>
**A)** The HAProxy Exporter exposes HAProxy metrics on port 9101 by default.
</details>

---

### Question 5 (Alerting)

What is the purpose of the `# TYPE` comment in Prometheus metric exposition format?

- [ ] A) It's optional documentation
- [ ] B) It declares the metric type (counter, gauge, histogram, summary)
- [ ] C) It sets the metric unit
- [ ] D) It's ignored by Prometheus

<details>
<summary>Show Answer</summary>
**B)** The `# TYPE` line declares the metric type for the Prometheus parser.
</details>

---

### Question 6 (Observability)

What is a good SLI for a user-facing web application?

- [ ] A) Number of database connections
- [ ] B) HTTP request latency at 99th percentile
- [ ] C) Number of background jobs
- [ ] D) CPU temperature

<details>
<summary>Show Answer</summary>
**B)** Request latency at high percentiles is directly meaningful to users.
</details>

---

### Question 7 (Prometheus Fundamentals)

What is the relationship between time series cardinality and Prometheus memory usage?

- [ ] A) No relationship
- [ ] B) Linear relationship — more time series = more memory
- [ ] C) Inverse relationship
- [ ] D) Logarithmic relationship

<details>
<summary>Show Answer</summary>
**B)** Memory usage grows linearly with the number of active time series.
</details>

---

### Question 8 (PromQL)

What does `sum without (instance, job) (rate(http_requests_total[5m]))` return?

- [ ] A) Total request rate, removing instance and job labels
- [ ] B) Request rate aggregated by all labels except instance and job
- [ ] C) Request rate per instance
- [ ] D) Total request count

<details>
<summary>Show Answer</summary>
**B)** It sums the request rate, grouping by all labels except `instance` and `job`.
</details>

---

### Question 9 (Instrumentation & Exporters)

What is the default port for the Consul Exporter?

- [ ] A) 8500
- [ ] B) 9107
- [ ] C) 9114
- [ ] D) 9121

<details>
<summary>Show Answer</summary>
**B)** The Consul Exporter defaults to port 9107.
</details>

---

### Question 10 (Alerting)

What is the purpose of `group_interval: 5m` in Alertmanager?

- [ ] A) Wait 5 minutes before sending first notification
- [ ] B) Wait 5 minutes before sending new alerts for an existing group
- [ ] C) Send notifications every 5 minutes
- [ ] D) Wait 5 minutes before grouping

<details>
<summary>Show Answer</summary>
**B)** `group_interval` controls how long to wait before sending new alerts that were added to an existing group.
</details>

---

### Question 11 (Observability)

What is "observability-driven development"?

- [ ] A) Building features with built-in observability from the start
- [ ] B) Adding observability after deployment
- [ ] C) Using observability tools during development
- [ ] D) Testing with observability data

<details>
<summary>Show Answer</summary>
**A)** ODD means designing applications to be observable from the beginning, not retrofitting.
</details>

---

### Question 12 (Prometheus Fundamentals)

What is the purpose of the `--storage.tsdb.retention.size` flag?

- [ ] A) Maximum time to retain data
- [ ] B) Maximum storage size for TSDB
- [ ] C) Minimum storage size
- [ ] D) Block size for storage

<details>
<summary>Show Answer</summary>
**B)** It sets a maximum byte size for TSDB storage; oldest data is deleted when exceeded.
</details>

---

### Question 13 (PromQL)

What does `count by (status_class) (rate(http_requests_total[5m]))` count?

- [ ] A) Number of requests per status class
- [ ] B) Number of time series per status_class label value
- [ ] C) Number of status classes
- [ ] D) Total request rate per status class

<details>
<summary>Show Answer</summary>
**B)** `count` counts the number of time series in each group, not the values.
</details>

---

### Question 14 (Instrumentation & Exporters)

What metric would you use to track the number of goroutines in a Go application?

- [ ] A) `process_cpu_seconds_total`
- [ ] B) `go_goroutines`
- [ ] C) `go_threads`
- [ ] D) `process_open_fds`

<details>
<summary>Show Answer</summary>
**B)** `go_goroutines` is automatically registered by the Go client library.
</details>

---

### Question 15 (Alerting)

What is the main advantage of Alertmanager clustering?

- [ ] A) Load balancing alert processing
- [ ] B) Deduplicated notifications — alerts are only sent once per cluster
- [ ] C) Faster alert evaluation
- [ ] D) More storage for alert history

<details>
<summary>Show Answer</summary>
**B)** Clustering ensures that firing alerts produce only one notification across the cluster.
</details>

---

### Question 16 (Observability)

What is a common pitfall when defining SLIs?

- [ ] A) Measuring what's easy instead of what's meaningful
- [ ] B) Using too many metrics
- [ ] C) Measuring too often
- [ ] D) Using automated tools

<details>
<summary>Show Answer</summary>
**A)** A common mistake is measuring what's technically easy rather than what matters to users.
</details>

---

### Question 17 (Prometheus Fundamentals)

What does the `drop` relabeling action do when applied to targets?

- [ ] A) Removes metrics that don't match
- [ ] B) Removes the target from scraping
- [ ] C) Removes labels from targets
- [ ] D) Removes targets that match the source label regex

<details>
<summary>Show Answer</summary>
**D)** `drop` removes targets if the source label matches the specified regex.
</details>

---

### Question 18 (PromQL)

What does `rate(node_cpu_seconds_total[5m])` return for a counter that was reset 3 times?

- [ ] A) An error
- [ ] B) The correct rate adjusted for resets
- [ ] C) A rate of 0
- [ ] D) The raw rate including resets

<details>
<summary>Show Answer</summary>
**B)** `rate()` automatically handles counter resets and returns the correct average rate.
</details>

---

### Question 19 (Instrumentation & Exporters)

What does the `node_boot_time_seconds` metric represent?

- [ ] A) How long the system has been running
- [ ] B) Unix timestamp of the last system boot
- [ ] C) Time until next boot
- [ ] D) Number of reboots

<details>
<summary>Show Answer</summary>
**B)** `node_boot_time_seconds` is the Unix timestamp when the system was booted.
</details>

---

### Question 20 (Alerting)

What is the purpose of the `slack_configs` `title` field?

- [ ] A) To set the Slack channel name
- [ ] B) To set the title of the Slack notification
- [ ] C) To set the Slack webhook URL
- [ ] D) To set the notification icon

<details>
<summary>Show Answer</summary>
**B)** The `title` field sets the notification message title in Slack.
</details>

---

### Question 21 (Observability)

What does saturation look like for a CPU resource?

- [ ] A) High CPU usage percentage
- [ ] B) CPU run queue length (processes waiting)
- [ ] C) Number of cores
- [ ] D) CPU temperature

<details>
<summary>Show Answer</summary>
**B)** Saturation is measured by the run queue length — processes waiting for CPU time.
</details>

---

### Question 22 (Prometheus Fundamentals)

What is the purpose of the `params` field in scrape configuration?

- [ ] A) To set HTTP request parameters
- [ ] B) To pass URL query parameters during scrape requests
- [ ] C) To configure metric parameters
- [ ] D) To set alert parameters

<details>
<summary>Show Answer</summary>
**B)** `params` specifies URL query parameters sent with the scrape request.
</details>

---

### Question 23 (PromQL)

What does `avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m]))` show?

- [ ] A) Total idle CPU time
- [ ] B) Average per-second idle CPU rate per instance
- [ ] C) CPU idle percentage
- [ ] D) Idle CPU counter

<details>
<summary>Show Answer</summary>
**B)** It calculates the average per-second rate of idle CPU time, grouped by instance.
</details>

---

### Question 24 (Instrumentation & Exporters)

What is the purpose of the `--collector.textfile.directory` flag?

- [ ] A) To collect text metrics from log files
- [ ] B) To specify a directory for custom metric `.prom` files
- [ ] C) To configure Node Exporter's log file location
- [ ] D) To set the output directory for exported metrics

<details>
<summary>Show Answer</summary>
**B)** It tells Node Exporter where to find `.prom` files containing custom metrics.
</details>

---

### Question 25 (Alerting)

What is the purpose of `email_configs` `headers` field?

- [ ] A) To set email recipients
- [ ] B) To set custom email headers (subject, from, etc.)
- [ ] C) To add HTTP headers
- [ ] D) To configure SMTP headers

<details>
<summary>Show Answer</summary>
**B)** The `headers` field allows setting custom email headers like subject, from, etc.
</details>

---

### Question 26 (Observability)

What is a "SLI" for a database service?

- [ ] A) Number of tables
- [ ] B) Query latency at the 99th percentile
- [ ] C) Database size
- [ ] D) Number of indexes

<details>
<summary>Show Answer</summary>
**B)** Query latency is a user-meaningful SLI for databases.
</details>

---

### Question 27 (Prometheus Fundamentals)

What does the `__meta_` prefix indicate in Prometheus labels?

- [ ] A) Internal Prometheus labels
- [ ] B) Metadata labels from service discovery
- [ ] C) Metric metadata
- [ ] D) Meta labels for alerts

<details>
<summary>Show Answer</summary>
**B)** Labels with `__meta_` prefix come from service discovery mechanisms.
</details>

---

### Question 28 (PromQL)

What does `timestamp(up)` return?

- [ ] A) The current timestamp
- [ ] B) The timestamp of the most recent data point per time series
- [ ] C) The timestamp of the next scrape
- [ ] D) The timestamp of the last alert

<details>
<summary>Show Answer</summary>
**B)** `timestamp()` returns the Unix timestamp of the most recent sample for each time series.
</details>

---

### Question 29 (Instrumentation & Exporters)

What does the `probe_http_status_code` metric return?

- [ ] A) The HTTP status code from the probed endpoint
- [ ] B) The probe's own HTTP status
- [ ] C) The SSL certificate status
- [ ] D) The DNS status

<details>
<summary>Show Answer</summary>
**A)** It returns the HTTP status code received from the probed endpoint (e.g., 200, 404).
</details>

---

### Question 30 (Alerting)

What is the purpose of the `repeat_interval` in Alertmanager routes?

- [ ] A) How often to repeat the same alert
- [ ] B) How often to re-send notifications for still-firing alerts
- [ ] C) How often to repeat the route
- [ ] D) How often to repeat the grouping

<details>
<summary>Show Answer</summary>
**B)** `repeat_interval` controls the frequency of re-sending notifications for alerts that continue firing.
</details>

---

### Question 31 (Observability)

What is the relationship between reliability and user satisfaction?

- [ ] A) Linear — more reliability always means more satisfaction
- [ ] B) Logarithmic — increasing reliability gets harder as you approach 100%
- [ ] C) Inverse — less reliability means more satisfaction
- [ ] D) No relationship

<details>
<summary>Show Answer</summary>
**B)** Reliability follows diminishing returns — going from 99.99% to 99.999% is exponentially harder.
</details>

---

### Question 32 (Prometheus Fundamentals)

What is the purpose of the `--web.route-prefix` flag in Prometheus?

- [ ] A) To set the URL prefix for the Prometheus web UI
- [ ] B) To configure routing rules
- [ ] C) To set the API prefix
- [ ] D) To configure proxy routes

<details>
<summary>Show Answer</summary>
**A)** It sets the web UI URL prefix (e.g., `--web.route-prefix=/prometheus`).
</details>

---

### Question 33 (PromQL)

What does `absent(up{job="critical"})` return when the target is being scraped successfully?

- [ ] A) 0
- [ ] B) Nothing (empty result)
- [ ] C) 1
- [ ] D) The value of up

<details>
<summary>Show Answer</summary>
**B)** `absent()` returns empty when the metric exists. It only returns 1 when the metric is missing.
</details>

---

### Question 34 (Instrumentation & Exporters)

What does the RabbitMQ exporter monitor?

- [ ] A) RabbitMQ data contents
- [ ] B) RabbitMQ queues, connections, and channels
- [ ] C) RabbitMQ user details
- [ ] D) RabbitMQ logs

<details>
<summary>Show Answer</summary>
**B)** The RabbitMQ exporter monitors queue depth, connection count, channel count, and message rates.
</details>

---

### Question 35 (Alerting)

How do you configure Alertmanager to send notifications only during business hours?

- [ ] A) Use time-based routing in Alertmanager
- [ ] B) Cannot be done in Alertmanager — use external tools
- [ ] C) Use Prometheus alerting rules with time functions
- [ ] D) Configure Alertmanager to pause during off-hours

<details>
<summary>Show Answer</summary>
**C)** Prometheus alert rules can include time conditions: `up == 0 and on() hour() >= 9 and on() hour() < 17`.
</details>

---

### Question 36 (Observability)

What is the key advantage of using percentiles for latency SLIs?

- [ ] A) They show the maximum possible latency
- [ ] B) They show the worst-case latency a portion of users experience
- [ ] C) They show average user experience
- [ ] D) They show the minimum latency

<details>
<summary>Show Answer</summary>
**B)** Percentiles (especially p95, p99) reveal the latency experienced by the slowest users.
</details>

---

### Question 37 (Prometheus Fundamentals)

What is the effect of `--storage.tsdb.retention.time=30d`?

- [ ] A) Store all data for 30 days
- [ ] B) Delete data older than 30 days
- [ ] C) Keep at most 30 days of data
- [ ] D) Keep exactly 30 days of data

<details>
<summary>Show Answer</summary>
**C)** Data older than 30 days is deleted after each compaction cycle.
</details>

---

### Question 38 (PromQL)

What does `histogram_quantile(0.95, rate(http_duration_seconds_bucket[5m]))` return when `_bucket` metrics are missing?

- [ ] A) An error
- [ ] B) Nothing (empty result)
- [ ] C) 0
- [ ] D) Infinity

<details>
<summary>Show Answer</summary>
**B)** `histogram_quantile()` returns empty if there are no input time series.
</details>

---

### Question 39 (Instrumentation & Exporters)

What does the `node_network_transmit_bytes_total` metric measure?

- [ ] A) Current network transmit speed
- [ ] B) Total bytes transmitted since boot
- [ ] C) Number of packets transmitted
- [ ] D) Network interface MTU

<details>
<summary>Show Answer</summary>
**B)** It's a counter of total bytes transmitted over the network interface.
</details>

---

### Question 40 (Alerting)

What is the purpose of `pushover_configs` in Alertmanager?

- [ ] A) To send push notifications to mobile devices via Pushover
- [ ] B) To configure the Pushgateway
- [ ] C) To push metrics
- [ ] D) To configure alert pushing

<details>
<summary>Show Answer</summary>
**A)** Pushover receiver sends push notifications to mobile phones.
</details>

---

### Question 41 (Observability)

What is "observability debt"?

- [ ] A) Technical debt caused by insufficient observability
- [ ] B) Money owed for monitoring tools
- [ ] C) Missing documentation
- [ ] D) Time spent on monitoring

<details>
<summary>Show Answer</summary>
**A)** Observability debt accumulates when systems lack proper monitoring, making debugging harder.
</details>

---

### Question 42 (Prometheus Fundamentals)

What does `scrape_timeout: 10s` mean when paired with `scrape_interval: 15s`?

- [ ] A) Scrapes take 10 seconds and happen every 15 seconds
- [ ] B) Prometheus waits 10 seconds for a scrape response, retries after 15 seconds
- [ ] C) If a scrape doesn't complete in 10 seconds, it's aborted
- [ ] D) Scrapes happen every 10 seconds for 15 seconds

<details>
<summary>Show Answer</summary>
**C)** `scrape_timeout` is the maximum wait for a scrape to complete before aborting.
</details>

---

### Question 43 (PromQL)

What does `stdvar_over_time(process_resident_memory_bytes[1h])` calculate?

- [ ] A) Standard variance over 1 hour
- [ ] B) Standard deviation over 1 hour
- [ ] C) Average over 1 hour
- [ ] D) Variance of labels

<details>
<summary>Show Answer</summary>
**A)** `stdvar_over_time()` calculates the population variance of values in the time range.
</details>

---

### Question 44 (Instrumentation & Exporters)

What is the purpse of the `--log.level` flag in Prometheus components?

- [ ] A) To set the logging output file
- [ ] B) To set the logging verbosity level (debug, info, warn, error)
- [ ] C) To configure log rotation
- [ ] D) To set log format

<details>
<summary>Show Answer</summary>
**B)** `--log.level` controls the minimum log level to output.
</details>

---

### Question 45 (Alerting)

What is the recommended `repeat_interval` for critical alerts?

- [ ] A) 30m to 1h
- [ ] B) 4h (default)
- [ ] C) 24h
- [ ] D) Never repeat

<details>
<summary>Show Answer</summary>
**A)** Critical alerts should repeat more frequently (30m-1h); non-critical can use the default 4h.
</details>

---

### Question 46 (Observability)

What is a common metric for measuring throughput?

- [ ] A) Requests per second
- [ ] B) Response time
- [ ] C) Error rate
- [ ] D) CPU usage

<details>
<summary>Show Answer</summary>
**A)** Throughput (or traffic) is typically measured in requests per second.
</details>

---

### Question 47 (Prometheus Fundamentals)

What is the purpose of `--query.lookback-delta` flag?

- [ ] A) How far back to look for metrics
- [ ] B) Maximum time for queries
- [ ] C) Minimum interval for offset queries
- [ ] D) How long to cache query results

<details>
<summary>Show Answer</summary>
**C)** `--query.lookback-delta` sets the maximum lookback duration for instant queries (default: 5m).
</details>

---

### Question 48 (PromQL)

What is the result of `topk(0, up)`?

- [ ] A) Error — k must be >= 1
- [ ] B) Nothing (empty result)
- [ ] C) All up metrics
- [ ] D) Top 0 returns nothing

<details>
<summary>Show Answer</summary>
**A)** `topk()` requires k >= 1. k=0 returns an error.
</details>

---

### Question 49 (Instrumentation & Exporters)

What is the purpose of the `# HELP` comment in Prometheus exposition format?

- [ ] A) Required documentation line
- [ ] B) Provides a human-readable description of the metric
- [ ] C) Sets the metric value
- [ ] D) Defines the metric type

<details>
<summary>Show Answer</summary>
**B)** `# HELP` provides a human-readable description for the metric.
</details>

---

### Question 50 (Alerting)

What is the default Alertmanager web interface port?

- [ ] A) 9090
- [ ] B) 9093
- [ ] C) 9094
- [ ] D) 3000

<details>
<summary>Show Answer</summary>
**B)** Alertmanager's web UI listens on port 9093.
</details>

---

### Question 51 (Observability)

What is the "Google SRE golden rule" for SLOs?

- [ ] A) All services must have 99.999% SLO
- [ ] B) Only SLOs that would trigger an engineering response are worth defining
- [ ] C) SLOs must be customer-facing
- [ ] D) SLOs should be defined annually

<details>
<summary>Show Answer</summary>
**B)** Don't define SLOs for things you won't actively respond to.
</details>

---

### Question 52 (Prometheus Fundamentals)

What is the purpose of `--alertmanager.url` in Prometheus?

- [ ] A) Deprecated — use `alerting` section instead
- [ ] B) Configures the Alertmanager dashboard URL
- [ ] C) Sets the Alertmanager API URL
- [ ] D) Configures the Alertmanager webhook

<details>
<summary>Show Answer</summary>
**A)** The `--alertmanager.url` flag is deprecated; configure Alertmanager in the `alerting` section.
</details>

---

### Question 53 (PromQL)

What does `vector(1)` create?

- [ ] A) A gauge metric with value 1
- [ ] B) A scalar value of 1
- [ ] C) An instant vector with a single sample with value 1 and no labels
- [ ] D) A counter with value 1

<details>
<summary>Show Answer</summary>
**C)** `vector()` creates an instant vector from a scalar with no labels.
</details>

---

### Question 54 (Instrumentation & Exporters)

What is the best practice for label cardinality in Prometheus metrics?

- [ ] A) No limit on label combinations
- [ ] B) Keep label combinations under 100,000 per metric
- [ ] C) Maximum 10 labels per metric
- [ ] D) Labels are free — use as many as needed

<details>
<summary>Show Answer</summary>
**B)** Keep cardinality under 100,000 per metric to avoid memory issues.
</details>

---

### Question 55 (Alerting)

What is the purpose of the `PagerDuty` severity mapping in Alertmanager?

- [ ] A) To map alert labels to PagerDuty severity levels
- [ ] B) To set the PagerDuty API version
- [ ] C) To configure PagerDuty escalation
- [ ] D) To filter which alerts go to PagerDuty

<details>
<summary>Show Answer</summary>
**A)** The severity field maps Prometheus alert severity to PagerDuty notification severity.
</details>

---

### Question 56 (Observability)

What is "black-box" monitoring best at detecting?

- [ ] A) Internal application errors
- [ ] B) Problems visible to external users
- [ ] C) Database connection issues
- [ ] D) Code-level bugs

<details>
<summary>Show Answer</summary>
**B)** Black-box monitoring detects issues as users experience them.
</details>

---

### Question 57 (Prometheus Fundamentals)

What is the default value of `sample_limit` in scrape configuration?

- [ ] A) No limit (0)
- [ ] B) 1000
- [ ] C) 5000
- [ ] D) There is no default

<details>
<summary>Show Answer</summary>
**A)** The default is 0 (no limit), but it's recommended to set a limit.
</details>

---

### Question 58 (PromQL)

What does `sum(rate(http_requests_total[5m])) / scalar(sum(rate(http_requests_total[5m])))` return?

- [ ] A) 1
- [ ] B) 0
- [ ] C) An error — scalar won't work this way
- [ ] D) The total request rate

<details>
<summary>Show Answer</summary>
**A)** The expression divides the same value by itself, resulting in 1 for each time series.
</details>

---

### Question 59 (Instrumentation & Exporters)

What is the purpose of the `probe_dns_lookup_time_seconds` metric?

- [ ] A) Time for DNS resolution during Blackbox probe
- [ ] B) Time for DNS to propagate
- [ ] C) Time for SSL handshake
- [ ] D) Total probe time

<details>
<summary>Show Answer</summary>
**A)** It measures the time taken for DNS lookup during a Blackbox Exporter probe.
</details>

---

### Question 60 (Alerting)

What is the purpose of `smtp_hello` in Alertmanager global email configuration?

- [ ] A) The greeting message in emails
- [ ] B) The hostname sent in the SMTP HELO/EHLO command
- [ ] C) The email subject
- [ ] D) The sender name

<details>
<summary>Show Answer</summary>
**B)** `smtp_hello` sets the hostname sent during the SMTP HELO/EHLO handshake.
</details>

---

## Answer Key

| Q | Answer | Domain | Q | Answer | Domain |
|---|--------|--------|---|--------|--------|
| 1 | B | Observability | 31 | B | Observability |
| 2 | B | Fundamentals | 32 | A | Fundamentals |
| 3 | B | PromQL | 33 | B | PromQL |
| 4 | A | Instrumentation | 34 | B | Instrumentation |
| 5 | B | Alerting | 35 | C | Alerting |
| 6 | B | Observability | 36 | B | Observability |
| 7 | B | Fundamentals | 37 | C | Fundamentals |
| 8 | B | PromQL | 38 | B | PromQL |
| 9 | B | Instrumentation | 39 | B | Instrumentation |
| 10 | B | Alerting | 40 | A | Alerting |
| 11 | A | Observability | 41 | A | Observability |
| 12 | B | Fundamentals | 42 | C | Fundamentals |
| 13 | B | PromQL | 43 | A | PromQL |
| 14 | B | Instrumentation | 44 | B | Instrumentation |
| 15 | B | Alerting | 45 | A | Alerting |
| 16 | A | Observability | 46 | A | Observability |
| 17 | D | Fundamentals | 47 | C | Fundamentals |
| 18 | B | PromQL | 48 | A | PromQL |
| 19 | B | Instrumentation | 49 | B | Instrumentation |
| 20 | B | Alerting | 50 | B | Alerting |
| 21 | B | Observability | 51 | B | Observability |
| 22 | B | Fundamentals | 52 | A | Fundamentals |
| 23 | B | PromQL | 53 | C | PromQL |
| 24 | B | Instrumentation | 54 | B | Instrumentation |
| 25 | B | Alerting | 55 | A | Alerting |
| 26 | B | Observability | 56 | B | Observability |
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
