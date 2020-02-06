/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

// WIP - USER STORY #8: All 11 functional tests are complete and passing.

suite('Functional Tests', function() {
  
  var id;
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      // Test 1 of 11
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'issue_title')
          assert.property(res.body, 'issue_text')
          assert.property(res.body, 'created_by')
          assert.property(res.body, 'assigned_to')
          assert.property(res.body, 'status_text')
          assert.property(res.body, '_id')
          assert.equal(res.body.issue_title, 'Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.equal(res.body.assigned_to, 'Chai and Mocha')
          assert.equal(res.body.status_text, 'In QA')
          id = res.body._id
          done();
        });
      });
      
      // Test 2 of 11
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'Functional Test - Every field filled in'
          })
          .end(function(err, res){
            assert.equal(res.status, 200)
            assert.property(res.body, 'issue_title')
            assert.property(res.body, 'issue_text')
            assert.property(res.body, 'created_by')
            assert.equal(res.body.issue_title, 'Title')
            assert.equal(res.body.issue_text, 'text')
            assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
            assert.property(res.body, '_id')
            done();
        })
        
      });
      
      // Test 3 of 11
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/text')
          .send({})
          .end(function(err, res){
            assert.equal(res.status, 200)
            assert.equal(res.text, "Missing required fields")
            done();
          })
        
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      // Test 4 of 11
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/text')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no updated field sent')
            done();
          })
      });
      
      // Test 5 of 11
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/text')
          .send({_id: id, issue_text: 'issue text updated'})
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, "successfully updated")
            done();
        })
      });
      
      // Test 6 of 11
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/text')
          .send({_id: id, issue_text: 'issue text updated', 'status_text': 'status text updated'})
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, "successfully updated")
            done();
        }) 
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      // Test 7 of 11
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      // Test 8 of 11
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'Title'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].issue_title, 'Title')
          done();
        });
        
      });
      
      // Test 9 of 11
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'Title', issue_text: 'text', open: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].issue_title, 'Title');
          assert.equal(res.body[0].issue_text, 'text');
          assert.equal(res.body[0].open, true)
          done();
        });
        
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      // Test 10 of 11
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err,res){
          assert.equal(res.status, 200)
          assert.equal(res.text, "_id error")
          done();
        })
      });
      
      // Test 11 of 11
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: id})
        .end(function(err,res){
          assert.equal(res.status, 200)
          assert.equal(res.text, "deleted "+id)
          done();
        })
      });
      
    });

});
