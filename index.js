const app = require('./config/server.config').app;



console.log(`Server listenin on http://localhost:${app.get('port')}/`)
app.listen(app.get('port'), '0.0.0.0');