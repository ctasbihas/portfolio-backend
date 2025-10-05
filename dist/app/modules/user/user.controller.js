"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUser = exports.deleteUser = exports.createUser = exports.allUsers = void 0;
const user_service_1 = require("./user.service");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.createUser(req.body);
    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: result,
    });
});
exports.createUser = createUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getUser(req.params.id);
    res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: result,
    });
});
exports.getUser = getUser;
const allUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.allUsers();
    res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result,
    });
});
exports.allUsers = allUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.updateUser(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result,
    });
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.deleteUser(req.params.id);
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: result,
    });
});
exports.deleteUser = deleteUser;
