# 🏋️ FitStore Pro – Service-Oriented Web Application

## 📌 Project Overview
FitStore Pro is a modern, full-stack E-Commerce Web Application developed for the **CCS2552 Individual Project Assignment**. The application strictly adheres to Service-Oriented Architecture (SOA) principles, demonstrating a clear separation of concerns between a Java Spring Boot backend and a Vanilla JavaScript frontend.

## 🏗️ Architecture & Technologies

### Backend (REST API)
- **Framework:** Java Spring Boot
- **Database:** MySQL
- **ORM:** Spring Data JPA / Hibernate
- **Architecture Flow:** Controller → Service → Repository → Entity
- **Operations:** Full CRUD (Create, Read, Update, Delete) via HTTP endpoints (`GET`, `POST`, `PUT`, `DELETE`).

### Frontend (Client-Side)
- **Technologies:** HTML5, CSS3 (Premium Dark UI), Vanilla JavaScript
- **API Consumption:** Natively fetches and updates product data using the JavaScript `fetch()` API.
- **State Management:** Uses `localStorage` for cart management and session handling (auth guards), ensuring zero direct database access from the frontend.

---

## 🚀 Features

- **Public Store:** Users can view all 12 initial supplement products.
- **Shopping Cart Modal:** Users can add items, increment/decrement quantities, remove items, and see dynamic subtotal calculations.
- **Admin Dashboard:** Fully protected dashboard where administrators can execute CRUD operations (Add new products, edit existing stock/prices, delete products).
- **Authentication Guard:** Frontend-based session routing to protect the admin panel.

## 🔐 Demo Credentials
*Authentication is handled via the frontend script for demonstration purposes.*

| Role | Username | Password |
|------|----------|----------|
| **User** | `user` | `user123` |
| **Admin** | `admin` | `admin123` |

---

## ⚙️ Setup Instructions

### 1. Database Setup (MySQL)
Ensure you have a local MySQL server running (e.g., via XAMPP) on port `3306`.
1. Open phpMyAdmin or your preferred SQL client.
2. Create an empty database named `fitness_store`:
```sql
CREATE DATABASE fitness_store;
```
*(Note: Spring Boot will automatically generate the `products` table and insert 12 dummy products on startup via `data.sql` and the `ddl-auto=create` property).*

### 2. Running the Backend (Spring Boot)
1. Open a terminal in the root `fitness-store` directory.
2. Build and run the project using Maven Wrapper:
```bash
./mvnw spring-boot:run
```
*(Note for Windows users: Use `mvnw spring-boot:run`)*
The API will start running at `http://localhost:8080`.

### 3. Running the Frontend
Due to strict modern browser CORS security policies, the frontend must be served over a local HTTP server (simply opening `index.html` via `file:///` will block API requests).
1. Open a new terminal and navigate to the `frontend` folder.
2. Start a simple Python HTTP server:
```bash
python -m http.server 8000
```
3. Open a web browser and navigate to: **http://localhost:8000/login.html**

---

## 📁 Project Structure

```text
fitness-store/
│
├── frontend/                   # Client-side (HTML, CSS, JS)
│   ├── images/                 # Local image assets
│   ├── admin.html / .js        # Protected admin CRUD dashboard
│   ├── index.html              # Main store & cart UI
│   ├── login.html / .js        # Auth entry point
│   ├── script.js               # Store API requests & cart logic
│   └── style.css               # Premium dark theme styling
│
└── src/main/java/.../fitnessstore/  # Backend (Spring Boot)
    ├── controller/             # REST API Controllers
    ├── entity/                 # Product JPA mapped class
    ├── repository/             # Database access interfaces
    ├── service/                # Business logic layer
    └── resources/
        ├── application.properties # MySQL config & Hibernate settings
        └── data.sql            # Initial SQL seed data for the 12 products
```

## 🎓 CCS2552 Assignment Objectives Met
1. **RESTful API:** Implemented full CRUD (`/api/products`).
2. **Layered Architecture:** Used proper Entities, Repositories, Services, and Controllers.
3. **MySQL Connection:** Fully tied to local relational DB storage.
4. **API Consumption:** Frontend strictly interacts via HTTP requests to the backend.
5. **Separation of Concerns:** Clear physical and logical divide between frontend UI and backend data handling.
