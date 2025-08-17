const connection = require('../config/database');

const getSchedule = async (req, res) => {
    const tuan = await getThisWeek(req,res);
    const tuanMin = await getMinWeek(req,res);
    const tuanMax = await getMaxWeek(req,res);
    return res.render('schedule', {
        user: req.session.user,
        tuan: parseInt(tuan.Tuan,10),
        tuanMin: parseInt(tuanMin.Tuan,10),
        tuanMax: parseInt(tuanMax.Tuan,10)
    });
}

const getThisWeek = async (req,res) => {
    const [results] = await connection.promise().query(`
        SELECT SUBSTRING(T_Ma,2,2) AS Tuan
        FROM tuan
        WHERE ? BETWEEN T_NgayDT AND T_NgayKT`,
        [req.today]
    );
    return results[0];
}

const getMinWeek = async (req,res) =>{
    const [results] = await connection.promise().query(`
        SELECT SUBSTRING(T_Ma,2,2) AS Tuan
        FROM tuan
        ORDER BY T_Ma ASC`,
    );
    return results[0];
}

const getMaxWeek = async (req,res) =>{
    const [results] = await connection.promise().query(`
        SELECT SUBSTRING(T_Ma,2,2) AS Tuan
        FROM tuan
        ORDER BY T_Ma DESC`,
    );
    return results[0];
}

const getClassByGrade = async (req, res) => {
    const {khoi} = req.query;
    const [results] = await connection.promise().query(`
        SELECT CONCAT(K_Khoi,KH_KyHieu,L_STTLop) AS Lop
        FROM lop
        WHERE K_Khoi = ?
        AND NH_NamHoc = ?`,
        [khoi,req.session.user.namHoc]
    );
    return res.json(results);
}

const getGiaoViens = async (req, res) => {
    const {khoi, kyHieu, sttlop} = req.query;
    const [results] = await connection.promise().query(`
        SELECT gv.GV_Ma, GV_HoTen, m.M_Ma, m.M_Ten, ctgd.CTGD_SoTietTuan
        FROM giaovien gv
        JOIN giangday gd ON gv.GV_Ma = gd.GV_Ma
        JOIN monhoc m ON gd.M_Ma = m.M_Ma
        JOIN chuongtrinhgiangday ctgd ON gd.K_Khoi = ctgd.K_Khoi
            AND gd.M_Ma = ctgd.M_Ma
            AND gd.HK_HocKy = ctgd.HK_HocKy
            AND gd.NH_NamHoc = ctgd.NH_NamHoc
        WHERE gd.HK_HocKy = ?
        AND gd.NH_NamHoc = ?
        AND gd.K_Khoi = ?
        AND gd.KH_KyHieu = ?
        AND gd.L_STTLop = ?`,
        [req.session.user.hocKy,req.session.user.namHoc,khoi,kyHieu,sttlop]
    );
    return res.json(results);
}

const getSchedules = async (req, res) => {
    const {khoi, kyHieu, sttlop, tuan} = req.query;
    const namHoc = req.session.user.namHoc;
    const maNam = namHoc.substring(2,4)+namHoc.substring(7);
    const maTuan = `T${String(tuan).padStart(2, "0")}${maNam}`;
    const [results] = await connection.promise().query(`
        SELECT *
        FROM thoikhoabieu
        WHERE T_Ma = ?
        AND K_Khoi = ?
        AND KH_KyHieu = ?
        AND L_STTLop = ?
        AND (TT_Ma = 'TT001' OR TT_Ma = 'TT002')`,
        [maTuan,khoi,kyHieu,sttlop]
    );
    return res.json(results);
}

module.exports = {
    getSchedule,
    getClassByGrade,
    getGiaoViens,
    getSchedules
};