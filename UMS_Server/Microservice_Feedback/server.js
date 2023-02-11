const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json());
app.use(cors());

var cassandra = require('cassandra-driver');

var client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter:'datacenter1',
  keyspace: 'ums'
});


app.post('/upload_feedback', (req, res, next) => {
  const student_id = req.body.student_id;
  const subject = req.body.subject;
  const desc = req.body.desc;
  console.log('dhuklam server e');
 
  const query = 'INSERT INTO feedback (id, student_id, subject, description) VALUES (uuid(), ?, ?, ?)';
  client.execute(query, [student_id, subject, desc], { prepare : true }, function(err, result){
    if(err){
        console.log('I am in error');
        res.send(err);
    }
    else{
        console.log('Its working');
        res.send(result);
    }
  });
  
});

app.get('/get_feedbacks', (req, res, next) => {
    const query = "SELECT * FROM feedback;"
    client.execute(query, function(err, result){
        if(err){
            console.log("error e dhuksi")
        }
        else{
            res.send({
                'results': result.rows,
            })
        }
    });
    
  });

  

app.listen(5030, () => {
    console.log("server is connected on port 5030")
})