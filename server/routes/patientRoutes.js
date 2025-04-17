// import express from "express";
// import Patient from "../models/Patient.js";

// const router = express.Router();

// // ✅ Add a new patient
// router.post("/", async (req, res) => {
//   try {
//     const newPatient = new Patient(req.body);
//     await newPatient.save();
//     res.status(201).json(newPatient);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating patient", error });
//   }
// });

// // ✅ Get all patients
// router.get("/", async (req, res) => {
//   try {
//     const patients = await Patient.find();
//     res.json(patients);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching patients", error });
//   }
// });

// export default router;
// server/routes/doctorRoutes.js


// server/routes/patientRoutes.js (original)
import express from 'express';
import { getPatients } from '../controllers/patientController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();
router.get('/', authMiddleware, roleMiddleware(['admin']), getPatients);

export default router;