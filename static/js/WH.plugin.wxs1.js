// Copyright 2011-2014 Hongchan Choi. All rights reserved.
// Use of this source code is governed by MIT license that can be found in the
// LICENSE file.

(function (WX) {

    'use strict';

    /**
     * Implements monophonic subtractive synthsizer.
     * @type {WAPL}
     * @param {Object} preset Parameter preset.
     * @param {Number} preset.osc1type Oscillator 1 waveform type.
     * @param {Number} preset.osc1octave Oscillator 1 octave.
     * @param {Number} preset.osc1gain Oscillator 1 gain.
     * @param {Number} preset.osc2type Oscillator 2 waveform type.
     * @param {Number} preset.osc2detune Oscillator 2 detune.
     * @param {Number} preset.osc2gain Oscillator 2 gain.
     * @param {Number} preset.glide Pitch glide time in seconds.
     * @param {Number} preset.cutoff LPF cutoff frequency.
     * @param {Number} preset.reso LPF resonance.
     * @param {Number} preset.filterMod Filter modulation amount.
     * @param {Number} preset.filterAttack Filter envelope attack.
     * @param {Number} preset.filterDecay Filter envelope decay.
     * @param {Number} preset.filterSustain Filter envelope sustain.
     * @param {Number} preset.filterRelease Filter envelope release.
     * @param {Number} preset.ampAttack Amplitude envelope attack.
     * @param {Number} preset.ampDecay Amplitude envelope decay.
     * @param {Number} preset.ampSustain Amplitude envelope sustain.
     * @param {Number} preset.ampRelease Amplitude envelope release.
     * @param {Number} preset.output Plug-in output gain.
     */
    function WXS1(preset) {

        WX.PlugIn.defineType(this, 'Generator');

        // call prototype's constructor
        WH.PlugIn.call(this);

        this._osc1 = WX.OSC();
        this._osc2 = WX.OSC();
        this._osc1gain = WX.Gain();
        this._osc2gain = WX.Gain();
        this._lowpass = WX.Filter();
        this._amp = WX.Gain();

        this._osc1.to(this._osc1gain).to(this._lowpass);
        this._osc2.to(this._osc2gain).to(this._lowpass);
        this._lowpass.to(this._amp);
        this._amp.to(this._output);

        this._osc1.start(0);
        this._osc2.start(0);

        // close envelope by default
        this._amp.gain.value = 0.0;

        // for monophonic behaviour
        this._pitchTimeStamps = {};

        // parameter definition
        WX.defineParams(this, {

            osc1type: {
                type: 'Itemized',
                name: 'Osc 1',
                default: 'square',
                model: WX.WAVEFORMS
            },

            osc1octave: {
                type: 'Generic',
                name: 'Octave',
                default: 0,
                min: -5,
                max: 5,
                unit: 'Octave'
            },

            osc1gain: {
                type: 'Generic',
                name: 'Osc1 Gain',
                default: 0.5,
                min: 0.0,
                max: 1.0,
                unit: 'LinearGain'
            },

            osc2type: {
                type: 'Itemized',
                name: 'Osc 2',
                default: 'square',
                model: WX.WAVEFORMS
            },

            osc2detune: {
                type: 'Generic',
                name: 'Semitone',
                default: 0,
                min: -60,
                max: 60,
                unit: 'Semitone'
            },

            osc2gain: {
                type: 'Generic',
                name: 'Gain',
                default: 0.5,
                min: 0.0,
                max: 1.0,
                unit: 'LinearGain'
            },

            glide: {
                type: 'Generic',
                name: 'Glide',
                default: 0.02,
                min: 0.006,
                max: 1.0,
                unit: 'Seconds'
            },

            cutoff: {
                type: 'Generic',
                name: 'Cutoff',
                default: 1000,
                min: 20,
                max: 5000,
                unit: 'Hertz'
            },

            reso: {
                type: 'Generic',
                name: 'Reso',
                default: 0.0,
                min: 0.0,
                max: 20.0,
                unit: ''
            },

            filterMod: {
                type: 'Generic',
                name: 'FiltMod',
                default: 1.0,
                min: 0.25,
                max: 8.0,
                unit: ''
            },

            filterAttack: {
                type: 'Generic',
                name: 'Filt Att',
                default: 0.02,
                min: 0.0,
                max: 5.0,
                unit: 'Seconds'
            },

            filterDecay: {
                type: 'Generic',
                name: 'Filt Dec',
                default: 0.04,
                min: 0.0,
                max: 5.0,
                unit: 'Seconds'
            },

            filterSustain: {
                type: 'Generic',
                name: 'Filt Sus',
                default: 0.25,
                min: 0.0,
                max: 1.0
            },

            filterRelease: {
                type: 'Generic',
                name: 'Filt Rel',
                default: 0.2,
                min: 0.0,
                max: 10.0,
                unit: 'Seconds'
            },

            ampAttack: {
                type: 'Generic',
                name: 'Amp Att',
                default: 0.02,
                min: 0.0,
                max: 5.0,
                unit: 'Seconds'
            },

            ampDecay: {
                type: 'Generic',
                name: 'Amp Dec',
                default: 0.04,
                min: 0.0,
                max: 5.0,
                unit: 'Seconds'
            },

            ampSustain: {
                type: 'Generic',
                name: 'Amp Sus',
                default: 0.25,
                min: 0.0,
                max: 1.0
            },

            ampRelease: {
                type: 'Generic',
                name: 'Amp Rel',
                default: 0.2,
                min: 0.0,
                max: 10.0,
                unit: 'Seconds'
            }
        });

        WX.PlugIn.initPreset(this, preset);

        this.addEditableParams([{
                key: 'osc1type'
            }, {
                key: 'osc1octave'
            }, {
                key: 'osc1gain'
            }, {
                key: 'osc2type'
            }, {
                key: 'osc2detune'
            }, {
                key: 'osc2gain'
            }, {
                key: 'glide'
            }, {
                key: 'cutoff'
            }, {
                key: 'reso'
            }, {
                key: 'filterMod'
            }, {
                key: 'filterAttack'
            }, {
                key: 'filterDecay'
            }, {
                key: 'filterSustain'
            }, {
                key: 'filterRelease'
            }, {
                key: 'ampAttack'
            }, {
                key: 'ampDecay'
            }, {
                key: 'ampSustain'
            }, {
                key: 'ampRelease'
            }]);
    }

    WXS1.prototype = Object.create(WH.PlugIn);

    WXS1.prototype.info = {
        className: 'WXS1',
        name: 'WXS1 Mono Synth',
        version: '0.0.3',
        api_version: '1.0.0-alpha',
        author: 'Hongchan Choi',
        type: 'Generator',
        description: '2 OSC Monophonic Subtractive Synth'
    };

    WXS1.prototype.defaultPreset = {
        osc1type: 'square',
        osc1octave: -1,
        osc1gain: 0.4,
        osc2type: 'square',
        osc2detune: 7.0,
        osc2gain: 0.4,
        glide: 0.02,
        cutoff: 140,
        reso: 18.0,
        filterMod: 7,
        filterAttack: 0.01,
        filterDecay: 0.07,
        filterSustain: 0.5,
        filterRelease: 0.03,
        ampAttack: 0.2,
        ampDecay: 0.2,
        ampSustain: 0.2,
        ampRelease: 0.2,
        output: 0.8
    };

    WXS1.prototype.$osc1type = function (value, time, rampType) {
        this._osc1.type = value;
    },

    WXS1.prototype.$osc1octave = function (value, time, rampType) {
        this._osc1.detune.set(value * 1200, time, rampType);
    };

    WXS1.prototype.$osc1gain = function (value, time, rampType) {
        this._osc1gain.gain.set(value, time, rampType);
    };

    WXS1.prototype.$osc2type = function (value, time, rampType) {
        this._osc2.type = value;
    };

    WXS1.prototype.$osc2detune = function (value, time, rampType) {
        this._osc2.detune.set(value * 100, time, rampType);
    };

    WXS1.prototype.$osc2gain = function (value, time, rampType) {
        this._osc2gain.gain.set(value, time, rampType);
    };

    WXS1.prototype.$cutoff = function (value, time, rampType) {
        this._lowpass.frequency.set(value, time, rampType);
    };

    WXS1.prototype.$reso = function (value, time, rampType) {
        this._lowpass.Q.set(value, time, rampType);
    };

    /**
     * Returns a key index with the most recent pitch in the map. If all keys
     * are off, returns null.
     */
    WXS1.prototype._getCurrentPitch = function () {
        var latestPitch = null,
            latestTimeStamp = 0;
        for (var pitch in this._pitchTimeStamps) {
            var timeStamp = this._pitchTimeStamps[pitch];
            if (timeStamp > latestTimeStamp) {
                latestTimeStamp = timeStamp;
                latestPitch = pitch;
            }
        }
        return latestPitch;
    };

    WXS1.prototype._changePitch = function (pitch, time) {
        time = (time || WX.now) + this.params.glide.get();
        var freq = WX.mtof(pitch);
        this._osc1.frequency.set(freq, time, 1);
        this._osc2.frequency.set(freq, time, 1);
    };

    WXS1.prototype._startEnvelope = function (time) {
        time = (time || WX.now);
        var p = this.params,
            aAtt = p.ampAttack.get(),
            aDec = p.ampDecay.get(),
            aSus = p.ampSustain.get(),
            fAmt = p.filterMod.get() * 1200,
            fAtt = p.filterAttack.get(),
            fDec = p.filterDecay.get(),
            fSus = p.filterSustain.get();

        this._amp.gain.set(0.0, time);
        this._amp.gain.set(1.00, [time, aAtt], 3);
        this._amp.gain.set(aSus, [time + aAtt, fDec], 3);

        this._lowpass.detune.set(fAmt, [time, fAtt], 3);
        this._lowpass.detune.set(fAmt * fSus, [time + fAtt, fDec], 3);
    };

    WXS1.prototype._releaseEnvelope = function (time) {
        time = (time || WX.now);
        var p = this.params,
            aRel = p.ampRelease.get(),
            fRel = p.filterRelease.get();

        this._amp.gain.cancel(time);
        this._amp.gain.set(0.0, [time, aRel], 3);

        this._lowpass.detune.cancel(time);
        this._lowpass.detune.set(0.0, [time, fRel], 3);
    };

    /**
     * Start a note with pitch, velocity at time in seconds.
     * @param  {Number} pitch    MIDI pitch
     * @param  {Number} velocity MIDI velocity.
     * @param  {Number} time     Time in seconds.
     */
    WXS1.prototype.noteOn = function (pitch, velocity, time) {
        time = (time || WX.now);
        this._pitchTimeStamps[pitch] = time;
        var pitch = this._getCurrentPitch();
        // The first key will start envelopes.
        if (Object.keys(this._pitchTimeStamps).length === 1) {
            this._changePitch(pitch, time);
            this._startEnvelope(time);
        } else {
            this._changePitch(pitch, time);
        }
    };

    /**
     * Stop a note at time in seconds.
     * @param  {Number} pitch    MIDI pitch
     * @param {Number} time Time in seconds.
     */
    WXS1.prototype.noteOff = function (pitch, time) {
        time = (time || WX.now);
        if (this._pitchTimeStamps.hasOwnProperty(pitch)) {
            delete this._pitchTimeStamps[pitch];
        }
        var pitch = this._getCurrentPitch();
        // There is no key pressed. Release envelope.
        if (pitch === null) {
            this._releaseEnvelope(time);
        } else {
            this._changePitch(pitch, time);
        }
    };

    WX.PlugIn.extendPrototype(WXS1, 'Generator');
    WX.PlugIn.register(WXS1);

})(WX);
