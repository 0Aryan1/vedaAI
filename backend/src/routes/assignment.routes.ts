import { Router } from "express";
import {
  createAssignment,
  createAssignmentSchema,
  deleteAssignment,
  getAllAssignments,
  getAssignment,
} from "../controllers/assignment.controller";
import { validate } from "../middlewares/validate";

const router = Router();

router.post("/", validate(createAssignmentSchema), createAssignment);
router.get("/", getAllAssignments);
router.get("/:id", getAssignment);
router.delete("/:id", deleteAssignment);

export default router;
