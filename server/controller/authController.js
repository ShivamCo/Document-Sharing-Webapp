import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../config/pgConfig.js";
import { encryptPin, decryptPin } from "../middleware/pinEncryption.js";

const generateToken = (admin) =>
  jwt.sign(
    { id: admin.id, 
      email: admin.email, 
      name: admin.name },
    process.env.JWT_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

//SIGNUP


export const signUp = async (req, res) => {
  const { email, password, pin, name } = req.body;

  try {
    if (!email || !password || !pin || !name) {
      return res.status(400).json({ message: "Email, Password, Name, and PIN are required" });
    }

    const existingUser = await pool.query("SELECT id FROM admins WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const encryptedPin = encryptPin(pin);

    const result = await pool.query(
      "INSERT INTO admins (email, password_hash, upload_pin, name) VALUES ($1, $2, $3, $4) RETURNING id, email, name, upload_pin",
      [email, hashedPassword, encryptedPin, name]
    );

    const admin = result.rows[0];
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name, pin },
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "None", maxAge: 1000*60*60, path: "/" });

    return res.status(201).json({ message: "User created successfully.", admin: { id: admin.id, name: admin.name, email: admin.email, pin } });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


// LOGIN


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return res.status(400).json({ message: "Email and Password are required" });

    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(401).json({ message: "Invalid email or password" });

    const admin = result.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) return res.status(401).json({ message: "Invalid email or password" });

    const decryptedPin = decryptPin(admin.upload_pin);

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name, pin: decryptedPin },
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "None", maxAge: 1000*60*60, path: "/" });

    return res.status(200).json({ message: "Login successful.", admin: { id: admin.id, name: admin.name, email: admin.email, pin: decryptedPin } });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


// LOGOUT
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,        
      sameSite: "None",    
      path: "/",
    });

    return res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// CHANGE PIN
export const changePin = async (req, res) => {
  const { email, oldPin, newPin } = req.body;

  try {
    if (!email || !oldPin || !newPin) return res.status(400).json({ message: "Email, old PIN, and new PIN are required" });

    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

    const admin = result.rows[0];
    const decryptedOldPin = decryptPin(admin.upload_pin);

    if (oldPin !== decryptedOldPin) return res.status(401).json({ message: "Old PIN is incorrect" });

    const encryptedNewPin = encryptPin(newPin);

    await pool.query("UPDATE admins SET upload_pin = $1 WHERE email = $2", [encryptedNewPin, email]);

    return res.status(200).json({ message: "PIN changed successfully." });
  } catch (error) {
    console.error("Change PIN error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

