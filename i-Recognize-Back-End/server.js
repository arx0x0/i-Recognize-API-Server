const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require ('./controllers/profile');
const image = require('./controllers/image');

//knex lets us connect our database with our server

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false,
    },
    },
});

const app = express();

app.use(cors()); //Cors is a middleware that lets us communicate with facerecongition folder
app.use(bodyParser.json());

//Get method for the home route that just sends success
app.get('/', (req, res) => {res.send('it is working')})

//Post method to retrieve and compare sign in info to login table in database
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) } )

//Post method to retrieve data from the body of what the user submitted and res.json sending the client their latest database entry, with KNEX and inserting user info into our login database, this links to our front end
app.post('/register', (req,res) => { register.handleRegister(req, res, db, bcrypt) } )

//Get method for verifying the user id req param and sending the client the user data appropriately, via the requested route params
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

//Put method to increment # of images, everytime a matching image is uploaded on the front end, we want the user to hit this route to increase their # of entries.
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
})

