var express = require('express');
var router = express.Router();

const Controller = require('../Model/Controller');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Scholarship Index' });
});



//  creates

//  scholarship
router.post('/create_scholarship', async function(req, res, next) {
  
  data = await Controller.createScholarship(req.body);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

router.post('/apply_scholarship', async function(req, res, next) {
  
    data = await Controller.createApplyScholarship(req.body);
    res.status(200).json(data);
    //res.render('index', { title: 'Payment Index' });
});

router.post('/update_apply_state', async function(req, res, next) {
  
    data = await Controller.updateApplyState(req.body);
    res.status(200).json(data);
    //res.render('index', { title: 'Payment Index' });
});





//  update

router.patch('/update_scholarship', async function(req, res, next) {
  
  data = await Controller.updateScholarship(req.body);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

router.patch('/update_applied_scholarship', async function(req, res, next) {
  
  data = await Controller.updateAppliedScholarship(req.body);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});








//  deletes

router.delete('/delete_scholarship', async function(req, res, next) {
  
  data = await Controller.deleteScholarship(req.body);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

router.delete('/delete_applied_scholarship', async function(req, res, next) {
  
  data = await Controller.deleteAppliedScholarship(req.body);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});







//  reads

//  all scholarships
router.get('/scholarship_list', async function(req, res, next) {
  
  data = await Controller.getScholarshipList(req.query);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

//  one scholarships
router.get('/scholarship', async function(req, res, next) {
  
  data = await Controller.getAScholarship(req.query);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});



//  all applied scholarships
router.get('/applied_scholarship_list', async function(req, res, next) {
  
  data = await Controller.getAppliedScholarshipList(req.query);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

router.get('/pending_scholarship_list', async function(req, res, next) {
  
  data = await Controller.getPendingScholarshipList(req.query);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

//  one scholarships
router.get('/applied_scholarship', async function(req, res, next) {
  
  data = await Controller.getAppliedScholarship(req.query);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});



//  all applied scholarships
router.get('/scholarship_state_list', async function(req, res, next) {
  
  data = await Controller.getScholarshipStateList(req.query);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

//  one scholarships
router.get('/scholarship_state', async function(req, res, next) {
  
  data = await Controller.getScholarshipState(req.query);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});









module.exports = router;
