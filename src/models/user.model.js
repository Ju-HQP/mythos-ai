import mongoose from "mongoose";

// Schéma de l'utilisateur

const userSchema = new mongoose.Schema({
    // on utilise le nom d'utilisateur comme identifiant de connexion
    username: {
        type: String,
        required: true,
        unique:true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 20
    },
    passwordHash: {
        type: String,
        required: true,
        select: false
    }
});

const User = mongoose.model("User", userSchema);
export default User;