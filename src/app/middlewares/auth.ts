import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";

// Extend Request interface to include user
declare global {
	namespace Express {
		interface Request {
			user: JwtPayload;
		}
	}
}

export interface JWTPayload {
	userId: string;
	email: string;
	role: string;
}

export const checkAuth = (requiredRole?: string) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const authHeader = req.headers.authorization;

			if (!authHeader || !authHeader.startsWith("Bearer ")) {
				return res.status(401).json({
					success: false,
					message: "Access denied. No token provided.",
				});
			}

			const token = authHeader.substring(7);

			if (!process.env.JWT_SECRET) {
				return res.status(500).json({
					success: false,
					message: "JWT secret not configured",
				});
			}

			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET
			) as JWTPayload;

			const user = await User.findById(decoded.userId);
			if (!user) {
				return res.status(401).json({
					success: false,
					message: "Invalid token. User not found.",
				});
			}

			req.user = {
				userId: user._id,
				email: user.email,
				role: user.role,
				name: user.name,
			};

			if (requiredRole) {
				if (req.user.role !== requiredRole) {
					const roleMessage =
						requiredRole === "owner"
							? "Access denied. Owner privileges required."
							: `Access denied. ${requiredRole} role required.`;

					return res.status(403).json({
						success: false,
						message: roleMessage,
					});
				}
			}

			next();
		} catch (error: any) {
			if (error.name === "JsonWebTokenError") {
				return res.status(401).json({
					success: false,
					message: "Invalid token.",
				});
			}
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({
					success: false,
					message: "Token expired.",
				});
			}
			return res.status(500).json({
				success: false,
				message: "Token verification failed.",
			});
		}
	};
};
