const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json());
app.use(cors());

var cassandra = require('cassandra-driver');

var client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  //contactPoints: ['host.docker.internal'],
  localDataCenter:'datacenter1',
  keyspace: 'ums'
});



app.post('/save_doctor', (req, res, next) => {
  const doctor_id = req.body.doctor_id;
  const doctor_name = req.body.doctor_name;
  const specialization = req.body.specialization;
  console.log('dhuklam server e');
 
  const query = 'INSERT INTO doctors (id, name, specialization) VALUES (?, ?, ?)';
  client.execute(query, [doctor_id, doctor_name, specialization], { prepare : true }, function(err, result){
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

app.get('/get_schedule', (req, res, next) => {
    console.log("getting schedule")
    const query = "SELECT * FROM doctors;"
    client.execute(query, function(err, result){
        if(err){
            console.log("error e dhuksi 2")
        }
        else{
            res.send({
                'results': result.rows,
            })
        }
    });
    
  });

  app.get('/get_appointment_pending', (req, res, next) => {
    const query = "SELECT * FROM appointment WHERE status=? ALLOW FILTERING;"
    client.execute(query, ['pending'], function(err, result){
        if(err){
            console.log("error e dhuksi")
        }
        else{
          // for(let i=0; i<result.rows.length; i++){
          //   if(result.rows[i].status != 'pending'){
          //     delete result[i];
          //     i--;
          //   }
          // }
            res.send({
                'results': result.rows,
            })
        }
    });
    
  });


  app.get('/get_appointment_history', async(req, res, next) => {
    //console.log("history e dhuksi")
    const query = "SELECT * FROM appointment WHERE status=? ALLOW FILTERING;"
    result = await client.execute(query,['approved'], { prepare : true });
    const query2 = "SELECT * FROM appointment WHERE status=? ALLOW FILTERING;"
    result2 = await client.execute(query,['declined'], { prepare : true });
    
    rows = [];
    for(let i=0; i<result.rows.length; i++){
      rows.push(result.rows[i]);
    }
    for(let i=0; i<result2.rows.length; i++){
      rows.push(result2.rows[i]);
    }
    console.log("result: ", rows);
    //console.log("status : ", result.rows[0].status)
    // for(let i=0; i<result.rows.length; i++){
      
    //   if(result.rows[i].status == 'pending'){
    //     delete result[i];
    //     i--;
    //   }
    // }  
    //console.log("result:", result.rows)
    res.send({
        'results': rows,
    })
       
    
  });
 
  app.get('/get_appointment_history_student', async(req, res, next) => {
    
    const student_id = req.query.logged_in;
    console.log("history student e dhuksi", student_id)
    const query = "SELECT * FROM appointment WHERE student_id=? ALLOW FILTERING;"
    result = await client.execute(query,[student_id], { prepare : true });
    //console.log("status : ", result.rows[0].status)
    // for(let i=0; i<result.rows.length; i++){
      
    //   if(result.rows[i].status == 'pending'){
    //     delete result[i];
    //     i--;
    //   }
    // }  
    //console.log("result:", result.rows)
    res.send({
        'results': result.rows,
    })
       
    
  });


  app.post('/update_schedule', (req, res, next) => {
    const id = req.body.id;
    const specialization = req.body.specialization;
    const sat = req.body.sat;
    const sun = req.body.sun;
    const mon = req.body.mon;
    const tue = req.body.tue;
    const wed = req.body.wed;
    const thu = req.body.thu;
    const fri = req.body.fri;

    console.log('id : ', id);
    const query = 'UPDATE doctors SET specialization=?, sat=?, sun=?, mon=?, tue=?, wed=?, thu=?, fri=? where id=?;';
    client.execute(query, [specialization, sat, sun, mon, tue, wed, thu, fri, id], { prepare : true }, function(err, result){
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

  app.post('/set_appointment', (req, res, next) => {
    const doctor_name = req.body.doctor_name;
    const student_id = req.body.student_id;
    const date = req.body.date;
    const status = 'pending';
    console.log("set appointment e elam ", date)
    const query = 'INSERT INTO appointment (id, date, doctor_name, student_id, status) VALUES (uuid(), ?, ?, ?, ?);';
    client.execute(query, [date, doctor_name, student_id, status], { prepare : true }, function(err, result){
      if(err){
          console.log('I am in error 2');
          res.send(err);
      }
      else{
          console.log('Its working');
          res.send(result);
      }
    });
    
  });

  app.post('/update_status', (req, res, next) => {
    const id = req.body.id;
    const status = req.body.status;
    console.log("status : ", status)
    console.log("ID : ", id)
    const query = 'UPDATE appointment SET status=? WHERE id=?;';
    client.execute(query, [status, id], function(err, result){
      if(err){
          console.log('I am in error 2');
          res.send(err);
      }
      else{
          console.log('Its working');
          res.send(result);
      }
    });
    
  });

  app.get('/', function(req, res){
    res.send("hello bro");
  })


app.listen(5010, () => {
    console.log("server is connected on port 5010")
})