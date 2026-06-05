# Python Automation Suite: Ad Ops Automation
**Files:** `*.mp4` | **Stack:** Python, Pandas, DSP APIs (TTD, DV360), Tableau

This document breaks down the step-by-step logic of the Python tools I built at Causal IQ to automate the work of 20+ Account Managers.

---

### **Asset 1: Automated Optimization Engine**
*   **The Problem:** Managing bid/budget adjustments across 100+ line items was a 4-hour manual process prone to human error.
*   **The Logic:** `if CPA > threshold and conversions < 1: decrease_bid(0.20)`
*   **The Step:** 
    1.  Script calls the TTD API to pull "Real-Time Performance" data.
    2.  Pandas merges this with "Historical Benchmark" data.
    3.  The engine identifies "Underperformers" and "Outperformers" based on 15+ KPI variables.
    4.  It auto-generates a bulk-upload CSV, reducing the task from **4 hours to 5 minutes.**

### **Asset 2: Audience Insights Generator**
*   **The Problem:** Building data-driven insight decks for clients took 2 days of manual data manipulation.
*   **The Logic:** Data Aggregation & Visualization.
*   **The Step:** 
    1.  The script ingests raw log-level data from the DSP.
    2.  It performs "Temporal Analysis" (Time of Day/Day of Week) and "Contextual Analysis" (Top Performing Domains).
    3.  It outputs a formatted PowerPoint or Tableau dashboard automatically.
    4.  **Result:** Account managers spend 0 hours building charts and 100% of their time on strategy.

### **Asset 3: Dynamic Site List Management**
*   **The Logic:** Domain Transparency Verification.
*   **The Step:** I built a script that cross-references campaign "Site Lists" against the **IAB ads.txt** standard and internal "Transparency" scores. This ensures that client spend never goes to fraudulent or non-brand-safe domains.
