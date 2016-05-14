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
            params = {},
            preset = {},
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
            defineParams = function(paramOptions) {
                var key;
                for (key in paramOptions) {
                    paramOptions[key].target = my;
                    paramOptions[key].id = key;
                    params[key] = WH.createParameter(paramOptions[key]);
                }
            },
            getParams = function() {
                return params;
            }
            getParam = function(paramKey) {
                if (params.hasOwnProperty(paramKey)) {
                    return params[paramKey];
                } else {
                    console.error('Unknown parameter ', paramKey, ' on plugin ', my.name, '.');
                }  
            },
            setParamValue = function (paramKey, paramValue) {
                if (params.hasOwnProperty(paramKey)) {
                    params[paramKey].setValue(paramValue);
                }
            },
            getParamValue = function(paramKey) {
                if (params.hasOwnProperty(paramKey)) {
                    return params[paramKey].getValue();
                } else {
                    console.error('Unknown parameter ', paramKey, ' on plugin ', my.name, '.');
                }                
            },
            setPreset = function (newPreset) {
                var paramKey;
                for (paramKey in newPreset) {
                    if (newPreset.hasOwnProperty(paramKey)) {
                        preset[paramKey] = newPreset[paramKey];
                        setParamValue(paramKey, newPreset[paramKey]);
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
                return my.name;
            },
            getTitle = function() {
                return my.title;
            },
            getInlet = function() {
                return my.inlet;
            };

        my = my || {};
        my.id = id;
        my.defineParams = defineParams;
        
        that = {};
        that.to = to;
        that.cut = cut;
        that.getParams = getParams;
        that.getParam = getParam;
        that.setParamValue = setParamValue;
        that.getParamValue = getParamValue;
        that.setPreset = setPreset;
        that.getPreset = getPreset;
        that.getId = getId;
        that.getName = getName;
        that.getTitle = getTitle;
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
        my.input = input;
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
            isMute = false,
            isSolo = false,
            isAnySoloActive = false,
            level,
            soloCallback,
            panner,
            soloMute,

            /**
             * Set the callback function to notify the other channels of a solo parameter change.
             * @param {Function} callback The callback function.
             */
            setSoloCallback = function(callback) {
                soloCallback = callback;
            };

        my = my || {};
        my.name = 'channel'
        my.title = 'Mixer Channel';
        my.defaultPreset = {
            mute: false,
            solo: false,
            pan: 0.0,
            level: 1.0
        };
        my.$mute = function(value, time, rampType) {
            isMute = value;

            if (value) {
                this.soloMute.gain.value = 0.0;
            } else {
                if (isAnySoloActive) {
                    if (isSolo) {
                        soloMute.gain.value = level;
                    } else {
                        soloMute.gain.value = 0.0;
                    }
                } else {
                    soloMute.gain.value = level;
                }
            }
        };

        my.$solo = function(value, time, rampType) {
            isSolo = value;
            
            // callback to notify the other channels of the change
            if (soloCallback) {
                soloCallback(my.id, isSolo);
            }
        };
        
        my.$pan = function(value, time, rampType) {
            panner.setPosition(value, 0, 0.5);
        };

        my.$level = function(value, time, rampType) {
            level = value;
            soloMute.gain.value = level;
        };

        that = WH.createProcessorPlugin(specs, my);
        that.setSoloCallback = setSoloCallback;
        
        my.defineParams({
            mute: {
                type: 'boolean',
                name: 'M',
                default: false
            },
            solo: {
                type: 'boolean',
                name: 'S',
                default: false
            },
            pan: {
                type: 'generic',
                name: 'Pan',
                default: 0.0,
                min: -1.0,
                max: 1.0
            },
            level: {
                type: 'generic',
                name: 'Level',
                default: 1.0,
                min: 0.0,
                max: 1.0
            }
        });
        
        panner = WX.Panner();
        soloMute = WX.Gain();
        my.input.to(soloMute).to(panner).to(my.output);
        level = soloMute.gain.value;
        
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
            osc;

        my = my || {};
        my.name = 'wxs1'
        my.title = 'WXS1 Mono Synth';
        my.defaultPreset = {
            oscType: 'square'
        };
        my.$osc1type = function(value, time, rampType) {
            osc.type = value;
        };
        
        that = WH.createGeneratorPlugin(specs, my);
        
        my.defineParams({
            osc1type: {
                type: 'itemized',
                name: 'Osc 1',
                default: 'square',
                model: WH.Conf.getModel('waveforms')
            }
        });
        
        osc = WX.OSC();
        osc.to(my.output);
        
        return that;
    }

    WH.plugins = WH.plugins || {};
    WH.plugins['wxs1'] = {
        create: createPlugin,
        type: 'generator'
    };

})(WH, WX);


// 1. define local variables and functions
// 2. define my if it doesn't exist
// 2. add data to my
// 3. add data to specs
// 4. create that
// 5. add methods to that
// 6. define plugin parameters
// 7. define parameter callback functions
// 8. set up plugin structure
// 9. return that
