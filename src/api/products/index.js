import Express from "express";
import uniqid from "uniqid";
import { checkPoductsSchema, triggerBadRequest } from "./validation.js";
import { getProducts, writeProducts } from "../../lib/fs-tools.js";

const productsRouter = Express.Router();

productsRouter.post(
  "/",
  checkPoductsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newProduct = {
        ...req.body,
        id: uniqid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const allProducts = await getProducts();
      allProducts.push(newProduct);
      await writeProducts(allProducts);

      res.status(201).send({ id: newProduct.id });
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.get("/", async (req, res, next) => {
  try {
    const allProducts = await getProducts();
    if (req.query && req.query.name) {
      const matchedProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(req.query.name.toLocaleLowerCase())
      );
      res.send(matchedProducts);
    } else {
      res.send(allProducts);
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productsId", async (req, res, next) => {
  try {
    const productId = req.params.productsId;
    const allProducts = await getProducts();
    const product = allProducts.find((e) => e.id === productId);
    res.send(product);
  } catch (error) {
    next(error);
  }
});

productsRouter.put(
  "/:productsId",
  checkPoductsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const productId = req.params.productsId;
      const allProducts = await getProducts();
      const index = allProducts.findIndex((e) => e.id === productId);
      const oldProduct = allProducts[index];
      const updatedProduct = {
        ...oldProduct,
        ...req.body,
        updatedAt: new Date(),
      };
      allProducts[index] = updatedProduct;
      await writeProducts(allProducts);
      res.send(updatedProduct);
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.delete("/:productsId", async (req, res, next) => {
  try {
    const productId = req.params.productsId;
    const allProducts = await getProducts();
    const remainingProducts = allProducts.filter((e) => e.id !== productId);
    await writeProducts(remainingProducts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
