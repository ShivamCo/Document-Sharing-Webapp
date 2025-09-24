import fs from "fs/promises";
import pool from "../config/pgConfig.js";
import imagekit from "../config/imagekit.js"

const uploadFileController = async (req, res) => {
  const { adminId } = req.params;
  const { uploadPin } = req.body;

  try {
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

   
    if (!uploadPin) {
      return res.status(400).json({ error: "Upload PIN is required" });
    }

    
    const adminResult = await pool.query(
      "SELECT upload_pin FROM admins WHERE id = $1",
      [adminId]
    );

    if (adminResult.rowCount === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const storedPin = adminResult.rows[0].upload_pin;
    if (storedPin !== uploadPin) {
      return res.status(401).json({ error: "Invalid upload PIN" });
    }

    
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(req.file.mimetype)) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: "Only PDF and image files are allowed" });
    }

   
    const fileBuffer = await fs.readFile(req.file.path);

    
    const uploadResult = await imagekit.upload({
      file: fileBuffer, 
      fileName: req.file.originalname,
      // folder: "uploads", 
    });


    await fs.unlink(req.file.path);

   
    await pool.query(
      `INSERT INTO uploads (admin_id, original_name, file_url, file_id, file_type)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        adminId,
        req.file.originalname,
        uploadResult.url,
        uploadResult.fileId,
        uploadResult.fileType,
      ]
    );

    return res.status(201).json({
      message: "File uploaded successfully",
      file: {
        url: uploadResult.url,
        fileId: uploadResult.fileId,
        type: uploadResult.fileType,
        originalName: req.file.originalname,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

   
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error("File cleanup error:", cleanupError);
      }
    }

    return res
      .status(500)
      .json({ error: "Upload failed, please try again later" });
  }
};

export default uploadFileController;
