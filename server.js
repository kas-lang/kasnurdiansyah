import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import hbs from "hbs";
import { Pool } from "pg"; // ✅ Tambahan koneksi database

// Konfigurasi koneksi ke PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'personal',
  password: 'root',
  port: 5432,
});


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

//REGISTER BUAT EDIT DAN DELETE
hbs.registerHelper("json", context => JSON.stringify(context));

// Serve static files
app.use(express.static(path.join(__dirname, "assets")));

// Project data
let projects = [];

// Halaman utama
app.get("/", (req, res) => res.render("home"));
app.get("/home", (req, res) => res.render("home"));
app.get("/contact", (req, res) => res.render("contact"));


// Submit project baru
app.post("/project", async (req, res) => {
  let { name, startDate, endDate, description, techs, imageBase64 } = req.body;

  if (!Array.isArray(techs)) {
    techs = techs ? [techs] : [];
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationInMonths = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30));
  const duration = `${durationInMonths} month${durationInMonths > 1 ? 's' : ''}`;

  try {
    await pool.query(
      `INSERT INTO projects (name, start_date, end_date, duration, description, techs, image_base64)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [name, startDate, endDate, duration, description, JSON.stringify(techs), imageBase64]
    );
    
    res.redirect("/project");
  } catch (err) {
    console.error("Error saving project:", err);
    res.status(500).send("Gagal menyimpan project.");
  }
});


// NAMPILKAN CARD DIBAWAH MYPROJECT
app.get("/project", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id DESC");

    // Ubah techs ke array kalau masih string
    const dbProjects = result.rows.map(project => ({
      ...project,
      techs: typeof project.techs === 'string' ? JSON.parse(project.techs) : project.techs,
    }));

    console.log("=== Projects sent to view ===");
    console.log(dbProjects); // 👈 LIHAT APAKAH ADA DATA DI SINI

    res.render("project", { projects: dbProjects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).send("Gagal mengambil data project.");
  }
});

// NAMPILIN DITAB BARU HALAMAN DETAIL
app.get("/project/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [req.params.id]);
    const project = result.rows[0];
    if (!project) return res.status(404).send("Project not found");

    // Pastikan techs berupa array
    project.techs = typeof project.techs === "string" ? JSON.parse(project.techs) : project.techs;

    res.render("project-detail", { project });
  } catch (err) {
    console.error("Error fetching project detail:", err);
    res.status(500).send("Gagal mengambil data project.");
  }
});

// ==================== EDIT ====================

// Tampilkan form edit
app.get("/edit/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [req.params.id]);
    const project = result.rows[0];
    if (!project) return res.status(404).send("Project not found");

    project.techs = typeof project.techs === "string" ? JSON.parse(project.techs) : project.techs;

    res.render("edit", { project }); // ✅ render edit.hbs
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal mengambil data project.");
  }
});

//POST SETELAH UPDATE EDIT 
app.post("/project/edit/:id", async (req, res) => {
  let { name, startDate, endDate, description, techs, imageBase64 } = req.body;
  if (!Array.isArray(techs)) techs = techs ? [techs] : [];

  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationInMonths = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30));
  const duration = `${durationInMonths} month${durationInMonths > 1 ? 's' : ''}`;

  try {
    await pool.query(
      `UPDATE projects SET name=$1, start_date=$2, end_date=$3, duration=$4,
       description=$5, techs=$6, image_base64=$7 WHERE id=$8`,
      [name, startDate, endDate, duration, description, JSON.stringify(techs), imageBase64, req.params.id]
    );
    
    res.redirect("/project");
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).send("Gagal update project.");
  }
});



//DELETE
app.post("/project/delete/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM projects WHERE id = $1", [req.params.id]);
    res.redirect("/project");
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus project.");
  }
});





// Form contact
app.post("/contact", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    await pool.query(
      `INSERT INTO contacts (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, phone, subject, message]
    );
    res.send("Form berhasil dikirim!");
  } catch (err) {
    console.error("Error saving contact:", err);
    res.status(500).send("Gagal menyimpan kontak.");
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
