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
        connectionString: process.env.DATABASE_URL,
        //connectionString: 'postgres://tzyynmpvfmdkaq:40e784e0bc8d0c700413f6c5d682ad6a58bd5583de0961528b72bae4ac6bc045@ec2-79-125-2-142.eu-west-1.compute.amazonaws.com:5432/d5tvq50obn959e',
        ssl: true
    }
});

db.select('*').from('users').then(data => {
    //console.log(data);
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
    res.send('it is working'); //vrat vsechny usery z db
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
app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port: ${process.env.PORT}`);
})

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/
