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
const cameraApp = document.getElementById("cameraApp");
const infoWindow = document.getElementById("infoWindow");
const projectsWindow = document.getElementById("projectsWindow");
const musicWindow = document.getElementById("musicWindow");
const tttWindow = document.getElementById("tttWindow");
const bonsaiWindow = document.getElementById("bonsaiWindow");
const cameraWindow = document.getElementById("cameraWindow");
const timeElement = document.getElementById("time");
const infoClose = document.getElementById("closeInfo");
const projClose = document.getElementById("closeProj");
const musicClose = document.getElementById("closeMusic");
const tttClose = document.getElementById("closeTtt");
const paintClose = document.getElementById("closePaint");
const bonsaiClose = document.getElementById("closeBonsai");
const cameraClose = document.getElementById("closeCamera");

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
cameraApp.addEventListener("click", openCameraWindow);
tttClose.addEventListener("click", openTttWindow);
cameraClose.addEventListener("click", openCameraWindow);
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
  if (bonsaiHeight == 0) {
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

let bonsaiTree = [
  "          {}{      ",
  "      }{{",
  "      ,'  ) .",
  "      ,'   '  `,",
];

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

setInterval(growBonsai, 40000);

const videoElement = document.getElementById("webcam");
const asciiElement = document.getElementById("ascii");

// ASCII characters from darkest to lightest
const asciiChars = " .:-=*%@#§";

// Variables for motion blur
let previousBrightness = []; // Stores the previous frame's brightness values
const blurAmount = 0; // Adjust between 0 (no blur) and 1 (maximum blur)

// State for webcam
let isCameraActive = false;
let videoStream = null;

// Function to toggle webcam
async function openCameraWindow() {
  cameraWindow.classList.toggle("hidden");
  cameraWindow.classList.add("window-open");
  if (isCameraActive) {
    // Stop the webcam
    const tracks = videoStream.getTracks();
    tracks.forEach((track) => track.stop());
    videoStream = null;
    videoElement.srcObject = null;
    isCameraActive = false;
    asciiElement.textContent = ""; // Clear ASCII art when camera is off
    console.log("Webcam turned off");
  } else {
    // Start the webcam
    try {
      videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = videoStream;
      isCameraActive = true;
      console.log("Webcam turned on");

      // Process the video feed
      videoElement.addEventListener("play", () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const processFrame = () => {
          if (!isCameraActive) return; // Stop processing if the camera is turned off

          // Set canvas size to match video
          canvas.width = 100; // Small width for ASCII effect
          canvas.height = (videoElement.videoHeight / videoElement.videoWidth) * canvas.width;

          // Flip the canvas horizontally
          context.save();
          context.scale(-1, 1);
          context.translate(-canvas.width, 0);

          // Draw video frame to canvas
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          context.restore();

          // Get pixel data
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

          // Convert pixel data to brightness values
          const currentBrightness = [];
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const offset = (y * canvas.width + x) * 4;
              const r = imageData[offset];
              const g = imageData[offset + 1];
              const b = imageData[offset + 2];

              // Convert RGB to brightness (grayscale)
              const brightness = (r + g + b) / 3;
              currentBrightness.push(brightness);
            }
          }

          // Blend current frame with previous frame for motion blur
          const blendedBrightness = currentBrightness.map((brightness, index) => {
            const previous = previousBrightness[index] || brightness;
            return blurAmount * previous + (1 - blurAmount) * brightness;
          });

          // Save the blended brightness for the next frame
          previousBrightness = blendedBrightness;

          // Convert brightness values to ASCII
          let asciiString = "";
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const index = y * canvas.width + x;
              const brightness = blendedBrightness[index];
              const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
              asciiString += asciiChars[charIndex];
            }
            asciiString += "\n"; // New line after each row
          }

          // Display ASCII art
          asciiElement.textContent = asciiString;

          // Repeat processing for the next frame
          requestAnimationFrame(processFrame);
        };

        processFrame();
      });
    } catch (error) {
      console.error("Error accessing webcam: ", error);
      alert("Unable to access webcam. Please ensure it's not in use or blocked by the browser.");
    }
  }
}