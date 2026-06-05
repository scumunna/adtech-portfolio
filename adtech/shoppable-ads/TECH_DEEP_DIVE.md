# Technical Deep Dive: The Shoppable Ad Engine
**File:** `index.html` | **Stack:** HTML5, CSS3, JavaScript (ES6+), DCO Logic

This document breaks down the step-by-step execution of the Shoppable Ad unit, from raw data ingestion to real-time user-intent optimization.

---

### **Step 1: Data Ingestion & API Normalization**
*   **The Logic:** Although the `index.html` is the frontend, it is powered by a Python/Pandas backend (noted in README). The system ingests disparate client feeds (Shopify, CSV, XML).
*   **The Step:** The Python engine normalizes these feeds into a standard JSON schema that the ad unit can consume. It verifies image resolution and price formatting before deployment.

### **Step 2: The "Adaptive DCO" Engine (JavaScript)**
The ad unit doesn't just display products; it **learns.**
*   **The Component:** `IntersectionObserver` & `localStorage`.
*   **The Step:** 
    1.  The ad initializes an `IntersectionObserver` with a **0.6 threshold.**
    2.  When a user stops scrolling and "dwells" on a specific product for more than **0.5 seconds**, the script captures that product's ID.
    3.  This interaction data is persisted in `localStorage`.
    4.  On the next impression (the "Retargeting" phase), the script pulls these stats and **re-sorts the DOM elements** to place the user's preferred products in the first two tiles.

### **Step 3: Zero-Friction Deep-Linking**
*   **The Component:** `visitProduct()` function.
*   **The Step:** The system detects if the user is on a mobile device or desktop. It uses a dynamic `clickTag` logic to deep-link the user directly to the specific SKU page on the retailer's site, bypassing the home page and reducing the path-to-purchase by **3 clicks.**

### **Step 4: Performance-First UI (Tailwind & CSS)**
*   **The Logic:** Ad units must be lightweight to pass "Core Web Vitals" and avoid being blocked by ad servers.
*   **The Step:** I used a "Skeleton-first" loading strategy. The layout (Tailwind) renders instantly while the product images are lazy-loaded to ensure the ad never slows down the host page (e.g., ESPN, Yahoo).
