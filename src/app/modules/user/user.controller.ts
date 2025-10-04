import { Request, Response } from "express";
import { UserServices } from "./user.service";

const createUser = (req: Request, res: Response) => {
	const result = UserServices.createUser(req.body);

	res.status(201).json({
		success: true,
		message: "User created successfully",
		data: result,
	});
};

const getUser = (req: Request, res: Response) => {
	const result = UserServices.getUser(req.params.id);
	res.status(200).json({
		success: true,
		message: "User retrieved successfully",
		data: result,
	});
};

const allUsers = (req: Request, res: Response) => {
	const result = UserServices.allUsers();
	res.status(200).json({
		success: true,
		message: "Users retrieved successfully",
		data: result,
	});
};

const updateUser = (req: Request, res: Response) => {
	const result = UserServices.updateUser(req.params.id, req.body);
	res.status(200).json({
		success: true,
		message: "User updated successfully",
		data: result,
	});
};

const deleteUser = (req: Request, res: Response) => {
	const result = UserServices.deleteUser(req.params.id);
	res.status(200).json({
		success: true,
		message: "User deleted successfully",
		data: result,
	});
};

export { allUsers, createUser, deleteUser, getUser, updateUser };
