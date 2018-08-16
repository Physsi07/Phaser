var game = new Phaser.Game(800, 600, Phaser.auto, '', {
  preload: preload,
  create: create,
  update: update,
});

// TO LOAD EVERYTHING WE ARE GOING TO NEED FOR THE GAME, IMAGES, AUDIO
function preload() {
  game.load.image('bird', 'Assets/imgs/bird.jpg');
  game.load.image('title', 'Assets/imgs/bgtitle.jpg');
  game.load.image('bgtile', 'Assets/imgs/bg.jpg');
  game.load.image('pipe1', 'Assets/imgs/pipe1.jpg');
  game.load.image('pipe2', 'Assets/imgs/pipe2.jpg');

  // game.load.audio('flap', ['flap.mp3, flap.ogg']);
  // game.load.audio('birdFX1', ['birds1.mp3, birds1.ogg']);
  // game.load.audio('squakFX1', ['squak.mp3, squak.ogg']);
};

function create() {
  game.state.background = '#7CDCE5';
  game.add.sprite(200, 175, 'title');
  bgtile = game.add.titleSprite(0, 350, game.bounds.width.game.cache.getImage('bgtile').height, 'bgtile');
  player = game.add.sprite(350, game.world.height - 250, 'bird');
}

function update() {};
