var totalPageSize = 100; // Hien gio a Nam chi cho load 1000 clone 1 lan load thoi. 100 = best performance
var defaultToken = '';
var defaultList = ["live", "checkpoint", "stored", "getting", "checking"];
var countPage;

// listCloneCore({
//     token: defaultToken,
//     status: 'all'
// });


// Load clone
// listCloneCore({ token: defaultToken })
//     .then(async clones => {

//         // Tim vat thi nghiem
//         console.log('Clone loaded. ' + clones.length + ' clones.');
//         for (const clone of clones) {
//             if (clone.uid.indexOf('100070561441238') != -1) {

//                 // Test clone
//                 console.log('something_new' == 'something_new' && clone.action_profile_id == undefined);
//                 // Test change action
//                 // await changeAction({
//                 //         token: token,
//                 //         cloneId: clone.id,
//                 //         actionId: '60d535034b0a6b3de0a56377',
//                 //         // actionId: '60e552305f2bea971d54cc66',
//                 //     })
//                 //     .then(_ => {
//                 //         console.log('Done ' + clone.uid);
//                 //     })
//                 //     .catch(error => console.log(error));
//                 return;
//             }
//         }
//     })
//     .catch((err) => { console.log(err) })


// Get All Clone from autofarmer
//      token: required
//      status: default = all
function listCloneCore({
    token: token,
    status: status = 'all'
}) {
    return new Promise((done, quit) => {
        if (token == undefined || token.length == 0) {
            quit('Không có token');
            return;
        }

        // const fetch = require('node-fetch');
        // var myHeaders = new fetch.Headers();

        var myHeaders = new Headers();

        myHeaders.append("authority", "customer.autofarmer.net");
        myHeaders.append("token", token);
        myHeaders.append("content-type", "application/json");
        myHeaders.append("origin", "https://www.autofarmer.net");
        myHeaders.append("referer", "https://www.autofarmer.net/");

        let alive_status = status == 'all' ? defaultList : [status];
        var raw = JSON.stringify({
            "alive_status": alive_status,
            "appname": [
                "facebook"
            ],
            "page": 1,
            "limit": 1,
            "android_id": null
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };


        fetch("https://customer.autofarmer.net/v1/clones/search", requestOptions)
            .then(response => response.text())
            .then(async(result) => {
                let json = JSON.parse(result);
                if (json.code == 200 && json.data != null) {
                    // Xu ly goi nhieu lan
                    let totalClones = json.data.total;
                    let totalPage = Math.round(totalClones / totalPageSize) + 1;
                    var clones = [];

                    // Vi du goi 9 pages lien tuc
                    countPage = 0;

                    for (let i = 1; i <= totalPage; i++) {
                        loadCloneByPage({
                                token: token,
                                alive_status: alive_status,
                                page: i,
                            })
                            .then((result) => {
                                // Ghep lai
                                clones.push.apply(clones, result.clones);
                                countPage++;
                                if (countPage == totalPage) {
                                    done(clones);
                                }
                            })
                            .catch(error => quit(error));
                    }
                } else {
                    console.log(json);
                    quit(json.message);
                }
            })
            .catch(error => quit(error));
    });
    // .then(clones => console.log("Da load: " + clones.length + " clones."))
    // .catch(error => console.log(error));
}

function loadCloneByPage({
    token: token,
    alive_status: alive_status = defaultList,
    page: page = 1,
    limit: limit = totalPageSize,
}) {
    return new Promise((done, quit) => {

        // const fetch = require('node-fetch');
        // var myHeaders = new fetch.Headers();

        var myHeaders = new Headers();

        myHeaders.append("authority", "customer.autofarmer.net");
        myHeaders.append("token", token);
        myHeaders.append("content-type", "application/json");
        myHeaders.append("origin", "https://www.autofarmer.net");
        myHeaders.append("referer", "https://www.autofarmer.net/");

        var raw = JSON.stringify({
            "alive_status": alive_status,
            "appname": [
                "facebook"
            ],
            "page": page,
            "limit": limit,
            "android_id": null
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };


        fetch("https://customer.autofarmer.net/v1/clones/search", requestOptions)
            .then(response => response.text())
            .then(result => {
                let json = JSON.parse(result);
                if (json.code == 200 && json.data != null && json.data.data != null) {
                    done({
                        total: json.data.total,
                        clones: json.data.data,
                    });
                } else {
                    quit(json.message);
                }
            })
            .catch(error => quit(error));
    });
}

function resetCloneCore({
    token: token,
    cloneId: cloneId,
}) {
    return new Promise((done, quit) => {
        // check token
        if (token == undefined || token.length == 0) {
            quit('Không có token');
            return;
        }

        // check cloneId
        if (cloneId == undefined || cloneId.length == 0) {
            quit('Không có cloneId');
            return;
        }


        // const fetch = require('node-fetch');
        //        var myHeaders = new fetch.Headers();

        var myHeaders = new Headers();

        myHeaders.append("token", token);
        myHeaders.append("Content-Type", "application/json");

        var raw = "{\n    \"clone_id\":\"" + cloneId + "\"\n}";

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://customer.autofarmer.net/v1/clones/reset", requestOptions)
            .then(response => response.text())
            .then(result => {
                let response = JSON.parse(result);
                if (response.code === 200) {
                    done(true);
                } else {
                    quit(response.message);
                }
            })
            .catch(error => quit(error));
    });
}

function loginCore({
    username: username,
    password: password,
}) {
    return new Promise((done, quit) => {

        // check token
        if (username == undefined || username.length == 0) {
            quit('Không có username');
            return;
        }

        // check cloneId
        if (password == undefined || password.length == 0) {
            quit('Không có password');
            return;
        }


        // const fetch = require('node-fetch');
        //        var myHeaders = new fetch.Headers();

        var myHeaders = new Headers();

        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "username": username,
            "password": password,
            "device_id": "1"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://customer.autofarmer.net/v1/login", requestOptions)
            .then(response => response.text())
            .then(result => {
                let json = JSON.parse(result);
                if (json.code == 200 && json.data != null && json.data.token != null) {
                    console.log("token = " + json.data.token);
                    done(json.data.token);
                } else {
                    console.log(json);
                    quit(json.message);
                }
            })
            .catch(error => {
                console.log('error', error);
                quit(error);
            });
    });
}

function getAllActionsCore({
    token: token,
}) {
    return new Promise((done, quit) => {

        // check token
        if (username == undefined || username.length == 0) {
            quit('Không có username');
            return;
        }

        // check cloneId
        if (password == undefined || password.length == 0) {
            quit('Không có password');
            return;
        }

        // Call API

        // const fetch = require('node-fetch');
        //        var myHeaders = new fetch.Headers();

        var myHeaders = new Headers();

        myHeaders.append("authority", "customer.autofarmer.net");
        myHeaders.append("accept", "application/json");
        myHeaders.append("token", token);
        myHeaders.append("content-type", "application/json");
        myHeaders.append("origin", "https://www.autofarmer.net");

        var raw = JSON.stringify({
            "status": [
                "Active"
            ],
            "offset": "",
            "limit": -1,
            "appname": "facebook"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };


        fetch("https://customer.autofarmer.net/v1/action-profile/all-by-clone", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                let json = JSON.parse(result);
                if (json.code == 200 && json.data != null) {
                    // Data đã về
                    done(json.data);
                } else {
                    console.log(json);
                    quit(json.message);
                }
            })
            .catch(error => quit(error));
    });
}

function changeAction({
    token: token,
    cloneId: cloneId,
    actionId: actionId,
}) {
    return new Promise((done, quit) => {

        // check token
        if (token == undefined || token.length == 0) {
            quit('Không có token');
            return;
        }

        // check cloneId
        if (cloneId == undefined || cloneId.length == 0) {
            quit('Không có cloneId');
            return;
        }

        // check actionId
        if (actionId == undefined || actionId.length == 0) {
            quit('Không có actionId');
            return;
        }

        // Call API

        // const fetch = require('node-fetch');
        //        var myHeaders = new fetch.Headers();

        var myHeaders = new Headers();

        myHeaders.append("authority", "customer.autofarmer.net");
        myHeaders.append("accept", "application/json");
        myHeaders.append("token", token);
        myHeaders.append("content-type", "application/json");
        myHeaders.append("origin", "https://www.autofarmer.net");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: "{\"clone_id\":\"" + cloneId + "\",\"action_id\":\"" + actionId + "\"}",
            redirect: 'follow'
        };

        fetch("https://customer.autofarmer.net/v1/clones/set-action", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                let json = JSON.parse(result);
                if (json.code == 200 && json.data != null) {
                    // Data đã về
                    done();
                } else {
                    console.log(json);
                    quit(json.message);
                }
            })
            .catch(error => quit(error));
    });
}

