import express from "express";
import { Product } from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
const productsRouter = express();
productsRouter.get("/", (req, res) => {
  if (req.query.name) {
    // Vérifie si un paramètre name est présent dans les paramètres de la requête (par exemple, /products?name=example).
    if (req.query.name.length < 2) {
      // Vérifie si la longueur du terme de recherche (req.query.name) est inférieure à 2 caractères.
      // Cela garantit que la recherche ne soit pas effectuée avec des chaînes trop courtes, évitant des résultats inutiles ou un traitement inutile.
      const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
      return res.status(400).json({ message });
    }
    let limit = 3;
    if (req.query.limit) {
      // Si un paramètre limit est fourni dans la requête (par exemple, /products?limit=5), cette condition sera vraie.
      limit = parseInt(req.query.limit); //  Convertit la valeur de req.query.limit (string) en un entier.
      // La nouvelle valeur de limit remplace la valeur par défaut.
    }
    return Product.findAndCountAll({
      //Utilise la méthode findAll de Sequelize pour rechercher tous les produits correspondant au critère de recherche.
      // where : Spécifie une clause WHERE pour filtrer les résultats.
      where: { name: { [Op.like]: `%${req.query.name}%` } }, // Représente une recherche qui correspond à n'importe quelle chaîne contenant le texte fourni (req.query.name)
      // Utilise l'opérateur Op.like de Sequelize pour effectuer une recherche partielle dans la colonne name.
      order: ["name"],
      limit: limit,
    }).then((products) => {
      //Si la recherche réussit, la liste des produits correspondants est disponible dans products.
      const message = `Il y a ${products.length} produits qui correspondent au terme de la recherche`;
      res.json(success(message, products)); //Retourne une réponse HTTP au format JSON contenant :
    });
  }
  Product.findAll() //Si aucun paramètre name n'est fourni, récupère tous les produits sans appliquer de filtre.
    .then((products) => {
      //Indique que la liste complète des produits a été récupérée.
      const message = "La liste des produits a bien été récupérée.";
      res.json(success(message, products));
    })
    .catch((error) => {
      // En cas d'erreur pendant la récupération des produits (problème de connexion ou autre), exécute ce bloc.
      const message =
        "La liste des produits n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});
productsRouter.get("/:id", (req, res) => {
  Product.findByPk(req.params.id)
    .then((product) => {
      if (product === null) {
        const message =
          "Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        // A noter ici le return pour interrompre l'exécution du code
        return res.status(404).json({ message });
      }
      const message = `Le produit dont l'id vaut ${product.id} a bien été récupéré.`;
      res.json(success(message, product));
    })
    .catch((error) => {
      const message =
        "Le produit n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});
productsRouter.post("/", (req, res) => {
  // Déclare une route POST à l'URL racine (/) du routeur productsRouter.
  // Utilisée pour ajouter un produit dans la base de données.

  Product.create(req.body) // Utilise la méthode create de Sequelize pour insérer un nouveau produit dans la base de données. Les données du produit sont extraites de req.body (un JSON envoyé par le client).
    .then((createdProduct) => {
      // Si la création réussit, le produit créé est passé à la fonction dans le bloc then
      // Définir un message pour le consommateur de l'API REST
      const message = `Le produit ${createdProduct.name} a bien été créé !`;
      // Retourner la réponse HTTP en json avec le msg et le produit créé
      res.json(success(message, createdProduct)); // Retourne une réponse HTTP au format JSON.
    })
    .catch((error) => {
      // Si une erreur se produit lors de l'exécution de Product.create, le bloc catch est exécuté.
      if (error instanceof ValidationError) {
        // Vérifie si l'erreur est de type ValidationError (propre à Sequelize).
        // Cela arrive lorsque les données envoyées par le client ne respectent pas les contraintes définies dans le modèle.
        return res.status(400).json({ message: error.message, data: error }); // Envoie une réponse avec le code HTTP 400 (mauvaise requête).
        // Retourne un objet JSON contenant :message : Description de l'erreur.data : Détails techniques de l'erreur.
      }
      const message =
        "Le produit n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error }); // Si l'erreur n'est pas une ValidationError, un message générique est retourné.
      // res.status(500) : Code HTTP 500 indique une erreur interne au serveur.
      // Le message et les détails de l'erreur sont inclus dans la réponse JSON.
    });
});
productsRouter.delete("/:id", (req, res) => {
  Product.findByPk(req.params.id).then((deletedProduct) => {
    Product.destroy({
      where: { id: deletedProduct.id },
    }).then((_) => {
      // Définir un message pour le consommateur de l'API REST
      const message = `Le produit ${deletedProduct.name} a bien été supprimé !`;
      // Retourner la réponse HTTP en json avec le msg et le produit créé
      res.json(success(message, deletedProduct));
    });
  });
});
productsRouter.put("/:id", (req, res) => {
  const productId = req.params.id;
  Product.update(req.body, { where: { id: productId } })
    .then((_) => {
      Product.findByPk(productId)
        .then((updatedProduct) => {
          if (updatedProduct === null) {
            const message =
              "Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
            // A noter ici le return pour interrompre l'exécution du code
            return res.status(404).json({ message });
          }
          // Définir un message pour l'utilisateur de l'API REST
          const message = `Le produit ${updatedProduct.name} dont l'id vaut ${updatedProduct.id} a été mis à jour avec succès`;
          // Retourner la réponse HTTP en json avec le msg et le produit créé
          res.json(success(message, updatedProduct));
        })
        .catch((error) => {
          const message =
            "Le produit n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
          res.status(500).json({ message, data: error });
        });
    })
    .catch((error) => {
      const message =
        "Le produit n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});
export { productsRouter };
