import mongoose from "mongoose";

export const badReqHandler = (err, req, res, next) => {
  if (err.status === 400 || err instanceof mongoose.Error.ValidationError) {
    res.status(400).send({ message: err.message });
  } else if (err instanceof mongoose.Error.CastError) {
    res
      .status(400)
      .send({ message: "You've sent a wrong _id in request params" });
  } else {
    next(err);
  }
};

export const notFoundHandler = (error, req, res, next) => {
  if (error.status === 404) {
    res.status(404).send({ message: error.message });
  } else {
    next(error);
  }
};

export const generalErrorHandler = (error, req, res, next) => {
  console.log("ERROR:", error);
  res.status(500).send({
    message: "Something went wrong on the server side! Please try again later",
  });
};
