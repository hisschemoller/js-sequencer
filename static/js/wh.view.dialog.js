/**
 * DialogView.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     * @param {Object} customOptions
     */
    function DialogView(customOptions) {

        // private variables
        var settings = {
                headerClass: '.dialog__header',
                bodyClass: '.dialog__body',
                primaryClass: '.dialog__button--primary',
                secondaryClass: '.dialog__button--secondary',
            },

            options = {
                type: 'confirm', // alert|confirm|prompt
                headerText: 'What?',
                bodyText: 'Please make a choice.',
                primaryLabel: 'OK',
                secondaryLabel: 'Cancel',
                primaryCallback: null,
                secondaryCallback: null
            },

            /**
             * HTML dialog element.
             * @type {Object}
             */
            dialogEl = $('#overlay-dialog'),

            /**
             * Reference to this, once function has closed.
             * @type {Object}
             */
            self = this,

            /**
             * Initialise the view, add DOM event handlers.
             */
            init = function() {
                options = Object.assign(options, customOptions);
                dialogEl.find(settings.headerClass).text(options.headerText);
                dialogEl.find(settings.bodyClass).text(options.bodyText);
                dialogEl.find(settings.primaryClass).text(options.primaryLabel)
                    .on(self.eventType.click, onButton);
                dialogEl.find(settings.secondaryClass).text(options.secondaryLabel)
                    .on(self.eventType.click, onButton);
                dialogEl.show();

                if (options.type == 'alert') {
                    dialogEl.find(settings.secondaryClass).hide();
                }
            },

            /**
             * Click on primary or secondary button.
             */
            onButton = function(e) {
                dialogEl.find(settings.primaryClass).off(self.eventType.click);
                dialogEl.find(settings.secondaryClass).off(self.eventType.click);

                // primary callback
                if ($(e.currentTarget).hasClass(settings.primaryClass.substr(1)) &&
                    options.primaryCallback) {
                    options.primaryCallback();
                }

                // secondary callback
                if ($(e.currentTarget).hasClass(settings.secondaryClass.substr(1)) &&
                    options.secondaryCallback) {
                    options.secondaryCallback();
                }

                dialogEl.hide();
                delete this;
            };

        // extend AbstractView
        WH.AbstractView.call(this, settings);

        // initialise
        init();
    }

    /**
     * Exports
     */
    WH.DialogView = function(options) {
        return new DialogView(options);
    };
})(WH);
