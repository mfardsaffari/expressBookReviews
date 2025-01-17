const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let usersWithSameUsername = users.filter((user)=> {
    return user.username === username
  });

  return !(usersWithSameUsername.length > 0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });

  return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.status(404).json({message: "Username and password is required!"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else
    return res.status(208).json({message: "Invalid Login. Check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const review = req.query.review;
  const username = req.user.username;

  if(books[isbn])
  {
    books[isbn].reviews[username] = review;
    return res.status(200).send("Review successfully submitted.");
  }
  else
    return res.status(300).json({message: "Book not found!"});
});

// Delete user book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const username = req.user.username;

  if(books[isbn])
  {
    if(books[isbn].reviews[username])
      delete books[isbn].reviews[username]

    return res.status(200).send(`${username} Review successfully deleted.`);
  }
  else
    return res.status(300).json({message: "Book not found!"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
