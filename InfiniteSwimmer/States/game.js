var game = new Phaser.Game(800, 600, Phaser.CANVAS, ' ');

var tween;
var cursors;
var restartImg;
var backgroundImg;
var backgroundVel;

// OBJECTS
var object;
var player;
var pConsumerObject;
var predatorObject;
var predatorTimer = 0;
var pConsumerTimer = 0;

// HUD
var level = 1;
var score = 0;
var scoreText;
var levelText;
var gameOverText;
var changeLevel = 0;

// STATES OF THE GAME
var gameState = true;
var gameOverState = false;

var mainState = {
  preload: function () {
    game.load.image('background', 'assets/imgs/bg.png');
    game.load.image('player', 'assets/imgs/player.png');
    game.load.image('pConsumers', 'assets/imgs/clownfish.png');
    game.load.image('predators', 'assets/imgs/sea-turtle.png');
    game.load.image('restart', 'assets/imgs/restartBtn.png');
  },

  create: function () {

    // BACKGROUND
    backgroundImg = game.add.tileSprite(0, 0, 800, 600, 'background');
    backgroundVel = 1;

    // RESTART BUTTON
    restartImg = game.add.button(420, 300, 'restart');
    restartImg.anchor.setTo(0.5, 0.5);
    restartImg.width = 40;
    restartImg.height = 40;
    restartImg.visible = false;
    restartImg.inputEnabled = true;

    // PLAYER
    player = game.add.sprite(20, game.world.centerY - 50, 'player');
    player.width = 50;
    player.height = 50;
    game.world.setBounds(0, 0, 800, 500);

    // PRIMARY CONSUMERS
    pConsumerObject = game.add.group();
    pConsumerObject.enableBody = true;
    pConsumerObject.PhysicsBodyType = Phaser.Physics.ARCADE;

    // PREDATORS
    predatorObject = game.add.group();
    predatorObject.enableBody = true;
    predatorObject.PhysicsBodyType = Phaser.Physics.ARCADE;

    // PHYSICS
    game.physics.enable(player, Phaser.Physics.ARCADE);

    // BOUNDS OF THE WORLD
    player.body.collideWorldBounds = true;
    cursors = game.input.keyboard.createCursorKeys();

    scoreHandler();
    createPredators();
    createPrimaryConsumers();
  },

  update: function () {

    if (gameState) {
      // SCROLLING BACKGROUND
      backgroundImg.tilePosition.x -= backgroundVel;
      // PLAYER HANDLER
      playerMoveHandler();
      // LEVEL HANDLER
      levelEditorHandler();
      // OBJECTS OUTSIDE WORLD
      objectsOutsideWorld()
      // COLLISION DETECTION HANDLERS
      game.physics.arcade.overlap(player, pConsumerObject, collisionPCHandler, null, this);
      game.physics.arcade.overlap(player, predatorObject, collisionPPHandler, null, this);
    }
  },

  render: function () {
    // game.debug.body(object);
    // game.debug.body(player); Use this to check debug
    player.body.setSize(player.width, player.height, player.width / 4, player.height / 4);
    player.body.setCircle(30);
    object.body.setCircle(100);
  },
};

game.state.add('mainState', mainState);
game.state.start('mainState');

