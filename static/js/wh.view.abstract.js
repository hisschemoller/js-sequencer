/**
 * ControlsView.
 * 
 * @namespace WH
 */
window.WH = window.WH || {};

function AbstractView(settings) {
    
    var defaults = {
            activeClass: 'is-active',
            selectedClass: 'is-selected'
        };
    
    settings = Object.assign(settings, defaults);
}

AbstractView.prototype = {};

WH.AbstractView = AbstractView;