demo.state2 = () => {};

demo.state2.prototype = {
  preload: () => {},

  create: () => {
    game.state.backgroundColor = '#FAFAFA';
    console.log('state2');
  },

  update: () => {},
};
