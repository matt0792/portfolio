const cursor = document.getElementById("cursor");
let bonsaiHeight = 0;

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("paintCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let painting = false;

  function startPosition(e) {
    painting = true;
    draw(e);
  }

  function endPosition() {
    painting = false;
    ctx.beginPath();
  }

  function draw(e) {
    if (!painting) return;

    ctx.lineWidth = 10; 
    ctx.lineCap = "round"; 
    ctx.strokeStyle = "white"; 

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }

  // Event listeners for drawing
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", endPosition);
  canvas.addEventListener("mousemove", draw);
});

document.body.onpointermove = (event) => {
  // rearrangeDots();
  const { clientX, clientY } = event;

  cursor.animate(
    {
      left: `${clientX}px`,
      top: `${clientY}px`,
    },
    { duration: 20, fill: "forwards" }
  );
};

const infoFolder = document.getElementById("info");
const projectsFolder = document.getElementById("projects");
const musicFolder = document.getElementById("music");
const tttApp = document.getElementById("ttt");
const paintApp = document.getElementById("paint");
const bonsaiApp = document.getElementById("bonsaiApp");
const infoWindow = document.getElementById("infoWindow");
const projectsWindow = document.getElementById("projectsWindow");
const musicWindow = document.getElementById("musicWindow");
const tttWindow = document.getElementById("tttWindow");
const bonsaiWindow = document.getElementById("bonsaiWindow");
const timeElement = document.getElementById("time");
const infoClose = document.getElementById("closeInfo");
const projClose = document.getElementById("closeProj");
const musicClose = document.getElementById("closeMusic");
const tttClose = document.getElementById("closeTtt");
const paintClose = document.getElementById("closePaint");
const bonsaiClose = document.getElementById("closeBonsai");

function setTime() {
  setInterval(() => {
    timeElement.textContent = `CURRENT TIME: ${new Date().toLocaleTimeString()}`;
  }, 100);
}
timeElement.textContent = `CURRENT TIME: ${new Date().toLocaleTimeString()}`;
setTime();

infoFolder.addEventListener("click", openInfoWindow);
infoClose.addEventListener("click", openInfoWindow);
projectsFolder.addEventListener("click", openProjectsWindow);
tttApp.addEventListener("click", openTttWindow);
tttClose.addEventListener("click", openTttWindow);
projClose.addEventListener("click", openProjectsWindow);
musicFolder.addEventListener("click", openMusicWindow);
musicClose.addEventListener("click", openMusicWindow);
paintClose.addEventListener("click", openPaintWindow);
paintApp.addEventListener("click", openPaintWindow);
bonsaiApp.addEventListener("click", openBonsaiWindow);
bonsaiClose.addEventListener("click", openBonsaiWindow);

function openInfoWindow() {
  infoWindow.classList.toggle("hidden");
  infoWindow.classList.add("window-open");
}
function openProjectsWindow() {
  projectsWindow.classList.toggle("hidden");
  projectsWindow.classList.add("window-open");
}
function openMusicWindow() {
  musicWindow.classList.toggle("hidden");
  musicWindow.classList.add("window-open");
}
function openTttWindow() {
  tttWindow.classList.toggle("hidden");
  tttWindow.classList.add("window-open");
}
function openBonsaiWindow() {
  bonsaiWindow.classList.toggle("hidden");
  bonsaiWindow.classList.add("window-open");
  if(bonsaiHeight == 0) {
    growBonsai();
  }
}
function openPaintWindow() {
  paintWindow.classList.toggle("hidden");
  const canvas = document.getElementById("paintCanvas");

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}


const windows = document.querySelectorAll(".window");


let highestZIndex = 100;


windows.forEach((win) => {
  const topBar = win.querySelector(".top-bar");

  let isDragging = false;
  let offsetX, offsetY;

  
  topBar.addEventListener("mousedown", (e) => {
    isDragging = true;

    
    win.style.zIndex = ++highestZIndex;

    
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;

    
    win.classList.add("dragging");
  });

  
  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      win.style.left = `${e.clientX - offsetX}px`;
      win.style.top = `${e.clientY - offsetY}px`;
    }
  });

  
  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      win.classList.remove("dragging");
    }
  });

  win.addEventListener("mousedown", () => {
    win.style.zIndex = ++highestZIndex;
  });
});

