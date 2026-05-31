# 🎯 Prometheus Certified Associate (PCA) — One-Stop Study Guide

> **Your complete preparation material to crack the PCA exam on the first attempt.**
> Covers all 5 exam domains with theory, hands-on labs, practice questions, and cheatsheets.

---

## 📊 Exam at a Glance

| Item | Detail |
|------|--------|
| **Exam** | Prometheus Certified Associate (PCA) |
| **Issuer** | CNCF / Linux Foundation |
| **Format** | 60 multiple-choice questions, proctored online |
| **Duration** | 90 minutes |
| **Passing Score** | ~75% (45/60 correct) |
| **Cost** | $250 USD (includes 1 free retake) |
| **Validity** | 3 years |

---

## 📈 Domain Weightings & Priority

| # | Domain | Weight | Priority | Est. Study Time |
|---|--------|--------|----------|-----------------|
| 1 | **PromQL** | **28%** | 🔴 **CRITICAL** | 40 hrs |
| 2 | **Prometheus Fundamentals** | **20%** | 🟡 High | 20 hrs |
| 3 | **Observability Concepts** | **18%** | 🟢 Medium | 12 hrs |
| 4 | **Alerting & Dashboarding** | **18%** | 🟡 High | 18 hrs |
| 5 | **Instrumentation & Exporters** | **16%** | 🟢 Medium | 10 hrs |
| | **Total** | **100%** | | **100 hrs** |

---

## 🗺️ Study Roadmap (8-Week Plan)

### Week 1-2: Observability Concepts + Fundamentals
- [ ] Study `01-observability-concepts.md`
- [ ] Study `02-prometheus-fundamentals.md`
- [ ] Set up Docker Compose lab (`labs/`)
- [ ] Practice: Install Prometheus, configure scrape targets

### Week 3-5: PromQL (Heavy Focus)
- [ ] Study `03-promql-master-guide.md`
- [ ] Complete `promql-practice-worksheet.md` (30+ exercises)
- [ ] Practice daily: write queries against your lab
- [ ] Focus: `rate()/irate()/increase()`, vector matching, histogram_quantile

### Week 6: Instrumentation + Alerting
- [ ] Study `04-instrumentation-exporters.md`
- [ ] Study `05-alerting-dashboarding.md`
- [ ] Lab: Instrument a sample app, wire up Alertmanager, build Grafana dashboard

### Week 7: Practice Tests
- [ ] Complete `practice-questions.md` (100+ questions)
- [ ] Review `cheatsheet.md` for quick recall
- [ ] Re-do weak areas from PromQL worksheet
- [ ] Take timed practice exams (60 questions / 90 min)

### Week 8: Final Review & Exam
- [ ] Review all 5 domain summaries
- [ ] Re-read `cheatsheet.md`
- [ ] Hands-on: rebuild the lab from scratch without looking
- [ ] Exam day!

---

## 📚 File Structure

```
prometheus-pca-study-guide/
├── README.md                              # ← You are here
├── 01-observability-concepts.md           # Domain: Observability (18%)
├── 02-prometheus-fundamentals.md          # Domain: Fundamentals (20%)
├── 03-promql-master-guide.md              # Domain: PromQL (28%) — MOST IMPORTANT
├── 04-instrumentation-exporters.md        # Domain: Instrumentation (16%)
├── 05-alerting-dashboarding.md            # Domain: Alerting & Dashboarding (18%)
├── promql-practice-worksheet.md           # 30+ PromQL exercises with answers
├── practice-questions.md                  # 100+ exam-style practice questions
├── cheatsheet.md                          # Quick reference / last-minute revision
└── labs/
    ├── docker-compose.yml                 # Full Prometheus stack
    ├── prometheus.yml                     # Prometheus configuration
    ├── alert.rules.yml                    # Alerting rules
    ├── alertmanager.yml                   # Alertmanager configuration
    └── sample-app/
        ├── app.py                         # Instrumented Python application
        └── Dockerfile                     # Dockerfile for the app
```

---

## 🎯 Exam Strategy

### Question Types
1. **Conceptual** — "What is an SLO?" or "When should you use Pushgateway?"
2. **Config Interpretation** — Given a YAML snippet, what does it do?
3. **PromQL Output** — What does this query return? What's wrong with it?
4. **Scenario-Based** — "Your metrics show X, which query should you use?"

### Time Management (90 min for 60 questions)
| Phase | Time | Strategy |
|-------|------|----------|
| First pass | 50 min | Answer what you know, flag uncertain ones |
| Review flagged | 25 min | Revisit with fresh eyes |
| Final check | 15 min | Verify all answered, review tricky ones |

### Common Trick Areas (Watch Out!)
- 🔴 `rate()` vs `irate()` vs `increase()` — know when to use each
- 🔴 **histogram_quantile** — MUST be used with `rate()` and keep the `le` label
- 🔴 **Vector matching** — `group_left` vs `group_right`, `on()` vs `ignoring()`
- 🔴 **Pushgateway** — only for batch/short-lived jobs, NOT for bypassing firewalls
- 🔴 **Alert lifecycle** — `Pending → Firing → Resolved`, role of `for:`
- 🔴 **SLI vs SLO vs SLA** — definitions and relationships
- 🔴 **Cardinality** — unbounded labels (user IDs, emails) cause TSDB explosions
- 🔴 **Histogram vs Summary** — histograms allow server-side aggregation, summaries don't

---

## 🛠️ Quick Start Lab

```bash
cd labs
docker compose up -d
```

Then access:
- **Prometheus**: http://localhost:9090
- **Alertmanager**: http://localhost:9093
- **Grafana**: http://localhost:3000 (admin/admin)
- **Node Exporter**: http://localhost:9100/metrics
- **Sample App**: http://localhost:8080/metrics

---

## 📖 Recommended Resources

| Resource | Why |
|----------|-----|
| [Prometheus Documentation](https://prometheus.io/docs/) | Official — Bible for the exam |
| [PromLabs PromQL Cheat Sheet](https://promlabs.com/promql-cheat-sheet/) | Best quick reference |
| Prometheus: Up & Running (Brian Brazil) | The definitive book |
| [KodeKloud PCA Course](https://kodekloud.com/courses/prometheus-certified-associate-pca/) | Hands-on labs included |
| [Awesome Prometheus Alerts](https://samber.github.io/awesome-prometheus-alerts/) | Production-ready alert rules |
| [CNCF PCA Page](https://www.cncf.io/certification/pca/) | Official exam info |

---

> **Good luck!** Consistent daily practice — even 30 minutes of PromQL — is the key to passing on the first try.
