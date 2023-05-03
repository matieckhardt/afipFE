import express from "express";
import {
  index,
  store,
  salesPoint,
  saveCert,
  lastVoucher,
  serverStatus,
} from "@controllers/afipController";

const router = express.Router();

router.get("/", index);
router.post("/", store);
router.post("/save-cert", saveCert);
router.get("/sales-point", salesPoint);
router.get("/last-voucher", lastVoucher);
router.get("/server-status", serverStatus);

export default router;
