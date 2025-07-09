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
			console.log("Tài khoản đăng nhập:", accounts.TK_Ma);
			const permissions = await getPermission(accounts.TK_Ma);
			req.session.user.permissions = getPermissionByRole(permissions);
			console.log("Danh sách quyền:", req.session.user.permissions);
			

			const today = getToDay(req); // yyyy-mm-dd
			const [schoolYears] = await getSchoolYear(today);

			req.session.user.namHoc = schoolYears.NH_NamHoc;
			
			const semesters = await getSemester(today, schoolYears.NH_NgayDauNam);
			if (semesters) {
				req.session.user.hocKy = semesters.HK_HocKy;	
			}else {
				req.session.user.hocKy = "H";
			}

			req.session.user.maGV = accounts.GV_Ma;

            const [positions] = await getPostion(req.session.user.maGV, req.session.user.hocKy, req.session.user.namHoc);
            if (positions) {
				req.session.user.maCV = positions.CV_Ma;
				req.session.user.tenCV = positions.CV_Ten;
            } else {
                req.session.user.maCV = "";
				req.session.user.tenCV = "Giáo viên";
            }
			
			const [teachers] = await getTeacher(req.session.user.maGV);
			req.session.user.maBM = teachers.TBM_Ma;
			req.session.user.tenGV = teachers.GV_HoTen;

			const [deapartments] = await getDepartment(req.session.user.maBM);
			req.session.user.tenBM = deapartments.TBM_Ten;
            
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

const getPermission = async (maTK) => {
	const [results] = await connection.promise().query(
		'SELECT VT_Ma, Q_Ma FROM sohuuquyen WHERE TK_Ma = ?',
		[maTK]
	);
	
	return results;
};

const getSchoolYear = async (today) => {
	const [results] = await connection.promise().query(
		'SELECT * FROM namhoc WHERE NH_NgayDauNam < ? ORDER BY NH_NgayDauNam DESC LIMIT 1',
		[today]
	);
	return results;
};

const getSemester = async (today, ngayDauNam) => {
	const [results] = await connection.promise().query('select * from hocky');
	const soNgay = countDaysBetween(ngayDauNam, today);
	if (soNgay < results[0].HK_SoTuan*7)
		return results[0];
	else if (soNgay < (results[0].HK_SoTuan*7 + results[1].HK_SoTuan*7))
		return results[1];
	return null;
};

const getPostion = async (maGV, hocKy, namHoc) => {
	const [results] = await connection.promise().query(
		'SELECT CV_Ma FROM giuchucvu WHERE GV_Ma = ? AND HK_HocKy = ? AND NH_NamHoc = ?',
		[maGV, hocKy, namHoc]
	);
	if( results.length > 0) {
		const [chucVuResults] = await connection.promise().query(
			'SELECT * FROM chucvu WHERE CV_Ma = ?',
			[results[0].CV_Ma]
		);
		return chucVuResults;
	}
	return null;
};

const getTeacher = async (maGV) => {
	const [results] = await connection.promise().query(
		'SELECT * FROM giaovien WHERE GV_Ma = ?',
		[maGV]
	);
	return results;
};

const getDepartment = async (maBM) => {
	const [results] = await connection.promise().query(
		'SELECT * FROM tobomon WHERE TBM_Ma = ?',
		[maBM]
	);
	return results;
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
	const today = req.today;
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
	console.log("Kỳ học:", results);
    return res.json(results);
}

const getNamHocs = async (req, res) => {
    const [results] = await connection.promise().query(`
        SELECT NH_NamHoc
        FROM namhoc`
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