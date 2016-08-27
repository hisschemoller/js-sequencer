    /**
     * Overlay with slider to adjust a generic or itemized parameter value.
     *
     * @namespace WH
     */
    window.WH = window.WH || {};

    (function (WH) {
        
        function createParameterEditView(specs) {
            var that,
                pubSub = specs.pubSub,
                windowEl = $(window),
                rootEl = $('#overlay-parameter-edit'),
                listItemTemplate = $('#template-overlay-ctrl-item'),
                contentEl = rootEl.find('.overlay__content'),
                colorBgEl = rootEl.find('.overlay__color'),
                genericEl = rootEl.find('.overlay__generic'),
                itemizedEl = rootEl.find('.overlay__itemized'),
                sliderEl = rootEl.find('.overlay-ctrl__slider'),
                thumbEl = rootEl.find('.overlay-ctrl__slider-thumb'),
                listEl = rootEl.find('.overlay-ctrl__items'),
                nameEl = rootEl.find('.overlay-ctrl__name'),
                valueEl = rootEl.find('.overlay-ctrl__value'),
                minEl = rootEl.find('.overlay-ctrl__min'),
                maxEl = rootEl.find('.overlay-ctrl__max'),
                unitEl = rootEl.find('.overlay-ctrl__unit'),
                param,
                colorClass,
                isEnabled,
                normalValue,
                normalUserY,
                originalIndex,
                itemEls,
                listOffset,
                listLeft,
                listTop,
                listRight,
                listBottom,
                itemHeight,

                selectors = {
                    listItem: '.overlay-ctrl__item'
                },
                
                /**
                 * Show a parameter's properties.
                 * @param {object} parameter Plugin parameter object.
                 * @param {string} color_class CSS class name to set color.
                 * @param {string} plugin_id ID of plugin of which this is a parameter.
                 * @param {event} e Touchstart or mousedown event.
                 */
                showParam = function(parameter, color_class, plugin_id, e) {
                    param = parameter;
                    colorClass = color_class;
                    pluginId = plugin_id;

                    colorBgEl.addClass(colorClass);
                    rootEl.show();
                    setOverlayPosition(e);

                    pubSub.on(pluginId, onParameterChange);

                    if (param.isTypeGeneric(param.getType())) {
                        showGenericParam(e);
                    } else if (param.isTypeItemized(param.getType())) {
                        showItemizedParam(e);
                    }
                },

                /**
                 * Show a generic parameter's properties.
                 * @param {event} e Touchstart or mousedown event.
                 */
                showGenericParam = function(e) {
                    e.preventDefault();
                    var value = param.getValue(),
                        min = param.getMin(),
                        max = param.getMax(),
                        userY = my.isTouchDevice ? e.originalEvent.changedTouches[0].clientY : e.clientY;

                    isEnabled = false;
                    normalValue = (value - min) / (max - min);
                    normalUserY = Math.max(0, 1 - Math.min(((userY - sliderEl.offset().top) / sliderEl.height()), 1));

                    genericEl.show();
                    itemizedEl.hide();
                    nameEl.text(param.getName());
                    valueEl.text(value.toFixed(2));
                    unitEl.text(param.getUnit());
                    minEl.text(min.toFixed(1));
                    maxEl.text(max.toFixed(1));
                    thumbEl.height(sliderEl.height() * normalValue);
                    windowEl.on(my.eventType.move, onGenericOverlayTouchMove);
                    windowEl.on(my.eventType.end, onGenericOverlayTouchEnd);
                },

                /**
                 * Generic control overlay touchend or mouseup.
                 * @param {Event} e Touch or mouse move event.
                 */
                onGenericOverlayTouchMove = function(e) {
                    e.preventDefault();
                    var min = param.getMin(),
                        max = param.getMax(),
                        userY = my.isTouchDevice ? e.originalEvent.changedTouches[0].clientY : e.clientY,
                        normalValueNow = Math.max(0, 1 - Math.min(((userY - sliderEl.offset().top) / sliderEl.height()), 1)),
                        value = min + ((max - min) * normalValueNow);

                    if (!isEnabled &&
                        ((normalUserY >= normalValue) && (normalValueNow <= normalValue)) ||
                        ((normalUserY <= normalValue) && (normalValueNow >= normalValue))) {
                        isEnabled = true;
                    }
                    
                    if (isEnabled) {
                        param.setValue(value);
                    }
                },

                /**
                 * Generic control overlay touchend or mouseup.
                 * @param {Event} e Touch or mouse end event.
                 */
                onGenericOverlayTouchEnd = function(e) {
                    e.preventDefault();
                    colorBgEl.removeClass(colorClass);
                    rootEl.hide();
                    windowEl.off(my.eventType.move, onGenericOverlayTouchMove);
                    windowEl.off(my.eventType.end, onGenericOverlayTouchEnd);
                    pubSub.off(pluginId, onParameterChange);
                },

                /**
                 * Itemized control pressed on a plugin.
                 * @param {Event} e Touchstart or mousedown event.
                 */
                showItemizedParam = function(e) {
                    e.preventDefault();
                    var model = param.getModel(),
                        i, n, itemEl;
                    
                    itemizedEl.show();
                    genericEl.hide();
                    nameEl.text(param.name);
                    listEl.empty();

                    n = model.length;
                    for (i = 0; i < n; i++) {
                        itemEl = listItemTemplate.children().first().clone();
                        itemEl.text(model[i].label);
                        itemEl.appendTo(listEl);

                        if (param.value == model[i].value) {
                            itemEl.addClass(my.classes.selected);
                        }
                    }

                    itemEls = itemizedEl.find(selectors.listItem);
                    originalIndex = param.getIndex();
                    changedIndex = null;
                    listOffset = listEl.offset();
                    listLeft = listOffset.left;
                    listTop = listOffset.top;
                    listRight = listOffset.left + listEl.width();
                    listBottom = listOffset.top + listEl.height();
                    itemHeight = listEl.height() / model.length;

                    windowEl.on(my.eventType.move, onItemizedOverlayTouchMove);
                    windowEl.on(my.eventType.end, onItemizedOverlayTouchEnd);
                },

                /**
                 * Itemized control overlay touchend or mouseup.
                 * @param {Event} e Touch or mouse move event.
                 */
                onItemizedOverlayTouchMove = function(e) {
                    e.preventDefault();
                    var userX = my.isTouchDevice ? e.originalEvent.changedTouches[0].clientX : e.clientX,
                        userY = my.isTouchDevice ? e.originalEvent.changedTouches[0].clientY : e.clientY,
                        newIndex;

                    if (userX > listLeft && userX < listRight &&
                        userY > listTop && userY < listBottom) {
                        newIndex = Math.floor((userY - listTop) / itemHeight);
                    } else {
                        newIndex = -1;
                    }

                    if (newIndex != changedIndex) {
                        itemEls.removeClass(my.classes.active);
                        if (newIndex == -1) {
                            newIndex = originalIndex;
                        } else {
                            itemEls[newIndex].className += ' ' + my.classes.active;
                        }
                        changedIndex = newIndex;
                        param.setValue(param.getModel()[newIndex].value);
                    }
                },

                /**
                 * Itemized control overlay touchend or mouseup.
                 * @param {Event} e Touch or mouse end event.
                 */
                onItemizedOverlayTouchEnd = function(e) {
                    e.preventDefault();
                    colorBgEl.removeClass(colorClass);
                    rootEl.hide();
                    windowEl.off(my.eventType.move, onItemizedOverlayTouchMove);
                    windowEl.off(my.eventType.end, onItemizedOverlayTouchEnd);
                    pubSub.off(pluginId, onParameterChange);
                },

                /**
                 * Update the view to reflect the changed plugin parameter.
                 * (the data object is not used here because the view already
                 * has a reference to the parameter)
                 * @param {object} data Changed parameter data object.
                 * @param {String} data.paramKey The parameter to change.
                 * @param {Object} data.param Parameter object.
                 */
                onParameterChange = function(data) {
                    if (param.isTypeGeneric(param.getType())) {
                        var normalValue = (param.getValue() - param.getMin()) / (param.getMax() - param.getMin());
                        valueEl.text(param.getValue().toFixed(2));
                        thumbEl.height(sliderEl.height() * normalValue);
                    } else if (param.isTypeItemized(param.getType())) {

                    }
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
            
            that.showParam = showParam;
            return that;
        }

        WH.createParameterEditView = createParameterEditView;

    })(WH);

            
            
