/**
 * Plugin base objects.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createPlugins(options) {

        var that;

        that = {};
        return that;
    }

    WH.plugins = createPlugins();

})(WH);

(function (WH, WX) {

    function createPlugin(options, my) {

        var that,
            to = function(target) {

            },
            cut = function() {

            },
            setParam = function (param, arg) {

            },
            getParam = function (param) {
                return
            },
            setPreset = function (preset) {

            },
            getPreset = function () {
                return null;
            };

        my = my || {};

        that = {};
        that.to = to;
        that.cut = cut;
        that.setParam = setParam;
        that.getParam = getParam;
        that.setPreset = setPreset;
        that.getPreset = getPreset;
        return that;
    }

    function createGeneratorPlugin(options, my) {

        var that,
            output = WX.Gain(),
            outlet = WX.Gain();

        my = my || {};

        output.to(outlet);

        that = createPlugin(options);
        return that;
    }

    WH.createGeneratorPlugin = createGeneratorPlugin;

})(WH, WX);



(function (WH, WX) {

    function createSynth() {

    }

    WH.createSynth = createSynth;

})(WH, WX);
