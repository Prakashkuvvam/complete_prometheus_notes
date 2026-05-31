---
title: "🚀 Start Here"
weight: -5
bookFlatSection: false
bookToc: true
---

# 🚀 Start Here: Your PCA Exam Learning Path

Welcome! Whether you're brand new to monitoring or brushing up for the certification, this guide will help you navigate the curriculum efficiently.

---

## 🎯 How to Use This Guide

### If you're completely new to Prometheus
Follow the **8-week study plan** below. Start from Chapter 1 and work through sequentially.

### If you're reviewing for the exam
Go straight to the **Exam Prep** phase. Take a practice test first to identify weak areas, then focus on those chapters.

### If you just want a quick overview
Browse the curriculum on the [📊 Progress Dashboard]({{< relref "25-progress-dashboard" >}}) and jump to any chapter that interests you.

---

## 📋 Prerequisites

Before you begin, make sure you have the following set up:

```bash
# 1. Install Docker Desktop
#   macOS: brew install --cask docker
#   Linux: sudo apt install docker.io
#   Windows: Download from docker.com

# 2. Verify Docker
docker --version
docker compose version
```

### Prerequisites Checklist

- [ ] **Docker Desktop installed** (verify with `docker --version`)
- [ ] **Docker Compose installed** (verify with `docker compose version`)
- [ ] **A code editor** (VS Code recommended)
- [ ] **Git installed** (for version control)
- [ ] **Python 3.8+** (for lab 4 instrumentation)

---

## 📅 8-Week Study Plan

### Week 1-2: Observability + Fundamentals

> Goal: Understand observability concepts and deploy Prometheus.

| Day | Chapter | Topics | Time |
|-----|---------|--------|------|
| 1 | [Ch 1: Observability Fundamentals]({{< relref "01-observability-concepts" >}}) | SLIs, SLOs, SLAs, golden signals | 1 hr |
| 2 | [Ch 2: Metrics, Logs & Traces]({{< relref "02-metrics-logs-traces" >}}) | Three pillars of observability | 1 hr |
| 3 | [Ch 3: Prometheus vs Other Tools]({{< relref "03-prometheus-vs-other-tools" >}}) | Tool landscape comparison | 45 min |
| 4 | [Ch 4: Prometheus Architecture]({{< relref "04-prometheus-architecture" >}}) | Pull model, components, scrape lifecycle | 1.5 hr |
| 5 | [Ch 5: Installation & Configuration]({{< relref "05-installation-configuration" >}}) | Server setup, flags, YAML config | 1.5 hr |
| 6 | [Ch 6: Data Model & Metric Types]({{< relref "06-data-model-metric-types" >}}) | Counter, gauge, histogram, summary | 1.5 hr |
| 7 | **Hands-on Lab** | Lab 1: Install Prometheus stack | 1 hr |

### Week 3-5: PromQL (Heavy Focus)

> Goal: Master PromQL — the most heavily tested domain (28%).

| Day | Chapter | Topics | Time |
|-----|---------|--------|------|
| 8-9 | [Ch 9: PromQL Basics]({{< relref "09-promql-basics" >}}) | Selectors, vectors, matchers, offsets | 2 hr |
| 10 | [Ch 10: PromQL Operators]({{< relref "10-promql-operators" >}}) | Arithmetic, comparison, logical ops | 1.5 hr |
| 11 | [Ch 11: PromQL Functions]({{< relref "11-promql-functions" >}}) | rate, irate, increase, histogram_quantile | 2 hr |
| 12 | [Ch 12: Advanced PromQL]({{< relref "12-advanced-promql" >}}) | Vector matching, subqueries, recording rules | 2 hr |
| 13 | [Ch 13: PromQL Practice Worksheet]({{< relref "13-promql-practice-worksheet" >}}) | 30+ exercises | 2 hr |
| 14 | **Practice daily** | Write queries against live Prometheus | 30 min/day |

