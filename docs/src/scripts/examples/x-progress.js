import shade from 'shadejs';
import skate from '../../../../src/index'

skate('x-progress', {
  properties: {
    value: {
      attr: true,
      set (val) {
        var inner = this.querySelector('.progress-bar');
        var outer = this.querySelector('.progress');
        inner.style.width = `${val}%`;
        inner.textContent = `${val}% complete`;
        outer.setAttribute('aria-label', `${val}% completed`);
        outer.setAttribute('aria-valuenow', val);
      }
    }
  },
  template: function () {
    this.innerHTML = `
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" tabindex="0">
        <div class="progress-bar" role="presentation"></div>
      </div>
    `;
  }
});
