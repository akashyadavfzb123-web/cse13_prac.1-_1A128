import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', price: 350 },
  { id: 2, title: 'Atomic Habits', author: 'James Clear', price: 450 },
  { id: 3, title: 'Deep Work', author: 'Cal Newport', price: 400 }
];

const sendJSON = (res, status, data) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const sendHTML = (res, status, html) => {
  res.writeHead(status, { 'Content-Type': 'text/html' });
  res.end(html);
};

const server = http.createServer((req, res) => {
  const { method } = req;
  const url = req.url.split('?')[0];

  if (method === 'GET' && url === '/') {
    return fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
      if (err) return sendHTML(res, 200, '<h1>Welcome to the Library Book Management System</h1>');
      sendHTML(res, 200, content);
    });
  }

  if (method === 'GET' && url === '/books') {
    return sendJSON(res, 200, books);
  }

  if (method === 'GET' && url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('Library Book Management App - built with the Node.js HTTP and FS modules.');
  }

  if (method === 'GET' && url === '/home') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    return fs.readFile(filePath, (err, content) => {
      if (err) {
        return sendHTML(res, 500, '<h1>500 - Unable to read file</h1>');
      }
      sendHTML(res, 200, content);
    });
  }

  if (method === 'POST' && url === '/add-book') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      let data;
      try {
        data = JSON.parse(body);
      } catch {
        return sendJSON(res, 400, { error: 'Invalid JSON' });
      }

      const { id, title, author, price } = data;
      if (id === undefined || !title || !author || price === undefined) {
        return sendJSON(res, 400, { error: 'id, title, author and price are required' });
      }
      if (books.some((b) => b.id === id)) {
        return sendJSON(res, 409, { error: 'Book with this id already exists' });
      }

      const book = { id, title, author, price };
      books.push(book);
      sendJSON(res, 201, { message: 'Book added successfully', book });
    });
    return;
  }

  if (url === '/books' || url === '/add-book' || url === '/' || url === '/about' || url === '/home') {
    return sendJSON(res, 405, { error: 'Method not allowed' });
  }

  sendHTML(res, 404, '<h1>404 - Page Not Found</h1>');
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
