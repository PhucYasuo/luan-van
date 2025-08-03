const connection = require('../config/database');

const getLeaveReport = async (req, res) => {
    res.render('leave-report.ejs', {
        user: req.session.user
    });
}

const getLeaveCheckRange = async (req, res) => {
    const { fromDate, toDate } = req.query;
    const fFromDate = getFormattedDay(new Date(fromDate));
    const fToDate = getFormattedDay(new Date(toDate));
    const [results] = await connection.promise().query(`
        SELECT TKB_Ngay
        FROM thoikhoabieu
        WHERE GV_Ma = ?
        AND TKB_Ngay BETWEEN ? AND ?
        ORDER BY TKB_Ngay`,
        [req.session.user.maGV,fFromDate, fToDate]
    );
    return res.json({ dates: results });
}

function getFormattedDay(date) {
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const dd = String(date.getDate()).padStart(2, '0');
	const formattedDate = `${yyyy}-${mm}-${dd}`;
	return formattedDate;
}

module.exports = {
    getLeaveReport,
    getLeaveCheckRange
};