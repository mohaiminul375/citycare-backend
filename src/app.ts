import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import httpStatus from "http-status";
import config from "./config";
import { AuthRoutes } from "./module/auth/auth.route";
import { notFound } from "./middleware/notFound";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { categoriesRoutes } from "./module/categories/categories.route";

const app: Application = express();

app.use(
	cors({
		origin: config.frontend_url,
		credentials: true,
	}),
);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
// Api's
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/categories", categoriesRoutes);

// Basic route
app.get("/", async (req: Request, res: Response) => {
	res.status(httpStatus.OK).json({
		success: true,
		message: "Welcome to city care System Backend",
	});
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
