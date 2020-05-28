const strat = require('./src/models/index');
const db = require('./src/database/database');
// the above should be inserted at the base of the other 'require' items
// below should be inserted with the client.on('ready"...) statement

db.authenticate()
    .then(() => {
        console.log('logged into DB.');
        strat.init(db);
    })
.catch(err => console.log(err));