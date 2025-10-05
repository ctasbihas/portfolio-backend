import { Request, Response } from "express";
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
	const result = await UserServices.createUser(req.body);

	res.status(201).json({
		success: true,
		message: "User created successfully",
		data: result,
	});
};

const getUser = async (req: Request, res: Response) => {
	const result = await UserServices.getUser(req.params.id);
	res.status(200).json({
		success: true,
		message: "User retrieved successfully",
		data: result,
	});
};

const allUsers = async (req: Request, res: Response) => {
	const result = await UserServices.allUsers();

	res.status(200).json({
		success: true,
		message: "Users retrieved successfully",
		data: result,
	});
};

const updateUser = async (req: Request, res: Response) => {
	const result = await UserServices.updateUser(req.params.id, req.body);
	res.status(200).json({
		success: true,
		message: "User updated successfully",
		data: result,
	});
};

const deleteUser = async (req: Request, res: Response) => {
	const result = await UserServices.deleteUser(req.params.id);
	res.status(200).json({
		success: true,
		message: "User deleted successfully",
		data: result,
	});
};

export { allUsers, createUser, deleteUser, getUser, updateUser };
