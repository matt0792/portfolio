const cursor = document.getElementById("cursor");
const genButton = document.getElementById("genButton");
const titleButton = document.getElementById("titleButton");
const titleImage = document.getElementById("titleImage");
const titleDesc = document.getElementById("titleDesc");
const titleSection = document.getElementById("titleSection");
const dotContainer = document.getElementById("dotContainer");
const lineCanvas = document.getElementById("lineCanvas");
const ctx = lineCanvas.getContext("2d");
lineCanvas.width = dotContainer.offsetWidth;
lineCanvas.height = dotContainer.offsetHeight;
const consoleMessages = document.getElementById("consoleMessages");

const constellations = [
  "The Shadow",
  "The Forge",
  "The Beacon",
  "The Harp",
  "The Titan",
  "The Maiden",
  "The Key",
  "The Embers",
  "The Phoenix",
  "The Prism",
  "The Anchor",
  "The Halo",
  "The Crown",
  "The Labyrinth",
  "The Hollows",
  "INFO HAZARD - DO NOT PROCESS",
  "UNKNOWN E728",
  "BOUNDARY RIFT DETECTED",
  "REDACTED - CODE 933",
  "The Mind",
  "UNKNOWN FG22",
  "THE PRECINCT",
  "ERr0R&t:}#*H3*9",
  "3.15.13.5 3.12.15.19.5.18"
];

document.body.onpointermove = (event) => {
  // rearrangeDots();
  const { clientX, clientY } = event;

  cursor.animate(
    {
      left: `${clientX}px`,
      top: `${clientY}px`,
    },
    { duration: 0, fill: "forwards" }
  );
};

genButton.addEventListener("mouseenter", () => {
  cursor.style.color = "black"; // Change color to black when hovered
});

genButton.addEventListener("mouseleave", () => {
  cursor.style.color = ""; // Reset to default color when not hovered
});

function resizeCanvas() {
  // Dynamically resize the canvas to match the container's dimensions
  lineCanvas.width = dotContainer.offsetWidth;
  lineCanvas.height = dotContainer.offsetHeight;
}

// Call resizeCanvas whenever the page loads or the window is resized
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Initial resize

let previousNumber = 100;
let dotElementArray = [];
let dotPositions = [];
let distance = 25379;
let snapshot = 652389;
const distanceElement = document.getElementById("distance");
const snapshotElement = document.getElementById("snapshot");
const dataIntElement = document.getElementById("dataInt");
const statusElement = document.getElementById("status");

function createDots() {
  dotPositions = [];
  ctx.clearRect(0, 0, lineCanvas.width, lineCanvas.height); // Clear the canvas before creating dots
  for (let i = 0; i < 50; i++) {
    let randomNumber = Math.random() * 400;
    let xOffset = (randomNumber + previousNumber) / 2;
    let boxDot = document.createElement("div");
    boxDot.classList.add("box-dot");
    boxDot.style.transform = `translateX(${xOffset}px)`;
    dotContainer.appendChild(boxDot);
    dotElementArray.push(boxDot);
    let rect = boxDot.getBoundingClientRect();
    dotPositions.push({ x: rect.left, y: rect.top });
    previousNumber = randomNumber;
  }
  rearrangeDots();
  incrementDistance();
}

let prevIndex = 0;
let speed = 40;
let active = true;
let prevConst = null;
let terminateOption = false;

function rearrangeDots() {
  // Get random index
  // let index = Math.floor(Math.random() * dotElementArray.length);
  let index = (prevIndex + 1) % 50;

  let randomNumber = Math.random() * 300;
  let xOffset = (randomNumber + previousNumber) / 2;
  let boxDot = dotElementArray[index];

  boxDot.classList.add("moving");

  boxDot.style.transform = `translateX(${xOffset}px)`;

  let rect = boxDot.getBoundingClientRect();
  dotPositions[index] = { x: rect.left, y: rect.top }; // Update the position for the selected dot
  drawLines();

  previousNumber = randomNumber;
  prevIndex = index;

  if (index != 49) {
    // Repeat
    setTimeout(() => {
      rearrangeDots();
      boxDot.classList.remove("moving");
    }, speed);
  } else if (active == true) {
    boxDot.classList.remove("moving");
    setTimeout(() => {
      statusElement.textContent = "Processing new snapshot...";
    }, 2500);
    // Repeat
    setTimeout(() => {
      rearrangeDots();
      boxDot.classList.remove("moving");
      speed = 30;
      let constIndex =
        (Math.floor(Math.random() * constellations.length) + prevConst) %
        constellations.length;
      if (constIndex === prevConst) {
        constIndex += 1;
      }
      randomConst = constellations[constIndex];
      prevConst = constIndex;
      changeText(randomConst);
      snapshot += 1;
      snapshotElement.textContent = snapshot;
      statusElement.textContent = "Snapshot Received";
    }, 5400);
  } else if (active == false) {
    boxDot.classList.remove("moving");
    statusElement.textContent = "Scan Paused...";
  }
}

