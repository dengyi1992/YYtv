var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var EventEmitter = require('events').EventEmitter;
var myEvents = new EventEmitter();
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
var times = [];
var timeTask = require('../controler/schedule_update');
var router = express.Router();
var mysql = require('mysql');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dengyi',
    database: 'douyu',
    port: 3306
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
var isRunning = false;
router.get('/start', function (req, res, next) {
    sub();
    if (isRunning) {
        return res.json({msg: 'copy that 爬虫还在运行.......'})
    }
    myEvents.emit('start');
    isRunning = true;
    res.json({msg: 'copy that 爬虫开始.......'})
});

myEvents.on('start', function () {
    rule.second = times;
    for (var i = 0; i < 60; i = i + 2) {
        times.push(i);
    }

    schedule.scheduleJob(rule, function () {

        console.log("------------" + new Date());
        if (timeTask.getYULE()) {
            if (timeTask.getMC()) {
                if (timeTask.getLIVE()) {
                    if (timeTask.getSHOW()) {
                        if (timeTask.getDANCE()) {
                            this.cancel();
                            console.log('-------------------------------爬虫结束-------------------------------------')
                        }
                    }
                }
            }
        }
    });
});
var mypretime = 0;
function sub() {
    var Today = new Date();
    var NowHour = Today.getHours();
    var NowMinute = Today.getMinutes();
    var NowSecond = Today.getSeconds();
    var mysec = (NowHour * 3600) + (NowMinute * 60) + NowSecond;
    if ((mysec - mypretime) > 10) {
//10只是一个时间值，就是10秒内禁止重复提交，值随便设
        mypretime = mysec;
    } else {
        return;
    }
}
module.exports = router;
