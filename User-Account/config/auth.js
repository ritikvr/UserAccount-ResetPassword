const jwt = require("jsonwebtoken");
const secret = "j34#^&*%@&HJKWSYOI#$&^$*hjol$j$%hj$l";

function setUser(user) {
    return jwt.sign(user, secret);
}

function getUser(token) {
    if(!token) {
        return res.status('not valid user');
    }
    return jwt.verify(token, secret);
}

module.exports = {
    setUser, 
    getUser
};