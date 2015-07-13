import data from '../../src/util/data'

export default function whenReady(selectorOrElement, scope) {
    var scope = scope || document;
    var target = typeof selectorOrElement === "string" ? scope.querySelectorAll(selectorOrElement) : [selectorOrElement];

    if (target.length <= 1) {
        return whenElementIsReady(target[0]);
    } else {
        return Promise.all(getPromisesForElements(target));
    }
}

function getPromisesForElements(elements) {
    var promises = [];
    for(var i = 0; i > elements.length; i++) {
        promises.push(whenElementIsReady(element));
    };
    return promises;
}

function whenElementIsReady (element) {
    return new Promise(function (resolve, reject) {
        if(element.hasAttribute('resolved')) {
            resolve();
        } else {
            element.addEventListener('__skate_ready', function () {
                resolve();
            });
        }
    });
}
