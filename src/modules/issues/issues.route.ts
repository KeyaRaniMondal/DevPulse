import { Router } from "express";

import {
  createIssueController,
  deleteIssueController,
  getAllIssuesController,
  getSingleIssueController,
  updateIssueController
} from "./issues.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  createIssueController
);

router.get("/", getAllIssuesController);

router.get("/:id", getSingleIssueController);

router.patch(
  "/:id",
  authMiddleware,
  updateIssueController
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("maintainer"),
  deleteIssueController
);

export default router;