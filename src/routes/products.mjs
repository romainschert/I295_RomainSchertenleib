import express from "express";

import { products } from "../db/mock-product.mjs";

import { success } from "./helper.mjs";

import { getUniqueID } from "./helper.mjs";
const productsRouter = express();

productsRouter.get("/", (req, res) => {
  const message = "La liste des produits a bien été récupérée.";
  res.json(success(message, products));
});

productsRouter.get("/:id", (req, res) => {
  console.log(req.params);
  const productId = req.params.id;
  const product = products.find((product) => product.id == productId);
  const message = `Le produit dont l'id vaut ${productId} a bien été récupéré`;
  res.json(success(message, product));
});

productsRouter.delete("/:id", (req, res) => {
  const productId = req.params.id;
  let deletedProduct = getProduct(productId);
  removeProduct(productId);
  // Définir un message pour le consommateur de l'API REST
  const message = `Le produit ${deletedProduct.name} a bien été supprimé !`;
  // Retourner la réponse HTTP en json avec le msg et le produit créé
  res.json(success(message, deletedProduct));
});

productsRouter.post("/", (req, res) => {
  const id = getUniqueID(products);

  //creat un nouveau produit qui est un objet avec req.body
  const createdProduct = { ...req.body, ...{ id: id, created: new Date() } };

  //ajouter createdProduct dans products
  products.push(createdProduct);

  //affichage du message une fois le produit crée
  const message = `Le produit ${createdProduct.name} a bien été créé !`;

  res.json(success(message, createdProduct));
});
export { productsRouter };
