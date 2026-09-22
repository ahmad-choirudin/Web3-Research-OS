const projects = [
  {
    name: "Ethereum",
    chain: "Ethereum",
    status: "Researching",
    progress: 30,
    description:
      "Decentralized blockchain platform for smart contracts and dApps."
  },
  {
    name: "Solana",
    chain: "Solana",
    status: "Active",
    progress: 60,
    description:
      "High-performance blockchain designed for scalable applications."
  },
  {
    name: "Base",
    chain: "Base",
    status: "Watching",
    progress: 15,
    description:
      "Ethereum Layer 2 network designed for fast and low-cost transactions."
  }
];

const projectGrid = document.getElementById("projectGrid");

function displayProjects(projectList) {
  projectGrid.innerHTML = "";

  projectList.forEach((project) => {
    const card = document.createElement("div");

    card.className = "project-card";

    card.innerHTML = `
      <div class="project-top">
        <span class="chain">${project.chain}</span>
        <span class="status">${project.status}</span>
      </div>

      <h3>${project.name}</h3>

      <p class="description">
        ${project.description}
      </p>

      <div class="progress-info">
        <span>Research Progress</span>
        <span>${project.progress}%</span>
      </div>

      <div class="progress-bar">
        <div class="progress" style="width: ${project.progress}%"></div>
      </div>

      <button>View Project</button>
    `;

    projectGrid.appendChild(card);
  });
}

displayProjects(projects);
