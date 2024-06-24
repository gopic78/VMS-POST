const express = require("express");
const multer = require('multer');
const { createBlog, getAllBlogs, getOneBlog, deleteBlog, updateBlog } = require("../Controller/blog");
const auth = require('../helper/jwt');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
})

const upload = multer({
    storage : storage
})

router.route('/blog')
    .get(getAllBlogs)
    .post(auth.verifyToken,upload.single('image'),createBlog)

router.route('/blog/:id')
    .get(getOneBlog)
    .put(auth.verifyToken,upload.single('image'),updateBlog)
    .delete(auth.verifyToken,deleteBlog)


const blogrouter = router;
module.exports = blogrouter;