// PLAYER HANDLER
function playerMoveHandler() {
  if (gameState) {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown) {
      player.body.velocity.x = -350;
    }

    if (cursors.right.isDown) {
      player.body.velocity.x = 350;
    }

    if (cursors.up.isDown) {
      player.body.velocity.y = -350;
    }

    if (cursors.down.isDown) {
      player.body.velocity.y = 350;
    }
  }
};
// PRIMARY CONSUMERS
function createPrimaryConsumers() {
  if (gameState) {
    object = pConsumerObject.create(830, randomYPos(), 'pConsumers');
    sizeAndMovementForCreatures();
  }
};
// PREDATORS
function createPredators() {
  if (gameState) {
    object = predatorObject.create(830, randomYPos(), 'predators');
    sizeAndMovementForCreatures();
  }
};
// GENERATES ANY OBJECT SIZE AND ITS RANDOM MOVEMENT TO THE LEFT
function sizeAndMovementForCreatures() {
  object.width = 50;
  object.height = 50;
  object.anchor.setTo(0.5, 0.5);
  object.body.velocity.x = randomXVel();
}
// COLLISION DETECTION B/T PLAYER AND PRIMARY CONSUMERS
function collisionPCHandler(player, consumer) {
  if (gameState) {
    consumer.kill();
    score += 1;
    scoreText.text = 'Score: ' + score;
  }
}
// COLLISION DETECTION B/T PLAYER AND PREDATORS
function collisionPPHandler(player, predator) {
  if (gameState) {
    gameOverState = true;
    restart();
  }
}
// OUT OF BOUNCE OBJECTS
function objectsOutsideWorld() {
  // it checks for both objects when their x position is ass than -10
  for (var i = pConsumerObject.children.length - 1; i >= 0; i--) {
    if (pConsumerObject.getChildAt(i).x < -20) {
      pConsumerObject.removeChildAt(i);
    }
  }

  for (var j = predatorObject.children.length - 1; j >= 0; j--) {
    if (predatorObject.getChildAt(j).x < -20) {
      predatorObject.removeChildAt(j);
    }
  }
};
// LEVEL HANDLER FOR THE GAME
function levelEditorHandler() {
  if (gameState) {
    changeLevel++;
    predatorTimer++;
    pConsumerTimer++;
    if (changeLevel >= 1900) { // check every 30 seconds level changes, 1900FPS is 30 seconds
      changeLevel = 0;
      level++;
      levelText.text = 'Level: ' + level;
    };

    if (level === 1) {
      if (predatorTimer >= 300) {
        for (var i = 0; i < 5; i++) {
          createPredators();
          predatorTimer = 0;
          tween = game.add.tween(predatorObject).to({ y: 80 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
          tween.onLoop.add(descend, this);
        }
      }

      if (pConsumerTimer >= 300) {
        for (var i = 0; i < 10; i++) {
          createPrimaryConsumers();
          pConsumerTimer = 0;
          tween = game.add.tween(pConsumerObject).to({ y: 50 }, 1000, Phaser.Easing.Quadratic.InOut, true, 0, 500, true);
          tween.onLoop.add(descend, this);
        }
      }

    } else if (level === 2) {
      if (predatorTimer >= 300) {
        for (var i = 0; i < 7; i++) {
          createPredators();
          predatorTimer = 0;
          tween = game.add.tween(predatorObject).to({ y: 80 }, 2000, Phaser.Easing.Quadratic.In, true, 0, 1000, true);
          tween.onLoop.add(descend, this);
        }
      }

      if (pConsumerTimer >= 300) {
        for (var i = 0; i < 15; i++) {
          createPrimaryConsumers();
          pConsumerTimer = 0;
          tween = game.add.tween(pConsumerObject).to({ y: 50 }, 1000, Phaser.Easing.Quadratic.Out, true, 0, 500, true);
          tween.onLoop.add(descend, this);
        }
      }
    } else if (level >= 3) {
      if (predatorTimer >= 200) {
        for (var i = 0; i < 12; i++) {
          createPredators();
          predatorTimer = 0;
          tween = game.add.tween(predatorObject).to({ y: randomYPos() }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
          tween.onLoop.add(descend, this);
        }
      }

      if (pConsumerTimer >= 200) {
        for (var i = 0; i < 20; i++) {
          createPrimaryConsumers();
          pConsumerTimer = 0;
          tween = game.add.tween(pConsumerObject).to({ y: randomYPos() }, 1000, Phaser.Easing.Quadratic.InOut, true, 0, 500, true);
          tween.onLoop.add(descend, this);
        }
      }
    }

  }
}
// FOR ONLOOP FUNC FOR TWEENS
function descend() {
  predatorObject.y += 10;
  pConsumerObject.y += 10;
}
// SCORE KEEPER HANDLER
function scoreHandler() {
    // SCORE
    scoreText = game.add.text(680, 10, 'Score: ' + score, {
      font: '20px Arial',
      fontWeight: '900',
      fill: 'red'
    });

    levelText = game.add.text(590, 10, 'Level: ' + level, {
      font: '20px Arial',
      fontWeight: '900',
      fill: 'red'
    });

    gameOverText = game.add.text(280, 100, 'Game Over', {
      font: '50px Arial',
      fontWeight: '900',
      fill: 'Black'
    });

    scoreText.visible = true;
    levelText.visible = true;
    gameOverText.visible = false;
}
// RANDOM FUNCTION FOR A Y POSITION IN B/T 0 AND THE HEIGHT OF THE WORLD
function randomYPos() {
  var y = Math.floor(Math.floor(Math.random() * 400) + 15);
  return y;
}
// RANDOM FUNCTION FOR THE VELOCITY IN THE X AXIS FOR OBJECTS
function randomXVel() {
  var x = Math.floor(Math.floor(Math.random() * -110) - 30);
  return x;
};
// THE GAME OVER STATE
function restart() {
  if (gameOverState) {
    player.visible = false;
    gameState = false;
    pConsumerObject.removeAll();
    predatorObject.removeAll();
    scoreText.visible = false;
    levelText.visible = false;
    gameOverText.visible = true;
    restartImg.visible = true;

    scoreText = game.add.text(370, 180, 'Score: ' + score, {
      font: '25px Arial',
      fontWeight: '900',
      fill: 'Black',
    });

    levelText = game.add.text(370, 230, 'Level: ' + level, {
      font: '25px Arial',
      fontWeight: '900',
      fill: 'Black',
    });

    restartImg.events.onInputDown.add(function () {
      level = 1;
      score = 0;
      changeLevel = 0;
      predatorTimer = 0;
      pConsumerTimer = 0;
      levelText.text = 'Level: ' + level;
      scoreText.text = 'Level: ' + score;
      scoreText.visible = false;
      levelText.visible = false;
      gameOverText.visible = false;
      restartImg.visible = false;
      scoreHandler();
      player.x = 20;
      player.y = game.world.centerY;
      player.visible = true;
      gameState = true;
      gameOverState = false;
    }, this);
  }
}
