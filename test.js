// =============================
// App State
// =============================
let tasks = [];
let editcard = null;
let activecard = null;
let activeColumn = null;
let box = null;
let collapsebtn = {};
let deletetask = null;
let lastdeletedtask = null;
let undoTimer = null;

// =============================
// Initialize After DOM Load
// =============================

document.addEventListener("DOMContentLoaded", () => {

  const input = document.querySelector("#column1");
  const description = document.querySelector("#column2");
  const columnbox = document.querySelector(".columnbox");
  const addbtns = document.querySelectorAll(".add-btn");
  const addConfirmBtn = document.querySelector("#columnbtn2");
  const cancelBtn = document.querySelector("#columnbtn1");
  const menuBtn = document.querySelector("#btn");
  const menu = document.querySelector(".menu");
  const themeBtn = document.querySelector("#them");
  
  const searchInput = document.querySelector("#search");
  const searchbtn = document.querySelector("#searchbtn");

  const sortbtn = document.querySelector(".sort-btn");
  const sortmenu = document.querySelector(".sort-menu");

  const yes = document.querySelector(".yes");
  const no = document.querySelector(".no");
  const boxd = document.querySelector(".boxd");
  const undobox = document.querySelector(".undo-box");
  const undobtn = document.querySelector(".undo-btn");

  // -----------------------------
  // Load and Save Tasks
  // -----------------------------
  function loadTasks() {
    const saved = localStorage.getItem("tasks");

    if (!saved) {
      tasks = [];
      return;
    }

  try{

    const data = JSON.parse(saved);
    tasks = Array.isArray(data) ? data : [];

  }catch(error){
      console.error("Invalid tasks data in localStorage:", error.message);
      tasks = [];
  }
}

    function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  
  }

  // -----------------------------
  // Build Card UI
  // -----------------------------

  function createCardElement(task) {
    if (!task) return document.createElement("div");
/* Destructure task data */

  const {title, description, id, columnId} = task;

    const div = document.createElement("div");
    div.classList.add("card");
    div.dataset.id = id;
    div.draggable = true;
    div.innerHTML = `
      <button class="dropdownbtn"  data-action="dropdown">⋮</button>
      <h4>${title}</h4>
      <p>${description}</p>
      <div class="statusBaar">
        <button class="status-btn"  data-action="status"  data-column="box1">Backlogs</button>
        <button class="status-btn"  data-action="status"  data-column="box2">Todo</button>
        <button class="status-btn"  data-action="status"  data-column="box3">In progress</button>
        <button class="status-btn"  data-action="status"  data-column="box4">Done</button>
        <button class="edit-btn"    data-action="edit">✏️ Edit </button>
        <button class="delete-btn"  data-action="delete">🗑️ Delete </button>
      </div>
`

/*******************************************
// TODO : Drag ============================
// - Complete drag-and-drop logic.
//  -Remaining:
// - Insert card between other cards
// - Smooth drag animation
// - Improve drop position detection
// - Update localStorage after final drop
*******************************************/

    div.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", id);
    });

    // dropdown toggle (status menu)
    const dropdownbtn = div.querySelector(".dropdownbtn");
    const statusBaar = div.querySelector(".statusBaar");

    dropdownbtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasOpen = statusBaar.classList.contains("active");
      document.querySelectorAll(".statusBaar").forEach(m => {
        m.classList.remove("active");
      });
      if (!wasOpen) {
        statusBaar.classList.add("active");
      }
    });
    return div;

  }

function dropzoone() {
document.querySelectorAll(".box").forEach(box => {
box.addEventListener("dragover", (e) => {
e.preventDefault();

})

box.addEventListener("drop", (e) =>{
e.preventDefault();
const id = Number(e.dataTransfer.getData("text/plain"));
const task = tasks.find(t => t.id === id);
const columnid = box.closest(".column").id;
task.columnId = columnid;
saveTasks();
renderboard();

})
})
}

/***************************
 *Delete Undo delete panel 
***************************/

  if (no) {
    no.addEventListener("click", () => {
      boxd.classList.remove("active");
    });
  }

//Delete confirmation */

  if (yes) {
    yes.addEventListener("click", () => {
      if (deletetask) {
        lastdeletedtask = deletetask;
        tasks = tasks.filter(t => t.id !== deletetask.id);
        deletetask = null;
        saveTasks();
        renderboard();
        boxd.classList.remove("active");
        if (undobox) undobox.classList.add("active");

/* Undo panel timeout */

      undoTimer = setTimeout(() => {
      undobox.classList.remove("active");
      lastdeletedtask = null;
      }, 3000);  
}

    });
  }

