var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    auth = require(__dirname + '/security/auth.js'),
    app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api', auth.challenge);
app.use('/api', auth.router());


app.get('/api/users/', function (req, res) {
    return res.json({ test: '' });
})


app.listen(3000);