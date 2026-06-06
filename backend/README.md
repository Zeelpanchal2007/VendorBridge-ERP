# 🌉 VendorBridge Backend

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F27?style=for-the-badge&logo=redhat&logoColor=white)](https://www.sqlalchemy.org)
[![Alembic](https://img.shields.io/badge/Alembic-000000?style=for-the-badge&logo=python&logoColor=yellow)](https://alembic.sqlalchemy.org)

**VendorBridge Backend** is a premium, robust, enterprise-grade REST API built using **FastAPI** and **SQLAlchemy 2.0**. It serves as the backbone for managing Request for Quotations (RFQs) and Vendor life-cycles, featuring Role-Based Access Control (RBAC), secure JWT authentication, database migration support via Alembic, and automated aerospace-grade PDF generation.

---

## 🚀 Key Features

*   **Secure JWT Authentication & RBAC**: Advanced Role-Based Access Control with distinct access models for `Admin`, `Buyer`, and `Vendor`.
*   **Vendor Management**: Onboarding, profile management, tax/company compliance tracking, and Admin approval workflow.
*   **RFQ Lifecycle**: Create, list, edit, close, and delete Request for Quotations.
*   **Dynamic PDF Generator**: Built-in ReportLab rendering engine to stream dynamic, beautifully formatted PDF specification sheets for RFQs.
*   **Alembic Database Migrations**: Out-of-the-box support for database state tracking and automated migrations.
*   **SQLAlchemy 2.0 Mapping**: Modern type-hinted database models conforming to the latest SQLAlchemy specifications.
*   **Pydantic v2 validation**: Fast, type-safe request validation and response serialization.

---

## 🛠️ Project Architecture

```
vendorbridge-backend/
├── alembic/             # Database migrations config & versions
├── app/
│   ├── core/            # Application settings (Pydantic Settings) & DB Engine
│   ├── models/          # SQLAlchemy Models (User, Vendor, RFQ)
│   ├── schemas/         # Pydantic v2 schemas for request/response validation
│   ├── crud/            # Reusable CRUD utilities (inherits from CRUDBase)
│   ├── dependencies/    # FastAPI security, current user, & database sessions
│   ├── routers/         # API Route Handlers grouped by domain
│   ├── utils/           # Helper scripts (password hashing, PDF generation)
│   └── main.py          # FastAPI application instantiation & middleware
├── .env.example         # System configuration template
├── alembic.ini          # Migrations config file
└── requirements.txt     # Locked project dependencies
```

---

## 🚦 API Reference

| Endpoint | Method | Role Allowed | Description |
| :--- | :---: | :---: | :--- |
| `/api/v1/auth/register` | `POST` | `All` | Register a new user profile |
| `/api/v1/auth/login` | `POST` | `All` | OAuth2 Password flow token login |
| `/api/v1/users/me` | `GET` | `Authenticated` | Fetch current user profile |
| `/api/v1/users/me` | `PUT` | `Authenticated` | Update own user profile details |
| `/api/v1/vendors/` | `POST` | `All` | Create a new Vendor profile |
| `/api/v1/vendors/` | `GET` | `Buyer/Admin` | List all vendors (Vendors see only their own) |
| `/api/v1/vendors/{id}` | `GET` | `Owner/Buyer/Admin` | Fetch detailed Vendor profile |
| `/api/v1/vendors/{id}/status`| `PATCH` | `Admin` | Approve or Reject a Vendor profile |
| `/api/v1/rfqs/` | `POST` | `Buyer/Admin` | Create a new Request for Quotation |
| `/api/v1/rfqs/` | `GET` | `All` | List RFQs (Vendors see only `OPEN` RFQs) |
| `/api/v1/rfqs/{id}` | `GET` | `All` | Retrieve specific RFQ details |
| `/api/v1/rfqs/{id}/pdf` | `GET` | `All` | Stream dynamic PDF attachment for RFQ |
| `/api/v1/rfqs/{id}` | `PUT` | `Owner/Admin` | Update RFQ details |
| `/api/v1/rfqs/{id}` | `DELETE`| `Owner/Admin` | Delete RFQ |

---

## 💻 Setup & Installation

### 1. Prerequisites
*   Python `3.10` or higher.
*   PostgreSQL database instance running locally or remotely.

### 2. Setup environment variables
Copy the `.env.example` file to `.env` and fill in your details:
```bash
cp .env.example .env
```

### 3. Install dependencies
It is recommended to run inside a virtual environment:
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\activate

# Activate virtual environment (Unix/macOS)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Running Database Migrations
Generate and run migrations to create your tables:
```bash
# Generate initial migration
alembic revision --autogenerate -m "Initial schema"

# Apply migrations to database
alembic upgrade head
```

### 5. Running the Application
Start the FastAPI development server:
```bash
uvicorn app.main:app --reload
```
Once running, the interactive documentation is available at:
*   Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
*   ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🧪 Testing the API
To run the test suite, run:
```bash
pytest
```
