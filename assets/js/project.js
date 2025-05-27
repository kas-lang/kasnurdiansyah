let projects = [];

function loadProjects() {
  const saved = localStorage.getItem("projects");
  if (saved) {
    projects = JSON.parse(saved);
  }
  renderCards();
}

function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function getData(e) {
  e.preventDefault();

  const name = document.getElementById("projectName").value;
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  const desc = document.getElementById("description").value;
  const node = document.getElementById("nodeJs").checked;
  const react = document.getElementById("reactJs").checked;
  const next = document.getElementById("nextJs").checked;
  const typescript = document.getElementById("typescript").checked;
  const imageFile = document.getElementById("uploadImage").files[0];

  if (!name || !desc || !imageFile) {
    alert("Please fill all fields");
    return;
  }

  const durationInMonths = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
  const duration = `${durationInMonths} month${durationInMonths > 1 ? 's' : ''}`;

  const reader = new FileReader();
  reader.onload = function (event) {
    const newProject = {
      id: Date.now(),
      name,
      start: formatDate(startDate),
      end: formatDate(endDate),
      duration,
      desc,
      techs: {
        node,
        react,
        next,
        typescript
      },
      img: event.target.result
    };

    projects.push(newProject);
    saveProjects();
    renderCards();
    document.getElementById("formProject").reset();
  };

  reader.readAsDataURL(imageFile);
}

function formatDate(date) {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString("en-GB", options).replace(/ /g, ' ');
}

function convertToInputDate(dateStr) {
  const [day, monthStr, year] = dateStr.split(" ");
  const months = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
  };
  const month = months[monthStr];
  return `${year}-${month}-${day}`;
}

function truncate(text, max) {
  return text.length > max ? text.substring(0, max) + '...' : text;
}

function renderCards() {
  const container = document.getElementById("flexbox");
  container.innerHTML = projects.map((p, index) => `
    <div class="col-md-3 project-card">
      <div class="card">
        <img src="${p.img}" class="card-img-top" alt="${p.name}" style="cursor: pointer;" onclick="openProjectDetail(${index})"/>
        <div class="card-body">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text">durasi: ${p.duration}</p>
          <p class="card-text">${truncate(p.desc, 100)}</p>
          <div>
            ${p.techs.node ? '<img class="tech-icon" src="/logo/node.png" />' : ''}
            ${p.techs.react ? '<img class="tech-icon" src="/logo/react.png" />' : ''}
            ${p.techs.next ? '<img class="tech-icon" src="/logo/next.png" />' : ''}
            ${p.techs.typescript ? '<img class="tech-icon" src="/logo/typescript.png" />' : ''}
          </div>
          <div class="mt-3 d-flex gap-2">
  <button class="btn btn-sm btn-secondary w-50" onclick="editProject(${index})">Edit</button>
  <button class="btn btn-sm btn-danger w-50" onclick="deleteProject(${index})">Delete</button>
</div>

        </div>
      </div>
    </div>
  `).join("");
}

function deleteProject(index) {
  if (confirm("Are you sure you want to delete this project?")) {
    projects.splice(index, 1);
    saveProjects();
    renderCards();
  }
}

function editProject(index) {
  const p = projects[index];

  document.getElementById("projectName").value = p.name;
  document.getElementById("startDate").value = convertToInputDate(p.start);
  document.getElementById("endDate").value = convertToInputDate(p.end);
  document.getElementById("description").value = p.desc;
  document.getElementById("nodeJs").checked = p.techs.node;
  document.getElementById("reactJs").checked = p.techs.react;
  document.getElementById("nextJs").checked = p.techs.next;
  document.getElementById("typescript").checked = p.techs.typescript;

  projects.splice(index, 1);
  saveProjects();
  renderCards();
}

// ✅ Tab Baru Detail Project
function openProjectDetail(index) {
  const project = projects[index];
  const techIcons = {
    node: { label: "Node Js", icon: "/logo/node.png" },
    react: { label: "React Js", icon: "/logo/react.png" },
    next: { label: "Next Js", icon: "/logo/next.png" },
    typescript: { label: "TypeScript", icon: "/logo/typescript.png" },
  };

  const techGrid = Object.entries(project.techs)
    .filter(([key, val]) => val)
    .map(([key]) => {
      const { label, icon } = techIcons[key];
      return `
        <div class="col-6 d-flex align-items-center mb-3">
          <img src="${icon}" alt="${label}" style="height: 30px; margin-right: 10px;" />
          <span>${label}</span>
        </div>
      `;
    }).join("");

  const newWindow = window.open('', '_blank');
  newWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${project.name}</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        body {
          background-color: #f8f9fa;
          padding: 40px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .container-box {
          background-color: #fff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        h1 {
          font-weight: 700;
          margin-bottom: 30px;
          text-align: center;
        }

        .project-img {
          width: 100%;
          max-height: 350px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .section-title {
          font-weight: 600;
          font-size: 18px;
          margin-top: 20px;
          margin-bottom: 10px;
        }

        .icon-label {
          display: flex;
          align-items: center;
          font-weight: 500;
        }

        .icon-label img {
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }

        .desc-text {
          margin-top: 30px;
          font-size: 16px;
          line-height: 1.6;
          text-align: justify;
        }
      </style>
    </head>
    <body>
      <div class="container container-box">
        <h1>${project.name}</h1>

        <div class="row">
          <div class="col-md-8">
            <img src="${project.img}" class="project-img" alt="${project.name}">
          </div>
          <div class="col-md-4">
            <div class="mb-4">
              <div class="section-title">Duration</div>
              <div class="icon-label mb-2">
                <img src="https://cdn-icons-png.flaticon.com/512/747/747310.png" alt="calendar" />
                <span>${project.start} - ${project.end}</span>
              </div>
              <div class="icon-label">
                <img src="https://cdn-icons-png.flaticon.com/512/2088/2088617.png" alt="clock" />
                <span>${project.duration}</span>
              </div>
            </div>

            <div class="mb-3">
              <div class="section-title">Technologies</div>
              <div class="row">
                ${techGrid}
              </div>
            </div>
          </div>
        </div>

        <div class="desc-text">
          ${project.desc}
        </div>
      </div>
    </body>
    </html>
  `);
  newWindow.document.close();
}

// ⏯️ Jalankan saat halaman dibuka
document.addEventListener("DOMContentLoaded", loadProjects);
