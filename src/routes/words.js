const router = require("express").Router();
const { body, validationResult } = require('express-validator');
const Words = require("../models/Words");

// All Words
router.get("/", async (req, res) => {
    try {
        const words = await Words.find();
        res.status(200).json({
            message: "All Words",
            data: {
                words
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// A Word
router.get("/:id", async (req, res) => {
    try {
        const word = await Words.findById(req.params.id);
        if (!word) {
            return res.status(404).json({ message: "Word not found" });
        }
        res.status(200).json({
            message: "Word",
            data: {
                word
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a Word
router.post("/add",
body('word').not().isEmpty().withMessage('Word is required'),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
    }
    const { word } = req.body;
    try {
        let wordExists = await Words.findOne({ word });
        if (wordExists) {
            return res.status(400).json({
                success: false,
                message: "Word already exists"
            });
        }
        const newWord = new Words({
            word
        });
        await newWord.save();
        res.status(201).json({
            success: true,
            message: "Word added successfully"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a word
router.put("/update/:id",
body('word').not().isEmpty().withMessage('Word is required'),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
    }
    const { word } = req.body;
    const { id } = req.params;
    try {
        const wordFound = await Words.findById(req.params.id);
        if (!wordFound) {
            return res.status(404).json({ message: "Word not found" });
        }
        let wordExists = await Words.findOne({ word });
        if (wordExists) {
            return res.status(400).json({
                success: false,
                message: "Word already exists"
            });
        }
        const updatedWord = await Words.findByIdAndUpdate(id, { word }, { new: true });
        res.status(200).json({
            success: true,
            message: "Word updated successfully",
            data: {
                updatedWord
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a word
router.delete("/delete/:id",
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
    }
    const { id } = req.params;
    try {
        const wordFound = await Words.findById(req.params.id);
        if (!wordFound) {
            return res.status(404).json({ message: "Word not found" });
        }
        const deletedWord = await Words.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Word deleted successfully",
            data: {
                deletedWord
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;