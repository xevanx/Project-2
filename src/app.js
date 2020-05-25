require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8081;
const session = require('express-session');
const authRoute = require('./routes/auth');
const discordStrategy = require('./strategies/discordstrategy');
const passport = require('passport');

app.use(session({
	secret: 'some random secret',
	cookie: {
		maxAge: 60000 * 60 * 24,
	},
	saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoute);

app.listen(PORT, () => {
	console.log(`now listening to requests on port ${PORT}`);
});

