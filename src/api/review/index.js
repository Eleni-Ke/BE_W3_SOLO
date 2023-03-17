import Express from "express";
import createHttpError from "http-errors";
import ReviewsModel from "./model.js";
import ProductsModel from "../products/model.js";

const reviewsRouter = Express.Router();

reviewsRouter.post("/:productsId/reviews", async (req, res, next) => {
  try {
    const productToChange = await ProductsModel.findById(req.params.productsId);
    if (!productToChange)
      return next(
        createHttpError(
          404,
          `Product witht the id: ${req.params.productsId} not found.`
        )
      );
    const newReview = new ReviewsModel(req.body);
    const { _id } = await newReview.save();
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      req.params.productsId,
      { $push: { reviews: { _id } } },
      { new: true, runValidators: true }
    );

    res.status(201).send(updatedProduct);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:productsId/reviews", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productsId);
    if (!product)
      return next(
        createHttpError(
          404,
          `Product with the id: ${req.params.productsId} not found.`
        )
      );
    const reviews = await ReviewsModel.find({
      _id: { $in: product.reviews },
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:productsId/reviews/:reviewsId", async (req, res, next) => {
  try {
    const review = await ReviewsModel.findById(req.params.reviewsId);
    if (review) {
      res.send(review);
    } else {
      next(
        createHttpError(
          404,
          `Review with the id: ${req.params.reviewsId} not found.`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put("/:productsId/reviews/:reviewsId", async (req, res, next) => {
  try {
    const updatedReview = await ReviewsModel.findByIdAndUpdate(
      req.params.reviewsId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedReview) {
      res.send(updatedReview);
    } else {
      next(
        createHttpError(
          404,
          `Review with the id: ${req.params.reviewsId} not found.`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete(
  "/:productsId/reviews/:reviewsId",
  async (req, res, next) => {
    try {
      const deletedReview = await ReviewsModel.findByIdAndDelete(
        req.params.reviewsId
      );
      if (deletedReview) {
        res.status(204).send();
      } else {
        next(
          createError(404, `Review with id ${req.params.reviewsId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default reviewsRouter;
