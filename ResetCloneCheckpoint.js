function notify({
    message: message = '',
    dismiss: dismiss = false,
    clear: clear = false,
    color: color = 'black',
    tag: tag = 'ket-qua',
} = {}) {
    let ketQua = document.getElementById(tag);

    // Clear
    if (clear) {
        ketQua.innerHTML = '';
        return;
    }
    // Show
    let mess = document.createElement('p');
    mess.innerHTML = message;
    mess.style = 'color: ' + color;
    ketQua.appendChild(mess);
    // Dismiss
    if (dismiss) {
        setTimeout(() => { ketQua.innerHTML = '' }, 3000)
    }
}

function login() {
    // Get params
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    let createdDateContains = document.getElementById('createdDateContains').value;
    let androidIdIsEmptyOnly = document.getElementById('androidIdIsEmptyOnly').checked;
    let statusReset = document.getElementById('status-reset').value;

    // Clear all
    notify({ clear: true });

    //
    notify({ message: 'Đang đăng nhập...', color: 'cadetblue' });
    loginCore({ username: username, password: password })
        .then(token => {
            notify({ message: 'Đăng nhập thành công!', color: 'chocolate' });
            listCloneAndReset({
                token: token,
                createdDateContains: createdDateContains,
                androidIdIsEmptyOnly: androidIdIsEmptyOnly,
                status: statusReset,
            });
        })
        .catch(err => notify({ message: 'Đăng nhập thất bại: ' + err, color: 'red', dismiss: true }));
}

async function listCloneAndReset({
    token: token,
    createdDateContains: createdDateContains = "",
    androidIdIsEmptyOnly: androidIdIsEmptyOnly = true,
    status: status = 'checkpoint'
}) {
    // No token thi chiu
    if (token.length == 0) {
        myLog({ info: "Không có token thì chịu!" });
        notify({ message: 'Đăng nhập thất bại: ' + err, color: 'red' });
        return;
    }

    // Co token thi vao viec
    countNeed = 0;
    countDone = 0;
    notify({ message: 'Đang lấy tất cả clone...', color: 'cadetblue' });
    try {
        let listClone = await listCloneCore({
            token: token,
            status: status,
        });

        notify({ message: "Tổng cộng cần xử lý: " + listClone.length + " clones.", color: 'chocolate' });

        for (let clone of listClone) {
            if (
                (!androidIdIsEmptyOnly || clone.android_id.length == 0) &&
                formatDate({ dateInput: clone.created_date }).indexOf(createdDateContains) != -1
            ) {
                // Found
                countNeed++;
                let aTag = '<a href="https://fb.com/' + clone.uid + '">' + clone.uid + '</a>';

                // Reset Clone API
                resetCloneCore({ token: token, cloneId: clone.id })
                    .then(() => {
                        // Reset Done
                        notify({ message: "Đã Reset: " + aTag, color: 'green' });
                        always();
                    }).catch((error) => {
                        // Reset Fail
                        console.log(clone.uid + ' ' + error);
                        notify({ message: "Đã Fail: " + aTag, color: 'red' });
                        always();
                    });

                // Always run
                let always = () => {
                    countDone++;
                    if (countDone == countNeed) {
                        // Done
                        notify({
                            message: "Done: " + countDone + " clones.",
                            color: 'darkgoldenrod'
                        });
                    }
                };
            }
        };

        // Không tìm thấy clone thỏa mãn
        if (countNeed == 0) notify({ message: 'Không tìm thấy clone nào!', color: 'red' });
    } catch (e) {
        notify({ message: 'Lấy clone thất bại: ' + err, color: 'red' });
    }
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