const connection = require('../config/database');

const getApproveLP = async (req, res) => {
    const maBM = req.session.user.maBM;
    try {
        const TT_Ma = 'TT001';
    
        const [rows] = await connection.promise().query(
          `SELECT pnp.PNP_STT, gv.GV_Ma, gv.GV_HoTen, pnp.PNP_TuNgay, pnp.PNP_DenNgay 
           FROM phieunghiphep pnp, giaovien gv
           WHERE pnp.GV_Ma = gv.GV_Ma 
           AND pnp.TT_Ma = ? AND gv.TBM_Ma = ?`,
          [TT_Ma, maBM]
        );
    
        res.render('approve-lp', { data: rows, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi server');
    }
}

const getApproveLPDetail = async (req, res) => {
    try {
        const PNP_STT = req.params.PNP_STT;
    
        const [detailResult] = await connection.promise().query(
          `SELECT pnp.*, gv.GV_HoTen
          FROM phieunghiphep pnp, giaovien gv
          WHERE pnp.GV_Ma = gv.GV_Ma
          AND PNP_STT = ?`,
          [PNP_STT]
        );
    
        const [details] = await connection.promise().query(
          `SELECT * FROM chitietnghiphep WHERE PNP_STT = ?`,
          [PNP_STT]
        );
    
        if (detailResult.length === 0) {
          return res.status(404).send('Không tìm thấy đơn xin phép');
        }
    
        res.render('approve-lp-detail', { detail: detailResult[0], chitiet: details });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi server');
    }
}

const updateStatus = async (req, res) => {
    const { PNP_STT, action } = req.body;

    let TT_Ma = action === 'approve' ? "TT002" : "TT003";
    
    const query = `
        UPDATE phieunghiphep
        SET TT_Ma = ?
        WHERE PNP_STT = ?
    `;

    await connection.promise().query(query, [TT_Ma, PNP_STT]);

    res.redirect('/approve-lp');
    
}

module.exports = {
    getApproveLP,
    getApproveLPDetail,
    updateStatus,
};