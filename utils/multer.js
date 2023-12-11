const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file);
        cb(null, "./public/images/uploads");
    },
    filename: function (req, file, cb) {
        let modifiedName =
            file.fieldname + "-" + uuidv4() + path.extname(file.originalname);
        cb(null, modifiedName);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        let filetypes = /jpeg|jpg|png|gif|svg|avif|webp/;
        let mimetype = filetypes.test(file.mimetype); //image/jpg
        let extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(
            "Error: File upload only supports the following filetypes - " +
                filetypes
        );
    },
});

module.exports = upload;
