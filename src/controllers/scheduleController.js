const connection = require('../config/database');

const getSchedule = (req, res) => {
    return res.render('schedule', { user: req.session.user });
}

module.exports = {
    getSchedule
};