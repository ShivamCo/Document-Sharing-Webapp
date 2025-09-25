import pool from "../config/pgConfig.js";
import imagekit from "../config/imagekit.js";

const deleteFileController = async (req, res) => {
  const { adminId, fileId } = req.params;

  try {
    
    const fileResult = await pool.query(
      "SELECT file_id FROM uploads WHERE admin_id = $1 AND file_id = $2",
      [adminId, fileId]
    );

    if (fileResult.rowCount === 0) {
      return res.status(404).json({ error: "File not found" });
    }

  
    await imagekit.deleteFile(fileId);


    await pool.query("DELETE FROM uploads WHERE admin_id = $1 AND file_id = $2", [
      adminId,
      fileId,
    ]);

    return res.status(200).json({
      message: "File deleted successfully",
      fileId,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ error: "Delete failed, please try again later" });
  }
};

export default deleteFileController;
