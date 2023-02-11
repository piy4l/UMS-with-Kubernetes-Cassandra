const express = require('express')
const app = express()
const cors = require('cors')
var uuid = require('uuid')



app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true

}));




var cassandra = require('cassandra-driver');


var client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter:'datacenter1',
  keyspace: 'ums'
});

app.post('/head/addcourse', (req, res, next) => {
  console.log("helooooooooooooooo")
  var deptName = req.body.deptName;
  var courseName = req.body.courseName;
  var courseID = req.body.courseID;
  var creditHour = parseFloat(req.body.creditHour);
  var level = parseInt(req.body.level);
  var term = parseInt(req.body.term);
  var type = req.body.type;
  var uid1 = uuid.v4();

  console.log("uil gdgdg", typeof uid1);
  var uid2 = uuid.v4();
  console.log("deptName: ", deptName);
  console.log(typeof level);
  console.log("uuid: ", uid1);
  const query = 'SELECT * FROM Department_by_name WHERE name = ?';
  client.execute(query, [deptName], function(err, result){
    if(err){
      res.status(404).send({msg:err});
    }
    else{
      console.log(result.rows);
      if(result.rows.length > 0){
        uid2 = result.rows[0].id;

        console.log("deptID: ", uid2);
        console.log(typeof uid2);

        const query1 = 'INSERT INTO Course(id, course_label, course_title, level, term, credit, type, dept_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        const query2 = 'INSERT INTO Course_by_level_term(id, course_label, course_title, level, term, credit, type, dept_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        const query3 = 'INSERT INTO Course_by_dept_id(id, course_label, course_title, level, term, credit, type, dept_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        const queries = [
              { query: query1, params: [uid1, courseID, courseName, level, term, creditHour, type, uid2] },
              { query: query2, params: [uid1, courseID, courseName, level, term, creditHour, type, uid2] } ,
              { query: query3, params: [uid1, courseID, courseName, level, term, creditHour, type, uid2] } ,
        ];
        // Promise-based call
        client.batch(queries, { prepare: true })
        .then(function() {
        // All queries have been executed successfully
          res.send({
            status: "yes",
            course_id: uid1,
          });
        })
        .catch(function(err) {
          console.log("errrrr:  ", err);
          res.send({
            status:"no",
          });
        });
      }
    }
  })
  
})


app.get('/courselist', async(req, res, next)=>{
  var headName = req.query.headName;

  deptResult = await client.execute('Select dept_id from head_by_teacher_id where teacher_id  = ?', [headName])
  var dept_id = deptResult.rows[0].dept_id;

  result = await client.execute('SELECT * from course_by_dept_id where dept_id = ?', [dept_id]);

  res.send({
    data: result.rows,
  })
})


app.get('/head/getTeacherList', async (req, res, next)=>{
  //const dept_name = req.query.dept_name;
  const headId = req.query.headId;

  console.log("printing ....   ", headId)

  result = await client.execute('Select dept_id from head_by_teacher_id where teacher_id  = ?', [headId])

  console.log(result.rows)
  const dept_id = result.rows[0].dept_id
  teacherList = await client.execute('Select  username , personal_info_id from teacher_by_dept_id where dept_id = ?', [dept_id])
  console.log("tacher list: ", teacherList);

  // teacherInfo = await client.execute('Select name from personal_info where id = ?', [teacher])

  res.send({
    data: teacherList.rows,
  })
})


app.post('/head/singleoffercourse/saveteacher', async (req, res, next)=>{
  var teacher_name = req.body.teacher;

  console.log(teacher_name, " --------- ")
  var offer_course_id = req.body.offerCourseId;

  result = await client.execute('Insert into teacher_offerCourse(teacher_username, offerCourseId) values(?, ?)', [teacher_name, offer_course_id]);

  res.send({
    status: "success",
  })


})

