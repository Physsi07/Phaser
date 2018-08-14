let demo = {};

demo.state1.prototype = {
  preload: () => {},

  create: () => {
    game.state.backgroundColor = '#80FF80';
    console.log('state1');
  },

  update: () => {},
};
