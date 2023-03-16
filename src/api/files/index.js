import Express from "express";
import createHttpError from "http-errors";
import multer from "multer";
import { extname } from "path";
import {
  getProducts,
  saveProductImg,
  writeProducts,
} from "../../lib/fs-tools.js";

const filesRouter = Express.Router();

filesRouter.post(
  "/:productsId/upload",
  multer().single("image"),
  async (req, res, next) => {
    try {
      const allProducts = await getProducts();
      const productId = req.params.productsId;
      const index = allProducts.findIndex(
        (product) => product.id === productId
      );
      if (index !== -1) {
        const originalFileExt = extname(req.file.originalname);
        const fileName = productId + originalFileExt;
        await saveProductImg(fileName, req.file.buffer);

        const oldProduct = allProducts[index];
        const updatedProduct = {
          ...oldProduct,
          ...req.body,
          imageURL: `http://localhost:3001/img/${fileName}`,
          updatedAt: new Date(),
        };
        allProducts[index] = updatedProduct;
        await writeProducts(allProducts);
        res.send({ message: "File has been uploaded" });
      } else {
        next(
          createHttpError(404, `Product with the id: ${productId} not found.`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
