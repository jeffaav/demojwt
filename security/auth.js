var express = require('express'),
    jwt = require('jsonwebtoken'),
    secret = require(__dirname + '/secret.json'),
    auth = module.exports = {};

var settings = {
    path: '/login',
    expiresIn: 120,
    cookieEnabled: true,
    cookieName: 'demojwt_token'
}

console.log(__dirname)

auth.router = function (options) {
    var router = express.Router();

    if (options)
        for (var key in options)
            if (settings.hasOwnProperty(key))
                settings[key] = options[key];

    router.get(settings.path, function(req, res) {
        var credentials = {
            user: 'test',
            password: 'test',
            expires: Math.floor(Date.now() / 1000) + settings.expiresIn
        }

        var token = jwt.sign(credentials, secret.key, { expiresIn: settings.expiresIn });

        if (settings.cookieEnabled)
            res.cookie(settings.cookieName, token, { maxAge: (1000 * settings.expiresIn) });
        res.json({ success: true, token: token });
    })

    return router;
}


auth.challenge = function (req, res, next) {
    if (req.path === settings.path) 
        next();
    else {
        var token = settings.cookieEnabled ? req.cookies[settings.cookieName] : (req.body.token || req.query.token || req.headers['x-access-token']);
        
        if (token)
            jwt.verify(token, secret.key, function (err, decoded) {
                if (err) {
                    if (settings.cookieEnabled)
                        res.clearCookie(settings.cookieName);
                    return res.json({ success: false, message: 'failed to authenticate token' })
                } else {
                    req.decoded = decoded;
                    next();
                }                 
            })
        else
            return res.status(403).send({ success: false, message: 'no token' })
    }
}