const router = require('express').Router();
const passport = require('passport');

router.get('/', passport.authenticate('discord'));

module.exports = router;