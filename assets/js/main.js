const projects = [];

      function getData(e) {
        e.preventDefault();

        const name = document.getElementById("projectName").value;
        const start = Date.parse(document.getElementById("startDate").value);
        const end = Date.parse(document.getElementById("endDate").value);
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

        const duration = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30));

        const reader = new FileReader();
        reader.onload = function (event) {
          const newProject = {
            name,
            duration,
            desc,
            techs: { node, react, next, typescript },
            img: event.target.result,
          };
          projects.push(newProject);
          renderCards();
        };

        reader.readAsDataURL(imageFile);
      }

      function renderCards() {
  const container = document.getElementById("flexbox");
  
  container.innerHTML = projects.map((p) => {
    return `
      <div class="col-md-3 project-card">
        <div class="card">
          <img src="${p.img}" class="card-img-top" alt="${p.name}"/>
          <div class="card-body">
            <h5 class="card-title">${p.name} - ${new Date().getFullYear()}</h5>
            <p class="card-text">durasi: ${p.duration} bulan</p>
            <p class="card-text">${p.desc}</p>
            <div>
              ${p.techs.node ? '<img class="tech-icon" src="assets/node.png" />' : ''}
              ${p.techs.react ? '<img class="tech-icon" src="assets/react.png" />' : ''}
              ${p.techs.next ? '<img class="tech-icon" src="assets/next.png" />' : ''}
              ${p.techs.typescript ? '<img class="tech-icon" src="assets/typescript.png" />' : ''}
            </div>
            <div class="buttonmain">
              <button class="btn btn-secondary">Edit</button>
              <button class="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}
        