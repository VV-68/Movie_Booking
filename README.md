# 🎬 Movie Ticket Booking System (MERN)

A full-stack **Movie Ticket Booking System** built using the **MERN stack (MongoDB, Express, React, Node.js)**.
This project focuses on solving real-world challenges like **concurrency control**, **secure authentication**, and a **realistic booking + payment flow**.

---
## 🌐 Live Demo

🚀 **Frontend:**https://movie-booking-blush-rho.vercel.app/ 


⚙️ **Backend API:**https://movie-booking-ivvj.onrender.com/

---

You can access the application using the frontend link above.
The backend is deployed separately and handles all API requests.

## 🚀 Overview

This application allows users to:

* Browse movies and showtimes
* Select seats visually
* Book tickets securely
* Experience a system that prevents **double booking using concurrency control**

It also includes an **admin panel** for managing movies, shows, and theatres.

---

## 🧩 Tech Stack

### 🌐 Frontend

* **React (Vite)** → Fast UI development and rendering
* **React Router** → Navigation between pages
* **Context API** → Global state (authentication)
* **CSS** → Styling

---

### ⚙️ Backend

* **Node.js** → Runtime environment
* **Express.js** → REST API handling
* **JWT (JSON Web Tokens)** → Authentication & authorization
* **bcrypt** → Password hashing

---

### 🗄️ Database

* **MongoDB Atlas (Cloud)** → NoSQL database
* **Mongoose** → Schema modeling and data handling

---

## 🔐 Authentication & Authorization

The system implements **secure login and role-based access**.

### 👤 User

* Register & login
* Browse movies and shows
* Select seats
* Book tickets

### 🛠️ Admin

* Login with admin credentials
* Add / manage movies
* Create shows
* Manage theatres
* View bookings

---

## ⚡ Concurrency Control (Core Feature)

### 🧠 Problem

In ticket booking systems, multiple users may attempt to book the **same seat at the same time**:

User A → selects A1
User B → selects A1

Without control:

❌ Both users may successfully book the same seat

---

### ✅ Solution

This system uses **MongoDB atomic operations** to ensure **only one booking succeeds**.

Seats are stored inside the `shows` collection:

```json
{
  "seatNumber": "A1",
  "status": "available"
}
```

Booking happens only if the seat is still available:

```js
Shows.findOneAndUpdate(
  {
    _id: showId,
    "seats.seatNumber": seatNumber,
    "seats.status": "available"
  },
  {
    $set: { "seats.$.status": "booked" }
  }
);
```

✔ Atomic operation
✔ Prevents race conditions
✔ Guarantees data consistency

---

### ⏳ Seat Locking Mechanism (Optional Enhancement)

To simulate real-world systems:

* When user selects seat → `locked`
* Lock expires after a fixed time
* On payment success → `booked`
* On failure → `available`

---

## 💳 Payment Interface (Simulated)

This project includes a **mock payment system** to simulate real booking behavior.

### Flow:

1. User selects seats
2. Seats are temporarily **locked**
3. User proceeds to payment

---

### Outcomes:

#### ✅ Payment Success

* Seats → `booked`
* Booking stored in database

#### ❌ Payment Failure / Timeout

* Seats → `available`
* Lock released

---

## 🎯 Key Features

* 🎟️ Movie browsing and show selection
* 💺 Interactive seat selection UI
* 🔐 Secure authentication using JWT
* 🛠️ Admin panel for system management
* ⚡ Concurrency-safe booking system
* 💳 Simulated payment workflow
* 🌐 RESTful API design
* ☁️ Cloud database (MongoDB Atlas)

---

## 🧠 Key Concepts Demonstrated

* Concurrency Control
* Race Condition Handling
* Atomic Database Operations
* Authentication & Authorization
* REST API Design
* Full-Stack Integration

---

## 🛠️ Setup Instructions

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd movie-booking-system
```

---

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 4. Environment Variables

Create a `.env` file in backend:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## 📌 Conclusion

This project demonstrates how real-world ticket booking systems handle **high-concurrency scenarios** using:

* Atomic database operations
* Conditional updates
* Seat locking mechanisms

Ensuring a **reliable and scalable booking experience**.

---

## 👨‍💻 Author

Visakh Vinod
