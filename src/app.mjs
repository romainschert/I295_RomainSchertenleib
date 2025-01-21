import express from "express";

const app = express();

app.use(express.json());
const port = 3000;

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
