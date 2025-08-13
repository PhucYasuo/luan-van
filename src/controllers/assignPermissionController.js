const e = require('cors');
const connection = require('../config/database');

const getAssignPermission = async (req, res) => {
    const tobomons = await getTobomons(req, res);
    const allPermissions = await getPermissions(req, res);
    const allRolesInfo = await getAllRolesInfo(req, res);
    const allPermissionsInfo = await getAllPermissionsInfo(req, res);

    return res.render('assign-permission.ejs', {
        user: req.session.user,
        tobomons: tobomons,
        allPermissions: allPermissions,
        allRolesInfo: allRolesInfo,
        allPermissionsInfo: allPermissionsInfo
    });
}

const getAllRolesInfo = async (req, res) => {
    const [result] = await connection.promise().query(`
        SELECT VT_Ma, VT_Ten
        FROM vaitro
    `);
    return result;
}

const getAllPermissionsInfo = async (req, res) => {
    const [result] = await connection.promise().query(`
        SELECT Q_Ma, Q_Ten
        FROM quyen
    `);
    return result;
}

const getTobomons = async (req, res) => {
    const [result] = await connection.promise().query(`
        SELECT * FROM tobomon
    `);
    return result;
}

const getGiaoviens = async (req, res) => {
    const { tbmMa } = req.query;
    const [result] = await connection.promise().query(`
        SELECT *
        FROM giaovien
        WHERE TBM_Ma = ?
    `, [tbmMa]);
    return res.json(result);
}

const getPermissions = async (req, res) => {
    const [result] = await connection.promise().query(`
        SELECT * FROM sohuuquyen
    `);
    const quyenTheoVaiTro = getPermissionByRole(result);
    return quyenTheoVaiTro;
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

const getPermissionByID = async (req, res) => {
    const { gvMa } = req.query;
    const tkMa = "TK" + gvMa.slice(2);
    const [results] = await connection.promise().query(
		`SELECT cvt.TK_Ma, shq.*
		FROM covaitro cvt, sohuuquyen shq
		WHERE cvt.VT_Ma = shq.VT_Ma
		AND cvt.TK_Ma = ?`,
		[tkMa]
	);

    if (results.length > 0) {
		const quyenTheoVaiTro = getPermissionByRole(results);
		return res.json(quyenTheoVaiTro);
	} else {
		throw new Error('Không tìm thấy quyền truy cập cho tài khoản này');
	}
    
}

module.exports = {
    getAssignPermission,
    getGiaoviens,
    getPermissionByID
};