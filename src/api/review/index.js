import Express from "express";
import uniqid from "uniqid";
import {
  checkReviewSchema,
  triggerBadRequest,
} from "../products/validation.js";
import { getReviews, writeReviews } from "../../lib/fs-tools.js";

const reviewsRouter = Express.Router();

reviewsRouter.post(
  "/:productsId/reviews",
  checkReviewSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const product_id = req.params.productsId;
      const newReview = {
        ...req.body,
        review_id: uniqid(),
        product_id: product_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const allReviews = await getReviews();
      allReviews.push(newReview);
      await writeReviews(allReviews);
      res.status(201).send({ review_id: newReview.review_id });
    } catch (error) {
      next(error);
    }
  }
);

reviewsRouter.get("/:productsId/reviews", async (req, res, next) => {
  try {
    const productId = req.params.productsId;
    const allReviews = await getReviews();
    const productReviews = allReviews.filter((e) => e.product_id === productId);
    res.send(productReviews);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:productsId/reviews/:reviewsId", async (req, res, next) => {
  try {
    const reviewId = req.params.reviewsId;
    const allReviews = await getReviews();
    const matchedReview = allReviews.find((e) => e.review_id === reviewId);
    res.send(matchedReview);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put(
  "/:productsId/reviews/:reviewsId",
  checkReviewSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const reviewId = req.params.reviewsId;
      const allReviews = await getReviews();
      const index = allReviews.findIndex((e) => e.review_id === reviewId);
      const oldReview = allReviews[index];
      const updatedReview = {
        ...oldReview,
        ...req.body,
        updatedAt: new Date(),
      };
      allReviews[index] = updatedReview;
      await writeReviews(allReviews);
      res.send(updatedReview);
    } catch (error) {
      next(error);
    }
  }
);

reviewsRouter.delete(
  "/:productsId/reviews/:reviewsId",
  async (req, res, next) => {
    try {
      const reviewId = req.params.reviewsId;
      const allReviews = await getReviews();
      const remainingReviews = allReviews.filter(
        (e) => e.review_id !== reviewId
      );
      await writeReviews(remainingReviews);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default reviewsRouter;
