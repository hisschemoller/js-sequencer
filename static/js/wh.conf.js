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
    function createConf(specs) {

        var that = specs.that,
            patternCount = 16,
            trackCount = 8,
            patternDurationInBeats = 4,
            stepsPerBeat = 4,
            ppqn = 480,
            models = {
                waveforms: [
                    {label: 'Sine', value: 'sine'},
                    {label: 'Square', value: 'square'},
                    {label: 'Saw', value: 'sawtooth'},
                    {label: 'Triangle', value: 'triangle'}
                ]
            };

        that.getPatternCount = function() {
            return patternCount;
        };

        that.getTrackCount = function() {
            return trackCount;
        };

        that.getPatternDurationInBeats = function() {
            return patternDurationInBeats;
        };

        that.getStepsPerBeat = function() {
            return stepsPerBeat;
        };

        that.getStepCount = function() {
            return patternDurationInBeats * stepsPerBeat;
        };
        
        that.getPPQN = function() {
            return ppqn;
        };
        
        that.getModel = function(modelKey) {
            if (models.hasOwnProperty(modelKey)) {
                return models[modelKey];
            } else {
                console.error('Model ', modelKey, ' doesn\'t exist.');
            }
        };
        
        return that;
    }
    
    /** 
     * Singleton
     */
    WH.createConf = createConf;
})(WH);
