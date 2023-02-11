const express = require('express')
const app = express()
const cors = require('cors')
var uuid = require('uuid')



const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')



app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true

}));


app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
  key: 'userID',
  secret: 'secretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60*60*24
  },
}))


var cassandra = require('cassandra-driver');

var client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter:'datacenter1',
  keyspace: 'ums'
});



app.post('/admin/addStudent', async (req, res, next) => {
  console.log("helooooooooooooooo")

  var uidPresentAdd = uuid.v4();
  var uidParmanentAdd = uuid.v4();
  var uidPersonalInfo = uuid.v4();
    
  var name = req.body.name;
  var phoneNumber = req.body.phoneNumber;
  var nid = req.body.nid;
  var gender = req.body.gender;
  var bcn = req.body.bcn;
  var religion = req.body.religion;
  var countryPre = req.body.countryPre;
  var districtPre = req.body.districtPre;
  var thanaPre = req.body.thanaPre;
  var postOfficePre = req.body.postOfficePre;
  var addressPre = req.body.addressPre;
  var countryPar = req.body.countryPar;
  var districtPar = req.body.districtPar;
  var thanaPar = req.body.thanaPar;
  var postOfficePar = req.body.postOfficePar;
  var addressPar = req.body.addressPar;
  var gmail = req.body.gmail;
  var studentId = req.body.studentId;
  var username = req.body.username;
  var deptName = req.body.deptName;
  var dob = req.body.dob;
  var loggedInName = req.body.loggedInName;

  // print all the above variables previously defined
  console.log("name ---- --- ", name);
  console.log("phoneNumber ---- --- ", phoneNumber);
  console.log("nid ---- --- ", nid);
  console.log("gender ---- --- ",gender);
  console.log("bcn ---- --- ", bcn);
  console.log("religion --- --- - ", religion);
  console.log("countryPre ---- --- ", countryPre);
  console.log("districtPre ---- --- ", districtPre);
  console.log("thanaPre ---- --- ", thanaPre);
  console.log("postOfficePre ---- --- ", postOfficePre);
  console.log("addressPre ---- --- ", addressPre);
  console.log("countryPar ---- --- ", countryPar);
  console.log("districtPar ---- --- ", districtPar);
  console.log("thanaPar ---- --- ", thanaPar);
  console.log("postOfficePar ---- --- ", postOfficePar);
  console.log("addressPar ---- --- ", addressPar);
  console.log("gmail ---- --- ", gmail);
  console.log("studentId ---- --- ", studentId);
  console.log("username ---- --- ", username);
  console.log("deptName ---- --- ", deptName);
  console.log("dob ---- --- ", dob);
  console.log("loggedInName ---- --- ", loggedInName);
  console.log("date:    ", dob.substring(0,10));


  var password = "12345";
  
  deptResult = await client.execute('Select id from department_by_name where name = ?;', [deptName]);
  var deptId = deptResult.rows[0].id;
  
  result = await client.execute('Insert into address(id, country, district, name, post_office, thana) values(?, ?, ?, ?, ?, ?);', [uidPresentAdd, countryPre, districtPre, addressPre, postOfficePre, thanaPre]);
  result = await client.execute('Insert into address(id, country, district, name, post_office, thana) values(?, ?, ?, ?, ?, ?);', [uidParmanentAdd, countryPar, districtPar, addressPar, postOfficePar, thanaPar]);


  result = await client.execute('Insert into personal_info(id, birth_certificate_no, dob, gender, gmail, name, nid, permanent_address_id, phone, present_address_id, religion) values(?, ?, ?, ?,?,?,?,?,?, ?, ?);', [uidPersonalInfo, bcn, dob, gender, gmail, name, nid, uidPresentAdd, phoneNumber, uidParmanentAdd, religion]);
  result = await client.execute('Insert into student_by_student_id(student_id, dept_id, personal_info_id, username, password) values(?, ?, ?, ?, ?)', [studentId, deptId, uidPersonalInfo, username, password ]);


  res.send({
    msg: "done",
  });
})


app.get('/advisor/seeStudentProfile', async(req, res, next)=>{
  var advisor_id = req.query.advisor_id;
  result = await client.execute('Select * from  student_advisor_by_advisor_id  where advisor_id = ?', [advisor_id]);

  res.send({
    data: result.rows,
  })
});


app.get('/student/profile', async(req, res, next)=>{
  // var student_id = req.query.student_id;
  
  // result = await client.execute('select * from student_by_student_id where student_id = ?', [student_id]);
  // personalInfoId = result.rows[0].personal_info_id;
  // dept_id = result.rows[0].dept_id; 

  // personalInfo = await client.execute('select * from personal_info where id = ?', [personalInfoId]);
  // deptName = await client.execute('select name from department_by_id where id = ?', [dept_id]);

  // presentAddress = await client.execute('select * from address where id = ?', [personalInfo.rows[0].present_address_id]);
  // permanentAddress = await client.execute('select * from address where id = ?', [personalInfo.rows[0].permanent_address_id]);
  
  // res.send({
  //   name: personalInfo.rows[0].name,
  //   phoneNumber: personalInfo.rows[0].phone,
  //   nid: personalInfo.rows[0].nid,
  //   gender: personalInfo.rows[0].gender,
  //   bcn: personalInfo.rows[0].birth_certificate_no,
  //   countryPre: presentAddress.rows[0].country,
  //   districtPre: presentAddress.rows[0].district,
  //   thanaPre: presentAddress.rows[0].thana,
  //   postOfficePre: presentAddress.rows[0].post_office,
  //   addressPre: presentAddress.rows[0].name,
  //   countryPar: permanentAddress.rows[0].country,
  //   districtPar: permanentAddress.rows[0].district,
  //   thanaPar: permanentAddress.rows[0].thana,
  //   postOfficePar: permanentAddress.rows[0].post_office,
  //   addressPar:   permanentAddress.rows[0].name,
  //   gmail:  personalInfo.rows[0].gmail,
  //   studentId:  result.rows[0].student_id,
  //   username: result.rows[0].username,
  //   deptName: deptName.rows[0].name,
  // })
})

app.listen(5015, () => {
    console.log("server is connected on port 5015")
})