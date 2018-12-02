const { App } = require('./app');

let port = process.env.PORT || 3000;

App.listen(port, () => console.log('server is running'));
