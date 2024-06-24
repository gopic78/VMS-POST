const { default: mongoose } = require('mongoose');
const BlogComments = require('../Model/blogComments');

const createBlogComment = async (req, res) => {
    try {
        const newblogcomment = new BlogComments({
            comment: req.body.comment,
            blog_id: req.body.blog_id,
            user_id: req.body.user_id,
        })
        await newblogcomment.save();
        res.status(201).json({ message: "Blogcomment created successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAllBlogComments = async (req, res) => {
    try {
        const getBlog = await BlogComments.aggregate([
            {
                $lookup: {
                    from: "blogs", 
                    localField: "blog_id", 
                    foreignField: "_id", 
                    as: "blogDetails" 
                }
            },
            {
                $unwind: "$blogDetails" 
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "user_id", 
                    foreignField: "_id", 
                    as: "userDetails" 
                }
            },
            {
                $unwind : "$userDetails"
            },
            {
                $project : {
                    _id : 1,
                    comment : 1,
                    blog_id : 1,
                    created_date : 1,
                    "blogDetails.image" : 1,
                    "blogDetails.title" : 1,
                    "blogDetails.description" : 1,
                    "userDetails.username" : 1

                }
            }
            
        ]);

        console.log("get blog", getBlog)
        if (!getBlog) {
            res.status(404).json({ message: "No blogcomments found" })
        }
        res.status(200).json(getBlog)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }

}

const getOneBlogComment = async (req, res) => {
    try {
        const id = req.params.id
        const getBlogComment = await BlogComments.aggregate([
            {
                $match : {
                    blog_id :new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: "blogs", 
                    localField: "blog_id", 
                    foreignField: "_id", 
                    as: "blogDetails" 
                }
            },
            {
                $unwind: "$blogDetails" 
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "user_id", 
                    foreignField: "_id", 
                    as: "userDetails" 
                }
            },
            {
                $unwind : "$userDetails"
            },
            {
                $project : {
                    _id : 1,
                    comment : 1,
                    blog_id : 1,
                    created_date : 1,
                    "blogDetails.image" : 1,
                    "blogDetails.title" : 1,
                    "blogDetails.description" : 1,
                    "userDetails.username" : 1

                }
            }
            
        ]);
        if (!getBlogComment) {
            return res.status(404).json({ message: "No Blogcomment found" })
        }
        res.status(200).json(getBlogComment)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const updateBlogComment = async (req, res) => {
    try {
        const id = req.params.id;
        const getBlogcomment = await BlogComments.findById(id);
        if (!getBlogcomment) {
            return res.status(404).json({ message: "No Blogcomment found" });
        }
        if (req.body.comment) {
            getBlogcomment.comment = req.body.comment;
        }
        if (req.body.blog_id) {
            getBlogcomment.blog_id = req.body.blog_id;
        }
        if (req.body.user_id) {
            getBlogcomment.user_id = req.body.user_id;
        }

        const updatedBlogComment = await getBlogcomment.save();
        res.status(200).json(updatedBlogComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteBlogComment = async (req, res) => {
    try {
        const id = req.params.id
        const getBlogComment = await BlogComments.findByIdAndDelete(id);
        if (!getBlogComment) {
            return res.status(404).json({ message: "No Blogcomment found" })
        }
        res.status(200).json({ message: "Blog deleted succcessfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = {
    createBlogComment,
    getAllBlogComments,
    getOneBlogComment,
    updateBlogComment,
    deleteBlogComment
}