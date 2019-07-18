require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const uuid = require('uuid/v4');
//const jsonParser = express.json

const { NODE_ENV } = require('./config');

const app = express();
app.use(express.json());
//app.use(jsonParser); or pass it in to endpoints that need it

const morganOptions = (NODE_ENV === 'production')
  ? 'common' 
  : 'dev';

app.use(morgan(morganOptions));
app.use(helmet());
app.use(cors());

const users = [
  {
    'id': '3c8da4d5-1597-46e7-baa1-e402aed70d80',
    'username': 'sallyStudent',
    'password': 'c00d1ng1sc00l',
    'favoriteClub': 'Cache Valley Stone Society',
    'newsLetter': 'true'
  },
  {
    'id': 'ce20079c-2326-4f17-8ac4-f617bfd28b7f',
    'username': 'johnBlocton',
    'password': 'veryg00dpassw0rd',
    'favoriteClub': 'Salt City Curling Club',
    'newsLetter': 'false'
  }
];

app.get('/', (req, res) => {
  res.send('A GET Request');
});

app.post('/', (req,res) => {
  console.log(req.body);
  res.send('POST request received');
});
//adding middleware directly to endpoint that needs it
// app.post('/', jsonParser, (req,res) => {
//   console.log(req.body);
//   res.send('POST request received.');
// });


//validation
app.post('/register', (req, res)=> {
  const { username, password, favoriteClub, newsLetter=false } = req.body;

  if(!username) {
    return res
      .status(400)
      .send('Username required');
  }
  if(!password) {
    return res
      .status(400)
      .send('Password required');
  }
  if(!favoriteClub) {
    return res
      .status(400)
      .send('Favorite Club required');
  }

  if(username.length < 6 || username.length > 20){
    return res
      .status(400)
      .send('Username number be between 6 and 20 characters long');
  }
  if(password.length < 8 || password.length > 36){
    return res
      .status(400)
      .send('Password number be between 8 and 36 characters long');
  }
  if(!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)){
    return res
      .status(400)
      .send('Password must contain at least one digit');
  }

  const clubs = [
    'Cache Valley Stone Society',
    'Ogden Curling Club',
    'Park City Curling Club',
    'Salt City Curling Club',
    'Utah Olympic Oval Curling Club'
  ];
  if(!clubs.includes(favoriteClub)){
    return res
      .status(400)
      .send('Not a valid club');
  }

  const id = uuid();
  const newUser = {
    id, 
    username, 
    password, 
    favoriteClub, 
    newsLetter
  };

  users.push(newUser);

  res
    .status(201)
    .location(`http://localhost:8000/user/${id}`)
    .json(newUser);

  res.send('All validation passed');
});

//responding with the actual object itself
// res
//   .status(201)
//   .location(`http://localhost:8000/user/${id}`)
//   .json(newUser);

//responding with the id of the newly created object
// res
//   .status(201)
//   .location(`http://localhost:8000/user/${id}`)
//   .json({id: id});

//don't usually delete for many reasons..your app usually will depend on data
app.delete('/user/:userId', (req, res) => {
  const { userId } = req.params;
  
  const index = users.findIndex(u => u.id === userId);

  //make sure we actually find a user with that id
  //so this is saying if the index doesn't exsist???
  if(index === -1){
    return res 
      .status(404)
      .send('User not found');
  }
  users.splice(index, 1);
  res.status(204).end();
});

app.get('/user', (req, res) => {
  res.json(users);
});

app.use(function errorHandler(error, req, res, next) { //eslint-disable-line no-unused-vars
  let response;
  if(NODE_ENV === 'production'){
    response = { error: {message: 'server error'} };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
