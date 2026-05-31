---
title: "📊 Progress Dashboard"
weight: -10
bookFlatSection: false
bookToc: false
---

<div id="exam-dashboard-app" data-total-chapters="21" data-total-tests="7"></div>

---

## 📖 Full Curriculum

Welcome to the comprehensive Prometheus & PCA exam curriculum. Use the dashboard above to track your progress across **21 chapters** and **7 practice tests**.

### Observability Concepts (18%)

| # | Chapter | Description |
|---|---------|-------------|
| 01 | [Observability Fundamentals]({{< relref "01-observability-concepts" >}}) | SLIs, SLOs, SLAs, golden signals, USE/RED methods |
| 02 | [Metrics, Logs & Traces]({{< relref "02-metrics-logs-traces" >}}) | Three pillars of observability, correlation patterns |
| 03 | [Prometheus vs Other Tools]({{< relref "03-prometheus-vs-other-tools" >}}) | Monitoring tool comparison, when to use what |

### Prometheus Fundamentals (20%)

| # | Chapter | Description |
|---|---------|-------------|
| 04 | [Prometheus Architecture]({{< relref "04-prometheus-architecture" >}}) | Pull model, components, TSDB, scrape lifecycle |
| 05 | [Installation & Configuration]({{< relref "05-installation-configuration" >}}) | Server setup, flags, YAML config, CLI tools |
| 06 | [Data Model & Metric Types]({{< relref "06-data-model-metric-types" >}}) | Counter, gauge, histogram, summary, labels, cardinality |
| 07 | [Service Discovery & Scraping]({{< relref "07-service-discovery-scraping" >}}) | SD mechanisms, relabeling, scrape configuration |
| 08 | [Storage & Retention]({{< relref "08-storage-retention" >}}) | Local TSDB, remote write/read, retention, downsampling |

### PromQL (28%) — CRITICAL

| # | Chapter | Description |
|---|---------|-------------|
| 09 | [PromQL Basics]({{< relref "09-promql-basics" >}}) | Selectors, matchers, instant/range vectors, offsets |
| 10 | [PromQL Operators]({{< relref "10-promql-operators" >}}) | Arithmetic, comparison, logical, set operations, vector matching |
| 11 | [PromQL Functions]({{< relref "11-promql-functions" >}}) | rate, irate, increase, histogram_quantile, aggregation |
| 12 | [Advanced PromQL]({{< relref "12-advanced-promql" >}}) | Subqueries, recording rules, performance optimization |
| 13 | [PromQL Practice Worksheet]({{< relref "13-promql-practice-worksheet" >}}) | 30+ exercises with step-by-step solutions |

### Instrumentation & Exporters (16%)

| # | Chapter | Description |
|---|---------|-------------|
| 14 | [Client Libraries & Instrumentation]({{< relref "14-client-libraries-instrumentation" >}}) | Go, Java, Python clients, custom metrics, best practices |
| 15 | [Exporters]({{< relref "15-exporters" >}}) | Node Exporter, Blackbox, Windows, third-party ecosystem |
| 16 | [Pushgateway]({{< relref "16-pushgateway" >}}) | Short-lived jobs, batch monitoring, use cases and pitfalls |

### Alerting & Dashboarding (18%)

| # | Chapter | Description |
|---|---------|-------------|
| 17 | [Alerting Rules & Alertmanager]({{< relref "17-alerting-rules" >}}) | Recording rules, alert rules, for:, severity, labels |
| 18 | [Alertmanager Routing]({{< relref "18-alertmanager-routing" >}}) | Routes, receivers, inhibition, silences, grouping |
| 19 | [Grafana Dashboards]({{< relref "19-grafana-dashboards" >}}) | Grafana setup, Prometheus data source, dashboard design |

### Exam Prep & Bonus

| # | Chapter | Description |
|---|---------|-------------|
| 20 | [Practice Tests Overview]({{< relref "20-practice-tests" >}}) | 7 full-length practice exams, study plan, cheatsheet |
| 21 | [Interview Questions]({{< relref "21-interview-questions" >}}) | 50+ PCA exam-style and real-world interview questions |

### Practice Tests

| # | Test | Description |
|---|------|-------------|
| 1 | [Practice Test 1]({{< relref "29-exam-practice-test-1" >}}) | 60 questions — all 5 domains |
| 2 | [Practice Test 2]({{< relref "30-exam-practice-test-2" >}}) | 60 questions — all 5 domains |
| 3 | [Practice Test 3]({{< relref "31-exam-practice-test-3" >}}) | 60 questions — all 5 domains |
| 4 | [Practice Test 4]({{< relref "32-exam-practice-test-4" >}}) | 60 questions — all 5 domains |
| 5 | [Practice Test 5]({{< relref "33-exam-practice-test-5" >}}) | 60 questions — all 5 domains |
| 6 | [Practice Test 6]({{< relref "34-exam-practice-test-6" >}}) | 60 questions — all 5 domains |
| 7 | [Practice Test 7]({{< relref "35-exam-practice-test-7" >}}) | 60 questions — all 5 domains |

---

> 💡 **Pro tip:** Start from Chapter 1 and work your way through. Use the dashboard to track your progress and identify weak areas for focused study. PromQL (Chapters 9-13) deserves 40% of your study time!
