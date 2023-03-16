import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const productsJSONPath = join(dataFolderPath, "products.json");
const reviewsJSONPath = join(dataFolderPath, "reviews.json");
const imgPublicFolderPath = join(process.cwd(), "./public/img");

export const getProducts = () => readJSON(productsJSONPath);
export const writeProducts = (allProducts) =>
  writeJSON(productsJSONPath, allProducts);

export const getReviews = () => readJSON(reviewsJSONPath);
export const writeReviews = (allreviews) =>
  writeJSON(reviewsJSONPath, allreviews);

export const saveProductImg = (fileName, fileContentAsBuffer) =>
  writeFile(join(imgPublicFolderPath, fileName), fileContentAsBuffer);
