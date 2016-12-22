var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

var index = require('./routes/index');

var app = express();



var url = "https://shopicruit.myshopify.com/admin/orders.json?page=1&access_token=c32313df0d0ef512ca64d5b336a0d7c6";
var revenue = 0;
var taxes = 0;
var discounts = 0;
//get json from Shopify url
request({
    url: url,
    json: true
}, function (error, response,body) {
    if (!error && response.statusCode == 200) {

        //calculate total order revenue
        body.orders.forEach(function(item) {
            revenue += parseFloat(item.total_price);
            taxes += parseFloat(item.total_tax);
            discounts += parseFloat(item.total_discounts);
        });
        app.locals.taxes = taxes;
        app.locals.discounts = discounts;
        app.locals.revenue = revenue;

    }
});






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

