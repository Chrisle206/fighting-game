
import "./App.css";

function App() {

  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 1024;
  canvas.height = 576;

  context.fillRect(0, 0, 1024, 576);

  const gravity = 0.7;

  class Sprite {
    constructor({ position, imageSrc }) {
      this.position = position;
      this.width = 50;
      this.height = 150;
      this.image = new Image();
      this.image.src = imageSrc;
    }

    draw() {
      context.drawImage(this.image, this.position.x, this.position.y);
    }

    update() {
      this.draw();
    }
  }

  class Fighter {
    constructor({ position, velocity, color = 'red', offset }) {
      this.position = position;
      this.velocity = velocity;
      this.width = 50;
      this.height = 150;
      this.lastKey = "";
      this.attackBox = {
        position: {
          x: this.position.x,
          y: this.position.y
        },
        offset: offset,
        width: 100,
        height: 50,
      }
      this.color = color;
      this.isAttacking = '';
      this.health = 100;
    }

    draw() {
      context.fillStyle = this.color;
      context.fillRect(this.position.x, this.position.y, this.width, this.height);

      //attack box
      if (this.isAttacking) {
        context.fillStyle = 'purple';
        context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
      }
    }

    update() {
      this.draw();
      this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
      this.attackBox.position.y = this.position.y;

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      if (this.position.y + this.height + this.velocity.y >= canvas.height) {
        this.velocity.y = 0;
      } else {
        this.velocity.y += gravity;
      }
    }

    attack() {
      this.isAttacking = true;
      setTimeout(() => {
        this.isAttacking = false;
      }, 100)
    }
  }
  

  const background = new Sprite({
    position: {
      x: 0,
      y: 0
    },
    imageSrc: './Assets/background.png'
  });

  const player = new Fighter({
    position: {
      x: 0,
      y: 0
    },
    velocity: {
      x: 0,
      y: 0
    },
    offset: {
      x: 0,
      y: 0
    }
  });


  const enemy = new Fighter({
    position: {
      x: 900,
      y: 100
    },
    velocity: {
      x: 0,
      y: 0
    },
    offset: {
      x: -50,
      y: 0
    },
    color: 'blue'
  });

  const keys = {
    a: {
      pressed: false
    },
    d: {
      pressed: false
    },
    ArrowLeft: {
      pressed: false
    },
    ArrowRight: {
      pressed: false
    }
  }

  function hitBox({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
  }

  function animate() {
    window.requestAnimationFrame(animate);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    // background.update();
    player.update();
    enemy.update();
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    if (keys.a.pressed && player.lastKey === 'a') {
      player.velocity.x = -1;
    } else if (keys.d.pressed && player.lastKey === 'd') {
      player.velocity.x = 1;
    }

    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
      enemy.velocity.x = -1;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
      enemy.velocity.x = 1;
    }

    if (hitBox({ rectangle1: player, rectangle2: enemy }) && player.isAttacking) {
      player.isAttacking = false;
      enemy.health -= 20;
      document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    if (hitBox({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
      enemy.isAttacking = false;
      player.health -= 20;
      document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    if (enemy.health <= 0 || player.health <= 0) {
      determineWinner({ player, enemy, timerId });
    }
  }

  function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.querySelector('#draw').style.display = "flex";
    if (player.health === enemy.health) {
      document.querySelector('#draw').innerHTML = "Draw!";

    } else if (player.health > enemy.health) {
      document.querySelector('#draw').innerHTML = "Player 1 Wins!";

    } else {
      document.querySelector('#draw').innerHTML = "Player 2 Wins!";

    }
  }

  let timer = 60;
  let timerId;
  function decreaseTimer() {

    if (timer > 0) {
      timerId = setTimeout(decreaseTimer, 1000);
      timer--;
      document.querySelector('#timer').innerHTML = timer;
    }

    if (timer === 0) {
      determineWinner({ player, enemy, timerId});
    }
  }

  decreaseTimer();
  animate();

  window.addEventListener('keyup', (event) => {
    switch (event.key) {
      //Player Keys
      case 'w':
        player.velocity.y = 0;
        break;
      case 'd':
        keys.d.pressed = false;
        break;
      case 'a':
        keys.a.pressed = false;
        break;

      //Enemy Keys
      case 'ArrowUp':
        enemy.velocity.y = 0
        break;
      case 'ArrowRight':
        keys.ArrowRight.pressed = false;
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false;
        break;
      default:
        break;
    }
  })

  window.addEventListener('keydown', (event) => {
    switch (event.key) {
      //Player Keys
      case 'w':
        player.velocity.y = -20
        break;
      case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case ' ':
        player.attack();
        break;

      //Enemy Keys
      case 'ArrowUp':
        enemy.velocity.y = -20
        break;
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break;
      case 'l':
        enemy.attack();
        break;
      default:
        break;
    }
  })

  //////////////////////////////////////////////////////////////

  return (
    <>
      <body>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ position: "absolute", display: "flex", width: "100%", alignItems: "center", padding: "20px" }}>
            {/* player health */}
            <div style={{ position: "relative", height: "30px", width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <div style={{ backgroundColor: "yellow", height: "30px", width: "100%" }}></div>
              <div id="playerHealth" style={{ position: "absolute", background: "blue", top: "0", right: "0", bottom: "0", width: "100%" }}></div>
            </div>
            {/* timer */}
            <div id="timer" style={{ backgroundColor: "red", height: "100px", width: "100px", flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "center" }}>10</div>
            {/* enemy health */}
            <div style={{ position: "relative", height: "30px", width: "100%" }}>
              <div style={{ backgroundColor: "yellow", height: "30px", width: "100%" }}></div>
              <div id="enemyHealth" style={{ position: "absolute", background: "green", top: '0', right: "0", bottom: "0", left: '0' }}></div>
            </div>
            <div></div>
          </div>
          <div id="draw" style={{ position: "absolute", color: "white", display: "none", justifyContent: "center", alignItems: "center", top: '0', right: '0', bottom: "0", left: '0' }}></div>
          <canvas></canvas>
        </div>
      </body>
    </>
  );
}

export default App;
