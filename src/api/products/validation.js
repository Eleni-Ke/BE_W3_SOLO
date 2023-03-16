import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const productsSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name is a mandatory field and needs to be a string.",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage:
        "Description is a mandatory field and needs to be a string.",
    },
  },
  brand: {
    in: ["body"],
    isString: {
      errorMessage: "Brand is a mandatory field and needs to be a string.",
    },
  },
  price: {
    in: ["body"],
    isNumber: {
      errorMessage: "Price is a mandatory field and needs to be a number.",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a string.",
    },
  },
};

const reviewSchema = {
  comment: {
    in: ["body"],
    isString: {
      errorMessage: "Comment is a mandatory field and needs to be a string.",
    },
  },
  rate: {
    in: ["body"],
    isInt: {
      options: { min: 1, max: 5 },
      errorMessage: "Rate is a mandatory field and needs to be a number.",
    },
  },
};

export const checkPoductsSchema = checkSchema(productsSchema);

export const checkReviewSchema = checkSchema(reviewSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors.array());

  if (errors.isEmpty()) {
    next();
  } else {
    next(
      createHttpError(400, "Errors during post/put validation", {
        errorsList: errors.array(),
      })
    );
  }
};
