async function scanToday() {
    let scanThreadThongKe;

    // Loading UI
    let thongKeStatus = document.getElementById('thongKeStatus');
    let thongKe = document.getElementById('thongKe');

    // Check token exists
    let token = "3c6a29d6-218d-11ec-a115-b4969111cb2c";
    if (token.length != 0) {
        // Loading
        let repeatTime = 0;
        thongKeStatus.style = 'color:red';
        scanThreadThongKe = setInterval(() => {
            let text = '.'.repeat(repeatTime);
            thongKeStatus.textContent = 'Đang lấy dữ liệu' + text;
            repeatTime++;
            if (repeatTime == 7) {
                repeatTime = 0;
            }
        }, 100);

        // Đếm tính năng đang chạy
        let countNeed = 3;
        var countDone = 0;

        function count() {
            countDone++;
            if (countDone == countNeed - 1) {
                getDeviceMoney();
            }
            if (countDone == countNeed) {
                // Cancel current Thread
                clearInterval(scanThreadThongKe);
                scanThreadThongKe = undefined;

                // Show today
                setTimeout(() => thongKeStatus.textContent = '', 1000);
            }
        }
        // Get thông tin Money
        getThanhToanCore({ token: token })
            .then(result => {
                // Title
                var titleMoney = document.createElement('H1');
                titleMoney.innerHTML = 'Thống kê Tài chính';
                thongKe.appendChild(titleMoney);
                report({ label: 'Today', value: result.today });
                report({ label: 'Ước lượng cuối ngày', value: result.estimate });
                report({ label: 'Hôm qua', value: result.yesterday });
                report({ label: 'Tháng này', value: result.thangNay });
                report({ label: 'Tháng trước', value: result.thangTruoc });
                report({ label: 'Tổng từ trước đến nay', value: result.sum });
                count();
            })
            .catch(error => {
                count();
                // Show error
                thongKeStatus.style = 'color:red;display:block;';
                thongKeStatus.textContent = error;
            });
        // Get thông tin Clone
        getCloneCountCore({ token: token })
            .then(result => {
                // Title
                var titleClone = document.createElement('H1');
                titleClone.innerHTML = 'Thống kê Clone';
                thongKe.appendChild(titleClone);
                report({ label: 'All', value: result.all });
                report({ label: 'Live', value: result.live });
                report({ label: 'Checkpoint', value: result.checkpoint });
                report({ label: 'Stored', value: result.stored });
                report({ label: 'Checking', value: result.checking });
                report({ label: 'Getting', value: result.getting });
                count();
            })
            .catch(error => {
                count();
                // Show error
                thongKeStatus.style = 'color:red;display:block;';
                thongKeStatus.textContent = error;
            });

        function report({
            label: label,
            value: value,
        }) {
            var divToday = document.createElement('div');
            divToday.className = 'device';
            var labelToday = document.createElement('p');
            labelToday.style = 'flex:2;text-align:left';
            labelToday.innerHTML = label;
            divToday.appendChild(labelToday);
            var todayValue = document.createElement('p');
            todayValue.style = 'flex:1;color:chocolate;';
            todayValue.innerHTML = value;
            divToday.appendChild(todayValue);
            thongKe.appendChild(divToday);
        }

        function getDeviceMoney() {
            // Get thông tin Clone
            tongHopCloneCore({ token: token })
                .then(result => {
                    // Title
                    var title = document.createElement('H1');
                    title.innerHTML = 'Thống kê Devices:';
                    thongKe.appendChild(title);
                    // Tiền, androidId, thời gian, loại máy, label, clone, pin

                    // Title 2
                    var divGoc = document.createElement('div');
                    divGoc.className = 'device2';
                    // money
                    var money = document.createElement('p');
                    money.style = 'flex:3;color:mediumblue';
                    money.innerHTML = 'Tiền';
                    divGoc.appendChild(money);
                    // loaiMay
                    var loaiMay = document.createElement('p');
                    loaiMay.style = 'flex:3;color:brown;';
                    loaiMay.innerHTML = 'Model';
                    divGoc.appendChild(loaiMay);
                    // clone
                    var clone = document.createElement('p');
                    clone.style = 'flex:2';
                    clone.innerHTML = 'Clone';
                    divGoc.appendChild(clone);
                    // label
                    var label = document.createElement('p');
                    label.style = 'flex:4;color:crimson;';
                    label.innerHTML = 'Label';
                    divGoc.appendChild(label);
                    // pin
                    var pin = document.createElement('p');
                    pin.style = 'flex:3;color:green';
                    pin.innerHTML = 'Pin';
                    divGoc.appendChild(pin);
                    // androidId
                    var androidId = document.createElement('p');
                    androidId.style = 'flex:7;color:chocolate;';
                    androidId.innerHTML = 'AndroidId';
                    divGoc.appendChild(androidId);
                    // thời gian
                    var ago = document.createElement('p');
                    ago.style = 'flex:3;color:color:green';
                    ago.innerHTML = 'Online';
                    divGoc.appendChild(ago);
                    // sum up
                    thongKe.appendChild(divGoc);


                    for (const device of result) {
                        var div = document.createElement('div');
                        div.className = 'device2';
                        // money
                        var money = document.createElement('p');
                        money.style = 'flex:3;color:mediumblue';
                        money.innerHTML = device.money;
                        div.appendChild(money);
                        // loaiMay
                        var loaiMay = document.createElement('p');
                        loaiMay.style = 'flex:3;color:brown;';
                        loaiMay.innerHTML = device.Model;
                        div.appendChild(loaiMay);
                        // clone
                        var clone = document.createElement('p');
                        clone.style = 'flex:2';
                        clone.innerHTML = device.num_clone_facebook;
                        div.appendChild(clone);
                        // label
                        var label = document.createElement('p');
                        label.style = 'flex:4;color:crimson;';
                        label.innerHTML = device.label == undefined ? '' : device.label;
                        div.appendChild(label);
                        // pin
                        var pin = document.createElement('p');
                        let colorPin = (device.battery_percent < 60) ? 'red;' : device.is_bat_charge ? 'forestgreen;' : 'grey;';
                        pin.style = 'flex:3;color:' + colorPin;
                        pin.innerHTML = device.battery_percent + '%';
                        div.appendChild(pin);
                        // androidId
                        var androidId = document.createElement('p');
                        androidId.style = 'flex:7;color:chocolate;';
                        androidId.innerHTML = device.AndroidId;
                        div.appendChild(androidId);
                        // thời gian
                        var ago = document.createElement('p');
                        ago.style = 'flex:3;align-self: flex-end;' + device.color;
                        ago.innerHTML = device.ago;
                        div.appendChild(ago);
                        // sum up
                        thongKe.appendChild(div);
                    }
                    count();
                })
                .catch(error => {
                    count();
                    // Show error
                    thongKeStatus.style = 'color:red;display:block;';
                    thongKeStatus.textContent = error;
                });
        }
    } else {
        thongKeStatus.style = 'color:brown';
        thongKeStatus.textContent = 'Bạn cần đăng nhập để lấy dữ liệu.';

        // Nút login
        document.getElementById('loginBtn').style = 'display:block;';
        document.getElementById('reset-status-title').style = 'display:block;';
    }
}