app.get('/head/getCourse', async (req, res, next)=>{
    var level = parseInt(req.query.level)
    var term = parseInt(req.query.term);
    const headId = req.query.headId;

    // console.log("printing ....   ", level, term, dept_name)
    // deptResult = await client.execute(, [headId])


    const query = 'Select dept_id from head_by_teacher_id where teacher_id  = ?';
    client.execute(query, [headId], function(err, result){
      if(err){
        console.log(err)
        res.status(404);
      }
      else{ 
        var dept_id = result.rows[0].dept_id;
        console.log(dept_id)
        const query2 = 'Select * from course_by_level_term where level = ? and term = ? and dept_id = ?';
        client.execute(query2, [level, term, dept_id], { hints : ['int', 'int'] }, function(err, result){
          if(err){
            console.log(err);
            res.status(404);
          }
          else{
            res.send({
              data: result.rows,
            })
          }
        })

      
      }
    })
})


app.post('/head/offercourse', (req, res, next)=>{
    var offerCourseList = req.body.offered_course_id;
    var level = req.body.level;
    var term = req.body.term;
    
    console.log(offerCourseList);
    for(var i = 0; i < offerCourseList.length; i++){
      var uid1 = uuid.v4();
      var uid2 = uuid.v4();
      const query1 = 'INSERT INTO offered_course(id, course_id, level, term, session_id) VALUES(?, ?, ?, ?, ?)';
      const query2 = 'INSERT INTO offered_course_by_level_term_session_id(id, course_id, level, term, session_id) VALUES(?, ?, ?, ?, ?)';
      const query3 = 'INSERT INTO offered_course_by_course_id(id, course_id, level, term, session_id) VALUES(?, ?, ?, ?, ?)';
      const queries = [
        { query: query1, params: [uid1, offerCourseList[i], level, term, '12953e05-e41e-45ad-a61f-5718cbc0e600'] },
        { query: query2, params: [uid1, offerCourseList[i], level, term, '12953e05-e41e-45ad-a61f-5718cbc0e600'] },
        { query: query3, params: [uid1, offerCourseList[i], level, term, '12953e05-e41e-45ad-a61f-5718cbc0e600'] },
        
      ];

      client.batch(queries, { prepare: true })
        .then(function() {
          console.log("i = ", i , "  done!");
        })
        .catch(function(err) {
          console.log("errrrr:  ", err);
        });
    }
    
    res.send({
      status: true,
    })



})


app.get('/head/showofferlist', async function(req, res, next){
  var filterResult = []

  var deptName = req.query.deptName;
  console.log(deptName);

  result = await client.execute('SELECT id FROM Department_by_name WHERE name = ?', [deptName])
 
  console.log(result.rows);
  var dept_id = result.rows[0].id;
  
  console.log("dept id : ", dept_id)
  courseList = await client.execute('SELECT * from course_by_dept_id where dept_id = ?', [dept_id]);
      
  console.log("course list: ", courseList.rows);

  var tmpResult = courseList.rows;

          
  for(let i = 0; i < tmpResult.length; i++){
    
    offerCourse = await client.execute('Select id from offered_course_by_course_id where course_id = ?', [tmpResult[i].id])

    console.log("res res res ", offerCourse.rows)

    if(offerCourse.rows.length > 0 ){
      tmpResult[i]["offer_course_id"] = offerCourse.rows[0].id
      filterResult.push(tmpResult[i])
    }
  }
        
  console.log("filter result : ", filterResult)

  res.send({
    data: filterResult,
  })
})


app.get('/head/singleoffercourse', async function(req, res, next){
  console.log("hello")
  var offer_course_id = req.query.offerCourseId;
  console.log("course-id: ", offer_course_id);

  result = await client.execute('SELECT course_id FROM offered_course WHERE id = ?', [offer_course_id])
 
  console.log(result.rows);
  var course_id = result.rows[0].course_id;
  
  console.log("course id : ", course_id)
  courseData = await client.execute('SELECT * from course WHERE id = ?', [course_id]);

  deptResult = await client.execute('Select name from department where id = ?', [courseData.rows[0].dept_id]);
      
  res.send({
    data: courseData.rows,
  })

})