### Week 6: Instrumentation + Alerting

> Goal: Learn to instrument apps and set up alerting.

| Day | Chapter | Topics | Time |
|-----|---------|--------|------|
| 15 | [Ch 14: Client Libraries & Instrumentation]({{< relref "14-client-libraries-instrumentation" >}}) | Go, Python, Java clients | 1.5 hr |
| 16 | [Ch 15: Exporters]({{< relref "15-exporters" >}}) | Node Exporter, Blackbox, third-party | 1.5 hr |
| 17 | [Ch 16: Pushgateway]({{< relref "16-pushgateway" >}}) | Short-lived jobs | 1 hr |
| 18 | [Ch 17: Alerting Rules]({{< relref "17-alerting-rules" >}}) | Alert rules, Alertmanager | 1.5 hr |
| 19 | [Ch 18: Alertmanager Routing]({{< relref "18-alertmanager-routing" >}}) | Routes, inhibition, silences | 1.5 hr |
| 20 | [Ch 19: Grafana Dashboards]({{< relref "19-grafana-dashboards" >}}) | Dashboard design | 1.5 hr |
| 21-22 | **Hands-on Labs** | Labs 4-7 | 2 hr |

### Week 7-8: Exam Prep

> Goal: Practice, review weak areas, and ace the exam.

| Day | Activity | Time |
|-----|----------|------|
| 23 | [Practice Test 1]({{< relref "29-exam-practice-test-1" >}}) — Timed (90 min) | 1.5 hr |
| 24 | Review weak domains from Test 1 | 1 hr |
| 25 | [Practice Test 2]({{< relref "30-exam-practice-test-2" >}}) — Timed | 1.5 hr |
| 26 | Review + redo PromQL worksheet | 1.5 hr |
| 27 | [Practice Test 3]({{< relref "31-exam-practice-test-3" >}}) — Timed | 1.5 hr |
| 28 | Review weak areas + cheatsheet | 1 hr |
| 29 | [Practice Test 4]({{< relref "32-exam-practice-test-4" >}}) — Timed | 1.5 hr |
| 30 | [Practice Test 5]({{< relref "33-exam-practice-test-5" >}}) — Timed | 1.5 hr |
| 31 | Final review + rest | 1 hr |
| 32 | **Exam Day!** | 90 min |

---

## 🧠 Learning Tips

### For Each Chapter

1. **Read** the chapter content thoroughly
2. **Watch** for 📝 Exam Tips highlighted throughout
3. **Try** the chapter-end quiz to test understanding
4. **Check it off** on the [📊 Progress Dashboard]({{< relref "25-progress-dashboard" >}})

### Retention Strategies

| Strategy | How | Why It Works |
|----------|-----|-------------|
| **Active Recall** | After reading, close tab and summarize from memory | Strengthens neural pathways |
| **Spaced Repetition** | Review previous chapter's exam tips before starting new | Fights forgetting curve |
| **Hands-on Practice** | Run the lab environment daily | Real context solidifies concepts |
| **Teach Someone** | Explain PromQL queries out loud | Exposes gaps in understanding |

### PCA Exam Common Trick Areas

- 🔴 `rate()` vs `irate()` vs `increase()` — know when to use each
- 🔴 **histogram_quantile** — MUST be used with `rate()` and keep the `le` label
- 🔴 **Vector matching** — `group_left` vs `group_right`, `on()` vs `ignoring()`
- 🔴 **Pushgateway** — only for batch/short-lived jobs, NOT for bypassing firewalls
- 🔴 **Alert lifecycle** — `Pending → Firing → Resolved`, role of `for:`
- 🔴 **SLI vs SLO vs SLA** — definitions and relationships
- 🔴 **Cardinality** — unbounded labels (user IDs, emails) cause TSDB explosions

---

> **Ready to start?** Head to **[Chapter 1: Observability Fundamentals]({{< relref "01-observability-concepts" >}})** 🚀
