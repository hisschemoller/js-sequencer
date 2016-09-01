/**
 * 
 */

window.WH = window.WH || {};

(function(WH) {
    
    function createMidiView(specs) {
        var that,
            midi = specs.midi,
            rootEl = document.getElementById('midi'),
            inSelectEl = document.getElementById('midi_select-in'),
            outSelectEl = document.getElementById('midi_select-out'),
            
            setup = function() {
                midi.detectPorts(onMIDISuccess, onMIDIFailure);
            },
            
            /**
             * MIDI access request succeeded.
             * @param {Object} midiAccess MidiAccess object.
             */
            onMIDISuccess = function(midiAccess) {
                var port, option,
                    inputs = midiAccess.inputs.values(),
                    outputs = midiAccess.outputs.values();
                console.log(midiAccess);
                console.log(midiAccess.inputs);
                
                for (port = inputs.next(); port && !port.done; port = inputs.next()) {
                    console.log('MIDI input port:', port.value.name + ' (' + port.value.manufacturer + ')');
                    option = document.createElement('option');
                    option.text = port.value.name;
                    option.value = port.value.id;
                    inSelectEl.add(option);
                }
                for (port = outputs.next(); port && !port.done; port = outputs.next()) {
                    console.log('MIDI output port:', port.value.name + ' (' + port.value.manufacturer + ')');
                    option = document.createElement('option');
                    option.text = port.value.name;
                    option.value = port.value.id;
                    outSelectEl.add(option);
                }
                
                inSelectEl.addEventListener('change', onInputSelect);
                outSelectEl.addEventListener('change', onOutputSelect);
            },
        
            /**
             * MIDI access request failed.
             * @param {String} errorMessage 
             */
            onMIDIFailure = function(errorMessage) {
                console.log(errorMessage);
            },
            
            onInputSelect = function(e) {
                midi.selectPort(inSelectEl.value, true);
                midi.getSelectedPort(true).onmidimessage = function(e) {
                    console.log(e.data);
                }
            },
            
            /**
             * Send MIDI notes with pitch depending on keyCode.
             */
            onOutputSelect = function(e) {
                e.preventDefault();
                var outPort, pitch, velocity = 100;
                midi.selectPort(outSelectEl.value);
                outPort = midi.getSelectedPort();
                window.addEventListener('keydown', function(e) {
                    console.log(e.keyCode);
                    pitch = Math.max(0, Math.min(e.keyCode, 127));
                    outPort.send([0x90, pitch, velocity]);
                });
                window.addEventListener('keyup', function(e) {
                    pitch = Math.max(0, Math.min(e.keyCode, 127));
                    outPort.send([0x80, pitch, velocity]);
                });
            };
        
        that = specs.that;
        that.setup = setup;
        return that;
    }

    WH.createMidiView = createMidiView;
})(WH);
