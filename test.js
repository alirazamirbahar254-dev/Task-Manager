/*==========
   STATE
===========*/
let tasks = [];
let editcard = null;
let activecard = null;
let activeColumn = null;
let box = null;
let collapsebtn = {};
let deletetask = null;
let lastdeletedtask = null;
let undoTimer = null;
let draggedCard = null;

/*==========================================================================
    Run everything after the HTML is fully loaded — safer than assuming
       the script tag is placed after all the elements it needs. 
==========================================================================*/

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

  const summarybtn = document.querySelector(".summary-btn");
  const summaryheader = document.querySelector(".summary-header")
  const summaryclose = document.querySelector(".summary-close");
  const content = document.querySelector(".summary-content");
  const summarybox = document.querySelector(".summary-box");
  
  /* =========================
         LOAD / SAVE
  ========================= */
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

  /*===============================================================
     CARD CREATION (shared by "add new" and "render from storage")
     This is the single place that builds a card's HTML + wires up
     its buttons. Both makecard() and renderboard() call this now,
     instead of duplicating the same markup and listeners twice.

     NOTE: the "yes" / "no" / "undobtn" listeners are NOT attached
     here anymore — they belong to ONE shared modal/toast, so they
     are attached once, outside this function (see below).
  =================================================================*/

  function createCardElement(task) {
    if (!task) return document.createElement("div");
/*=======================================================
       destructure method applaying 
=======================================================*/

  const {title, description, id, columnId} = task;

    const div = document.createElement("div");
    div.classList.add("card");
    div.dataset.id = id;
    
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

/*===================================
 undo box that contain delete task 
====================================*/

  if (no) {
    no.addEventListener("click", () => {
      boxd.classList.remove("active");
    });
  }

/*==========================
 delete task conformation 
==========================*/

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

/*=====================================
how much time undobox will be visebale
======================================*/

      undoTimer = setTimeout(() => {
      undobox.classList.remove("active");
      lastdeletedtask = null;
      }, 3000);  
}

    });
  }

/*=====================================
undo button for backup the delete card 
======================================*/

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

  /*====================================================
  == RENDER BOARD (rebuilds all columns from `tasks`) ==
  ===================================================== */
  function updateCounts() {
    document.querySelectorAll(".column").forEach(column => {
      const cardCount = column.querySelectorAll(".card").length;
      const badge = column.querySelector(".count-badge");
      if (badge) {
        badge.textContent = cardCount;
      }
    });
  }

  /*===========================
      column cards hide show 
  ============================*/

  function collapse() {
    document.querySelectorAll(".collapse-btn").forEach(button => {
      button.addEventListener("click", (e) => {
        const icon = button.querySelector(".collapse-icon");
        const column = button.closest(".column");
        const box = column.querySelector(".box");
        box.classList.toggle("active");

        if (box.classList.contains("active")) {
          icon.classList.replace("ti-arrows-minimize", "ti-arrows-maximize");
        } else {
          icon.classList.replace("ti-arrows-maximize", "ti-arrows-minimize");
        }

        collapsebtn[column.id] = box.classList.contains("active");
        localStorage.setItem("collapsebtn", JSON.stringify(collapsebtn));
      });
    });
  }

  /*====================
     sort to the cards
  ====================*/

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

/*=================================
    rendering of tasks on screen 
==================================*/

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

    /*=============================
         empty state rendering
    =============================*/

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

/*================================================
      drag and drop functionality for cards 
=================================================*/

document.querySelectorAll(".column").forEach(column => {
  column.querySelectorAll(".card").forEach(card => { 
  card.setAttribute("draggable", "true");
  card.addEventListener("dragstart", (e) => {
    draggedCard = card;
  })

document.addEventListener("dragover", (e) => {
  e.preventDefault();
})
})
})

  /* ===============================
     ADD / EDIT CARD popup wiring
  =================================*/

  addbtns.forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const columnId = e.target.dataset.column;
      activeColumn = document.getElementById(columnId);
      box = activeColumn.querySelector(".box");
      columnbox.classList.add("active");
    });
  });

/* evnt listener for ctrl + o to open the add card popup */

document.addEventListener("keydown", (e) => {
  if(e.key === "ctrl" && e.key === "o"){
    e.preventDefault();

/* when ctrl + o is pressed the add card popup will be open */
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

  /*===========================================
      press enter for submit the card 
  ============================================*/

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitCard();
        updateCounts();
      }
    });
  }

/*======================================================================================
   Ctrl + Enter submits from the description field; plain Enter still makes a new line
=======================================================================================*/

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

    /* cheking point for duplicat values */
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
/*============================
 card data in object form
 ===========================*/

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

  /* =========================
     ☰ SIDE MENU TOGGLE
  ========================= */
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("active");
    });
  }

  /* =========================
     🌙 THEME TOGGLE
  ========================= */
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isdark = document.body.classList.toggle("dark");
      themeBtn.textContent = isdark ? "☀️" : "🌙";
      localStorage.setItem("theme", isdark ? "dark" : "light");
    });
  }

  /*============================
    toggle function
   ============================*/
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



  // close all open dropdowns / side menu when clicking anywhere else
  document.addEventListener("click", () => {
    if (menu) menu.classList.remove("active");
    document.querySelectorAll(".statusBaar").forEach(s => {
      s.classList.remove("active");
    });
  });

  // close the add/edit popup when clicking outside it
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

  /* =====================================
     INIT — runs once, in the right order
  ======================================= */

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
    if (collapsebtn[column.id]) {
      box.classList.add("active");
    }
  });

  renderboard();
  updateCounts();
  collapse();
  search();
  sort();

  /*================================
   one lisner for all card button 
  =================================*/

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

/*========================================
 edit button with delegation method 
=========================================*/

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
//============================================================
//  change a card's column when a status option is clickedn //
// ===========================================================

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

/*=================
  searching for cards
===================*/

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

/*=================================================
  if the every  column has tarsk true false value 
==================================================*/










