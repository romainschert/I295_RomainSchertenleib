import { DataTypes } from "sequelize"; //Importation de l'objet DataTypes depuis le package sequelize.
// DataTypes est utilisé pour définir les types de données des colonnes de la base de données, comme INTEGER, STRING, etc.
import { sequelize } from "../db/sequelize.mjs"; //Cela permet d'interagir avec la base de données configurée.

const UserModel = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "Ce username est déjà pris." },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
export { UserModel };
