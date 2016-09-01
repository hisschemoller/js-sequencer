/**
 * 
 */

window.WH = window.WH || {};

(function(WH) {
    
    function createMidiView(specs) {
        var that,
            midi = specs.midi,
            rootEl = $('#midi'),
            inSelectEl = rootEl.find('#midi_select-in'),
            outSelectEl = rootEl.find('#midi_select-out'),
            
            setup = function() {
                midi.detectMidiPorts(onMIDISuccess, onMIDIFailure);
            },
            
            /**
             * MIDI access request succeeded.
             * @param {Object} midiAccess MidiAccess object.
             */
            onMIDISuccess = function(midiAccess) {
                var port, option,
                    inputs = midiAccess.inputs.values(),
                    outputs = midiAccess.outputs.values();
                
                for (port = inputs.next(); port && !port.done; port = inputs.next()) {
                    console.log('MIDI input port:', port.value.name + ' (' + port.value.manufacturer + ')');
                    $('<option>')
                        .val(port.value.name)
                        .text(port.value.name + ' (' + port.value.manufacturer + ')')
                        .appendTo(inSelectEl);
                }
                for (port = outputs.next(); port && !port.done; port = outputs.next()) {
                    console.log('MIDI output port:', port.value.name + ' (' + port.value.manufacturer + ')');
                    $('<option>')
                        .val(port.value.name)
                        .text(port.value.name + ' (' + port.value.manufacturer + ')')
                        .appendTo(outSelectEl);
                }
            },
        
            /**
             * MIDI access request failed.
             * @param {String}  
             */
            onMIDIFailure = function(errorString) {
                
            };
        
        that = specs.that;
        that.setup = setup;
        return that;
    }

    WH.createMidiView = createMidiView;
})(WH);
