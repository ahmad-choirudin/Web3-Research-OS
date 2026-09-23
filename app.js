const defaultState = {
    protocols: [
        {
            name: "Monad",
            category: "L1",
            status: "Researching",
            priority: "High",
            notes: "Watch ecosystem projects and testnet activity."
        },
        {
            name: "Berachain",
            category: "L1",
            status: "Active",
            priority: "Medium",
            notes: "Check ecosystem incentives and new protocols."
        }
    ],

    wallets: [
        {
            name: "Main Wallet",
            network: "Ethereum",
            address: "0x1234...5678",
            purpose: "Main"
        },
        {
            name: "Airdrop Wallet",
            network: "EVM",
            address: "0xabcd...9012",
            purpose: "Airdrops"
        }
    ],

    yields: [
        {
            asset: "SOL",
            protocol: "Jito",
            amount: 10,
            apy: "7.2%",
            value: 1420
        }
    ],

    tasks: [
        {
            id: 1,
            text: "Check new testnet opportunities",
            completed: false
        },
        {
            id: 2,
            text: "Review protocol updates",
            completed: true
        }
    ],

    notes: [
        {
            id: 1,
            title: "Monad",
            content: "Track testnet activity, ecosystem launches and possible incentives.",
            date: "Today"
        },
        {
            id: 2,
            title: "Berachain",
            content: "Review new applications and potential ecosystem opportunities.",
            date: "Today"
        }
    ]
};


let state = JSON.parse(
    localStorage.getItem("web3_research_os")
) || defaultState;

let activeTab = "dashboard";


const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const pageTitle = document.getElementById("page-title");

const addItemBtn = document.getElementById("add-item-btn");

const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body-content");


function saveState() {
    localStorage.setItem(
        "web3_research_os",
        JSON.stringify(state)
    );
}


function showView(tab) {
    activeTab = tab;

    navItems.forEach(item => {
        item.classList.toggle(
            "active",
            item.dataset.tab === tab
        );
    });

    views.forEach(view => {
        view.classList.remove("active");
    });

    const selectedView = document.getElementById(`view-${tab}`);

    if (selectedView) {
        selectedView.classList.add("active");
    }

    const titles = {
        dashboard: "Dashboard",
        protocols: "Protocols",
        wallets: "Wallets",
        yield: "Yield & Staking",
        notes: "Alpha Notes"
    };

    pageTitle.textContent = titles[tab] || "Dashboard";
}


navItems.forEach(item => {
    item.addEventListener("click", () => {
        showView(item.dataset.tab);
    });
});


function updateStats() {
    const protocolCount = state.protocols.length;

    const highPriorityCount = state.protocols.filter(
        protocol => protocol.priority.toLowerCase() === "high"
    ).length;

    const walletCount = state.wallets.length;

    const capital = state.yields.reduce(
        (total, item) => total + Number(item.value || 0),
        0
    );

    document.getElementById("stat-protocols").textContent =
        protocolCount;

    document.getElementById("stat-airdrops").textContent =
        highPriorityCount;

    document.getElementById("stat-wallets").textContent =
        walletCount;

    document.getElementById("stat-capital").textContent =
        `$${capital.toLocaleString("en-US")}`;
}


