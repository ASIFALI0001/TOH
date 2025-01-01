const towers = [
    document.getElementById("tower1"),
    document.getElementById("tower2"),
    document.getElementById("tower3")
];

let disks = [];
let numDisks = parseInt(document.getElementById("diskInput").value);
let moves = [];
let moveIndex = 0;
let animationSpeed = parseInt(document.getElementById("speedControl").value);
let isPaused = false;
let pauseTimeout = null;

function highlightCode(lineNumber, result) {
    const line = document.getElementById(`line${lineNumber}`);
    line.classList.remove('highlight', 'green', 'red');
    if (result === null) {
        line.classList.add('highlight');
    } else if (result === true) {
        line.classList.add('green');
    } else if (result === false) {
        line.classList.add('red');
    }
}

function createDisks() {
    disks = [];
    towers.forEach(tower => tower.innerHTML = "");
    for (let i = numDisks; i >= 1; i--) {
        const disk = document.createElement("div");
        disk.classList.add("disk");
        disk.style.width = `${i * 20}px`;
        disk.style.backgroundColor = `hsl(${i * 40}, 70%, 50%)`;
        disk.textContent = i; // Add the disk number
        disks.push(disk);
        towers[0].appendChild(disk);
    }
}

function solveHanoi(n, source, target, auxiliary) {
    if (n === 0) return;
    highlightCode(3, null); // Line 3: If condition
    solveHanoi(n - 1, source, auxiliary, target);
    moves.push([source, target]);
    highlightCode(8, null); // Line 8: Print move
    solveHanoi(n - 1, auxiliary, target, source);
}

function animateMoves() {
    if (isPaused) return;

    if (moveIndex >= moves.length) {
        document.getElementById("startButton").disabled = false;
        document.getElementById("resetButton").disabled = false;
        document.getElementById("pauseButton").disabled = true;
        document.getElementById("resumeButton").disabled = true;
        return;
    }

    const [from, to] = moves[moveIndex];
    const disk = towers[from].lastElementChild;
    towers[to].appendChild(disk);
    moveIndex++;
    pauseTimeout = setTimeout(animateMoves, animationSpeed);
}

document.getElementById("startButton").addEventListener("click", () => {
    numDisks = parseInt(document.getElementById("diskInput").value);
    animationSpeed = parseInt(document.getElementById("speedControl").value);
    document.getElementById("speedValue").textContent = `${animationSpeed}ms`;
    document.getElementById("startButton").disabled = true;
    document.getElementById("pauseButton").disabled = false;
    document.getElementById("resumeButton").disabled = true;
    document.getElementById("resetButton").disabled = true;
    moves = [];
    moveIndex = 0;
    solveHanoi(numDisks, 0, 2, 1);
    animateMoves();
});

document.getElementById("pauseButton").addEventListener("click", () => {
    isPaused = true;
    clearTimeout(pauseTimeout);
    document.getElementById("pauseButton").disabled = true;
    document.getElementById("resumeButton").disabled = false;
});

document.getElementById("resumeButton").addEventListener("click", () => {
    isPaused = false;
    document.getElementById("pauseButton").disabled = false;
    document.getElementById("resumeButton").disabled = true;
    animateMoves();
});

document.getElementById("resetButton").addEventListener("click", () => {
    createDisks();
    document.getElementById("startButton").disabled = false;
    document.getElementById("pauseButton").disabled = true;
    document.getElementById("resumeButton").disabled = true;
    document.getElementById("resetButton").disabled = true;
});

document.getElementById("diskInput").addEventListener("change", () => {
    numDisks = parseInt(document.getElementById("diskInput").value);
    createDisks();
});

document.getElementById("speedControl").addEventListener("input", (event) => {
    animationSpeed = parseInt(event.target.value);
    document.getElementById("speedValue").textContent = `${animationSpeed}ms`;
});

createDisks();
