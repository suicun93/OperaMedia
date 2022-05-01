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
async function buffLinhTra() {

    try {
        // Get params
        var mat500 = document.getElementById('buff500').value;
        var mat100 = document.getElementById('buff100').value;

        // Clear all
        notify({ clear: true });

        let arr500 = mat500.split('\n');
        let arr100 = mat100.split('\n');

        // Execute
        notify({ message: 'Đang thực hiện...', color: 'cadetblue' });

        var arrThread = [];
        for (const link of arr500) {
            if (link && link !== "") {
                arrThread.push(new Promise(async (done) => {
                    try {
                        let result = await buffLiveStream({
                            link: link,
                            soPhut: 120,
                            soMat: 500,
                            kenh: 8,
                        })

                        notify({
                            message: 'Đã buff 500 cho <a href="' + link + '">' + link + '</a>. ' + result,
                            color: 'cadetblue',
                        });
                        done();
                    } catch (err) {
                        notify({
                            message: 'Buff thất bại: <a href="' + link + '">' + link + '</a>. ' + ' (' + err.message + ')',
                            color: 'red',
                        });
                        done();
                    }
                }));
            }
        }
        for (const link of arr100) {
            if (link && link !== "") {
                arrThread.push(new Promise(async (done) => {
                    try {
                        let result = await buffLiveStream({
                            link: link,
                            soPhut: 120,
                            soMat: 100,
                            kenh: 8,
                        })

                        notify({
                            message: 'Đã buff 100 cho <a href="' + link + '">' + link + '</a>. ' + result,
                            color: 'cornflowerblue',
                        });
                        done();
                    } catch (err) {
                        notify({
                            message: 'Buff thất bại: <a href="' + link + '">' + link + '</a>. ' + ' (' + err.message + ')',
                            color: 'red',
                        });
                        done();
                    }
                }));
            }
        }
        await Promise.all(arrThread);
        notify({
            message: 'Đã xử lý xong hết đơn.',
            color: 'darkorchid',
        });

    } catch (err) {
        notify({
            message: 'Buff thất bại: ' + err.message,
            color: 'red',
        });
    }
}

async function tachLink() {

    try {
        // Get params
        var pages = document.getElementById('page').value;
        var links = document.getElementById('link').value;

        // Clear all
        notify({ clear: true });

        pages = pages.split('\n');
        links = links.split('\n');

        // Execute
        notify({ message: 'Đang thực hiện...', color: 'cadetblue' });

        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const page = pages[i];
            try {
                let uuid = getUUID(link);
                notify({
                    message: page + ': <a href="' + uuid + '">' + uuid + '</a>',
                    color: 'cadetblue',
                });
            } catch (error) {
                notify({
                    message: page + ': Failed. ' + error.message,
                    color: 'red',
                });
            }
        }

        notify({
            message: 'Đã xử lý xong hết đơn.',
            color: 'darkorchid',
        });

    } catch (err) {
        notify({
            message: 'Buff thất bại: ' + err.message,
            color: 'red',
        });
    }
}

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

function getUUID(link) {
    let arr = link.replace('?', '&').split('&');
    for (const str of arr) {
        if (str && (str.startsWith('v=') || str.startsWith('video_id='))) {
            return (str.split('=')[1]);
        }
    }
    if (link.includes('videos/')) {
        let startPosition = link.indexOf('videos/') + 7;
        let endPosition = link.indexOf('/', startPosition);
        if (endPosition == -1) {
            return link.toString().substring(startPosition, link.length);
        } else {
            return link.toString().substring(startPosition, endPosition);
        }
    }
    throw Error('Không tìm thấy ID của link');
}

console.log(getUUID("https://www.facebook.com/cauchongaming/videos/708480083809476"));