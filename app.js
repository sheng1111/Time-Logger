const express = require('express');
const engine = require('ejs-locals');
const moment = require('moment');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@vercel/kv');

// 初始化 Vercel KV 客户端
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

let app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.get('/list', async (req, res) => {
    const selectedDate = req.query.date || moment(new Date()).utcOffset(8).format('YYYY-MM-DD');
    
    let timeLogs = JSON.parse(await kv.get('timeLogs') || '[]');
    const filteredLogs = timeLogs.filter(log => log.date === selectedDate);
    res.render('list.ejs', { timeRecords: filteredLogs, selectedDate: selectedDate });
});

app.post('/createTimeLog', async (req, res) => {
    const timeRecord = req.body.timeRecord;
    const data = {
        id: Date.now(),
        date: timeRecord.date,
        time: timeRecord.time,
        item: "",
        minutes: timeRecord.minutes,
        submitted: false
    };

    let timeLogs = JSON.parse(await kv.get('timeLogs') || '[]');
    timeLogs.push(data);
    await kv.set('timeLogs', JSON.stringify(timeLogs));

    res.status(200).send('Time log created successfully!');
});

app.post('/createItem', async (req, res) => {
    const item = req.body.item;
    const recordId = req.body['record-id'];

    let timeLogs = JSON.parse(await kv.get('timeLogs') || '[]');
    const record = timeLogs.find(log => log.id.toString() === recordId);

    if (record) {
        record.item = item;
        record.submitted = true;
        await kv.set('timeLogs', JSON.stringify(timeLogs));
    }

    let selectedDate = record ? record.date : moment(new Date()).utcOffset(8).format('YYYY-MM-DD');
    let filteredLogs = timeLogs.filter(log => log.date === selectedDate);
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
