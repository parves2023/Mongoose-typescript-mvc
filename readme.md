# 📚 Library Management API

This project is a RESTful API for managing books and borrow records in a library system. It features input validation with **Zod**, aggregation queries with **MongoDB,mongoose,typescript**, and clean error handling.

---

## ✨ Features

- 📖 **Books CRUD**
  - Create, read, update, and delete books
  - Filtering, sorting, and pagination
- 📦 **Borrowing**
  - Borrow books with quantity tracking
  - Update available copies automatically
  - Aggregate borrow statistics
- ✅ **Validation & Error Handling**
  - Zod validation with Mongoose-style error responses
  - Clear error messages for invalid input and not-found resources

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/parves2023/Mongoose-typescript-mvc
cd Mongoose-typescript-mvc
````

### 2️⃣ Install dependencies

```bash
npm install


### Run the server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

---

## 📖 API Reference

### 📘 Books

#### ✅ Create a Book

**POST** `/api/books`

Request Body:

```json
{
  "title": "Book Title",
  "author": "Author Name",
  "genre": "FICTION",
  "isbn": "1234567890",
  "description": "Optional description",
  "copies": 5,
  "available": true
}
```

Success Response:

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": { ... }
}
```

---

#### ✅ Get All Books

**GET** `/api/books`

Query Params:

* `filter` (genre)
* `sortBy` (field)
* `sort` (`asc` or `desc`)
* `limit` (number)

Example:

```
/api/books?filter=FICTION&sortBy=title&sort=asc&limit=5
```

---

#### ✅ Get a Book by ID

**GET** `/api/books/:bookId`

---

#### ✅ Update a Book

**PUT** `/api/books/:bookId`

Request Body: (same as create)

---

#### ✅ Delete a Book

**DELETE** `/api/books/:bookId`

---

### 📦 Borrow Records

#### ✅ Borrow a Book

**POST** `/api/borrows`

Request Body:

```json
{
  "book": "<bookId>",
  "quantity": 1,
  "dueDate": "2024-12-31"
}
```

---

#### ✅ Get Borrow Summary

**GET** `/api/borrows`

Returns aggregated borrow counts per book.

---

#### ✅ Get All Borrow Records

**GET** `/api/borrows/all-borrow`

Returns all borrow records with populated book details.

---

## ⚠️ Error Handling

All errors return structured JSON:

Validation error example:

```json
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a non-negative integer",
        ...
      }
    }
  }
}
```

Not found example:

```json
{
  "message": "Book Not Found",
  "success": false
}
```

---

## 🌐 Live Deployment

[View Live API](https://l2-libary-asignment-03-pearl.vercel.app/)

---

## 🎥 Video Explanation

[Watch the Video](https://drive.google.com/file/d/1vLfVsGk1EgA1Dq6Fj9ZTg5mnjN2DnQGe/view?usp=sharing)

---

## 💻 Tech Stack

* Node.js
* Express.js
* MongoDB & Mongoose
* Zod validation
* typescript

---
```
