import { Router } from "express";
import { getJobStatus, getPaper, getPaperByAssignment } from "../controllers/paper.controller";

const router = Router();

router.get("/jobs/:jobId", getJobStatus);
router.get("/assignment/:assignmentId", getPaperByAssignment);
router.get("/:id", getPaper);

export default router;
