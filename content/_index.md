---
title: "Prometheus Learning Path"
bookToC: false
---

# Prometheus Certified Associate (PCA) Learning Path 🚀

> **Your complete guide from observability fundamentals to PCA exam mastery — covering all 5 exam domains with theory, hands-on labs, and practice tests.**

## 📚 Curriculum Overview

This curriculum is structured into **21 comprehensive chapters** + **hands-on labs** covering all **5 PCA exam domains**. Each chapter builds on the previous, taking you from fundamentals to exam-ready proficiency.

### 📊 Domain Weightings

| # | Domain | Weight | Priority | Est. Study Time |
|---|--------|--------|----------|-----------------|
| 1 | **PromQL** | **28%** | 🔴 **CRITICAL** | 40 hrs |
| 2 | **Prometheus Fundamentals** | **20%** | 🟡 High | 20 hrs |
| 3 | **Observability Concepts** | **18%** | 🟢 Medium | 12 hrs |
| 4 | **Alerting & Dashboarding** | **18%** | 🟡 High | 18 hrs |
| 5 | **Instrumentation & Exporters** | **16%** | 🟢 Medium | 10 hrs |

### 🗺️ Learning Path

| Phase | Chapters | Goal | Duration |
|-------|----------|------|----------|
| **Observability Foundations** | 1–3 | Understand SLIs/SLOs, three pillars, tool landscape | Week 1 |
| **Prometheus Fundamentals** | 4–8 | Architecture, install, data model, service discovery, storage | Week 1–2 |
| **PromQL Mastery** | 9–13 | Query language — selectors, operators, functions, advanced | Week 3–4 |
| **Instrumentation & Exporters** | 14–16 | Client libraries, exporters, Pushgateway | Week 5 |
| **Alerting & Dashboarding** | 17–19 | Alerting rules, Alertmanager, Grafana | Week 5 |
| **Exam Prep** | 20–28 | Practice tests, interview questions | Week 6–8 |

---

## 📖 Chapter Index

### Observability Concepts (18%)

| # | Chapter | Topics |
|---|---------|--------|
| 01 | [Observability Fundamentals]({{< relref "docs/01-observability-concepts" >}}) | SLIs, SLOs, SLAs, golden signals, USE/RED methods |
| 02 | [Metrics, Logs & Traces]({{< relref "docs/02-metrics-logs-traces" >}}) | Three pillars of observability, correlation patterns |
| 03 | [Prometheus vs Other Tools]({{< relref "docs/03-prometheus-vs-other-tools" >}}) | Monitoring tool comparison, when to use what |

### Prometheus Fundamentals (20%)

| # | Chapter | Topics |
|---|---------|--------|
| 04 | [Prometheus Architecture]({{< relref "docs/04-prometheus-architecture" >}}) | Pull model, components, TSDB, scrape lifecycle |
| 05 | [Installation & Configuration]({{< relref "docs/05-installation-configuration" >}}) | Prometheus server setup, flags, YAML config |
| 06 | [Data Model & Metric Types]({{< relref "docs/06-data-model-metric-types" >}}) | Counter, gauge, histogram, summary, labels, cardinality |
| 07 | [Service Discovery & Scraping]({{< relref "docs/07-service-discovery-scraping" >}}) | Static, file-based, cloud SD, relabeling, scrape intervals |
| 08 | [Storage & Retention]({{< relref "docs/08-storage-retention" >}}) | Local TSDB, remote write/read, retention, downsampling |

### PromQL (28%) — CRITICAL

| # | Chapter | Topics |
|---|---------|--------|
| 09 | [PromQL Basics]({{< relref "docs/09-promql-basics" >}}) | Selectors, matchers, instant/range vectors, offsets |
| 10 | [PromQL Operators]({{< relref "docs/10-promql-operators" >}}) | Arithmetic, comparison, logical, vector matching |
| 11 | [PromQL Functions]({{< relref "docs/11-promql-functions" >}}) | rate, irate, increase, histogram_quantile, aggregation |
| 12 | [Advanced PromQL]({{< relref "docs/12-advanced-promql" >}}) | Subqueries, recording rules, edge cases, performance |
| 13 | [PromQL Practice Worksheet]({{< relref "docs/13-promql-practice-worksheet" >}}) | 30+ exercises with solutions |

### Instrumentation & Exporters (16%)

| # | Chapter | Topics |
|---|---------|--------|
| 14 | [Client Libraries & Instrumentation]({{< relref "docs/14-client-libraries-instrumentation" >}}) | Go, Java, Python clients, custom metrics, best practices |
| 15 | [Exporters]({{< relref "docs/15-exporters" >}}) | Node Exporter, Blackbox, Windows, third-party exporters |
| 16 | [Pushgateway]({{< relref "docs/16-pushgateway" >}}) | Short-lived jobs, batch monitoring, when (not) to use |

### Alerting & Dashboarding (18%)

| # | Chapter | Topics |
|---|---------|--------|
| 17 | [Alerting Rules & Alertmanager]({{< relref "docs/17-alerting-rules" >}}) | Recording rules, alert rules, for:, severity, labels |
| 18 | [Alertmanager Routing]({{< relref "docs/18-alertmanager-routing" >}}) | Routes, receivers, inhibition, silences, grouping |
| 19 | [Grafana Dashboards]({{< relref "docs/19-grafana-dashboards" >}}) | Grafana setup, Prometheus data source, dashboard design |

### Exam Prep & Bonus

| # | Chapter | Topics |
|---|---------|--------|
| 20 | [Practice Tests Overview]({{< relref "docs/20-practice-tests" >}}) | 7 full-length practice exams, answer keys, study strategy |
| 21 | [Interview Questions]({{< relref "docs/21-interview-questions" >}}) | 50+ PCA exam-style & real-world interview questions |

---

## 🛠️ Hands-On Labs

| Lab | Description |
|-----|-------------|
| Lab 01 | Install Prometheus with Docker Compose |
| Lab 02 | Configure scrape targets and service discovery |
| Lab 03 | Write and test PromQL queries |
| Lab 04 | Instrument a Python application |
| Lab 05 | Set up Node Exporter and Alertmanager |
| Lab 06 | Build a Grafana dashboard |
| Lab 07 | Configure alert routing and silences |

[View all labs →]({{< relref "labs" >}})

---

## 🎯 What You'll Achieve

By the end of this curriculum, you will be able to:

- ✅ **Understand observability** concepts — SLIs, SLOs, golden signals
- ✅ **Deploy and configure Prometheus** from scratch
- ✅ **Write proficient PromQL queries** — from basic selectors to advanced functions
- ✅ **Instrument applications** using client libraries across languages
- ✅ **Configure alerting** with Alertmanager routing, inhibition, and silences
- ✅ **Build Grafana dashboards** for effective monitoring visualization
- ✅ **Pass the PCA certification** exam with confidence

---

## 🚀 Getting Started

1. [Install Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Clone the `labs/` directory with the Docker Compose stack
3. Start with **Chapter 1** and follow sequentially
4. Complete the **hands-on labs** after each section
5. Take the **practice tests** in Weeks 7-8

> **Pro Tip:** PromQL is 28% of the exam — practice daily! Set up the lab and write queries every day.

---

*Start your journey → [Chapter 1: Observability Fundamentals]({{< relref "docs/01-observability-concepts" >}})*
