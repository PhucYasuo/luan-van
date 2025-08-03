const e = require('cors');
const connection = require('../config/database');

const getHomepage = (req, res) => {
	if (req.session.user) {
		res.redirect('/dashboard');
	} else {
		res.redirect('/sign-in');
	} 
};

const getDashboard = async (req, res) => {
	try {
		return res.render('dashboard.ejs', {
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
        const [accounts] = await getAccount(account, password);
        if (accounts) {
			req.session.user = {};

			await assignPermission(req, res, accounts.TK_Ma);
			console.log("Danh sách quyền:", req.session.user.permissions);
			
			const today = getToDay(req); // yyyy-mm-dd
			await assignSchoolYear(req, res, today);
			await assignSemester(req, res, today, req.session.user.ngayDauNam);
			req.session.user.maGV = accounts.GV_Ma;
			await assignTeacherInfo(req, res, req.session.user.maGV);
			await assignDepartmentName(req, res, req.session.user.maBM);
			await assignPostion(req, res, req.session.user.maGV, req.session.user.hocKy, req.session.user.namHoc);
			
			if(req.session.user.gioiTinh == 0) {
				req.session.user.gioiTinhShow = "Nam";
			}
			else if(req.session.user.gioiTinh == 1) {
				req.session.user.gioiTinhShow = "Nữ";
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

const getAccount = async (account, password) => {
    const [results] = await connection.promise().query(
        'SELECT * FROM taikhoan WHERE TK_Ten = ? AND TK_MatKhau = ?',
        [account, password]
    );
    return results;
};

const assignPermission = async (req, res, maTK) => {
	const [results] = await connection.promise().query(
		'SELECT VT_Ma, Q_Ma FROM sohuuquyen WHERE TK_Ma = ?',
		[maTK]
	);
	if (results.length > 0) {
		const quyenTheoVaiTro = getPermissionByRole(results);
		req.session.user.permissions = quyenTheoVaiTro;
	} else {
		throw new Error('Không tìm thấy quyền truy cập cho tài khoản này');
	}
};

const assignSchoolYear = async (req, res, today) => {
	const [results] = await connection.promise().query(
		'SELECT * FROM namhoc WHERE NH_NgayDauNam < ? ORDER BY NH_NgayDauNam DESC LIMIT 1',
		[today]
	);
	if (results.length > 0) {
		req.session.user.namHoc = results[0].NH_NamHoc;
		req.session.user.ngayDauNam = results[0].NH_NgayDauNam;
	} else {
		throw new Error('Không tìm thấy năm học phù hợp');
	}
};

const assignSemester = async (req, res, today, ngayDauNam) => {
	const [results] = await connection.promise().query('select * from hocky');
	const soNgay = countDaysBetween(ngayDauNam, today);
	if (soNgay < results[0].HK_SoTuan*7)
		req.session.user.hocKy = results[0].HK_HocKy;
	else if (soNgay < (results[0].HK_SoTuan*7 + results[1].HK_SoTuan*7))
		req.session.user.hocKy = results[1].HK_HocKy;
	else
		req.session.user.hocKy = "H"; // Học kỳ hè
};

const assignPostion = async (req, res, maGV, hocKy, namHoc) => {
	const [results] = await connection.promise().query(
		'SELECT CV_Ma FROM giuchucvu WHERE GV_Ma = ? AND HK_HocKy = ? AND NH_NamHoc = ?',
		[maGV, hocKy, namHoc]
	);
	if( results.length > 0) {
		const [chucVuResults] = await connection.promise().query(
			'SELECT * FROM chucvu WHERE CV_Ma = ?',
			[results[0].CV_Ma]
		);
		if (chucVuResults.length > 0) {
			req.session.user.maCV = chucVuResults[0].CV_Ma;
			req.session.user.tenCV = chucVuResults[0].CV_Ten;
		}else {
			throw new Error('Không tìm thấy thông tin chức vụ cho giáo viên này');
		}
	}
	else {
		req.session.user.maCV = "";
		req.session.user.tenCV = "Giáo viên";
	}
};

const assignTeacherInfo = async (req, res, maGV) => {
	const [results] = await connection.promise().query(
		'SELECT * FROM giaovien WHERE GV_Ma = ?',
		[maGV]
	);
	if (results.length > 0) {
		req.session.user.maGV = results[0].GV_Ma;
		req.session.user.tenGV = results[0].GV_HoTen;
		req.session.user.ngaySinh = results[0].GV_NgaySinh;
		req.session.user.gioiTinh = results[0].GV_GioiTinh;
		req.session.user.email = results[0].GV_Mail;
		req.session.user.sdt = results[0].GV_SoDT;
		req.session.user.diaChi = results[0].GV_DiaChi;
		req.session.user.maBM = results[0].TBM_Ma;
	} else {
		throw new Error('Không tìm thấy thông tin giáo viên');
	}
};

const assignDepartmentName = async (req, res, maBM) => {
	const [results] = await connection.promise().query(
		'SELECT * FROM tobomon WHERE TBM_Ma = ?',
		[maBM]
	);
	if (results.length > 0) {
		req.session.user.tenBM = results[0].TBM_Ten;
	} else {
		throw new Error('Không tìm thấy tên bộ môn');
	}
}

function getPermissionByRole(permissions) {
	const quyenTheoVaiTro = {};

	for (const { VT_Ma, Q_Ma } of permissions) {
		if (!quyenTheoVaiTro[VT_Ma]) {
			quyenTheoVaiTro[VT_Ma] = [];
		}
		quyenTheoVaiTro[VT_Ma].push(Q_Ma);
	}

	return quyenTheoVaiTro;
}

const getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Lỗi khi hủy session:', err);
            return res.send('Đã xảy ra lỗi khi đăng xuất.');
        }

        res.redirect('/');
    });
};

function getToDay(req) {
	const today = new Date(req.today);
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

const getHocKys = async (req, res) => {
    const [results] = await connection.promise().query(`
        SELECT HK_HocKy
        FROM hocky`
    );
    return res.json(results);
}

const getNamHocs = async (req, res) => {
    const [results] = await connection.promise().query(`
        SELECT NH_NamHoc
        FROM namhoc
		WHERE NH_NgayDauNam < ?`,
		[req.today]
    );
    return res.json(results);
}

  // đẩy qua web.js
module.exports = {
    getHomepage,
	getDashboard,
	getSignIn,
	postSignIn,
	getLogout,
	getHocKys,
	getNamHocs
};