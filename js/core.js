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
            "limit": totalPageSize,
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
                        page: page,
                        clones: json.data.data,
                    });
                } else {
                    quit(json.message);
                }
            })
            .catch(error => quit(error));
    });
    // .then(result => console.log(result)).catch((err) => console.error(err));
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
    function formatToday() {
        var date = new Date();
        date = new Date(date.getTime());

        year = date.getFullYear();
        month = date.getMonth() + 1;
        dt = date.getDate();
        nextDate = dt + 1;

        if (dt < 10) {
            dt = '0' + dt;
        }

        if (nextDate < 10) {
            nextDate = '0' + nextDate;
        }

        if (month < 10) {
            month = '0' + month;
        }

        return {
            startDate: year + '-' + month + '-' + dt + 'T00:00:00+07:00',
            endDate: year + '-' + month + '-' + nextDate + 'T00:00:00+07:00',
        };
    }

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