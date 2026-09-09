import Offboarding from "../models/Offboarding.js";

export const createOffboarding = async (req, res) => {
    try {
        const data = await Offboarding.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOffboardings = async (req, res) => {
    try {
        const data = await Offboarding.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};