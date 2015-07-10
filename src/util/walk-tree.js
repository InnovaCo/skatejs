import ignored from './ignored';

var Node = window.Node;

//TODO refactor this so that it doesn't have four arguments
function walk (elem, fn, filter, isPostOrderTraversal) {
  if (elem.nodeType !== 1 || ignored(elem) || (filter && filter(elem) === false)) {
    return;
  }

  var chren = elem.childNodes;
  var child = chren && chren[0];

  if (!isPostOrderTraversal) {
    fn(elem);
  }

  while (child) {
    walk(child, fn, filter);
    child = child.nextSibling;
  }

  if (isPostOrderTraversal) {
    fn(elem);
  }
}

export default function walkTree (elems, fn, filter, isPostOrderTraversal) {
  if (elems instanceof Node) {
    elems = [elems];
  }

  var elemsLen = elems.length;
  for (let a = 0; a < elemsLen; a++) {
    walk(elems[a], fn, filter, isPostOrderTraversal);
  }
}
