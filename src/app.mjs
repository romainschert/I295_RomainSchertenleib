import express from "express";

const app = express();

app.use(express.json());
const port = 3000;

import { initDb, sequelize } from "./db/sequelize.mjs";

sequelize
  .authenticate()
  .then((_) =>
    console.log("La connextion a la base de données a bien été établie")
  )
  .catch((error) => console.error("impossible de se connecter a la DB"));

initDb();

app.get("/", (req, res) => {
  res.send("hello word");
});

app.get("/api/", (req, res) => {
  res.redirect(`http://localhost:${port}/`);
});

import { productsRouter } from "./routes/products.mjs";
app.use("/api/products", productsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

app.use(({ res }) => {
  const message =
    "impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json(message);
});
