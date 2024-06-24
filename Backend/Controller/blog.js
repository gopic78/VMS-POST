const Blogs = require('../Model/blog');

const createBlog = async (req, res) => {
    try {
        const newblog = new Blogs({
            image: req.file ? req.file.filename : '',
            title: req.body.title,
            category: req.body.category,
            description: req.body.description,
            user_id: req.body.user_id,
            created_date: new Date()
        })
        await newblog.save();
        res.status(201).json({ message: "Blog created successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAllBlogs = async (req, res) => {
    try {
        const getBlog = await Blogs.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind : "$userDetails"
            }
            , {
                $project: {
                    _id: 1,
                    image: 1,
                    title: 1,
                    category: 1,
                    description: 1,
                    created_date: 1,
                    "userDetails.username": 1

                }
            }
        ]);
        if (!getBlog) {
            res.status(404).json({ message: "No blogs found" })
        }
        res.status(200).json(getBlog)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }

}

const getOneBlog = async (req, res) => {
    try {
        const id = req.params.id
        const getBlog = await Blogs.find({user_id: id});
        if (!getBlog) {
            return res.status(404).json({ message: "No blogs found" })
        }
        res.status(200).json(getBlog)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const updateBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const getBlog = await Blogs.findById(id);
        if (!getBlog) {
            return res.status(404).json({ message: "No blog found" });
        }

        if (req.file) {
            getBlog.image = req.file.filename;
        }
        if (req.body.title) {
            getBlog.title = req.body.title;
        }
        if (req.body.category) {
            getBlog.category = req.body.category;
        }
        if (req.body.description) {
            getBlog.description = req.body.description;
        }
        if (req.body.user_id) {
            getBlog.user_id = req.body.user_id;
        }

        const updatedBlog = await getBlog.save();
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteBlog = async (req, res) => {
    try {
        const id = req.params.id
        const getBlog = await Blogs.findByIdAndDelete(id);
        if (!getBlog) {
            return res.status(404).json({ message: "No blogs found" })
        }
        res.status(200).json({ message: "Blog deleted succcessfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = {
    createBlog,
    getAllBlogs,
    getOneBlog,
    updateBlog,
    deleteBlog
}