import kaboom from "kaboom";
import "./styles.css";

kaboom({
  width: 1024,
  height: 768,
  root: document.getElementById("app")!
});

loadSprite("bean", "assets/bean.png");
loadSprite("apple", "assets/apple.png");
loadSprite("grass", "assets/grass.png");

function levelScene() {
  let score = 0;
  let running = false;

  addLevel(
    [
      "================",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "xxxxxxxxxxxxxxxx"
    ],
    {
      width: 64,
      height: 64,
      x: () => [sprite("grass"), area(), "grass"],
      "=": () => [
        sprite("grass"),
        // rotate(180),
        area(),
        "grass"
        // origin("center")
      ]
    }
  );

  const player = add([sprite("bean"), pos(128, 256), body(), area(), "player"]);
  player.paused = true;

  const startText = add([
    text("Press space to start"),
    pos(width() / 2, height() / 2),
    // @ts-ignore
    origin("center")
  ]);

  onKeyPress("space", () => {
    if (!running) {
      running = true;
    }

    if (player.paused) {
      player.paused = false;
      startText.destroy();
    }
    player.jump();
  });

  onCollide("player", "grass", () => {
    go("gameOver");
  });

  onCollide("player", "apple", (_, apple) => {
    score += 1;
    apple.destroy();
  });

  loop(2, () => {
    if (!running) {
      return;
    }

    add([
      sprite("apple"),
      pos(width(), rand(64, height() - 128)),
      area(),
      move(LEFT, 200),
      "apple"
    ]);
  });

  onDraw(() => {
    if (!running) {
      return;
    }

    drawText({
      text: `Score: ${score}`
    });
  });
}

function gameOver() {
  add([text("Game Over")]);
  onKeyPress("space", () => {
    go("level");
  });
}

scene("level", levelScene);
scene("gameOver", gameOver);
go("level");
