const Category = require("../model/Category")
const { logEvents } = require("../middleware/logEvents")

const getAllCategories = async (req, res) => {
    const result = await Category.find({})
    if(!result) res.status(204).json({"message": "No categories found"}) //no content
    if(result.length === 0) res.status(204).json({"message": "No categories found"}) //no content
    else res.status(200).json(result);
}

const createNewCategory = async (req, res) => {
    //request body should contain the name of the new category
    if (!req?.body?.name) {
        return res.status(400).json({ 'message': 'Name of the new category is required.' }); //bad request
    }

    const name = req.body.name
    const result = await Category.create({ name })
    logEvents(`CATEGORY CREATION\t${req.email}\t${name}\t${result._id}`, 'categoriesLog.txt')
    res.status(201).json(result); //created
}

const updateCategory = async (req, res) => {
    //request body should contain the id and the new name of the category that should be updated
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'Category id is required.' }); //bad request
    }
    const id = req.body.id
    const category = await Category.findById(id).exec()
    if (!category) {
        return res.status(400).json({ "message": `Category with id = ${id} is not found` }); //bad request
    }
    if (req.body.name) category.name = req.body.name;
    const result = await category.save()
    logEvents(`CATEGORY UPDATE\t${req.email}\t${result.name}\t${id}`, 'categoriesLog.txt')
    res.status(200).json(result); //updated successfully
}

const deleteCategory = async (req, res) => {
    //request body should contain the id of the category that should be deleted
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'Category id is required.' }); //bad request
    }
    const id = req.body.id
    const category = await Category.findById(id)

    if (!category) {
        return res.status(400).json({ "message": `Category with ID ${req.body.id} not found` }); //bad request
    }

    const result = await Category.deleteOne({ _id: id })
    logEvents(`CATEGORY DELETE\t${req.email}\t${id}`, 'categoriesLog.txt')
    res.status(200).json(result);
}

const getCategory = async (req, res) => {
    const id = req.params.id
    const category = await Category.findById(id)

    if (!category) {
        return res.status(400).json({ "message": `Category ID with ${req.body.id} not found` });  //bad request
    }
    res.status(200).json(category);
}

module.exports = {
    getAllCategories,
    createNewCategory,
    updateCategory,
    deleteCategory,
    getCategory
}