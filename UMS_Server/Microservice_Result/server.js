const express = require('express')
const app = express()
const cors = require('cors')
var uuid = require('uuid');

app.use(express.json());
app.use(cors());

var cassandra = require('cassandra-driver');
var logged_in = ""

var client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter:'datacenter1',
  keyspace: 'ums'
});


  app.get('/get_sessions_depts', function(req, res, next) {
    var depts, sessions;
    // const query = 'SELECT * FROM department';
    //   client.execute(query, [], function(err, result){
    //     if(err){
    //       console.log("error!", err)
    //       res.status(404).send({msg:err});
    //     }
    //     else{
          const query2 = 'SELECT * FROM session';
          client.execute(query2, [], function(err, result2){
          if(err){
            res.status(404).send({msg:err});
          }
          else{
            res.send({
              'sessions': result2.rows,
            })
        }
      })
      
    });

    
    let session_id;
    app.get('/get_courses', async function(req, res, next) {
      // const teacher_id = req.query.teacher_id;
      // session_id = req.query.session_id;
      // //console.log("session id is : ", session_id)

      // resultDeptInfo = await client.execute('SELECT dept_id FROM teacher_by_username WHERE teacher_id = ? allow filtering;',[teacher_id]);
      // var dept_id = resultDeptInfo.rows[0].dept_id;

      // const query = 'SELECT * FROM offered_course_by_level_term_session_id WHERE session_id=? ALLOW FILTERING;';
      //   client.execute(query, [session_id], { prepare : true }, function(err, result){
      //     if(err){
      //       console.log("error!", err)
      //       res.status(404).send({msg:err});
      //     }
      //     else{
            
            
      //         var query2 = 'SELECT * FROM course WHERE id IN (' + result.rows[0].course_id;
      //         for(let i=1; i<result.rows.length; i++){
      //           query2 += ', ' + result.rows[i].course_id;
      //         }
      //         query2 += ')';
      //         //console.log("query 2 : ", query2)
              
      //         client.execute(query2, [], function(err, result2){
      //         if(err){
      //           res.status(404).send({msg:err});
      //         }
      //         else{
      //           //console.log("output2 : ", result2.rows)
      //           for(let i=0; i<result2.rows.length; i++){
      //             if(result2.rows[i].dept_id != dept_id){
      //               result2.delete(i);
      //               i--;
      //             }
      //           }
      //           //console.log("final result holo: ", result2.rows);
      //           res.send({
      //             'courses': result2.rows,
      //           })
      //     }
      //   })
      //    }
      //   })
      const teacher_name = req.query.teacher_id;
      session_id = req.query.session_id;
      //var teacher_name = req.query.username;
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
    courses: tmpList,
  })
        
      });

app.get('/get_results', (req, res, next) => {
  res.send(result)
});
let result = [];

