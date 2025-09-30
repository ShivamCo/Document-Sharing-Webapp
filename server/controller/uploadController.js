import fs from "fs/promises";
import pool from "../config/pgConfig.js";
import imagekit from "../config/imagekit.js";
import { decryptPin } from "../utils/pinUtils.js"; 

const uploadFileController = async (req, res) => {
  const { adminId } = req.params;
  const { uploadPin, email } = req.body;

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    if (!uploadPin) {
      return res.status(400).json({ error: "Upload PIN is required" });
    }

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const adminResult = await pool.query(
      "SELECT upload_pin FROM admins WHERE id = $1",
      [adminId]
    );

    if (adminResult.rowCount === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    
    const storedEncryptedPin = adminResult.rows[0].upload_pin;
    const decryptedPin = decryptPin(storedEncryptedPin);

    if (uploadPin !== decryptedPin) {
      return res.status(401).json({ error: "Invalid upload PIN" });
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    const results = [];

    for (const file of req.files) {
      if (!allowedTypes.includes(file.mimetype)) {
        await fs.unlink(file.path);
        return res
          .status(400)
          .json({ error: `${file.originalname} is not a valid file type` });
      }

      const fileBuffer = await fs.readFile(file.path);

      const uploadResult = await imagekit.upload({
        file: fileBuffer,
        fileName: file.originalname,
      });

      await fs.unlink(file.path);

      await pool.query(
        `INSERT INTO uploads (admin_id, original_name, file_url, file_id, file_type, email)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          adminId,
          file.originalname,
          uploadResult.url,
          uploadResult.fileId,
          file.mimetype,
          email,
        ]
      );

      results.push({
        url: uploadResult.url,
        fileId: uploadResult.fileId,
        type: file.mimetype,
        originalName: file.originalname,
        email,
      });
    }

    return res.status(201).json({
      message: "Files uploaded successfully",
      files: results,
    });
  } catch (error) {
    console.error("Upload error:", error);

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (cleanupError) {
          console.error("File cleanup error:", cleanupError);
        }
      }
    }

    return res
      .status(500)
      .json({ error: "Upload failed, please try again later" });
  }
};

export default uploadFileController;
