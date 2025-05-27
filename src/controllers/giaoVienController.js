const connection = require('../config/database');

const index = async (req, res) => {
    const [giaoviens] = await connection.promise().query('SELECT * FROM giaovien');
    const [tobomons] = await connection.promise().query('SELECT * FROM tobomon');
    res.render('giaovien/index.ejs', {
        giaoviens: giaoviens,
        tobomons: tobomons,
        user: req.session.user
    });
}

const getOne = (req, res) => {

}

const create = (req, res) => {

}

const update = (req, res) => {
    res.render('giaovien/create.ejs', {
        user: req.session.user
    });
}

const remove = (req, res) => {

}

module.exports = {
    index,
    getOne,
    create,
    update,
    remove
};