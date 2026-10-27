import app from "./app.js";
import {
    connectDatabase
} from "./config/database.js";

const PORT = Number(process.env.PORT) || 3000;
async function startServer() {
    try {
        await connectDatabase();
        app.listen(PORT, () => {
            console.log(
                `Serveur démarré sur http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Impossible de démarrer l'application",
            error
        );
        process.exit(1);
    }
}
startServer();