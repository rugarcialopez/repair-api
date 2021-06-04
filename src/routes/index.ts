import { Response, Request } from 'express'
import { Router } from "express";

const router: Router = Router()

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({success: true});
});


export default router;