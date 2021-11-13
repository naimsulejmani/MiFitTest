const express = require('express');
const http = require('http');

const compression = require('compression');

const cors = require('cors');



const app = express();
const server = http.createServer(app);
const apiRoutes = require('./../routes/index');
const errorHandler = require('../helpers/error.handler');

//const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

app.set("port", port);
app.use(express.json());

app.use(cors());
app.use(compression());

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    next();
});

app.use(function (req, res, next) {
   // res.io = io;
    console.log('called this');
    console.log(req.url);
    
    next();
});





// console.log(router)
app.use("/api", apiRoutes);

app.use("", errorHandler);


// io.on("connection", function (socket) {
//     socket.on("disconnect", function () {
//         console.log("disconnected!")
//     });

// })

module.exports = {
    app: app,
    server: server,
 //   io: io,
    http: http,
    express: express
};
