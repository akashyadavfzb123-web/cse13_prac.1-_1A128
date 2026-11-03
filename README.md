# MT1-LABEXAM - Library Book Management Web Application

Node.js | HTTP module | FS module | Express.js (no database, data kept in JS arrays)

## Setup
```
npm install
```

## Part A - HTTP server (port 3000)
```
node httpServer.js
```
Expected: `HTTP Server running at http://localhost:3000`

| Method | URL | Response |
|---|---|---|
| GET | / | Single-page UI (HTML, read with fs) |
| GET | /books | Books in JSON |
| GET | /about | Application information |
| GET | /home | Same single page, served with fs |
| POST | /add-book | Add a book (id, title, author, price) |
| any other | - | 404 |

## Part B - Express REST API (port 4000)
```
node expressApp.js
```
Expected: `Express Server running at http://localhost:4000`

| Method | URL | Function |
|---|---|---|
| GET | /books | All books |
| GET | /books/:id | Book by ID |
| POST | /books | Add book (201) |
| PUT | /books/:id | Update book |
| DELETE | /books/:id | Delete book |

Sample POST body:
```json
{ "id": 4, "title": "Clean Code", "author": "Robert C. Martin", "price": 550, "category": "Programming" }
```

## Screenshots to take (save in /screenshots)
1. Terminal: HTTP server running
2. Browser: /, /books, /about, /home
3. EchoAPI: GET all, GET by id, POST, PUT, DELETE
4. GitHub repository commit history

## GitHub
```
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/<YOUR-GITHUB-ID>/MT1-LABEXAM.git
git push -u origin main
```
Commit after each module (HTTP server, static serving, Express CRUD).
Write your GitHub ID on the front page of the answer sheet.
