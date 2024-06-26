import express from "express";
import mongoose from "mongoose";
import { ProgressTracking } from "../models/progressTrackingModel.js";
const router = express.Router();
router.post("/", async (req, res) => {
    try {
        if (
            !req.body.patientId ||
            !req.body.date ||
            !req.body.weight ||
            !req.body.bloodPressureSystolic ||
            !req.body.bloodPressureDiastolic ||
            !req.body.heartRate ||
            !req.body.temperature
        ) {
            return res.status(400).send({ message: "Fill in the required fields" });
        }

        const newProgressTracking = {
            _id: new mongoose.Types.ObjectId(),
            patientId: req.body.patientId,
            date: req.body.date,
            weight: req.body.weight,
            bloodPressureSystolic: req.body.bloodPressureSystolic,
            bloodPressureDiastolic: req.body.bloodPressureDiastolic,
            heartRate: req.body.heartRate,
            temperature: req.body.temperature,
            symptoms: req.body.symptoms,
            note: req.body.note
        };
        const progressTracking = await ProgressTracking.create(newProgressTracking);
        res.status(201).json(progressTracking);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}
);
router.get("/", async (req, res) => {
    try {
        const progressTracking = await ProgressTracking.find();
        res.status(200).json(progressTracking);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
);
// Find by patientId
router.get("/patient/:id", async (req, res) => {
    try {
        const progressTracking = await ProgressTracking.find({ patientId: req.params.id });
        if (!progressTracking) {
            return res.status(404).json({ message: "Progress tracking not found" });
        }
        res.status(200).json(progressTracking);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
);
router.get("/patient/recent/:id", async (req, res) => {
    try {
        const progressTracking = await ProgressTracking.find({ patientId: req.params.id })
            .sort({ date: -1 }) // Sort by date in descending order
            .limit(1); // Get only the first result
        if (!progressTracking || progressTracking.length === 0) {
            return res.status(404).json({ message: "Progress tracking not found" });
        }
        res.status(200).json(progressTracking[0]); // Return the first (and only) result
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});
export default router;

