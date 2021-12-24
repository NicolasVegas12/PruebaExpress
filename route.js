const config = require('config');


function route(req,res,next) {
    console.log(`Acceso dirigido hacia -> http://localhost:${config.port}${req.url}`);
    next();
}

module.exports = route;