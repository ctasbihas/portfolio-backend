"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUser = exports.deleteUser = exports.createUser = exports.allUsers = void 0;
const user_service_1 = require("./user.service");
const createUser = (req, res) => {
    const result = user_service_1.UserServices.createUser(req.body);
    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: result,
    });
};
exports.createUser = createUser;
const getUser = (req, res) => {
    const result = user_service_1.UserServices.getUser(req.params.id);
    res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: result,
    });
};
exports.getUser = getUser;
const allUsers = (req, res) => {
    const result = user_service_1.UserServices.allUsers();
    res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result,
    });
};
exports.allUsers = allUsers;
const updateUser = (req, res) => {
    const result = user_service_1.UserServices.updateUser(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result,
    });
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => {
    const result = user_service_1.UserServices.deleteUser(req.params.id);
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: result,
    });
};
exports.deleteUser = deleteUser;
