import { Schema, model } from "mongoose";

export interface IUser {
	name: string;
	email: string;
	password: string;
	role: "regular" | "owner";
}

const userSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		role: {
			type: String,
			enum: ["regular", "owner"],
			default: "regular",
		},
	},
	{
		timestamps: true,
	}
);

// Remove password from JSON output
userSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password;
	return user;
};

export const User = model<IUser>("User", userSchema);
