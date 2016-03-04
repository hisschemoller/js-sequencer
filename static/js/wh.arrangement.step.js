/**
 * A Step contains data for a single sound to be player.
 * It extends Note.
 * 
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
     * @param {Number} index Index of this step within the track.
     */
    function Step(pitch, velocity, start, duration, channel, index) {
        this.pitch = (pitch || 60);
        this.velocity = velocity;
        this.start = (start || 0);
        this.duration = (duration || 120);
        this.channel = channel || 0;
        this.absStart = 0;
        this.absEnd = 0;
        this.index = index;
    }

    Step.prototype = {};

    /**
     * Create clone of this step with optional changed start time.
     * @param {Number} start Start time in tick.
     * @return {Step} Clone of this Step.
     */
    Step.prototype.cloneWithChangedStart = function(start) {
        start = start || this.start;
        return WH.Step(this.pitch, this.velocity, start, this.duration, this.channel, this.index);
    };

    /**
     * Set absolute play start time in seconds since audio stream started.
     * @param {number} absStart Start time in seconds.
     */
    Step.prototype.setAbsStart = function(absStart) {
        this.absStart = absStart;
    };

    /**
     * Set absolute play end time in seconds since audio stream started.
     * @param {number} absEnd End time in seconds.
     */
    Step.prototype.setAbsEnd = function(absEnd) {
        this.absEnd = absEnd;
    };

    /**
     * Get all settings that should be saved with a project.
     * @return {Object} All Step properties to save.
     */
    Step.prototype.getData = function() {
        return {
            channel: this.channel,
            pitch: this.pitch,
            velocity: this.velocity,
            start: this.start,
            duration: this.duration
        };
    };

    /** 
     * Exports
     */
    WH.Step = function (pitch, velocity, start, duration, channel, index) {
        return new Step(pitch, velocity, start, duration, channel, index);
    };
})(WH);
