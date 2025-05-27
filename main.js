import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import hbs from "hbs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
hbs.registerPartials("views")
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// Set view engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Tambahkan helper untuk Handlebars
hbs.registerHelper("includes", function (array, value) {
  return Array.isArray(array) && array.includes(value);
});

hbs.registerHelper("getYear", function (dateStr) {
  const date = new Date(dateStr);
  return date.getFullYear();
});

// Tambahkan helper formatTanggal
hbs.registerHelper("formatTanggal", function (dateStr) {
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return new Date(dateStr).toLocaleDateString("id-ID", options);
});


// Serve static files
app.use(express.static(path.join(__dirname, "assets")));

// Project data
let projects = [];

// Halaman utama
app.get("/", (req, res) => res.render("home"));
app.get("/home", (req, res) => res.render("home"));
app.get("/contact", (req, res) => res.render("contact"));

// List project
app.get("/project", (req, res) => {
  res.render("project", { projects });
});

// Submit project baru
app.post("/project", (req, res) => {
  let { name, startDate, endDate, description, techs, imageBase64 } = req.body;

  if (!Array.isArray(techs)) {
    techs = techs ? [techs] : [];
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationInMonths = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30));
  const duration = `${durationInMonths} month${durationInMonths > 1 ? 's' : ''}`;

  const newProject = {
    id: Date.now(),
    name,
    start: startDate,
    end: endDate,
    duration,
    desc: description,
    techs,
    img: imageBase64,
  };

  projects.push(newProject);
  res.redirect("/project");
});

// Halaman detail project
app.get("/project/:id", (req, res) => {
  const project = projects.find(p => p.id == req.params.id);
  if (!project) return res.status(404).send("Project not found");
  res.render("project-detail", { project });
});

// Form contact
app.post("/contact", (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  console.log("CONTACT FORM:", name, email, phone, subject, message);
  res.send("Form berhasil dikirim!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
