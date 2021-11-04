
function logging(req, res, next){
    const date = new Date()
    const day = date.getDay();
    console.log("Time: " + day);
    next()
}

module.exports = {
    logging: logging
}