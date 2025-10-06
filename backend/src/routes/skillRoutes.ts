import { Router } from "express";
import { SkillController } from "../controllers/skillController";
import {
  CreateSkillDto,
  UpdateSkillDto,
} from "../controllers/dto/skill/skill.dto";
import { validationMiddleware } from "../middleware/validate";

const router = Router();
const skillController = new SkillController();

// Admin CRUD for skills
router.get("/", (req, res) => skillController.getAll(req, res));
router.post("/", validationMiddleware(CreateSkillDto), (req, res) =>
  skillController.create(req, res)
);
router.put("/:id", validationMiddleware(UpdateSkillDto), (req, res) =>
  skillController.update(req, res)
);
router.delete("/:id", (req, res) => skillController.delete(req, res));

export default router;
