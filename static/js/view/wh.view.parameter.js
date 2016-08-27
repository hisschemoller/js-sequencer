/**
 * Overlay with slider to adjust a generic or itemized parameter value.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {
    
    function createParameterEditView(specs) {
        var that,
            rootEl = $('#overlay-parameter-edit'),
            contentEl = rootEl.find('.overlay__content'),
            colorBgEl = rootEl.find('.overlay__color'),
            genericEl = rootEl.find('.overlay__generic'),
            itemizedEl = rootEl.find('.overlay__itemized'),
            sliderEl = rootEl.find('.overlay-ctrl__slider'),
            thumbEl = rootEl.find('.overlay-ctrl__slider-thumb'),
            listEl = rootEl.find('.overlay-ctrl__items'),
            listItemEl = rootEl.find('.overlay-ctrl__item'),
            nameEl = rootEl.find('.overlay-ctrl__name'),
            valueEl = rootEl.find('.overlay-ctrl__value'),
            minEl = rootEl.find('.overlay-ctrl__min'),
            maxEl = rootEl.find('.overlay-ctrl__max'),
            param,
            colorClass,
            
            initDOMEvents = function() {
                
            },
            
            /**
             * Show a parameter's properties.
             * @param {object} parameter Plugin parameter object.
             * @param {string} color CSS class name to set color.
             * @param {event} e Touchstart or mousedown event.
             */
            showParam = function(parameter, color, e) {
                param = parameter;
                colorClass = color;

                colorBgEl.addClass(colorClass);
                rootEl.show();
                setOverlayPosition(e);

                if (param.isTypeGeneric(param.getType())) {
                    showGenericParam(e);
                } else if (param.isTypeItemized(param.getType())) {

                }
            },

            /**
             * Show a generic parameter's properties.
             * @param {event} e Touchstart or mousedown event.
             */
            showGenericParam = function(e) {
                var value = param.getValue(),
                    min = param.getMin(),
                    max = param.getMax(),
                    normalValue = (value - min) / (max - min),
                    userY = my.isTouchDevice ? e.originalEvent.changedTouches[0].clientY : e.clientY,
                    normalUserY = Math.max(0, 1 - Math.min(((userY - sliderEl.offset().top) / sliderEl.height()), 1));

                genericEl.show();
                itemizedEl.hide();
                nameEl.text(param.getName());
                valueEl.text(value.toFixed(2));
                minEl.text(min.toFixed(1));
                maxEl.text(max.toFixed(1));
                thumbEl.height(sliderEl.height() * normalValue);
            },
            
            /**
             * Set the control overlay as close as possible to the mouse position,
             * but within the browser window.
             * @param {object} el jQuery wrapped overlay DOM element.
             * @param {object} e Mouse event to get coordinates from.
             */
            setOverlayPosition = function(e) {
                var x, y,
                    margin = 8;
                
                x = my.isTouchDevice ? e.originalEvent.changedTouches[0].clientX : e.clientX,
                y = my.isTouchDevice ? e.originalEvent.changedTouches[0].clientY : e.clientY;
                x -= contentEl.width() / 2;
                y -= contentEl.height() / 2;
                x = Math.max(margin, Math.min(x, window.innerWidth - contentEl.width() - margin));
                y = Math.max(margin, Math.min(y, window.innerHeight - contentEl.height() - margin));
                contentEl.offset({
                    left: x, 
                    top: y
                });
            };

        var my = my || {};
        my.rootEl = rootEl;

        that = WH.createBaseView(specs, my);
        
        initDOMEvents();
        
        that.showParam = showParam;
        return that;
    }

    WH.createParameterEditView = createParameterEditView;

})(WH);

        
        
