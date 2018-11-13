/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
const mongoose = require('mongoose')
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
mongoose.connect(MONGODB_CONNECTION_STRING)
let bookSchema = new mongoose.Schema({
  title: String,
  comments: [String]
})
let Book = mongoose.model('Book', bookSchema)

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find((err, docs) => {
        res.json(docs.map((book) => {
          return {
            id: book._id,
            title: book.title,
            commentcount: book.comments.length
          }
        }))
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if (!req.body.title) {
        res.json({error: 'no title provided'})
      }
      //response will contain new book object including atleast _id and title
      let book = new Book({
        title,
        comments: []
      })
      book.save()
      res.json(book)
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err) => {
        if (err) {
          res.send('unable to delete')
        }
        res.json({success: 'complete delete successful'})
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (err, doc) => {
        if (doc) {
          res.json({
            id: bookid,
            title: doc.title,
            comments: doc.comments
          })
        } else {
          res.json({error: 'no such book'})
        }
      })
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      Book.findByIdAndUpdate(bookid, {$push: {comments: comment}}, (err, doc) => {
        if (doc) {
          res.json({
            id: bookid,
            title: doc.title,
            comments: doc.comments
          })
        } else {
          res.json({error: 'no such book'})
        }
      })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid, (err, doc) => {
        if (err) {
          res.json({error: 'no book exists'})
        }
        res.json({message: 'delete successful'})
      })
    });
  
};
