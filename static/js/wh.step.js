/**
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     * @param {Number} pitch MIDI pitch.
     * @param {Number} velocity MIDI velocity.
     * @param {Number} start Start time in tick.
     * @param {Number} duration Note durtion in tick.
     * @param {Number} channel Channel (and instrument) on which this note is played.
     */
    function Step(pitch, velocity, start, duration, channel) {
        this.channel = channel || 0;
        Note.apply(this, arguments);
    }

    /**
     * Extend Note to add extra properties.
     * @type {Note}
     */
    Step.prototype = Note.prototype;
    Step.prototype.constructor = Step;

    /**
     * Create clone of this step with changed start time
     * @param {number} start Start time in tick.
     * @return {Step} Clone of this Step
     */
    Step.prototype.cloneWithChangedStart = function(start) {
        return WH.Step(this.pitch, this.velocity, start, this.duration, this.channel);
    };

    /** 
     * Exports
     */
    WH.Step = function (pitch, velocity, start, duration, channel) {
        return new Step(pitch, velocity, start, duration, channel);
    };
})(WH);
