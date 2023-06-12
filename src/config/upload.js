const multer = require("multer");
// ngăn gọn k check kiểu của ảnh -->ví dụ thôi->k dùng trong bài này
const diskStorage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, "./uploads")
    },
    filename : (req,file,callback)=>{
        callback(null,file.originalname)
    }
});

const uploadFile = multer({
    storage : diskStorage
});

module.exports = uploadFile;