/* Restore deleted card */

  if (undobtn) {
    undobtn.addEventListener("click", () => {
      clearTimeout(undoTimer);
      if (lastdeletedtask) {
        tasks.push(lastdeletedtask);
        lastdeletedtask = null;
        saveTasks();
        renderboard();

      }
      if (undobox) undobox.classList.remove("active");
    });
  }

  // -----------------------------
  // Board Rendering
  // -----------------------------
  function updateCounts() {
    document.querySelectorAll(".column").forEach(column => {
      const cardCount = column.querySelectorAll(".card").length;
      const badge = column.querySelector(".count-badge");
      if (badge) {
        badge.textContent = cardCount;
      }
    });
  }

  // -----------------------------
  // Column Collapse Handling
  // -----------------------------

  function syncCollapseIcon(button, box) {
    const icon = button.querySelector(".collapse-icon");
    if (!icon) return;

    if (box.classList.contains("active")) {
      icon.classList.remove("ti-arrows-minimize");
      icon.classList.add("ti-arrows-maximize");
    } else {
      icon.classList.remove("ti-arrows-maximize");
      icon.classList.add("ti-arrows-minimize");
    }
  }

  function collapse() {
    document.querySelectorAll(".collapse-btn").forEach(button => {
      button.addEventListener("click", (e) => {
  
        const column = button.closest(".column");
        const box = column.querySelector(".box");
        box.classList.toggle("active");
        column.classList.toggle("collapsed");
        
        syncCollapseIcon(button, box);
        collapsebtn[column.id] = box.classList.contains("active");
        
        /* Save collapse state */
        try{
          localStorage.setItem("collapsebtn", JSON.stringify(collapsebtn));
        }catch(error){
          console.error("Error saving collapse state to localStorage:", error.message);
          collapsebtn = {};
        }

      });
    });
  }

  // -----------------------------
  // Sorting Logic
  // -----------------------------

  function sort() {
    const sortmenu = document.querySelector(".sort-menu");
    if (!sortmenu) return;

    sortmenu.addEventListener("click", (e) => {
      const type = e.target.dataset.sort;
      if (!type) return;

      if (type === "newest") {
        tasks.sort((a, b) => b.id - a.id);

      } else if (type === "oldest") {
        tasks.sort((a, b) => a.id - b.id);

      } else if (type === "az") {
        tasks.sort((a, b) => a.title.localeCompare(b.title));

      } else if (type === "za") {
        tasks.sort((a, b) => b.title.localeCompare(a.title));
      }

      renderboard();
    });
  }

// -----------------------------
// Render Tasks to the Screen
// -----------------------------

  function renderboard() {
    document.querySelectorAll(".box").forEach(b => {
      b.innerHTML = "";
    });

    tasks = tasks.filter(t => t && t.id);
    saveTasks();

    tasks.forEach(task => {
      const div = createCardElement(task);
      const targetBox = document.querySelector(`#${task.columnId} .box`);
      if (targetBox) {
        targetBox.appendChild(div);
      }
    });
    /* Empty state rendering */

    document.querySelectorAll(".column").forEach(column => {
      const box = column.querySelector(".box");
      const card = column.querySelectorAll(".card").length;
      if (card === 0) {
        const empty = document.createElement("div");
        empty.textContent = "📭 No tasks yet";
        empty.classList.add("empty-state");
        box.appendChild(empty);
      }
    });

    updateCounts();
  }

// -----------------------------
// Drag and Drop Behavior
// -----------------------------



  // -----------------------------
  // Add and Edit Modal Flow
  // -----------------------------

  addbtns.forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const columnId = e.target.dataset.column;
      activeColumn = document.getElementById(columnId);
      box = activeColumn.querySelector(".box");
      columnbox.classList.add("active");
    });
  });

// Shortcut: Ctrl + O opens the add popup

document.addEventListener("keydown", (e) => {
  if(e.ctrlKey && e.key === "o"){
    e.preventDefault();

/* Open the add popup with Ctrl + O */
    activeColumn = document.getElementById("ox1");
    box = activeColumn.querySelector(".box");

    columnbox.classList.add("active");
  }
});

  if (addConfirmBtn) {
    addConfirmBtn.addEventListener("click", () => {
      submitCard();
    });
  }

  // Enter submits the current card

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitCard();
        updateCounts();
      }
    });
  }

