const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const mysql = require('mysql');
const connection = require('./mysqlConnection');

/*
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'list_app',
});
*/

app.get('/', (req, res) => {
  res.render('top.ejs')
});

app.get('/index', (req, res) => {
  connection.query(
    'select * from items;',
    (error,results) => {
      //if (error) throw error; //errorの場合
      console.log(results);
      res.render('index.ejs', {items: results});
    }
  );
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM items',
    (error, results) => {
      console.log(results);
      res.render('index.ejs', {items: results});
    }
  );
});

app.get('/edit/:id', (req, res) => {
  connection.query(
    'select * from items where id = ?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {item: results[0]});
    }
  );
});

app.post('/create', (req, res) => {
  var nextId=0;
  connection.query(
    'SELECT (max(id)+1) as maxId FROM items',
    (error, results) => {
      nextId=results[0].maxId;
      connection.query(
        'insert into items (id, name) values (?,?)',
        [nextId, req.body.itemName],
        (error, results) => {
          res.redirect('/index');
        }
      );
    }
  );
});

app.post('/delete/:id', (req, res) => {
  connection.query(
    'delete from items where id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.post('/update/:id', (req, res) => {
  connection.query(
    'update items set name = ? where id = ?',
    [req.body.itemName, req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.listen(3000);