function activeTransactionCore({
    transactionId: transactionId = '',
    money: money = 100000,
}) {
    return new Promise((done, quit) => {

        // check transactionId
        if (transactionId == undefined || transactionId.length == 0) {
            quit('Không có transactionId');
            return;
        }

        // Call API

        // const fetch = require('node-fetch');
        //        var myHeaders = new fetch.Headers();

        var myHeaders = new Headers();
        myHeaders.append("mobile-secret-key", "Congaubeo@123");
        myHeaders.append("Authorization", "Basic Y29uZ2F1YmVvQDEyMzpjb25nYXViZW9AMTIz");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "__cfduid=d3bb959511c1f9c1e21618a72cc90a7721613020299");

        var raw = JSON.stringify({
            "code": transactionId,
            "money": money
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://api.mottrieu.com/api/v1/transactions/active", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                let json = JSON.parse(result);
                if (json.code == 200 && json.data != null) {
                    // Data đã về
                    done({
                        fullname: json.data.fullname,
                        money: json.data.value,
                    });
                } else {
                    console.log(json);
                    quit(json.message);
                }
            })
            .catch(error => quit(error));
    });
}

function getToday({
    token: token,
}) {

    return new Promise((done, quit) => {

        // check token
        if (token == undefined || token.length == 0) {
            quit('Không có token');
            return;
        }

        // Call API

        // const fetch = require('node-fetch');
        //        var myHeaders = new fetch.Headers();

        var myHeaders = new Headers();
        myHeaders.append("authority", "customer.autofarmer.net");
        myHeaders.append("token", token);
        myHeaders.append("content-type", "application/json");
        myHeaders.append("origin", "https://www.autofarmer.net");
        myHeaders.append("referer", "https://www.autofarmer.net/");

        let currentTime = formatToday();
        var raw = JSON.stringify({
            "start_time": currentTime.startDate,
            "end_time": currentTime.endDate,
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };


        fetch("https://customer.autofarmer.net/v1/reports/daily-token", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                let json = JSON.parse(result);
                if (json.code == 200 && json.data != null) {
                    let bill = json.data[0];
                    // Data đã về
                    done({
                        total: bill.bufflike_amount +
                            bill.buffcomment_amount +
                            bill.viplike_amount +
                            bill.viplike_new_amount +
                            bill.vipcomment_amount +
                            bill.follow_warranty_amount +
                            bill.likepage_warranty_amount +
                            bill.follow_low_amount +
                            bill.follow_normal_amount +
                            bill.follow_high_amount +
                            bill.follow_fast_amount +
                            bill.likepage_low_amount +
                            bill.likepage_normal_amount +
                            bill.likepage_high_amount +
                            bill.likepage_fast_amount,
                        bufflike_amount: bill.bufflike_amount,
                        buffcomment_amount: bill.buffcomment_amount,
                        viplike_amount: bill.viplike_amount,
                        viplike_new_amount: bill.viplike_new_amount,
                        vipcomment_amount: bill.vipcomment_amount,
                        follow_warranty_amount: bill.follow_warranty_amount,
                        likepage_warranty_amount: bill.likepage_warranty_amount,
                        follow_low_amount: bill.follow_low_amount,
                        follow_normal_amount: bill.follow_normal_amount,
                        follow_high_amount: bill.follow_high_amount,
                        follow_fast_amount: bill.follow_fast_amount,
                        likepage_low_amount: bill.likepage_low_amount,
                        likepage_normal_amount: bill.likepage_normal_amount,
                        likepage_high_amount: bill.likepage_high_amount,
                        likepage_fast_amount: bill.likepage_fast_amount,
                    });
                } else {
                    console.log(json);
                    quit(json.message);
                }
            })
            .catch(error => quit(error));
    });
}

