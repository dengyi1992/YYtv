var request = require('request');

var EventEmitter = require('events').EventEmitter;
var myEvents = new EventEmitter();

var count = 0;
var mysql = require('mysql');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dengyi',
    database: 'douyu',
    port: 3306
});
//var start =11111;
//var start =18955;
var start = 1;
var yulepage = 1;
var mcpage = 1;
var livepage = 1;
var showpage = 1;
var dancepage = 1;


// exports.updateTag = function () {
//
//     var options1 = {
//         method: 'GET',
//         encoding: null,
//         url: "http://localhost:3000/updateTags?page=" + start
//     };
//     request(options1, function (error, response, body) {
//         console.log(new Date());
//         start = start + 1;
//     });
//     return start;
//
// };
var yule = true;
exports.getYULE = function () {

    var options1 = {
        method: 'GET',
        encoding: null,
        url: "http://www.yy.com/more/page.action?biz=other&subBiz=idx&moduleId=79&page=" + yulepage
    };

    request(options1, function (error, response, body) {
        yulepage = yulepage + 1;
        if (error) {
            return console.log(error);
        }
        var parse = JSON.parse(body);
        if (parse.data.data.length == 0) {
            yulepage = -9999;
            return console.log('no more data');
        }
        acquireData(parse);
    });
    if (yulepage < 0) {

        return true;
    } else {
        return false;
    }

};
exports.getMC = function () {

    var options1 = {
        method: 'GET',
        encoding: null,
        url: "http://www.yy.com/specialMore/page?biz=mc&moduleId=29&page=" + mcpage
    };

    request(options1, function (error, response, body) {
        mcpage = mcpage + 1;
        if (error) {
            return console.log(error);
        }
        var parse = JSON.parse(body);
        if (parse.data.data.length == 0) {
            mcpage = -9999;
            return console.log('no more data');
        }
        acquireData(parse);
    });
    if (mcpage < 0) {

        return true;
    } else {
        return false;
    }
};
exports.getLIVE = function () {
    if (livepage < 0) {

        return true;
    }
    var options1 = {
        method: 'GET',
        encoding: null,
        url: "http://www.yy.com/specialMore/page?biz=mc&moduleId=29&page=" + livepage
    };

    request(options1, function (error, response, body) {
        livepage = livepage + 1;
        if (error) {
            return console.log(error);
        }
        var parse = JSON.parse(body);
        if (parse.data.data.length == 0) {
            livepage = -9999;
            return console.log('no more data');
        }
        acquireData(parse);
    });
    return false;

};
exports.getSHOW = function () {
    if (showpage < 0) {

        return true;
    }
    var options1 = {
        method: 'GET',
        encoding: null,
        url: "http://www.yy.com/specialMore/page?biz=talk&subBiz=&moduleId=21&page=" + showpage
    };

    request(options1, function (error, response, body) {
        showpage = showpage + 1;
        if (error) {
            return console.log(error);
        }
        var parse = JSON.parse(body);
        if (parse.data.data.length == 0) {
            showpage = -9999;
            return console.log('no more data');
        }
        acquireData(parse);
    });

    return false;
    
};
exports.getDANCE = function () {

    var options1 = {
        method: 'GET',
        encoding: null,
        url: " http://www.yy.com/specialMore/page?biz=dance&moduleId=11&page=" + dancepage
    };

    request(options1, function (error, response, body) {
        dancepage = dancepage + 1;
        if (error) {
            return console.log(error);
        }
        var parse = JSON.parse(body);
        if (parse.data.data.length == 0) {
            dancepage = -9999;
            return console.log('no more data');
        }
        acquireData(parse);
    });
    if (dancepage < 0) {
        mcpage = 1;
        livepage = 1;
        showpage = 1;
        yulepage = 1;
        dancepage = 1;
        return true;
    } else {
        return false;
    }
};
function acquireData(data) {
    var sql = 'replace INTO yy (room_id, room_name, owner_uid, nickname, online, game_name, fans,tags) VALUES (?,?,?,?,?,?,?,?)';
    if (data.data.data.size == 0) {
        return console.log('没有数据了');
    }
    data.data.data.forEach(function (item) {

        var params = [item.sid, item.desc, item.uid, item.name, item.users, item.biz, 0, item.tag];
        conn.query(sql, params, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

        });

    });
}



