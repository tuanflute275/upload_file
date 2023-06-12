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


// ==================   uploadMultipleFile
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