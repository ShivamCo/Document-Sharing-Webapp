import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import testRoute from "./routes/testRoute.js";
import signUpRoute from './routes/adminSignUpRoute.js'
import loginRoute from './routes/adminLoginRoute.js'
import logoutRoute from "./routes/adminLogoutRoute.js"
import documentUploadRoute from "./routes/documentUploadRoute.js"
import dashboardRoutes from "./routes/dashboardRoute.js"
import getAllDocuments from "./routes/getAllDocuments.js"
import deleteDocumentsRoute from "./routes/deleteDocumentRoute.js"


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));


app.use("/api", testRoute);
app.use("/api", signUpRoute)
app.use("/api", loginRoute)
app.use("/api", documentUploadRoute)
app.use("/api", dashboardRoutes );
app.use("/api", getAllDocuments );
app.use("/api", logoutRoute );
app.use("/api", deleteDocumentsRoute );

app.listen(PORT, () => {
  console.log(`Server is Live on ${PORT}`);
});
