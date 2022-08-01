const Category = require("../model/Category")

const getAllCategories = async (req, res) => {
    const result = await Category.find({})
    if(!result) res.status(204).json({"message": "No categories found"}) //no content
    if(result.length === 0) res.status(204).json({"message": "No categories found"}) //no content

    console.log(result);
    res.status(200).json(result);
}

const createNewCategory = async (req, res) => {
    //request body should contain the name of the new category
    if (!req?.body?.name) {
        return res.status(400).json({ 'message': 'Name of the new category is required.' }); //bad request
    }

    const name = req.body.name
    const result = await Category.create({ name })
    
    res.status(201).json(result); //created
}

const updateCategory = async (req, res) => {
    //request body should contain the id and the new name of the category that should be updated
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'Category id is required.' }); //bad request
    }
    const id = req.body.id
    const blog = await Category.findById(id).exec()
    if (!blog) {
        return res.status(400).json({ "message": `Category with id = ${id} is not found` }); //bad request
    }
    if (req.body.name) blog.name = req.body.name;
    const result = await blog.save()
    res.status(200).json(result); //updated successfully
}

const deleteCategory = async (req, res) => {
    //request body should contain the id of the category that should be deleted
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'Category id is required.' }); //bad request
    }
    const id = req.body.id
    const blog = await Category.findById(id)

    if (!blog) {
        return res.status(400).json({ "message": `Category with ID ${req.body.id} not found` }); //bad request
    }

    const result = await Category.deleteOne({ _id: id })
    res.status(200).json(result);
}

const getCategory = async (req, res) => {
    //request body should contain the id of the category that should be fetched
    const id = req.body.id
    const blog = await Category.findById(id)

    if (!blog) {
        return res.status(400).json({ "message": `Category ID with ${req.body.id} not found` });  //bad request
    }
    res.status(200).json(blog);
}

module.exports = {
    getAllCategories,
    createNewCategory,
    updateCategory,
    deleteCategory,
    getCategory
}