function getThanhToanCore({
    token: token = defaultToken,
}) {
    return new Promise((done, quit) => {

        // check token
        if (token == undefined || token.length == 0) {
            quit('Không có token');
            return;
        }

        // Call API

        // const fetch = require('node-fetch');
        // var myHeaders = new fetch.Headers();

        var myHeaders = new Headers();
        myHeaders.append("authority", "customer.autofarmer.net");
        myHeaders.append("token", token);
        myHeaders.append("content-type", "application/json");
        myHeaders.append("origin", "https://www.autofarmer.net");
        myHeaders.append("referer", "https://www.autofarmer.net/");

        var raw = "";

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://customer.autofarmer.net/v1/reports/daily-pay", requestOptions)
            .then(response => response.text())
            .then(result => {
                let json = JSON.parse(result);
                if (json.code == 200 && json.data != null) {
                    let list = json.data;
                    // Data đã về
                    list = list.map(item => {
                        item.created_date = new Date(item.created_date);
                        return item;
                    });
                    // Cac moc thoi gian
                    let today = new Date();
                    let dayLastMonth = list[today.getDate()] != null ? list[today.getDate()].created_date : null;
                    // Tong
                    var sum = 0;
                    var sumThangNay = 0;
                    var sumThangTruoc = 0;
                    let yesterdayBill = list[1] == null ? 0 : list[1].amount;
                    var toDayBill = list[0] == null ? 0 : list[0].amount;
                    let thoiGianDaQua = today.getHours() * 60 * 60 + today.getMinutes() * 60 + today.getSeconds();
                    let estimate = parseInt(toDayBill * 86400 / thoiGianDaQua);

                    // Duyet
                    for (const bill of list) {
                        let X = bill.created_date;
                        // Sum
                        sum += bill.amount;
                        if (X.getMonth() == today.getMonth() && X.getYear() == today.getYear()) { sumThangNay += bill.amount; }
                        if (dayLastMonth != null && (X.getMonth() == dayLastMonth.getMonth() && X.getYear() == dayLastMonth.getYear())) { sumThangTruoc += bill.amount; }
                    }

                    done({
                        today: toDayBill.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        estimate: estimate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        yesterday: yesterdayBill.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        thangTruoc: sumThangTruoc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        thangNay: sumThangNay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        sum: sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    });
                } else {
                    console.log(json);
                    quit(json.message);
                }
            })
            .catch(error => quit(error));
    });
}

