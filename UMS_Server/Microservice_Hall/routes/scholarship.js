var express = require('express');
var router = express.Router();

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hall scholarship Index' });
});









const postData = async function(link, data){
    var ret = await fetch(link, {
        method: "POST", 
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    });
    return ret.json();
}

const sendHallApproval = function(data){
            const link = "http://localhost:5023/scholarship/update_apply_state";

            data.state = 'Hall';
            data.updated_by = 'Hall_id';
            postData(link, data);
            console.log("Data sent from hall!");
}


//  scholarship
router.post('/scholarship_request', async function(req, res, next) {
  
    res.status(200).json("hehe");
    //res.render('index', { title: 'Payment Index' });

    setTimeout(() => {
            sendHallApproval(req.body);        
    }, 10000);
});
  

module.exports = router;