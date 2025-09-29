import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import testRoute from "./routes/testRoute.js";
import signUpRoute from "./routes/adminSignUpRoute.js";
import loginRoute from "./routes/adminLoginRoute.js";
import logoutRoute from "./routes/adminLogoutRoute.js";
import documentUploadRoute from "./routes/documentUploadRoute.js";
import dashboardRoutes from "./routes/dashboardRoute.js";
import getAllDocuments from "./routes/getAllDocuments.js";
import deleteDocumentsRoute from "./routes/deleteDocumentRoute.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.ORIGIN;
app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//   origin: 'https://print-doc-manager.netlify.app', ,
//   credentials: true
// }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://print-doc-manager.netlify.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};


app.use(cors(corsOptions));

app.use("/api", testRoute);
app.use("/api", signUpRoute);
app.use("/api", loginRoute);
app.use("/api", documentUploadRoute);
app.use("/api", dashboardRoutes);
app.use("/api", getAllDocuments);
app.use("/api", logoutRoute);
app.use("/api", deleteDocumentsRoute);

app.listen(PORT,() => {
  console.log(`Server is Live on ${PORT}`);
});
