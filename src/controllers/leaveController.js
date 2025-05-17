const express = require('express');
const connection = require('../config/database');

const getLeave = (req, res) => {
    return res.render('leave-permission.ejs', {
        maGV: req.session.user.maGV,
        maBM: req.session.user.maBM,
        maCV: req.session.user.maCV,
        hocKy: req.session.user.hocKy,
        namHoc: req.session.user.namHoc,
        user: req.session.user
    });
}
//Note: dù chỉ là select nhưng nên dùng post vì có body và nhiều tham số đầu vào
const postClass = (req, res) => {
    const { date, weekday } = req.body; // date dạng YYYY-MM-DD
    
    
    const query = `
      SELECT M_Ma, L_STTLop, K_Khoi, KH_KyHieu, TKB_TietBD, TKB_SoTiet
      FROM thoikhoabieu
      WHERE GV_Ma = ? AND TKB_Thu = ? AND TKB_NgayHieuLuc <= ? AND NH_NamHoc = ? AND HK_HocKy = ?
    `;
    
    connection.query(query, [req.session.user.maGV, weekday, date, req.session.user.namHoc, req.session.user.hocKy], (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn:", err);
            return res.status(500).json({ error: "Lỗi truy vấn CSDL" });
        }
        
        // Xử lý dữ liệu trả về: tính tên lớp và chỉ lấy các dòng duy nhất theo lớp và môn
        const classes = results.map(row => ({
            subject: row.M_Ma,
            className: row.K_Khoi + row.KH_KyHieu + row.L_STTLop, 
            tietBD: row.TKB_TietBD,
            soTiet: row.TKB_SoTiet
        }));
        
        // Lọc các lớp duy nhất
        
        const uniqueClasses = [];
        const seen = new Set();
        classes.forEach(item => {
            const key = item.className + "_" + item.subject;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueClasses.push(item);
            }
        });
        
        res.json({ classes: uniqueClasses });
    });
};

const getTeacher = (req, res) => {
    const sql = "SELECT GV_Ma, GV_HoTen, TBM_Ma FROM giaovien";
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}

const postResultLP = (req, res) => {
    const leaveData = req.body.leaveData || [];
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    const reason = req.body.reason;
    let maGV = req.session.user.maGV; // Lấy maGV từ req.body
    res.render('result-leave-permission.ejs', { leaveData, fromDate, toDate, reason, maGV });
}

const getSubject = async (req, res) => {
    const sql = "SELECT M_Ma, M_Ten FROM monhoc";
    
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}



module.exports = {
    getLeave,
    postClass,
    getSubject,
    getTeacher,
    postResultLP
};