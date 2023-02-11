var express = require('express');
var router = express.Router();


const Controller = require('../Model/Controller');


/* GET home page. */
router.get('/', async function(req, res, next) {
  var data = await Controller.test();
  console.log("printing in router: " + data);

  res.render('index', { title: 'Payment Index' });
});





//  creates

router.post('/create_smart_card', async function(req, res, next) {
  
  data = await Controller.createSmartCard(req.body);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

router.post('/create_smart_cards', async function(req, res, next) {
  
  data = await Controller.createSmartCards(req.body);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

router.post('/create_payment', async function(req, res, next) {
  
  data = await Controller.createPayment(req.body);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

router.post('/create_payments', async function(req, res, next) {
  
  data = await Controller.createPayments(req.body);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

router.post('/create_transaction', async function(req, res, next) {
  
  data = await Controller.createTransaction(req.body);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});




//  deletes

router.delete('/delete_smart_card', async function(req, res, next) {
  
  data = await Controller.deleteSmartCard(req.body);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

router.delete('/delete_payment', async function(req, res, next) {
  
  data = await Controller.deletePayment(req.body);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});




//  update

router.patch('/update_smart_card', async function(req, res, next) {
  
  data = await Controller.updateSmartCard(req.body);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

router.patch('/update_payment', async function(req, res, next) {
  
  data = await Controller.updatePayment(req.body);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

router.patch('/update_payment_details', async function(req, res, next) {
  
  data = await Controller.updatePaymentWithType(req.body, req.query);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});




//  reads

//  smart card info
router.get('/smart_card', async function(req, res, next) {
  
  data = await Controller.getSmartCardInfo(req.query);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

//  due payment info ( for a student shob req korle query te id thakbe na )
router.get('/due_payment', async function(req, res, next) {
  
  data = await Controller.getDuePaymentInfo(req.query);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

//  transaction info ( for a student shob req korle query te id thakbe na )
router.get('/transaction', async function(req, res, next) {
  
  data = await Controller.getTransactionInfo(req.query);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});

//  info all of a table
router.get('/get_list', async function(req, res, next) {
  
  data = await Controller.getList(req.query);
  res.status(200).json(data);
  //res.render('index', { title: 'Payment Index' });
});





module.exports = router;