function getCloneCountCore({
    token: token = defaultToken,
}) {
    return new Promise(async(done, quit) => {
        // check token
        if (token == undefined || token.length == 0) {
            quit('Không có token');
            return;
        }

        // Count thread
        var countNeed = 6;
        var countDone = 0;

        // Count clone
        var all = 0;
        var live = 0;
        var checkpoint = 0;
        var stored = 0;
        var checking = 0;
        var getting = 0;

        // Tổng hợp
        function sumUp({
            alive_status: alive_status,
            total: total,
        }) {
            if (alive_status == 'all') all = total;
            if (alive_status == 'live') live = total;
            if (alive_status == 'checkpoint') checkpoint = total;
            if (alive_status == 'stored') stored = total;
            if (alive_status == 'checking') checking = total;
            if (alive_status == 'getting') getting = total;
            countDone++;
            if (countNeed == countDone) {
                done({
                    all: all,
                    live: live,
                    checkpoint: checkpoint,
                    stored: stored,
                    checking: checking,
                    getting: getting,
                });
            }
        }

        // Thu nghiem
        // Thread counts all
        loadCloneByPage({
            token: token,
            alive_status: defaultList,
            limit: 1,
        }).then(result => {
            sumUp({
                alive_status: 'all',
                total: result.total,
            });
        }).catch(err => quit(err));
        // 5 threads count all of clone status
        for (let alive_status of defaultList) {
            // try {
            //     let result = await loadCloneByPage({
            //         token: token,
            //         alive_status: [alive_status],
            //         limit: 1,
            //     })
            //     sumUp({
            //         alive_status: alive_status,
            //         total: result.total,
            //     })
            // } catch (error) {
            //     quit(error);
            // }

            loadCloneByPage({
                token: token,
                alive_status: [alive_status],
                limit: 1,
            }).then(result => {
                sumUp({
                    alive_status: alive_status,
                    total: result.total,
                });
            }).catch(err => quit(err));
        }
    });
}
// getCloneCountCore({}).then((r) => console.log(r));

