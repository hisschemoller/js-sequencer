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
            ppqn = 480,
            models = {
                waveforms: [
                    {label: 'Sine', value: 'sine'},
                    {label: 'Square', value: 'square'},
                    {label: 'Saw', value: 'sawtooth'},
                    {label: 'Triangle', value: 'triangle'}
                ]
            };

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
        
        this.getModel = function(modelKey) {
            if (models.hasOwnProperty(modelKey)) {
                return models[modelKey];
            } else {
                console.error('Model ', modelKey, ' doesn\'t exist.');
            }
        };
    }
    
    /** 
     * Singleton
     */
    WH.Conf = new Conf();
})(WH);
