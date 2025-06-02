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

const create = async (req, res) => {
    try{
        const {GV_Ma, GV_HoTen, GV_NgaySinh, GV_GioiTinh, GV_SoDT, GV_Mail, GV_DiaChi, TBM_Ma} = req.body;

        if(!GV_Ma || !GV_HoTen || !GV_NgaySinh || !GV_GioiTinh || !GV_SoDT || !GV_Mail || !GV_DiaChi || !TBM_Ma) {
            return res.status(400).json({message: 'All fields are required'});
        }

        const sql = `INSERT INTO giaovien (GV_Ma, GV_HoTen, GV_NgaySinh, GV_GioiTinh, GV_SoDT, GV_Mail, GV_DiaChi, TBM_Ma) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        await connection.promise().execute(sql, [
            GV_Ma,
            GV_HoTen,
            GV_NgaySinh,
            GV_GioiTinh,
            GV_SoDT,
            GV_Mail,
            GV_DiaChi,
            TBM_Ma
        ])
        
        res.status(201).json({message: 'Thêm giáo viên thành công'});
    
    } catch (error) {
		console.error('Lỗi khi thêm giáo viên:', error);
		res.status(500).json({ message: 'Lỗi server khi thêm giáo viên' });
	}
}

const getNewId = async (req, res) => {
    const [maxGV] = await connection.promise().query(`SELECT MAX(GV_Ma) AS max FROM giaovien`);
    let newGV = 'GV001';
    if (maxGV[0].max) {
        const num = parseInt(maxGV[0].max.slice(2)) + 1; 
        newGV = 'GV' + num.toString().padStart(3, '0');  
    }
    
    res.json(newGV);
}

const update = async (req, res) => {
    try{
        const {GV_Ma, GV_HoTen, GV_NgaySinh, GV_GioiTinh, GV_SoDT, GV_Mail, GV_DiaChi, TBM_Ma} = req.body;

        if(!GV_Ma || !GV_HoTen || !GV_NgaySinh || !GV_GioiTinh || !GV_SoDT || !GV_Mail || !GV_DiaChi || !TBM_Ma) {
            return res.status(400).json({message: 'All fields are required'});
        }
        
        
        const sql = `UPDATE giaovien SET 
            GV_HoTen = ?, 
            GV_NgaySinh = ?, 
            GV_GioiTinh = ?, 
            GV_SoDT = ?, 
            GV_Mail = ?, 
            GV_DiaChi = ?, 
            TBM_Ma = ? 
            WHERE GV_Ma = ?`;
        await connection.promise().execute(sql, [
            GV_HoTen, 
            GV_NgaySinh, 
            GV_GioiTinh, 
            GV_SoDT, 
            GV_Mail, 
            GV_DiaChi, 
            TBM_Ma, 
            GV_Ma
        ]);
        res.status(200).json({ message: 'Cập nhật giáo viên thành công' });
    } catch (error) {
		console.error('Lỗi khi cập nhật giáo viên:', error);
		res.status(500).json({ message: 'Lỗi server khi cập nhật giáo viên' });
	}
}

const remove = async (req, res) => {
    try{
        const {GV_Ma} = req.body;
        const sql = `DELETE FROM giaovien WHERE GV_Ma = ?`;
        await connection.promise().execute(sql, [GV_Ma]);
        res.status(200).json({ message: 'Xoá giáo viên thành công' });
    }
    catch (error) {
        console.error('Lỗi khi xóa giáo viên:', error);
        res.status(500).json({ message: 'Lỗi server khi xóa giáo viên' });
    }
}

module.exports = {
    index,
    getOne,
    create,
    update,
    remove,
    getNewId
};