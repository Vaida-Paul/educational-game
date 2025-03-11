import { dialogueData, scaleFactor } from "./constants";
import { k } from "./kaboomCtx";
import { displayDialogue, setCamScale } from "./utils";

k.loadSprite("spritesheet", "./spritesheet.png", {
  sliceX: 39,
  sliceY: 31,
  anims: {
    "idle-down": 936,
    "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
    "idle-side": 975,
    "walk-side": { from: 975, to: 978, loop: true, speed: 8 },
    "idle-up": 1014,
    "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
  },
});

k.loadSprite("map", "./map.png");

// Funcția pentru a afișa dialogul
function displayQuiz(quizData, onComplete) {
  const quizContainer = document.createElement("div");
  quizContainer.style.position = "absolute";
  quizContainer.style.top = "20%";
  quizContainer.style.left = "30%";
  quizContainer.style.width = "40%";
  quizContainer.style.padding = "20px";
  quizContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  quizContainer.style.color = "white";
  quizContainer.style.border = "2px solid white";
  quizContainer.style.textAlign = "center";

  const questionElement = document.createElement("p");
  questionElement.innerText = quizData.question;
  quizContainer.appendChild(questionElement);

  quizData.options.forEach((option) => {
    const button = document.createElement("button");
    button.innerText = option.text;
    button.style.margin = "5px";
    button.style.padding = "10px 20px";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => {
      const message = option.correct
        ? quizData.correctMessage
        : quizData.wrongMessage;
      //alert(message); // Show correct/wrong message
      document.body.removeChild(quizContainer); // Remove quiz container

      if (option.correct) {
        // Show the special message if the answer is correct
        const specialMessageContainer = document.createElement("div");
        specialMessageContainer.style.position = "absolute";
        specialMessageContainer.style.top = "30%";
        specialMessageContainer.style.left = "30%";
        specialMessageContainer.style.width = "40%";
        specialMessageContainer.style.padding = "20px";
        specialMessageContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        specialMessageContainer.style.color = "white";
        specialMessageContainer.style.border = "2px solid white";
        specialMessageContainer.style.textAlign = "center";

        const specialMessageElement = document.createElement("p");
        specialMessageElement.innerText = "➡️ 🏥, ⬆️🏫"; // Special message
        specialMessageContainer.appendChild(specialMessageElement);

        document.body.appendChild(specialMessageContainer);

        // Remove special message after a few seconds (optional)
        setTimeout(() => {
          document.body.removeChild(specialMessageContainer);
          onComplete(); // Continue the game
        }, 3000); // Message shown for 3 seconds
      } else {
        onComplete(); // Continue the game
      }
    });

    quizContainer.appendChild(button);
  });

  document.body.appendChild(quizContainer);
}

k.setBackground(k.Color.fromHex("#311047"));

k.scene("main", async () => {
  const mapData = await (await fetch("./map.json")).json();
  const layers = mapData.layers;

  const map = k.add([k.sprite("map"), k.pos(0), k.scale(scaleFactor)]);

  const player = k.make([
    k.sprite("spritesheet", { anim: "idle-down" }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(),
    k.scale(scaleFactor),
    {
      speed: 250,
      direction: "down",
      isInDialogue: false,
    },
    "player",
  ]);

  for (const layer of layers) {
    if (layer.name === "boundaries") {
      for (const boundary of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
          }),
          k.body({ isStatic: true }),
          k.pos(boundary.x, boundary.y),
          boundary.name,
        ]);

        if (boundary.name) {
          player.onCollide(boundary.name, () => {
            const data = dialogueData[boundary.name];

            if (data) {
              player.isInDialogue = true;

              if (data.type === "dialogue") {
                // Afișăm textul standard pentru dialoguri
                displayDialogue(data.text, () => (player.isInDialogue = false));
              } else if (data.type === "quiz1") {
                // Afișăm quiz-ul
                displayQuiz(data, () => (player.isInDialogue = false));
              }
            }
          });
        }
      }

      continue;
    }

    if (layer.name === "spawnpoints") {
      for (const entity of layer.objects) {
        if (entity.name === "player") {
          player.pos = k.vec2(
            (map.pos.x + entity.x) * scaleFactor,
            (map.pos.y + entity.y) * scaleFactor
          );
          k.add(player);
          continue;
        }
      }
    }
  }

  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });

  k.onUpdate(() => {
    k.camPos(player.worldPos().x, player.worldPos().y - 100);
  });

  k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left" || player.isInDialogue) return;

    const worldMousePos = k.toWorld(k.mousePos());
    player.moveTo(worldMousePos, player.speed);

    const mouseAngle = player.pos.angle(worldMousePos);

    const lowerBound = 50;
    const upperBound = 125;

    if (
      mouseAngle > lowerBound &&
      mouseAngle < upperBound &&
      player.curAnim() !== "walk-up"
    ) {
      player.play("walk-up");
      player.direction = "up";
      return;
    }

    if (
      mouseAngle < -lowerBound &&
      mouseAngle > -upperBound &&
      player.curAnim() !== "walk-down"
    ) {
      player.play("walk-down");
      player.direction = "down";
      return;
    }

    if (Math.abs(mouseAngle) > upperBound) {
      player.flipX = false;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "right";
      return;
    }

    if (Math.abs(mouseAngle) < lowerBound) {
      player.flipX = true;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "left";
      return;
    }
  });

  function stopAnims() {
    if (player.direction === "down") {
      player.play("idle-down");
      return;
    }
    if (player.direction === "up") {
      player.play("idle-up");
      return;
    }

    player.play("idle-side");
  }

  k.onMouseRelease(stopAnims);

  k.onKeyRelease(() => {
    stopAnims();
  });
  k.onKeyDown((key) => {
    const keyMap = [
      k.isKeyDown("right"),
      k.isKeyDown("left"),
      k.isKeyDown("up"),
      k.isKeyDown("down"),
    ];

    let nbOfKeyPressed = 0;
    for (const key of keyMap) {
      if (key) {
        nbOfKeyPressed++;
      }
    }

    if (nbOfKeyPressed > 1) return;

    if (player.isInDialogue) return;
    if (keyMap[0]) {
      player.flipX = false;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "right";
      player.move(player.speed, 0);
      return;
    }

    if (keyMap[1]) {
      player.flipX = true;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "left";
      player.move(-player.speed, 0);
      return;
    }

    if (keyMap[2]) {
      if (player.curAnim() !== "walk-up") player.play("walk-up");
      player.direction = "up";
      player.move(0, -player.speed);
      return;
    }

    if (keyMap[3]) {
      if (player.curAnim() !== "walk-down") player.play("walk-down");
      player.direction = "down";
      player.move(0, player.speed);
    }
  });
});

k.go("main");
