/**
 * Plugin base objects.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createPlugins(specs) {

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
            },
            getId = function() {
                
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

    function createPlugin() {

        var that,
            soloCallback,

            /**
             * Set the callback function to notify the other channels of a solo parameter change.
             * @param {Function} callback The callback function.
             */
            setSoloCallback = function(callback) {
                soloCallback = callback;
            };

        that = WH.createGeneratorPlugin();
        that.setSoloCallback = setSoloCallback;
        return that;
    }

    WH.plugins = WH.plugins || {};
    WH.plugins['channel'] = {
        create: createPlugin,
        type: 'processor'
    };

})(WH, WX);
