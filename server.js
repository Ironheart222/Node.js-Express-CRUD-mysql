const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
const { json } = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'localhost',
    password: 'hemang am',
    database: 'emp',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Listining on 3000'));


//Get all employees
app.get('/employees', (req, res) => {
    mysqlConnection.query('SELECT * FROM emp.employee;', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get an employees
app.get('/employees/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM employee WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an employees
app.delete('/employees/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM employee WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

// Insert an employees
app.post('/employees', async(req, res) => {
    let emp = req.body;
    console.log(req.body);
    var sql = "SET @id= ?;  SET @name = ?;  SET @address = ?; \
    CALL EmployeeAddOrEdit (@id,@name,@address);";
    mysqlConnection.query(sql, [emp.id, emp.name, emp.address], (err, rows) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.json(element);
            });
        else
            res.json(err);
            console.log(err);
    })
});


//Update an employees
app.put('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @id = ?;SET @name = ?;SET @address = ?; \
    CALL EmployeeAddOrEdit(@id, @name, @address);";
    mysqlConnection.query(sql, [emp.id, emp.name, emp.address], (err, rows, fields) => {
        if (!err)
            res.json(emp);
        else
            console.log(err);
    })
});