function getDeviceMoneyCore({
    token: token = defaultToken,
}) {
    return new Promise((done, quit) => {
        // check token
        if (token == undefined || token.length == 0) {
            quit('Không có token');
            return;
        }

        // Call API
        // const fetch = require('node-fetch');
        // var myHeaders = new fetch.Headers();
        var myHeaders = new Headers();
        myHeaders.append("authority", "customer.autofarmer.net");
        myHeaders.append("token", token);
        myHeaders.append("content-type", "application/json");
        myHeaders.append("origin", "https://www.autofarmer.net");
        myHeaders.append("referer", "https://www.autofarmer.net/");

        let currentTime = formatToday();
        var raw = JSON.stringify({
            "start_time": currentTime.startDate,
            "end_time": currentTime.endDate,
            "limit": 1000,
            "page": 1,
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://customer.autofarmer.net/v1/reports/daily-device", requestOptions)
            .then(response => response.text())
            .then(result => {
                let json = JSON.parse(result);
                if (json.code == 200 && json.data.data != null) {
                    var listDevice = json.data.data;
                    done(listDevice);
                } else {
                    console.log(json);
                    quit(json.message);
                }
            })
            .catch(error => quit(error));
    });
}

function getDeviceCore({
    token: token = defaultToken,
}) {
    return new Promise((done, quit) => {
        // check token
        if (token == undefined || token.length == 0) {
            quit('Không có token');
            return;
        }

        // Call API
        // const fetch = require('node-fetch');
        // var myHeaders = new fetch.Headers();
        var myHeaders = new Headers();
        myHeaders.append("authority", "customer.autofarmer.net");
        myHeaders.append("token", token);
        myHeaders.append("content-type", "application/json");
        myHeaders.append("origin", "https://www.autofarmer.net");
        myHeaders.append("referer", "https://www.autofarmer.net/");

        var raw = JSON.stringify({
            "status": [
                "Active",
                "Approved"
            ],
            "page": 1,
            "limit": 1000
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://customer.autofarmer.net/v1/devices/search", requestOptions)
            .then(response => response.text())
            .then(result => {
                let json = JSON.parse(result);
                if (json.code == 200 && json.data.data != null) {
                    var listDevice = json.data.data;
                    done(listDevice);
                } else {
                    console.log(json);
                    quit(json.message);
                }
            })
            .catch(error => quit(error));
    });
}

function tongHopCloneCore({
    token: token = defaultToken
}) {
    return new Promise((done, quit) => {
        var moneyDevices;
        var devices;
        async function getMoney() {
            moneyDevices = await getDeviceMoneyCore({ token: token });
            combine();
        }
        async function getDevice() {
            devices = await getDeviceCore({ token: token });
            combine();
        }
        // Process
        function combine() {
            if (moneyDevices != undefined && devices != undefined) {
                // console.log(devices);
                devices
                    .map(device => {
                        let time = diffFromNow(device.last_action_at);
                        let moneyDevice = moneyDevices.find(device2 => device2.android_id == device.AndroidId)
                        device.money = moneyDevice == undefined ? 0 : moneyDevice.total_price;
                        device.color = time.color;
                        device.ago = time.ago;
                    });
                devices.sort((a, b) => a.money - b.money);
                done(devices);
            }
        }
        try {
            // Run 2 threads
            getMoney();
            getDevice();
        } catch (error) {
            quit(error);
        }
    });
}

function diffFromNow(time) {
    if (time == undefined || time.length == 0) {
        return {
            color: 'color:blue;',
            ago: 'New',
        };
    }
    // Time ago
    var timeAgo = '';
    var periods = {
        month: 30 * 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        hour: 60 * 60 * 1000,
        minute: 60 * 1000
    };
    let diff2 = new Date() - new Date(time);
    if (diff2 > periods.month) {
        // it was at least a month ago
        timeAgo = Math.floor(diff2 / periods.month) + "m ago";
    } else if (diff2 > periods.week) {
        timeAgo = Math.floor(diff2 / periods.week) + "w ago";
    } else if (diff2 > periods.day) {
        timeAgo = Math.floor(diff2 / periods.day) + "d ago";
    } else if (diff2 > periods.hour) {
        timeAgo = Math.floor(diff2 / periods.hour) + "h ago";
    } else if (diff2 > periods.minute) {
        timeAgo = Math.floor(diff2 / periods.minute) + "m ago";
    } else {
        timeAgo = "Online";
    }
    // Color
    var color = '';
    var diff = Math.floor((Math.abs(new Date(time) - new Date()) / 1000) / 60);
    if (diff <= 15) {
        color = 'color:green;'
    } else if (diff > 15 && diff <= 60) {
        color = 'color:plum;'
    } else if (diff > 60 && diff <= 24 * 60) {
        color = 'color:orange;'
    } else {
        color = 'color:red;'
    }
    return {
        color: color,
        ago: timeAgo,
    };
}

function formatToday() {
    var date = new Date();

    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    let nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);;
    yearnextDate = nextDate.getFullYear();
    monthnextDate = nextDate.getMonth() + 1;
    dtnextDate = nextDate.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }

    if (dtnextDate < 10) {
        dtnextDate = '0' + dtnextDate;
    }

    if (month < 10) {
        month = '0' + month;
    }

    if (monthnextDate < 10) {
        monthnextDate = '0' + monthnextDate;
    }

    return {
        startDate: year + '-' + month + '-' + dt + 'T00:00:00+07:00',
        endDate: yearnextDate + '-' + monthnextDate + '-' + dtnextDate + 'T00:00:00+07:00',
    };
}