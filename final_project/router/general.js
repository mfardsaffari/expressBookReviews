const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const searchedISBN = parseInt(req.params.isbn);
  if(books[searchedISBN])
    return res.send(JSON.stringify(books[searchedISBN],null,4));
  else
    return res.status(300).json({message: "Book not found!"});
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const searchedAuthor = req.params.author;

  let result = [];
  Object.keys(books).map((bookISBN) => {
    if(books[bookISBN].author === searchedAuthor)
      result.push(books[bookISBN]);
  })

  if(result.length > 0)
    return res.send(JSON.stringify(result,null,4));
  else
    return res.status(300).json({message: "No book found for this author!"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const searchedTitle = req.params.title;

  let result = [];
  Object.keys(books).map((bookISBN) => {
    if(books[bookISBN].title === searchedTitle)
      result.push(books[bookISBN]);
  })

  if(result.length > 0)
    return res.send(JSON.stringify(result,null,4));
  else
    return res.status(300).json({message: "No book found with this title!"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
