// Create web server
var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var User = require('../models/user');

// Add new comment
router.post('/add', function(req, res, next) {
  // Create new comment
  var newComment = new Comment({
    username: req.body.username,
    comment: req.body.comment,
    created: Date.now()
  });

  // Save comment
  newComment.save(function(err, comment) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred while saving comment',
        error: err
      });
    }

    // Find user and add comment to comments array
    User.findOne({ username: req.body.username }, function(err, user) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred while finding user',
          error: err
        });
      }

      // Add comment to comments array
      user.comments.push(comment);
      user.save();

      // Return success
      res.status(201).json({
        message: 'Comment saved',
        obj: comment
      });
    });
  });
});

// Get all comments
router.get('/', function(req, res, next) {
  // Find all comments
  Comment.find()
    .populate('username', 'firstName lastName')
    .exec(function(err, comments) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred while retrieving comments',
          error: err
        });
      }

      // Return success
      res.status(200).json({
        message: 'Success',
        obj: comments
      });
    });
});

// Delete comment
router.delete('/:id', function(req, res, next) {
  // Find comment
  Comment.findById(req.params.id, function(err, comment) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred while finding comment',
        error: err
      });
    }

    // If comment not found
    if (!comment) {
      return res.status(500).json({
        title: 'Comment not found',
        error: { message: 'Comment not found' }
      });
    }
  });
});