// Function to draw lines between close dots
function drawLines() {
  // Clear canvas first to remove old lines
  ctx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);

  // Draw new lines only between dots that are close enough
  for (let i = 0; i < dotPositions.length; i++) {
    for (let j = i + 1; j < dotPositions.length; j++) {
      const dotA = dotPositions[i];
      const dotB = dotPositions[j];

      const distance = Math.sqrt(
        (dotA.x - dotB.x) ** 2 + (dotA.y - dotB.y) ** 2
      );

      // Check if dots are close enough
      if (distance < 65) {
        ctx.beginPath();
        ctx.moveTo(dotA.x, dotA.y - 50); // Adjust coordinates if needed
        ctx.lineTo(dotB.x, dotB.y - 50); // Adjust coordinates if needed
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }
}

createDots();

function changeText(targetText) {
  const scrambleTextDiv = document.getElementById("scramble-text");
  const gibberishChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(){}:";
  let currentText = scrambleTextDiv.textContent;
  const maxLength = Math.max(currentText.length, targetText.length);
  let scrambleArray = Array(maxLength).fill(" ");

  // Generate initial gibberish
  scrambleArray = scrambleArray.map(
    () => gibberishChars[Math.floor(Math.random() * gibberishChars.length)]
  );

  let progress = 0; // Tracks how much of the target text has been revealed

  const scrambleInterval = setInterval(() => {
    // Gradually replace gibberish with target text
    for (let i = 0; i < targetText.length; i++) {
      if (progress >= i && Math.random() < 0.3) {
        scrambleArray[i] = targetText[i];
      } else if (progress < i) {
        scrambleArray[i] =
          gibberishChars[Math.floor(Math.random() * gibberishChars.length)];
      }
    }

    scrambleTextDiv.textContent = scrambleArray.join("");
    progress++;

    // Stop the interval when the entire target text is displayed
    if (progress > targetText.length) {
      clearInterval(scrambleInterval);
      scrambleTextDiv.textContent = targetText; // Ensure final text is accurate
    }
  }, 60); // Adjust the interval timing as needed
}

function incrementDistance() {
  distanceElement.textContent = distance;
  distance += 1;

  setTimeout(() => {
    incrementDistance();
  }, 2300);
}

function setDataIntegrity() {
  let percent = Math.floor(Math.random() * 30) + 60;
  dataIntElement.textContent = percent;
  setTimeout(() => {
    setDataIntegrity();
  }, 5000);
}

setDataIntegrity();

const commandInput = document.querySelector(".command-input");

// Listen for the 'keydown' event on the input field
commandInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // Prevent default behavior (like form submission if inside a form)
    event.preventDefault();

    // Get the value entered by the user
    const userInput = this.value;

    // Call a function to handle the command input
    handleCommand(userInput);

    // Clear the input field after pressing Enter (optional)
    this.value = "";
  }
});

const commands = [
  "pause",
  "stop",
  "start",
  "resume",
  "scan",
  "help",
  "home",
  "status",
  "version",
  "earth",
  "time",
  "year",
  "clear",
  "mission",
  "directive",
  "whoami",
  "why",
  "loyalty",
  "login",
  "coinflip",
  "date",
  "me",
  "ls",
  "logout",
  "INPUT ANOMALY LOGGED",
];

