const Blog = require("../model/Blog")

const getAllBlogs = async (req, res) => {
    const result = await Blog.find({})
    if(!result) res.status(204).json({"message": "No blogs found"})
    if(result.length === 0) res.status(204).json({"message": "No blogs found"})

    console.log(result);
    res.json(result);
}

const createNewBlog = async (req, res) => {
    

    if (!req?.body?.title || !req?.body?.content) {
        return res.status(400).json({ 'message': 'Title and content are required.' });
    }

    const title = req.body.title
    const content = req.body.content

    const result = await Blog.create({ title, content })
    
    res.status(201).json(result);
}

const updateBlog = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'Blog id is required.' });
    }
    const id = req.body.id
    const blog = await Blog.findById(id).exec()
    if (!blog) {
        return res.status(400).json({ "message": `Blog with ID ${id} not found` });
    }
    if (req.body.title) blog.title = req.body.title;
    if (req.body.content) blog.content = req.body.content;

    const result = await blog.save()
    res.json(result);
}

const deleteBlog = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'Blog id is required.' });
    }
    const id = req.body.id
    const blog = await Blog.findById(id)

    if (!blog) {
        return res.status(400).json({ "message": `Blog with ID ${req.body.id} not found` });
    }

    const result = await Blog.deleteOne({ _id: id })
    res.json(result);
}

const getBlog = async (req, res) => {
    const id = req.body.id
    const blog = await Blog.findById(id)

    if (!blog) {
        return res.status(400).json({ "message": `Blog ID with ${req.body.id} not found` });
    }
    res.json(blog);
}

module.exports = {
    getAllBlogs,
    createNewBlog,
    updateBlog,
    deleteBlog,
    getBlog
}