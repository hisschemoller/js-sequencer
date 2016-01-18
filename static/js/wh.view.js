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
                playStopButton: $('#play-control')
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
            };

        init();
    }
    
    /** 
     * Singleton
     */
    WH.View = new View();
})(WH);