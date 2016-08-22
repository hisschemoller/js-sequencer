/**
 * PatternView.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {
    
    function createPatternSelectView(specs) {

        // private variables
        var arrangement = specs.arrangement,
            arrangement = specs.arrangement,
            conf = specs.conf,
            rootEl = $('.patterns'),
            patternTemplate = $('#template-pattern'),
            selectors = {
                pattern: '.pattern'
            },
            patternEls,
            
            /**
             * Initialise the view, add DOM event handlers.
             */
            init = function() {
                addPatternControls();
            },

            /**
             * Add controls for all steps in a pattern track.
             */
            addPatternControls = function() {
                var i = 0,
                    n = conf.getPatternCount(),
                    patternEl;

                for (i; i < n; i++) {
                    patternEl = patternTemplate.children().first().clone();
                    patternEl.find(my.selectors.ctrlText).text(String.fromCharCode(i + 65).toLowerCase());
                    rootEl.append(patternEl);
                }

                patternEls = rootEl.find(selectors.pattern);
                patternEls.on(my.eventType.click, function(e) {
                    console.log('click');
                    var index = patternEls.index(e.currentTarget);
                    if (!isNaN(index)) {
                        arrangement.setSelectedPattern(index);
                    }
                });
            },
            
            /**
             * Set the selected pattern element.
             * @param {Number} index Index of the element to set as selected.
             */
            setSelected = function(index) {
                patternEls.removeClass(my.classes.selected);
                $(patternEls[index]).addClass(my.classes.selected);
            };
        
        var my = my || {};
        my.rootEl = rootEl;
        
        that = WH.createBaseView(specs, my);
        
        init();
        
        that.setSelected = setSelected;
        return that;
    }
    
    WH.createPatternSelectView = createPatternSelectView;
})(WH);
