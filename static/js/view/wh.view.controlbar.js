/**
 * controlBarView shows the main controls of the app.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (ns) {
    
    function createControlBarView(specs, my) {
        var that,
            arrangement = specs.arrangement,
            file = specs.file,
            transport = specs.transport,
            rootEl = $('#controlbar'),
            ctrlNames = ['Play', 'Song', 'New', 'Random'],
            ctrlTemplate = $('#template-ctrl-controlbar'),
            ctrlEls,
            ctrlSongMode,
            ctrlPlay,
            selectors = {
                ctrl: '.ctrl--controlbar'
            },
            
            init = function() {
                var i, n, ctrlEl;
                
                // add the control button elements
                n = ctrlNames.length;
                for (i = 0; i < n; i++) {
                    ctrlEl = ctrlTemplate.children().first().clone();
                    ctrlEl.find(my.selectors.ctrlText).text(ctrlNames[i]);
                    rootEl.append(ctrlEl);
                    
                    switch (ctrlNames[i]) {
                        case ctrlNames[0]:
                            ctrlPlay = ctrlEl;
                            break;
                        case ctrlNames[1]:
                            ctrlSongMode = ctrlEl;
                            break;
                    }
                }
                
                ctrlEls = rootEl.find(selectors.ctrl);
                ctrlEls.on(my.eventType.click, onCtrlClick);
            },
            
            /**
             * One of the control bar buttons clicked
             */
            onCtrlClick = function(e) {
                var index = ctrlEls.index(e.currentTarget);
                switch (index) {
                    case 0:
                        // play
                        transport.toggleStartStop();
                        break;
                    case 1:
                        // song
                        arrangement.toggleSongMode();
                        break;
                    case 2:
                        // new
                        transport.pause();
                        WH.createDialogView({
                            headerText: 'New Project',
                            bodyText: 'Are you sure? If you create a new project, the current project will be lost.',
                            primaryCallback: function() {
                                file.createNew();
                            }
                        });
                        break;
                    case 3:
                        // random
                        transport.pause();
                        WH.createDialogView({
                            headerText: 'Random Project',
                            bodyText: 'Are you sure? If you create a new random project, the current project will be lost.',
                            primaryCallback: function() {
                                file.createNew(true);
                            }
                        });
                        break;
                }
            },

            /**
             * Song mode entered or left.
             */
            updateSongMode = function(isSongMode) {
                ctrlSongMode.toggleClass(my.classes.selected, isSongMode);
            },

            /**
             * Playback started or stopped.
             */
            updateTransportState = function(isRunning) {
                ctrlPlay.toggleClass(my.classes.selected, isRunning);
            };
        
        var my = my || {};
        my.rootEl = rootEl;
        
        that = WH.createBaseView(specs, my);
        
        init();
        
        that.updateSongMode = updateSongMode;
        that.updateTransportState = updateTransportState;
        return that;
    }

    ns.createControlBarView = createControlBarView;

})(WH);
