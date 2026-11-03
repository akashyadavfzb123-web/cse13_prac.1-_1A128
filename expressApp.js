import express from 'express';

const app = express();
const PORT = 4000;

app.use(express.json());

// Allow the single-page UI (served from port 3000) to call this API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

let books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', price: 350, category: 'Fiction' },
  { id: 2, title: 'Atomic Habits', author: 'James Clear', price: 450, category: 'Self-Help' },
  { id: 3, title: 'Deep Work', author: 'Cal Newport', price: 400, category: 'Productivity' }
];

const isValidBook = ({ id, title, author, price, category }) =>
  id !== undefined && title && author && price !== undefined && category;

// Retrieve all books
app.get('/books', (req, res) => {
  res.json(books);
});

// Retrieve a book by ID
app.get('/books/:id', (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// Add a new book
app.post('/books', (req, res) => {
  if (!isValidBook(req.body)) {
    return res.status(400).json({ error: 'id, title, author, price and category are required' });
  }
  if (books.some((b) => b.id === req.body.id)) {
    return res.status(409).json({ error: 'Book with this id already exists' });
  }
  const { id, title, author, price, category } = req.body;
  const book = { id, title, author, price, category };
  books.push(book);
  res.status(201).json({ message: 'Book added successfully', book });
});

// Update book details
app.put('/books/:id', (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const { title, author, price, category } = req.body;
  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (price !== undefined) book.price = price;
  if (category !== undefined) book.category = category;

  res.json({ message: 'Book updated successfully', book });
});

// Delete a book
app.delete('/books/:id', (req, res) => {
  const index = books.findIndex((b) => b.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Book not found' });

  const [deleted] = books.splice(index, 1);
  res.json({ message: 'Book deleted successfully', book: deleted });
});

// Invalid routes and malformed JSON
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => res.status(400).json({ error: 'Invalid request body' }));

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
