var CLONE_NEW_KEY = 'everything-new';

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

function notify2({
    message: message = '',
    dismiss: dismiss = false,
    clear: clear = false,
    color: color = 'black',
    tag: tag = 'ket-qua2',
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

function loadActions(token) {
    // Mapping UI
    let tableActions = document.getElementById('actions');
    let selectFrom = document.getElementById('from');
    let selectTo = document.getElementById('to');
    selectFrom.innerHTML = '';
    selectTo.innerHTML = '';
    tableActions.style.display = 'none';

    notify2({ message: 'Đang load actions...', color: 'cadetblue' });

    getAllActionsCore({ token: token })
        .then((actions) => {
            // New clone
            var moi = document.createElement('option');
            moi.value = CLONE_NEW_KEY;
            moi.innerHTML = 'Clone Chưa có action';
            selectFrom.appendChild(moi);

            // All
            var all = document.createElement('option');
            all.value = '';
            all.innerHTML = 'Tất cả';
            selectFrom.appendChild(all);

            // Các loại khác
            actions.data.forEach((action) => {
                var opt = document.createElement('option');
                opt.value = action.id;
                opt.innerHTML = action.name;
                selectTo.appendChild(opt);

                var opt2 = document.createElement('option');
                opt2.value = action.id;
                opt2.innerHTML = action.name;
                selectFrom.appendChild(opt2);
            });

            // Done
            notify2({ message: 'Load thành công, Chọn action bạn muốn đổi.', color: 'chocolate' });
            tableActions.style.display = 'block';
        })
        .catch((error) => {
            console.log(error);
            notify2({ message: 'Load Actions error. (' + error + ')', color: 'red' });
        });
}

function setupView() {
    // Get params
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Clear all
    notify2({ clear: true });

    // Load action
    notify2({ message: 'Đang đăng nhập...', color: 'cadetblue' });
    loginCore({ username: username, password: password })
        .then(token => {
            notify2({ message: 'Đăng nhập thành công!', color: 'chocolate' });
            loadActions(token);
        })
        .catch(err => notify2({ message: 'Đăng nhập thất bại: ' + err, color: 'red', dismiss: true }));
}

function changeActions() {
    // Get params
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Clear all
    notify2({ clear: true });

    // Load action
    notify2({ message: 'Đang đăng nhập...', color: 'cadetblue' });
    loginCore({ username: username, password: password })
        .then(token => {
            notify2({ message: 'Đăng nhập thành công!', color: 'chocolate' });
            changeActionsAhihi(token);
        })
        .catch(err => notify2({ message: 'Đăng nhập thất bại: ' + err, color: 'red', dismiss: true }));
}

function changeActionsAhihi(token) {
    let selectFrom = document.getElementById('from').value;
    let selectTo = document.getElementById('to').value;
    let createdDateContains = document.getElementById('createdDateContains2').value;

    var countNeed = 0;
    var countDone = 0;
    // Notify ra giao diện

    // Đếm
    function count() {
        countDone++;
        if (countDone == countNeed) {
            notify2({ message: 'Đã chuyển đổi thành công: ' + countDone, color: 'green' });
            console.log('Đã chuyển đổi thành công: ' + countDone);
        }
    }


    // Load clone
    notify2({ message: 'Đang lấy tất cả clone.', color: 'cadetblue' });

    listCloneCore({ token: token })
        .then(async clones => {

            // Load done
            notify2({ message: 'Clone loaded. ' + clones.length + ' clones. Đang đổi action...', color: 'chocolate' });
            // Filter
            for (const clone of clones) {
                if (
                    // Lọc theo ngày
                    formatDate({ dateInput: clone.created_date }).indexOf(createdDateContains) != -1 &&
                    // Lọc theo trạng thái
                    (
                        // Quét clone new
                        (selectFrom == CLONE_NEW_KEY &&
                            clone.action_profile_id == undefined) ||
                        // Quét clone đã có action_profile_id
                        (clone.action_profile_id != undefined &&
                            clone.action_profile_id.indexOf(selectFrom) != -1)
                    ) &&
                    // Tránh chạy mấy con chuyển bị trùng
                    (selectFrom == CLONE_NEW_KEY || clone.action_profile_id != selectTo)
                ) {
                    countNeed++;
                    let aTag = '<a href="https://fb.com/' + clone.uid + '">' + clone.uid + '</a>';
                    // change action
                    changeAction({
                            token: token,
                            cloneId: clone.id,
                            actionId: selectTo,
                        })
                        .then(_ => {
                            notify2({ message: "Đã Change: " + aTag, color: 'green' });
                            count();
                        })
                        .catch(error => {
                            console.log(error);
                            notify2({ message: "Fail: " + aTag, color: 'red' });
                            count();
                        });
                }
            }
            // Nothing found
            if (countNeed == 0) notify2({ message: 'Không thấy clone thỏa mãn yêu cầu.', color: 'red' });
        })
        .catch((err) => {
            notify2({ message: 'Clone loaded Failed: ' + err, color: 'red' });
        });

}