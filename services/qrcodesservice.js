const QRCode = require("qrcode");
const uuidv4 = require("uuid")
    // QRCode.toFile("./images/qrcode.jpg", 'Some text', {
    //     color: {
    //         dark: '#FFF', // Blue dots
    //         light: '#0000' // Transparent background
    //     }
    // }, function(err) {
    //     if (err) throw err
    //     console.log('done')
    // })

const uid = uuidv4.v4();
console.log(uid);

QRCode.toDataURL(uid, (err, url) => {
    if (err) console.log(err);

    console.log(url)
})