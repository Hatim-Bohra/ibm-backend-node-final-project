const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios.
function retrieveBooks() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  retrieveBooks().then(
    (books) => res.status(200).send(JSON.stringify(books, null, 4)),
    (error) =>
      res
        .status(404)
        .send("An error has occured trying to retrieve all the books")
  );
});

// Task 11: Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.
function retrieveBookFromISBN(isbn) {
  let book = books[isbn];
  return new Promise((resolve, reject) => {
    if (book) {
      resolve(book);
    } else {
      reject(new Error("The provided book does not exist"));
    }
  });
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  retrieveBookFromISBN(isbn).then(
    (book) => res.status(200).send(JSON.stringify(book, null, 4)),
    (err) => res.status(404).send(err.message)
  );
});

// Task 12: Retrieve book details by author using Promise Callbacks or async-await using axios
function retrieveBookFromAuthor(author) {
  let validBooks = [];
  return new Promise((resolve, reject) => {
    for (let bookISBN in books) {
      const bookAuthor = books[bookISBN].author;
      if (bookAuthor === author) {
        validBooks.push(books[bookISBN]);
      }
    }
    if (validBooks.length > 0) {
      resolve(validBooks);
    } else {
      reject(new Error("The provided author does not exist"));
    }
  });
}

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  retrieveBookFromAuthor(author).then(
    (books) => res.status(200).send(JSON.stringify(books, null, 4)),
    (err) => res.status(404).send(err.message)
  );
});

// Task 13: Retrieve book details from title using Promise callbacks or async-await using axios
function retrieveBookFromTitle(title) {
  let validBooks = [];
  return new Promise((resolve, reject) => {
    for (let bookISBN in books) {
      const bookTitle = books[bookISBN].title;
      if (bookTitle === title) {
        validBooks.push(books[bookISBN]);
      }
    }
    if (validBooks.length > 0) {
      resolve(validBooks);
    } else {
      reject(new Error("The provided book title does not exist"));
    }
  });
}

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  retrieveBookFromTitle(title).then(
    (book) => res.status(200).send(JSON.stringify(book, null, 4)),
    (err) => res.status(404).send(err.message)
  );
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn] !== null) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Provided book does not exist" });
  }
});

module.exports.general = public_users;
