const config = require('config')
let app = require('./app/app')

app.connectDataBase();
app.startServer();