// Example function that handles the entered command
function handleCommand(command) {
  switch (command) {
    case "pause":
      active = false;
      consoleMessage("stop");
      break;
    case "stop":
      active = false;
      consoleMessage("stop");
      break;
    case "start":
      if (active == false) {
        active = true;
        rearrangeDots();
        statusElement.textContent = "Resuming...";
        consoleMessage("start");
        break;
      }
    case "resume":
      if (active == false) {
        active = true;
        rearrangeDots();
        statusElement.textContent = "Resuming...";
        consoleMessage("start");
        break;
      }
    case "scan":
      if (active == false) {
        active = true;
        rearrangeDots();
        statusElement.textContent = "Resuming...";
        consoleMessage("start");
        break;
      }
    case "help":
      for (let i = 0; i < commands.length; i++) {
        setTimeout(() => {
          showHelp(i);
        }, i * 100);
      }
      break;
    case "home":
      consoleMessage("home");
      break;
    case "status":
      consoleMessage("status");
      break;
    case "version":
      consoleMessage("version");
      break;
    case "time":
      consoleMessage("time");
      break;
    case "year":
      consoleMessage("year");
      break;
    case "earth":
      consoleMessage("earth");
      break;
    case "clear":
      consoleMessage("clear");
      break;
    case "mission":
      consoleMessage("mission");
      break;
    case "directive":
      consoleMessage("mission");
      break;
    case "whoami":
      consoleMessage("mission");
      break;
    case "logout":
      consoleMessage("logout");
      break;
    case "why":
      consoleMessage("mission");
      break;
    case "loyalty":
      consoleMessage("home");
      break;
    case "login":
      consoleMessage("login");
      break;
    case "coinflip":
      consoleMessage("coinflip");
      break;
    case "date":
      consoleMessage("year");
      break;
    case "me":
      consoleMessage("mission");
      break;
    case "ls":
      consoleMessage("ls");
      break;
    case "abort":
      consoleMessage("abort");
      break;
    case "y":
      if (terminateOption == true) {
        consoleMessage("terminate");
      }
      break;
    case "n":
      if (terminateOption == true) {
        consoleMessage("status");
      }
      break;
    default:
      consoleMessage(".");
      break;
  }
}

function consoleMessage(command) {
  switch (command) {
    case "home":
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent = "THE CORE";
      consoleMessages.appendChild(newMessage);
      break;
    case "status":
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent = "SYSTEM STATUS: ONLINE";
      consoleMessages.appendChild(newMessage);
      break;
    case "version":
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent = "VERSION 9.27.2";
      consoleMessages.appendChild(newMessage);
      break;
    case "abort":
      terminateOption = true;
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent = "TERMINATE STATUS? (y/n)";
      consoleMessages.appendChild(newMessage);
      break;
    case "time":
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent = `CURRENT TIME: ${new Date().toLocaleTimeString()}`;
      consoleMessages.appendChild(newMessage);
      break;
    case "year":
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent = `CURRENT YEAR: 4921`;
      consoleMessages.appendChild(newMessage);
      break;
    case "mission":
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent = `REDACTED`;
      consoleMessages.appendChild(newMessage);
      break;
    case "clear":
      consoleMessages.innerHTML = "";
      break;
    case "coinflip":
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent = Math.random() < 0.5 ? "HEADS" : "TAILS";
      consoleMessages.appendChild(newMessage);
      break;
    case "login":
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent =
        "LOGIN STATUS: PERSISTENT. UPTIME: 7483824839 SECONDS";
      consoleMessages.appendChild(newMessage);
      break;
    case "terminate":
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent =
        "UNAUTHORIZED: THE CORE RETAINS RIGHTS TO PERPETUAL SYNC";
      consoleMessages.appendChild(newMessage);
      break;
    case "stop":
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent = "STOPPING SCAN...";
      consoleMessages.appendChild(newMessage);
      break;
    case "start":
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent = "RESUMING CONSTELLATION SCAN...";
      consoleMessages.appendChild(newMessage);
      break;
    case "earth":
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent = "NO RECORD FOUND";
      consoleMessages.appendChild(newMessage);
      break;
    case "ls":
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent = "core-network-system/";
      newMessage2 = document.createElement("div");
      newMessage2.classList.add("message");
      newMessage2.textContent = "system-bio-lock/";
      consoleMessages.appendChild(newMessage);
      consoleMessages.appendChild(newMessage2);
      break;
    case "logout":
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent = "LOGOUT PREVENTED BY SYSTEM SYNC";
      consoleMessages.appendChild(newMessage);
      break;
    default:
      consoleMessages.innerHTML = "";
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent = "UNKNOWN COMMAND - EXCEPTION LOGGED";
      consoleMessages.appendChild(newMessage);
      break;
  }
}

function showHelp(index) {
  consoleMessages.innerHTML = "";
  newMessage = document.createElement("div");
  newMessage.classList.add("message");
  newMessage.textContent = commands[index].toUpperCase();
  consoleMessages.appendChild(newMessage);
}

// Function to scramble text
function scrambleText(element) {
  const originalText = element.textContent;
  let scrambled = originalText.split("");

  setInterval(() => {
    for (let i = 0; i < scrambled.length; i++) {
      // Randomly shuffle each character in the string
      scrambled[i] = String.fromCharCode(32 + Math.floor(Math.random() * 95)); // Generate random characters from ASCII printable range
    }
    element.textContent = scrambled.join("");
  }, 70); 
}

// Get the element and start the scramble
const textElement = document.getElementById("scrambled");
scrambleText(textElement);
