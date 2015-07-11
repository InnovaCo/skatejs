import shade from 'shadejs';
import skate from '../../../../src/index';

export default skate('sk-notice', {
  properties: {
    type: {
      attr: true,
      init: 'info',
      set: function (value) {
        this.querySelector('.notice').className = 'notice notice-' + value;
      }
    }
  },
  template: shade(`
    <p class="notice"><content></content></p>
  `)
});