function renderDashboard() {
    const taskList = document.getElementById("task-list");
    const priorityTable = document.getElementById("priority-table");

    taskList.innerHTML = "";

    if (state.tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                No tasks yet.
            </div>
        `;
    }

    state.tasks.forEach(task => {
        const item = document.createElement("div");

        item.className = `task-item ${
            task.completed ? "completed" : ""
        }`;

        item.innerHTML = `
            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >

            <span>${task.text}</span>

            <button
                class="task-delete"
                onclick="deleteTask(${task.id})"
            >
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        taskList.appendChild(item);
    });


    priorityTable.innerHTML = "";

    const priorityProtocols = state.protocols.filter(
        protocol => protocol.priority.toLowerCase() === "high"
    );

    if (priorityProtocols.length === 0) {
        priorityTable.innerHTML = `
            <tr>
                <td colspan="3" class="empty-state">
                    No high priority protocols.
                </td>
            </tr>
        `;
    }

    priorityProtocols.forEach(protocol => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <span class="protocol-name">
                    ${protocol.name}
                </span>
            </td>

            <td>
                <span class="badge badge-blue">
                    ${protocol.status}
                </span>
            </td>

            <td>
                <span class="badge badge-red">
                    ${protocol.priority}
                </span>
            </td>
        `;

        priorityTable.appendChild(row);
    });

    updateStats();
}


function renderProtocols() {
    const table = document.getElementById("protocol-table");
    const searchInput = document.getElementById("protocol-search");
    const filterInput = document.getElementById("protocol-filter");

    const search = searchInput.value.toLowerCase();
    const filter = filterInput.value.toLowerCase();

    const filteredProtocols = state.protocols.filter(protocol => {
        const matchesSearch =
            protocol.name.toLowerCase().includes(search) ||
            protocol.category.toLowerCase().includes(search);

        const matchesFilter =
            filter === "all" ||
            protocol.status.toLowerCase() === filter;

        return matchesSearch && matchesFilter;
    });

    table.innerHTML = "";

    if (filteredProtocols.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    No protocols found.
                </td>
            </tr>
        `;

        return;
    }

    filteredProtocols.forEach(protocol => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <span class="protocol-name">
                    ${protocol.name}
                </span>
            </td>

            <td>${protocol.category}</td>

            <td>
                <span class="badge badge-blue">
                    ${protocol.status}
                </span>
            </td>

            <td>
                <span class="badge ${
                    protocol.priority.toLowerCase() === "high"
                        ? "badge-red"
                        : "badge-orange"
                }">
                    ${protocol.priority}
                </span>
            </td>

            <td>${protocol.notes}</td>
        `;

        table.appendChild(row);
    });
}


document
    .getElementById("protocol-search")
    .addEventListener("input", renderProtocols);

document
    .getElementById("protocol-filter")
    .addEventListener("change", renderProtocols);


function renderWallets() {
    const table = document.getElementById("wallet-table");

    table.innerHTML = "";

    if (state.wallets.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    No wallets added.
                </td>
            </tr>
        `;

        return;
    }

    state.wallets.forEach(wallet => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="protocol-name">
                ${wallet.name}
            </td>

            <td>${wallet.network}</td>

            <td class="wallet-address">
                ${wallet.address}
            </td>

            <td>
                <span class="badge badge-purple">
                    ${wallet.purpose}
                </span>
            </td>
        `;

        table.appendChild(row);
    });
}


function renderYields() {
    const table = document.getElementById("yield-table");

    table.innerHTML = "";

    if (state.yields.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    No yield positions.
                </td>
            </tr>
        `;

        return;
    }

    state.yields.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="protocol-name">
                ${item.asset}
            </td>

            <td>${item.protocol}</td>

            <td>
                ${Number(item.amount).toLocaleString()}
            </td>

            <td>
                <span class="badge badge-green">
                    ${item.apy}
                </span>
            </td>

            <td>
                $${Number(item.value).toLocaleString("en-US")}
            </td>
        `;

        table.appendChild(row);
    });
}


function renderNotes() {
    const notesGrid = document.getElementById("notes-grid");

    notesGrid.innerHTML = "";

    if (state.notes.length === 0) {
        notesGrid.innerHTML = `
            <div class="empty-state">
                No notes yet.
            </div>
        `;

        return;
    }

    state.notes.forEach(note => {
        const card = document.createElement("article");

        card.className = "note-card";

        card.innerHTML = `
            <h3>${note.title}</h3>

            <p>${note.content}</p>

            <div class="note-meta">
                ${note.date}
            </div>

            <button
                class="note-delete"
                onclick="deleteNote(${note.id})"
            >
                Delete
            </button>
        `;

        notesGrid.appendChild(card);
    });
}


function renderAll() {
    renderDashboard();
    renderProtocols();
    renderWallets();
    renderYields();
    renderNotes();
}


function toggleTask(id) {
    const task = state.tasks.find(item => item.id === id);

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    saveState();
    renderDashboard();
}


function deleteTask(id) {
    state.tasks = state.tasks.filter(
        task => task.id !== id
    );

    saveState();
    renderDashboard();
}


const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");


function addTask() {
    const text = taskInput.value.trim();

    if (!text) {
        return;
    }

    state.tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    taskInput.value = "";

    saveState();
    renderDashboard();
}


addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});


function openModal() {
    modalOverlay.classList.add("active");

    if (activeTab === "protocols") {
        showProtocolForm();
        return;
    }

    if (activeTab === "wallets") {
        showWalletForm();
        return;
    }

    if (activeTab === "notes") {
        showNoteForm();
        return;
    }

    showProtocolForm();
}


function closeModal() {
    modalOverlay.classList.remove("active");
    modalBody.innerHTML = "";
}


function showProtocolForm() {
    modalTitle.textContent = "Add Protocol";

    modalBody.innerHTML = `
        <form class="modal-form" id="protocol-form">

            <div class="form-group">
                <label>Protocol Name</label>
                <input
                    type="text"
                    id="protocol-name"
                    placeholder="e.g. Monad"
                    required
                >
            </div>

            <div class="form-group">
                <label>Category</label>
                <input
                    type="text"
                    id="protocol-category"
                    placeholder="e.g. L1"
                    required
                >
            </div>

            <div class="form-group">
                <label>Status</label>
                <select id="protocol-status">
                    <option value="Researching">Researching</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            <div class="form-group">
                <label>Priority</label>
                <select id="protocol-priority">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>

            <div class="form-group">
                <label>Notes</label>
                <textarea
                    id="protocol-notes"
                    placeholder="Research notes..."
                ></textarea>
            </div>

            <button class="btn btn-primary modal-submit" type="submit">
                Add Protocol
            </button>

        </form>
    `;

    document
        .getElementById("protocol-form")
        .addEventListener("submit", saveProtocol);
}


function saveProtocol(event) {
    event.preventDefault();

    const protocol = {
        name: document.getElementById("protocol-name").value.trim(),
        category: document.getElementById("protocol-category").value.trim(),
        status: document.getElementById("protocol-status").value,
        priority: document.getElementById("protocol-priority").value,
        notes: document.getElementById("protocol-notes").value.trim()
    };

    if (!protocol.name || !protocol.category) {
        return;
    }

    state.protocols.push(protocol);

    saveState();
    renderAll();
    closeModal();
}


function showWalletForm() {
    modalTitle.textContent = "Add Wallet";

    modalBody.innerHTML = `
        <form class="modal-form" id="wallet-form">

            <div class="form-group">
                <label>Wallet Name</label>
                <input
                    type="text"
                    id="wallet-name"
                    placeholder="Main Wallet"
                    required
                >
            </div>

            <div class="form-group">
                <label>Network</label>
                <input
                    type="text"
                    id="wallet-network"
                    placeholder="Ethereum"
                    required
                >
            </div>

            <div class="form-group">
                <label>Address</label>
                <input
                    type="text"
                    id="wallet-address"
                    placeholder="0x..."
                    required
                >
            </div>

            <div class="form-group">
                <label>Purpose</label>
                <select id="wallet-purpose">
                    <option value="Main">Main</option>
                    <option value="Airdrops">Airdrops</option>
                    <option value="Trading">Trading</option>
                    <option value="Testing">Testing</option>
                </select>
            </div>

            <button class="btn btn-primary modal-submit" type="submit">
                Add Wallet
            </button>

        </form>
    `;

    document
        .getElementById("wallet-form")
        .addEventListener("submit", saveWallet);
}


function saveWallet(event) {
    event.preventDefault();

    const wallet = {
        name: document.getElementById("wallet-name").value.trim(),
        network: document.getElementById("wallet-network").value.trim(),
        address: document.getElementById("wallet-address").value.trim(),
        purpose: document.getElementById("wallet-purpose").value
    };

    if (!wallet.name || !wallet.network || !wallet.address) {
        return;
    }

    state.wallets.push(wallet);

    saveState();
    renderAll();
    closeModal();
}


function showNoteForm() {
    modalTitle.textContent = "Add Note";

    modalBody.innerHTML = `
        <form class="modal-form" id="note-form">

            <div class="form-group">
                <label>Title</label>
                <input
                    type="text"
                    id="note-title"
                    placeholder="Research title"
                    required
                >
            </div>

            <div class="form-group">
                <label>Note</label>
                <textarea
                    id="note-content"
                    placeholder="Write your research..."
                    required
                ></textarea>
            </div>

            <button class="btn btn-primary modal-submit" type="submit">
                Save Note
            </button>

        </form>
    `;

    document
        .getElementById("note-form")
        .addEventListener("submit", saveNote);
}


function saveNote(event) {
    event.preventDefault();

    const title = document
        .getElementById("note-title")
        .value
        .trim();

    const content = document
        .getElementById("note-content")
        .value
        .trim();

    if (!title || !content) {
        return;
    }

    state.notes.push({
        id: Date.now(),
        title,
        content,
        date: new Date().toLocaleDateString("id-ID")
    });

    saveState();
    renderAll();
    closeModal();
}


function deleteNote(id) {
    state.notes = state.notes.filter(
        note => note.id !== id
    );

    saveState();
    renderNotes();
}


addItemBtn.addEventListener("click", openModal);

modalClose.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", event => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});


renderAll();
showView("dashboard");
