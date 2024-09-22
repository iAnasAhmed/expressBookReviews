const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  "username": "anas",
  "password": "11111"
}
];
const jwtSecret = '244d0b97c61cb978567e348a15fc8cd5c3c5791af982ccae88db48383bc3c273';

const isValid = (username) => {

  let UserWithSameName = users.filter((user) => {
    return user.username === username;
  });
  if (UserWithSameName.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }

};

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "Error log in" });
  } else if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).json({ message: "User succesfully logged in!!" });
  } else {
    res
      .status(208)
      .json({ message: "Invalid Login check username and password" });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const newReview = req.query.reviews;
  const username = req.session.authorization.username;
  if (books[isbn].reviews[username]) {
    books[isbn].reviews[username] = newReview;
    res.send("Review updated");
  } else {
    books[isbn].reviews = newReview;
    res.send("user review added");
  }
});
// regd_users.delete("/auth/review/:isbn", (req, res) => {
//   const isbn = req.params.isbn;
//   const token = req.headers.authorization.split(" ")[1];
//   const decoded = jwt.verify(token, jwtSecret);
//   const username = decoded.username;

//   if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
//       delete books[isbn].reviews[username];
//       res.status(200).json({ message: "Review deleted successfully" });
//   } else {
//       res.status(404).json({ message: "Review not found" });
//   }
// });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;