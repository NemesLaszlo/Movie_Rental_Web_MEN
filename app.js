const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./database/database');

// Load config and Database connection
dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Body Parser
app.use(express.urlencoded({ limit: '10mb', extended: false }));
app.use(express.json());

// View engine - ejs setup and views
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

// Routes
app.use('/', require('./routes/index'));
app.use('/directors', require('./routes/directors'));
app.use('/movies', require('./routes/movies'));

app.listen(port, () =>
  console.log(
    `App listening at http://localhost:${port} and running mode is ${process.env.NODE_ENV}`
  )
);
