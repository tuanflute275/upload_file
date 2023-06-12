<!-- multer upload file -->

step 1: npm i --save-exact multer@1.4.3
step 2: npm i --save-exact app-root-path@3.0.0

<!-- ===== document ====== -->

link 1:===> https://stackabuse.com/handling-file-uploads-in-node-js-with-expres-and-multer/
link 2:====> http://expressjs.com/en/resources/middleware/multer.html
===> trong bài này dùng code link 1

<!-- =========================================================== -->

**HTML**

    <div class="upload-file-container">
            <form method="POST" action="/upload-profile-pic" enctype="multipart/form-data">
                <div>
                    <label>Avatar:</label>
                    <input type="file" name="profile_pic" />
                </div>

            <div>
                <button class="btn-save" type="submit">Save files</button>
            </div>
        </form>
        <div>=====================================================================</div>
        <form method="POST" action="/upload-multiple-images" enctype="multipart/form-data">
            <div>
                <label>Select multiple images:</label>
                <input type="file" name="multiple_images" multiple />
            </div>
            <div>
                <input type="submit" name="btn_upload_multiple_images" value="Upload" />
            </div>
        </form>
    </div>

**FILE MIDDLEWARE**
import multer from 'multer';
import path from 'path';
var appRoot = require('app-root-path');

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
let upload1 = multer({ storage: storage, fileFilter: imageFilter }).array('multiple_images', 5);

**FILE CONTROLLER**
let getUploadFilePage = async (req, res) => {
return res.render('home.ejs')
}

let handleUploadFile = async (req, res) => {
if (req.fileValidationError) {
return res.send(req.fileValidationError);
}
else if (!req.file) {
return res.send('Please select an image to upload');
}

        // Display uploaded image for user validation
        res.send(`You have uploaded this image: <hr/><img src="/images/${req.file.filename}" width="500"><hr /><a href="/upload">Upload another image</a>`);

}

// ================== uploadMultipleFile
let handleUploadMultipleFile = async (req, res)=>{

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.files) {
            return res.send('Please select an image to upload');
        }

        let result = "You have uploaded these images: <hr />";
        const files = req.files;
        let index, len;

        // Loop through all the uploaded images and display them on frontend
        for (index = 0, len = files.length; index < len; ++index) {
            result += `<img src="/images/${files[index].filename}" width="300" style="margin-right: 20px;">`;
        }
        result += '<hr/><a href="/upload">Upload more images</a>';
        res.send(result);

}

module.exports={
getUploadFilePage,
handleUploadFile,
handleUploadMultipleFile
}

**FILE ROUTER**
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
