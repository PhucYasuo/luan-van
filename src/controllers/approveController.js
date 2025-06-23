const e = require('express');
const connection = require('../config/database');
const transporter = require('../config/mail');

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
            `SELECT pnp.*, gv.GV_Ma, gv.GV_HoTen
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

const sendResMail = async (req, res) => {
    try {
        const { GV_Ma, value } = req.body;
        const email = await getEmail(GV_Ma);
        let subject = '';
        let text = '';
        if (value === 'approve') {
            subject = 'Thông báo duyệt đơn xin phép';
            text = 'Đơn xin phép của bạn đã được duyệt.';
        } else if (value === 'reject') {
            subject = 'Thông báo từ chối đơn xin phép';
            text = 'Đơn xin phép của bạn đã bị từ chối.';
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            text: text,
        });
  
        console.log('Gửi thành công:', info.response);
        res.status(200).json({ message: 'Mail sent successfully' });
    } catch (error) {
        console.error('Lỗi gửi mail:', error);
        res.status(500).json({ message: 'Failed to send mail' });
    }
}

const getEmail = async (GV_Ma) => {
    const [rows] = await connection.promise().query(
        `SELECT GV_Mail FROM giaovien WHERE GV_Ma = ?`, 
        [GV_Ma]
    );
    
    return rows.length > 0 ? rows[0].GV_Mail : null;
}


module.exports = {
    getApproveLP,
    getApproveLPDetail,
    updateStatus,
    sendResMail
};