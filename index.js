const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
app.use(express.json());
const request = require('request');
app.set('view engine', 'ejs');
var fetch = require('node-fetch');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
const wordsRoute = require('./src/routes/words');

app.use('/words', wordsRoute);


// fetch the data from the /words api endpoint
app.get('/', (req, res) => {
	res.render('index')
});

app.get('/add', (req, res) => {
  var message = req.query.message;
  if(message){
    res.render('add', {message});
  } else {
    res.render('add');
  }
});

app.get('/all', (req, res) => {
  fetch('http://127.0.0.1/words')
    .then(res => res.json())
    .then(json => {
      res.render('all', { data : json.data.words })
      // console.log(data.data.words[0].word);
    })
    .catch(err => console.log(err))
});

app.post('/adding', (req, res) => {
  var word = req.body.wordText;
  if(word) {
    fetch('http://127.0.0.1/words/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        word: word
      })
    })
    .then(res => res.json())
		.then(data => {
      console.log(data);
			if(data.success==true) {
				res.redirect('/add?message=Word added successfully');
			}
			else {
				    res.status(200).redirect(`/add?message=${data.message}`)
			}
		}
			).catch(function(err) {
			 console.log(err);}
	    );
	}
	else {
			res.status(200).redirect(`/add?message=Something went wrong`)	
	}
});

app.get('/update', (req, res) => {
  var id = req.query.id;
  res.render('update')
});

app.get('/delete', (req, res) => {
  res.render('delete')
});


var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HrsOST || '0.0.0.0';

mongoose
  .connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    return app.listen(server_port, server_host);
  })
  .then((res) => {
    console.log(`Server is running... ${server_host}:${server_port}`);
  });