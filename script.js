let habbos = [];
let habboIdCounter = 1;

const panel = document.getElementById("panel");
const addHabboBtn = document.getElementById("addHabbo");
const beepSound = new Audio('kim_possible.mp3');

function createHabbo(name = `Usuario ${habboIdCounter}`) {
  const habbo = {
    id: habboIdCounter++,
    name,
    rank: 'Oficinista',
    minutes: 30,
    seconds: 0,
    interval: null,
    startTime: null,
    endTime: null,
  };

  habbos.push(habbo);
  renderHabbo(habbo);
}

function renderHabbo(h) {
  const box = document.createElement("div");
  box.className = "habbo-box";
  box.id = `habbo-${h.id}`;

  const nameInput = document.createElement("input");
  nameInput.className = "editable";
  nameInput.value = h.name;
  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      h.name = nameInput.value;
      nameInput.blur();
    }
  });

  const rankSelector = document.createElement("select");
  rankSelector.className = "rank-selector";
  const ranks = ['Oficinista', 'Oficinista C', 'Oficinista B', 'Oficinista A', 'Finalizado'];
  
  ranks.forEach((rank) => {
    if (rank !== 'Finalizado') {  // No agregamos 'Finalizado' al select
      const option = document.createElement("option");
      option.value = rank;
      option.textContent = rank;
      rankSelector.appendChild(option);
    }
  });

  rankSelector.value = h.rank;

  rankSelector.addEventListener("change", (e) => {
    if (h.rank !== 'Finalizado') {
      h.rank = e.target.value;
      updateRank(h, box, rankSelector); 
    }
  });

  const timer = document.createElement("div");
  timer.className = "timer";
  timer.id = `timer-${h.id}`;
  updateTimerDisplay(h, timer);

  const controls = document.createElement("div");
  controls.className = "controls";

  const startBtn = document.createElement("button");
  startBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  startBtn.addEventListener("click", () => {
    if (!h.interval) {
      if (!h.startTime) {
        const currentTime = new Date();
        h.startTime = currentTime.toLocaleTimeString();
        box.querySelector(".start-time").textContent = `Hora inicio: ${h.startTime}`;
        box.querySelector(".start-time").style.display = "inline"; 
      }

      h.interval = setInterval(() => {
        if (h.minutes === 0 && h.seconds === 0) {
          clearInterval(h.interval);
          h.interval = null;
          const currentEndTime = new Date();
          h.endTime = currentEndTime.toLocaleTimeString();
          box.querySelector(".end-time").textContent = `Hora finalizada: ${h.endTime}`;
          box.querySelector(".end-time").style.display = "inline"; 
          
          switchRank(h);
          
          const existingMission = box.querySelector(".mission");
          if (existingMission) {
            existingMission.remove();
          }

          const missionDisplay = document.createElement("div");
          missionDisplay.className = "mission";
          if (h.rank === 'Finalizado') {
            missionDisplay.textContent = 'Finalizado';
          } else {
            missionDisplay.textContent = `Misión: [FBI] ${h.rank} -HKG`;
          }
          box.appendChild(missionDisplay); 

          beepSound.play();
          
          box.classList.add("blink");

          setTimeout(() => {
            box.classList.remove("blink");
          }, 10000);

          return;
        }

        if (h.seconds === 0) {
          h.minutes--;
          h.seconds = 59;
        } else {
          h.seconds--;
        }

        updateTimerDisplay(h, timer);
      }, 1000);
    }
  });

  const pauseBtn = document.createElement("button");
  pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  pauseBtn.addEventListener("click", () => {
    clearInterval(h.interval);
    h.interval = null;
  });

  const resetBtn = document.createElement("button");
  resetBtn.innerHTML = '<i class="fa-solid fa-arrow-rotate-left"></i>';
  resetBtn.addEventListener("click", () => {
    clearInterval(h.interval);
    h.interval = null;
    h.minutes = 30;
    h.seconds = 0;
    h.startTime = null;
    h.endTime = null;
    box.querySelector(".start-time").textContent = "Hora inicio: ";
    box.querySelector(".end-time").textContent = "Hora finalizada: ";
    box.querySelector(".start-time").style.display = "none";  
    box.querySelector(".end-time").style.display = "none"; 
    box.classList.remove("blink");
    updateTimerDisplay(h, timer);

    const existingMission = box.querySelector(".mission");
    if (existingMission) {
      existingMission.remove();
    }

    const missionDisplay = document.createElement("div");
    missionDisplay.className = "mission";
    missionDisplay.textContent = `Misión: [FBI] ${h.rank} -HKG`;
    box.appendChild(missionDisplay); 
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteBtn.addEventListener("click", () => {
    clearInterval(h.interval);
    h.interval = null;
    habbos = habbos.filter((hab) => hab.id !== h.id);
    document.getElementById(`habbo-${h.id}`).remove();
  });

  controls.appendChild(startBtn);
  controls.appendChild(pauseBtn);
  controls.appendChild(resetBtn);
  controls.appendChild(deleteBtn);

  const timeDisplay = document.createElement("div");
  timeDisplay.className = "time-display";
  
  const startTimeDisplay = document.createElement("span");
  startTimeDisplay.className = "start-time";
  startTimeDisplay.textContent = "Hora inicio: ";
  startTimeDisplay.style.display = "none"; 

  const endTimeDisplay = document.createElement("span");
  endTimeDisplay.className = "end-time";
  endTimeDisplay.textContent = "Hora finalizada:";
  endTimeDisplay.style.display = "none"; 

  timeDisplay.appendChild(startTimeDisplay);
  timeDisplay.appendChild(endTimeDisplay);

  box.appendChild(nameInput);
  box.appendChild(rankSelector);
  box.appendChild(timer);
  box.appendChild(timeDisplay);
  box.appendChild(controls);
  panel.appendChild(box);
}

function updateTimerDisplay(habbo, element) {
  element.textContent = `${String(habbo.minutes).padStart(2, "0")}:${String(habbo.seconds).padStart(2, "0")}`;
}

function switchRank(habbo) {
  const ranks = ['Oficinista', 'Oficinista C', 'Oficinista B', 'Oficinista A', 'Finalizado'];
  const currentRankIndex = ranks.indexOf(habbo.rank);
  if (currentRankIndex < ranks.length - 1) {
    habbo.rank = ranks[currentRankIndex + 1];
    updateRank(habbo, document.getElementById(`habbo-${habbo.id}`), document.getElementById(`habbo-${habbo.id}`).querySelector(".rank-selector"));
  }

  if (habbo.rank === 'Finalizado') {
    const habboBox = document.getElementById(`habbo-${habbo.id}`);
    habboBox.style.backgroundColor = 'black';
    const buttons = habboBox.querySelectorAll("button");
    buttons.forEach(btn => {
      if (btn !== habboBox.querySelector("button:last-child")) {
        btn.disabled = true;
      }
    });

    const rankSelector = habboBox.querySelector(".rank-selector");
    rankSelector.disabled = true;
    rankSelector.value = habbo.rank;  
  }
}

function updateRank(habbo, box, rankSelector) {
  const ranks = ['Oficinista', 'Oficinista C', 'Oficinista B', 'Oficinista A', 'Finalizado'];
  const currentRankIndex = ranks.indexOf(habbo.rank);
  rankSelector.value = habbo.rank;

  if (habbo.rank === 'Finalizado') {
    rankSelector.disabled = true;
  } else {
    const optionA = rankSelector.querySelector('option[value="Finalizado"]');
    if (optionA) {
      optionA.disabled = true;
    }
  }
}

addHabboBtn.addEventListener("click", () => {
  createHabbo();
});

window.onload = () => {
  createHabbo("Usuario 1");
};
