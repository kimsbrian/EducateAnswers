const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const answers = require('./routes/api/answers');
const puppeteer = require('puppeteer');


const app = express();

// Bodyparser Middleware
app.use(bodyParser.json());


// DB Config

const db = require('./config/keys').mongoURI;

//Connect to Mongo
mongoose.connect(db,{ useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Use Routes
app.use('/api/answers',answers);


// Serve static assets if in production
if(process.env.NODE_ENV === 'production'){
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname , 'client' , 'build' , 'index.html'));
    });
}

var port = process.env.PORT || 5000;




exports.port = port;

async function run () {
    let browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        //args: ['--no-sandbox','--proxy-server=10.8.0.1:1080'],
        headless: false,
      });
      exports.browser = browser


}
run();


app.listen(port, () => console.log('Server started on port: ' + port));