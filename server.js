const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());

// Configure Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// Extract text from a PDF file
const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (err) {
    throw new Error("Failed to parse PDF");
  }
};

// Extract text from an image
const extractTextFromImage = async (buffer) => {
  try {
    const { data } = await Tesseract.recognize(buffer, "eng");
    return data.text;
  } catch (err) {
    throw new Error("Failed to extract text from image");
  }
};

// File upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let text = "";

    if (file.mimetype === "application/pdf") {
      text = await extractTextFromPDF(file.buffer);
    } else if (
      file.mimetype.startsWith("image/") &&
      ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"].includes(file.mimetype)
    ) {
      text = await extractTextFromImage(file.buffer);
    } else {
      return res
        .status(400)
        .json({ error: "Unsupported file type. Upload a PDF or an image." });
    }

    res.json({ text });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "An error occurred while processing the file" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
