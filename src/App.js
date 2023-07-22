import "./App.css";
import { useRef, useEffect } from "react";
import useBird from "./useBird";

function App(props) {
  const canvasRef = useRef(null);

  let birdWidth = 40;
  let birdHeight = 40;

  let { drawBird } = useBird();

  function drawObstacle(ctx) {
    let path = new Path2D(
      "M24.85,10.126c2.018-4.783,6.628-8.125,11.99-8.125c7.223,0,12.425,6.179,13.079,13.543 c0,0,0.353,1.828-0.424,5.119c-1.058,4.482-3.545,8.464-6.898,11.503L24.85,48L7.402,32.165c-3.353-3.038-5.84-7.021-6.898-11.503 c-0.777-3.291-0.424-5.119-0.424-5.119C0.734,8.179,5.936,2,13.159,2C18.522,2,22.832,5.343,24.85,10.126z"
    );
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#00c48d";
    ctx.stroke(path);
    ctx.fill(path);
    ctx.restore(); // original state
  }

  function drawProjectile(
    ctx,
    xProjectile,
    yProjectile,
    projectileWidth,
    projectileHeight
  ) {
    if (!(ctx instanceof CanvasRenderingContext2D)) {
      console.error("Invalid context");
      return;
    }
    ctx.fillStyle = "#000000";
    ctx.fillRect(xProjectile, yProjectile, projectileWidth, projectileHeight);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let frameCount = 0;
    let animationFrameId;

    const numRows = 5; // Number of rows (changed to 3)
    const rowHeight = canvas.height / 5; // Height of each row
    const shapeWidth = 50; // Width of the shape
    // let positionsX = []; // Array to store X positions for each row
    const brickOffsetTop = 30;
    // const speed = 7;

    let xBird = canvas.width / 6;
    let yBird = canvas.height / 2;

    let xProjectile = xBird + 10;
    let yProjectile = yBird + 10;

    let upPressed = false;
    let downPressed = false;
    let projectileActive = false;

    let obstacleColumns = [];

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
      if (e.key === "Up" || e.key === "ArrowUp") {
        upPressed = true;
      } else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = true;
      }
      if (e.key === " " || e.code === "Space") {
        if (projectileActive) {
          return;
        } else {
          projectileActive = true;
          setTimeout(() => {
            console.log(projectileActive);
          }, 500);
          setTimeout(() => {
            console.log(projectileActive);
          }, 1000);
          setTimeout(() => {
            projectileActive = false;
            console.log(`projectileActive ${projectileActive}`);
          }, 1500);
        }
      }
    }
  }

    function keyUpHandler(e) {
      if (e.key === "Up" || e.key === "ArrowUp") {
        upPressed = false;
      } else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = false;
      }
    }

    function init() {
      for (let i = 0; i < numRows; i++) {
        const interval = Math.random() * 2000 + 1000; // Random interval between 1000ms and 3000ms
        const speed = Math.random() * 2 + 3;
        const color = getRandomColor();
        obstacleColumns.push({
          x: canvas.width + i * (rowHeight * Math.random()),
          interval,
          speed,
          color,
        });
      }
      // yProjectile = yBird
    }

    function getRandomColor() {
      // Array of 10 colors to choose from
      const colors = [
        "#D9ED92",
        "#B5E48C",
        "#99D98C",
        "#76C893",
        "#52B69A",
        "#34A0A4",
        "#168AAD",
        "#1A759F",
        "#1E6091",
        "#184E77",
      ];
      // Randomly select a color from the colors array
      return colors[Math.floor(Math.random() * colors.length)];
    }

    function game() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      drawBird(context, xBird, yBird);

      if (projectileActive) {
        yProjectile += 8;
        if (yProjectile > canvas.height) {
          context.clearRect(0, canvas.height, canvas.width, canvas.height + 20)
          projectileActive = false;
          yProjectile = yBird
        }
        // context.save()
        // context.translate(0, yProjectile)
        drawProjectile(context, xProjectile, yProjectile, 20, 20);
        // context.restore()
      }

      if (upPressed) {
        yBird = Math.max(yBird - 13, 75);
      } else if (downPressed) {
        yBird = Math.min(yBird + 13, 600 - birdHeight);
      }

      if (projectileActive) {
        yProjectile += 8;
        if (yProjectile > canvas.height) {
          context.clearRect(0, canvas.height, canvas.width, canvas.height + 20);
          projectileActive = false;
          yProjectile = yBird;
        }
        // context.save()
        // context.translate(0, yProjectile)
        drawProjectile(context, xProjectile, yProjectile, 20, 20);
        // context.restore()
      }

      for (let i = 0; i < numRows; i++) {
        const { x, speed } = obstacleColumns[i];
        obstacleColumns[i].x -= speed;

        if (obstacleColumns[i].x + shapeWidth < 0) {
          obstacleColumns[i].x = canvas.width + rowHeight * Math.random();
          obstacleColumns[i].interval = Math.random() * 2000 + 1000; // Randomize the interval again
          obstacleColumns[i].speed = Math.random() * 2 + 3; // Randomize the speed again
          obstacleColumns[i].color = getRandomColor();
        }

        context.save();
        context.translate(x, i * rowHeight + brickOffsetTop);
        drawObstacle(context, obstacleColumns[i], obstacleScale);
        context.restore();
      }

      requestAnimationFrame(game);
    }

    init();
    requestAnimationFrame(game);
  }, []);

  return (
    <>
      <h1>hello birdies</h1>
      <canvas
        className="birdCanvas"
        width="1200"
        height="675"
        ref={canvasRef}
        {...props}
      >
        Bird Party Game!
      </canvas>
    </>
  );
}

export default App;
