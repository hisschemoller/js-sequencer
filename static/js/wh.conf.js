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
            stepCount = 16;

        this.getPatternCount = function() {
            return patternCount;
        };

        this.getTrackCount = function() {
            return trackCount;
        };

        this.getStepCount = function() {
            return stepCount;
        };
    }
    
    /** 
     * Singleton
     */
    WH.Conf = new Conf();
})(WH);