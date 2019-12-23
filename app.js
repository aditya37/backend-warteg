//import framework express
const express = require('express');
const app = express();

// Create Server
const port   = process.env.PORT || 3000;
const http   = require('http');
const server = http.createServer(app);

// loging
const log = require('morgan');

// body parser
const bodyParser = require('body-parser');

// mongodb
const mongoose = require("mongoose");

// route authentication
const authCustomer   = require('./api/routes/authRoutes/authCustomer');
const authVendor     = require('./api/routes/authRoutes/authVendor');

// import file routes
const productRoutes  = require('./api/routes/productRoutes/product');
const customerRoutes = require('./api/routes/customerRoutes/customer');
const vendoRoutes    = require('./api/routes/vendorRoutes/vendor')

// import route for regions at indonesia
const regionRoutes   = require('./api/routes/regionRoutes/regions');

// koneksi ke db
mongoose.connect(
  "mongodb://localhost:27017/db_waroenk",{
     useNewUrlParser :true,
     useUnifiedTopology:true
  }

);

// menampilkan log ke dalam console
app.use(log('combined'));
// add route for show image
app.use('/upload',express.static('./vendor_upload'));

//body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
// upload route
app.use(bodyParser.json());

// CORS - Corss - Origin - Resource - Sharing
//  https://developer.mozilla.org/id/docs/Web/HTTP/CORS
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if(req.method === 'OPTIONS'){
    res.header(
      'Access-Control-Allow-Methods',
      'PUT,POST,PATCH,DELETE,GET'
    );
    return res.status(200).json({});
  }
  next();
});

// declare route
app.use('/products',productRoutes);
app.use('/vendors',vendoRoutes);
app.use('/customers',customerRoutes);


// Declare Authentication route
app.use('/auth/customer/',authCustomer);
app.use('/auth/vendor/',authVendor);

// Declare Indonesia Regions route
app.use('/regions/indonesia/',regionRoutes);

// error handling
app.use((req,res,next )=> {
  const error = new Error('Page Not Found');
  error.status == 404;
  next(error);
});
// show error meassage to user
app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
      success : "False",
      error   : error.message
    });
});

server.listen(port,()=>{
  console.log("Server Run On Port "+ port);
});
module.exports = app;
