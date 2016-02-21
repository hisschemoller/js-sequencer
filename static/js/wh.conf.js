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
            stepCount = 16,
            activeClass = 'is-active',
            selectedClass = 'is-selected';

        this.getPatternCount = function() {
            return patternCount;
        };

        this.getTrackCount = function() {
            return trackCount;
        };

        this.getStepCount = function() {
            return stepCount;
        };

        this.getActiveClass = function() {
            return activeClass;
        };

        this.getSelectedClass = function() {
            return selectedClass;
        };
    }
    
    /** 
     * Singleton
     */
    WH.Conf = new Conf();
})(WH);