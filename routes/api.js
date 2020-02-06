'use strict';

var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    // USER STORY #6: Can get an array of all issues with all the information for each issue
    // USER STORY #7: Can filter requests by passing along any field(s) and value(s) in the query

    .get(function (req, res){
      var project = req.params.project;
      var issueQuery = req.query;
      if (issueQuery._id) {
        issueQuery._id = new ObjectId(issueQuery._id)
      }
      // Necessary for testing purposes:
      if (issueQuery.open) { 
        issueQuery.open = String(issueQuery.open) == "true" 
      }
      MongoClient.connect(process.env.DB, {useUnifiedTopology : true}, (err, client) => {
        var db = client.db()
        db.collection(project).find(issueQuery).toArray( (err, docs) => {
          if (err) {
            res.send(err)
          } else {
            res.json(docs)
          }
        })
      })
    })
    
    // USER STORY #2: Can post form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text.
    // USER STORY #3: The object saved (and returned) will include all of those fields (blank for optional no input) and also
    // include created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id.

    .post(function (req, res){
      var project = req.params.project;
      var data = req.body;
      var issue = { issue_title: data.issue_title, issue_text: data.issue_text, created_by: data.created_by,
                    assigned_to: data.assigned_to || '', status_text: data.status_text || '',
                    created_on: new Date(), updated_on: new Date(), open: true }
      if (!issue.issue_title || !issue.issue_text || !issue.created_by) {
        return res.send("Missing required fields")
      }
      MongoClient.connect(process.env.DB, {useUnifiedTopology : true}, (err, client) => {
        var db = client.db()
        db.collection(project).insertOne(issue, (err, docs) => {
          if (err) {
            res.send(err)
          } else {
            res.json(issue)
          }
        })
      })
    })
    
    // USER STORY #4: Can update any object using its _id and the PUT method 
    // Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on. 
    // If no fields are sent return 'no updated field sent'.
  
    .put(function (req, res){
      var project = req.params.project;
      var id = req.body._id
      var changes = req.body;
      if (!changes.issue_title && !changes.issue_text && !changes.created_by && !changes.assigned_to && !changes.status_text) {
        res.send("no updated field sent")
      }
      changes.updated_on = new Date() // new date for update param, but not create param
      MongoClient.connect(process.env.DB, {useUnifiedTopology : true}, (err, client) => {
        var db = client.db()
        db.collection(project).findOneAndUpdate({_id: new ObjectId(id)}, {$set: { changes }})
          .catch(err)
          .then( (updatedDoc) => {
            if (updatedDoc) {
              res.send('successfully updated')
            } else {
              res.send('could not update ' + id)
            }
          })
      })
    })
    
  
    // WIP - USER STORY #5: Can use _id to completely delete an issue. 
    // If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.

    .delete(function (req, res){
      var project = req.params.project;
      var id = req.body._id
      if (!id) {
        res.send('_id error')
      } else {
        MongoClient.connect(process.env.DB, {useUnifiedTopology : true}, (err, client) => {
        var db = client.db()
        id = new ObjectId(id)
        db.collection(project).findOneAndDelete({_id: id}, (err) => {
          if (err) {
            res.send(err)
          } else {
            res.send('deleted ' + id)
          }
        })
      })}
    });
    
};