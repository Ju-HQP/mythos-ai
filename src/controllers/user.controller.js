import User from "../models/user.model.js";

import { login, register } from "../services/userAuth/auth.js";

export async function createUser(request, response) {
    const {
        username,
        password
    } = request.body ?? {};
    // créaton du compte dans auth.js
    const user = await register(username, password);
    return response.status(201).json(user);
}

export async function loginUser(request, response) {
    const {
        username,
        password
    } = request.body ?? {};
    const result = await login(username, password);
    return response.status(200).json(result);
}
export async function getUsers(request, response) {
    const users = await User.find();
    return response.status(200).json(users);
}