app.get('/singlecourse', (req, res, next)=>{
  var course_id = req.query.courseId;
  console.log("course-id: ", course_id);

  const query = 'SELECT * from course where id = ?';
  client.execute(query, [course_id], function(err, result){
    if(err){
      console.log(err);
      res.status(404).send({msg:err});
    }
    else{
      var courseData = result.rows;
      
      const dept_id = result.rows[0].dept_id;
      console.log(dept_id);
      const query1 = 'SELECT name FROM Department where id = ?';
      client.execute(query1, [dept_id], function(err, result){
        if(err){
          console.log(err);
        }
        else{
          console.log("undefine value???: ", result.rows);
          for(let i  =0; i < courseData.length; i++){
            courseData[i]["dept_name"] = result.rows[0].name;
          }
          console.log(courseData);
          res.send({
              data: courseData,
              // dept_name: result.rows[0].name,
          })
        }
      })
    }
  })
})

// app.get('/offeredcourse', (req, res, next)=>{
//   //var course_id = req.query.courseId;
//   //console.log("course-id: ", course_id);

//   const query = 'SELECT * from offered_course';
//   client.execute(query, [], function(err, result){
//     if(err){
//       console.log(err);
//       res.status(404).send({msg:err});
//     }
//     else{
//           console.log(result.rows)
//           res.send({
//               data: result.rows,
//               // dept_name: result.rows[0].name,
//           }) 
//     }
//   })
// })








app.get('/teacher/getassigncourse', async(req, res, next)=>{
  var teacher_name = req.query.username;
  var tmpList = []
  console.log("------", teacher_name);

  teacherResult = await client.execute('select username from teacher_by_username where teacher_id = ? allow filtering', [teacher_name]);
  var teacher_username = teacherResult.rows[0].username;
  
  result = await client.execute('select offerCourseId from teacher_offercourse where teacher_username = ?', [teacher_username]);
  tmpList = result.rows

  console.log(tmpList);
  
  for(let i = 0; i < tmpList.length; i++){
    console.log("id --- - ", tmpList[i].offercourseid);
    courseId = await client.execute('select course_id from offered_course where id = ?', [tmpList[i].offercourseid])
    courseId = courseId.rows
    courseInfo = await client.execute('select course_title from course where id = ?', [courseId[0].course_id]);
    tmpList[i]["course_title"] = courseInfo.rows[0].course_title
  }

  res.send({
    data: tmpList,
  })
})


app.post('/teacher/addoutline/addtype', async(req, res, next)=>{
  var offer_course_id = req.body.offerCourseId;

  console.log("hahflafjlajf")
  console.log(offer_course_id)
  var name = req.body.name;
  var weight = parseFloat(req.body.weight);


  var uid1 = uuid.v4();
  
    const query1 = 'INSERT INTO Evaluation_item(id, name, weight, offered_course_id) VALUES(?, ?, ?, ?)';
    const query2 = 'INSERT INTO Evaluation_item_by_offered_course_id(id, name, weight, offered_course_id) VALUES(?, ?, ?, ?)';
    
    const queries = [
      { query: query1, params: [uid1, name, weight, offer_course_id] },
      { query: query2, params: [uid1, name, weight, offer_course_id] },
      
    ];

    client.batch(queries, { prepare: true })
      .then(function() {
        res.send({
          status: true,
        })
      })
      .catch(function(err) {
        console.log("errrrr:  ", err);
      });
  
})




app.post('/teacher/getevaluationitem', async(req, res, next)=>{
  var offered_course_id = req.body.offered_course_id;
  
  console.log(offered_course_id, " fadhfafdjalfjl  ")
  
  
  result = await client.execute('select * from Evaluation_item_by_offered_course_id where offered_course_id = ?', [offered_course_id]);
  console.log(result.rows)

  res.send({
    data: result.rows,
  })
})


app.get('/teacher/publishOutline', async(req, res, next)=>{
  var offered_course_id = req.query.offered_course_id;
  result = await client.execute('select name from Evaluation_item_by_offered_course_id where offered_course_id = ?', [offered_course_id])
  result = result.rows

  offerCourseInfo = await client.execute('select course_id, session_id from offered_course where id = ?', [offered_course_id]);
  course_id = offerCourseInfo.rows[0].course_id;
  session_id = offerCourseInfo.rows[0].session_id;

  courseInfo = await client.execute('select course_label from course where id = ?', [course_id]);
  courseLabel = courseInfo.rows[0].course_label;


  sessionInfo = await client.execute('select label from session where id = ?', [session_id]);
  sessionLabel = sessionInfo.rows[0].label;


  console.log("title : ", courseLabel, " session: ", sessionLabel);

  var query = 'Create table ' + courseLabel + '_' + sessionLabel + '( id text PRIMARY KEY'
  for(let i = 0; i < result.length; i++){
    if(result[i].name === 'CT'){
      query = query + ', CT1 double, CT2 double, CT3 double, CT4 double';
      continue; 
    }
    query = query + ', '  + result[i].name + ' double'
  }

  query = query + ');'

  console.log("hoise ki? ", query)
  creationTable = await client.execute(query, []);
  res.send({
    data: "success",
  })
})

