// src/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục nếu chưa có
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const maGV = req.session?.user?.maGV || 'unknown';
        const timestamp = new Date();
        const sanitized = file.originalname
            .normalize("NFD").replace(/[\u0300-\u036f]/g, '')  // bỏ dấu tiếng Việt
            .replace(/\s+/g, '_')
            .replace(/[^\w.-]/g, '');

        const uniqueName = timestamp.getDate() + '-' + (timestamp.getMonth()+1) + '-' + timestamp.getFullYear() + '-' + maGV + '-' + sanitized;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

module.exports = upload;
