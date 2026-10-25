const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register new user
public_users.post("/register", (req, res) => {
  const username = req.body.username || req.query.username;
  const password = req.body.password || req.query.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  let matchingBooks = [];
  const keys = Object.keys(books);
  keys.forEach((key) => {
    if (books[key].author.toLowerCase() === author) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 4));
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  let matchingBooks = [];
  const keys = Object.keys(books);
  keys.forEach((key) => {
    if (books[key].title.toLowerCase() === title) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 4));
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// ====================================================================
// Task 10: Get all books using Promise callbacks or async/await with Axios
// ====================================================================
const getBooksAsync = () => {
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject(new Error("Unable to fetch books"));
    }
  });
};

public_users.get('/async/books', async function (req, res) {
  try {
    const allBooks = await getBooksAsync();
    res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ====================================================================
// Task 11: Get book details based on ISBN using Promise callbacks or async/await with Axios
// ====================================================================
const getBookByISBNAsync = (isbn) => {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(new Error("Book not found"));
    }
  });
};

public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  getBookByISBNAsync(isbn)
    .then((book) => {
      res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((err) => {
      res.status(404).json({ message: err.message });
    });
});

// ====================================================================
// Task 12: Get book details based on Author using Promise callbacks or async/await with Axios
// ====================================================================
const getBooksByAuthorAsync = (author) => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    const matching = [];
    keys.forEach((k) => {
      if (books[k].author.toLowerCase() === author.toLowerCase()) {
        matching.push(books[k]);
      }
    });
    if (matching.length > 0) {
      resolve(matching);
    } else {
      reject(new Error("No books found for this author"));
    }
  });
};

public_users.get('/async/author/:author', async function (req, res) {
  try {
    const result = await getBooksByAuthorAsync(req.params.author);
    res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// ====================================================================
// Task 13: Get all books based on Title using Promise callbacks or async/await with Axios
// ====================================================================
const getBooksByTitleAsync = (title) => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    const matching = [];
    keys.forEach((k) => {
      if (books[k].title.toLowerCase() === title.toLowerCase()) {
        matching.push(books[k]);
      }
    });
    if (matching.length > 0) {
      resolve(matching);
    } else {
      reject(new Error("No books found with this title"));
    }
  });
};

public_users.get('/async/title/:title', function (req, res) {
  getBooksByTitleAsync(req.params.title)
    .then((result) => {
      res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      res.status(404).json({ message: err.message });
    });
});

module.exports.general = public_users;