// Ctrl + Enter submits from the description field

  if (description) {
    description.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        submitCard();
      }
    });
  }

  function submitCard() {
    if (input.value === "" || description.value === "") {
      return;
    }

    if (editcard) {

/* Duplicate title check */
    const isDuplicate = tasks.some(t => t.title.trim().toLowerCase() === input.value.trim().toLowerCase())
    if(isDuplicate ){
     console.warn("A task with this title already exists!");
     return
    }

      editcard.title = input.value;
      editcard.description = description.value;

      if (activecard) {
        activecard.querySelector("h4").textContent = input.value;
        activecard.querySelector("p").textContent = description.value;
      }

      saveTasks();
      editcard = null;
      activecard = null;

    } else {

/* Create the new card object */

      const newCard = {
        id: Date.now(),
        title: input.value,
        description: description.value,
        columnId: activeColumn.id,
        completed: false,
      };
      
      tasks.push(newCard);
      saveTasks();
      renderboard();
    }

    input.value = "";
    description.value = "";
    columnbox.classList.remove("active");
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      columnbox.classList.remove("active");
      editcard = null;
      activecard = null;
      input.value = "";
      description.value = "";
    });
  }

  // -----------------------------
  // Menu and Theme Controls
  // -----------------------------
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("active");
    });
  }

  // Theme toggle
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isdark = document.body.classList.toggle("dark");
      themeBtn.textContent = isdark ? "☀️" : "🌙";
      localStorage.setItem("theme", isdark ? "dark" : "light");
    });
  }

  // Generic toggle helper
  function toggle(targetbtn, targetmenu, activeClass = "active") {
    if (!targetbtn || !targetmenu) return;
    targetbtn.addEventListener("click", (e) => {
      e.stopPropagation();
      targetmenu.classList.toggle("active");
    });
    targetmenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    document.addEventListener("click", (e) => {
      targetmenu.classList.remove("active");
    });
  }

  toggle(searchbtn, searchInput);
  toggle(sortbtn, sortmenu);
  toggle(menuBtn, menu);


  // Close open dropdowns and side menu
  document.addEventListener("click", () => {
    if (menu) menu.classList.remove("active");
    document.querySelectorAll(".statusBaar").forEach(s => {
      s.classList.remove("active");
    });
  });

  // Close popup when clicking outside
  document.addEventListener("click", (e) => {
    if (
      columnbox &&
      !columnbox.contains(e.target) &&
      !e.target.closest(".add-btn") &&
      !e.target.closest(".edit-btn")
    ) {
      columnbox.classList.remove("active");
    }
  });

  // -----------------------------
  // Initialize App State
  // -----------------------------
  loadTasks();
  if (themeBtn) {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
      themeBtn.textContent = "☀️";
    } else {
      themeBtn.textContent = "🌙";
    }
  }

  collapsebtn = JSON.parse(localStorage.getItem("collapsebtn")) || {};
  document.querySelectorAll(".column").forEach(column => {
    const box = column.querySelector(".box");
    const button = column.querySelector(".collapse-btn");
    if (collapsebtn[column.id]) {
      box.classList.add("active");
    } else {
      box.classList.remove("active");
    }
    syncCollapseIcon(button, box);
  });

  renderboard();
  dropzoone();
  updateCounts();
  collapse();
  search();
  sort();

  // -----------------------------
  // Card Action Delegation
  // -----------------------------

   document.querySelector(".section").addEventListener("click", (e) => {

    const button = e.target.closest("button");
    if (!button) return;

    const action = button.dataset.action;
    if (!action) return;

    console.log(action);

    if (action === "delete") {
    const card = button.closest(".card");
    const id = Number(card.dataset.id);
    const task = tasks.find(t => t.id === id);

    deletetask = task;
    boxd.classList.add("active");
}

/* Edit action via delegation */

    if(action === "edit"){
    
    const card = button.closest(".card");
    const id = Number(card.dataset.id);
    const task = tasks.find(t => t.id === id);

    input.value = task.title;
    description.value = task.description;

    columnbox.classList.add("active");
    editcard = task;
    activecard = card;
  
}
// Change card column from status action

    if(action === "status"){

    const card = button.closest(".card");
    const columnid = button.dataset.column
    const id = Number(card.dataset.id);
    const task = tasks.find(t => t.id === id);
    task.columnId = columnid;

    saveTasks();
    renderboard();
}

    }
);
});

// -----------------------------
// Search Cards
// -----------------------------

function search() {
  const searchInput = document.querySelector("#search");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const text = searchInput.value.trim().toLowerCase();
    const card = document.querySelectorAll(".card");

    card.forEach(card => {
      const title = card.querySelector("h4").textContent.toLowerCase();
      const description = card.querySelector("p").textContent.toLowerCase();

      if (title.includes(text) || description.includes(text)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
}


