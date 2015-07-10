import skate from '../../../../src/index';

export default skate('bs-icon', {
  properties: {
    from: {
      attr: true,
      init: 'fa'
    },
    prefix: {
      get () {
        return this.from === 'bs' ? 'glyphicon' : this.from;
      }
    },
    type: {
      attr: true,
      set (newValue) {
        this.className += ` ${this.prefix} ${this.prefix}-${newValue}`;
      }
    }
  }
});
