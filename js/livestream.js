async function buff() {

    try {
        // Get params
        var link = document.getElementById('link').value;
        var soMat = document.getElementById('soMat').value;
        var soPhut = document.getElementById('soPhut').value;

        // Clear all
        notify({ clear: true });

        // Lấy data
        soMat = parseInt(soMat);
        soPhut = parseInt(soPhut);
        link = getUUID(link);

        // Check data
        if (!soMat || !soPhut) {
            throw 'Số mắt hoặc số phút bị sai';
        }

        // Execute
        notify({ message: 'Đang thực hiện...', color: 'cadetblue' });
        let result = await buffLiveStream({
            id: link,
            soPhut: soPhut,
            soMat: soMat,
            kenh: 8, // Kenh mac dinh la 8
        })

        notify({ message: result, color: 'chocolate' });
        notify({ message: 'Đã buff <a href="https://www.facebook.com/' + link + '">fb.com/' + link + '</a>.', color: 'green' });
    } catch (err) {
        notify({ message: 'Buff thất bại: ' + err, color: 'red', dismiss: true });
    }
}

// buffLiveStream({
//     id: getUUID('https://www.facebook.com/watch/live/?ref=notif&v=322712496668949&notif_id=1651129801023191&notif_t=live_video_explicit'),
//     soPhut: 30,
//     soMat: 50,
//     kenh: 8,
// })

function getUUID(link) {
    let arr = link.split('&');
    for (const str of arr) {
        if (str && str.startsWith('v=')) {
            return (str.split('=')[1]);
        }
    }
    throw 'Không tìm thấy ID của link';
}

async function buffLiveStream({
    id,
    soPhut,
    soMat,
    kenh,
}) {
    return new Promise((done, quit) => {
        var raw =
            "id=" + id +
            "&amount=" + soMat +
            "&channel_number=" + kenh +
            "&mins=" + soPhut;

        var requestOptions = {
            method: 'POST',
            headers: {
                "authority": "vietnamfb.com",
                "accept": "*/*",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "x-requested-with": "XMLHttpRequest",
                "origin": "https://vietnamfb.com",
                "referer": "https://vietnamfb.com/?mc=bufflive",
                "cookie": "PHPSESSID=s3pv6buql4hvv775arjk77pgp3; _ggwp=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJodHRwczpcL1wvdmlldG5hbWZiLmNvbVwvIiwiaWF0IjoxNjUxMjE3NTM1LCJleHAiOjE2NTEyNjA3MzUsInVzZXJuYW1lIjoiMDM1MjgzNTM2OCJ9.E_1PkKug-IN-fdP_XE8bE8UsEvRRVkgj8eWjtQw5gqw1JH47rCQRV2mj2EZMJqGe-c6DlgqQVzUeKre77MPkyjDYMZDc4YA-ouQo3uH5H7Q4Ge7vn4Ail-nlp1EOeqydfKE4gmikZijza2wkaYcnRSNHueX1M7AI0X-F5jcyO0XICYRlqzYQTyX-hiuVaB1wIQdc0BNN8ox8audmd8mXFy3g896nKJ7Z6hDoj1Iwv-WiHyeil4ipaGRMDmloMW3obqtFmpGxRvqDnLRGK1b_9t5sQo9Ikwx-ofrAuDMW_pyYq2q6J36erg1OYNXvbZoREFAUHTEHqx6rxv7v4O8aSA; __cf_bm=WYKqCTGixV6Zku6kQvNoKKB6cUIMJgOpLwU0THApMo8-1651222244-0-AXRkA87eNzMteEvca5F7HkPOdtuyMRygN+GhW+Fr7g8/2eajQni+QzBg1OTRZlObX6RxXDkRRmM6nCfeuLZdzNDPZBPVso+0UCgmfyunwdiCPqfXZnnn9zUzdNBc4p9DXg==",
            },
            body: raw,
            redirect: 'follow'
        };

        fetch("https://vietnamfb.com/?mc=bufflive&site=buff_live", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result) {
                    if (result.success == 1) {
                        done(result.message);
                    } else {
                        quit(result.message);
                    }
                } else {
                    quit('Không thành công');
                }
            }).catch(err => quit(err));;
    });

}