const path = require('path');
const config = require('config');

let config_dir = process.env.NODE_CONFIG_DIR;
if(!path.isAbsolute(config_dir))
{
    config_dir = path.join(path.dirname(require.main.filename), config_dir);
}

let backend_dir = config.backend_directory;
if(!path.isAbsolute(backend_dir))
{
    config.BACKEND_DIR = path.join(config_dir, backend_dir);
}

let app = require('./app');
app.connectDataBase();
app.startServer();