const TicTac = {
  cPlayer: "X", 
  state: Array(9).fill(null), 
  gameOver: false, 

  
  init() {
    this.cBoard();
    document
      .getElementById("reset")
      .addEventListener("click", () => this.reset());
  },

  cBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    this.state.forEach((_, i) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      board.appendChild(cell);
    });
    board.addEventListener("click", (e) => this.handleClick(e)); 
    this.uMessage(`${this.cPlayer}'s turn`);

    
    if (this.cPlayer === "O") {
      this.computerMove();
    }
  },

  
  handleClick(e) {
    const cell = e.target;
    const i = cell.dataset.index;

    
    if (this.gameOver || !cell.classList.contains("cell") || this.state[i])
      return;

    
    this.makeMove(i);
  },

  
  makeMove(i) {
    this.state[i] = this.cPlayer;
    const cell = document.querySelector(`.cell[data-index="${i}"]`);
    cell.textContent = this.cPlayer;
    cell.classList.add("taken");

    
    const winCombo = this.checkWin();
    if (winCombo) {
      this.highlight(winCombo);
      this.uMessage(`${this.cPlayer} wins!`);
      this.gameOver = true;
    } else if (this.state.every((cell) => cell)) {
      this.uMessage("It's a tie!");
      this.gameOver = true;
    } else {
      
      this.cPlayer = this.cPlayer === "X" ? "O" : "X";
      this.uMessage(`${this.cPlayer}'s turn`);

      
      if (this.cPlayer === "O" && !this.gameOver) {
        this.computerMove();
      }
    }
  },

  
  computerMove() {
    let bestScore = -Infinity; 
    let bestMove;

    
    this.state.forEach((cell, index) => {
      if (cell === null) {
        this.state[index] = "O"; 
        const score = this.minimax(false); 
        this.state[index] = null; 
        if (score > bestScore) {
          bestScore = score;
          bestMove = index;
        }
      }
    });

    
    setTimeout(() => this.makeMove(bestMove), 200); 
  },

  
  minimax(isMaximizing) {
    const winCombo = this.checkWin();

    
    if (winCombo) {
      const winner = this.state[winCombo[0]];
      return winner === "O" ? 10 : -10; 
    }
    if (this.state.every((cell) => cell)) return 0; 

    
    let bestScore = isMaximizing ? -Infinity : Infinity;

    this.state.forEach((cell, index) => {
      if (cell === null) {
        this.state[index] = isMaximizing ? "O" : "X"; 
        const score = this.minimax(!isMaximizing); 
        this.state[index] = null; 
        bestScore = isMaximizing
          ? Math.max(bestScore, score)
          : Math.min(bestScore, score); 
      }
    });

    return bestScore;
  },

  
  checkWin() {
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], 
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], 
      [0, 4, 8],
      [2, 4, 6], 
    ];
    return wins.find((combo) =>
      combo.every(
        (i) => this.state[i] && this.state[i] === this.state[combo[0]]
      )
    );
  },

  
  highlight(combo) {
    combo.forEach((i) => {
      document.getElementById("board").children[i].style.color = "red";
    });
  },

  
  reset() {
    this.state = Array(9).fill(null);
    this.cPlayer = "X";
    this.gameOver = false;
    this.cBoard();
  },

  
  uMessage(msg) {
    document.getElementById("message").textContent = msg;
  },
};

TicTac.init();

let fullBonsai = [
  "     ,\\",
  "    # (_",
  "      _)\\##",
  "  ###/((_",
  "       ))\\####",
  "     _((",
  "####/  )\\",
  '     ,;;"`;,',
  "    (_______)",
  "      \\===/",
  "      /===\\",
  "     /====\\'",
];

let bonsaiStems = ["     _((", "     ,\\", "     ,/|", "     ,/_"];

let bonsaiBranches = [
  "#####/  )\\",
  "       ))\\#####",
  "  ####/((_",
  "    ## (_",
  "    ## (/_###",
];

let bonsaiTree = ["          {}{      ", "      }{{", "      ,'  ) .",  "      ,'   '  `,"];

const bonsaiElement = document.getElementById("bonsai");

let lastSegment = "";

function growBonsai() {
  let randomGrowth = Math.random();
  let newSegment;

  if (randomGrowth < 0.3 && bonsaiHeight < 9) {
    newSegment = bonsaiStems[Math.floor(Math.random() * bonsaiStems.length)];
  } else if (bonsaiHeight < 9) {
    newSegment =
      bonsaiBranches[Math.floor(Math.random() * bonsaiBranches.length)];
  } else if (bonsaiHeight == 9) {
    newSegment = bonsaiStems[3];
  }

  if (newSegment === lastSegment) {
    growBonsai();
  } else {
    bonsaiTree.unshift(newSegment);
    bonsaiHeight++;

    bonsaiElement.innerHTML = bonsaiTree.join("<br>");

    lastSegment = newSegment;
  }
}

setInterval(growBonsai, 20000);
