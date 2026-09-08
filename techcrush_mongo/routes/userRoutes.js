const express = require("express");
const { createUser, deleteUser, getAllUsers, getSingleUser, updateUser } = require("../controller/userController");

const userRoute = express.Router();

userRoute.post("/new-user", createUser);
userRoute.get("/all-users", getAllUsers);
userRoute.get("/get-one-user/:user_id", getSingleUser);
userRoute.delete("delete-user/:user_id", deleteUser);
userRoute.patch("/update-user/:user_id", updateUser);

module.exports = userRoute