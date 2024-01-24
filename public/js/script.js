let seconds = 0;
let minutes = 0;
const displaySeconds = document.getElementById("seconds");
const displayMinures = document.getElementById("minutes");
let interval;
let timeStatus;
let timeRecord = {};
let stratTime;
let stratDate;

startBtn.onclick = () => {

    if (timeStatus == "startBtn") {
        console.log("already started");
    } else {
        interval = setInterval(timer, 1000);
        stratTime = moment(new Date()).utcOffset(8).format('HH:mm');
        stratDate = moment(new Date()).utcOffset(8).format('YYYY-MM-DD');
        timeStatus = "startBtn";
    }
}

stopBtn.onclick = () => {

    if (timeStatus == "startBtn") {
        clearInterval(interval);
        timeStatus = "stopBtn";
    } else if (timeStatus == "stopBtn") {
        console.log("already stoped");
    } else if (timeStatus == "restBtn") {
        console.log("start first");
    }
}


restBtn.onclick = () => {

    if (timeStatus == "startBtn") {
        console.log("stop first");
    } else if (timeStatus == "stopBtn") {
        returnToZero();
    }
}

uploadBtn.onclick = () => {

    if (timeStatus == "startBtn") {
        console.log("stop first");
    } else if (timeStatus == "stopBtn") {
        timeRecord = {
            date: stratDate,
            time: stratTime,
            seconds: seconds,
            minutes: minutes
        }

        fetch('/createTimeLog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ timeRecord }),
        });

        //清空
        returnToZero()
    }
}

function timer() {
    seconds++;
    if (seconds < 10) {
        displaySeconds.innerHTML = `0${seconds}`;
    } else {
        displaySeconds.innerHTML = `${seconds}`;
    }

    //set minutes
    if (seconds > 59) {
        minutes++;
        if (minutes < 10) {
            displayMinures.innerHTML = `0${minutes}`
            seconds = 0;
        } else {
            displayMinures.innerHTML = `${minutes}`
            seconds = 0;
        }
    }
}

function returnToZero() {
    seconds = 0;
    minutes = 0;
    stratTime = '';
    timeRecord = {};
    displaySeconds.innerHTML = `0${seconds}`;
    displayMinures.innerHTML = `0${minutes}`;
    timeStatus = "restBtn"
}