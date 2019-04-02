const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require ('./controllers/register');
const signin = require ('./controllers/signin');
const profile = require ('./controllers/profile');
const image = require ('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        host: '34.65.99.51',
        user: 'postgre',
        password: 'ondras',
        database: 'facereco'
    }
});

db.select('*').from('users').then(data => {
    console.log(data);
});

const app = express();
//parser pro body request z klienta
app.use(bodyParser.json());
//cors pro security
app.use(cors());

//pole objektu, ktere ted slouzi jako databaze
// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'John',
//             email: 'john@gmail.com',
//             password: 'cookies',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'Sally',
//             email: 'sallu@gmail.com',
//             password: 'bananas',
//             entries: 0,
//             joined: new Date()
//         }
//     ]
// }

//nacti homepage
app.get('/', (req, res) => {
    //res.send(working);
    res.send(database.users); //vrat vsechny usery z db
})

//na request /signin, ktery posle JSON s userovym email and password, pokud je v DB, tak vrat success jinak error
app.post('/signin', (req, res) => {signin.handleSignIn(req, res, db, bcrypt)});

//na request /register , ktery posle JSON s udaji o novem userovi vrat zaznam z DB s vytvorenym userem
//app.post('/register', (req, res) => 
//rozdeleni na controller, dependency injection
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});


//ziska info pro profil dle id v url
app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)});

//update usera podle poctu image checku
app.put('/image', (req, res) => {profile.handleImage(req, res)});

//presunuti Clarifai na server
//vycleneni imageurl
app.post('/imageurl', (req, res) => {Image.handleApiCall(req, res)});

//server posloucha na portu
app.listen(3000, () => {
    console.log('App is running on port: 3000');
})

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/