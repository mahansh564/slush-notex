const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
dotenv.config({
    path: '../.env'
})

const cors = require('cors');
app.use(cors());
app.use(express.json());

const pool = require('./db.js');

// app.use(express.static(path.join(__dirname, '../client/build')))
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/', async(req, res) => {
    res.send("working...");
});

app.post('/user/login', async(req, res) => {
    const { username, password } = req.body;
    try{
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (user.rows.length === 0) {
            return res.status(401).json("Invalid Credential");
        }
        const validPassword = await bcrypt.compare(
        password,
        user.rows[0].user_password
        );
        if(validPassword){
            return res.json({"id": user.rows[0].id, "name": user.rows[0].name});
        }else{
            return res.status(401).json("Invalid Credential");
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.post('/user/add', async(req, res) => {
    try {
        console.log(req.body);
        const {username, password, name} = req.body;
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);
        console.log(`${username}`);
        const query = await pool.query('call insert_into_users($1, $2, $3)', [username, bcryptPassword, name]);
        res.send(query);
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/notes/add', async(req, res) => {
    try {
        console.log(req.body);
        const {userid, addHeading, addBody} = req.body;
        console.log(`${addHeading}`);
        const query = await pool.query('call insert_into_notes($1, $2, $3)', [userid, addHeading, addBody]);
        res.send(query);
    } catch (err) {
        console.error(err.message);
    }
});

app.put('/notes/:userid',async(req,res)=>{
    try {
        const {userid} = req.params;
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/notes/get', async(req, res) => {
    try {
        const { userid } = req.body;
        console.log(`${userid}`);
        const query = await pool.query('select * from notes where created_by=cast($1 as integer) ORDER by created_at DESC', [userid]);
        res.send(query.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/notes/edit', async(req, res) => {
    try {
        const { noteid, heading, noteBody } = req.body;
        console.log(`${noteBody}`);
        const query = await pool.query('UPDATE notes SET heading=$1, body=$2 where note_id=cast($3 as integer)', [heading, noteBody, noteid]);
        res.send(query.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/notes/remove', async(req, res) => {
    try {
        const { noteid } = req.body;
        console.log(`${noteid}`);
        const query = await pool.query('DELETE FROM notes WHERE note_id=cast($1 as integer)', [noteid]);
        res.send(query);
    } catch (err) {
        console.error(err.message);
    }
});

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname + '/../client/build/index.html'))
// })

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}...`);
});