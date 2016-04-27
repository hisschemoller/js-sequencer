/**
 * Plugin base objects.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH, WX) {

    function createPlugin(specs, my) {

        var that,
            id = specs.id,
            name = specs.name,
            title = specs.title,
            preset = specs.defaultPreset;
            to = function(target) {
                if (target.getInlet && target.getInlet()) {
                    my.outlet.to(target.getInlet());
                    return target;
                } else {
                    try {   
                        my.outlet.to(target);
                        return target;
                    } catch (error) {
                        console.error('Connection failed. Invalid patching.');
                    }
                }
            },
            cut = function() {
                console.log('cut');
            },
            setParam = function (paramKey, paramValue) {
                if (preset.hasOwnProperty(paramKey)) {
                    preset[paramKey] = paramValue;
                }
            },
            getParam = function (paramKey) {
                console.log('getParam: ', paramKey);
                return;
            },
            setPreset = function (newPreset) {
                var paramKey;
                for (paramKey in newPreset) {
                    if (preset.hasOwnProperty(paramKey)) {
                        setParam(paramKey, newPreset[paramKey]);
                    }
                }
            },
            getPreset = function () {
                return preset;
            },
            getId = function() {
                return id;
            },
            getName = function() {
                return name;
            },
            getInlet = function() {
                return my.inlet;
            };

        my = my || {};
        
        that = {};
        that.to = to;
        that.cut = cut;
        that.setParam = setParam;
        that.getParam = getParam;
        that.setPreset = setPreset;
        that.getPreset = getPreset;
        that.getId = getId;
        that.getName = getName;
        that.getInlet = getInlet;
        return that;
    }

    function createGeneratorPlugin(specs, my) {

        var that,
            output = WX.Gain(),
            outlet = WX.Gain();

        my = my || {};
        my.output = output;
        my.outlet = outlet;

        output.to(outlet);

        that = createPlugin(specs, my);
        return that;
    }

    WH.createGeneratorPlugin = createGeneratorPlugin;

    function createProcessorPlugin(specs, my) {

        var that,
            input = WX.Gain(),
            inlet = WX.Gain(),
            output = WX.Gain(),
            outlet = WX.Gain();

        my = my || {};
        my.inlet = inlet;
        my.output = output;
        my.outlet = outlet;
        
        inlet.to(input);
        output.to(outlet);

        that = createPlugin(specs, my);
        return that;
    }

    WH.createProcessorPlugin = createProcessorPlugin;

})(WH, WX);



(function (WH, WX) {

    function createPlugin(specs, my) {

        var that,
            soloCallback,

            /**
             * Set the callback function to notify the other channels of a solo parameter change.
             * @param {Function} callback The callback function.
             */
            setSoloCallback = function(callback) {
                soloCallback = callback;
            };

        my = my || {};
        
        specs.name = 'channel'
        specs.title = 'Mixer Channel';
        specs.defaultPreset = {
            mute: false,
            solo: false,
            pan: 0.0,
            level: 1.0
        };
        specs.params = {
            mute: {
                type: 'Boolean',
                name: 'M',
                default: false
            },
            solo: {
                type: 'Boolean',
                name: 'S',
                default: false
            },
            pan: {
                type: 'Generic',
                name: 'Pan',
                default: 0.0,
                min: -1.0,
                max: 1.0
            },
            level: {
                type: 'Generic',
                name: 'Level',
                default: 1.0,
                min: 0.0,
                max: 1.0
            }
        };

        that = WH.createProcessorPlugin(specs, my);
        that.setSoloCallback = setSoloCallback;
        return that;
    }

    WH.plugins = WH.plugins || {};
    WH.plugins['channel'] = {
        create: createPlugin,
        type: 'processor'
    };

})(WH, WX);



(function (WH, WX) {

    function createPlugin(specs, my) {

        var that,
            osc,
            init = function() {
                osc = WX.OSC();
                osc.to(my.output);
            };

        my = my || {};
        
        specs.name = 'wxs1'
        specs.title = 'WXS1 Mono Synth';
        specs.defaultPreset = {
            oscType: 'square'
        };
        
        that = WH.createGeneratorPlugin(specs, my);
        init();
        return that;
    }

    WH.plugins = WH.plugins || {};
    WH.plugins['WXS1'] = {
        create: createPlugin,
        type: 'generator'
    };

})(WH, WX);
