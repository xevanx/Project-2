require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8081;
const session = require('express-session');
const authRoute = require('../src/routes/auth');
const discordStrategy = require('../src/strategies/discordstrategy');
const passport = require('passport');

app.engine("handlebars", exphbs({ defaultLayout: "commands" }));
app.set("view engine", "handlebars");

var commands = [
	{
		commandTitle: "!join",
		commandUse: "To test if the bot can join the voice channel for music use"
	}, {
		commandTitle: "!leave",
		commandUse: "To kick the bopt from a voice channel whenever needed"
	}, {
		commandTitle: "!play",
		comamndUse: "Using this command following a Youtube url makes the bot join the voice channel to listen to audio from the video provided"
	}, {
		commandTitle: "!meme",
		commandUse: "This command makes the bot randomly pull a meme from reddit and posts it into the chat"
	}, {
		commandTitle: "!command",
		commandUse: "This command brings up a simple list of commands into the chat for everyone's use"
	}
]

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

