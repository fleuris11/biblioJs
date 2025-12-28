import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url"; 
import ejs from "ejs";

import apiRoutes from "./routes/index.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import { BookModel } from "./models/book.model.js";

const app = express();
const PORT = process.env.PORT || 3000;

// __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Render index view into layout
app.get("/", async (req, res, next) => {
  try {
    const body = await new Promise((resolve, reject) => {
      ejs.renderFile(
        path.join(__dirname, "views", "index.ejs"),
        {},
        {},
        (err, html) => (err ? reject(err) : resolve(html))
      );
    });

    res.render("layout", { title: "Accueil", body });
  } catch (err) {
    next(err);
  }
});

app.get("/books", async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q = "", available = "" } = req.query;
    const result = await BookModel.list({ page, limit, q, available: available || undefined });

    const body = await new Promise((resolve, reject) => {
      res.render(
        "books",
        {
          books: result.data,
          page: result.page,
          limit: result.limit,
          total: result.total,
          q,
          available,
        },
        (err, html) => (err ? reject(err) : resolve(html))
      );
    });

    res.render("layout", { title: "Livres", body });
  } catch (e) {
    next(e);
  }
});

// API
app.use(apiRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
