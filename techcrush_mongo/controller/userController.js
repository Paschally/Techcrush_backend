const userModel = require('../model/userModel.js');

const createUser = async(req, res) =>{
    try{
        const {name, email, password } = req.body
        const user = await userModel.create({
            name, email, password
        })
        res.status(201).json({
            message: "User created successfully",
            data: user
        })
    } catch(error){
        res.status(500).json({message: error.message})
    }
}

const getAllUsers = async (req, res) => {
    try{
        const getAll = await userModel.find()
        return res.status(200).json({
            message : "All users fetched successfully",
            data: getAll
        })

    } catch (error){
        return res.status(500).json({
            message : error.message
        })
    }
};

const getSingleUser = async (req, res) => {
    try{
        const { user_id } = req.params
        const getSingle = await userModel.findById(user_id)
        if(!getSingle){
            return res.status(404).json({
                message : "User not found"
            })
        }
        return res.status(200).json({
            message : "User fetched successfully",
            data: getSingle
        })

    } catch (error){
        return res.status(500).json({
            message : error.message
        })
    }
}

// Update User

const updateUser = async (req, res) =>{
    try {
        const { user_id } = req.params
        const { name, email, password } = req.body
        const update = await userModel.findByIdAndUpdate(user_id, {
            name, email, password
        }, { new: true})
        return res.status(200).json({
            message: "User updated successfully",
            data: update
        })
    } catch (error){
        return res.status(500).json({
            message : error.message
        })
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const{ user_id } = req.params
        const deleteUser = await userModel.findByIdAndDelete(user_id)
        return res.status(200).json({
            message: "User deleted successfully",
            data: deleteUser
        })
    } catch(error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {createUser, getAllUsers, getSingleUser, updateUser, deleteUser}