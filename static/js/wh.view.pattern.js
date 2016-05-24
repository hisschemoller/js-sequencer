/**
 * PatternView.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     */
    function PatternView() {

        // private variables
        var settings = {
                patternClass: '.pattern'
            },

            /**
             * HTML elements.
             * @type {Object}
             */
            elements = {
                container: $('.patterns'),
                templates: {
                    pattern: $('#template-pattern')
                }
            },

            /**
             * Reference to this, once function has closed.
             * @type {Object}
             */
            self = this,

            /**
             * Pattern selection controls.
             * @type {Object}
             */
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
                    patternEl;

                for (i; i < WH.Conf.getPatternCount(); i++) {
                    patternEl = elements.templates.pattern.children().first().clone();
                    patternEl.find(settings.ctrlTextClass).text(String.fromCharCode(i + 65).toLowerCase());
                    elements.container.append(patternEl);
                }

                patternEls = elements.container.find(settings.patternClass);
                patternEls.on(self.eventType.click, function(e) {
                    var index = patternEls.index(e.currentTarget);
                    if (!isNaN(index)) {
                        WH.arrangement.setSelectedPattern(index);
                    }
                });
            };

        /**
         * Show or hide the patterns section.
         * @param {Boolean} isVisible True to show the patterns section.
         */
        this.setVisible = function(isVisible) {
            elements.container.toggle(isVisible == true);
        };

        /**
         * Set the selected pattern element.
         * @param {Number} index Index of the element to set as selected.
         */
        this.setSelected = function(index) {
            patternEls.removeClass(settings.selectedClass);
            $(patternEls[index]).addClass(settings.selectedClass);
        };

        // extend AbstractView
        WH.AbstractView.call(this, settings);

        // initialise
        init();
    }

    /**
     * Exports
     */
    WH.PatternView = function() {
        return new PatternView();
    };
})(WH);
