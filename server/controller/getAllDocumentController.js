import pool from "../config/pgConfig.js";
import jwt from "jsonwebtoken";


const getAllDocumentController = async (req,res) =>{

    const adminId = req.params.adminId;
   
    const allDocumentsUrl = await pool.query('SELECT * FROM uploads WHERE admin_id = $1', [adminId])

    res.send(allDocumentsUrl.rows)

}

export default getAllDocumentController;