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
import createHttpError from "http-errors";
import mongoose from "mongoose";

const server = Express();
const port = process.env.PORT || 3001;

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist!`)
      );
    }
  },
};

server.use(cors(corsOpts));
server.use(Express.static("public"));

server.use(Express.json());

server.use("/products", productsRouter);
server.use("/products", reviewsRouter);
server.use("/products", filesRouter);

server.use(badReqHandler);
server.use(notFoundHandler);
server.use(generalErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("✅ Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`✅ Server is running on port ${port}`);
  });
});
