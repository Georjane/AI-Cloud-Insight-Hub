import express from "express";
import multer from "multer";
import cors from "cors";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

// 👇 THIS ROUTE MUST EXIST
app.get("/", (req, res) => {
  res.status(200).send("Server is running 🚀");
});

const s3 = new S3Client({ region: "eu-north-1" });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const ext = req.file.originalname.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;

    const params = {
      Bucket: "insighthub-bucket-jane",
      Key: `uploads/${fileName}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    res.json({
      url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(5001, () => {
  console.log("🚀 Server running on http://localhost:5001");
});
