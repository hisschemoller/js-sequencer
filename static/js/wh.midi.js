/**
 * 
 */

window.WH = window.WH || {};

(function(WH) {
    
    function createMidi() {
        var that,
            
            /**
             * Request system for access to MIDI ports.
             */
            detectMidiPorts = function() {
                if (navigator.requestMIDIAccess) {
                    navigator.requestMIDIAccess({
                        sysex: false
                    }).then(onMidiSuccess, onMIDIFailure);
                } else {
                    console.log('Web MIDI API not available.');
                }
            },
        
            /**
             * MIDI access request failed.
             * @param {String}  
             */
            onMIDIFailure = function(errorMsg) {
                console.log('RequestMIDIAccess failed. Error message: ', errorMsg);
            },
            
            /**
             * MIDI access request succeeded.
             * @param {Object} midiAccess MidiAccess object.
             */
            onMidiSuccess = function(midiAccess) {
                var i,
                    port,
                    inputs = midiAccess.inputs.values(),
                    outputs = midiAccess.outputs.values();
                
                if (!midiAccess.inputs.size && !midiAccess.inputs.size) {
                    console.log('No MIDI devices found on this system.');
                }
                
                // console.log('midiAccess: ', midiAccess);
                // console.log('inputs: ', midiAccess.inputs);
                for (port = inputs.next(); port && !port.done; port = inputs.next()) {
                    // console.log('port: ', port);
                    console.log('MIDI input port:', port.value.name + ' (' + port.value.manufacturer + ')');
                }
                for (port = outputs.next(); port && !port.done; port = outputs.next()) {
                    // console.log('port: ', port);
                    console.log('MIDI output port:', port.value.name + ' (' + port.value.manufacturer + ')');
                }
                
            };
        
        that = {};
        that.detectMidiPorts = detectMidiPorts;
        return that;
    }
    
    /**
     * Singleton.
     */
    WH.midi = createMidi();
})(WH);
