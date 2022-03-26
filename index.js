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

app.get('/all', (req, res) => {
  fetch('https://crudapi-fd.herokuapp.com/words')
    .then(res => res.json())
    .then(json => {
      res.render('all', { data : json.data.words })
    })
    .catch(err => console.log(err))
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/adding', (req, res) => {
  var word = req.body.wordText;
  if(word) {
    fetch('https://crudapi-fd.herokuapp.com/words/add', {
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
			if(data.success==true) {
				res.redirect('/all?message=Word added successfully');
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
  if(id) {
    fetch(`https://crudapi-fd.herokuapp.com/words/${id}`)
    .then(res => res.json())
    .then(json => {
      res.render('update', { data : json.data.word })
    })
    .catch(err => console.log(err))
  }
});

app.post('/updating', (req, res) => {
  var word = req.body.wordText;
  var id = req.body.id;
  if(word) {
    fetch(`https://crudapi-fd.herokuapp.com/words/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        word: word
      })
    })
    .then(res => res.json())
		.then(data => {
			if(data.success==true) {
				res.redirect('/all?message=Word updated successfully');
			}
			else {
				    res.status(200).redirect(`/update?id=${id}&message=${data.message}`)
			}
		}
			).catch(function(err) {
			 console.log(err);}
	    );
	}
	else {
			res.status(200).redirect(`/update?id=${id}&message=Something went wrong`)	
	}
});

app.get('/delete', (req, res) => {
  var id = req.query.id;
  if(id) {
    fetch(`https://crudapi-fd.herokuapp.com/words/${id}`)
    .then(res => res.json())
    .then(json => {
      res.render('delete', { data : json.data.word })
    })
    .catch(err => console.log(err))
  }
});


app.post('/deleting', (req, res) => {
  var word = req.body.wordText;
  var id = req.body.id;
  if(word) {
    fetch(`https://crudapi-fd.herokuapp.com/words/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
		.then(data => {
			if(data.success==true) {
				res.redirect('/all?message=Word deleted successfully');
			}
			else {
				    res.status(200).redirect(`/all?id=${id}&message=${data.message}`)
			}
		}
			).catch(function(err) {
			 console.log(err);}
	    );
	}
	else {
			res.status(200).redirect(`/all?id=${id}&message=Something went wrong`)	
	}
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