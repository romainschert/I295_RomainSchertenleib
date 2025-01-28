import { DataTypes } from "sequelize"; //Importation de l'objet DataTypes depuis le package sequelize.
// DataTypes est utilisé pour définir les types de données des colonnes de la base de données, comme INTEGER, STRING, etc.
import { sequelize } from "../db/sequelize.mjs"; //Cela permet d'interagir avec la base de données configurée.

const ProductModel = (sequelize, DataTypes) => {
  //une fonction est définie pour créer et retourner un modèle Produc
  // sequelize : L'instance de connexion à la base de données.
  //DataTypes : L'objet permettant de définir les types des champs.
  return sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false, // La colonne ne peut accepter une valeur NULL (optionnelle).
        validate: {
          // Spécifie des règles de validation pour la valeur.
          is: {
            args: /^[A-Za-z\s]*$/, // Applique une expression régulière (RegEx) pour valider que la valeur contient uniquement des lettres (A-Z, a-z) et des espaces.
            msg: "Seules les lettres et les espaes sont autorisées.", // : Message d'erreur à afficher si la validation échoue.
          },
          notEmpty: {
            msg: "Le nom ne peut pas être vide.",
          },
          notNull: {
            msg: "Le nom est une propriété obligatoire.",
          },
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: {
            msg: "Utilisez uniquement des nombres pour le prix.",
          },
          notEmpty: {
            msg: "Le prix ne peut pas être vide.",
          },
          notNull: {
            msg: "Le prix est une propriété obligatoire.",
          },
          min: {
            args: [1.0],
            msg: "Le prix doit être supérieur à 1$.",
          },
          max: {
            args: [1000.0],
            msg: "Le prix doit être inférieur à 1000$.",
          },
        },
      },
    },
    {
      timestamps: true, //Active automatiquement les colonnes de suivi des dates :
      // createdAt : Date de création.
      // updatedAt : Date de la dernière mise à jour.
      createdAt: "created", //Renomme la colonne createdAt en created dans la table.
      updatedAt: false, //Désactive la colonne updatedAt.
    }
  );
};

export { ProductModel }; //Permet d'exporter la fonction ProductModel pour qu'elle soit utilisée ailleurs dans le projet.
