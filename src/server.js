import Express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./api/products/index.js";
import filesRouter from "./api/files/index.js";
import {
  badReqHandler,
  generalErrorHandler,
  notFoundHandler,
} from "./errorsHandlers.js";
import reviewsRouter from "./api/review/index.js";

const server = Express();
const port = 3002;

server.use(cors());

server.use(Express.json());

server.use("/products", productsRouter);
server.use("/products", reviewsRouter);
server.use("/products", filesRouter);

server.use(badReqHandler);
server.use(notFoundHandler);
server.use(generalErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server works on port: ", port);
});
