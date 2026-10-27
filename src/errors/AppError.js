// Centralise les erreur, erreur Serveur 500 si pas de code de statut défini
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}