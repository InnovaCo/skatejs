import skate from '../../../src/index';
describe('api/whenReady', function () {
    var selector = 'test-element';

    var testElement = skate('test-element', {
        created: function () {
            this.ready = true;
        }
    });

    beforeEach(function () {
        document.body.innerHTML = '';
    });

    function promiseWasResolved (done) {
        return function () {
            expect(true).to.be.ok();    //if the test reaches this point we're fine
            done();
        }
    }

    it('should resolve if the element has been created by constructor', function (done) {
        var element = new testElement();
        document.body.appendChild(element);
        skate.whenReady(element).then(promiseWasResolved(done));
    });

    it('should resolve if skate.init is called on the element first', function (done) {
        var element = document.createElement('test-element');
        document.body.appendChild(element);
        skate.init(element);
        skate.whenReady(element).then(promiseWasResolved(done));
    });

    it('should resolve if skate.init is called on the element after', function (done) {
        var element = document.createElement('test-element');
        document.body.appendChild(element);
        skate.whenReady(element).then(promiseWasResolved(done));
        skate.init(element);
    });

    it('should resolve if a selector returns one element', function (done) {
        var element = new testElement();
        document.body.appendChild(element);
        skate.whenReady(selector).then(promiseWasResolved(done));
    });

    it('should resolve if a selector returns more than one element', function (done) {
        var element = new testElement();
        var element2 = new testElement();
        document.body.appendChild(element);
        document.body.appendChild(element2);
        skate.whenReady(selector).then(promiseWasResolved(done));
    });

});
