<div align="center">
  <h1>🌉 VendorBridge ERP</h1>
  <p><strong>A Next-Generation Procurement & Vendor Management Platform</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Frontend-React%2019%20%7C%20Tailwind%20CSS-blue?style=for-the-badge&logo=react" alt="Frontend" />
    <img src="https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-green?style=for-the-badge&logo=fastapi" alt="Backend" />
    <img src="https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql" alt="Database" />
  </p>
</div>

<br />

## 🌟 Overall Vision

The vision for **VendorBridge** is to simplify and digitize procurement operations for organizations through a centralized ERP platform. By managing everything from vendor onboarding to final invoice generation in one place, VendorBridge eliminates manual procurement inefficiencies. We deliver structured workflows, centralized vendor communication, and real-time procurement tracking wrapped in a clean, scalable, and intuitive architecture.

---

## ⚠️ The Problem Statement

Organizations struggle with fragmented procurement processes. Managing vendors, tracking Requests for Quotations (RFQs), comparing vendor bids, and handling complex approval hierarchies often involve endless email chains, lost PDFs, and manual data entry. 

**The Challenge:** Design and develop a comprehensive Procurement & Vendor Management ERP where organizations can seamlessly handle the entire procurement lifecycle—from creating an RFQ to generating the final paid invoice—while maintaining strict, role-based security.

---

## 🚀 Our Solution & Approach

VendorBridge provides a fully integrated, event-driven solution that bridges the gap between organizational procurement needs and vendor fulfillment. 

We approached this problem by building a **modular, role-based architecture**. The application ensures that Procurement Officers, Managers, Vendors, and Admins have customized, secure workspaces. By automating quotation comparisons, digitizing the approval timeline, and auto-generating PDF invoices, VendorBridge acts as a single source of truth for all financial and procurement data.

---

## ✨ Key Features

1. **Intelligent Dashboard & Analytics**
   - Real-time tracking of Pending Approvals, Active RFQs, and Overdue Invoices.
   - Dynamic spending summaries and monthly procurement trend visualization.
   
2. **Comprehensive Vendor Management**
   - Streamlined vendor registration and status tracking.
   - Structured records including GST details, categories, and performance ratings.

3. **Frictionless RFQ Lifecycle**
   - Procurement officers can easily initiate RFQs with specific product details, quantities, and strict deadlines, assigning them to targeted vendor categories.

4. **Vendor Quotation Portal**
   - Dedicated interfaces for vendors to submit pricing, delivery timelines, and critical notes in response to active RFQs.

5. **Smart Quotation Comparison**
   - Side-by-side bid analysis highlighting the lowest price, optimal delivery timelines, and vendor rating indicators to ensure data-driven decision-making.

6. **Hierarchical Approval Workflows**
   - Secure approval state transitions (Approve/Reject) with timestamped remarks and workflow tracking.

7. **Automated PO & Invoice Generation**
   - One-click conversion of approved quotations into official Purchase Orders.
   - Automated tax and total calculations with the ability to generate, download (PDF), and email commercial invoices.

8. **Activity Logs & Audit Trails**
   - Transparent tracking of all procurement activities, RFQ notifications, and workflow state changes.

---

## 👥 Role-Based Workflows

Security and operational efficiency are maintained through strict role separation:

| Role | Capabilities |
| :--- | :--- |
| **Procurement Officer** | Creates RFQs, compares vendor quotations, generates Purchase Orders,vendor verification and processes invoices. |
| **Manager / Approver** | Reviews procurement requests, approves/rejects quotations, and monitors workflow compliance. |
| **Vendor** | Submits competitive quotations, tracks RFQ status, and fulfills approved Purchase Orders. |
| **System Admin** | Manages platform users, oversees vendor registration, and accesses high-level procurement analytics. |

---

## 🔄 The Procurement Lifecycle (How It Works)

1. **Initiation:** Procurement Officer creates an RFQ for required goods/services.
2. **Bidding:** Invited Vendors receive notifications and submit their competitive quotations.
3. **Analysis:** The Procurement team compares all submitted quotations side-by-side.
4. **Approval:** The Manager reviews the selected quotation and provides official approval.
5. **Procurement:** The approved quotation is automatically converted into an official Purchase Order.
6. **Fulfillment & Invoicing:** Upon successful delivery, an Invoice is generated from the PO.
7. **Settlement:** The Invoice is processed, generated as a formatted PDF, and distributed.

---

## 🛠️ Technology Stack

### **Frontend (User Interface)**
* **Framework:** React 19 + Vite for lightning-fast performance.
* **Styling:** Tailwind CSS v4 for a premium, custom "AI-inspired" modern aesthetic.
* **Routing & State:** React Router DOM, customized Context APIs.
* **Icons & UI:** Lucide React.

### **Backend (Core API & Logic)**
* **Framework:** FastAPI (Python) for high-performance, asynchronous endpoints.
* **Authentication:** PyJWT with OAuth2PasswordBearer for secure, stateless role-validation.
* **Database ORM:** SQLAlchemy with Alembic for robust PostgreSQL schema management.
* **Document Generation:** ReportLab for dynamic, programmatic PDF generation.

---

## 🎨 Design Mockups
* **Excalidraw Architecture & UI Flow:** [View Mockup](https://app.excalidraw.com/l/65VNwvy7c4X/5ywnm0v3qhK)

---

## 🏆 Meet the Team

This project was architected and developed by a dedicated group of four engineers:

* **Panchal Zeel** — Frontend Development & Full-Stack Integration
* **Pansuriya Vatsal** — Backend Developer & API Architecture
* **Akshata Patel** — UI Designer & Frontend Engineer
* **Shivani Sheladiya** — Database Architecture & Technical Documentation

---
<div align="center">
  <i>Built with precision for seamless procurement.</i>
</div>
