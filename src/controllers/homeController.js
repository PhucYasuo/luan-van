const express = require('express');
const connection = require('../config/database');

const getHomepage = (req, res) => {
	if (req.session.user) {
		res.redirect('/dashboard');
	} else {
		res.redirect('/sign-in');
	} 
};

const getDashboard = async (req, res) => {
	const sql = "SELECT GV_HoTen FROM giaovien WHERE GV_Ma = ?";
	let tenGV = '';

	try {
		const [results] = await connection.promise().query(sql, [req.session.user.maGV]);
		tenGV = results[0].GV_HoTen;
		
		
		return res.render('dashboard.ejs', {
			tenGV,
			maGV: req.session.user.maGV,
			maBM: req.session.user.maBM,
			maCV: req.session.user.maCV,
			hocKy: req.session.user.hocKy,
			namHoc: req.session.user.namHoc,
			user: req.session.user
		});
	} catch (err) {
		console.error(err);
		return res.send('Đã xảy ra lỗi khi truy vấn cơ sở dữ liệu.');
	}
}

const getSignIn = (req, res) => {
	res.render('sign-in.ejs');
}

const postSignIn = async (req, res) => {
    const { account, password } = req.body;
    
    try {
        const [results] = await connection.promise().query('SELECT * FROM taikhoan WHERE TK_Ten = ? AND TK_MatKhau = ?', [account, password]);

        if (results.length > 0) {
			req.session.user = {};

			const today = getToDay(); // yyyy-mm-dd
			const [namHocResults] = await connection.promise().query('select * from namhoc where NH_NgayDauNam < ? order by NH_NgayDauNam desc limit 1', [today]);
			req.session.user.namHoc = namHocResults[0].NH_NamHoc;
	
			const [hocKyResults] = await connection.promise().query('select * from hocky');
			const soNgay = countDaysBetween(namHocResults[0].NH_NgayDauNam, today);
			if (soNgay <= hocKyResults[0].HK_SoTuan*7)
				req.session.user.hocKy = hocKyResults[0].HK_HocKy;
			else if (soNgay <= (hocKyResults[0].HK_SoTuan*7 + hocKyResults[1].HK_SoTuan*7))
				req.session.user.hocKy = hocKyResults[1].HK_HocKy;
			else
				req.session.user.hocKy = "H";

			req.session.user.maGV = results[0].GV_Ma;

            const [results2] = await connection.promise().query('SELECT gcv.CV_Ma FROM giaovien gv, giuchucvu gcv WHERE gcv.GV_Ma = gv.GV_Ma AND gv.GV_Ma = ? AND gcv.HK_HocKy = ? AND gcv.NH_NamHoc = ?', [req.session.user.maGV, req.session.user.hocKy, req.session.user.namHoc]);
            
            if (results2.length > 0) {
				req.session.user.maCV = results2[0].CV_Ma;
            } else {
                req.session.user.maCV = "";
            }
			
			const [results3] = await connection.promise().query('SELECT TBM_Ma FROM giaovien WHERE GV_Ma = ?', [req.session.user.maGV]);
			if (results3.length > 0) {
				req.session.user.maBM = results3[0].TBM_Ma;
            } else {
				return res.send('Lỗi không xác định. Không tìm thấy mã bộ môn của giáo viên này!');
			}
			

            
            res.redirect(`/dashboard`); 
        } else {
            res.render('sign-in', { errorMessage: 'Đăng nhập thất bại. Sai tài khoản hoặc mật khẩu!' });
        }
    } catch (err) {
        console.error(err);
        res.send('Lỗi trong quá trình xử lý yêu cầu.');
    }
};

function getToDay() {
	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, '0'); // thêm số 0 phía trước nếu cần
	const dd = String(today.getDate()).padStart(2, '0');
	const formattedDate = `${yyyy}-${mm}-${dd}`;
	return formattedDate;
}

function countDaysBetween(date1, date2) {
	const d1 = new Date(date1);
	const d2 = new Date(date2);
	const diffInMs = Math.abs(d2 - d1);
	return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  }

  // đẩy qua web.js
module.exports = {
    getHomepage,
	getDashboard,
	getSignIn,
	postSignIn
};