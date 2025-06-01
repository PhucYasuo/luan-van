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

const update = async (req, res) => {
    try{
        const {GV_Ma, GV_HoTen, GV_NgaySinh, GV_GioiTinh, GV_SoDT, GV_Email, GV_DiaChi, TBM_Ma} = req.body;

        if(!GV_Ma || !GV_HoTen || !GV_NgaySinh || !GV_GioiTinh || !GV_SoDT || !GV_Email || !GV_DiaChi || !TBM_Ma) {
            return res.status(400).json({message: 'All fields are required'});
        }

        const sql = `UPDATE giaovien SET 
            GV_HoTen = ?, 
            GV_NgaySinh = ?, 
            GV_GioiTinh = ?, 
            GV_SoDT = ?, 
            GV_Email = ?, 
            GV_DiaChi = ?, 
            TBM_Ma = ? 
            WHERE GV_Ma = ?`;
        await connection.promise().execute(sql, [
            GV_HoTen, 
            GV_NgaySinh, 
            GV_GioiTinh, 
            GV_SoDT, 
            GV_Email, 
            GV_DiaChi, 
            TBM_Ma, 
            GV_Ma
        ]);
        res.status(200).json({ message: 'Cập nhật thành công' });
    } catch (error) {
		console.error('Lỗi khi cập nhật giáo viên:', error);
		res.status(500).json({ message: 'Lỗi server khi cập nhật giáo viên' });
	}
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