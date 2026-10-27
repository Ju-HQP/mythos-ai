import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import {
    AppError
} from "../../errors/AppError.js";

const SALT_ROUNDS = 10; // indice de cryptage

// vérification de données à la création du compte
function validateCredentials(username, password) {
        console.log(username);
    if (typeof username !== "string" || username.trim().length < 3 || username.trim().length > 20) {
        throw new AppError("Le nom d'utilisateur doit contenir entre 3 et 20 caractères", 400);
    }
    // 72 car => limite de bcrypt
    if (typeof password !== "string" || password.length < 8 || password.length > 72) {
        throw new AppError("Le mot de passe doit contenir entre 8 et 72 caractères", 400);
    }
}

export async function register(username, password) {
    validateCredentials(username, password);
    // si la fonction validateCredentials retourne une erreur, le reste ne s'exécute pas
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    // création dans la BDD
    const user = await User.create({
        username: username.trim().toLowerCase(),
        passwordHash
    });

    return {
        id: user.id,
        username: user.username
    };
}

export async function login(username, password) {
    if (typeof username !== "string" || typeof password !== "string") {
        throw new AppError("Identifiants invalides", 401);
    }

    const user = await User
        .findOne({
            username: username.trim().toLowerCase()
        }) // recherche le nom, puis si le mdp correspond
        .select("+passwordHash");

    // si utilisateur existant et mdp correct
    const isValid = user && await bcrypt.compare(password, user.passwordHash); // récup le mdp fourni et compare avec la BDD
    if (!isValid) {
        throw new AppError("Identifiants invalides", 401);
    }
    const tokenExpire = process.env.JWT_EXPIRES_IN || "1h";

    const token = jwt.sign({
        sub: user.id
    }, process.env.JWT_KEY, {
        // durée de connexion = 1h
        expiresIn: process.env.JWT_EXPIRES_IN || "1h"
    });

    return {
        message:`Vous êtes connecté pour ${tokenExpire}`,
        token
    };
}