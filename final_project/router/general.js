const express = require('express');
const axios = require('axios').default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered."});
    } else
      return res.status(404).json({message: "User already exists!"});
  }
  else
    return res.status(404).json({message: "Username and password is required!"});
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
  const searchedISBN = parseInt(req.params.isbn);
  if(books[searchedISBN])
  {
    if(JSON.stringify(books[searchedISBN].reviews) !== '{}')
      return res.send(JSON.stringify(books[searchedISBN].reviews,null,4));
    else
      return res.status(300).json({message: "No reviews have been submitted for this book!"});
  }
  else
    return res.status(300).json({message: "Book not found!"});
});


// Get the book list available by axios
public_users.get('/axios',function (req, res) {
  const instance = axios.get('https://mfardsaffari-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai');
  instance.then(resp => {
    return res.status(200).send(JSON.stringify(resp.data,null,4));
  }).catch(err => {
    return res.status(300).json({message: "Error happened!"});
  });
});

module.exports.general = public_users;
