---
title: "Documentation"
weight: 10
bookFlatSection: false
---

# Prometheus Documentation 📖

<div id="exam-dashboard-app" data-total-chapters="21" data-total-tests="7"></div>

Welcome to the comprehensive Prometheus & PCA exam learning curriculum. This section contains **21 chapters** organized into 5 exam domains:

## Observability Concepts (18%)

| # | Chapter | Description |
|---|---------|-------------|
| 01 | [Observability Fundamentals]({{< relref "01-observability-concepts" >}}) | SLIs, SLOs, SLA, golden signals, USE/RED methods |
| 02 | [Metrics, Logs & Traces]({{< relref "02-metrics-logs-traces" >}}) | Three pillars of observability, correlation |
| 03 | [Prometheus vs Other Tools]({{< relref "03-prometheus-vs-other-tools" >}}) | Monitoring landscape comparison |

## Prometheus Fundamentals (20%)

| # | Chapter | Description |
|---|---------|-------------|
| 04 | [Prometheus Architecture]({{< relref "04-prometheus-architecture" >}}) | Pull model, components, scrape lifecycle |
| 05 | [Installation & Configuration]({{< relref "05-installation-configuration" >}}) | Server setup, flags, YAML configuration |
| 06 | [Data Model & Metric Types]({{< relref "06-data-model-metric-types" >}}) | Counter, gauge, histogram, summary, labels |
| 07 | [Service Discovery & Scraping]({{< relref "07-service-discovery-scraping" >}}) | SD mechanisms, relabeling, intervals |
| 08 | [Storage & Retention]({{< relref "08-storage-retention" >}}) | TSDB, remote write/read, retention policies |

## PromQL (28%) — CRITICAL

| # | Chapter | Description |
|---|---------|-------------|
| 09 | [PromQL Basics]({{< relref "09-promql-basics" >}}) | Selectors, matchers, vectors, offsets |
| 10 | [PromQL Operators]({{< relref "10-promql-operators" >}}) | Arithmetic, comparison, logical, vector matching |
| 11 | [PromQL Functions]({{< relref "11-promql-functions" >}}) | rate, irate, increase, histogram_quantile, aggregations |
| 12 | [Advanced PromQL]({{< relref "12-advanced-promql" >}}) | Subqueries, recording rules, performance |
| 13 | [PromQL Practice Worksheet]({{< relref "13-promql-practice-worksheet" >}}) | 30+ exercises with solutions |

## Instrumentation & Exporters (16%)

| # | Chapter | Description |
|---|---------|-------------|
| 14 | [Client Libraries & Instrumentation]({{< relref "14-client-libraries-instrumentation" >}}) | Go, Java, Python clients, best practices |
| 15 | [Exporters]({{< relref "15-exporters" >}}) | Node Exporter, Blackbox, third-party exporters |
| 16 | [Pushgateway]({{< relref "16-pushgateway" >}}) | Short-lived jobs, when (not) to use |

## Alerting & Dashboarding (18%)

| # | Chapter | Description |
|---|---------|-------------|
| 17 | [Alerting Rules & Alertmanager]({{< relref "17-alerting-rules" >}}) | Recording rules, alert rules, for: |
| 18 | [Alertmanager Routing]({{< relref "18-alertmanager-routing" >}}) | Routes, receivers, inhibition, silences |
| 19 | [Grafana Dashboards]({{< relref "19-grafana-dashboards" >}}) | Grafana setup, Prometheus data source, dashboards |

## Exam Prep & Bonus

| # | Chapter | Description |
|---|---------|-------------|
| 20 | [Practice Tests Overview]({{< relref "20-practice-tests" >}}) | 7 full-length practice exams & study strategy |
| 21 | [Interview Questions]({{< relref "21-interview-questions" >}}) | 50+ exam-style & real-world questions |
