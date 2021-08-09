var count = 0;

// const Statuses = {
//     CHECKPOINT: 'checkpoint',
//     CHECKING: 'checking',
//     NO_ACTIVITY_24H: 'no24h',
//     NO_DO_RESULT_24H: 'no-doresult-24h'
// }

function lamChuyenAy() {
    myLog({ clear: true });
    var token = document.getElementById('token').value;
    var limit = document.getElementById('limit').value;
    var page = document.getElementById('page').value;
    var createdDateContains = document.getElementById('createdDateContains').value;
    var androidIdIsEmptyOnly = document.getElementById('androidIdIsEmptyOnly').checked;
    var status = [];

    /* Iterate options of select element */
    for (const option of document.querySelectorAll('#status option')) {
        if (option.selected) {
            status.push(option.value);
        }
    }

    // Call API
    listCloneAndReset({
        token: token,
        limit: parseInt(limit),
        page: parseInt(page),
        createdDateContains: createdDateContains,
        androidIdIsEmptyOnly: androidIdIsEmptyOnly,
        status: status,
    })
}

async function listCloneAndReset({
    token: token,
    limit: limit = 50000,
    page: page = 1,
    createdDateContains: createdDateContains = "",
    androidIdIsEmptyOnly: androidIdIsEmptyOnly = true,
    status: status = [Statuses.CHECKPOINT]
}) {
    // myLog({ info: "token: " + token });
    // myLog({ info: "limit: " + limit });
    // myLog({ info: "page: " + page });
    // myLog({ info: "createdDateContains: " + createdDateContains });
    // myLog({ info: "androidIdIsEmptyOnly: " + androidIdIsEmptyOnly });
    // myLog({ info: "status: " + status });
    // console.log(status);

    // No token thi chiu
    if (token.length == 0) {
        myLog({ info: "Không có token thì chịu!" });
        return;
    }

    // Co token thi vao viec
    await new Promise((resolve, _) => {
        // Luồng gió mới
        var settings = {
            "url": "https://customer.autofarmer.net/v1/clones/search",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "token": token,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "alive_status": status,
                "appname": [
                    "facebook"
                ],
                "page": page,
                "limit": limit,
                "android_id": null
            }),
        };

        $.ajax(settings).done(async function(response) {
            var json = response;
            var listClone = json.data.data;
            myLog({ info: "Tổng cộng cần xử lý: " + listClone.length + " clones." });
            await Promise.all(listClone.map(async(clone) => {
                if (
                    // clone.alive_status === 'checkpoint' &&
                    (!androidIdIsEmptyOnly || clone.android_id.length == 0) &&
                    formatDate({ dateInput: clone.created_date }).indexOf(createdDateContains) != -1
                ) {
                    await resetClone(
                        token = token,
                        clone_id = clone.id,
                        uid = clone.uid,
                    );
                }
            }));

            // Done
            myLog({ info: "Done: " + count + " clones." });
            resolve();
        });
    });
}

async function resetClone(token, clone_id, uid) {
    await new Promise((resolve, _) => {
        var data = "{\n    \"clone_id\":\"" + clone_id + "\"\n}";

        // Luồng gió mới
        var settings = {
            "url": "https://customer.autofarmer.net/v1/clones/reset",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "token": token,
                "Content-Type": "application/json"
            },
            "data": data,
        };

        $.ajax(settings)
            .done(response => {
                if (response.code === 200) {
                    myLog({
                        info: "Đã Reset: ",
                        uid: uid,
                    });
                } else {
                    myLog({
                        info: "Đã Failed: ",
                        uid: uid,
                    });
                }
            })
            .fail(() => {
                myLog({
                    info: "Đã Failed: ",
                    uid: uid,
                });
            })
            .always(() => {
                count++;
                resolve();
            });
    }, );
}

function formatDate({ dateInput: dateInput = Date().toISOString() }) {
    var date = new Date(dateInput);
    date = new Date(date.getTime());

    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    return dt + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ':' + seconds;
}

function myLog({
    uid: uid = "",
    info: info = "",
    clear: clear = false,
}) {
    // Clear
    if (clear) {
        document.getElementById('ahihi').innerHTML = '';
        return;
    }

    // Show
    if (uid.length != 0) {
        document.getElementById('ahihi').innerHTML += info + "<a href='https://www.fb.com/" + uid + "'>" + uid + "</a><br/>";
    } else {
        document.getElementById('ahihi').innerHTML += "<p>" + (info.length != 0 ? info : "empty") + "</p>";
    }
}

// function getKeyByValue(searchValue) {
//     return Object.keys(Statuses).find(
//         key => Statuses[key] === searchValue,
//     )
// }