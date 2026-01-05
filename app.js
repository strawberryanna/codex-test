const STORAGE_KEY = "planner-2026";

const state = {
  vision: "",
  theme: "",
  metric: "",
  notes: "",
  quarterlies: [],
  months: [],
  milestones: [],
  habits: [],
};

const elements = {
  vision: document.getElementById("vision"),
  theme: document.getElementById("theme"),
  metric: document.getElementById("metric"),
  notes: document.getElementById("notes"),
  quarterlyList: document.getElementById("quarterly-list"),
  monthlyList: document.getElementById("monthly-list"),
  milestoneList: document.getElementById("milestone-list"),
  habitList: document.getElementById("habit-list"),
  reset: document.getElementById("reset-plan"),
  export: document.getElementById("export-plan"),
};

const gridTemplate = document.getElementById("grid-item-template");
const listTemplate = document.getElementById("list-item-template");

const defaultData = {
  vision: "Build a year of intentional growth and joyful progress.",
  theme: "Momentum",
  metric: "Celebrate 12 monthly wins",
  notes: "",
  quarterlies: [
    { title: "Q1: Reset", details: "Audit commitments and define top priorities." },
    { title: "Q2: Build", details: "Ship the core project milestones." },
    { title: "Q3: Expand", details: "Grow reach with marketing and partnerships." },
    { title: "Q4: Reflect", details: "Close loops and prepare for 2027." },
  ],
  months: [
    { title: "January", details: "Clarify goals and schedule key checkpoints." },
    { title: "February", details: "Set up systems to stay consistent." },
    { title: "March", details: "Celebrate the first quarter wins." },
  ],
  milestones: [
    { title: "March 15", details: "Quarterly review and reset." },
    { title: "June 30", details: "Mid-year launch showcase." },
  ],
  habits: [
    { title: "Weekly planning", details: "Every Sunday evening" },
    { title: "Monthly review", details: "First Friday of each month" },
  ],
};

const saveState = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    Object.assign(state, structuredClone(defaultData));
    return;
  }
  try {
    Object.assign(state, JSON.parse(raw));
  } catch (error) {
    Object.assign(state, structuredClone(defaultData));
  }
};

const bindTextInput = (element, key) => {
  element.addEventListener("input", () => {
    state[key] = element.value;
    saveState();
  });
};

const renderGridItems = (list, target, type) => {
  target.innerHTML = "";
  list.forEach((item, index) => {
    const node = gridTemplate.content.cloneNode(true);
    const title = node.querySelector(".title");
    const details = node.querySelector(".details");
    const remove = node.querySelector(".remove");

    title.value = item.title;
    details.value = item.details;

    title.addEventListener("input", () => {
      state[type][index].title = title.value;
      saveState();
    });
    details.addEventListener("input", () => {
      state[type][index].details = details.value;
      saveState();
    });
    remove.addEventListener("click", () => {
      state[type].splice(index, 1);
      renderAll();
      saveState();
    });

    target.appendChild(node);
  });
};

const renderListItems = (list, target, type) => {
  target.innerHTML = "";
  list.forEach((item, index) => {
    const node = listTemplate.content.cloneNode(true);
    const title = node.querySelector(".title");
    const details = node.querySelector(".details");
    const remove = node.querySelector(".remove");

    title.value = item.title;
    details.value = item.details;

    title.addEventListener("input", () => {
      state[type][index].title = title.value;
      saveState();
    });
    details.addEventListener("input", () => {
      state[type][index].details = details.value;
      saveState();
    });
    remove.addEventListener("click", () => {
      state[type].splice(index, 1);
      renderAll();
      saveState();
    });

    target.appendChild(node);
  });
};

const addItem = (type) => {
  state[type].push({ title: "", details: "" });
  renderAll();
  saveState();
};

const renderAll = () => {
  elements.vision.value = state.vision;
  elements.theme.value = state.theme;
  elements.metric.value = state.metric;
  elements.notes.value = state.notes;

  renderGridItems(state.quarterlies, elements.quarterlyList, "quarterlies");
  renderGridItems(state.months, elements.monthlyList, "months");
  renderListItems(state.milestones, elements.milestoneList, "milestones");
  renderListItems(state.habits, elements.habitList, "habits");
};

const init = () => {
  loadState();
  bindTextInput(elements.vision, "vision");
  bindTextInput(elements.theme, "theme");
  bindTextInput(elements.metric, "metric");
  bindTextInput(elements.notes, "notes");

  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.add;
      if (type === "quarter") {
        addItem("quarterlies");
      }
      if (type === "month") {
        addItem("months");
      }
      if (type === "milestone") {
        addItem("milestones");
      }
      if (type === "habit") {
        addItem("habits");
      }
    });
  });

  elements.reset.addEventListener("click", () => {
    Object.assign(state, structuredClone(defaultData));
    renderAll();
    saveState();
  });

  elements.export.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "2026-plan.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });

  renderAll();
};

init();
