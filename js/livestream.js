async function buff() {

    try {
        // Get params
        var link = document.getElementById('link').value;
        var soMat = document.getElementById('soMat').value;
        var soPhut = document.getElementById('soPhut').value;
        var kenh = document.getElementById('kenh').value;

        // Clear all
        notify({ clear: true });

        // Check data
        if (!soMat || !soPhut || !kenh) {
            throw Error('Số mắt hoặc số phút hoặc số kênh bị sai');
        }

        // Execute
        notify({ message: 'Đang thực hiện...', color: 'cadetblue' });
        let result = await buffLiveStream({
            link: link,
            soPhut: soPhut,
            soMat: soMat,
            kenh: kenh,
        })
        console.log(result);
        notify({ message: result, color: 'chocolate' });
        notify({ message: 'Đã buff <a href="' + link + '">' + link + '</a>.', color: 'green' });
    } catch (err) {
        notify({ message: 'Buff thất bại: ' + err.message, color: 'red', dismiss: true });
    }
}

// buffLiveStream({
//     id: getUUID('https://www.facebook.com/watch/live/?ref=notif&v=322712496668949&notif_id=1651129801023191&notif_t=live_video_explicit'),
//     soPhut: 30,
//     soMat: 50,
//     kenh: 8,
// })

function buffLiveStream({
    link,
    soPhut,
    soMat,
    kenh,
}) {
    return new Promise((done, quit) => {
        var formdata = new FormData();
        formdata.append("link", link);
        formdata.append("soPhut", soPhut);
        formdata.append("soMat", soMat);
        formdata.append("kenh", kenh);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://clevai.herokuapp.com/livestream", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result) {
                    if (result.success == 1) {
                        done(result.message);
                    } else {
                        quit(Error(result.message));
                    }
                } else {
                    quit(Error('Không thành công'));
                }
            })
            .catch(err => quit(err));
    });

}