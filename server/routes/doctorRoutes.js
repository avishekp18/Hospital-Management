// import express from "express";
// import Doctor from "../models/Doctor.js";

// const router = express.Router();

// // ✅ Add a new doctor
// router.post("/", async (req, res) => {
//   try {
//     const newDoctor = new Doctor(req.body);
//     await newDoctor.save();
//     res.status(201).json(newDoctor);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating doctor", error });
//   }
// });

// // ✅ Get all doctors
// router.get("/", async (req, res) => {
//   try {
//     const doctors = await Doctor.find();
//     res.json(doctors);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching doctors", error });
//   }
// });

// export default router;

// server/routes/doctorRoutes.js
import express from 'express';
import { getDoctors } from '../controllers/doctorController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', authMiddleware, getDoctors);

export default router;