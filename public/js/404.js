document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const restartBtn = document.getElementById("restartBtn");
    const startBtn = document.getElementById("startBtn");
    const instructions = document.getElementById("instructions");

    // Game variables
    let frames = 0;
    const gravity = 0.1;  // Reduced gravity for easier gameplay
    const jump = 3;        // Increased jump power
    let score = 0;
    let gameOver = false;
    let gameStarted = false;
    let animationId;

    // Game objects
    let bird, pipes = [];

    // Make canvas full screen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Load assets
    const birdImg = new Image();
    birdImg.src = "/assets/bird.png";

    const bgImg = new Image();
    bgImg.src = "/assets/background.png";

    const flapSound = new Audio("/assets/flap.wav");
    const hitSound = new Audio("/assets/hit.wav");

    // Initialize game
    function initGame() {
        bird = {
            x: 50,
            y: canvas.height / 2,
            width: 40,
            height: 40,
            velocity: 2,
            draw() {
                ctx.drawImage(birdImg, this.x, this.y, this.width, this.height);
            },
            update() {
                this.velocity += gravity;
                this.y += this.velocity;

                // Prevent bird from going above the screen
                if (this.y < 0) {
                    this.y = 0;
                    this.velocity = 0;
                }

                // Ground collision
                if (this.y + this.height >= canvas.height) {
                    triggerGameOver();
                }
            },
            flap() {
                if (!gameOver && gameStarted) {
                    this.velocity = -jump;
                    flapSound.currentTime = 0;
                    flapSound.play();
                }
            }
        };

        pipes = [];
        score = 0;
        gameOver = false;
        frames = 0;
    }

    // Pipes
    function createPipe() {
        const minGap = 150;  // Increased gap for easier gameplay
        const maxGap = 200;
        const gap = minGap + Math.random() * (maxGap - minGap);
        const minHeight = 50;
        const maxHeight = canvas.height - gap - minHeight;
        const topHeight = minHeight + Math.random() * (maxHeight - minHeight);

        pipes.push({
            x: canvas.width,
            width: 60,
            top: topHeight,
            bottom: canvas.height - topHeight - gap,
            passed: false
        });
    }

    function updatePipes() {
        // Create new pipes less frequently (easier gameplay)
        if (frames % 120 === 0) createPipe();

        for (let i = 0; i < pipes.length; i++) {
            pipes[i].x -= 2;  // Slower pipe speed

            // Collision detection
            if (
                bird.x < pipes[i].x + pipes[i].width &&
                bird.x + bird.width > pipes[i].x &&
                (bird.y < pipes[i].top || bird.y + bird.height > pipes[i].top + (canvas.height - pipes[i].top - pipes[i].bottom))
            ) {
                triggerGameOver();
            }

            // Score
            if (!pipes[i].passed && bird.x > pipes[i].x + pipes[i].width) {
                pipes[i].passed = true;
                score++;
            }
        }

        // Remove off-screen pipes
        pipes = pipes.filter(pipe => pipe.x + pipe.width > -50);
    }

    function drawBackground() {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    }

    function drawPipes() {
        ctx.fillStyle = "#4CAF50";
        for (let pipe of pipes) {
            // Top pipe
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
            // Bottom pipe
            ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
        }
    }

    function drawScore() {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`Score: ${score}`, canvas.width / 2, 50);
    }

    function drawGameOver() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 40);

        ctx.font = "32px Arial";
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

        // Show restart button
        document.querySelector('.btn-container').style.display = 'block';
    }

    function draw() {
        drawBackground();
        bird.draw();
        drawPipes();
        drawScore();

        if (gameOver) {
            drawGameOver();
        }
    }

    function update() {
        if (!gameOver && gameStarted) {
            bird.update();
            updatePipes();
            frames++;
        }
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        update();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }

    function triggerGameOver() {
        if (!gameOver) {
            hitSound.currentTime = 0;
            hitSound.play();
            gameOver = true;
            cancelAnimationFrame(animationId);
            draw(); // Ensure final state is rendered
        }
    }

    // Start game function
    function startGame() {
        gameStarted = true;
        instructions.style.display = 'none';
        initGame();
        gameLoop();
    }

    // Restart game function
    function restartGame() {
        document.querySelector('.btn-container').style.display = 'none';
        initGame();
        gameLoop();
    }

    // Event listeners
    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", restartGame);

    // Controls - both keyboard and touch/mouse
    // Replace the existing keydown event listener with this:
    document.addEventListener("keydown", e => {
        if (e.code === "Space") {
            e.preventDefault();
            if (gameOver) {
                restartGame();
            } else if (gameStarted) {
                bird.flap();
            } else {
                startGame();
            }
        }
    });

    canvas.addEventListener("click", () => bird.flap());
    canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        bird.flap();
    });

    // Initialize but don't start yet
    initGame();
});