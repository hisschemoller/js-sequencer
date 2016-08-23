/**
 * TracksView shows an overview of each track in a pattern.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (ns) {
    
    function createAppView(specs, my) {
        var that = specs.that,
            rootEl = $('#app'),
            
            /**
             * Number of columns to display based on window width. 
             */
            responsiveCols = 0,
            
            /**
             * Add DOM event handlers.
             */
            initDOMEvents = function() {
                // prevent scroll and iOS bounce effect
                // (doesn't seem to work, at least not in newer iOS versions)
                if (this.isTouchDevice) {
                    document.ontouchmove = function(e) {
                        e.preventDefault();
                    }
                }
                
                // Space to toggle start stop,
                // alt + '~' for startup sequence 
                document.addEventListener('keydown', function(e) {
                    switch (e.keyCode) {
                        case 32:
                            transport.toggleStartStop();
                            break;
                        case 192: // 192 == '~'
                            if (e.altKey) {
                                file.createNew(true);
                                //arrangement.setSelectedPattern(9);
                                arrangement.toggleSongMode();
                                transport.rewind();
                                transport.start();
                            }
                            break;
                    }
                });
                
                window.addEventListener('resize', onResize);
            },
            
            /**
             * Window resize handler.
             */
            onResize = function(e) {
                var w = window.innerWidth,
                    prevResponsiveCols = responsiveCols;
                
                if (w < 640 && responsiveCols !== 1) {
                    responsiveCols = 1;
                } else if (w >= 640 && w < 960 && responsiveCols !== 2) {
                    responsiveCols = 2;
                    isChanged = true;
                } else if (w >= 960 && w < 1280 && responsiveCols !== 3) {
                    responsiveCols = 3;
                } else if (w >= 1280 && responsiveCols !== 4) {
                    responsiveCols = 4;
                }
                
                if (responsiveCols != prevResponsiveCols) {
                    document.getElementsByTagName('main')[0].dataset.cols = responsiveCols;
                }
            };
        
        var my = my || {};
        my.rootEl = rootEl;
        
        that = WH.createBaseView(specs, my);
        
        initDOMEvents();
        onResize();
        
        return that;
    }

    ns.createAppView = createAppView;

})(WH);
