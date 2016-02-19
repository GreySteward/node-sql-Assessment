var express = require('express');
var router =  express.Router();
var path = require('path');
// bring in pg module
var pg = require('pg');
var connectionString = '';


if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/animals';
}
//
router.post('/animals', function(req, res) {
    console.log("hello");
    var addPerson = {
        animalid: req.body.animalid,
        animalname: req.body.animalname,
        animalname: req.body.animalname,
    };

    pg.connect(connectionString, function (err, client, done) {
        client.query("INSERT INTO animals (animalid, animalname, animalnumber) "  +
            "VALUES " + "($1, $2, $3) RETURNING animals",
            [addPerson.employee_id, addPerson.employee_firstname, addPerson.employee_jobtitle,
                addPerson.employee_salary],
            function (err, result) {
                done();
                if (err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });
});

router.get('/', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM animals;');

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // close connection
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }
    });
});

module.exports = router;