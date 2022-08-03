const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
    //catch error if there is one
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to database');
    }
});

const app = express();
const axios = require('axios');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.listen(5000, () => {
    console.log('Server started');
});

app.get("/api/team", (req, res) => {

    db.all("SELECT * FROM team", (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.json(rows);
        }
    });
});

app.get("/api/team/:id", (req, res) => {


    db.get("SELECT * FROM team WHERE id = ?", [req.params.id], (err, row) => {
        if (err) {
            console.log(err);
        } else {
            res.json(row);
        }
    });
});

app.post("/api/team", (req, res) => {
    db.run("INSERT INTO team (name, city, state, championships, years_in_leauge, years_in_team) VALUES (?, ?, ?, ?, ?, ?)", [req.body.name, req.body.city, req.body.state, req.body.championships, req.body.years_in_leauge, req.body.years_in_team], (err) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ success: true });
        }
    });
});

app.delete("/api/team/:id", (req, res) => {
    console.log(req.params.id);
    db.run("DELETE FROM team WHERE id = ?", [req.params.id], (err) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ success: true });
        }
    });
});


app.put("/api/team/:id", (req, res) => {

    console.log("request arrived");
    db.run("UPDATE team SET name = ?, city = ?, state = ?, championships = ?, years_in_leauge = ?, years_in_team = ? WHERE id = ?", [req.body.name, req.body.city, req.body.state, req.body.championships, req.body.years_in_leauge, req.body.years_in_team, req.body.id], (err) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ success: true });
        }
    });

});

app.get("/", (req, res) => {
    res.render('home');
});

app.get("/team", (req, res) => {
    const data = axios.get('http://localhost:5000/api/team');
    data.then(data => {
        console.log(data.data);
        res.render('team', { data: data.data });
    });
});

app.get("/team-details/:id", (req, res) => {
    const details = axios.get('http://localhost:5000/api/team/' + req.params.id);
    details.then(details => {
        console.log(details.data);
        res.render('team-details', { details: details.data });
    });
});


app.get("/add-team", (req, res) => {
    res.render('add-team');
});

app.get("/update-team", (req, res) => {
    res.render('update-team');
});