app.post('/result_file', async (req, res, next) => {
  const array = req.body.data;
  const offered_course_id = req.body.course;
  const session_id = req.body.session;
  console.log("array is: ", array)
  console.log("offered course id is: ", offered_course_id)
  console.log("session: ", session_id)

  courseInfo = await client.execute('select course_id from offered_course where id = ?', [offered_course_id]);
  course_id = courseInfo.rows[0].course_id

  console.log("offered_ccourse_id: ", offered_course_id)
  
  result = await client.execute('select name from Evaluation_item_by_offered_course_id where offered_course_id = ?', [offered_course_id])
  result = result.rows


  courseInfo = await client.execute('select course_label from course where id = ?', [course_id]);
  courseLabel = courseInfo.rows[0].course_label;

  sessionInfo = await client.execute('select label from session where id = ?', [session_id]);
  sessionLabel = sessionInfo.rows[0].label;

  var tableName = courseLabel + sessionLabel


  var counter = 1;
  var keyWord = ["id"];

  var query = 'Insert into  ' + courseLabel + '_' + sessionLabel + '( id'
  for(let i = 0; i < result.length; i++){
    if(result[i].name === 'CT'){
      counter += 4;
      query = query + ', CT1, CT2, CT3, CT4';
      keyWord.push("CT1");
      keyWord.push("CT2");
      keyWord.push("CT3");
      keyWord.push("CT4");

      continue; 
    }
    counter++;
    query = query + ', '  + result[i].name;
    keyWord.push(result[i].name)
  }

  query = query + ') values( ? ';

  for(let i = 1; i < counter; i++){
    query = query + ', ?';
  }
  query = query + ');'


  
  for(let i = 0; i < array.length - 1; i++){
    var final_marks  = 0.0;
    var student_id = array[i][keyWord[0]]
    var minCT = 100.0;
    data = []
    for(let j = 0; j < counter; j++){
      if(j == 0)
        data.push(array[i][keyWord[j]]);
      else{ 
        data.push(parseFloat(array[i][keyWord[j]]))
        final_marks += data[j];

        if(keyWord[j] === 'CT1' || keyWord[j] === 'CT2'|| keyWord[j] === 'CT3'||keyWord[j] === 'CT4'){
            if(data[j] < minCT ) minCT = data[j];
        }
      }
    
    }

    if(minCT < 100.0){
      final_marks -= minCT;
    }

    gradePoint = 0.0;
    gpa = ''

      if(final_marks >= 80){
        gpa = 'A+';
      gradePoint = 4.00;
    }
    else if(final_marks < 80 && final_marks >=75){
      gpa = 'A';
      gradePoint = 3.75;
    }
    else if(final_marks < 75 && final_marks >=70){
      gpa = 'A-';
      gradePoint = 3.50;
    }
    else if(final_marks < 70 && final_marks >=60){
      gpa = 'B';
      gradePoint = 3.25;
    }
    else if(final_marks < 60 && final_marks >=50){
      gpa = 'C';
      gradePoint = 3.00;
    }
    else if(final_marks < 50 && final_marks >=40){
      gpa = 'D';
      gradePoint = 2.70;
    }
    else{
      gpa = 'F';
      gradePoint = 0.00;
    }

    var uid = uuid.v4()

    saveInfo = await client.execute('insert into registered_course_by_student_id(id, student_id, course_id, gpa, gradepoint, session_id) values(?,?,?,?,?,?)', [uid, student_id, course_id, gpa, gradePoint, session_id])
    

    resultInfo = await client.execute(query, data);

    console.log("data: ", data);
  }

  console.log("query: ", query);
  console.log('keyword: ', keyWord);




  res.send({
    data: "success",
  })

});

app.get('/getresult', async(req, res, next)=>{
  var student_id = req.query.student_id
  var level = parseInt(req.query.level);
  var term = parseInt(req.query.term);

  console.log("student id : ", student_id)
  // print level and term
  console.log("level: ", level)
  console.log("term: ", term)

  result = await client.execute('select * from registered_course_by_student_id where student_id = ?', [student_id])
  result = result.rows

  var tmpList = result
  var finalTmpList = [];
  

  console.log(tmpList)
  var cgpa = 0.0;
  var totalSubject = 0;
  for(let i = 0; i < result.length; i++){
    var course_id = tmpList[i].course_id
    console.log("course_id", course_id)
    courseInfo = await client.execute('select course_title, course_label, credit, level, term from course where id = ?', [course_id])
    courseInfo = courseInfo.rows
    tmpList[i]['course_title'] = courseInfo[0].course_title;
    tmpList[i]['course_label'] = courseInfo[0].course_label;
    tmpList[i]['credit'] = courseInfo[0].credit;
    // print course info level and term
    console.log("course_label: ", courseInfo[0].course_label)
    console.log("level: ", courseInfo[0].level)
    console.log("term: ", courseInfo[0].term)
    if(courseInfo[0].level === level && courseInfo[0].term === term){
          console.log("herere")
          cgpa = cgpa + (tmpList[i].gradepoint * tmpList[i].credit);
          totalSubject = totalSubject + tmpList[i].credit;
           finalTmpList.push(tmpList[i]); 
    }
  }

  cgpa = cgpa / totalSubject;
  console.log("cgpa: ", cgpa)
  for(let i = 0; i < finalTmpList.length; i++){
    finalTmpList[i]['cgpa'] = cgpa;
  }


  res.send({
    data: finalTmpList,
    'cgpa': cgpa,
  })


})



app.listen(5004, () => {
    console.log("server is connected on port 5004")
})