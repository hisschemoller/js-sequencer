/**
 * Copyright 2011-2014 Hongchan Choi. All rights reserved.
 * Use of this source code is governed by MIT license that can be found in the LICENSE file.
 *
 * Extended by
 * @author Wouter Hisschemöller
 * @description Very simple single oscillator synthesizer.
 */

(function (WX) {

    'use strict';

    /**
     * Implements SimpleOsc2 insturment.
     * @type {WAPL}
     * @name SimpleOsc2
     * @class
     * @memberOf WX
     * @param {Object} preset Parameter preset.
     * @param {GenericParam} preset.oscType Oscillator type.
     * @param {GenericParam} preset.oscFreq Oscillator frequency.
     * @param {ItermizedParam} preset.lfoType LFO type.
     * @param {GenericParam} preset.lfoRate LFO rate.
     * @param {GenericParam} preset.lfoDepth LFO depth.
     */
    function SimpleOsc2(preset) {

        WX.PlugIn.defineType(this, 'Generator');

        // call prototype's constructor
        WH.PlugIn.call(this);

        // patching, lfo frequency modulation
        
        // this._osc = WX.OSC();
        // this._osc.to(this._amp).to(this._output);
        // this._lfo.to(this._lfoGain).to(this._osc1.detune);
        // this._osc.start(0);
        
        
        this._amp = WX.Gain();
        this._osc1 = WX.OSC();
        this._osc2 = WX.OSC();
        this._osc1gain = WX.Gain();
        this._osc2gain = WX.Gain();
        this._osc1.to(this._osc1gain).to(this._amp);
        this._osc2.to(this._osc2gain).to(this._amp);
        this._amp.to(this._output);
        
        this._lfo = WX.OSC();
        this._lfoGain = WX.Gain();
        this._lfo.to(this._lfoGain);
        this._lfoGain.to(this._osc1.detune);
        this._lfoGain.to(this._osc2.detune);
        
        this._lfo.start(0);
        this._osc1.start(0);
        this._osc2.start(0);
        this._osc1gain.gain.value = 1.0;
        this._osc2gain.gain.value = 1.0;
        this._amp.gain.value = 0.0;
        
        this.osc2Detune = 0;

        // parameter definition
        WX.defineParams(this, {

            osc1Type: {
                type: 'Itemized',
                name: 'Osc1 Type',
                default: 'sine', // all code-side representation should be 'value'
                model: WX.WAVEFORMS
            },
            
            osc2Type: {
                type: 'Itemized',
                name: 'Osc2 Type',
                default: 'sine', // all code-side representation should be 'value'
                model: WX.WAVEFORMS
            },

            oscFreq: {
                type: 'Generic',
                name: 'Freq',
                default: WX.mtof(60),
                min: 20.0,
                max: 5000.0,
                unit: 'Hertz'
            },

            lfoType: {
                type: 'Itemized',
                name: 'LFO Type',
                default: 'sine',
                model: WX.WAVEFORMS
            },

            lfoRate: {
                type: 'Generic',
                name: 'Rate',
                default: 1.0,
                min: 0.0,
                max: 20.0,
                unit: 'Hertz'
            },

            lfoDepth: {
                type: 'Generic',
                name: 'Depth',
                default: 1.0,
                min: 0.0,
                max: 500.0,
                unit: 'LinearGain'
            },

            osc2Detune: {
                type: 'Generic',
                name: 'Osc2 Tune',
                default: 0,
                min: -24,
                max: 24,
                unit: 'Semitones'
            }
        });

        WX.PlugIn.initPreset(this, preset);

        this.addEditableParams([{
                key: 'osc1Type'
            }, {
                key: 'osc2Type'
            }, {
                key: 'lfoType'
            }, {
                key: 'lfoRate'
            }, {
                key: 'lfoDepth'
            }, {
                key: 'osc2Detune'
            }]);
    }

    SimpleOsc2.prototype = Object.create(WH.PlugIn);

    SimpleOsc2.prototype.info = {
        name: 'SimpleOsc 2',
        className: 'SimpleOsc2',
        version: '0.0.2',
        api_version: '1.0.0-alpha',
        author: 'Hongchan Choi',
        type: 'Generator',
        description: '2 OSC with LFO'
    };

    SimpleOsc2.prototype.defaultPreset = {
        osc1Type: 'square',
        osc2Type: 'sawtooth',
        oscFreq: WX.mtof(60),
        lfoType: 'sine',
        lfoRate: 2.0,
        lfoDepth: 10.0,
        osc2Detune: 0
    };

    SimpleOsc2.prototype.$osc1Type = function (value, time, rampType) {
      this._osc1.type = value;
    };

    SimpleOsc2.prototype.$osc2Type = function (value, time, rampType) {
      this._osc2.type = value;
    };

    SimpleOsc2.prototype.$oscFreq = function (value, time, rampType) {
      this._osc1.frequency.set(value, time, rampType);
      this._osc2.frequency.set(value + this.osc2Detune, time, rampType);
    };

    SimpleOsc2.prototype.$lfoType = function (value, time, rampType) {
      this._lfo.type = value;
    };

    SimpleOsc2.prototype.$lfoRate = function (value, time, rampType) {
      this._lfo.frequency.set(value, time, rampType);
    };

    SimpleOsc2.prototype.$lfoDepth = function (value, time, rampType) {
      this._lfoGain.gain.set(value, time, rampType);
    };

    SimpleOsc2.prototype.$osc2Detune = function (value, time, rampType) {
      this.osc2Detune = value;
    };

    /**
     * Start a note with pitch, velocity at time in seconds.
     * @param  {Number} pitch    MIDI pitch
     * @param  {Number} velocity MIDI velocity.
     * @param  {Number} time     Time in seconds.
     */
    SimpleOsc2.prototype.noteOn = function (pitch, velocity, time) {
        time = (time || WX.now);
        this._amp.gain.set(velocity / 127, [time, 0.02], 3);
        this.params.oscFreq.set(WX.mtof(pitch + this.osc2Detune), time + 0.02, 0);
        // this.$oscFreq(WX.mtof(pitch), time + 0.02, 0);
    },

    /**
     * Stop a note at time in seconds.
     * @param {Number} pitch    MIDI pitch
     * @param {Number} time Time in seconds.
     */
    SimpleOsc2.prototype.noteOff = function (pitch, time) {
        time = (time || WX.now);
        this._amp.gain.set(0.0, [time, 0.2], 3);
    },

    /**
     * Route incoming event data from other WAAX input devices.
     * @param  {String} action Action type: ['noteon', 'noteoff']
     * @param  {Object} data   Event data.
     * @param  {Object} data.pitch   MIDI Pitch
     * @param  {Object} data.velocity   MIDI Velocity.
     */
    SimpleOsc2.prototype.onData = function (action, data) {
        switch (action) {
            case 'noteon':
                this.noteOn(data.pitch, data.velocity, data.time);
                break;
            case 'noteoff':
                this.noteOff(data.pitch, data.time);
                break;
        }
    };

    WX.PlugIn.extendPrototype(SimpleOsc2, 'Generator');
    WX.PlugIn.register(SimpleOsc2);

})(WX);
