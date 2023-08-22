import express from "express";
import userController from "../controller/user.controller.js";
import clientController from "../controller/client.controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

const clientRouter = new express.Router();
clientRouter.use(authMiddleware);
clientRouter.post("/api/clients", clientController.createNewClient);

export {
    userRouter,
    clientRouter
}