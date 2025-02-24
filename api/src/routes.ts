import { Router } from "express";
import { authenticate } from "./middleware/authenticate";

import { AuthController } from "./controllers/AuthController";
import { BoardController } from "./controllers/BoardController";
import { CardsController } from "./controllers/CardsController";
import logger from "./middleware/logger";

const router = Router();

router.use(logger);

router.post("/user/login", AuthController.login);
router.post("/user/refresh", AuthController.refresh);
router.post("/user/logout", AuthController.logout);
router.post("/user/register", AuthController.register);
router.get("/user/:id", authenticate, AuthController.getUserByID);
router.get("/user", authenticate, AuthController.getUserByName);

router.get("/boards", authenticate, BoardController.getAllBoards);
router.post("/boards/create", authenticate, BoardController.createBoard);
router.get("/boards/:id/members", authenticate, BoardController.getBoardMembers);
router.post("/boards/:id/members", authenticate, BoardController.addMemberToBoard);

router.get("/boards/:id/cards", authenticate, CardsController.getAllCards);
router.post("/boards/:id/cards", authenticate, CardsController.createCard);
router.put("/cards/:id", authenticate, CardsController.updateCard);
router.delete("/cards/:id", authenticate, CardsController.deleteCard);

export default router;
