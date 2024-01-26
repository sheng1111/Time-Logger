const express = require('express');
const engine = require('ejs-locals');
const moment = require('moment');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');

// PostgreSQL Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Express app setup
let app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'))); 

// Create TimeLogs table if it doesn't exist
pool.query('CREATE TABLE IF NOT EXISTS TimeLogs (id SERIAL PRIMARY KEY, date TEXT, time TEXT, item TEXT, minutes INT, submitted BOOLEAN)', (err, res) => {
    if (err) {
        console.error('Error creating table', err.stack);
    } else {
        console.log('Table TimeLogs created or already exists');
    }
});

// Routes
app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/list', (req, res) => {
    const selectedDate = req.query.date || moment(new Date()).utcOffset(8).format('YYYY-MM-DD');
    
    pool.query('SELECT * FROM TimeLogs WHERE date = $1', [selectedDate], (err, result) => {
        if (err) {
            res.status(500).send('Error fetching records');
        } else {
            res.render('list.ejs', { timeRecords: result.rows, selectedDate: selectedDate });
        }
    });
});

app.post('/createTimeLog', (req, res) => {
    const timeRecord = req.body.timeRecord;
    const query = 'INSERT INTO TimeLogs (date, time, minutes, submitted) VALUES ($1, $2, $3, $4)';
    const values = [timeRecord.date, timeRecord.time, timeRecord.minutes, false];

    pool.query(query, values, (err, result) => {
        if (err) {
            res.status(500).send('Error while creating time log');
        } else {
            res.status(200).send('Time log created successfully!');
        }
    });
});

app.post('/createItem', (req, res) => {
    const item = req.body.item;
    const recordId = req.body['record-id'];

    pool.query('UPDATE TimeLogs SET item = $1, submitted = true WHERE id = $2', [item, recordId], (err, result) => {
        if (err) {
            res.status(500).send('Error updating record');
        } else {
            res.redirect(`/list?date=${moment(new Date()).utcOffset(8).format('YYYY-MM-DD')}`);
        }
    });
});

app.get('/category', (req, res) => {
    res.render('category.ejs');
});

app.get('/analytics', (req, res) => {
    res.render('analytics.ejs');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});