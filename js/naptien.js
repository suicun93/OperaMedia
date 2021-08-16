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

function naptien() {
    // Get params
    var transactionId = document.getElementById('transactionId').value;

    // Clear all
    notify({ clear: true });

    //
    notify({ message: 'Đang nạp tiền...', color: 'cadetblue' });
    activeTransactionCore({ transactionId: transactionId })
        .then(result => {
            notify({ message: 'Nạp tiền thành công!', color: 'chocolate' });
            notify({ message: 'Đã nạp "' + result.money + '" vào "' + result.fullname + '".', color: 'green' });
        })
        .catch(err => notify({ message: 'Nạp tiền thất bại: ' + err, color: 'red', dismiss: true }));
}