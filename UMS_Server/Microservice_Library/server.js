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


app.post('/save_book', (req, res, next) => {
  const book_name = req.body.book_name;
  const author_name = req.body.author_name;
  const quantity = req.body.quantity;
  console.log('dhuklam server e');
 
  const query = 'INSERT INTO books (id, name, author, quantity) VALUES (uuid(), ?, ?, ?)';
  client.execute(query, [book_name, author_name, quantity], { prepare : true }, function(err, result){
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

app.get('/get_books', (req, res, next) => {
    const query = "SELECT * FROM books;"
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

  app.get('/get_borrowed_books', (req, res, next) => {
    const query = "SELECT * FROM student_book_borrow;"
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

  app.get('/get_pending_borrowed_books', (req, res, next) => {
    is_returned = false;
    const query = "SELECT * FROM student_book_borrow WHERE is_returned=? ALLOW FILTERING;"
    client.execute(query, [is_returned], function(err, result){
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

  app.get('/get_student_borrowed_books', (req, res, next) => {
    const student_id = req.query.logged_in;
    const query = "SELECT * FROM student_book_borrow WHERE student_id=? ALLOW FILTERING;"
    client.execute(query, [student_id],function(err, result){
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

  app.post('/update_books', (req, res, next) => {
    const id = req.body.id;
    const quantity = req.body.quantity;
    console.log('id : ', id);
    console.log('quantity : ', quantity)
    const query = 'UPDATE BOOKS SET quantity=? where id=?;';
    client.execute(query, [quantity, id], { prepare : true }, function(err, result){
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

  app.post('/update_borrow_info', async(req, res, next) => {
    const id = req.body.id;
    let is_returned = req.body.is_returned;
    console.log('is_returned : ', is_returned)
    is_returned = true
    
   

    const query2 = "SELECT * FROM student_book_borrow WHERE id=?;"
    await client.execute(query2,[id], { prepare : true }, async function(err, result2){
      if(err){
        console.log('I am in error');
        res.send(err);
    }
    else{
        console.log('Its working');
        book_name = ""
        book_name = result2.rows[0].book_name;
        console.log("book name :", book_name);
        const query3 = "SELECT * FROM books WHERE name=? ALLOW FILTERING;"
        result3 = await client.execute(query3, [book_name], { prepare : true });
        console.log("result3: ", result3.rows)
        quantity = result3.rows[0].quantity;

        quantity++;
        
        book_id = result3.rows[0].id;   
        const query5 = 'UPDATE books SET quantity=? WHERE id=?;'
        result5 = await client.execute(query5, [quantity, book_id], { prepare : true });  
        
        const query = 'UPDATE student_book_borrow SET is_returned=? where id=?;';
        await client.execute(query, [is_returned, id], { prepare : true }, function(err, result){
          if(err){
              console.log('I am in error');
              res.send(err);
          }
          else{
              console.log('Its working');
              res.send(result);
          }
        });
    }
    });
    
    
  });



  app.post('/grant_book', async(req, res, next) => {
    const book_name = req.body.book_name;
    const student_id = req.body.student_id;
    const date = req.body.date;
    is_returned = false;
    console.log('book id : ', book_name);
    console.log('due date : ', date)
    const query1 = "SELECT * FROM student_book_borrow WHERE student_id=? AND is_returned=? ALLOW FILTERING;"  
    result1 = await client.execute(query1, [student_id, is_returned], { prepare : true });
    if(result1.rows.length >= 10){
      res.send("Limit reached")
    }
    else{
      const query0 = 'SELECT * FROM books WHERE name=? ALLOW FILTERING;'
      result0 = await client.execute(query0, [book_name], { prepare : true });
      quantity = result0.rows[0].quantity;
      
      if(quantity > 0){
        quantity -= 1;

        const query3 = 'SELECT * FROM books WHERE name=? ALLOW FILTERING;'
        result3 = await client.execute(query3, [book_name], { prepare : true });
        book_id = result3.rows[0].id;   
        const query2 = 'UPDATE books SET quantity=? WHERE id=?;'
        result2 = await client.execute(query2, [quantity, book_id], { prepare : true });

        const query = 'INSERT INTO student_book_borrow (id, student_id, book_name, due_date, is_returned) VALUES (uuid(), ?, ?, ?, False)';
        client.execute(query, [student_id, book_name, date], { prepare : true }, function(err, result){
          if(err){
              console.log('I am in error');
              res.send(err);
          }
          else{
              console.log('Its working');
              res.send(result);
          }
        });
      }
      else{
        res.send("No book available");
      }
    }
    
  });

app.listen(5009, () => {
    console.log("server is connected on port 5009")
})