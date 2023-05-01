import express from "express";
import {
  index,
  store,
  salesPoint,
  saveCert,
  lastVoucher,
} from "@controllers/afipController";

const router = express.Router();

router.get("/", index);
router.post("/", store);
router.get("/sales-point", salesPoint);
router.get("/last-voucher", lastVoucher);
router.post("/save-cert", saveCert);

export default router;
