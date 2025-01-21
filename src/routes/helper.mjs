import { products } from "../db/mock-product.mjs";

// creation de success pour après l'utiliser dans products
const success = (message, data) => {
  // success retourn un objet avec message et data
  return {
    message: message,
    data: data,
  };
};

// cette fonction permet d'avoir un ID unique pour chaque products
const getUniqueID = (products) => {
  //fonction en flèche avec comme paramètre products
  const productsIds = products.map((product) => product.id);
  const maxId = productsIds.reduce((a, b) => Math.max(a, b));

  return maxId + 1;
  //return l'id max +1 donc l'ID et unique
};

export { success, getUniqueID };
