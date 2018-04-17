define([], function () {
    var Base;
    (function () {
        Base = function () {

        };
        Base.prototype.thousandBitSeparator = function (num) {
            return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        }
        Base.prototype.on = function (event, handler) {
            !!this.chart && this.chart.on(event, handler);
        }
        Base.prototype.getSize = function (dom) {
            var flag = dom && typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string';
            if (!flag) {
                throw new Error('请传入正确的dom!');
                return;
            }
            return { h: dom.clientHeight, w: dom.clientWidth };
        }
        Base.prototype.resize = function () {
            if (!!this.chart) {
                window.addEventListener('resize', this.chart.resize);
            }
        }
    }())

    return Base;
})