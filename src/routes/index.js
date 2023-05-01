import express from "express";

const router = express.Router();

// GET home page
router.get("/", (req, res) => {
  res.send("Bienvenido a mi página principal");
});

export default router;
