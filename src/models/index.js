const { Sequelize, Model } = require('sequelize');

// Create my mySQL connection using sequelize
const sequelize = new Sequelize('kwustyBot', 'root', 'toor', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    password: 'pokemon',
    pool: {
        max: 5,
        min: 0,
        idel: 10000,
    },
});

class User extends Model {}

User.init ({
    // attributes
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    discord_server_name: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    // premium_user: {
    //     type: Sequelize.BOOLEN,
    //     allowNull: false,
    // },
    created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIEMSTAMP'),
        allowNull: false,
    },
    updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
    sequelize: sequelize,
    modelName: 'User',
}, { sequelize, modelName: 'User' });
// Exports the connection for the other files to use
module.exports = sequelize;

sequelize.sync()
.then(() => User.create({
    discord_server_name: '16125',
    preminum_user: false,
}));