// Gestion globale des erreurs HTTP et des erreurs MongoDB connues.
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err ?.code === 11000) {
    console.log(err);
    return res.status(409).json({
      error: "Cette valeur existe déjà"
    });
  }
  if (err ?.name === "CastError" || err ?.name === "ValidationError") {
    return res.status(400).json({
      error: "Données invalides"
    });
  }
  const status = err.statusCode || 500;
  const message = status === 500 ? "Erreur interne du serveur" : err.message;
  if (status === 500) console.error(err);
  return res.status(status).json({
    error: message
  });
}