app.get('/student/offeredCourses', async(req, res, next)=>{
  var level = parseInt(req.query.level);
  var term = parseInt(req.query.term);
  

  result = await client.execute('select * from session', []);
  sessionId = result.rows[0].id;

  console.log("session id : ", sessionId)
  console.log("level : ", level)
  console.log("term : ", term)
  console.log("type: ", typeof level)

  result = await client.execute('select * from offered_course_by_level_term_session_id where level = ? and term = ? and session_id = ?;', [level, term, sessionId],{ prepare : true });
  
  
 // courseData = await client.execute('select * from course where id = ?', [result.rows[0].course_id]);
  var tmpList = result.rows
  for(let i = 0; i < result.rows.length; i++){
    //console.log("id --- - ", tmpList[i].offercourseid);
    courseInfo = await client.execute('select course_title, course_label, level, term, credit, type  from course where id = ?', [result.rows[i].course_id]);
    tmpList[i]["course_title"] = courseInfo.rows[0].course_title;
    tmpList[i]["course_label"] = courseInfo.rows[0].course_label;
    tmpList[i]["level"] = courseInfo.rows[0].level;
    tmpList[i]["term"] = courseInfo.rows[0].term;
    tmpList[i]["credit"] = courseInfo.rows[0].credit;
    tmpList[i]["type"] = courseInfo.rows[0].type;
  }

  
  res.send({
    data: tmpList,
  })
});


app.post('/student/offer_course_register', async(req, res, next)=>{
  var offered_course_id = req.body.offered_course_id;
  var student_id = req.body.student_id;

  // print both of them
  console.log(offered_course_id, "  ", student_id);
  

  for(let i = 0; i < offered_course_id.length; i++){
    var stateUid = uuid.v4();
    var requestUid = uuid.v4();
    result = await client.execute('insert into req_course_state(id, state) values(?, ?)', [stateUid, "pending"]);
    result = await client.execute('insert into request_course(id, current_student_id, offered_course_id, student_id) values(?, ?, ?, ?)', [requestUid, stateUid, offered_course_id[i], student_id]);
    result = await client.execute('insert into request_course_by_student_id(id, current_student_id, offered_course_id, student_id) values(?, ?, ?, ?)', [requestUid, stateUid, offered_course_id[i], student_id]);
  }
  
  res.send({
    data: "success",
  })

});




// to show req course to student
app.get('/student/requestedCourses', async(req, res, next)=>{
  var student_id = req.query.student_id;

  console.log("student id : ", student_id)
  result = await client.execute('select * from request_course_by_student_id where student_id = ?', [student_id]);
  console.log("kfjakjflkajdlfjaldfjlk    ", result.rows)
  
  tmpList = result.rows

  for(let i = 0; i < result.rows.length; i++){
    courseInfo = await client.execute('select * from offered_course where id = ?', [result.rows[i].offered_course_id]);
    course_id = courseInfo.rows[0].course_id;
    courseInfo = await client.execute('select course_title, course_label, level, term, credit, type  from course where id = ?', [course_id]);
    tmpList[i]["course_title"] = courseInfo.rows[0].course_title;
    tmpList[i]["course_label"] = courseInfo.rows[0].course_label;
    tmpList[i]["level"] = courseInfo.rows[0].level;
    tmpList[i]["term"] = courseInfo.rows[0].term;
    tmpList[i]["credit"] = courseInfo.rows[0].credit;
    tmpList[i]["type"] = courseInfo.rows[0].type;

    stateInfo = await client.execute('select state from req_course_state where id = ?', [result.rows[i].current_student_id]);
    tmpList[i]["state"] = stateInfo.rows[0].state;
  }

  console.log("printeed tmpList", tmpList)
  res.send({
    data: tmpList,
  })

})

