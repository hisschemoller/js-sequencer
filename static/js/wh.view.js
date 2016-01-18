/**
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {
    function View() {

        // private
        var settings = {
                activeClass: 'is-active',
            },
            elements = {
                playStopButton: $('#play-control'),
                steps: $('.pattern__step')
            },
            init = function() {
                elements.playStopButton.on('click', onPlayStopClick);
            },
            onPlayStopClick = function(e) {
                if (WH.TimeBase.isRunning()) {
                    WH.TimeBase.pause();
                    elements.playStopButton.removeClass(settings.activeClass);
                } else {
                    WH.TimeBase.start();
                    elements.playStopButton.addClass(settings.activeClass);
                }
            },
            updateSteps = function(index) {
                elements.steps.removeClass(settings.activeClass);
                $(elements.steps[index]).addClass(settings.activeClass);
            };

        this.onStepEvents = function(playbackQueue) {
            var channel = 0,
                i = 0,
                n = playbackQueue.length,
                now = WH.TimeBase.getNow(),
                step,
                start;
            for (i; i < n; i++) {
                step = playbackQueue[i];
                if (step.channel == channel) {
                    start = Math.max(0, WX.now - step.absStart) * 1000;
                    if (start > 0) {
                        setTimeout(function() {
                            updateSteps(step.index);
                        }, start);
                    } else {
                        updateSteps(step.index);
                    }
                }
            }
        };

        init();
    }
    
    /** 
     * Singleton
     */
    WH.View = new View();
})(WH);