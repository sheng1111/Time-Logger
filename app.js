const express = require('express')
const engine = require('ejs-locals');
const moment = require('moment')
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

let app = express()
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'T1meL09g1R',
    resave: false,
    saveUninitialized: false,

}));
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/service-worker.js', (req, res) => {
    res.sendFile(__dirname + '/public/service-worker.js');
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/list', (req, res) => {
    if (!req.session.timeLogs) {
        req.session.timeLogs = [];
    }

    const selectedDate = req.query.date || moment(new Date()).utcOffset(8).format('YYYY-MM-DD');
    const filteredLogs = req.session.timeLogs.filter(log => log.date === selectedDate);
    res.render('list.ejs', { timeRecords: filteredLogs, selectedDate: selectedDate });
});

app.post('/createTimeLog', (req, res) => {
    if (!req.session.timeLogs) {
        req.session.timeLogs = [];
    }

    const timeRecord = req.body.timeRecord;
    const data = {
        id: Date.now(), // 使用當前時間戳作為唯一ID
        date: timeRecord.date,
        time: timeRecord.time,
        item: "",
        minutes: timeRecord.minutes,
        submitted: false
    };

    req.session.timeLogs.push(data);
    res.status(200).send('Time log created successfully!');
});

app.post('/createItem', (req, res) => {
    if (!req.session.timeLogs) {
        req.session.timeLogs = [];
    }

    const item = req.body.item;
    const recordId = req.body['record-id'];
    const record = req.session.timeLogs.find(log => log.id.toString() === recordId);

    if (record) {
        record.item = item;
        record.submitted = true;
    }

    let selectedDate = record ? record.date : moment(new Date()).utcOffset(8).format('YYYY-MM-DD');
    let filteredLogs = req.session.timeLogs.filter(log => log.date === selectedDate);
    console.log(filteredLogs);
    res.render('list.ejs', { timeRecords: filteredLogs, selectedDate: selectedDate });
});

app.get('/category', (req, res) => {
    res.render('category.ejs');
});

app.get('/analytics', (req, res) => {
    res.render('analytics.ejs');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
