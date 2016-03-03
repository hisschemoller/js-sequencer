/**
 * Unchangeable application configuration settings.
 * 
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     */
    function Conf() {

        var patternCount = 16,
            trackCount = 4,
            patternDurationInBeats = 4,
            stepsPerBeat = 4,
            ppqn = 480;

        this.getPatternCount = function() {
            return patternCount;
        };

        this.getTrackCount = function() {
            return trackCount;
        };

        this.getPatternDurationInBeats = function() {
            return patternDurationInBeats;
        };

        this.getStepsPerBeat = function() {
            return stepsPerBeat;
        };

        this.getStepCount = function() {
            return patternDurationInBeats * stepsPerBeat;
        };
        
        this.getPPQN = function() {
            return ppqn;
        };
    }
    
    /** 
     * Singleton
     */
    WH.Conf = new Conf();
})(WH);