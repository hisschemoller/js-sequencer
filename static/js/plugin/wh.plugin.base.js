/**
 * Plugin base objects.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createPlugin(specs, my) {

        var that,
            id = specs.id,
            pubSub = specs.pubSub,
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
                my.outlet.cut();
            },
            defineParams = function(paramOptions) {
                var key;
                for (key in paramOptions) {
                    paramOptions[key].key = key;
                    paramOptions[key].callback = paramCallback;
                    params[key] = WH.createParameter(paramOptions[key]);
                }
            },
            
            /**
             * Called by the plugin's parameters if their value is changed.
             */
            paramCallback = function(key, value, time, rampType) {
                // call the plugin's handler for this parameter
                my['$' + key](value, time, rampType);
                // update the plugin's view with the new parameter value
                pubSub.trigger(getId(), {
                    key: key,
                    param: params[key]
                });
            },
            getInfo = function() {
                return 'Plugin name: ' + getName() + ', id: ' + id + ', title: ' + getTitle();
            },
            getParams = function() {
                return params;
            },
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
            },
            getData = function() {
                var data = {
                        name: getName(),
                        preset: {}
                    }, 
                    paramKey;
                for (paramKey in params) {
                    if (params.hasOwnProperty(paramKey)) {
                        data.preset[paramKey] = params[paramKey].getValue();
                    }
                }
                return data;
            };

        my = my || {};
        my.conf = specs.conf;
        my.core = specs.core;
        my.transport = specs.transport;
        my.id = id;
        my.defineParams = defineParams;
        
        that = {};
        
        that.to = to;
        that.cut = cut;
        that.getInfo = getInfo;
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
        that.getData = getData;
        return that;
    }

    function createGeneratorPlugin(specs, my) {

        var that,
            output = specs.core.createGain(),
            outlet = specs.core.createGain();

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
            input = specs.core.createGain(),
            inlet = specs.core.createGain(),
            output = specs.core.createGain(),
            outlet = specs.core.createGain();

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

})(WH);



(function (WH) {

    function createChannelPlugin(specs, my) {
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
            }, 
            onExternalSolo = function(pluginId, isSolo, _isAnySoloActive) {

                isAnySoloActive = _isAnySoloActive;
                
                if (isMute) {
                    soloMute.gain.value = 0.0;
                    return;
                }

                if (pluginId == my.id) {
                    if (isSolo) {
                        soloMute.gain.value = level;
                    } else {
                        if (isAnySoloActive) {
                            soloMute.gain.value = 0.0;
                        } else {
                            soloMute.gain.value = level;
                        }
                    }
                } else {
                    if (isSolo) {
                        soloMute.gain.value = level;
                    } else {
                        if (isAnySoloActive) {
                            soloMute.gain.value = 0.0;
                        } else {
                            soloMute.gain.value = level;
                        }
                    }
                }
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
                soloMute.gain.value = 0.0;
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
        
        panner = my.core.createPanner();
        soloMute = my.core.createGain();
        my.input.to(soloMute).to(panner).to(my.output);
        level = soloMute.gain.value;
        
        that.setSoloCallback = setSoloCallback;
        that.onExternalSolo = onExternalSolo;
        return that;
    }

    WH.plugins = WH.plugins || {};
    WH.plugins['channel'] = {
        create: createChannelPlugin,
        type: 'processor'
    };

})(WH);



(function (WH) {

    function createSimpleOscPlugin(specs, my) {

        var that,
            osc,
            amp,
            lfoOsc,
            lfoGain,
            noteOn = function(pitch, velocity, time) {
                time = (time || amp.context.currentTime);
                amp.gain.set(velocity / 127, amp.context.currentTime, [time, 0.02], 3);
                osc.frequency.set(WH.mtof(pitch), osc.context.currentTime, time, 0);
            },
            noteOff = function(pitch, time) {
                time = (time || amp.context.currentTime);
                amp.gain.set(0, amp.context.currentTime, time);
            };

        my = my || {};
        my.name = 'simpleosc'
        my.title = 'Simple Osc';
        my.defaultPreset = {
            osctype: 'square',
            lfotype: 'sine',
            lforate: 1.0,
            lfodepth: 1.0
        };
        my.$osctype = function(value, time, rampType) {
            osc.type = value;
        };
        my.$lfotype = function (value, time, rampType) {
            lfoOsc.type = value;
        };
        my.$lforate = function (value, time, rampType) {
            lfoOsc.frequency.set(value, lfoOsc.context.currentTime, time, rampType);
        };
        my.$lfodepth = function (value, time, rampType) {
            lfoGain.gain.set(value, lfoGain.context.currentTime, time, rampType);
        };
        
        that = WH.createGeneratorPlugin(specs, my);
        
        my.defineParams({
            osctype: {
                type: 'itemized',
                name: 'Osc Type',
                default: 'square',
                model:  my.conf.getModel('waveforms')
            },
            lfotype: {
                type: 'itemized',
                name: 'LFO Type',
                default: 'sine',
                model:  my.conf.getModel('waveforms')
            },
            lforate: {
                type: 'generic',
                name: 'LFO Rate',
                default: 1.0,
                min: 0.0,
                max: 20.0,
                unit: 'Hz'
            },
            lfodepth: {
                type: 'generic',
                name: 'LFO Depth',
                default: 1.0,
                min: 0.0,
                max: 500.0,
                unit: ''
            }
        });
        
        lfoOsc = my.core.createOsc();
        lfoGain = my.core.createGain();
        osc = my.core.createOsc();
        amp = my.core.createGain();
        osc.to(amp).to(my.output);
        lfoOsc.to(lfoGain).to(osc.detune);
        osc.start(0);
        lfoOsc.start(0);
        amp.gain.value = 0;
        
        that.noteOn = noteOn;
        that.noteOff = noteOff;
        return that;
    }

    WH.plugins = WH.plugins || {};
    WH.plugins['simpleosc'] = {
        create: createSimpleOscPlugin,
        type: 'generator'
    };

})(WH);


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
