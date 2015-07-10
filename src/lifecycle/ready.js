import registry from '../global/registry';
import walkTree from '../util/walk-tree';

function callReadyOnDescendants (elem, id) {
  walkTree(elem.childNodes, function (child) {
    registry.find(child).forEach(opts => opts.ready.call(child));
  }, null, true);
}

export default function (opts) {
  return function () {
    callReadyOnDescendants(this, opts.id);
    opts.ready.call(this);
  };
}
