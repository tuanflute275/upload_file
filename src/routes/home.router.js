import express from "express";
import homeController from '../controllers/home.controller';
import multer from 'multer';
import path from 'path';
var appRoot = require('app-root-path');
let router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + "/src/public/images/");
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter });
let upload1 = multer({ storage: storage, fileFilter: imageFilter }).array('multiple_images', 10);

// nvu cua midle ware
// ?xem mình có tải đúng file hay k và t lưu file ảnh

let initWebRouter = (app) => {
    router.get('/upload', homeController.getUploadFilePage)
    router.post('/upload-profile-pic', upload.single('profile_pic'), homeController.handleUploadFile)
    // upload middleware với name multiple_images tối đa 10 file --> có thể thay đổi dc tên và số lượng
    // router.post('/upload-profile-pic', upload.single('profile_pic'), homeController.handleUploadFile)
    router.post('/upload-multiple-images', (req, res, next)=>{
        upload1(req,res,(err)=>{
            if(err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE'){
                res.send('LIMIT_UNEXPECTED_FILE')
            }else if(err){
                res.send(err)
            }else{
                next()
            }
        })
    },homeController.handleUploadMultipleFile)

    return app.use('/', router)
}
export default initWebRouter