/**
 * Tabs to switch views in one column layout.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (ns) {
    
    function createTabsView(specs, my) {
        var that,
            channelSelectView = specs.channelSelectView,
            patternSelectView = specs.patternSelectView,
            stepsView = specs.stepsView,
            tracksView = specs.tracksView,
            songView = specs.songView,
            rootEl = $('#tabs'),
            tabNames = ['Sound', 'Mixer', 'Pattern', 'Song'],
            tabTemplate = $('#template-tab'),
            tabEls,
            selectors = {
                tab: '.ctrl--tab'
            },
            
            init = function() {
                var i, n, tabEl;
                
                // add the control button elements
                n = tabNames.length;
                for (i = 0; i < n; i++) {
                    tabEl = tabTemplate.children().first().clone();
                    tabEl.find(my.selectors.ctrlText).text(tabNames[i]);
                    rootEl.append(tabEl);
                }
                
                tabEls = rootEl.find(selectors.tab);
                tabEls.on(my.eventType.click, function(e) {
                    var index = tabEls.index(e.currentTarget);
                    setSelectedTab(index);
                });
            },
            
            /**
             * One of the tab buttons clicked.
             */
             setSelectedTab = function(index) {
                 var tabEl = $(tabEls[index]),
                     isOpen = tabEl.hasClass(my.classes.selected);

                 if (!isOpen) {
                     tabEls.removeClass(my.classes.selected);
                     tabEl.addClass(my.classes.selected);
                     switch (index) {
                         case 0:
                             // open instrument
                             stepsView.setVisible(true);
                             channelSelectView.setVisible(true);
                            //  elements.channelContainer.hide();
                            //  elements.rackContainer.show();
                             patternSelectView.setVisible(false);
                             tracksView.setVisible(false);
                             songView.setVisible(false);
                             break;
                         case 1:
                             // open mixer
                             stepsView.setVisible(true);
                             channelSelectView.setVisible(true);
                            //  elements.channelContainer.show();
                            //  elements.rackContainer.hide();
                             patternSelectView.setVisible(false);
                             tracksView.setVisible(false);
                             songView.setVisible(false);
                             break;
                         case 2:
                             // open patterns
                             stepsView.setVisible(true);
                             channelSelectView.setVisible(true);
                            //  elements.channelContainer.hide();
                            //  elements.rackContainer.hide();
                             patternSelectView.setVisible(true);
                             tracksView.setVisible(true);
                             songView.setVisible(false);
                             break;
                         case 3:
                             // open song
                             stepsView.setVisible(false);
                             channelSelectView.setVisible(false);
                            //  elements.channelContainer.hide();
                            //  elements.rackContainer.hide();
                             patternSelectView.setVisible(false);
                             tracksView.setVisible(false);
                             songView.setVisible(true);
                             break;
                     }
                 }
             };
            
        var my = my || {};
        my.rootEl = rootEl;
        
        that = WH.createBaseView(specs, my);
        
        init();
        
        that.setSelectedTab = setSelectedTab;
        return that;
    }

    ns.createTabsView = createTabsView;

})(WH);
