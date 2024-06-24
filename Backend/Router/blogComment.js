const express = require("express");
const { getAllBlogComments, createBlogComment, getOneBlogComment, updateBlogComment, deleteBlogComment } = require("../Controller/blogComment");
const auth = require('../helper/jwt');

const router = express.Router();


router.route('/blogcomment')
    .get(getAllBlogComments)
    .post(auth.verifyToken, createBlogComment)

router.route('/blogcomment/:id')
    .get(getOneBlogComment)
    .put(auth.verifyToken, updateBlogComment)
    .delete(auth.verifyToken, deleteBlogComment)


const blogrouter = router;
module.exports = blogrouter;