/// show the student list to advisor

app.get('/advisor/requestedCourses', async(req, res, next)=>{
  var advisor_id = req.query.advisor_id;
  result = await client.execute('Select * from  student_advisor_by_advisor_id  where advisor_id = ?', [advisor_id]);

  console.log("student id : ", result.rows)
  tmpList = result.rows
  tmpAcceptedList = []
  tmpPendingList = []

  for(let i = 0; i < result.rows.length; i++){
    requestCourse = await client.execute('select * from request_course_by_student_id where student_id = ?', [result.rows[i].student_id]);

    if(requestCourse.rows.length == 0){
      continue;
    }
    console.log("request course : ", requestCourse.rows[0])
    console.log("request course 0 current_student_id : ", requestCourse.rows[0].current_student_id)
    reqState = await client.execute('select state from req_course_state where id = ?', [requestCourse.rows[0].current_student_id]);

    reqState = reqState.rows[0].state;
    if(reqState === "pending"){
      tmpPendingList.push(result.rows[i]);
    }
    else{
      tmpAcceptedList.push(result.rows[i]);
    }
  }

  res.send({
    data: {
      accepted: tmpAcceptedList,
      pending: tmpPendingList,
    },
  })
});

/// for advisor to accept the request
app.get('/advisor/acceptCourses', async(req, res, next)=>{
  var student_id = req.query.student_id;

  console.log("student id : ", student_id)
  result = await client.execute('select * from request_course_by_student_id where student_id = ?', [student_id]);
  console.log("kfjakjflkajdlfjaldfjlk    ", result.rows)
  
  tmpList = result.rows

  for(let i = 0; i < result.rows.length; i++){
    courseInfo = await client.execute('select * from offered_course where id = ?', [result.rows[i].offered_course_id]);
    course_id = courseInfo.rows[0].course_id;
    courseInfo = await client.execute('select course_title, course_label, level, term, credit, type  from course where id = ?', [course_id]);
    tmpList[i]["course_title"] = courseInfo.rows[0].course_title;
    tmpList[i]["course_label"] = courseInfo.rows[0].course_label;
    tmpList[i]["level"] = courseInfo.rows[0].level;
    tmpList[i]["term"] = courseInfo.rows[0].term;
    tmpList[i]["credit"] = courseInfo.rows[0].credit;
    tmpList[i]["type"] = courseInfo.rows[0].type;

    stateInfo = await client.execute('select state from req_course_state where id = ?', [result.rows[i].current_student_id]);
    tmpList[i]["state"] = stateInfo.rows[0].state;
  }

  console.log("printeed tmpList", tmpList)
  res.send({
    data: tmpList,
  })

})


/// advisor accepted

app.post('/advisor/accepted', async(req, res, next)=>{
  var offered_course_id = req.body.offered_course_id;
  var student_id = req.body.student_id;

  // print both of them
  console.log("advisor accepted");
  console.log(offered_course_id, "  ", student_id);
  

  for(let i = 0; i < offered_course_id.length; i++){
    var stateUid = uuid.v4();
    // var requestUid = uuid.v4();
    requestCourseInfo = await client.execute('select id from request_course_by_student_id where student_id = ?;', [student_id]);
    requestCourseId = requestCourseInfo.rows[i].id;

    result = await client.execute('insert into req_course_state(id, state) values(?, ?)', [stateUid, "advisor_accepted"]);
    result = await client.execute('update request_course set current_student_id = ? where id = ?;', [stateUid, requestCourseId]);
    result = await client.execute('update request_course_by_student_id set current_student_id = ? where id = ? and student_id = ?;', [stateUid, requestCourseId, student_id]);
    // result = await client.execute('insert into request_course(id, current_student_id, offered_course_id, student_id) values(?, ?, ?, ?)', [requestUid, stateUid, offered_course_id[i], student_id]);
    // result = await client.execute('insert into request_course_by_student_id(id, current_student_id, offered_course_id, student_id) values(?, ?, ?, ?)', [requestUid, stateUid, offered_course_id[i], student_id]);
  }
  
  res.send({
    data: "success",
  })

});
 

app.listen(5002, () => {
    console.log("Course server is connected on port 5002")
})