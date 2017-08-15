(function () {
    var apply = Function.prototype.apply;
    var flatten = apply.bind(Array.prototype.concat, []);

    Array.prototype.selectMany = function (fn) {
        return flatten(this.map(fn));
    };
}());