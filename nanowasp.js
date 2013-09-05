/*!  NanoWasp - A MicroBee emulator
 *  Copyright (C) 2007, 2011 David G. Churchill
 *
 *  This file is part of NanoWasp.
 *
 *  NanoWasp is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  NanoWasp is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var nanowasp = nanowasp || {};


nanowasp.showErrorHtml = function (html) {
    var error_message = document.getElementById("error_message");
    error_message.innerHTML = html;
    document.getElementById("error").style.display = "block";
};

nanowasp.showError = function (text) {
    var error_message = document.getElementById("error_message");
    error_message.innerHTML = "";
    error_message.appendChild(document.createTextNode((new Date()).toLocaleTimeString() + " - " + text));
    document.getElementById("error").style.display = "block";
}

nanowasp.NanoWasp = function () {
    this._sendKeysToMicrobee = true;
};

nanowasp.NanoWasp.prototype = {     
    main: function () {        
        var performDefault = (function (this_) {
            return function (event) {
                return !this_._sendKeysToMicrobee || event.metaKey || !(event.keyCode in nanowasp.Keyboard.capturedKeys);
            };
        })(this);
        
        var pressedKeys = [];
        var inputBuffer = [];

/**
        window.onkeydown = function (event) {
            pressedKeys[event.keyCode] = true;

            var mapped = nanowasp.Keyboard.capturedKeys[event.keyCode];
            if (mapped != undefined) {
                inputBuffer.push(mapped);
            }

            return performDefault(event);
        };
    
        global.onkeypress = function (event) {
            inputBuffer.push(event.charCode);
            return performDefault(event);
        };
    
        global.onkeyup = function (event) {
            pressedKeys[event.keyCode] = false;
            return performDefault(event);
        };

        global.window.addEventListener(
            "paste",
            function (event) {
                var text = event.clipboardData.getData("text/plain");
                for (var i = 0; i < text.length; ++i) {
                    inputBuffer.push(text.charCodeAt(i));
                }
            },
            false);

        keyboardContext = {
            pressed: pressedKeys,
            buffer: inputBuffer
        };
        
        document.getElementById("hide_notice_button").onclick = function () {
            document.getElementById("notice").style.display = "none";
        };
    
        document.getElementById("hide_error_button").onclick = function () {
            document.getElementById("error").style.display = "none";
        };

        var graphicsContext = document.getElementById("vdu").getContext('2d');
        */
        //this.microbee = new nanowasp.MicroBee(graphicsContext, keyboardContext);
var canvas = new fabric.Canvas('c');
//var rect = new fabric.Rect();

//canvas.add(rect); // add object
     //   var canvas = fabric.createCanvasForNode(200, 200);
   //     var rect = new fabric.Rect({
 // left: 100,
 // top: 100,
 // width: 100,
 // height: 50,
 // fill: 'red'
//});
//canvas.add(rect);
        //this.microbee = new nanowasp.MicroBee(graphicsContext, keyboardContext);
       this.microbee = new nanowasp.MicroBee(canvas);

     //   this.microbee = new nanowasp.MicroBee();
        var microbee = this.microbee;
        console.log ("microbee is  " + microbee);    
       /**     
        document.getElementById("tape_menuitem").addEventListener(
            "click", //"DOMActivate",
            utils.bind(this._toggleTapesMenu, this),
            false);
        */
        nanowasp.tapes = [];
        for (var i = 0; i < nanowasp.software.length; ++i) {
            var info = nanowasp.software[i];
            nanowasp.tapes.push(new nanowasp.VirtualTape(info.title, info.filename, info.url, info.tapeParameters));
            console.log ("nanowasp.tapes is  " + nanowasp.tapes[i].title);
        }
      /**  
      //adding new tapes
        var tapeFileInput = document.getElementById("tape_file");
        var update_tapes = utils.bind(this._update_tapes, this);
        tapeFileInput.onchange = function () {
            for (var i = 0; i < tapeFileInput.files.length; ++i) {
                var file = tapeFileInput.files[i];
                if (file.size > 65535) {
                    continue; // TODO: Error message.
                }
                
                (function (f) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = utils.makeUint8Array(reader.result.length);
                        for (var i = 0; i < data.length; ++i) {
                            data[i] = reader.result.charCodeAt(i);
                        }
                        
                        nanowasp.tapes.push(new nanowasp.VirtualTape(f.name, f.name, data, null))
                        update_tapes();
                    };
                    reader.readAsBinaryString(f);  // Not all browsers support readAsArrayBuffer
                })(file);
            }
        };
        */
        this._update_tapes();
        
        this._debugger = new nanowasp.Debugger("registers");
        console.log ("debugger is   " + this._debugger);
    //    document.getElementById("debugger_button").onclick = utils.bind(this._show_debugger, this);

//        document.getElementById("reset_button").onclick = function () { microbee.reset(); };
        
       // window.onblur = utils.bind(microbee.stop, microbee);
       // window.onfocus = utils.bind(microbee.start, microbee);
    
       microbee.start();
    },
    
    _toggleTapesMenu: function () {
        var is_selected = utils.toggleHtmlClass("tape_menu", "selected");
        this._sendKeysToMicrobee = !is_selected;
    },
    
    _hideTapesMenu: function () {
        utils.removeHtmlClass("tape_menu", "selected");
        this._sendKeysToMicrobee = true;
    },
    
    _loadTape: function (tape) {
        if (this._tapeLoadRequest != null) {
            this._tapeLoadRequest.abort();
        }
       /** 
        var selected_tape_name = document.getElementById("selected_tape_name");
        selected_tape_name.innerHTML = "Tape: ";
        selected_tape_name.appendChild(document.createTextNode(tape.title));
        document.getElementById("tape_loading").style.display = "inline";

        var this_ = this;
        this._tapeLoadRequest = this.microbee.loadTape(
            tape,
            function () {
                document.getElementById("tape_loading").style.display = "none";
                this_._tapeLoadRequest = null;
            },
            function (tape, request) {
                nanowasp.showError("Tape failed to load (" + request.status + " " + request.statusText + ")");
                console.log(arguments);
                document.getElementById("tape_loading").style.display = "none";
                this_._tapeLoadRequest = null;
            });
*/
    },

    _onTapeSelected: function (tape) {
        this._loadTape(tape);
        this._hideTapesMenu();
    },
    
    _onTapeEdited: function (tape) {
        // Editing a tape causes it to be selected and rewound because
        // the user most probably wants to load it after editing it.
        this._loadTape(tape);
    },

    _update_tapes: function () {    
        var onTapeSelected = utils.bind(this._onTapeSelected, this);
        var onTapeEdited = utils.bind(this._onTapeEdited, this);
/**
       var tapeItems = document.createDocumentFragment();

        for (var name in nanowasp.tapes) {
            var li = document.createElement("li");
            li.className = "menuitem";
            
            // Reference to TapeView instance is maintained through the DOM
            new nanowasp.TapeView(nanowasp.tapes[name], li, onTapeSelected, onTapeEdited);
            
            tapeItems.appendChild(li);
        }
        
        var tapesMenu = document.getElementById("tapes");
        tapesMenu.innerHTML = "";
        tapesMenu.appendChild(tapeItems); */
    },
    
    _show_debugger: function () {
        var debug = this._debugger;
        debug.update();
        utils.removeHtmlClass("debugger", "hidden");
        this.microbee.setSliceDoneCallback(function() {
            debug.update(); 
        });
      //  var button = document.getElementById("debugger_button");
      //  utils.setTextContent(button, "Hide Debugger");
       // button.onclick = utils.bind(this._hide_debugger, this);
    },
    
    _hide_debugger: function () {
        utils.addHtmlClass("debugger", "hidden");
        this.microbee.setSliceDoneCallback(null);
     //   var button = document.getElementById("debugger_button");
     //   utils.setTextContent(button, "Show Debugger");
     //  button.onclick = utils.bind(this._show_debugger, this);
    }
};
//global.window= {};
global.open = function () {
    // The intention is that this is the first piece of code that actually does anything serious.
    // Up until this point in execution only definitions of functions and simple objects should
    // have been made.  That is, nothing should have been done that would fail in browsers 
    // released in the last few years.
    //
    // The following try/catch should pick up any issues we have that will arise due to missing
    // features as all the features we require are used during the nanowasp.main() call.
    // TODO: It may be a good idea to put a similar try/catch around MicroBee._runSliceBody.
    
    try {
        // nw variable is global to make debugging easier.
        nanowasp.Keyboard.init();
        console.log(chalk.cyan("Hi yo"))
        nw = new nanowasp.NanoWasp();
        nw.main();


    } catch (e) {
        if (typeof(console) != "undefined" && console.log) {
            console.log(e);
        }
        
        // Hopefully at least this will work...
        nanowasp.showErrorHtml(
            "Unfortunately your browser does not support some features required by NanoWasp. " +
            "Try updating your browser to the latest version. " +
            "<a href=\"http://www.google.com/chrome\">Chrome</a> is recommended for best performance.");
    }
};
/*  NanoWasp - A MicroBee emulator
 *  Copyright (C) 2007, 2011 David G. Churchill
 *
 *  This file is part of NanoWasp.
 *
 *  NanoWasp is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  NanoWasp is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var nanowasp = nanowasp || {};

//nanowasp.Crtc = function () {
//nanowasp.Crtc = function (graphicsContext) {
nanowasp.Crtc = function (canvas) {

    this.reset();
 //   this._graphicsContext = graphicsContext;
      this._canvas = canvas;
 //     console.log ("canvas is  " )
};

nanowasp.Crtc.prototype = {
    reset: function () {
        this._selectedRegister = 0;

        this._lpenValid = false;
        this._lpen = 0;
        
        this._emulationTime = 0;
        this._lastFrameTime = 0;

        this._frameTime = 1;  // _frameTime is assumed != 0
        this._vblankTime = 0;
        
        this._cursorPosition = 0;
        this._cursorStart = 0;
        this._cursorEnd = 0;
        this._cursorMode = this.CursorMode.NoBlink;
        this._cursorOn = false;
        this._blinkRate = 0;
        this._frameCounter = 0;
        
        this._displayStart = 0;
        this._hTotal = 0;
        this._hDisplayed = 0;
        this._vTotal = 0;
        this._vTotalAdjustment = 0;
        this._vDisplayed = 0;
        this._scansPerRow = 0;
        
        this._memoryAddress = 0;
        
        this._previousRenderState = [];  // Used to determine if any state has changed that should force a full render.
        this._lastCursorPosition = 0;
    },
    
    restoreState: function (state) {
        this._selectedRegister = state.readByte();
        
        this._memoryAddress = state.readWord();
        
        this._displayStart = state.readWord();
        
        this._hTotal = state.readWord();
        this._hDisplayed = state.readWord();
        this._vTotal = state.readWord();
        this._vTotalAdjustment = state.readWord();
        this._vDisplayed = state.readWord();
        this._scansPerRow = state.readWord();
        
        this._cursorStart = state.readWord();
        this._cursorEnd = state.readWord();
        this._cursorMode = state.readWord();
        this._cursorPosition = state.readWord();
        this._cursorOn = state.readBool();
        this._blinkRate = state.readWord();
        
        this._lpen = state.readWord();
        this._lpenValid = state.readBool();
        
        this._calculateVBlank();
    },
    
    getSize: function () {
        return this.PortIndex.NumPorts;
    },

  //  connect: function (microbee, keyboard, crtcMemory) {
    connect: function (microbee, crtcMemory) {
        this._microbee = microbee;
        //this._keyboard = keyboard;
        this._crtcMemory = crtcMemory;
    },
    
    read: function (address) {
        switch (address % this.PortIndex.NumPorts) {
        case this.PortIndex.Status:
            var STATUS_STROBE = 0x80;
            var STATUS_LPEN = 0x40;
            var STATUS_VBLANK = 0x20;

            var status = STATUS_STROBE;
            
            if (!this._lpenValid) {
                this._keyboard.checkAll();
            }
            
            if (this._lpenValid) {
                status |= STATUS_LPEN;
            }

            if (this._microbee.getTime() % this._frameTime < this._vblankTime) {
                status |= STATUS_VBLANK;
            }
            
            return status;
            
        case this.PortIndex.Data:
            switch (this._selectedRegister) {
            case this.RegisterIndex.CursorPosH:
                return utils.getBits(this._cursorPosition, 8, 6);

            case this.RegisterIndex.CursorPosL:
                return utils.getBits(this._cursorPosition, 0, 8);

            case this.RegisterIndex.LPenH:
                this._lpenValid = false;
                return utils.getBits(this._lpen, 8, 6);

            case this.RegisterIndex.LPenL:
                this._lpenValid = false;
                return utils.getBits(this._lpen, 0, 8);
            
            default:
                return 0xFF;
            }
            
        default:
            return 0xFF;
        }
    },
    
    write: function (address, value) {
        switch (address % this.PortIndex.NumPorts) {
        case this.PortIndex.Address:
            this._selectedRegister = value % this.RegisterIndex.NumRegs;
            break;
            
        case this.PortIndex.Data:
            switch (this._selectedRegister) {
            case this.RegisterIndex.HTot:
                 this._hTotal = value + 1;
                 this._calculateVBlank();
                 break;

             case this.RegisterIndex.HDisp:
                 this._hDisplayed = value;
                 break;

             case this.RegisterIndex.VTot:
                 this._vTotal = utils.getBits(value, 0, 7) + 1;
                 this._calculateVBlank();
                 break;

             case this.RegisterIndex.VTotAdj:
                 this._vTotalAdjustment = utils.getBits(value, 0, 5);
                 this._calculateVBlank();
                 break;

             case this.RegisterIndex.VDisp:
                 this._vDisplayed = utils.getBits(value, 0, 7);
                 break;

             case this.RegisterIndex.Scanlines:
                 this._scansPerRow = utils.getBits(value, 0, 5) + 1;
                 this._calculateVBlank();
                 break;

             case this.RegisterIndex.CursorStart:
                 var BLINK_MODE_OFFSET = 5;   
                 
                 this._cursorStart = utils.getBits(value, 0, 5);
                 this._cursorMode = utils.getBits(value, BLINK_MODE_OFFSET, 2);
                 
                 switch (this._cursorMode) {
                 case this.CursorMode.NoBlink:
                      this._cursorOn = true;
                      this._blinkRate = 0;
                      break; 

                 case this.CursorMode.NoCursor:
                      this._cursorOn = false;
                      this._blinkRate = 0;
                      break;

                 case this.CursorMode.Blink16:
                      this._blinkRate = 16;
                      break;

                 case this.CursorMode.Blink32:
                      this._blinkRate = 32;
                      break;
                 }
                 break;

             case this.RegisterIndex.CursorEnd:
                 this._cursorEnd = utils.getBits(value, 0, 5);
                 break;

             case this.RegisterIndex.DispStartH:
                 this._displayStart = utils.copyBits(this._displayStart, 8, 6, value);
                 break;

             case this.RegisterIndex.DispStartL:
                 this._displayStart = utils.copyBits(this._displayStart, 0, 8, value);
                 break;

             case this.RegisterIndex.CursorPosH:
                 this._cursorPosition = utils.copyBits(this._cursorPosition, 8, 6, value);
                 break;

             case this.RegisterIndex.CursorPosL:
                 this._cursorPosition = utils.copyBits(this._cursorPosition, 0, 8, value);
                 break;

             case this.RegisterIndex.SetAddrH:
                 this._memoryAddress = utils.copyBits(this._memoryAddress, 8, 6, value);
                 break;

             case this.RegisterIndex.SetAddrL:
                 this._memoryAddress = utils.copyBits(this._memoryAddress, 0, 8, value);
                 break;

             case this.RegisterIndex.DoSetAddr:
                 this._keyboard.check(this._memoryAddress);
                 break;
            }
            break;
        }
    },
    
    execute: function (time, duration) {
        console.log ("test it got in here");
        this._emulationTime = time + duration;  // Time to update up to.
        var delta = this._emulationTime - this._lastFrameTime;
        
        if (delta >= this._frameTime) {
            this._render();  // duration may be longer than one frame(?), so this could skip frames.
            
            this._frameCounter += Math.floor(delta / this._frameTime);  // FIXME: This probably drops frames as a result of ignoring the fraction, but it's only used for cursor blinking.
            this._lastFrameTime = this._emulationTime - delta % this._frameTime;  // The emulated time the frame really finished.
            
            if (this._blinkRate > 0 && this._frameCounter > this._blinkRate) {
                this._cursorOn = !this._cursorOn;  // TODO: Verify this.  Modified during porting because the old code didn't seem to make any sense (if condition would always be true?).
                this._frameCounter %= this._blinkRate;
            }
        }
        console
        return this._lastFrameTime + this._frameTime - this._emulationTime;
    },
    
    triggerLpen: function (address) {
        if (this._lpenValid) {
            return;  // Already triggered, ignore new triggers until previous value is read.
        }
        
        this._lpenValid = true;
        this._lpen = address;
    },
    
    getDisplayStart: function () {
        return this._displayStart;
    },
    
    _calculateVBlank: function () {
        var CHAR_CLOCK_HZ = 1687500; 

     //   this._graphicsContext.canvas.width = this._hDisplayed * nanowasp.CrtcMemory.prototype.CHAR_WIDTH;
      //  this._graphicsContext.canvas.height = this._vDisplayed * this._scansPerRow;
        
        this._frameTime = this._hTotal * (this._vTotal * this._scansPerRow + this._vTotalAdjustment) * 1000000 / CHAR_CLOCK_HZ;
        this._vblankTime = this._hTotal * ((this._vTotal - this._vDisplayed) * this._scansPerRow + this._vTotalAdjustment) * 1000000 / CHAR_CLOCK_HZ;
        
        if (this._frameTime == 0) {
            this._frameTime = 1;  // _frameTime is assumed != 0
        }
    },
    
    _render: function () {
        console.log ("ENTERING RENDER");
	var newRenderState = [this._displayStart, this._vDisplayed, this._hDisplayed, this._scansPerRow];
        var fullRenderRequired = false;
        if (!utils.listsMatch(this._previousRenderState, newRenderState)) {
            fullRenderRequired = true;
            this._previousRenderState = newRenderState;
        }
        
        if (fullRenderRequired) {
            console.log ("canvas is  " + this._canvas);
            this._canvas.BACKGROUND_COLOR = nanowasp.CrtcMemory.prototype.BACKGROUND_COLOR_CSS;
       //     this._graphicsContext.fillStyle = nanowasp.CrtcMemory.prototype.BACKGROUND_COLOR_CSS;
        //    this._graphicsContext.fillRect(0, 0, this._graphicsContext.canvas.width, this._graphicsContext.canvas.height);
        }
 

        console.log ("GOT INTO RENDER IF SO WOW");



//var http    = require("http");
// //   console.log ("io is " + io);
//	var socket= io.connect('localhost:8888', {reconnect:true});

//	console.log(1);
//	socket.on('connect', function(socket) {
//	console.log('connected');		

        var address = this._displayStart;
        var x = 0;
        var y = 0;
        for (var row = 0; row < this._vDisplayed; ++row) {
            for (var column = 0; column < this._hDisplayed; ++column) {
                var cursor = null;
                if (this._cursorOn && address == this._cursorPosition) {
                    cursor = [this._cursorStart, this._cursorEnd];
                }
                
                if (fullRenderRequired || cursor != null || address == this._lastCursorPosition || this._crtcMemory.isDirty(address)) {
                   // console.log ("address is " + address);
                   // console.log ("scans per row is  " + this._scansPerRow);
                   // console.log ("cursor is  " + cursor);
                 //                      console.log ("GOT TO THIS POINT B4 DEFINING CHARACTER IMAGE");
                    var characterImage = this._crtcMemory.getCharacterData(address, this._scansPerRow, cursor);

                                   //    console.log ("characterImage is " + characterImage);

j=characterImage;

                    //this._graphicsContext.putImageData(characterImage, x, y, 0, 0, nanowasp.CrtcMemory.prototype.CHAR_WIDTH, this._scansPerRow);
	//	socket.on('getdata',function(){

  io.sockets.on('connection', function (socket) {
  //console.log ("got connected");

//calls the server function getdata 
socket.on('getdata',function(){
  console.log("yo.");
        var charArray = new Array();
        var stringtest = "var dataTest ='" + characterImage +"';";
        charArray.push("var dataTest ='" + stringtest);
//charArray.push (characterImage);  
        charArray.push(";");  
  //receives the data from the printdata server function
  io.sockets.emit('printdata', charArray);
});
});
 // 		console.log("yo render");
		  
		
		
    //    io.sockets.emit('printdata', charArray);
 //       console.log ("DONE EMITTING");    	
	//});  
    }
     

                

                x += nanowasp.CrtcMemory.prototype.CHAR_WIDTH;
                var CRTC_ADDRESS_SIZE = 16384;
                address = (address + 1) % CRTC_ADDRESS_SIZE; 
            }

            y += this._scansPerRow;
            x = 0;
        }
  //      });
        this._lastCursorPosition = this._cursorPosition;
        this._crtcMemory.clearDirtyStatus();
       // console.log ("END OF RENDER METHOD");
    },

    RegisterIndex: {
        HTot:        0,
        HDisp:       1,
        HSyncPos:    2,
        SyncWidth:   3,
        VTot:        4,
        VTotAdj:     5,
        VDisp:       6,
        VSyncPos:    7,
        Mode:        8,
        Scanlines:   9,
        CursorStart: 10,
        CursorEnd:   11,
        DispStartH:  12,
        DispStartL:  13,
        CursorPosH:  14,
        CursorPosL:  15,
        LPenH:       16,
        LPenL:       17,
        SetAddrH:    18,
        SetAddrL:    19,
        
        DoSetAddr:   31,
        NumRegs:     32
    },
    
    PortIndex: {
        Address:  0,
        Status:   0,
        Data:     1,
        NumPorts: 2
    },
    
    CursorMode: {
        NoBlink:  0,
        NoCursor: 1,
        Blink16:  2,
        Blink32:  3
    }
};

if (Object.freeze != undefined) {
    var p = nanowasp.Crtc.prototype;
    Object.freeze(p.RegisterIndex);
    Object.freeze(p.PortIndex);
    Object.freeze(p.CursorMode);
}
/*  NanoWasp - A MicroBee emulator
 *  Copyright (C) 2007, 2011 David G. Churchill
 *
 *  This file is part of NanoWasp.
 *
 *  NanoWasp is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  NanoWasp is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var nanowasp = nanowasp || {};
//nanowasp.CrtcMemory = function (charRomData, graphicsContext) {
nanowasp.CrtcMemory = function (charRomData, canvas) {
    this._charRom = new nanowasp.Rom(charRomData);
    this._pcgRam = new nanowasp.Ram(this.PCG_RAM_SIZE);
    this._videoRam = new nanowasp.Ram(this.VIDEO_RAM_SIZE);
    this._canvas = canvas;
  //  this._graphicsContext = graphicsContext;
    
    this._pcgImages = {};
    this._charRomImages = {};

    this._buildAllCharacters(this._charRomImages, this._charRom);
    
    this.clearDirtyStatus();
};

nanowasp.CrtcMemory.prototype = {
    GRAPHICS_MEMORY_SIZE: 4096,
    VIDEO_RAM_SIZE: 2048,
    PCG_RAM_SIZE: 2048,
    BIT_MA13: 13,
    CHAR_WIDTH: 8,
    MAX_CHAR_HEIGHT: 16,
    FOREGROUND_COLOR: [45, 211, 49, 220],
    BACKGROUND_COLOR: [0, 130, 255, 0],
    BACKGROUND_COLOR_CSS: "rgba(0, 0, 255, 0)",
    BIT_PCG: 7,
    INDEX_START: 0,
    INDEX_COUNT: 7,


    reset: function () {
        this._charRom.reset();
        this._pcgRam.reset();
        this._videoRam.reset();
    },
    
    restoreState: function (state) {
        this._videoRam.restoreState(state);
        this._pcgRam.restoreState(state);
        this._buildAllCharacters(this._pcgImages, this._pcgRam);
    },
    
    connect: function (crtc, latchRom) {
        this._crtc = crtc;
        this._latchRom = latchRom;
    },
    
    getSize: function () {
        return this.GRAPHICS_MEMORY_SIZE;
    },
    
    read: function (address) {
        if (address < this.VIDEO_RAM_SIZE) {
            if (this._latchRom.isLatched()) {
                var baseAddress = utils.getBit(this._crtc.getDisplayStart(), this.BIT_MA13) * this.VIDEO_RAM_SIZE;
                return this._charRom.read(baseAddress + address);
            } else {
                return this._videoRam.read(address);
            }
        } else {
            return this._pcgRam.read((address - this.VIDEO_RAM_SIZE) % this.PCG_RAM_SIZE);
        }
    },
    
    write: function (address, value) {
        if (address < this.VIDEO_RAM_SIZE) {
            if (!this._latchRom.isLatched()) {
                this._videoRam.write(address, value);
                this._dirtyVideoRam[address] = true;  // Assume the new value is different.
            }
        }
        else {
            var pcgAddress = (address - this.VIDEO_RAM_SIZE) % this.PCG_RAM_SIZE;
            this._pcgRam.write(pcgAddress, value);
            var character = pcgAddress / this.MAX_CHAR_HEIGHT | 0;
            var row = pcgAddress % this.MAX_CHAR_HEIGHT;
         //   console.log ("CALLING BCR");
            this._pcgImages[character] = this._buildCharacterRow(this._pcgImages[character], value, row);
            this._dirtyPcgImages[character] = true;
        }
    },
  
    /* Determines whether the character data for the given address has changed since the last render.
     * 
     * The character data is dirty if the character in video memory or its corresponding bitmap data has changed.
     */
    isDirty: function (crtcAddress) {
        var videoAddress = crtcAddress % this.VIDEO_RAM_SIZE;
        if (videoAddress in this._dirtyVideoRam) {
            return true;
        }
        
        var b = this._videoRam.read(crtcAddress % this.VIDEO_RAM_SIZE);
        var isPcg = utils.getBit(b, this.BIT_PCG) == 1;
        if (!isPcg) {
            return false;  // ROM-based bitmaps cannot change.
        }
        
        var character = utils.getBits(b, this.INDEX_START, this.INDEX_COUNT);
        return character in this._dirtyPcgImages;
    },
    
    clearDirtyStatus: function () {
        this._dirtyVideoRam = {};
        this._dirtyPcgImages = {};
    },
    
    getCharacterData: function (crtcAddress, scansPerRow, cursor) {
      //  console.log ("GOT CHARACTER DATA IN THE METHOD NOW");
        var b = this._videoRam.read(crtcAddress % this.VIDEO_RAM_SIZE);
        var character = utils.getBits(b, this.INDEX_START, this.INDEX_COUNT);
        
        var isPcg = utils.getBit(b, this.BIT_PCG) == 1;
        
        if (!isPcg) {
            // Select character ROM bank
         //   console.log ("DO YOU EVEN GET HERE");
            character += utils.getBit(crtcAddress, this.BIT_MA13) * this.VIDEO_RAM_SIZE / this.MAX_CHAR_HEIGHT;
          //  console.log ("character is  " + character);
        }
        
        if (cursor == null || cursor == undefined) {
            var imageCache = isPcg ? this._pcgImages : this._charRomImages;
                //    console.log ("new imageCache is " + imageCache[character]);
            return imageCache[character];
        } else {
            var memory = isPcg ? this._pcgRam : this._charRom;
         //   console.log ("IN ELSE ");
            return this._buildCharacter(null, memory, character * this.MAX_CHAR_HEIGHT, cursor);
        }
    },
    
    _buildAllCharacters: function (cache, memory) {
        // console.log ("IN BUILD ALL CHARACTERS");
          console.log ("memory in bac is" + memory);
          console.log ("cache in bac is" + cache);
          console.log ("cache 0 is    " + cache[0]);
        for (var i = 0; i < memory.getSize() / this.MAX_CHAR_HEIGHT; ++i) {
     //   console.log ("i blah in loop is " + i * this.MAX_CHAR_HEIGHT);

       // console.log ("DO I GET HERE");
            cache[i] = this._buildCharacter(cache[i], memory, i * this.MAX_CHAR_HEIGHT);
          //  console.log("cache i is " + cache[i]);
       //     console.log ("cache data is " + cache[i]);

        }
    },
    
    _buildCharacter: function (image, memory, offset, cursor) {
       //             console.log ("PASSED IMAGES  " + image);
           //  console.log ("in build character");
        //    console.log ("memory is" + memory);
        //    console.log ("offset is" + offset);  
         //   console.log ("cursor is" + cursor);

        var haveCursor = cursor != null && cursor != undefined;
        
        for (var i = 0; i < this.MAX_CHAR_HEIGHT; ++i) {
            var data = memory.read(offset + i);
            
            if (haveCursor && i >= cursor[0] && i <= cursor[1]) {
                data ^= 0xff;
            }
        //    console.log ("GETS TO CALLING BUILDCHARACTERROW");
        //    console.log ("data is  " + data);
           // console.log ("IMAGE BEFORE IS  " + image);
            image = this._buildCharacterRow(image, data, i);
           // console.log ("IMAGE AFTER IS  " + image);
 
        }
       // console.log ("THIS PT");
        return image;
    },
    
    _buildCharacterRow: function (image, data, row) {
        var canvas = new fabric.Canvas('c');
var rect = new fabric.Rect();

canvas.add(rect);
    // console.log ("image is" + image);
 //    console.log ("data is" + data);


        if (image == null || image == undefined) {
           image = canvas;
            // image = this._canvas.createImageData(this.CHAR_WIDTH, this.MAX_CHAR_HEIGHT);
        }
        
        var imageOffset = row * this.CHAR_WIDTH * 4;
        for (var i = this.CHAR_WIDTH - 1; i >= 0; --i) {
            var color = ((data & (1 << i)) != 0) ? this.FOREGROUND_COLOR : this.BACKGROUND_COLOR;
            for (var j = 0; j < color.length; ++j) {
             //   image.data[imageOffset++] = color[j];
            }
        }
        
        return image;
        
    }
};
/*  NanoWasp - A MicroBee emulator
 *  Copyright (C) 2007, 2011 David G. Churchill
 *
 *  This file is part of NanoWasp.
 *
 *  NanoWasp is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  NanoWasp is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var nanowasp = nanowasp || {};

nanowasp.Keyboard = function (keyboardContext) {
    this._keyboardContext = keyboardContext;
};

nanowasp.Keyboard.microbeeToJavascriptKeyMap = [
    222,   // '
    65,    // A
    66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
    90,    // Z
    219,   // [
    220,   // \
    221,   // ]
    192,   // `
    46,    // Delete
    48,    // 0
    49, 50, 51, 52, 53, 54, 55, 56,
    57,    // 9
    186,   // ;
    187,   // =
    188,   // ,
    189,   // -
    190,   // .
    191,   // /
    27,    // Escape
    8,     // Backspace
    9,     // Tab
    34,    // (PgDn) LF
    13,    // Enter
    20,    // Capslock
    35,    // (End) Break
    32,    // Space
    -1,    // Extra key 61  TODO: Map this?
    17,    // Control
    -1,    // Extra key 62  TODO: Map this?
    -1,    // Extra key 65  TODO: Map this?
    -1,    // Extra key 64  TODO: Map this?
    -1,    // Extra key 63  TODO: Map this?
    -1,    // Extra key 66  TODO: Map this?
    16     // Shift
];

nanowasp.Keyboard.capturedKeys = {
    8: '\b'.charCodeAt(0),  // Backspace
    9: '\t'.charCodeAt(0),  // Tab
    13: '\n'.charCodeAt(0), // Enter
    27: '\033'.charCodeAt(0), // Escape
    32: ' '.charCodeAt(0),  // Space
    34: '\r', // PgDn
    35: '\x18'.charCodeAt(0), // End
    46: '\x7f'.charCodeAt(0)  // Delete
};

nanowasp.Keyboard.charactersToMicrobeeKeys = {};

nanowasp.Keyboard.init = function () {
    var toMicrobee = nanowasp.Keyboard.charactersToMicrobeeKeys;
    var shiftCode = 63;

    var unshifted = '@abcdefghijklmnopqrstuvwxyz[\\]' + '^\b0123456789'  + ':;,-./\x1b\x7f\r\t\n\x0f\x18 ';
    var shifted   = '`ABCDEFGHIJKLMNOPQRSTUVWXYZ{|}'  + '~\b0!"#$%&\'()' + '*+<=>?\x1b\x7f\r\t\n\x0f\x18 ';

    for (var i = 0; i < unshifted.length; ++i) {
        toMicrobee[shifted[i].charCodeAt(0)] = [shiftCode, i];  // Shifted first so the unshifted overwrites the shifted if the key doesn't have a shifted version.
        toMicrobee[unshifted[i].charCodeAt(0)] = [i];
    }
}

nanowasp.Keyboard.prototype = {
    KEY_START: 4,
    KEY_BITS: 6,
    BUFFERED_KEY_RATE: 10000,

    connect: function (microbee, crtc, latchrom) {
        this._microbee = microbee;
        this._crtc = crtc;
        this._latchrom = latchrom;
    },

    reset: function () {
        this._lastBufferedKey = undefined;
        this._lastBufferedKeyTime = 0;
    },
        
    check: function (crtcAddress) {        
        var keyCode = utils.getBits(crtcAddress, this.KEY_START, this.KEY_BITS);
        if (this._isPressed(keyCode)) {
            this._crtc.triggerLpen(crtcAddress);
        }
    },
    
    checkAll: function () {
        if (this._latchrom.isLatched()) {
            return;
        }
        
        // Scan in reverse order because higher addressed keys supplant lower addressed keys.
        for (var i = nanowasp.Keyboard.microbeeToJavascriptKeyMap.length - 1; i >= 0; --i) {
            if (this._isPressed(i)) {
                this._crtc.triggerLpen(i << this.KEY_START);
                break;
            }
        }
    },

    _isPressed: function (microbeeCode) {
        if (false) { // (this._keyboardContext.buffer.length == 0) {
            return this._keyboardContext.pressed[nanowasp.Keyboard.microbeeToJavascriptKeyMap[microbeeCode]]
        } else {
            if (this._microbee.getTime() > this._lastBufferedKeyTime + this.BUFFERED_KEY_RATE) {
                this._lastBufferedKeyTime = this._microbee.getTime();

                if (this._lastBufferedKey == undefined) {
                    var charCode = this._keyboardContext.buffer.shift();
                    this._lastBufferedKey = nanowasp.Keyboard.charactersToMicrobeeKeys[charCode];                    
                } else {
                    this._lastBufferedKey = undefined; // simulate key release
                }
            }

            return this._lastBufferedKey != undefined && this._lastBufferedKey.indexOf(microbeeCode) >= 0;
        }
    }
};/*  NanoWasp - A MicroBee emulator
 *  Copyright (C) 2007, 2011 David G. Churchill
 *
 *  This file is part of NanoWasp.
 *
 *  NanoWasp is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  NanoWasp is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var nanowasp = nanowasp || {};

nanowasp.LatchRom = function () {
    this._isLatched = false;
};

nanowasp.LatchRom.prototype = {
    reset: function () {
        this._isLatched = false;
    },
        
    restoreState: function (state) {
        this._isLatched = state.readBool();
    },
    
    read: function (address) {
        return 0;  // Cannot be read
    },
    
    write: function (address, value) {
        this._isLatched = utils.getBit(value, 0) == 1;
    },
    
    getSize: function () {
        return 1;
    },
    
    isLatched: function() {
        return this._isLatched;
    }
};/*  NanoWasp - A MicroBee emulator
 *  Copyright (C) 2007, 2011 David G. Churchill
 *
 *  This file is part of NanoWasp.
 *
 *  NanoWasp is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  NanoWasp is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var nanowasp = nanowasp || {};

nanowasp.MemMapper = function() {
};

nanowasp.MemMapper.prototype = {
    connect: function (z80, rams, roms, crtcMemory) {
        this._z80 = z80;
        this._rams = rams;
        this._roms = roms;
        this._crtcMemory = crtcMemory;
    },
    
    reset: function () {
        this.write(0, 0);
    },
    
    restoreState: function (state) {
        this.write(0, state.readByte());
    },
    
    getSize: function () {
        return 1;
    },
        
    read: function (address) {
        return 0;  // MemMapper cannot be read.
    },

    write: function (address, value) {
        var BANK_MASK = 0x07;
        var ROM_DISABLE_MASK = 0x04;
        var VIDEO_RAM_DISABLE_MASK = 0x08;
        var VIDEO_RAM_LOCATION_MASK = 0x10;
        var ROM_SELECT_MASK = 0x20;
        
        var LOW_BLOCK = 0x0000;
        var HIGH_BLOCK = 0x8000;
        var HIGH_BLOCK_A = HIGH_BLOCK;
        var HIGH_BLOCK_B = HIGH_BLOCK + 0x4000;
        var GRAPHICS_ADDRESS_A = 0x8000;
        var GRAPHICS_ADDRESS_B = 0xF000;
                
        // Lower 32k
        switch (value & BANK_MASK)
        {
        case 0:
        case 6:
            this._z80.registerMemoryDevice(LOW_BLOCK, this._rams[1]); 
            break;

        case 1:
        case 7:
            this._z80.registerMemoryDevice(LOW_BLOCK, this._rams[3]); 
            break;

        case 2:
        case 4:
            this._z80.registerMemoryDevice(LOW_BLOCK, this._rams[0]); 
            break;

        case 3:
        case 5:
            this._z80.registerMemoryDevice(LOW_BLOCK, this._rams[2]); 
            break;
        }

        // Upper 32k
        if (value & ROM_DISABLE_MASK) {
            this._z80.registerMemoryDevice(HIGH_BLOCK, this._rams[1]);
        } else {
            this._z80.registerMemoryDevice(HIGH_BLOCK_A, this._roms[0]);

            if (value & ROM_SELECT_MASK) {
                this._z80.registerMemoryDevice(HIGH_BLOCK_B, this._roms[2]);
            } else {
                this._z80.registerMemoryDevice(HIGH_BLOCK_B, this._roms[1]);
            }
        }

        // Video RAM - *this must be last* so that it overrides any other handlers already registered
        if (!(value & VIDEO_RAM_DISABLE_MASK))
        {
            // Enable video RAM
            if (value & VIDEO_RAM_LOCATION_MASK) {
                this._z80.registerMemoryDevice(GRAPHICS_ADDRESS_A, this._crtcMemory);
            } else {
                this._z80.registerMemoryDevice(GRAPHICS_ADDRESS_B, this._crtcMemory);
            }
        }
    }
};
/*  NanoWasp - A MicroBee emulator
 *  Copyright (C) 2007, 2011 David G. Churchill
 *
 *  This file is part of NanoWasp.
 *
 *  NanoWasp is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  NanoWasp is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var nanowasp = nanowasp || {};

nanowasp.Ram = function (size) {
	this._memory = utils.makeUint8Array(size);
};

nanowasp.Ram.prototype = {
    reset: function () {
        this._memory = utils.makeUint8Array(this.getSize());
    },
        
    getSize: function () {
        return this._memory.length;
    },
    
    restoreState: function (state) {
        this._memory = state.readBuffer(this.getSize());
    },
        
	read: function (address) {
		return this._memory[address];
	},

	write: function (address, value) {
		this._memory[address] = value;
	}
};


nanowasp.Rom = function (data) {
   // console.log ("data is  " + data);
	this._memory = data;
};

nanowasp.Rom.prototype = {
    reset: function () {
    },
        
    getSize: function () {
        return this._memory.length;
    },
        
	read: function (address) {
		return this._memory[address];
	},
	
	write: function (address, value) {
		// no-op (writing to ROM)
	}
};
/*  NanoWasp - A MicroBee emulator
 *  Copyright (C) 2007, 2011 David G. Churchill
 *
 *  This file is part of NanoWasp.
 *
 *  NanoWasp is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  NanoWasp is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var nanowasp = nanowasp || {};
nanowasp.MicroBee = function (canvas) {
console.log ("canvas is " + canvas);
//nanowasp.MicroBee = function () {
        console.log ("Got into microbee initialisation");
//nanowasp.MicroBee = function (graphicsContext, keyboardContext) {
    this._isRunning = false;
    this._runSlice = utils.bind(this._runSliceBody, this);
    this._sliceDoneCallback = null;
    
    // Create the devices
    this._devices = {};
    nanowasp.z80cpu = new nanowasp.Z80Cpu();  // TODO: Code in z80cpu relies on the Z80Cpu instance being available here.  Need to eliminate the globals from the z80 emulation code so this restriction can be removed.
    this._devices.z80 = nanowasp.z80cpu;
   // this._devices.keyboard = new nanowasp.Keyboard(keyboardContext);
    this._devices.latchrom = new nanowasp.LatchRom();
   // this._devices.crtc = new nanowasp.Crtc();
    this._devices.crtc = new nanowasp.Crtc(canvas);
    //this._devices.crtc = new nanowasp.Crtc(graphicsContext);
    this._devices.memMapper = new nanowasp.MemMapper();
    this._devices.rom1 = new nanowasp.Rom(utils.decodeBase64(nanowasp.data.roms.basic_5_22e));
    this._devices.rom2 = new nanowasp.Rom(utils.makeUint8Array(16384));
    this._devices.rom3 = new nanowasp.Rom(utils.makeUint8Array(16384));
    this._devices.ram0 = new nanowasp.Ram(32768);
    this._devices.ram1 = new nanowasp.Ram(32768);
    this._devices.ram2 = new nanowasp.Ram(32768);
    this._devices.ram3 = new nanowasp.Ram(32768);
    this._devices.crtcMemory = new nanowasp.CrtcMemory(utils.decodeBase64(nanowasp.data.roms["char"]));
    //this._devices.crtcMemory = new nanowasp.CrtcMemory(utils.decodeBase64(nanowasp.data.roms["char"]), graphicsContext);
    this._devices.crtcMemory = new nanowasp.CrtcMemory(utils.decodeBase64(nanowasp.data.roms["char"]), canvas);

    this._devices.tapeInjector = new nanowasp.TapeInjector(this._devices.z80);
    
    this._runnables = [this._devices.z80, this._devices.crtc];
    this._runningDevice = null;

    // Connect the devices
        console.log ("going to connect devices");
    var roms = [ this._devices.rom1, this._devices.rom2, this._devices.rom3 ];
    var rams = [ this._devices.ram0, this._devices.ram1, this._devices.ram2, this._devices.ram3 ];
    this._devices.memMapper.connect(this._devices.z80, rams, roms, this._devices.crtcMemory);
   // this._devices.keyboard.connect(this, this._devices.crtc, this._devices.latchrom);
   // this._devices.crtc.connect(this, this._devices.keyboard, this._devices.crtcMemory);
    this._devices.crtc.connect(this, this._devices.crtcMemory);
    this._devices.crtcMemory.connect(this._devices.crtc, this._devices.latchrom);
    
    // Register the ports
    nanowasp.z80cpu.registerPortDevice(0x0b, this._devices.latchrom);
    
    nanowasp.z80cpu.registerPortDevice(0x0c, this._devices.crtc);
    nanowasp.z80cpu.registerPortDevice(0x0e, this._devices.crtc);
    nanowasp.z80cpu.registerPortDevice(0x1c, this._devices.crtc);
    nanowasp.z80cpu.registerPortDevice(0x1e, this._devices.crtc);
 //   console.log ("finished registering port devices");
    for (var i = 0x50; i <= 0x57; ++i) {
        nanowasp.z80cpu.registerPortDevice(i, this._devices.memMapper);
    }
    
    this.currentTape = null;
//    console.log ("registered current tape as null");
    // Reset everything to get ready to start
    this.reset();
  //  console.log ("finished resetting");
};

nanowasp.MicroBee.prototype = {
    MAX_MICROS_TO_RUN: 200000,
        
    reset: function () {
       // console.log ("into reset function");
        for (var i in this._devices) {
            console.log (" i letter is " + i);
            //console.log ("devices i is " + devices[i]);
            this._devices[i].reset();
        }
        
        this._emulationTime = 0;
        
        // Note: Setting _microsToRun to MAX_MICROS_TO_RUN on reset solves a problem where when the CRTC
        //       is reset it will indicate a frame time of 1us.  If the initial slice executes enough code
        //       to initialise the CRTC then everything is OK.  If we start running slices of only 1us
        //       duration then everything slows to a crawl.  TODO: Fix this properly (e.g. ensure CRTC never
        //       returns too small an interval; or, implement a MIN_MICROS_TO_RUN).
        this._microsToRun = this.MAX_MICROS_TO_RUN;
    },

    restoreState: function (state) {
        for (var key in state) {
            var reader = new utils.BinaryReader(utils.decodeBase64(state[key]));
            this._devices[key].restoreState(reader);
        }
    },
    
    setSliceDoneCallback: function (cb) {
        this._sliceDoneCallback = cb;
    },
    
    _runSliceBody: function () {
      //  console.log ("inside runslicebody");
        var nextMicros = this.MAX_MICROS_TO_RUN;
        
        for (var i in this._runnables) {
            this._runningDevice = this._runnables[i];
            console.log ("this_runningdevice is " + this._runningDevice);
         //   console.log ("checkpoint 2");

            var deviceNextMicros = this._runningDevice.execute(this._emulationTime, this._microsToRun);
            console.log ("checkpoint 2.5");

            if (deviceNextMicros != 0) {
                   //     console.log ("checkpoint 3");
                nextMicros = Math.min(nextMicros, deviceNextMicros);
            }
        }

        this._runningDevice = null;
        this._emulationTime += this._microsToRun;
        this._microsToRun = nextMicros;

        if (this._sliceDoneCallback != null) {
            this._sliceDoneCallback();
        }

        if (this._isRunning) {
            var elapsedRealTimeMs = (new Date()).getTime() - this._startRealTime;
            var elapsedEmulationTimeMs = (this._emulationTime - this._startEmulationTime) / 1000;
            var delay = elapsedEmulationTimeMs - elapsedRealTimeMs;
            delay = Math.max(0, delay);
          //  window.setTimeout(this._runSlice, delay);
        }
      //  console.log ("gets to end");
    },
    
    getTime: function () {
        if (this._runningDevice != null) {
            return this._emulationTime + this._runningDevice.getCurrentExecutionTime();
        }
        
        return this._emulationTime;
    },
    
    start: function () {
        if (!this._isRunning) {
            this._isRunning = true;
            this._startRealTime = (new Date()).getTime();
            this._startEmulationTime = this._emulationTime;
            this._runSlice();
           // console.log ("DONE RUN SLICE");
        }
    },
    
    stop: function () {
        this._isRunning = false;
    },
    
    getIsRunning: function () {
        return this._isRunning;
    },
    
    loadTape: function (tape, onSuccess, onError) {
        var this_ = this;
        return tape.getFormattedData(
            function (data) {
                this_._devices.tapeInjector.setData(data);
                this_.currentTape = tape;
                onSuccess(tape);
            },
            function (request) {
                onError(tape, request);
            });
    }
};
/*  NanoWasp - A MicroBee emulator
 *  Copyright (C) 2007, 2011 David G. Churchill
 *
 *  This file is part of NanoWasp.
 *
 *  NanoWasp is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  NanoWasp is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var utils = {
    // Bit manipulation functions
        
    getBit: function (value, bit) {
        return (value >> bit) & 1;
    },
    
    getBits: function (value, start, count) {
        return (value >> start) % (1 << count);
    },
    
    clearBits: function (value, start, count) {
        return value & ~(((1 << count) - 1) << start);
    },
    
    copyBits: function (old, start, count, value) {
        return utils.clearBits(old, start, count) | (utils.getBits(value, 0, count) << start);
    },
    
    
    // Basic DOM stuff
    addHtmlClass: function (elementId, className) {
        var element = document.getElementById(elementId);
        var classes = element.className.split(/\s+/);
        for (var i = 0; i < classes.length; ++i) {
            if (classes[i] == className) {
                return;
            }
        }
        classes.push(className);
        element.className = classes.join(" ");
    },
    
    removeHtmlClass: function (elementId, className) {
        var element = document.getElementById(elementId);
        var classes = element.className.split(/\s+/);
        var newClasses = [];
        for (var i = 0; i < classes.length; ++i) {
            if (classes[i] != className) {
                newClasses.push(classes[i]);
            }
        }
        element.className = newClasses.join(" ");
    },
    
    // Removes the 'className' class from 'elementId' if it currently contains it and vice-versa.
    // Returns true if the class is now enabled or false otherwise.
    toggleHtmlClass: function (elementId, className) {
        var element = document.getElementById(elementId);
        var classes = element.className.split(/\s+/);
        var newClasses = [];
        var wasActive = false;
        for (var i = 0; i < classes.length; ++i) {
            if (classes[i] != className) {
                newClasses.push(classes[i]);
            } else {
                wasActive = true;
            }
        }
        if (!wasActive) {
            newClasses.push(className);
        }
        element.className = newClasses.join(" ");
        
        return !wasActive;
    },
    
    setTextContent: function (element, text) {
        element.innerHTML = "";
        element.appendChild(document.createTextNode(text));
    },
    
    // Missing feature implementation
    
    bind: (function () {}).bind == undefined
        ? function (func, target) { return function () { func.apply(target, arguments); }; }
        : function (func, target) { return func.bind(target); },
                
    makeUint8Array: typeof(Uint8Array) == "undefined"
        ? function (size) { var arr = new Array(size); for (var i = 0; i < size; ++i) arr[i] = 0; return arr; }
        : function (size) { return new Uint8Array(size); },

        
    // Base64 decoder
        
    decodeBase64: function (s) {
        var encode = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var decode = {};
        for (var i = 0; i < encode.length; ++i) {
            decode[encode.charAt(i)] = i;
        }
        
        s = s.replace(/=/g, "");
        
        var len = (s.length / 4 | 0) * 3;
        if (s.length % 4 > 0) {
            len += s.length % 4 - 1;
        }
        var result = utils.makeUint8Array(len);
        
        var resultIndex = 0;
        for (var i = 0; i < s.length; i += 4) {
            var packet = s.substring(i, i + 4);
            
            var bytes = 3;
            switch (packet.length) {
            case 0:
            case 1:
                throw "Unexpected packet length";
                
            case 2:
                bytes = 1;
                break;
            
            case 3:
                bytes = 2;
                break;
            }
            
            while (packet.length < 4) {
                packet += "A";  // zero padding;
            }

            var bits = 0;
            for (var j = 0; j < packet.length; ++j)
            {
                var val = decode[packet[j]];
                if (val === undefined) {
                    throw "Unexpected character";
                }
                
                bits <<= 6;
                bits |= val;
            }
            
            var shift = 16;
            while (bytes > 0) {
                result[resultIndex++] = (bits >> shift) & 0xff;
                bytes--;
                shift -= 8;
            }
        }
        
        return result;
    },
    
    // XMLHttpRequest
    
    ajaxGetBinary: function (url, onSuccess, onError) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        if (request.overrideMimeType) {
            request.overrideMimeType('text/plain; charset=x-user-defined');
        }
        
        request.onreadystatechange = function () {
            if (request.readyState == 4) {  
                if (request.status == 200) {
                    var response, getByte;
                    if (typeof(request.responseBody) != "undefined") {
                        response = new VBArray(request.responseBody).toArray();
                        getByte = function (i) { return response[i]; };
                    } else {
                        var response = request.responseText;
                        getByte = function (i) { return response.charCodeAt(i) & 0xff; };
                    }

                    var buffer = utils.makeUint8Array(response.length);
                    for (var i = 0; i < response.length; ++i) {
                        buffer[i] = getByte(i);
                    }

                    onSuccess(buffer);
                } else {
                    onError(request);
                }
            }
        };
        
        request.send(null);
        
        return request;
    },
    
    // Other
    
    listsMatch: function (l1, l2) {
        if (l1.length != l2.length) {
            return false;
        }
        
        for (var i = 0; i < l1.length; ++i) {
            if (l1[i] != l2[i]) {
                return false;
            }
        }
        
        return true;
    }
};

utils.BinaryReader = function(array) {
    this._array = array;
    this._offset = 0;
};

utils.BinaryReader.prototype = {
    readByte: function () {
        var result = this._array[this._offset];
        this._offset++;
        return result;
    },
    
    readWord: function () {
        return this.readByte() | (this.readByte() << 8);
    },
    
    readBool: function () {
        return this.readByte() != 0;
    },
    
    readBuffer: function(length) {
        var buffer = utils.makeUint8Array(length);
        for (var i = 0; i < length; ++i) {
            buffer[i] = this.readByte();
        }
        
        return buffer;
    }
};

utils.MemoryStream = function(array) {
    this._array = array;
    this._offset = 0;
    this._checksum8 = 0;
};

utils.MemoryStream.prototype = {
    write: function (b) {
        this._array[this._offset++] = b;
        this._checksum8 = ((256 + b - this._checksum8) & 0xFF) ^ 0xFF;
    },
    
    clearChecksum8: function () {
        this._checksum8 = 0;
    },
    
    writeChecksum8: function () {
        this.write(this._checksum8);
        this.clearChecksum8();
    },
    
    read: function () {
        if (this._offset >= this._array.length) {
            return undefined;
        }
        
        return this._array[this._offset++];
    }
};
/*  NanoWasp - A MicroBee emulator
 *  Copyright (C) 2007, 2011 David G. Churchill
 *
 *  This file is part of NanoWasp.
 *
 *  NanoWasp is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  NanoWasp is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* Functions called by the z80 emulation code */

function readbyte_internal(address) {
    var entry = nanowasp.z80cpu._memoryHandlers[address / nanowasp.z80cpu._memoryBlockSize | 0];  // (x | 0) coerces x into an integer
    return entry.handler.read(address - entry.base);
}

function writebyte_internal(address, value) {
    var entry = nanowasp.z80cpu._memoryHandlers[address / nanowasp.z80cpu._memoryBlockSize | 0];  // (x | 0) coerces x into an integer
    entry.handler.write(address - entry.base, value);
}

function readport(address) {
    address &= 0xff;
    var entry = nanowasp.z80cpu._portHandlers[address / nanowasp.z80cpu._portBlockSize | 0];  // (x | 0) coerces x into an integer
    return entry.handler.read(address - entry.base);
}

function writeport(address, value) {
    address &= 0xff;
    var entry = nanowasp.z80cpu._portHandlers[address / nanowasp.z80cpu._portBlockSize | 0];  // (x | 0) coerces x into an integer
    entry.handler.write(address - entry.base, value);    
}


var nanowasp = nanowasp || {};

/* Z80Cpu currently only supports a single instance because the emulation code uses a bunch of globals */
nanowasp.Z80Cpu = function () {
    if (nanowasp.Z80Cpu.IsInstantiated) {
        throw "Only supports one instance";
    }
    nanowasp.Z80Cpu.IsInstantiated = true;
    
    z80_init();
    
    var nullHandler = {
        read: function (address) {
            return 0;
        },
        
        write: function (address, value) {
        }
    };
    
    this._memoryBlockSize = this.MEMORY_SIZE;
    this._memoryHandlers = [{ handler: nullHandler, base: 0 }];
    
    this._portBlockSize = this.PORT_SIZE;
    this._portHandlers = [{ handler: nullHandler, base: 0 }];
};

nanowasp.Z80Cpu.IsInstantiated = false;

nanowasp.Z80Cpu.prototype = {
    FREQUENCY_HZ: 3375000,
    MEMORY_SIZE: 65536,
    PORT_SIZE: 256,
    
    reset: function () {
        z80_reset();
    },
    
    restoreState: function(state) {
        z80.f = state.readByte();
        z80.a = state.readByte();
        z80.c = state.readByte();
        z80.b = state.readByte();
        z80.e = state.readByte();
        z80.d = state.readByte();
        z80.l = state.readByte();
        z80.h = state.readByte();
        z80.ixl = state.readByte();
        z80.ixh = state.readByte();
        z80.iyl = state.readByte();
        z80.iyh = state.readByte();
        z80.sp = state.readWord();
        
        z80.f_ = state.readByte();
        z80.a_ = state.readByte();
        z80.c_ = state.readByte();
        z80.b_ = state.readByte();
        z80.e_ = state.readByte();
        z80.d_ = state.readByte();
        z80.l_ = state.readByte();
        z80.h_ = state.readByte();
        
        state.readWord();  // For some reason the Z80 emulator used by the C++ code stores alternate copies of IX, IY and SP.
        state.readWord();
        state.readWord();

        z80.pc = state.readWord();
        z80.r = state.readByte();
        z80.i = state.readByte();
        z80.iff1 = state.readByte();
        z80.iff2 = state.readByte();
        z80.im = state.readByte();
    },
    
    execute: function (time, duration) {
        tstates = 0;
        event_next_event = duration * this.FREQUENCY_HZ / 1000000;  // TODO: Should check how many cycles we did last time and adjust this.  See original C++ code.
        z80_do_opcodes();
        return 0;  // Execute again as soon as possible.
    },
    
    getCurrentExecutionTime: function () {
        return tstates * 1000000 / this.FREQUENCY_HZ;
    },
    
    setBreakpoint: function (address, handler) {
        z80_set_breakpoint(address, handler);
    },
    
    clearBreakpoint: function () {
        z80_clear_breakpoints();
    },
    
    registerMemoryDevice: function (address, handler) {
        var updated = this._registerDevice(address, handler, this.MEMORY_SIZE, this._memoryBlockSize, this._memoryHandlers);
        this._memoryBlockSize = updated.blockSize;
        this._memoryHandlers = updated.handlers;
    },
    
    registerPortDevice: function (address, handler) {
        var updated = this._registerDevice(address, handler, this.PORT_SIZE, this._portBlockSize, this._portHandlers);
        this._portBlockSize = updated.blockSize;
        this._portHandlers = updated.handlers;
    },
    
    _registerDevice: function (address, handler, limit, blockSize, handlers) {
        var start = address;
        var end = start + handler.getSize();
        
        var startAlignment = 1;
        var endAlignment = 1;
        
        if (end > limit) {
            throw "Handler doesn't fit in range";
        }
        
        while ((start & startAlignment) == 0 && startAlignment < limit) {
            startAlignment <<= 1;
        }
        
        while ((end & endAlignment) == 0 && endAlignment < limit) {
            endAlignment <<= 1;
        }
        
        var alignment = Math.min(startAlignment, endAlignment);
        
        if (alignment < blockSize) {
            // Smaller blocks are required to store the details of this handler, so rebuild 
            // the mem_handlers vector at the new size.

            var newHandlers = [];
            
            for (var i = 0; i < handlers.length; ++i) {
                for (var j = 0; j < blockSize / alignment; ++j) {
                    newHandlers.push(handlers[i]);
                }
            }
            
            handlers = newHandlers;
            blockSize = alignment;
        }
        
        // Install the new handler
        var entry = { handler: handler, base: address };
        for (var i = start / blockSize; i < end / blockSize; ++i) {
            handlers[i] = entry;
        }
        
        return {
            blockSize: blockSize,
            handlers: handlers
        };
    }
};

/*  NanoWasp - A MicroBee emulator
 *  Copyright (C) 2007, 2011 David G. Churchill
 *
 *  This file is part of NanoWasp.
 *
 *  NanoWasp is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  NanoWasp is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*!
 *   Virtual tape support based on TAP file idea in uBee512. 
 */

var nanowasp = nanowasp || {};

nanowasp.VirtualTape = function (title, filename, urlOrData, tapeParameters) {
    if (typeof(urlOrData) == "string")
    {
        this.url = urlOrData;
    }
    else
    {
        if (urlOrData.length > 0xFFFF) {
            throw {
                name: "ArgumentError",
                message: "'urlOrData' must be less than 64k in size."
            };
        }
        
        this.data = urlOrData;
    }
    
    this.title = title;
    this.filename = filename;
    
    if (tapeParameters == null) {
        tapeParameters = nanowasp.VirtualTape.getDefaultParameters(filename);
    }
    
    this.typeCode = tapeParameters[0];
    this.startAddress = tapeParameters[1];
    this.autoStartAddress = tapeParameters[2];
    this.isAutoStart = tapeParameters[3];
    this.extra = tapeParameters[4];
};

nanowasp.VirtualTape.getDefaultParameters = function (filename) {
    var tapeTypes = {
        default_: ['B', 0x08C0, 0x0000, false, 0x00],
        bee: ['M', 0x0900, 0x0900, true, 0x00],
        bin: ['M', 0x0900, 0x0900, true, 0x00],
        z80: ['M', 0x0900, 0x0900, true, 0x00],
        com: ['M', 0x0100, 0x0100, true, 0x00],
        asm: ['S', 0x1000, 0x0000, false, 0x00],
        edt: ['S', 0x1000, 0x0000, false, 0x00],
        mac: ['S', 0x1000, 0x0000, false, 0x00],
        pas: ['S', 0x1000, 0x0000, false, 0x00],
        txt: ['S', 0x1000, 0x0000, false, 0x00],
        wbf: ['W', 0x0900, 0x0000, false, 0x00]
    };
    
    var tapeParameters = tapeTypes.default_;
    
    var match = filename.match(/\.(...)$/);
    if (match != null) {
        var extension = match[1].toLowerCase();
        if (extension in tapeTypes) {
            tapeParameters = tapeTypes[extension];
        }
    }
    
    return tapeParameters;
};

nanowasp.VirtualTape.prototype = {
    // Asynchronously gets a byte array containing the data as it would be stored
    // on tape (i.e. including tape header and checksummed blocks).  On success, the
    // onSuccess function will be called with the first parameter set to the result.
    // If an error occurs then onError will be called with its first parameter
    // set to the tape.  onSuccess may be called immediately from within this method
    // if the data is already available.
    //
    // Returns an XMLHttpRequest object which can be used to abort or check the status
    // of the request.
    getFormattedData: function (onSuccess, onError) {
        if (this.data != null) {
            onSuccess(this._formatData());
            return;
        }
        
        var this_ = this;
        return utils.ajaxGetBinary(
            this.url,
            function (data) {
                this_.data = data;
                onSuccess(this_._formatData());
            },
            function (request) {
                onError(request);
            })
    },

    _formatData: function () {
        var headerLength = 40 + 1 + 16 + 1;
        var blockSize = 256;
        var fullBlockCount = Math.floor(this.data.length / blockSize);
        var finalBlockSize = this.data.length % blockSize;
        var dataLength = fullBlockCount * (blockSize + 1);
        if (finalBlockSize > 0) {
            dataLength += finalBlockSize + 1;
        }

        var formattedData = utils.makeUint8Array(headerLength + dataLength);
        var stream = new utils.MemoryStream(formattedData);
        
        // lead-in
        for (var i = 0; i < 40; ++i) {
            stream.write(0);
        }
        
        // header indicator
        stream.write(1);
        
        // header
        stream.clearChecksum8();
        
        for (var i = 0; i < 6; ++i) {
            if (i < this.filename.length) {
                stream.write(this.filename.charCodeAt(i));
            } else {
                stream.write(' '.charCodeAt(0));
            }
        }
        
        stream.write(this.typeCode.charCodeAt(0));
        
        stream.write(this.data.length & 0xFF);  // TODO: Add a stream write function that writes shorts.
        stream.write(this.data.length >> 8);
        
        stream.write(this.startAddress & 0xFF);
        stream.write(this.startAddress >> 8);
        
        stream.write(this.autoStartAddress & 0xFF);
        stream.write(this.autoStartAddress >> 8);
        
        stream.write(0x00); // baud flag
        
        if (this.isAutoStart) {
            stream.write(0xFF);
        } else {
            stream.write(0x00);
        }
        
        stream.write(this.extra);
        
        stream.writeChecksum8();
        
        // data
        var dataStream = new utils.MemoryStream(this.data);
        for (var i = 0; i < fullBlockCount; ++i) {
            for (var j = 0; j < blockSize; ++j) {
                stream.write(dataStream.read());
            }
            stream.writeChecksum8();
        }
        
        if (finalBlockSize > 0) {
            for (var j = 0; j < finalBlockSize; ++j) {
                stream.write(dataStream.read());
            }
            stream.writeChecksum8();
        }
        
        return formattedData;
    }
};


/*  NanoWasp - A MicroBee emulator
 *  Copyright (C) 2007, 2011 David G. Churchill
 *
 *  This file is part of NanoWasp.
 *
 *  NanoWasp is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  NanoWasp is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*!
 *   Virtual tape support based on TAP file idea in uBee512. 
 */

var nanowasp = nanowasp || {};

nanowasp.TapeInjector = function (z80cpu) {
    this._z80cpu = z80cpu;
    this._data = [];
    this._offset = 0;

    this._write_state = ['find_header', 0];
};

nanowasp.TapeInjector.prototype = {
    READ_LOCATION: 0xAB6D,

    WRITE_LOCATION: 0xAB26,
     
    reset: function () {
        this._offset = 0;
        this._z80cpu.setBreakpoint(this.READ_LOCATION, utils.bind(this._readByte, this));
        this._z80cpu.setBreakpoint(this.WRITE_LOCATION, utils.bind(this._writeByte, this));
    },
    
    setData: function (data) {
        this._data = data;
        this._offset = 0;
    },
    
    _readByte: function () {
        var value = 0;
        if (this._offset < this._data.length) {
            value = this._data[this._offset];
            this._offset++;
        }
        
        z80.a = value;
        z80_ret();
    },

    _writeByte: function () {
        var value = z80.a;
        z80_ret();

        // TODO: Merge this parser in with the serializer in VirtualTape, and share the type detection.

        var string_t = ['', function (a, n) { return a + String.fromCharCode(n); }];
        var int_t = [0, function (a, n) { return a / 256 + 256 * n; }];  // Er, well it works for 2 bytes :D
        var null_t = [0, function (a, n) { return 0; }];

        var header = [
            ['name', 6, string_t],
            ['type', 1, string_t],
            ['length', 2, int_t],
            ['skip', 8, null_t]
        ];

        var blockSize = 256;

        switch (this._write_state[0]) {
            case 'find_header':
                if (value == this._write_state[1]) {
                    switch (this._write_state[1]) {
                        case 0:
                            this._write_state[1] = 1;
                            break;

                        case 1:
                            this._write_state = ['header', 0, 0];
                            this._write_header = {};
                    }
                }
                break;

            case 'header':
                var entry = header[this._write_state[1]];

                if (this._write_state[2] == 0) {
                    this._write_header[entry[0]] = entry[2][0];
                }

                this._write_header[entry[0]] = entry[2][1](this._write_header[entry[0]], value);
                this._write_state[2] += 1;

                if (this._write_state[2] == entry[1]) {
                    this._write_state[1] += 1;
                    this._write_state[2] = 0;

                    if (this._write_state[1] == header.length) {
                        this._write_state = ['data', 0];
                        this._write_data = [];
                    }
                }
                break;

            case 'data':
                if (this._write_state[1] == blockSize) {
                    // Checksum, ignore
                    this._write_state[1] = 0;
                } else {
                    this._write_data.push(value);
                    this._write_state[1] += 1;
                }

                if (this._write_data.length == this._write_header['length']) {
                    console.log('Got file ' + this._write_header.name + ' of type ' + this._write_header.type + ' with length ' + this._write_header.length);
                    //var blob = new Blob([new Uint8Array(this._write_data)], {type: 'application/octet-binary'});
                    //saveAs(blob, this._write_header.name.trimRight() + (this._write_header.type == 'M' ? '.bin' : '.mwb'));
                    
                    // There'll be one more checksum byte, but the find_header state will ignore it.
                    this._write_state = ['find_header', 0];
                }
                break;
        }
    }
};
/*  NanoWasp - A MicroBee emulator
 *  Copyright (C) 2007, 2011 David G. Churchill
 *
 *  This file is part of NanoWasp.
 *
 *  NanoWasp is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  NanoWasp is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


var nanowasp = nanowasp || {};


nanowasp.TapeView = function (tape, parentBlockElement, onTapeSelected, onTapeEdited) {
    this._tape = tape;
    this._parentBlockElement = parentBlockElement;
    this._form = null;
    this._buildView(onTapeSelected, onTapeEdited);
};

nanowasp.TapeView.prototype = {
    _buildView: function (onTapeSelected, onTapeEdited) {
        var this_ = this;  // For closures
        
        this._nameSpan = document.createElement("span");
        this._nameSpan.className = "link";
        this._nameSpan.onclick = function () {
            onTapeSelected(this_._tape);
        };
        this._nameSpan.appendChild(document.createTextNode(this._tape.title));
        
        var editDiv = document.createElement("div");
        editDiv.className = "link right";
        editDiv.onclick = function () {
            if (this_._form == null) {
                this_._insertForm(onTapeEdited);
                editDiv.innerHTML = "done";
            } else {
                this_._removeForm();
                editDiv.innerHTML = "edit";
            }
        };
        editDiv.appendChild(document.createTextNode("edit"));

        this._parentBlockElement.appendChild(editDiv);
        this._parentBlockElement.appendChild(this._nameSpan);
    },
        
    _insertForm: function (onTapeEdited) {
        var this_ = this;
        var toHex = function (v) { return "0x" + v.toString(16); };
        
        var nameValidator = function (v) {
            this_._nameSpan.innerHTML = "";
            this_._nameSpan.appendChild(document.createTextNode(v));
            return v;
        };
        
        this._form = this._createForm(
            this._tape,
            [
                { property: 'title', label: 'Name', validator: nameValidator },
                { property: 'typeCode', label: 'Type code' },
                { property: 'extra', label: 'Spare byte', validator: this._integerValidator(0, 0xFF), renderer: toHex },
                { property: 'startAddress', label: 'Load address', validator: this._integerValidator(0, 0xFFFF), renderer: toHex },
                { property: 'autoStartAddress', label: 'Start address', validator: this._integerValidator(0, 0xFFFF), renderer: toHex },
                { property: 'isAutoStart', label: 'Auto started', type: 'checkbox' }
            ],
            2,
            function () { onTapeEdited(this_._tape); });

        this._parentBlockElement.appendChild(this._form);
    },
    
    _removeForm: function () {
        if (this._form != null) {
            this._form.parentNode.removeChild(this._form);
            this._form = null;
        }
    },
    
    _integerValidator: function(min, max) {
        var validator = function (value) {
            var base = null;
            if (/^[0-9]+$/.test(value)) {
                base = 10;
            } else if (/^0x[0-9a-f]+$/i.test(value)) {
                base = 16;
            }
            
            if (base == null) {
                return undefined;
            }
            
            var result = parseInt(value, base);
            
            if (result >= min && result <= max) {
                return result;
            }
            
            return undefined;
        };
        
        validator.message = "Enter a number between " + min + " and " + max + ".";
        
        return validator;
    },
    
    _createForm: function(data, fields, width, onChange) {
        var form = document.createElement('form');
        var have_width = typeof(width) != 'undefined';
        var parent = form;
        
        for (var i = 0; i < fields.length; ++i) {
            if (have_width && i % width == 0) {
                var parent = document.createElement('p');
                form.appendChild(parent);
            }
            
            parent.appendChild(this._createInput(data, fields[i], onChange));
        }
        
        return form;
    },
    
    _createInput: function (data, field, onChange) {
        var type = field.type;
        if (type == undefined) {
            type = 'text';
        }
        
        var input_el = document.createElement('input');
        input_el.type = type;
        
        var renderer = field.renderer;
        if (renderer == undefined) {
            renderer = function (v) { return v; };
        }
        if (type == 'checkbox') {
            input_el.checked = renderer(data[field.property]);
        } else {
            input_el.value = renderer(data[field.property]);
        }
        
        var validator = field.validator;
        if (validator == undefined) {
            validator = function (v) { return v; };
        }
        input_el.onchange = function () {
            var new_value;
            if (type == 'checkbox') {
                new_value = validator(input_el.checked);
            } else {
                new_value = validator(input_el.value);
            }
            if (new_value != undefined) {
                data[field.property] = new_value;
                label_el.className = "";
                onChange();
            } else {
                label_el.className = "invalid";
            }
        };
        
        var label_el = document.createElement('label');
        
        var label_first = type != 'checkbox';
        
        if (label_first) {
            label_el.appendChild(document.createTextNode(field.label));            
            label_el.appendChild(input_el);
        } else {
            label_el.appendChild(input_el);
            label_el.appendChild(document.createTextNode(field.label));                        
        }
        
        return label_el;
    }
};
/*  NanoWasp - A MicroBee emulator
 *  Copyright (C) 2007, 2011 David G. Churchill
 *
 *  This file is part of NanoWasp.
 *
 *  NanoWasp is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  NanoWasp is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var nanowasp = nanowasp || {};

nanowasp.software = [
    {
        title: "Camel Race",
        url: "software/camel.mwb",
        filename: "camel.mwb"
    },
    {
        title: "Frankenstein's Monster",
        url: "software/frank.mwb",
        filename: "frank.mwb",
        tapeParameters: ["B", 0x08C0, 0x0000, false, 0x47]
    },
    {
        title: "Jeksil's Revenge",
        url: "software/jeksil.mwb",
        filename: "jeksil.mwb"
    },
    {
        title: "The Towers of Hanoi",
        url: "software/hanoi.mwb",
        filename: "hanoi.mwb"
    },

    {
        title: "Depth Charge",
        author: "Brad Robinson",
        url: "software/brad_robinson/d-charge.bee",
        filename: "d-charge.bee"
    },
    {
        title: "Laser Blazer",
        author: "Brad Robinson",
        url: "software/brad_robinson/lazer.bee",
        filename: "lazer.bee"
    },
    {
        title: "Robot Fire",
        author: "Brad Robinson",
        url: "software/brad_robinson/robotf.bee",
        filename: "robotf.bee",
        tapeParameters: ["M", 0x03fc, 0x1983, true, 0x00]
    },
    {
        title: "Space Lanes",
        author: "Brad Robinson",
        url: "software/brad_robinson/sp-lanes.bee",
        filename: "sp-lanes.bee"
    },

    {
        title: "Bounce",
        author: "Richard Larkin",
        url: "software/richard_larkin/bounce.mwb",
        filename: "bounce.mwb"
    },
    {
        title: "Break Out",
        author: "Richard Larkin",
        url: "software/richard_larkin/bricks.mwb",
        filename: "bricks.mwb"
    },
    {
        title: "Catack",
        author: "Richard Larkin",
        url: "software/richard_larkin/catack.bee",
        filename: "catack.bee"
    },
    {
        title: "Catter",
        author: "Richard Larkin",
        url: "software/richard_larkin/catter.mwb",
        filename: "catter.mwb"
    },
    {
        title: "Catter 2",
        author: "Richard Larkin",
        url: "software/richard_larkin/cater2.mwb",
        filename: "cater2.mwb"
    },
    {
        title: "Catter 3",
        author: "Richard Larkin",
        url: "software/richard_larkin/cater3.mwb",
        filename: "cater3.mwb"
    },
        {
        title: "Earth",
        author: "Richard Larkin",
        url: "software/richard_larkin/earth.mwb",
        filename: "earth.mwb"
    },
    {
        title: "Isbok Adventure",
        author: "Richard Larkin",
        url: "software/richard_larkin/isbok-g.mwb",
        filename: "isbok-g.mwb"
    },
    {
        title: "Mazes!",
        author: "Richard Larkin",
        url: "software/richard_larkin/mazes.bee",
        filename: "mazes.bee",
        tapeParameters: ["M", 0x4000, 0x4000, true, 0x00]
    },
    {
        title: "Othello",
        author: "Richard Larkin",
        url: "software/richard_larkin/othello.bee",
        filename: "othello.bee",
        tapeParameters: ["M", 0x0400, 0x0400, true, 0x00]
    },
    {
        title: "Pucker",
        author: "Richard Larkin",
        url: "software/richard_larkin/pucker.bee",
        filename: "pucker.bee",
        tapeParameters: ["M", 0x03a2, 0x03a2, true, 0x00]
    }
];
/*!  NanoWasp - A MicroBee emulator
 *  Copyright (C) 2007, 2011 David G. Churchill
 *
 *  This file is part of NanoWasp.
 *
 *  NanoWasp is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  NanoWasp is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var nanowasp = nanowasp || {};

nanowasp.Debugger = function (registersElementName) {
  //  this._z80 = z80;
  //  this._registersElement = document.getElementById(registersElementName);
};

nanowasp.Debugger.prototype = {
    update: function () {
        utils.setTextContent(this._registersElement,
            "PC: " + this._formatHex(z80.pc, 4) + "  " +
            "SP: " + this._formatHex(z80.sp, 4) + "\n" +
            "AF: " + this._formatHex(z80.a, 2) + this._formatHex(z80.f, 2) + "  " +
            "BC: " + this._formatHex(z80.b, 2) + this._formatHex(z80.c, 2) + "\n" +
            "DE: " + this._formatHex(z80.d, 2) + this._formatHex(z80.e, 2) + "  " +
            "HL: " + this._formatHex(z80.h, 2) + this._formatHex(z80.l, 2) + "\n" +
            "IX: " + this._formatHex(z80.ixh, 2) + this._formatHex(z80.ixl, 2) + "  " +
            "IY: " + this._formatHex(z80.iyh, 2) + this._formatHex(z80.iyl, 2) + "\n" +
            "\n" +
            disassemble(z80.pc, 5));
    },
    
    _formatHex: function (data, length) {
        var result = data.toString(16).toUpperCase();
        while (result.length < length) {
            result = "0" + result;
        }
            
        return result;
    }
};


opcodes_ddcb = {
    0: ["LD B,RLC (IX+{})", "dd"],
    1: ["LD C,RLC (IX+{})", "dd"],
    2: ["LD D,RLC (IX+{})", "dd"],
    3: ["LD E,RLC (IX+{})", "dd"],
    4: ["LD H,RLC (IX+{})", "dd"],
    5: ["LD L,RLC (IX+{})", "dd"],
    6: ["RLC (IX+{})", "dd"],
    7: ["LD A,RLC (IX+{})", "dd"],
    8: ["LD B,RRC (IX+{})", "dd"],
    9: ["LD C,RRC (IX+{})", "dd"],
    10: ["LD D,RRC (IX+{})", "dd"],
    11: ["LD E,RRC (IX+{})", "dd"],
    12: ["LD H,RRC (IX+{})", "dd"],
    13: ["LD L,RRC (IX+{})", "dd"],
    14: ["RRC (IX+{})", "dd"],
    15: ["LD A,RRC (IX+{})", "dd"],
    16: ["LD B,RL (IX+{})", "dd"],
    17: ["LD C,RL (IX+{})", "dd"],
    18: ["LD D,RL (IX+{})", "dd"],
    19: ["LD E,RL (IX+{})", "dd"],
    20: ["LD H,RL (IX+{})", "dd"],
    21: ["LD L,RL (IX+{})", "dd"],
    22: ["RL (IX+{})", "dd"],
    23: ["LD A,RL (IX+{})", "dd"],
    24: ["LD B,RR (IX+{})", "dd"],
    25: ["LD C,RR (IX+{})", "dd"],
    26: ["LD D,RR (IX+{})", "dd"],
    27: ["LD E,RR (IX+{})", "dd"],
    28: ["LD H,RR (IX+{})", "dd"],
    29: ["LD L,RR (IX+{})", "dd"],
    30: ["RR (IX+{})", "dd"],
    31: ["LD A,RR (IX+{})", "dd"],
    32: ["LD B,SLA (IX+{})", "dd"],
    33: ["LD C,SLA (IX+{})", "dd"],
    34: ["LD D,SLA (IX+{})", "dd"],
    35: ["LD E,SLA (IX+{})", "dd"],
    36: ["LD H,SLA (IX+{})", "dd"],
    37: ["LD L,SLA (IX+{})", "dd"],
    38: ["SLA (IX+{})", "dd"],
    39: ["LD A,SLA (IX+{})", "dd"],
    40: ["LD B,SRA (IX+{})", "dd"],
    41: ["LD C,SRA (IX+{})", "dd"],
    42: ["LD D,SRA (IX+{})", "dd"],
    43: ["LD E,SRA (IX+{})", "dd"],
    44: ["LD H,SRA (IX+{})", "dd"],
    45: ["LD L,SRA (IX+{})", "dd"],
    46: ["SRA (IX+{})", "dd"],
    47: ["LD A,SRA (IX+{})", "dd"],
    48: ["LD B,SLL (IX+{})", "dd"],
    49: ["LD C,SLL (IX+{})", "dd"],
    50: ["LD D,SLL (IX+{})", "dd"],
    51: ["LD E,SLL (IX+{})", "dd"],
    52: ["LD H,SLL (IX+{})", "dd"],
    53: ["LD L,SLL (IX+{})", "dd"],
    54: ["SLL (IX+{})", "dd"],
    55: ["LD A,SLL (IX+{})", "dd"],
    56: ["LD B,SRL (IX+{})", "dd"],
    57: ["LD C,SRL (IX+{})", "dd"],
    58: ["LD D,SRL (IX+{})", "dd"],
    59: ["LD E,SRL (IX+{})", "dd"],
    60: ["LD H,SRL (IX+{})", "dd"],
    61: ["LD L,SRL (IX+{})", "dd"],
    62: ["SRL (IX+{})", "dd"],
    63: ["LD A,SRL (IX+{})", "dd"],
    64: ["BIT 0,(IX+{})", "dd"],
    65: ["BIT 0,(IX+{})", "dd"],
    66: ["BIT 0,(IX+{})", "dd"],
    67: ["BIT 0,(IX+{})", "dd"],
    68: ["BIT 0,(IX+{})", "dd"],
    69: ["BIT 0,(IX+{})", "dd"],
    70: ["BIT 0,(IX+{})", "dd"],
    71: ["BIT 0,(IX+{})", "dd"],
    72: ["BIT 1,(IX+{})", "dd"],
    73: ["BIT 1,(IX+{})", "dd"],
    74: ["BIT 1,(IX+{})", "dd"],
    75: ["BIT 1,(IX+{})", "dd"],
    76: ["BIT 1,(IX+{})", "dd"],
    77: ["BIT 1,(IX+{})", "dd"],
    78: ["BIT 1,(IX+{})", "dd"],
    79: ["BIT 1,(IX+{})", "dd"],
    80: ["BIT 2,(IX+{})", "dd"],
    81: ["BIT 2,(IX+{})", "dd"],
    82: ["BIT 2,(IX+{})", "dd"],
    83: ["BIT 2,(IX+{})", "dd"],
    84: ["BIT 2,(IX+{})", "dd"],
    85: ["BIT 2,(IX+{})", "dd"],
    86: ["BIT 2,(IX+{})", "dd"],
    87: ["BIT 2,(IX+{})", "dd"],
    88: ["BIT 3,(IX+{})", "dd"],
    89: ["BIT 3,(IX+{})", "dd"],
    90: ["BIT 3,(IX+{})", "dd"],
    91: ["BIT 3,(IX+{})", "dd"],
    92: ["BIT 3,(IX+{})", "dd"],
    93: ["BIT 3,(IX+{})", "dd"],
    94: ["BIT 3,(IX+{})", "dd"],
    95: ["BIT 3,(IX+{})", "dd"],
    96: ["BIT 4,(IX+{})", "dd"],
    97: ["BIT 4,(IX+{})", "dd"],
    98: ["BIT 4,(IX+{})", "dd"],
    99: ["BIT 4,(IX+{})", "dd"],
    100: ["BIT 4,(IX+{})", "dd"],
    101: ["BIT 4,(IX+{})", "dd"],
    102: ["BIT 4,(IX+{})", "dd"],
    103: ["BIT 4,(IX+{})", "dd"],
    104: ["BIT 5,(IX+{})", "dd"],
    105: ["BIT 5,(IX+{})", "dd"],
    106: ["BIT 5,(IX+{})", "dd"],
    107: ["BIT 5,(IX+{})", "dd"],
    108: ["BIT 5,(IX+{})", "dd"],
    109: ["BIT 5,(IX+{})", "dd"],
    110: ["BIT 5,(IX+{})", "dd"],
    111: ["BIT 5,(IX+{})", "dd"],
    112: ["BIT 6,(IX+{})", "dd"],
    113: ["BIT 6,(IX+{})", "dd"],
    114: ["BIT 6,(IX+{})", "dd"],
    115: ["BIT 6,(IX+{})", "dd"],
    116: ["BIT 6,(IX+{})", "dd"],
    117: ["BIT 6,(IX+{})", "dd"],
    118: ["BIT 6,(IX+{})", "dd"],
    119: ["BIT 6,(IX+{})", "dd"],
    120: ["BIT 7,(IX+{})", "dd"],
    121: ["BIT 7,(IX+{})", "dd"],
    122: ["BIT 7,(IX+{})", "dd"],
    123: ["BIT 7,(IX+{})", "dd"],
    124: ["BIT 7,(IX+{})", "dd"],
    125: ["BIT 7,(IX+{})", "dd"],
    126: ["BIT 7,(IX+{})", "dd"],
    127: ["BIT 7,(IX+{})", "dd"],
    128: ["LD B,RES 0,(IX+{})", "dd"],
    129: ["LD C,RES 0,(IX+{})", "dd"],
    130: ["LD D,RES 0,(IX+{})", "dd"],
    131: ["LD E,RES 0,(IX+{})", "dd"],
    132: ["LD H,RES 0,(IX+{})", "dd"],
    133: ["LD L,RES 0,(IX+{})", "dd"],
    134: ["RES 0,(IX+{})", "dd"],
    135: ["LD A,RES 0,(IX+{})", "dd"],
    136: ["LD B,RES 1,(IX+{})", "dd"],
    137: ["LD C,RES 1,(IX+{})", "dd"],
    138: ["LD D,RES 1,(IX+{})", "dd"],
    139: ["LD E,RES 1,(IX+{})", "dd"],
    140: ["LD H,RES 1,(IX+{})", "dd"],
    141: ["LD L,RES 1,(IX+{})", "dd"],
    142: ["RES 1,(IX+{})", "dd"],
    143: ["LD A,RES 1,(IX+{})", "dd"],
    144: ["LD B,RES 2,(IX+{})", "dd"],
    145: ["LD C,RES 2,(IX+{})", "dd"],
    146: ["LD D,RES 2,(IX+{})", "dd"],
    147: ["LD E,RES 2,(IX+{})", "dd"],
    148: ["LD H,RES 2,(IX+{})", "dd"],
    149: ["LD L,RES 2,(IX+{})", "dd"],
    150: ["RES 2,(IX+{})", "dd"],
    151: ["LD A,RES 2,(IX+{})", "dd"],
    152: ["LD B,RES 3,(IX+{})", "dd"],
    153: ["LD C,RES 3,(IX+{})", "dd"],
    154: ["LD D,RES 3,(IX+{})", "dd"],
    155: ["LD E,RES 3,(IX+{})", "dd"],
    156: ["LD H,RES 3,(IX+{})", "dd"],
    157: ["LD L,RES 3,(IX+{})", "dd"],
    158: ["RES 3,(IX+{})", "dd"],
    159: ["LD A,RES 3,(IX+{})", "dd"],
    160: ["LD B,RES 4,(IX+{})", "dd"],
    161: ["LD C,RES 4,(IX+{})", "dd"],
    162: ["LD D,RES 4,(IX+{})", "dd"],
    163: ["LD E,RES 4,(IX+{})", "dd"],
    164: ["LD H,RES 4,(IX+{})", "dd"],
    165: ["LD L,RES 4,(IX+{})", "dd"],
    166: ["RES 4,(IX+{})", "dd"],
    167: ["LD A,RES 4,(IX+{})", "dd"],
    168: ["LD B,RES 5,(IX+{})", "dd"],
    169: ["LD C,RES 5,(IX+{})", "dd"],
    170: ["LD D,RES 5,(IX+{})", "dd"],
    171: ["LD E,RES 5,(IX+{})", "dd"],
    172: ["LD H,RES 5,(IX+{})", "dd"],
    173: ["LD L,RES 5,(IX+{})", "dd"],
    174: ["RES 5,(IX+{})", "dd"],
    175: ["LD A,RES 5,(IX+{})", "dd"],
    176: ["LD B,RES 6,(IX+{})", "dd"],
    177: ["LD C,RES 6,(IX+{})", "dd"],
    178: ["LD D,RES 6,(IX+{})", "dd"],
    179: ["LD E,RES 6,(IX+{})", "dd"],
    180: ["LD H,RES 6,(IX+{})", "dd"],
    181: ["LD L,RES 6,(IX+{})", "dd"],
    182: ["RES 6,(IX+{})", "dd"],
    183: ["LD A,RES 6,(IX+{})", "dd"],
    184: ["LD B,RES 7,(IX+{})", "dd"],
    185: ["LD C,RES 7,(IX+{})", "dd"],
    186: ["LD D,RES 7,(IX+{})", "dd"],
    187: ["LD E,RES 7,(IX+{})", "dd"],
    188: ["LD H,RES 7,(IX+{})", "dd"],
    189: ["LD L,RES 7,(IX+{})", "dd"],
    190: ["RES 7,(IX+{})", "dd"],
    191: ["LD A,RES 7,(IX+{})", "dd"],
    192: ["LD B,SET 0,(IX+{})", "dd"],
    193: ["LD C,SET 0,(IX+{})", "dd"],
    194: ["LD D,SET 0,(IX+{})", "dd"],
    195: ["LD E,SET 0,(IX+{})", "dd"],
    196: ["LD H,SET 0,(IX+{})", "dd"],
    197: ["LD L,SET 0,(IX+{})", "dd"],
    198: ["SET 0,(IX+{})", "dd"],
    199: ["LD A,SET 0,(IX+{})", "dd"],
    200: ["LD B,SET 1,(IX+{})", "dd"],
    201: ["LD C,SET 1,(IX+{})", "dd"],
    202: ["LD D,SET 1,(IX+{})", "dd"],
    203: ["LD E,SET 1,(IX+{})", "dd"],
    204: ["LD H,SET 1,(IX+{})", "dd"],
    205: ["LD L,SET 1,(IX+{})", "dd"],
    206: ["SET 1,(IX+{})", "dd"],
    207: ["LD A,SET 1,(IX+{})", "dd"],
    208: ["LD B,SET 2,(IX+{})", "dd"],
    209: ["LD C,SET 2,(IX+{})", "dd"],
    210: ["LD D,SET 2,(IX+{})", "dd"],
    211: ["LD E,SET 2,(IX+{})", "dd"],
    212: ["LD H,SET 2,(IX+{})", "dd"],
    213: ["LD L,SET 2,(IX+{})", "dd"],
    214: ["SET 2,(IX+{})", "dd"],
    215: ["LD A,SET 2,(IX+{})", "dd"],
    216: ["LD B,SET 3,(IX+{})", "dd"],
    217: ["LD C,SET 3,(IX+{})", "dd"],
    218: ["LD D,SET 3,(IX+{})", "dd"],
    219: ["LD E,SET 3,(IX+{})", "dd"],
    220: ["LD H,SET 3,(IX+{})", "dd"],
    221: ["LD L,SET 3,(IX+{})", "dd"],
    222: ["SET 3,(IX+{})", "dd"],
    223: ["LD A,SET 3,(IX+{})", "dd"],
    224: ["LD B,SET 4,(IX+{})", "dd"],
    225: ["LD C,SET 4,(IX+{})", "dd"],
    226: ["LD D,SET 4,(IX+{})", "dd"],
    227: ["LD E,SET 4,(IX+{})", "dd"],
    228: ["LD H,SET 4,(IX+{})", "dd"],
    229: ["LD L,SET 4,(IX+{})", "dd"],
    230: ["SET 4,(IX+{})", "dd"],
    231: ["LD A,SET 4,(IX+{})", "dd"],
    232: ["LD B,SET 5,(IX+{})", "dd"],
    233: ["LD C,SET 5,(IX+{})", "dd"],
    234: ["LD D,SET 5,(IX+{})", "dd"],
    235: ["LD E,SET 5,(IX+{})", "dd"],
    236: ["LD H,SET 5,(IX+{})", "dd"],
    237: ["LD L,SET 5,(IX+{})", "dd"],
    238: ["SET 5,(IX+{})", "dd"],
    239: ["LD A,SET 5,(IX+{})", "dd"],
    240: ["LD B,SET 6,(IX+{})", "dd"],
    241: ["LD C,SET 6,(IX+{})", "dd"],
    242: ["LD D,SET 6,(IX+{})", "dd"],
    243: ["LD E,SET 6,(IX+{})", "dd"],
    244: ["LD H,SET 6,(IX+{})", "dd"],
    245: ["LD L,SET 6,(IX+{})", "dd"],
    246: ["SET 6,(IX+{})", "dd"],
    247: ["LD A,SET 6,(IX+{})", "dd"],
    248: ["LD B,SET 7,(IX+{})", "dd"],
    249: ["LD C,SET 7,(IX+{})", "dd"],
    250: ["LD D,SET 7,(IX+{})", "dd"],
    251: ["LD E,SET 7,(IX+{})", "dd"],
    252: ["LD H,SET 7,(IX+{})", "dd"],
    253: ["LD L,SET 7,(IX+{})", "dd"],
    254: ["SET 7,(IX+{})", "dd"],
    255: ["LD A,SET 7,(IX+{})", "dd"]
};

opcodes_fdcb = {
    0: ["LD B,RLC (IY+{})", "dd"],
    1: ["LD C,RLC (IY+{})", "dd"],
    2: ["LD D,RLC (IY+{})", "dd"],
    3: ["LD E,RLC (IY+{})", "dd"],
    4: ["LD H,RLC (IY+{})", "dd"],
    5: ["LD L,RLC (IY+{})", "dd"],
    6: ["RLC (IY+{})", "dd"],
    7: ["LD A,RLC (IY+{})", "dd"],
    8: ["LD B,RRC (IY+{})", "dd"],
    9: ["LD C,RRC (IY+{})", "dd"],
    10: ["LD D,RRC (IY+{})", "dd"],
    11: ["LD E,RRC (IY+{})", "dd"],
    12: ["LD H,RRC (IY+{})", "dd"],
    13: ["LD L,RRC (IY+{})", "dd"],
    14: ["RRC (IY+{})", "dd"],
    15: ["LD A,RRC (IY+{})", "dd"],
    16: ["LD B,RL (IY+{})", "dd"],
    17: ["LD C,RL (IY+{})", "dd"],
    18: ["LD D,RL (IY+{})", "dd"],
    19: ["LD E,RL (IY+{})", "dd"],
    20: ["LD H,RL (IY+{})", "dd"],
    21: ["LD L,RL (IY+{})", "dd"],
    22: ["RL (IY+{})", "dd"],
    23: ["LD A,RL (IY+{})", "dd"],
    24: ["LD B,RR (IY+{})", "dd"],
    25: ["LD C,RR (IY+{})", "dd"],
    26: ["LD D,RR (IY+{})", "dd"],
    27: ["LD E,RR (IY+{})", "dd"],
    28: ["LD H,RR (IY+{})", "dd"],
    29: ["LD L,RR (IY+{})", "dd"],
    30: ["RR (IY+{})", "dd"],
    31: ["LD A,RR (IY+{})", "dd"],
    32: ["LD B,SLA (IY+{})", "dd"],
    33: ["LD C,SLA (IY+{})", "dd"],
    34: ["LD D,SLA (IY+{})", "dd"],
    35: ["LD E,SLA (IY+{})", "dd"],
    36: ["LD H,SLA (IY+{})", "dd"],
    37: ["LD L,SLA (IY+{})", "dd"],
    38: ["SLA (IY+{})", "dd"],
    39: ["LD A,SLA (IY+{})", "dd"],
    40: ["LD B,SRA (IY+{})", "dd"],
    41: ["LD C,SRA (IY+{})", "dd"],
    42: ["LD D,SRA (IY+{})", "dd"],
    43: ["LD E,SRA (IY+{})", "dd"],
    44: ["LD H,SRA (IY+{})", "dd"],
    45: ["LD L,SRA (IY+{})", "dd"],
    46: ["SRA (IY+{})", "dd"],
    47: ["LD A,SRA (IY+{})", "dd"],
    48: ["LD B,SLL (IY+{})", "dd"],
    49: ["LD C,SLL (IY+{})", "dd"],
    50: ["LD D,SLL (IY+{})", "dd"],
    51: ["LD E,SLL (IY+{})", "dd"],
    52: ["LD H,SLL (IY+{})", "dd"],
    53: ["LD L,SLL (IY+{})", "dd"],
    54: ["SLL (IY+{})", "dd"],
    55: ["LD A,SLL (IY+{})", "dd"],
    56: ["LD B,SRL (IY+{})", "dd"],
    57: ["LD C,SRL (IY+{})", "dd"],
    58: ["LD D,SRL (IY+{})", "dd"],
    59: ["LD E,SRL (IY+{})", "dd"],
    60: ["LD H,SRL (IY+{})", "dd"],
    61: ["LD L,SRL (IY+{})", "dd"],
    62: ["SRL (IY+{})", "dd"],
    63: ["LD A,SRL (IY+{})", "dd"],
    64: ["BIT 0,(IY+{})", "dd"],
    65: ["BIT 0,(IY+{})", "dd"],
    66: ["BIT 0,(IY+{})", "dd"],
    67: ["BIT 0,(IY+{})", "dd"],
    68: ["BIT 0,(IY+{})", "dd"],
    69: ["BIT 0,(IY+{})", "dd"],
    70: ["BIT 0,(IY+{})", "dd"],
    71: ["BIT 0,(IY+{})", "dd"],
    72: ["BIT 1,(IY+{})", "dd"],
    73: ["BIT 1,(IY+{})", "dd"],
    74: ["BIT 1,(IY+{})", "dd"],
    75: ["BIT 1,(IY+{})", "dd"],
    76: ["BIT 1,(IY+{})", "dd"],
    77: ["BIT 1,(IY+{})", "dd"],
    78: ["BIT 1,(IY+{})", "dd"],
    79: ["BIT 1,(IY+{})", "dd"],
    80: ["BIT 2,(IY+{})", "dd"],
    81: ["BIT 2,(IY+{})", "dd"],
    82: ["BIT 2,(IY+{})", "dd"],
    83: ["BIT 2,(IY+{})", "dd"],
    84: ["BIT 2,(IY+{})", "dd"],
    85: ["BIT 2,(IY+{})", "dd"],
    86: ["BIT 2,(IY+{})", "dd"],
    87: ["BIT 2,(IY+{})", "dd"],
    88: ["BIT 3,(IY+{})", "dd"],
    89: ["BIT 3,(IY+{})", "dd"],
    90: ["BIT 3,(IY+{})", "dd"],
    91: ["BIT 3,(IY+{})", "dd"],
    92: ["BIT 3,(IY+{})", "dd"],
    93: ["BIT 3,(IY+{})", "dd"],
    94: ["BIT 3,(IY+{})", "dd"],
    95: ["BIT 3,(IY+{})", "dd"],
    96: ["BIT 4,(IY+{})", "dd"],
    97: ["BIT 4,(IY+{})", "dd"],
    98: ["BIT 4,(IY+{})", "dd"],
    99: ["BIT 4,(IY+{})", "dd"],
    100: ["BIT 4,(IY+{})", "dd"],
    101: ["BIT 4,(IY+{})", "dd"],
    102: ["BIT 4,(IY+{})", "dd"],
    103: ["BIT 4,(IY+{})", "dd"],
    104: ["BIT 5,(IY+{})", "dd"],
    105: ["BIT 5,(IY+{})", "dd"],
    106: ["BIT 5,(IY+{})", "dd"],
    107: ["BIT 5,(IY+{})", "dd"],
    108: ["BIT 5,(IY+{})", "dd"],
    109: ["BIT 5,(IY+{})", "dd"],
    110: ["BIT 5,(IY+{})", "dd"],
    111: ["BIT 5,(IY+{})", "dd"],
    112: ["BIT 6,(IY+{})", "dd"],
    113: ["BIT 6,(IY+{})", "dd"],
    114: ["BIT 6,(IY+{})", "dd"],
    115: ["BIT 6,(IY+{})", "dd"],
    116: ["BIT 6,(IY+{})", "dd"],
    117: ["BIT 6,(IY+{})", "dd"],
    118: ["BIT 6,(IY+{})", "dd"],
    119: ["BIT 6,(IY+{})", "dd"],
    120: ["BIT 7,(IY+{})", "dd"],
    121: ["BIT 7,(IY+{})", "dd"],
    122: ["BIT 7,(IY+{})", "dd"],
    123: ["BIT 7,(IY+{})", "dd"],
    124: ["BIT 7,(IY+{})", "dd"],
    125: ["BIT 7,(IY+{})", "dd"],
    126: ["BIT 7,(IY+{})", "dd"],
    127: ["BIT 7,(IY+{})", "dd"],
    128: ["LD B,RES 0,(IY+{})", "dd"],
    129: ["LD C,RES 0,(IY+{})", "dd"],
    130: ["LD D,RES 0,(IY+{})", "dd"],
    131: ["LD E,RES 0,(IY+{})", "dd"],
    132: ["LD H,RES 0,(IY+{})", "dd"],
    133: ["LD L,RES 0,(IY+{})", "dd"],
    134: ["RES 0,(IY+{})", "dd"],
    135: ["LD A,RES 0,(IY+{})", "dd"],
    136: ["LD B,RES 1,(IY+{})", "dd"],
    137: ["LD C,RES 1,(IY+{})", "dd"],
    138: ["LD D,RES 1,(IY+{})", "dd"],
    139: ["LD E,RES 1,(IY+{})", "dd"],
    140: ["LD H,RES 1,(IY+{})", "dd"],
    141: ["LD L,RES 1,(IY+{})", "dd"],
    142: ["RES 1,(IY+{})", "dd"],
    143: ["LD A,RES 1,(IY+{})", "dd"],
    144: ["LD B,RES 2,(IY+{})", "dd"],
    145: ["LD C,RES 2,(IY+{})", "dd"],
    146: ["LD D,RES 2,(IY+{})", "dd"],
    147: ["LD E,RES 2,(IY+{})", "dd"],
    148: ["LD H,RES 2,(IY+{})", "dd"],
    149: ["LD L,RES 2,(IY+{})", "dd"],
    150: ["RES 2,(IY+{})", "dd"],
    151: ["LD A,RES 2,(IY+{})", "dd"],
    152: ["LD B,RES 3,(IY+{})", "dd"],
    153: ["LD C,RES 3,(IY+{})", "dd"],
    154: ["LD D,RES 3,(IY+{})", "dd"],
    155: ["LD E,RES 3,(IY+{})", "dd"],
    156: ["LD H,RES 3,(IY+{})", "dd"],
    157: ["LD L,RES 3,(IY+{})", "dd"],
    158: ["RES 3,(IY+{})", "dd"],
    159: ["LD A,RES 3,(IY+{})", "dd"],
    160: ["LD B,RES 4,(IY+{})", "dd"],
    161: ["LD C,RES 4,(IY+{})", "dd"],
    162: ["LD D,RES 4,(IY+{})", "dd"],
    163: ["LD E,RES 4,(IY+{})", "dd"],
    164: ["LD H,RES 4,(IY+{})", "dd"],
    165: ["LD L,RES 4,(IY+{})", "dd"],
    166: ["RES 4,(IY+{})", "dd"],
    167: ["LD A,RES 4,(IY+{})", "dd"],
    168: ["LD B,RES 5,(IY+{})", "dd"],
    169: ["LD C,RES 5,(IY+{})", "dd"],
    170: ["LD D,RES 5,(IY+{})", "dd"],
    171: ["LD E,RES 5,(IY+{})", "dd"],
    172: ["LD H,RES 5,(IY+{})", "dd"],
    173: ["LD L,RES 5,(IY+{})", "dd"],
    174: ["RES 5,(IY+{})", "dd"],
    175: ["LD A,RES 5,(IY+{})", "dd"],
    176: ["LD B,RES 6,(IY+{})", "dd"],
    177: ["LD C,RES 6,(IY+{})", "dd"],
    178: ["LD D,RES 6,(IY+{})", "dd"],
    179: ["LD E,RES 6,(IY+{})", "dd"],
    180: ["LD H,RES 6,(IY+{})", "dd"],
    181: ["LD L,RES 6,(IY+{})", "dd"],
    182: ["RES 6,(IY+{})", "dd"],
    183: ["LD A,RES 6,(IY+{})", "dd"],
    184: ["LD B,RES 7,(IY+{})", "dd"],
    185: ["LD C,RES 7,(IY+{})", "dd"],
    186: ["LD D,RES 7,(IY+{})", "dd"],
    187: ["LD E,RES 7,(IY+{})", "dd"],
    188: ["LD H,RES 7,(IY+{})", "dd"],
    189: ["LD L,RES 7,(IY+{})", "dd"],
    190: ["RES 7,(IY+{})", "dd"],
    191: ["LD A,RES 7,(IY+{})", "dd"],
    192: ["LD B,SET 0,(IY+{})", "dd"],
    193: ["LD C,SET 0,(IY+{})", "dd"],
    194: ["LD D,SET 0,(IY+{})", "dd"],
    195: ["LD E,SET 0,(IY+{})", "dd"],
    196: ["LD H,SET 0,(IY+{})", "dd"],
    197: ["LD L,SET 0,(IY+{})", "dd"],
    198: ["SET 0,(IY+{})", "dd"],
    199: ["LD A,SET 0,(IY+{})", "dd"],
    200: ["LD B,SET 1,(IY+{})", "dd"],
    201: ["LD C,SET 1,(IY+{})", "dd"],
    202: ["LD D,SET 1,(IY+{})", "dd"],
    203: ["LD E,SET 1,(IY+{})", "dd"],
    204: ["LD H,SET 1,(IY+{})", "dd"],
    205: ["LD L,SET 1,(IY+{})", "dd"],
    206: ["SET 1,(IY+{})", "dd"],
    207: ["LD A,SET 1,(IY+{})", "dd"],
    208: ["LD B,SET 2,(IY+{})", "dd"],
    209: ["LD C,SET 2,(IY+{})", "dd"],
    210: ["LD D,SET 2,(IY+{})", "dd"],
    211: ["LD E,SET 2,(IY+{})", "dd"],
    212: ["LD H,SET 2,(IY+{})", "dd"],
    213: ["LD L,SET 2,(IY+{})", "dd"],
    214: ["SET 2,(IY+{})", "dd"],
    215: ["LD A,SET 2,(IY+{})", "dd"],
    216: ["LD B,SET 3,(IY+{})", "dd"],
    217: ["LD C,SET 3,(IY+{})", "dd"],
    218: ["LD D,SET 3,(IY+{})", "dd"],
    219: ["LD E,SET 3,(IY+{})", "dd"],
    220: ["LD H,SET 3,(IY+{})", "dd"],
    221: ["LD L,SET 3,(IY+{})", "dd"],
    222: ["SET 3,(IY+{})", "dd"],
    223: ["LD A,SET 3,(IY+{})", "dd"],
    224: ["LD B,SET 4,(IY+{})", "dd"],
    225: ["LD C,SET 4,(IY+{})", "dd"],
    226: ["LD D,SET 4,(IY+{})", "dd"],
    227: ["LD E,SET 4,(IY+{})", "dd"],
    228: ["LD H,SET 4,(IY+{})", "dd"],
    229: ["LD L,SET 4,(IY+{})", "dd"],
    230: ["SET 4,(IY+{})", "dd"],
    231: ["LD A,SET 4,(IY+{})", "dd"],
    232: ["LD B,SET 5,(IY+{})", "dd"],
    233: ["LD C,SET 5,(IY+{})", "dd"],
    234: ["LD D,SET 5,(IY+{})", "dd"],
    235: ["LD E,SET 5,(IY+{})", "dd"],
    236: ["LD H,SET 5,(IY+{})", "dd"],
    237: ["LD L,SET 5,(IY+{})", "dd"],
    238: ["SET 5,(IY+{})", "dd"],
    239: ["LD A,SET 5,(IY+{})", "dd"],
    240: ["LD B,SET 6,(IY+{})", "dd"],
    241: ["LD C,SET 6,(IY+{})", "dd"],
    242: ["LD D,SET 6,(IY+{})", "dd"],
    243: ["LD E,SET 6,(IY+{})", "dd"],
    244: ["LD H,SET 6,(IY+{})", "dd"],
    245: ["LD L,SET 6,(IY+{})", "dd"],
    246: ["SET 6,(IY+{})", "dd"],
    247: ["LD A,SET 6,(IY+{})", "dd"],
    248: ["LD B,SET 7,(IY+{})", "dd"],
    249: ["LD C,SET 7,(IY+{})", "dd"],
    250: ["LD D,SET 7,(IY+{})", "dd"],
    251: ["LD E,SET 7,(IY+{})", "dd"],
    252: ["LD H,SET 7,(IY+{})", "dd"],
    253: ["LD L,SET 7,(IY+{})", "dd"],
    254: ["SET 7,(IY+{})", "dd"],
    255: ["LD A,SET 7,(IY+{})", "dd"]
};

opcodes_cb = {
    0: ["RLC B", ""],
    1: ["RLC C", ""],
    2: ["RLC D", ""],
    3: ["RLC E", ""],
    4: ["RLC H", ""],
    5: ["RLC L", ""],
    6: ["RLC (HL)", ""],
    7: ["RLC A", ""],
    8: ["RRC B", ""],
    9: ["RRC C", ""],
    10: ["RRC D", ""],
    11: ["RRC E", ""],
    12: ["RRC H", ""],
    13: ["RRC L", ""],
    14: ["RRC (HL)", ""],
    15: ["RRC A", ""],
    16: ["RL B", ""],
    17: ["RL C", ""],
    18: ["RL D", ""],
    19: ["RL E", ""],
    20: ["RL H", ""],
    21: ["RL L", ""],
    22: ["RL (HL)", ""],
    23: ["RL A", ""],
    24: ["RR B", ""],
    25: ["RR C", ""],
    26: ["RR D", ""],
    27: ["RR E", ""],
    28: ["RR H", ""],
    29: ["RR L", ""],
    30: ["RR (HL)", ""],
    31: ["RR A", ""],
    32: ["SLA B", ""],
    33: ["SLA C", ""],
    34: ["SLA D", ""],
    35: ["SLA E", ""],
    36: ["SLA H", ""],
    37: ["SLA L", ""],
    38: ["SLA (HL)", ""],
    39: ["SLA A", ""],
    40: ["SRA B", ""],
    41: ["SRA C", ""],
    42: ["SRA D", ""],
    43: ["SRA E", ""],
    44: ["SRA H", ""],
    45: ["SRA L", ""],
    46: ["SRA (HL)", ""],
    47: ["SRA A", ""],
    48: ["SLL B", ""],
    49: ["SLL C", ""],
    50: ["SLL D", ""],
    51: ["SLL E", ""],
    52: ["SLL H", ""],
    53: ["SLL L", ""],
    54: ["SLL (HL)", ""],
    55: ["SLL A", ""],
    56: ["SRL B", ""],
    57: ["SRL C", ""],
    58: ["SRL D", ""],
    59: ["SRL E", ""],
    60: ["SRL H", ""],
    61: ["SRL L", ""],
    62: ["SRL (HL)", ""],
    63: ["SRL A", ""],
    64: ["BIT 0,B", ""],
    65: ["BIT 0,C", ""],
    66: ["BIT 0,D", ""],
    67: ["BIT 0,E", ""],
    68: ["BIT 0,H", ""],
    69: ["BIT 0,L", ""],
    70: ["BIT 0,(HL)", ""],
    71: ["BIT 0,A", ""],
    72: ["BIT 1,B", ""],
    73: ["BIT 1,C", ""],
    74: ["BIT 1,D", ""],
    75: ["BIT 1,E", ""],
    76: ["BIT 1,H", ""],
    77: ["BIT 1,L", ""],
    78: ["BIT 1,(HL)", ""],
    79: ["BIT 1,A", ""],
    80: ["BIT 2,B", ""],
    81: ["BIT 2,C", ""],
    82: ["BIT 2,D", ""],
    83: ["BIT 2,E", ""],
    84: ["BIT 2,H", ""],
    85: ["BIT 2,L", ""],
    86: ["BIT 2,(HL)", ""],
    87: ["BIT 2,A", ""],
    88: ["BIT 3,B", ""],
    89: ["BIT 3,C", ""],
    90: ["BIT 3,D", ""],
    91: ["BIT 3,E", ""],
    92: ["BIT 3,H", ""],
    93: ["BIT 3,L", ""],
    94: ["BIT 3,(HL)", ""],
    95: ["BIT 3,A", ""],
    96: ["BIT 4,B", ""],
    97: ["BIT 4,C", ""],
    98: ["BIT 4,D", ""],
    99: ["BIT 4,E", ""],
    100: ["BIT 4,H", ""],
    101: ["BIT 4,L", ""],
    102: ["BIT 4,(HL)", ""],
    103: ["BIT 4,A", ""],
    104: ["BIT 5,B", ""],
    105: ["BIT 5,C", ""],
    106: ["BIT 5,D", ""],
    107: ["BIT 5,E", ""],
    108: ["BIT 5,H", ""],
    109: ["BIT 5,L", ""],
    110: ["BIT 5,(HL)", ""],
    111: ["BIT 5,A", ""],
    112: ["BIT 6,B", ""],
    113: ["BIT 6,C", ""],
    114: ["BIT 6,D", ""],
    115: ["BIT 6,E", ""],
    116: ["BIT 6,H", ""],
    117: ["BIT 6,L", ""],
    118: ["BIT 6,(HL)", ""],
    119: ["BIT 6,A", ""],
    120: ["BIT 7,B", ""],
    121: ["BIT 7,C", ""],
    122: ["BIT 7,D", ""],
    123: ["BIT 7,E", ""],
    124: ["BIT 7,H", ""],
    125: ["BIT 7,L", ""],
    126: ["BIT 7,(HL)", ""],
    127: ["BIT 7,A", ""],
    128: ["RES 0,B", ""],
    129: ["RES 0,C", ""],
    130: ["RES 0,D", ""],
    131: ["RES 0,E", ""],
    132: ["RES 0,H", ""],
    133: ["RES 0,L", ""],
    134: ["RES 0,(HL)", ""],
    135: ["RES 0,A", ""],
    136: ["RES 1,B", ""],
    137: ["RES 1,C", ""],
    138: ["RES 1,D", ""],
    139: ["RES 1,E", ""],
    140: ["RES 1,H", ""],
    141: ["RES 1,L", ""],
    142: ["RES 1,(HL)", ""],
    143: ["RES 1,A", ""],
    144: ["RES 2,B", ""],
    145: ["RES 2,C", ""],
    146: ["RES 2,D", ""],
    147: ["RES 2,E", ""],
    148: ["RES 2,H", ""],
    149: ["RES 2,L", ""],
    150: ["RES 2,(HL)", ""],
    151: ["RES 2,A", ""],
    152: ["RES 3,B", ""],
    153: ["RES 3,C", ""],
    154: ["RES 3,D", ""],
    155: ["RES 3,E", ""],
    156: ["RES 3,H", ""],
    157: ["RES 3,L", ""],
    158: ["RES 3,(HL)", ""],
    159: ["RES 3,A", ""],
    160: ["RES 4,B", ""],
    161: ["RES 4,C", ""],
    162: ["RES 4,D", ""],
    163: ["RES 4,E", ""],
    164: ["RES 4,H", ""],
    165: ["RES 4,L", ""],
    166: ["RES 4,(HL)", ""],
    167: ["RES 4,A", ""],
    168: ["RES 5,B", ""],
    169: ["RES 5,C", ""],
    170: ["RES 5,D", ""],
    171: ["RES 5,E", ""],
    172: ["RES 5,H", ""],
    173: ["RES 5,L", ""],
    174: ["RES 5,(HL)", ""],
    175: ["RES 5,A", ""],
    176: ["RES 6,B", ""],
    177: ["RES 6,C", ""],
    178: ["RES 6,D", ""],
    179: ["RES 6,E", ""],
    180: ["RES 6,H", ""],
    181: ["RES 6,L", ""],
    182: ["RES 6,(HL)", ""],
    183: ["RES 6,A", ""],
    184: ["RES 7,B", ""],
    185: ["RES 7,C", ""],
    186: ["RES 7,D", ""],
    187: ["RES 7,E", ""],
    188: ["RES 7,H", ""],
    189: ["RES 7,L", ""],
    190: ["RES 7,(HL)", ""],
    191: ["RES 7,A", ""],
    192: ["SET 0,B", ""],
    193: ["SET 0,C", ""],
    194: ["SET 0,D", ""],
    195: ["SET 0,E", ""],
    196: ["SET 0,H", ""],
    197: ["SET 0,L", ""],
    198: ["SET 0,(HL)", ""],
    199: ["SET 0,A", ""],
    200: ["SET 1,B", ""],
    201: ["SET 1,C", ""],
    202: ["SET 1,D", ""],
    203: ["SET 1,E", ""],
    204: ["SET 1,H", ""],
    205: ["SET 1,L", ""],
    206: ["SET 1,(HL)", ""],
    207: ["SET 1,A", ""],
    208: ["SET 2,B", ""],
    209: ["SET 2,C", ""],
    210: ["SET 2,D", ""],
    211: ["SET 2,E", ""],
    212: ["SET 2,H", ""],
    213: ["SET 2,L", ""],
    214: ["SET 2,(HL)", ""],
    215: ["SET 2,A", ""],
    216: ["SET 3,B", ""],
    217: ["SET 3,C", ""],
    218: ["SET 3,D", ""],
    219: ["SET 3,E", ""],
    220: ["SET 3,H", ""],
    221: ["SET 3,L", ""],
    222: ["SET 3,(HL)", ""],
    223: ["SET 3,A", ""],
    224: ["SET 4,B", ""],
    225: ["SET 4,C", ""],
    226: ["SET 4,D", ""],
    227: ["SET 4,E", ""],
    228: ["SET 4,H", ""],
    229: ["SET 4,L", ""],
    230: ["SET 4,(HL)", ""],
    231: ["SET 4,A", ""],
    232: ["SET 5,B", ""],
    233: ["SET 5,C", ""],
    234: ["SET 5,D", ""],
    235: ["SET 5,E", ""],
    236: ["SET 5,H", ""],
    237: ["SET 5,L", ""],
    238: ["SET 5,(HL)", ""],
    239: ["SET 5,A", ""],
    240: ["SET 6,B", ""],
    241: ["SET 6,C", ""],
    242: ["SET 6,D", ""],
    243: ["SET 6,E", ""],
    244: ["SET 6,H", ""],
    245: ["SET 6,L", ""],
    246: ["SET 6,(HL)", ""],
    247: ["SET 6,A", ""],
    248: ["SET 7,B", ""],
    249: ["SET 7,C", ""],
    250: ["SET 7,D", ""],
    251: ["SET 7,E", ""],
    252: ["SET 7,H", ""],
    253: ["SET 7,L", ""],
    254: ["SET 7,(HL)", ""],
    255: ["SET 7,A", ""]
};

opcodes_dd = {
    9: ["ADD IX,BC", ""],
    25: ["ADD IX,DE", ""],
    33: ["LD IX,{}", "nnnn"],
    34: ["LD ({}),IX", "nnnn"],
    35: ["INC IX", ""],
    36: ["INC IXH", ""],
    37: ["DEC IXH", ""],
    38: ["LD IXH,{}", "nn"],
    41: ["ADD IX,IX", ""],
    42: ["LD IX,({})", "nnnn"],
    43: ["DEC IX", ""],
    44: ["INC IXL", ""],
    45: ["DEC IXL", ""],
    46: ["LD IXL,{}", "nn"],
    52: ["INC (IX+{})", "dd"],
    53: ["DEC (IX+{})", "dd"],
    54: ["LD (IX+{}),nn", "dd"],
    57: ["ADD IX,SP", ""],
    68: ["LD B,IXH", ""],
    69: ["LD B,IXL", ""],
    70: ["LD B,(IX+{})", "dd"],
    76: ["LD C,IXH", ""],
    77: ["LD C,IXL", ""],
    78: ["LD C,(IX+{})", "dd"],
    84: ["LD D,IXH", ""],
    85: ["LD D,IXL", ""],
    86: ["LD D,(IX+{})", "dd"],
    92: ["LD E,IXH", ""],
    93: ["LD E,IXL", ""],
    94: ["LD E,(IX+{})", "dd"],
    96: ["LD IXH,B", ""],
    97: ["LD IXH,C", ""],
    98: ["LD IXH,D", ""],
    99: ["LD IXH,E", ""],
    100: ["LD IXH,IXH", ""],
    101: ["LD IXH,IXL", ""],
    102: ["LD H,(IX+{})", "dd"],
    103: ["LD IXH,A", ""],
    104: ["LD IXL,B", ""],
    105: ["LD IXL,C", ""],
    106: ["LD IXL,D", ""],
    107: ["LD IXL,E", ""],
    108: ["LD IXL,IXH", ""],
    109: ["LD IXL,IXL", ""],
    110: ["LD L,(IX+{})", "dd"],
    111: ["LD IXL,A", ""],
    112: ["LD (IX+{}),B", "dd"],
    113: ["LD (IX+{}),C", "dd"],
    114: ["LD (IX+{}),D", "dd"],
    115: ["LD (IX+{}),E", "dd"],
    116: ["LD (IX+{}),H", "dd"],
    117: ["LD (IX+{}),L", "dd"],
    119: ["LD (IX+{}),A", "dd"],
    124: ["LD A,IXH", ""],
    125: ["LD A,IXL", ""],
    126: ["LD A,(IX+{})", "dd"],
    132: ["ADD A,IXH", ""],
    133: ["ADD A,IXL", ""],
    134: ["ADD A,(IX+{})", "dd"],
    140: ["ADC A,IXH", ""],
    141: ["ADC A,IXL", ""],
    142: ["ADC A,(IX+{})", "dd"],
    148: ["SUB A,IXH", ""],
    149: ["SUB A,IXL", ""],
    150: ["SUB A,(IX+{})", "dd"],
    156: ["SBC A,IXH", ""],
    157: ["SBC A,IXL", ""],
    158: ["SBC A,(IX+{})", "dd"],
    164: ["AND A,IXH", ""],
    165: ["AND A,IXL", ""],
    166: ["AND A,(IX+{})", "dd"],
    172: ["XOR A,IXH", ""],
    173: ["XOR A,IXL", ""],
    174: ["XOR A,(IX+{})", "dd"],
    180: ["OR A,IXH", ""],
    181: ["OR A,IXL", ""],
    182: ["OR A,(IX+{})", "dd"],
    188: ["CP A,IXH", ""],
    189: ["CP A,IXL", ""],
    190: ["CP A,(IX+{})", "dd"],
    203: opcodes_ddcb,
    225: ["POP IX", ""],
    227: ["EX (SP),IX", ""],
    229: ["PUSH IX", ""],
    233: ["JP IX", ""],
    249: ["LD SP,IX", ""]
};

opcodes_ed = {
    64: ["IN B,(C)", ""],
    65: ["OUT (C),B", ""],
    66: ["SBC HL,BC", ""],
    67: ["LD ({}),BC", "nnnn"],
    68: ["NEG", ""],
    76: ["NEG", ""],
    84: ["NEG", ""],
    92: ["NEG", ""],
    100: ["NEG", ""],
    108: ["NEG", ""],
    116: ["NEG", ""],
    124: ["NEG", ""],
    69: ["RETN", ""],
    77: ["RETN", ""],
    85: ["RETN", ""],
    93: ["RETN", ""],
    101: ["RETN", ""],
    109: ["RETN", ""],
    117: ["RETN", ""],
    125: ["RETN", ""],
    70: ["IM 0", ""],
    78: ["IM 0", ""],
    102: ["IM 0", ""],
    110: ["IM 0", ""],
    71: ["LD I,A", ""],
    72: ["IN C,(C)", ""],
    73: ["OUT (C),C", ""],
    74: ["ADC HL,BC", ""],
    75: ["LD BC,({})", "nnnn"],
    79: ["LD R,A", ""],
    80: ["IN D,(C)", ""],
    81: ["OUT (C),D", ""],
    82: ["SBC HL,DE", ""],
    83: ["LD ({}),DE", "nnnn"],
    86: ["IM 1", ""],
    118: ["IM 1", ""],
    87: ["LD A,I", ""],
    88: ["IN E,(C)", ""],
    89: ["OUT (C),E", ""],
    90: ["ADC HL,DE", ""],
    91: ["LD DE,({})", "nnnn"],
    94: ["IM 2", ""],
    126: ["IM 2", ""],
    95: ["LD A,R", ""],
    96: ["IN H,(C)", ""],
    97: ["OUT (C),H", ""],
    98: ["SBC HL,HL", ""],
    99: ["LD ({}),HL", "nnnn"],
    103: ["RRD", ""],
    104: ["IN L,(C)", ""],
    105: ["OUT (C),L", ""],
    106: ["ADC HL,HL", ""],
    107: ["LD HL,({})", "nnnn"],
    111: ["RLD", ""],
    112: ["IN F,(C)", ""],
    113: ["OUT (C),0", ""],
    114: ["SBC HL,SP", ""],
    115: ["LD ({}),SP", "nnnn"],
    120: ["IN A,(C)", ""],
    121: ["OUT (C),A", ""],
    122: ["ADC HL,SP", ""],
    123: ["LD SP,({})", "nnnn"],
    160: ["LDI", ""],
    161: ["CPI", ""],
    162: ["INI", ""],
    163: ["OUTI", ""],
    168: ["LDD", ""],
    169: ["CPD", ""],
    170: ["IND", ""],
    171: ["OUTD", ""],
    176: ["LDIR", ""],
    177: ["CPIR", ""],
    178: ["INIR", ""],
    179: ["OTIR", ""],
    184: ["LDDR", ""],
    185: ["CPDR", ""],
    186: ["INDR", ""],
    187: ["OTDR", ""]
};

opcodes_fd = {
    9: ["ADD IY,BC", ""],
    25: ["ADD IY,DE", ""],
    33: ["LD IY,{}", "nnnn"],
    34: ["LD ({}),IY", "nnnn"],
    35: ["INC IY", ""],
    36: ["INC IYH", ""],
    37: ["DEC IYH", ""],
    38: ["LD IYH,{}", "nn"],
    41: ["ADD IY,IY", ""],
    42: ["LD IY,({})", "nnnn"],
    43: ["DEC IY", ""],
    44: ["INC IYL", ""],
    45: ["DEC IYL", ""],
    46: ["LD IYL,{}", "nn"],
    52: ["INC (IY+{})", "dd"],
    53: ["DEC (IY+{})", "dd"],
    54: ["LD (IY+{}),nn", "dd"],
    57: ["ADD IY,SP", ""],
    68: ["LD B,IYH", ""],
    69: ["LD B,IYL", ""],
    70: ["LD B,(IY+{})", "dd"],
    76: ["LD C,IYH", ""],
    77: ["LD C,IYL", ""],
    78: ["LD C,(IY+{})", "dd"],
    84: ["LD D,IYH", ""],
    85: ["LD D,IYL", ""],
    86: ["LD D,(IY+{})", "dd"],
    92: ["LD E,IYH", ""],
    93: ["LD E,IYL", ""],
    94: ["LD E,(IY+{})", "dd"],
    96: ["LD IYH,B", ""],
    97: ["LD IYH,C", ""],
    98: ["LD IYH,D", ""],
    99: ["LD IYH,E", ""],
    100: ["LD IYH,IYH", ""],
    101: ["LD IYH,IYL", ""],
    102: ["LD H,(IY+{})", "dd"],
    103: ["LD IYH,A", ""],
    104: ["LD IYL,B", ""],
    105: ["LD IYL,C", ""],
    106: ["LD IYL,D", ""],
    107: ["LD IYL,E", ""],
    108: ["LD IYL,IYH", ""],
    109: ["LD IYL,IYL", ""],
    110: ["LD L,(IY+{})", "dd"],
    111: ["LD IYL,A", ""],
    112: ["LD (IY+{}),B", "dd"],
    113: ["LD (IY+{}),C", "dd"],
    114: ["LD (IY+{}),D", "dd"],
    115: ["LD (IY+{}),E", "dd"],
    116: ["LD (IY+{}),H", "dd"],
    117: ["LD (IY+{}),L", "dd"],
    119: ["LD (IY+{}),A", "dd"],
    124: ["LD A,IYH", ""],
    125: ["LD A,IYL", ""],
    126: ["LD A,(IY+{})", "dd"],
    132: ["ADD A,IYH", ""],
    133: ["ADD A,IYL", ""],
    134: ["ADD A,(IY+{})", "dd"],
    140: ["ADC A,IYH", ""],
    141: ["ADC A,IYL", ""],
    142: ["ADC A,(IY+{})", "dd"],
    148: ["SUB A,IYH", ""],
    149: ["SUB A,IYL", ""],
    150: ["SUB A,(IY+{})", "dd"],
    156: ["SBC A,IYH", ""],
    157: ["SBC A,IYL", ""],
    158: ["SBC A,(IY+{})", "dd"],
    164: ["AND A,IYH", ""],
    165: ["AND A,IYL", ""],
    166: ["AND A,(IY+{})", "dd"],
    172: ["XOR A,IYH", ""],
    173: ["XOR A,IYL", ""],
    174: ["XOR A,(IY+{})", "dd"],
    180: ["OR A,IYH", ""],
    181: ["OR A,IYL", ""],
    182: ["OR A,(IY+{})", "dd"],
    188: ["CP A,IYH", ""],
    189: ["CP A,IYL", ""],
    190: ["CP A,(IY+{})", "dd"],
    203: opcodes_fdcb,
    225: ["POP IY", ""],
    227: ["EX (SP),IY", ""],
    229: ["PUSH IY", ""],
    233: ["JP IY", ""],
    249: ["LD SP,IY", ""]
};

opcodes = {
    0: ["NOP", ""],
    1: ["LD BC,{}", "nnnn"],
    2: ["LD (BC),A", ""],
    3: ["INC BC", ""],
    4: ["INC B", ""],
    5: ["DEC B", ""],
    6: ["LD B,{}", "nn"],
    7: ["RLCA", ""],
    8: ["EX AF,AF'", ""],
    9: ["ADD HL,BC", ""],
    10: ["LD A,(BC)", ""],
    11: ["DEC BC", ""],
    12: ["INC C", ""],
    13: ["DEC C", ""],
    14: ["LD C,{}", "nn"],
    15: ["RRCA", ""],
    16: ["DJNZ {}", "offset"],
    17: ["LD DE,{}", "nnnn"],
    18: ["LD (DE),A", ""],
    19: ["INC DE", ""],
    20: ["INC D", ""],
    21: ["DEC D", ""],
    22: ["LD D,{}", "nn"],
    23: ["RLA", ""],
    24: ["JR {}", "offset"],
    25: ["ADD HL,DE", ""],
    26: ["LD A,(DE)", ""],
    27: ["DEC DE", ""],
    28: ["INC E", ""],
    29: ["DEC E", ""],
    30: ["LD E,{}", "nn"],
    31: ["RRA", ""],
    32: ["JR NZ,{}", "offset"],
    33: ["LD HL,{}", "nnnn"],
    34: ["LD ({}),HL", "nnnn"],
    35: ["INC HL", ""],
    36: ["INC H", ""],
    37: ["DEC H", ""],
    38: ["LD H,{}", "nn"],
    39: ["DAA", ""],
    40: ["JR Z,{}", "offset"],
    41: ["ADD HL,HL", ""],
    42: ["LD HL,({})", "nnnn"],
    43: ["DEC HL", ""],
    44: ["INC L", ""],
    45: ["DEC L", ""],
    46: ["LD L,{}", "nn"],
    47: ["CPL", ""],
    48: ["JR NC,{}", "offset"],
    49: ["LD SP,{}", "nnnn"],
    50: ["LD ({}),A", "nnnn"],
    51: ["INC SP", ""],
    52: ["INC (HL)", ""],
    53: ["DEC (HL)", ""],
    54: ["LD (HL),{}", "nn"],
    55: ["SCF", ""],
    56: ["JR C,{}", "offset"],
    57: ["ADD HL,SP", ""],
    58: ["LD A,({})", "nnnn"],
    59: ["DEC SP", ""],
    60: ["INC A", ""],
    61: ["DEC A", ""],
    62: ["LD A,{}", "nn"],
    63: ["CCF", ""],
    64: ["LD B,B", ""],
    65: ["LD B,C", ""],
    66: ["LD B,D", ""],
    67: ["LD B,E", ""],
    68: ["LD B,H", ""],
    69: ["LD B,L", ""],
    70: ["LD B,(HL)", ""],
    71: ["LD B,A", ""],
    72: ["LD C,B", ""],
    73: ["LD C,C", ""],
    74: ["LD C,D", ""],
    75: ["LD C,E", ""],
    76: ["LD C,H", ""],
    77: ["LD C,L", ""],
    78: ["LD C,(HL)", ""],
    79: ["LD C,A", ""],
    80: ["LD D,B", ""],
    81: ["LD D,C", ""],
    82: ["LD D,D", ""],
    83: ["LD D,E", ""],
    84: ["LD D,H", ""],
    85: ["LD D,L", ""],
    86: ["LD D,(HL)", ""],
    87: ["LD D,A", ""],
    88: ["LD E,B", ""],
    89: ["LD E,C", ""],
    90: ["LD E,D", ""],
    91: ["LD E,E", ""],
    92: ["LD E,H", ""],
    93: ["LD E,L", ""],
    94: ["LD E,(HL)", ""],
    95: ["LD E,A", ""],
    96: ["LD H,B", ""],
    97: ["LD H,C", ""],
    98: ["LD H,D", ""],
    99: ["LD H,E", ""],
    100: ["LD H,H", ""],
    101: ["LD H,L", ""],
    102: ["LD H,(HL)", ""],
    103: ["LD H,A", ""],
    104: ["LD L,B", ""],
    105: ["LD L,C", ""],
    106: ["LD L,D", ""],
    107: ["LD L,E", ""],
    108: ["LD L,H", ""],
    109: ["LD L,L", ""],
    110: ["LD L,(HL)", ""],
    111: ["LD L,A", ""],
    112: ["LD (HL),B", ""],
    113: ["LD (HL),C", ""],
    114: ["LD (HL),D", ""],
    115: ["LD (HL),E", ""],
    116: ["LD (HL),H", ""],
    117: ["LD (HL),L", ""],
    118: ["HALT", ""],
    119: ["LD (HL),A", ""],
    120: ["LD A,B", ""],
    121: ["LD A,C", ""],
    122: ["LD A,D", ""],
    123: ["LD A,E", ""],
    124: ["LD A,H", ""],
    125: ["LD A,L", ""],
    126: ["LD A,(HL)", ""],
    127: ["LD A,A", ""],
    128: ["ADD A,B", ""],
    129: ["ADD A,C", ""],
    130: ["ADD A,D", ""],
    131: ["ADD A,E", ""],
    132: ["ADD A,H", ""],
    133: ["ADD A,L", ""],
    134: ["ADD A,(HL)", ""],
    135: ["ADD A,A", ""],
    136: ["ADC A,B", ""],
    137: ["ADC A,C", ""],
    138: ["ADC A,D", ""],
    139: ["ADC A,E", ""],
    140: ["ADC A,H", ""],
    141: ["ADC A,L", ""],
    142: ["ADC A,(HL)", ""],
    143: ["ADC A,A", ""],
    144: ["SUB A,B", ""],
    145: ["SUB A,C", ""],
    146: ["SUB A,D", ""],
    147: ["SUB A,E", ""],
    148: ["SUB A,H", ""],
    149: ["SUB A,L", ""],
    150: ["SUB A,(HL)", ""],
    151: ["SUB A,A", ""],
    152: ["SBC A,B", ""],
    153: ["SBC A,C", ""],
    154: ["SBC A,D", ""],
    155: ["SBC A,E", ""],
    156: ["SBC A,H", ""],
    157: ["SBC A,L", ""],
    158: ["SBC A,(HL)", ""],
    159: ["SBC A,A", ""],
    160: ["AND A,B", ""],
    161: ["AND A,C", ""],
    162: ["AND A,D", ""],
    163: ["AND A,E", ""],
    164: ["AND A,H", ""],
    165: ["AND A,L", ""],
    166: ["AND A,(HL)", ""],
    167: ["AND A,A", ""],
    168: ["XOR A,B", ""],
    169: ["XOR A,C", ""],
    170: ["XOR A,D", ""],
    171: ["XOR A,E", ""],
    172: ["XOR A,H", ""],
    173: ["XOR A,L", ""],
    174: ["XOR A,(HL)", ""],
    175: ["XOR A,A", ""],
    176: ["OR A,B", ""],
    177: ["OR A,C", ""],
    178: ["OR A,D", ""],
    179: ["OR A,E", ""],
    180: ["OR A,H", ""],
    181: ["OR A,L", ""],
    182: ["OR A,(HL)", ""],
    183: ["OR A,A", ""],
    184: ["CP B", ""],
    185: ["CP C", ""],
    186: ["CP D", ""],
    187: ["CP E", ""],
    188: ["CP H", ""],
    189: ["CP L", ""],
    190: ["CP (HL)", ""],
    191: ["CP A", ""],
    192: ["RET NZ", ""],
    193: ["POP BC", ""],
    194: ["JP NZ,{}", "nnnn"],
    195: ["JP {}", "nnnn"],
    196: ["CALL NZ,{}", "nnnn"],
    197: ["PUSH BC", ""],
    198: ["ADD A,{}", "nn"],
    199: ["RST 00", ""],
    200: ["RET Z", ""],
    201: ["RET", ""],
    202: ["JP Z,{}", "nnnn"],
    203: opcodes_cb,
    204: ["CALL Z,{}", "nnnn"],
    205: ["CALL {}", "nnnn"],
    206: ["ADC A,{}", "nn"],
    207: ["RST 8", ""],
    208: ["RET NC", ""],
    209: ["POP DE", ""],
    210: ["JP NC,{}", "nnnn"],
    211: ["OUT ({}),A", "nn"],
    212: ["CALL NC,{}", "nnnn"],
    213: ["PUSH DE", ""],
    214: ["SUB {}", "nn"],
    215: ["RST 10", ""],
    216: ["RET C", ""],
    217: ["EXX", ""],
    218: ["JP C,{}", "nnnn"],
    219: ["IN A,({})", "nn"],
    220: ["CALL C,{}", "nnnn"],
    221: opcodes_dd,
    222: ["SBC A,{}", "nn"],
    223: ["RST 18", ""],
    224: ["RET PO", ""],
    225: ["POP HL", ""],
    226: ["JP PO,{}", "nnnn"],
    227: ["EX (SP),HL", ""],
    228: ["CALL PO,{}", "nnnn"],
    229: ["PUSH HL", ""],
    230: ["AND {}", "nn"],
    231: ["RST 20", ""],
    232: ["RET PE", ""],
    233: ["JP HL", ""],
    234: ["JP PE,{}", "nnnn"],
    235: ["EX DE,HL", ""],
    236: ["CALL PE,{}", "nnnn"],
    237: opcodes_ed,
    238: ["XOR A,{}", "nn"],
    239: ["RST 28", ""],
    240: ["RET P", ""],
    241: ["POP AF", ""],
    242: ["JP P,{}", "nnnn"],
    243: ["DI", ""],
    244: ["CALL P,{}", "nnnn"],
    245: ["PUSH AF", ""],
    246: ["OR {}", "nn"],
    247: ["RST 30", ""],
    248: ["RET M", ""],
    249: ["LD SP,HL", ""],
    250: ["JP M,{}", "nnnn"],
    251: ["EI", ""],
    252: ["CALL M,{}", "nnnn"],
    253: opcodes_fd,
    254: ["CP {}", "nn"],
    255: ["RST 38", ""]
};


function hexString(n, length) {
    var result = n.toString(16).toUpperCase();
    while (result.length < length) {
        result = '0' + result;
    }

    return result + 'h';
}

function disassemble(address, count) {
    var result = "";
    
    for (var i = 0; i < count; ++i)
    {
        if (address > 65530) {
            // Avoid reading past end of memory
            return result;
        }
        
        var table = opcodes;
        while (true) {
            var opcode = readbyte_internal(address++);
            var entry = table[opcode];
            
            if (entry == undefined) {
                return "unknown";
            }
            
            if (entry.constructor != Array) {
                table = entry;
                continue;
            }
            
            var mnemonic = entry[0];
            var operand = entry[1];
            
            // TODO: Proper sign for operands; calculate actual addresses for relative jumps.
            switch (operand) {
            case 'nn':
            case 'dd':
            case 'offset':
                operand = hexString(readbyte_internal(address++), 2);
                break;
                
            case 'nnnn':
                operand = hexString(readbyte_internal(address) + 256 * readbyte_internal(address + 1), 4);
                address += 2;
                break;
            }
            
            result += mnemonic.replace('{}', operand) + "\n";
            break;
        }
    }
    
    return result;
}
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 2013-01-23
 * 
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See LICENSE.md
 */

/*global self */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

//var child_process = require('child_process')
//child_process.exec('x-www-browser google.com')


//var saveAs = saveAs;
/*
  || (navigator.msSaveBlob && navigator.msSaveBlob.bind(navigator))
  || (function(view) {
	"use strict";
	var
		  doc = view.document
		  // only get URL when necessary in case BlobBuilder.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, URL = view.URL || view.webkitURL || view
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = doc.createEvent("MouseEvents");
			event.initMouseEvent(
				"click", true, false, view, 0, 0, 0, 0, 0
				, false, false, false, false, 0, null
			);
			return node.dispatchEvent(event); // false if event was cancelled
		}
		, webkit_req_fs = view.webkitRequestFileSystem
		, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
		, throw_outside = function (ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		, fs_min_size = 0
		, deletion_queue = []
		, process_deletion_queue = function() {
			var i = deletion_queue.length;
			while (i--) {
				var file = deletion_queue[i];
				if (typeof file === "string") { // file is an object URL
					URL.revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			}
			deletion_queue.length = 0; // clear queue
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, FileSaver = function(blob, name) {
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, blob_changed = false
				, object_url
				, target_view
				, get_object_url = function() {
					var object_url = get_URL().createObjectURL(blob);
					deletion_queue.push(object_url);
					return object_url;
				}
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					// don't create more object URLs than needed
					if (blob_changed || !object_url) {
						object_url = get_object_url(blob);
					}
					if (target_view) {
						target_view.location.href = object_url;
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
				}
				, abortable = function(func) {
					return function() {
						if (filesaver.readyState !== filesaver.DONE) {
							return func.apply(this, arguments);
						}
					};
				}
				, create_if_not_found = {create: true, exclusive: false}
				, slice
			;
			filesaver.readyState = filesaver.INIT;
			if (!name) {
				name = "download";
			}
			if (can_use_save_link) {
				object_url = get_object_url(blob);
				save_link.href = object_url;
				save_link.download = name;
				if (click(save_link)) {
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					return;
				}
			}
			// Object and web filesystem URLs have a problem saving in Google Chrome when
			// viewed in a tab, so I force save with application/octet-stream
			// http://code.google.com/p/chromium/issues/detail?id=91158
			if (view.chrome && type && type !== force_saveable_type) {
				slice = blob.slice || blob.webkitSlice;
				blob = slice.call(blob, 0, blob.size, force_saveable_type);
				blob_changed = true;
			}
			// Since I can't be sure that the guessed media type will trigger a download
			// in WebKit, I append .download to the filename.
			// https://bugs.webkit.org/show_bug.cgi?id=65440
			if (webkit_req_fs && name !== "download") {
				name += ".download";
			}
			if (type === force_saveable_type || webkit_req_fs) {
				target_view = view;
			} else {
				target_view = view.open();
			}
			if (!req_fs) {
				fs_error();
				return;
			}
			fs_min_size += blob.size;
			req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
				fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
					var save = function() {
						dir.getFile(name, create_if_not_found, abortable(function(file) {
							file.createWriter(abortable(function(writer) {
								writer.onwriteend = function(event) {
									target_view.location.href = file.toURL();
									deletion_queue.push(file);
									filesaver.readyState = filesaver.DONE;
									dispatch(filesaver, "writeend", event);
								};
								writer.onerror = function() {
									var error = writer.error;
									if (error.code !== error.ABORT_ERR) {
										fs_error();
									}
								};
								"writestart progress write abort".split(" ").forEach(function(event) {
									writer["on" + event] = filesaver["on" + event];
								});
								writer.write(blob);
								filesaver.abort = function() {
									writer.abort();
									filesaver.readyState = filesaver.DONE;
								};
								filesaver.readyState = filesaver.WRITING;
							}), fs_error);
						}), fs_error);
					};
					dir.getFile(name, {create: false}, abortable(function(file) {
						// delete file if it already exists
						file.remove();
						save();
					}), abortable(function(ex) {
						if (ex.code === ex.NOT_FOUND_ERR) {
							save();
						} else {
							fs_error();
						}
					}));
				}), fs_error);
			}), fs_error);
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name) {
			return new FileSaver(blob, name);
		}
	;
	FS_proto.abort = function() {
		var filesaver = this;
		filesaver.readyState = filesaver.DONE;
		dispatch(filesaver, "abort");
	};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;
	
	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;
	
	view.addEventListener("unload", process_deletion_queue, false);
	return saveAs;
}(self));
//}());
*/

var http    = require("http")
  , chalk   = require("chalk")
  , io      = require("socket.io")
  , fs      = require('fs')
  , fabric  = require('fabric').fabric

console.log(chalk.cyan("Server up on 8888"))
var server = http.createServer(requestHandler).listen(8888);
io = io.listen(server) 
//var array = new Array ();

//establishes the connection
//io.sockets.on('connection', function (socket) {
//  console.log ("got connected");
//});

function requestHandler (req, res) {

    if(req.url == "/init"){
        console.log("Starting a new Z80 Mahcine");

        // Start the machine
        nanowasp.Keyboard.init();
        console.log(chalk.cyan("Hi yo"))
        var nw = new nanowasp.NanoWasp();
        console.log ("made variable nw");
        nw.main();
        console.log ("finished running through main");    
      res.setHeader("Content-Type", "text/html");
      res.end("Machine Started :");

    }



  else if  (req.url == "/Games.html") {

    fs.readFile("Games.html", function(err, text){
        nanowasp.Keyboard.init();
        console.log(chalk.cyan("Hi yo"))
        var nw = new nanowasp.NanoWasp();
        console.log ("made variable nw");



        nw.main();
        console.log ("finished running through main");    

      res.setHeader("Content-Type", "text/html");
      res.end(text);
    });

   }

   else {
    console.log ("redirect nowhere");
   } 

console.log("Incomming Request");

 console.log(chalk.cyan("Request: " + req.url));   
 console.log(chalk.cyan("Response: " + res.url));   
/**
    else if(req.url == "/data.js") {
    console.log ("data js url");    
    fs.readFile("data.js", function(err, text){
      res.setHeader("Content-Type", "text/javascript");
      res.end(text);
    });
    return;

  }

    else if(req.url == "/index1.html") {
    console.log ("data js url");    
    fs.readFile("index1.html", function(err, text){
      res.setHeader("Content-Type", "text/html");
      res.end(text);
    });
    return;

  }


    else if(req.url == "/z80.js") {
    console.log ("z80 js url");    
    fs.readFile("z80.js", function(err, text){
      res.setHeader("Content-Type", "text/javascript");
      res.end(text);
    });
    return;
}
*/

} 

/*! z80.jscpp: z80 supplementary functions
   Copyright (c) 1999-2008 Philip Kendall, Matthew Westcott

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Contact details: <matthew@west.co.tt>
    Matthew Westcott, 14 Daisy Hill Drive, Adlington, Chorley, Lancs PR6 9NE UNITED KINGDOM
*/
/* z80_macros.jscpp: Some commonly used z80 things as macros
   Copyright (c) 1999-2008 Philip Kendall, Matthew Westcott

   $Id$

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Contact details: <matthew@west.co.tt>
    Matthew Westcott, 14 Daisy Hill Drive, Adlington, Chorley, Lancs PR6 9NE UNITED KINGDOM
*/
/* Macros used for accessing the registers */
/* The flags */
/* Get the appropriate contended memory delay. Use this macro later
   to avoid a function call if memory contention is disabled */
/* #define contend(address,time) tstates += contend_memory( (address) ) + (time); */
/* #define contend_io(port,time) tstates += contend_port( (port) ) + (time); */
/* Some commonly used instructions */
/* Macro for the {DD,FD} CB dd xx rotate/shift instructions */
/* speed tweaks */
/* #define readbyte readbyte_internal */
//#define readbyte_internal(b) memory[b]
/* Whether a half carry occured or not can be determined by looking at
   the 3rd bit of the two arguments and the result; these are hashed
   into this table in the form r12, where r is the 3rd bit of the
   result, 1 is the 3rd bit of the 1st argument and 2 is the
   third bit of the 2nd argument; the tables differ for add and subtract
   operations */
var halfcarry_add_table = [ 0, 0x10, 0x10, 0x10, 0, 0, 0, 0x10 ];
var halfcarry_sub_table = [ 0, 0, 0x10, 0, 0x10, 0, 0x10, 0x10 ];
/* Similarly, overflow can be determined by looking at the 7th bits; again
   the hash into this table is r12 */
var overflow_add_table = [ 0, 0, 0, 0x04, 0x04, 0, 0, 0 ];
var overflow_sub_table = [ 0, 0x04, 0, 0, 0, 0, 0x04, 0 ];
/* Some more tables; initialised in z80_init_tables() */
var sz53_table = []; /* The S, Z, 5 and 3 bits of the index */
var parity_table = []; /* The parity of the lookup value */
var sz53p_table = []; /* OR the above two tables together */
/* This is what everything acts on! */
var z80 = {
 a:0, f:0, b:0, c:0, d:0, e:0, h:0, l:0,
 a_:0, f_:0, b_:0, c_:0, d_:0, e_:0, h_:0, l_:0,
 ixh:0, ixl:0, iyh:0, iyl:0,
 i:0,
 r:0, /* The low seven bits of the R register. 16 bits long
               so it can also act as an RZX instruction counter */
 r7:0, /* The high bit of the R register */
 sp:0, pc:0,
 iff1:0, iff2:0, im:0, halted:false
};
/* Set up the z80 emulation */
function z80_init() {
  z80_init_tables();
  z80_clear_breakpoints();
}
/* Initalise the tables used to set flags */
function z80_init_tables() {
  var i,j,k;
  var parity;
  for(i=0;i<0x100;i++) {
    sz53_table[i]= i & ( 0x08 | 0x20 | 0x80 );
    j=i; parity=0;
    for(k=0;k<8;k++) { parity ^= j & 1; j >>=1; }
    parity_table[i]= ( parity ? 0 : 0x04 );
    sz53p_table[i] = sz53_table[i] | parity_table[i];
  }
  sz53_table[0] |= 0x40;
  sz53p_table[0] |= 0x40;
}
/* Reset the z80 */
function z80_reset() {
  z80.a =z80.f =z80.b =z80.c =z80.d =z80.e =z80.h =z80.l =0;
  z80.a_ =z80.f_ =z80.b_ =z80.c_ =z80.d_ =z80.e_=z80.h_ =z80.l_=0;
  z80.ixh=z80.ixl=z80.iyh=z80.iyl=0;
  z80.i=z80.r=z80.r7=0;
  z80.sp=z80.pc=0;
  z80.iff1=z80.iff2=z80.im=0;
  z80.halted=0;
  z80_clear_breakpoints();
}
/* Process a z80 maskable interrupt */
function z80_interrupt() {
  /* Process if IFF1 set && (if a Timex machine, SCLD INTDISABLE is clear) */
  if( z80.iff1 ) {
    if( z80.halted ) { z80.pc++; z80.pc &= 0xffff; z80.halted = false; }
    z80.iff1=z80.iff2=0;
    z80.sp = (z80.sp - 1) & 0xffff;
    writebyte_internal( z80.sp, (z80.pc >> 8) );
    z80.sp = (z80.sp - 1) & 0xffff;
    writebyte_internal( z80.sp, (z80.pc & 0xff) );
    z80.r = (z80.r+1) & 0x7f; /* rzx_instructions_offset--; */
    switch(z80.im) {
      case 0: z80.pc = 0x0038; tstates+=12; break;
      case 1: z80.pc = 0x0038; tstates+=13; break;
      case 2:
 {
   var inttemp=(0x100*z80.i)+0xff;
   var pcl = readbyte_internal(inttemp++); inttemp &= 0xfff; var pch = readbyte_internal(inttemp);
   z80.pc = pcl | (pch << 8);
   tstates+=19;
   break;
 }
      default:
 ui_error( UI_ERROR_ERROR, "Unknown interrupt mode %d", z80.im );
 fuse_abort();
    }
  }
}
/* Process a z80 non-maskable interrupt */
function z80_nmi() {
  /* FIXME: what happens if the z80 is HALTed? */
  z80.iff1 = 0;
  z80.sp = (z80.sp - 1) & 0xffff;
  writebyte_internal( z80.sp, (z80.pc >> 8) );
  z80.sp = (z80.sp - 1) & 0xffff;
  writebyte_internal( z80.sp, (z80.pc & 0xff) );
  /* FIXME: how is R affected? */
  /* FIXME: how does contention apply here? */
  tstates += 11; z80.pc = 0x0066;
}
/* z80_ops.jscpp: Process the next opcode
   Copyright (c) 1999-2008 Philip Kendall, Witold Filipczyk, Matthew Westcott

   $Id$

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Contact details: <matthew@west.co.tt>
    Matthew Westcott, 14 Daisy Hill Drive, Adlington, Chorley, Lancs PR6 9NE UNITED KINGDOM
*/
/* z80_macros.jscpp: Some commonly used z80 things as macros
   Copyright (c) 1999-2008 Philip Kendall, Matthew Westcott

   $Id$

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Contact details: <matthew@west.co.tt>
    Matthew Westcott, 14 Daisy Hill Drive, Adlington, Chorley, Lancs PR6 9NE UNITED KINGDOM
*/
/* Macros used for accessing the registers */
/* The flags */
/* Get the appropriate contended memory delay. Use this macro later
   to avoid a function call if memory contention is disabled */
/* #define contend(address,time) tstates += contend_memory( (address) ) + (time); */
/* #define contend_io(port,time) tstates += contend_port( (port) ) + (time); */
/* Some commonly used instructions */
/* Macro for the {DD,FD} CB dd xx rotate/shift instructions */
/* speed tweaks */
/* #define readbyte readbyte_internal */
//#define readbyte_internal(b) memory[b]
function sign_extend(v) {
  return v < 128 ? v : v-256;
}
function z80_set_breakpoint(location, handler) {
    z80.breakpoints[location] = handler;
}
function z80_clear_breakpoints() {
    z80.breakpoints = {};
}
function z80_ret() {
    { { tstates += (3);; var lowbyte =readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; var highbyte=readbyte_internal(z80.sp++); z80.sp &= 0xffff; (z80.pc) = lowbyte | (highbyte << 8);};};
}
/* Execute Z80 opcodes until the next event */
function z80_do_opcodes()
{
  while(tstates < event_next_event ) {
    var opcode;
    /* Do the instruction fetch; readbyte_internal used here to avoid
       triggering read breakpoints */
    breakpoint = z80.breakpoints[z80.pc];
    if (breakpoint != null) {
        breakpoint();
    }
    tstates += (4);; z80.r = (z80.r+1) & 0x7f;
    opcode = readbyte_internal( z80.pc++ ); z80.pc &= 0xffff;
    switch(opcode) {
/* opcodes_base.c: unshifted Z80 opcodes
   Copyright (c) 1999-2008 Philip Kendall, Matthew Westcott

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Contact details: <matthew@west.co.tt>
    Matthew Westcott, 14 Daisy Hill Drive, Adlington, Chorley, Lancs PR6 9NE UNITED KINGDOM

*/
/* NB: this file is autogenerated by 'z80.pl' from 'opcodes_base.dat',
   and included in 'z80_ops.jscpp' */
    case 0x00: /* NOP */
      break;
    case 0x01: /* LD BC,nnnn */
      tstates += (3);;
      z80.c=readbyte_internal(z80.pc++);
      z80.pc &= 0xffff;
      tstates += (3);;
      z80.b=readbyte_internal(z80.pc++);
      z80.pc &= 0xffff;
      break;
    case 0x02: /* LD (BC),A */
      tstates += (3);;
      writebyte_internal((z80.c | (z80.b << 8)),z80.a);
      break;
    case 0x03: /* INC BC */
      tstates += 2;
      var wordtemp = ((z80.c | (z80.b << 8)) + 1) & 0xffff;
      z80.b = wordtemp >> 8;
      z80.c = wordtemp & 0xff;
      break;
    case 0x04: /* INC B */
      { (z80.b) = ((z80.b) + 1) & 0xff; z80.f = ( z80.f & 0x01 ) | ( (z80.b)==0x80 ? 0x04 : 0 ) | ( (z80.b)&0x0f ? 0 : 0x10 ) | sz53_table[(z80.b)];};
      break;
    case 0x05: /* DEC B */
      { z80.f = ( z80.f & 0x01 ) | ( (z80.b)&0x0f ? 0 : 0x10 ) | 0x02; (z80.b) = ((z80.b) - 1) & 0xff; z80.f |= ( (z80.b)==0x7f ? 0x04 : 0 ) | sz53_table[z80.b];};
      break;
    case 0x06: /* LD B,nn */
      tstates += (3);;
      z80.b=readbyte_internal(z80.pc++); z80.pc &= 0xffff;
      break;
    case 0x07: /* RLCA */
      z80.a = ( (z80.a & 0x7f) << 1 ) | ( z80.a >> 7 );
      z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) |
 ( z80.a & ( 0x01 | 0x08 | 0x20 ) );
      break;
    case 0x08: /* EX AF,AF' */
      /* Tape saving trap: note this traps the EX AF,AF' at #04d0, not
     #04d1 as PC has already been incremented */
      /* 0x76 - Timex 2068 save routine in EXROM */
      if( z80.pc == 0x04d1 || z80.pc == 0x0077 ) {
 if( tape_save_trap() == 0 ) break;
      }
      {
       var olda = z80.a; var oldf = z80.f;
       z80.a = z80.a_; z80.f = z80.f_;
       z80.a_ = olda; z80.f_ = oldf;
      }
      break;
    case 0x09: /* ADD HL,BC */
      { var add16temp = ((z80.l | (z80.h << 8))) + ((z80.c | (z80.b << 8))); var lookup = ( ( ((z80.l | (z80.h << 8))) & 0x0800 ) >> 11 ) | ( ( ((z80.c | (z80.b << 8))) & 0x0800 ) >> 10 ) | ( ( add16temp & 0x0800 ) >> 9 ); tstates += 7; (z80.h) = (add16temp >> 8) & 0xff; (z80.l) = add16temp & 0xff; z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) | ( add16temp & 0x10000 ? 0x01 : 0 )| ( ( add16temp >> 8 ) & ( 0x08 | 0x20 ) ) | halfcarry_add_table[lookup];};
      break;
    case 0x0a: /* LD A,(BC) */
      tstates += (3);;
      z80.a=readbyte_internal((z80.c | (z80.b << 8)));
      break;
    case 0x0b: /* DEC BC */
      tstates += 2;
      var wordtemp = ((z80.c | (z80.b << 8)) - 1) & 0xffff;
      z80.b = wordtemp >> 8;
      z80.c = wordtemp & 0xff;
      break;
    case 0x0c: /* INC C */
      { (z80.c) = ((z80.c) + 1) & 0xff; z80.f = ( z80.f & 0x01 ) | ( (z80.c)==0x80 ? 0x04 : 0 ) | ( (z80.c)&0x0f ? 0 : 0x10 ) | sz53_table[(z80.c)];};
      break;
    case 0x0d: /* DEC C */
      { z80.f = ( z80.f & 0x01 ) | ( (z80.c)&0x0f ? 0 : 0x10 ) | 0x02; (z80.c) = ((z80.c) - 1) & 0xff; z80.f |= ( (z80.c)==0x7f ? 0x04 : 0 ) | sz53_table[z80.c];};
      break;
    case 0x0e: /* LD C,nn */
      tstates += (3);;
      z80.c=readbyte_internal(z80.pc++); z80.pc &= 0xffff;
      break;
    case 0x0f: /* RRCA */
      z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) | ( z80.a & 0x01 );
      z80.a = ( z80.a >> 1) | ( (z80.a & 0x01) << 7 );
      z80.f |= ( z80.a & ( 0x08 | 0x20 ) );
      break;
    case 0x10: /* DJNZ offset */
      tstates++; tstates += (3);;
      z80.b = (z80.b-1) & 0xff;
      if(z80.b) { { tstates += (1);; tstates += (1);; tstates += (1);; tstates += (1);; tstates += (1);; z80.pc += sign_extend(readbyte_internal( z80.pc )); z80.pc &= 0xffff; }; }
      z80.pc++;
      z80.pc &= 0xffff;
      break;
    case 0x11: /* LD DE,nnnn */
      tstates += (3);;
      z80.e=readbyte_internal(z80.pc++);
      z80.pc &= 0xffff;
      tstates += (3);;
      z80.d=readbyte_internal(z80.pc++);
      z80.pc &= 0xffff;
      break;
    case 0x12: /* LD (DE),A */
      tstates += (3);;
      writebyte_internal((z80.e | (z80.d << 8)),z80.a);
      break;
    case 0x13: /* INC DE */
      tstates += 2;
      var wordtemp = ((z80.e | (z80.d << 8)) + 1) & 0xffff;
      z80.d = wordtemp >> 8;
      z80.e = wordtemp & 0xff;
      break;
    case 0x14: /* INC D */
      { (z80.d) = ((z80.d) + 1) & 0xff; z80.f = ( z80.f & 0x01 ) | ( (z80.d)==0x80 ? 0x04 : 0 ) | ( (z80.d)&0x0f ? 0 : 0x10 ) | sz53_table[(z80.d)];};
      break;
    case 0x15: /* DEC D */
      { z80.f = ( z80.f & 0x01 ) | ( (z80.d)&0x0f ? 0 : 0x10 ) | 0x02; (z80.d) = ((z80.d) - 1) & 0xff; z80.f |= ( (z80.d)==0x7f ? 0x04 : 0 ) | sz53_table[z80.d];};
      break;
    case 0x16: /* LD D,nn */
      tstates += (3);;
      z80.d=readbyte_internal(z80.pc++); z80.pc &= 0xffff;
      break;
    case 0x17: /* RLA */
      {
 var bytetemp = z80.a;
 z80.a = ( (z80.a & 0x7f) << 1 ) | ( z80.f & 0x01 );
 z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) |
   ( z80.a & ( 0x08 | 0x20 ) ) | ( bytetemp >> 7 );
      }
      break;
    case 0x18: /* JR offset */
      tstates += (3);;
      { tstates += (1);; tstates += (1);; tstates += (1);; tstates += (1);; tstates += (1);; z80.pc += sign_extend(readbyte_internal( z80.pc )); z80.pc &= 0xffff; };
      z80.pc++; z80.pc &= 0xffff;
      break;
    case 0x19: /* ADD HL,DE */
      { var add16temp = ((z80.l | (z80.h << 8))) + ((z80.e | (z80.d << 8))); var lookup = ( ( ((z80.l | (z80.h << 8))) & 0x0800 ) >> 11 ) | ( ( ((z80.e | (z80.d << 8))) & 0x0800 ) >> 10 ) | ( ( add16temp & 0x0800 ) >> 9 ); tstates += 7; (z80.h) = (add16temp >> 8) & 0xff; (z80.l) = add16temp & 0xff; z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) | ( add16temp & 0x10000 ? 0x01 : 0 )| ( ( add16temp >> 8 ) & ( 0x08 | 0x20 ) ) | halfcarry_add_table[lookup];};
      break;
    case 0x1a: /* LD A,(DE) */
      tstates += (3);;
      z80.a=readbyte_internal((z80.e | (z80.d << 8)));
      break;
    case 0x1b: /* DEC DE */
      tstates += 2;
      var wordtemp = ((z80.e | (z80.d << 8)) - 1) & 0xffff;
      z80.d = wordtemp >> 8;
      z80.e = wordtemp & 0xff;
      break;
    case 0x1c: /* INC E */
      { (z80.e) = ((z80.e) + 1) & 0xff; z80.f = ( z80.f & 0x01 ) | ( (z80.e)==0x80 ? 0x04 : 0 ) | ( (z80.e)&0x0f ? 0 : 0x10 ) | sz53_table[(z80.e)];};
      break;
    case 0x1d: /* DEC E */
      { z80.f = ( z80.f & 0x01 ) | ( (z80.e)&0x0f ? 0 : 0x10 ) | 0x02; (z80.e) = ((z80.e) - 1) & 0xff; z80.f |= ( (z80.e)==0x7f ? 0x04 : 0 ) | sz53_table[z80.e];};
      break;
    case 0x1e: /* LD E,nn */
      tstates += (3);;
      z80.e=readbyte_internal(z80.pc++); z80.pc &= 0xffff;
      break;
    case 0x1f: /* RRA */
      {
 var bytetemp = z80.a;
 z80.a = ( z80.a >> 1 ) | ( (z80.f & 0x01) << 7 );
 z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) |
   ( z80.a & ( 0x08 | 0x20 ) ) | ( bytetemp & 0x01 ) ;
      }
      break;
    case 0x20: /* JR NZ,offset */
      tstates += (3);;
      if( ! ( z80.f & 0x40 ) ) { { tstates += (1);; tstates += (1);; tstates += (1);; tstates += (1);; tstates += (1);; z80.pc += sign_extend(readbyte_internal( z80.pc )); z80.pc &= 0xffff; }; }
      z80.pc++; z80.pc &= 0xffff;
      break;
    case 0x21: /* LD HL,nnnn */
      tstates += (3);;
      z80.l=readbyte_internal(z80.pc++);
      z80.pc &= 0xffff;
      tstates += (3);;
      z80.h=readbyte_internal(z80.pc++);
      z80.pc &= 0xffff;
      break;
    case 0x22: /* LD (nnnn),HL */
      { var ldtemp; tstates += (3);; ldtemp=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (3);; ldtemp|=readbyte_internal(z80.pc++) << 8; z80.pc &= 0xffff; tstates += (3);; writebyte_internal(ldtemp++,(z80.l)); ldtemp &= 0xffff; tstates += (3);; writebyte_internal(ldtemp,(z80.h)); break;};
      break;
    case 0x23: /* INC HL */
      tstates += 2;
      var wordtemp = ((z80.l | (z80.h << 8)) + 1) & 0xffff;
      z80.h = wordtemp >> 8;
      z80.l = wordtemp & 0xff;
      break;
    case 0x24: /* INC H */
      { (z80.h) = ((z80.h) + 1) & 0xff; z80.f = ( z80.f & 0x01 ) | ( (z80.h)==0x80 ? 0x04 : 0 ) | ( (z80.h)&0x0f ? 0 : 0x10 ) | sz53_table[(z80.h)];};
      break;
    case 0x25: /* DEC H */
      { z80.f = ( z80.f & 0x01 ) | ( (z80.h)&0x0f ? 0 : 0x10 ) | 0x02; (z80.h) = ((z80.h) - 1) & 0xff; z80.f |= ( (z80.h)==0x7f ? 0x04 : 0 ) | sz53_table[z80.h];};
      break;
    case 0x26: /* LD H,nn */
      tstates += (3);;
      z80.h=readbyte_internal(z80.pc++); z80.pc &= 0xffff;
      break;
    case 0x27: /* DAA */
      {
 var add = 0, carry = ( z80.f & 0x01 );
 if( ( z80.f & 0x10 ) || ( (z80.a & 0x0f)>9 ) ) add=6;
 if( carry || (z80.a > 0x99 ) ) add|=0x60;
 if( z80.a > 0x99 ) carry=0x01;
 if ( z80.f & 0x02 ) {
   { var subtemp = z80.a - (add); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (add) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
 } else {
   { var addtemp = z80.a + (add); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (add) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
 }
 z80.f = ( z80.f & ~( 0x01 | 0x04) ) | carry | parity_table[z80.a];
      }
      break;
    case 0x28: /* JR Z,offset */
      tstates += (3);;
      if( z80.f & 0x40 ) { { tstates += (1);; tstates += (1);; tstates += (1);; tstates += (1);; tstates += (1);; z80.pc += sign_extend(readbyte_internal( z80.pc )); z80.pc &= 0xffff; }; }
      z80.pc++; z80.pc &= 0xffff;
      break;
    case 0x29: /* ADD HL,HL */
      { var add16temp = ((z80.l | (z80.h << 8))) + ((z80.l | (z80.h << 8))); var lookup = ( ( ((z80.l | (z80.h << 8))) & 0x0800 ) >> 11 ) | ( ( ((z80.l | (z80.h << 8))) & 0x0800 ) >> 10 ) | ( ( add16temp & 0x0800 ) >> 9 ); tstates += 7; (z80.h) = (add16temp >> 8) & 0xff; (z80.l) = add16temp & 0xff; z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) | ( add16temp & 0x10000 ? 0x01 : 0 )| ( ( add16temp >> 8 ) & ( 0x08 | 0x20 ) ) | halfcarry_add_table[lookup];};
      break;
    case 0x2a: /* LD HL,(nnnn) */
      { var ldtemp; tstates += (3);; ldtemp=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (3);; ldtemp|=readbyte_internal(z80.pc++) << 8; z80.pc &= 0xffff; tstates += (3);; (z80.l)=readbyte_internal(ldtemp++); ldtemp &= 0xffff; tstates += (3);; (z80.h)=readbyte_internal(ldtemp); break;};
      break;
    case 0x2b: /* DEC HL */
      tstates += 2;
      var wordtemp = ((z80.l | (z80.h << 8)) - 1) & 0xffff;
      z80.h = wordtemp >> 8;
      z80.l = wordtemp & 0xff;
      break;
    case 0x2c: /* INC L */
      { (z80.l) = ((z80.l) + 1) & 0xff; z80.f = ( z80.f & 0x01 ) | ( (z80.l)==0x80 ? 0x04 : 0 ) | ( (z80.l)&0x0f ? 0 : 0x10 ) | sz53_table[(z80.l)];};
      break;
    case 0x2d: /* DEC L */
      { z80.f = ( z80.f & 0x01 ) | ( (z80.l)&0x0f ? 0 : 0x10 ) | 0x02; (z80.l) = ((z80.l) - 1) & 0xff; z80.f |= ( (z80.l)==0x7f ? 0x04 : 0 ) | sz53_table[z80.l];};
      break;
    case 0x2e: /* LD L,nn */
      tstates += (3);;
      z80.l=readbyte_internal(z80.pc++); z80.pc &= 0xffff;
      break;
    case 0x2f: /* CPL */
      z80.a ^= 0xff;
      z80.f = ( z80.f & ( 0x01 | 0x04 | 0x40 | 0x80 ) ) |
 ( z80.a & ( 0x08 | 0x20 ) ) | ( 0x02 | 0x10 );
      break;
    case 0x30: /* JR NC,offset */
      tstates += (3);;
      if( ! ( z80.f & 0x01 ) ) { { tstates += (1);; tstates += (1);; tstates += (1);; tstates += (1);; tstates += (1);; z80.pc += sign_extend(readbyte_internal( z80.pc )); z80.pc &= 0xffff; }; }
      z80.pc++; z80.pc &= 0xffff;
      break;
    case 0x31: /* LD SP,nnnn */
      tstates += (3);;
      var splow = readbyte_internal(z80.pc++);
      z80.pc &= 0xffff;
      tstates += (3);;
      var sphigh=readbyte_internal(z80.pc++);
      z80.sp = splow | (sphigh << 8);
      z80.pc &= 0xffff;
      break;
    case 0x32: /* LD (nnnn),A */
      tstates += (3);;
      {
 var wordtemp = readbyte_internal( z80.pc++ );
 z80.pc &= 0xffff;
 tstates += (3);;
 wordtemp|=readbyte_internal(z80.pc++) << 8;
 z80.pc &= 0xffff;
 tstates += (3);;
 writebyte_internal(wordtemp,z80.a);
      }
      break;
    case 0x33: /* INC SP */
      tstates += 2;
      z80.sp = (z80.sp + 1) & 0xffff;
      break;
    case 0x34: /* INC (HL) */
      tstates += (4);;
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 { (bytetemp) = ((bytetemp) + 1) & 0xff; z80.f = ( z80.f & 0x01 ) | ( (bytetemp)==0x80 ? 0x04 : 0 ) | ( (bytetemp)&0x0f ? 0 : 0x10 ) | sz53_table[(bytetemp)];};
 tstates += (3);;
 writebyte_internal((z80.l | (z80.h << 8)),bytetemp);
      }
      break;
    case 0x35: /* DEC (HL) */
      tstates += (4);;
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 { z80.f = ( z80.f & 0x01 ) | ( (bytetemp)&0x0f ? 0 : 0x10 ) | 0x02; (bytetemp) = ((bytetemp) - 1) & 0xff; z80.f |= ( (bytetemp)==0x7f ? 0x04 : 0 ) | sz53_table[bytetemp];};
 tstates += (3);;
 writebyte_internal((z80.l | (z80.h << 8)),bytetemp);
      }
      break;
    case 0x36: /* LD (HL),nn */
      tstates += (3);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)),readbyte_internal(z80.pc++));
      z80.pc &= 0xffff;
      break;
    case 0x37: /* SCF */
      z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) |
        ( z80.a & ( 0x08 | 0x20 ) ) |
        0x01;
      break;
    case 0x38: /* JR C,offset */
      tstates += (3);;
      if( z80.f & 0x01 ) { { tstates += (1);; tstates += (1);; tstates += (1);; tstates += (1);; tstates += (1);; z80.pc += sign_extend(readbyte_internal( z80.pc )); z80.pc &= 0xffff; }; }
      z80.pc++; z80.pc &= 0xffff;
      break;
    case 0x39: /* ADD HL,SP */
      { var add16temp = ((z80.l | (z80.h << 8))) + (z80.sp); var lookup = ( ( ((z80.l | (z80.h << 8))) & 0x0800 ) >> 11 ) | ( ( (z80.sp) & 0x0800 ) >> 10 ) | ( ( add16temp & 0x0800 ) >> 9 ); tstates += 7; (z80.h) = (add16temp >> 8) & 0xff; (z80.l) = add16temp & 0xff; z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) | ( add16temp & 0x10000 ? 0x01 : 0 )| ( ( add16temp >> 8 ) & ( 0x08 | 0x20 ) ) | halfcarry_add_table[lookup];};
      break;
    case 0x3a: /* LD A,(nnnn) */
      {
 var wordtemp;
 tstates += (3);;
 wordtemp = readbyte_internal(z80.pc++);
 z80.pc &= 0xffff;
 tstates += (3);;
 wordtemp|= ( readbyte_internal(z80.pc++) << 8 );
 z80.pc &= 0xffff;
 tstates += (3);;
 z80.a=readbyte_internal(wordtemp);
      }
      break;
    case 0x3b: /* DEC SP */
      tstates += 2;
      z80.sp = (z80.sp - 1) & 0xffff;
      break;
    case 0x3c: /* INC A */
      { (z80.a) = ((z80.a) + 1) & 0xff; z80.f = ( z80.f & 0x01 ) | ( (z80.a)==0x80 ? 0x04 : 0 ) | ( (z80.a)&0x0f ? 0 : 0x10 ) | sz53_table[(z80.a)];};
      break;
    case 0x3d: /* DEC A */
      { z80.f = ( z80.f & 0x01 ) | ( (z80.a)&0x0f ? 0 : 0x10 ) | 0x02; (z80.a) = ((z80.a) - 1) & 0xff; z80.f |= ( (z80.a)==0x7f ? 0x04 : 0 ) | sz53_table[z80.a];};
      break;
    case 0x3e: /* LD A,nn */
      tstates += (3);;
      z80.a=readbyte_internal(z80.pc++); z80.pc &= 0xffff;
      break;
    case 0x3f: /* CCF */
      z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) |
 ( ( z80.f & 0x01 ) ? 0x10 : 0x01 ) | ( z80.a & ( 0x08 | 0x20 ) );
      break;
    case 0x40: /* LD B,B */
      break;
    case 0x41: /* LD B,C */
      z80.b=z80.c;
      break;
    case 0x42: /* LD B,D */
      z80.b=z80.d;
      break;
    case 0x43: /* LD B,E */
      z80.b=z80.e;
      break;
    case 0x44: /* LD B,H */
      z80.b=z80.h;
      break;
    case 0x45: /* LD B,L */
      z80.b=z80.l;
      break;
    case 0x46: /* LD B,(HL) */
      tstates += (3);;
      z80.b=readbyte_internal((z80.l | (z80.h << 8)));
      break;
    case 0x47: /* LD B,A */
      z80.b=z80.a;
      break;
    case 0x48: /* LD C,B */
      z80.c=z80.b;
      break;
    case 0x49: /* LD C,C */
      break;
    case 0x4a: /* LD C,D */
      z80.c=z80.d;
      break;
    case 0x4b: /* LD C,E */
      z80.c=z80.e;
      break;
    case 0x4c: /* LD C,H */
      z80.c=z80.h;
      break;
    case 0x4d: /* LD C,L */
      z80.c=z80.l;
      break;
    case 0x4e: /* LD C,(HL) */
      tstates += (3);;
      z80.c=readbyte_internal((z80.l | (z80.h << 8)));
      break;
    case 0x4f: /* LD C,A */
      z80.c=z80.a;
      break;
    case 0x50: /* LD D,B */
      z80.d=z80.b;
      break;
    case 0x51: /* LD D,C */
      z80.d=z80.c;
      break;
    case 0x52: /* LD D,D */
      break;
    case 0x53: /* LD D,E */
      z80.d=z80.e;
      break;
    case 0x54: /* LD D,H */
      z80.d=z80.h;
      break;
    case 0x55: /* LD D,L */
      z80.d=z80.l;
      break;
    case 0x56: /* LD D,(HL) */
      tstates += (3);;
      z80.d=readbyte_internal((z80.l | (z80.h << 8)));
      break;
    case 0x57: /* LD D,A */
      z80.d=z80.a;
      break;
    case 0x58: /* LD E,B */
      z80.e=z80.b;
      break;
    case 0x59: /* LD E,C */
      z80.e=z80.c;
      break;
    case 0x5a: /* LD E,D */
      z80.e=z80.d;
      break;
    case 0x5b: /* LD E,E */
      break;
    case 0x5c: /* LD E,H */
      z80.e=z80.h;
      break;
    case 0x5d: /* LD E,L */
      z80.e=z80.l;
      break;
    case 0x5e: /* LD E,(HL) */
      tstates += (3);;
      z80.e=readbyte_internal((z80.l | (z80.h << 8)));
      break;
    case 0x5f: /* LD E,A */
      z80.e=z80.a;
      break;
    case 0x60: /* LD H,B */
      z80.h=z80.b;
      break;
    case 0x61: /* LD H,C */
      z80.h=z80.c;
      break;
    case 0x62: /* LD H,D */
      z80.h=z80.d;
      break;
    case 0x63: /* LD H,E */
      z80.h=z80.e;
      break;
    case 0x64: /* LD H,H */
      break;
    case 0x65: /* LD H,L */
      z80.h=z80.l;
      break;
    case 0x66: /* LD H,(HL) */
      tstates += (3);;
      z80.h=readbyte_internal((z80.l | (z80.h << 8)));
      break;
    case 0x67: /* LD H,A */
      z80.h=z80.a;
      break;
    case 0x68: /* LD L,B */
      z80.l=z80.b;
      break;
    case 0x69: /* LD L,C */
      z80.l=z80.c;
      break;
    case 0x6a: /* LD L,D */
      z80.l=z80.d;
      break;
    case 0x6b: /* LD L,E */
      z80.l=z80.e;
      break;
    case 0x6c: /* LD L,H */
      z80.l=z80.h;
      break;
    case 0x6d: /* LD L,L */
      break;
    case 0x6e: /* LD L,(HL) */
      tstates += (3);;
      z80.l=readbyte_internal((z80.l | (z80.h << 8)));
      break;
    case 0x6f: /* LD L,A */
      z80.l=z80.a;
      break;
    case 0x70: /* LD (HL),B */
      tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)),z80.b);
      break;
    case 0x71: /* LD (HL),C */
      tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)),z80.c);
      break;
    case 0x72: /* LD (HL),D */
      tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)),z80.d);
      break;
    case 0x73: /* LD (HL),E */
      tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)),z80.e);
      break;
    case 0x74: /* LD (HL),H */
      tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)),z80.h);
      break;
    case 0x75: /* LD (HL),L */
      tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)),z80.l);
      break;
    case 0x76: /* HALT */
      z80.halted=1;
      z80.pc--;z80.pc &= 0xffff;
      break;
    case 0x77: /* LD (HL),A */
      tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)),z80.a);
      break;
    case 0x78: /* LD A,B */
      z80.a=z80.b;
      break;
    case 0x79: /* LD A,C */
      z80.a=z80.c;
      break;
    case 0x7a: /* LD A,D */
      z80.a=z80.d;
      break;
    case 0x7b: /* LD A,E */
      z80.a=z80.e;
      break;
    case 0x7c: /* LD A,H */
      z80.a=z80.h;
      break;
    case 0x7d: /* LD A,L */
      z80.a=z80.l;
      break;
    case 0x7e: /* LD A,(HL) */
      tstates += (3);;
      z80.a=readbyte_internal((z80.l | (z80.h << 8)));
      break;
    case 0x7f: /* LD A,A */
      break;
    case 0x80: /* ADD A,B */
      { var addtemp = z80.a + (z80.b); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.b) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x81: /* ADD A,C */
      { var addtemp = z80.a + (z80.c); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.c) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x82: /* ADD A,D */
      { var addtemp = z80.a + (z80.d); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.d) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x83: /* ADD A,E */
      { var addtemp = z80.a + (z80.e); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.e) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x84: /* ADD A,H */
      { var addtemp = z80.a + (z80.h); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.h) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x85: /* ADD A,L */
      { var addtemp = z80.a + (z80.l); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.l) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x86: /* ADD A,(HL) */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 { var addtemp = z80.a + (bytetemp); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0x87: /* ADD A,A */
      { var addtemp = z80.a + (z80.a); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.a) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x88: /* ADC A,B */
      { var adctemp = z80.a + (z80.b) + ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.b) & 0x88 ) >> 2 ) | ( ( adctemp & 0x88 ) >> 1 ); z80.a=adctemp & 0xff; z80.f = ( adctemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x89: /* ADC A,C */
      { var adctemp = z80.a + (z80.c) + ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.c) & 0x88 ) >> 2 ) | ( ( adctemp & 0x88 ) >> 1 ); z80.a=adctemp & 0xff; z80.f = ( adctemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x8a: /* ADC A,D */
      { var adctemp = z80.a + (z80.d) + ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.d) & 0x88 ) >> 2 ) | ( ( adctemp & 0x88 ) >> 1 ); z80.a=adctemp & 0xff; z80.f = ( adctemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x8b: /* ADC A,E */
      { var adctemp = z80.a + (z80.e) + ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.e) & 0x88 ) >> 2 ) | ( ( adctemp & 0x88 ) >> 1 ); z80.a=adctemp & 0xff; z80.f = ( adctemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x8c: /* ADC A,H */
      { var adctemp = z80.a + (z80.h) + ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.h) & 0x88 ) >> 2 ) | ( ( adctemp & 0x88 ) >> 1 ); z80.a=adctemp & 0xff; z80.f = ( adctemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x8d: /* ADC A,L */
      { var adctemp = z80.a + (z80.l) + ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.l) & 0x88 ) >> 2 ) | ( ( adctemp & 0x88 ) >> 1 ); z80.a=adctemp & 0xff; z80.f = ( adctemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x8e: /* ADC A,(HL) */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 { var adctemp = z80.a + (bytetemp) + ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( adctemp & 0x88 ) >> 1 ); z80.a=adctemp & 0xff; z80.f = ( adctemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0x8f: /* ADC A,A */
      { var adctemp = z80.a + (z80.a) + ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.a) & 0x88 ) >> 2 ) | ( ( adctemp & 0x88 ) >> 1 ); z80.a=adctemp & 0xff; z80.f = ( adctemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x90: /* SUB A,B */
      { var subtemp = z80.a - (z80.b); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.b) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x91: /* SUB A,C */
      { var subtemp = z80.a - (z80.c); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.c) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x92: /* SUB A,D */
      { var subtemp = z80.a - (z80.d); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.d) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x93: /* SUB A,E */
      { var subtemp = z80.a - (z80.e); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.e) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x94: /* SUB A,H */
      { var subtemp = z80.a - (z80.h); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.h) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x95: /* SUB A,L */
      { var subtemp = z80.a - (z80.l); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.l) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x96: /* SUB A,(HL) */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 { var subtemp = z80.a - (bytetemp); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0x97: /* SUB A,A */
      { var subtemp = z80.a - (z80.a); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.a) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x98: /* SBC A,B */
      { var sbctemp = z80.a - (z80.b) - ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.b) & 0x88 ) >> 2 ) | ( ( sbctemp & 0x88 ) >> 1 ); z80.a=sbctemp & 0xff; z80.f = ( sbctemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x99: /* SBC A,C */
      { var sbctemp = z80.a - (z80.c) - ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.c) & 0x88 ) >> 2 ) | ( ( sbctemp & 0x88 ) >> 1 ); z80.a=sbctemp & 0xff; z80.f = ( sbctemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x9a: /* SBC A,D */
      { var sbctemp = z80.a - (z80.d) - ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.d) & 0x88 ) >> 2 ) | ( ( sbctemp & 0x88 ) >> 1 ); z80.a=sbctemp & 0xff; z80.f = ( sbctemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x9b: /* SBC A,E */
      { var sbctemp = z80.a - (z80.e) - ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.e) & 0x88 ) >> 2 ) | ( ( sbctemp & 0x88 ) >> 1 ); z80.a=sbctemp & 0xff; z80.f = ( sbctemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x9c: /* SBC A,H */
      { var sbctemp = z80.a - (z80.h) - ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.h) & 0x88 ) >> 2 ) | ( ( sbctemp & 0x88 ) >> 1 ); z80.a=sbctemp & 0xff; z80.f = ( sbctemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x9d: /* SBC A,L */
      { var sbctemp = z80.a - (z80.l) - ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.l) & 0x88 ) >> 2 ) | ( ( sbctemp & 0x88 ) >> 1 ); z80.a=sbctemp & 0xff; z80.f = ( sbctemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x9e: /* SBC A,(HL) */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 { var sbctemp = z80.a - (bytetemp) - ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( sbctemp & 0x88 ) >> 1 ); z80.a=sbctemp & 0xff; z80.f = ( sbctemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0x9f: /* SBC A,A */
      { var sbctemp = z80.a - (z80.a) - ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.a) & 0x88 ) >> 2 ) | ( ( sbctemp & 0x88 ) >> 1 ); z80.a=sbctemp & 0xff; z80.f = ( sbctemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0xa0: /* AND A,B */
      { z80.a &= (z80.b); z80.f = 0x10 | sz53p_table[z80.a];};
      break;
    case 0xa1: /* AND A,C */
      { z80.a &= (z80.c); z80.f = 0x10 | sz53p_table[z80.a];};
      break;
    case 0xa2: /* AND A,D */
      { z80.a &= (z80.d); z80.f = 0x10 | sz53p_table[z80.a];};
      break;
    case 0xa3: /* AND A,E */
      { z80.a &= (z80.e); z80.f = 0x10 | sz53p_table[z80.a];};
      break;
    case 0xa4: /* AND A,H */
      { z80.a &= (z80.h); z80.f = 0x10 | sz53p_table[z80.a];};
      break;
    case 0xa5: /* AND A,L */
      { z80.a &= (z80.l); z80.f = 0x10 | sz53p_table[z80.a];};
      break;
    case 0xa6: /* AND A,(HL) */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 { z80.a &= (bytetemp); z80.f = 0x10 | sz53p_table[z80.a];};
      }
      break;
    case 0xa7: /* AND A,A */
      { z80.a &= (z80.a); z80.f = 0x10 | sz53p_table[z80.a];};
      break;
    case 0xa8: /* XOR A,B */
      { z80.a ^= (z80.b); z80.f = sz53p_table[z80.a];};
      break;
    case 0xa9: /* XOR A,C */
      { z80.a ^= (z80.c); z80.f = sz53p_table[z80.a];};
      break;
    case 0xaa: /* XOR A,D */
      { z80.a ^= (z80.d); z80.f = sz53p_table[z80.a];};
      break;
    case 0xab: /* XOR A,E */
      { z80.a ^= (z80.e); z80.f = sz53p_table[z80.a];};
      break;
    case 0xac: /* XOR A,H */
      { z80.a ^= (z80.h); z80.f = sz53p_table[z80.a];};
      break;
    case 0xad: /* XOR A,L */
      { z80.a ^= (z80.l); z80.f = sz53p_table[z80.a];};
      break;
    case 0xae: /* XOR A,(HL) */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 { z80.a ^= (bytetemp); z80.f = sz53p_table[z80.a];};
      }
      break;
    case 0xaf: /* XOR A,A */
      { z80.a ^= (z80.a); z80.f = sz53p_table[z80.a];};
      break;
    case 0xb0: /* OR A,B */
      { z80.a |= (z80.b); z80.f = sz53p_table[z80.a];};
      break;
    case 0xb1: /* OR A,C */
      { z80.a |= (z80.c); z80.f = sz53p_table[z80.a];};
      break;
    case 0xb2: /* OR A,D */
      { z80.a |= (z80.d); z80.f = sz53p_table[z80.a];};
      break;
    case 0xb3: /* OR A,E */
      { z80.a |= (z80.e); z80.f = sz53p_table[z80.a];};
      break;
    case 0xb4: /* OR A,H */
      { z80.a |= (z80.h); z80.f = sz53p_table[z80.a];};
      break;
    case 0xb5: /* OR A,L */
      { z80.a |= (z80.l); z80.f = sz53p_table[z80.a];};
      break;
    case 0xb6: /* OR A,(HL) */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 { z80.a |= (bytetemp); z80.f = sz53p_table[z80.a];};
      }
      break;
    case 0xb7: /* OR A,A */
      { z80.a |= (z80.a); z80.f = sz53p_table[z80.a];};
      break;
    case 0xb8: /* CP B */
      { var cptemp = z80.a - z80.b; var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.b) & 0x88 ) >> 2 ) | ( ( cptemp & 0x88 ) >> 1 ); z80.f = ( cptemp & 0x100 ? 0x01 : ( cptemp ? 0 : 0x40 ) ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | ( z80.b & ( 0x08 | 0x20 ) ) | ( cptemp & 0x80 );};
      break;
    case 0xb9: /* CP C */
      { var cptemp = z80.a - z80.c; var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.c) & 0x88 ) >> 2 ) | ( ( cptemp & 0x88 ) >> 1 ); z80.f = ( cptemp & 0x100 ? 0x01 : ( cptemp ? 0 : 0x40 ) ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | ( z80.c & ( 0x08 | 0x20 ) ) | ( cptemp & 0x80 );};
      break;
    case 0xba: /* CP D */
      { var cptemp = z80.a - z80.d; var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.d) & 0x88 ) >> 2 ) | ( ( cptemp & 0x88 ) >> 1 ); z80.f = ( cptemp & 0x100 ? 0x01 : ( cptemp ? 0 : 0x40 ) ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | ( z80.d & ( 0x08 | 0x20 ) ) | ( cptemp & 0x80 );};
      break;
    case 0xbb: /* CP E */
      { var cptemp = z80.a - z80.e; var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.e) & 0x88 ) >> 2 ) | ( ( cptemp & 0x88 ) >> 1 ); z80.f = ( cptemp & 0x100 ? 0x01 : ( cptemp ? 0 : 0x40 ) ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | ( z80.e & ( 0x08 | 0x20 ) ) | ( cptemp & 0x80 );};
      break;
    case 0xbc: /* CP H */
      { var cptemp = z80.a - z80.h; var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.h) & 0x88 ) >> 2 ) | ( ( cptemp & 0x88 ) >> 1 ); z80.f = ( cptemp & 0x100 ? 0x01 : ( cptemp ? 0 : 0x40 ) ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | ( z80.h & ( 0x08 | 0x20 ) ) | ( cptemp & 0x80 );};
      break;
    case 0xbd: /* CP L */
      { var cptemp = z80.a - z80.l; var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.l) & 0x88 ) >> 2 ) | ( ( cptemp & 0x88 ) >> 1 ); z80.f = ( cptemp & 0x100 ? 0x01 : ( cptemp ? 0 : 0x40 ) ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | ( z80.l & ( 0x08 | 0x20 ) ) | ( cptemp & 0x80 );};
      break;
    case 0xbe: /* CP (HL) */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 { var cptemp = z80.a - bytetemp; var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( cptemp & 0x88 ) >> 1 ); z80.f = ( cptemp & 0x100 ? 0x01 : ( cptemp ? 0 : 0x40 ) ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | ( bytetemp & ( 0x08 | 0x20 ) ) | ( cptemp & 0x80 );};
      }
      break;
    case 0xbf: /* CP A */
      { var cptemp = z80.a - z80.a; var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.a) & 0x88 ) >> 2 ) | ( ( cptemp & 0x88 ) >> 1 ); z80.f = ( cptemp & 0x100 ? 0x01 : ( cptemp ? 0 : 0x40 ) ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | ( z80.a & ( 0x08 | 0x20 ) ) | ( cptemp & 0x80 );};
      break;
    case 0xc0: /* RET NZ */
      tstates++;
      if( z80.pc==0x056c || z80.pc == 0x0112 ) {
        /* if( tape_load_trap() == 0 ) break; */
        loadTapeBlock();
        break;
      }
      if( ! ( z80.f & 0x40 ) ) { { { tstates += (3);; var lowbyte =readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; var highbyte=readbyte_internal(z80.sp++); z80.sp &= 0xffff; (z80.pc) = lowbyte | (highbyte << 8);};}; }
      break;
    case 0xc1: /* POP BC */
      { tstates += (3);; (z80.c)=readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; (z80.b)=readbyte_internal(z80.sp++); z80.sp &= 0xffff;};
      break;
    case 0xc2: /* JP NZ,nnnn */
      tstates += (3);; tstates += (3);;
      if( ! ( z80.f & 0x40 ) ) { { var jptemp=z80.pc; var pcl =readbyte_internal(jptemp++); jptemp &= 0xffff; var pch =readbyte_internal(jptemp); z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xc3: /* JP nnnn */
      tstates += (3);; tstates += (3);;
      { var jptemp=z80.pc; var pcl =readbyte_internal(jptemp++); jptemp &= 0xffff; var pch =readbyte_internal(jptemp); z80.pc = pcl | (pch << 8);};
      break;
    case 0xc4: /* CALL NZ,nnnn */
      tstates += (3);; tstates += (3);;
      if( ! ( z80.f & 0x40 ) ) { { var calltempl, calltemph; calltempl=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (1);; calltemph=readbyte_internal(z80.pc++); z80.pc &= 0xffff; { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; var pcl=calltempl; var pch=calltemph; z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xc5: /* PUSH BC */
      tstates++;
      { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.b)); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.c));};
      break;
    case 0xc6: /* ADD A,nn */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( z80.pc++ );
 { var addtemp = z80.a + (bytetemp); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0xc7: /* RST 00 */
      tstates++;
      { { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; z80.pc=(0x00);};
      break;
    case 0xc8: /* RET Z */
      tstates++;
      if( z80.f & 0x40 ) { { { tstates += (3);; var lowbyte =readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; var highbyte=readbyte_internal(z80.sp++); z80.sp &= 0xffff; (z80.pc) = lowbyte | (highbyte << 8);};}; }
      break;
    case 0xc9: /* RET */
      { { tstates += (3);; var lowbyte =readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; var highbyte=readbyte_internal(z80.sp++); z80.sp &= 0xffff; (z80.pc) = lowbyte | (highbyte << 8);};};
      break;
    case 0xca: /* JP Z,nnnn */
      tstates += (3);; tstates += (3);;
      if( z80.f & 0x40 ) { { var jptemp=z80.pc; var pcl =readbyte_internal(jptemp++); jptemp &= 0xffff; var pch =readbyte_internal(jptemp); z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xcb: /* shift CB */
      {
 var opcode2;
 tstates += (4);;
 opcode2 = readbyte_internal( z80.pc++ );
 z80.pc &= 0xffff;
 z80.r = (z80.r+1) & 0x7f;
 switch(opcode2) {
/* opcodes_cb.c: Z80 CBxx opcodes
   Copyright (c) 1999-2008 Philip Kendall, Matthew Westcott

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Contact details: <matthew@west.co.tt>
    Matthew Westcott, 14 Daisy Hill Drive, Adlington, Chorley, Lancs PR6 9NE UNITED KINGDOM

*/
/* NB: this file is autogenerated by 'z80.pl' from 'opcodes_cb.dat',
   and included in 'z80_ops.jscpp' */
    case 0x00: /* RLC B */
      { (z80.b) = ( ((z80.b) & 0x7f)<<1 ) | ( (z80.b)>>7 ); z80.f = ( (z80.b) & 0x01 ) | sz53p_table[(z80.b)];};
      break;
    case 0x01: /* RLC C */
      { (z80.c) = ( ((z80.c) & 0x7f)<<1 ) | ( (z80.c)>>7 ); z80.f = ( (z80.c) & 0x01 ) | sz53p_table[(z80.c)];};
      break;
    case 0x02: /* RLC D */
      { (z80.d) = ( ((z80.d) & 0x7f)<<1 ) | ( (z80.d)>>7 ); z80.f = ( (z80.d) & 0x01 ) | sz53p_table[(z80.d)];};
      break;
    case 0x03: /* RLC E */
      { (z80.e) = ( ((z80.e) & 0x7f)<<1 ) | ( (z80.e)>>7 ); z80.f = ( (z80.e) & 0x01 ) | sz53p_table[(z80.e)];};
      break;
    case 0x04: /* RLC H */
      { (z80.h) = ( ((z80.h) & 0x7f)<<1 ) | ( (z80.h)>>7 ); z80.f = ( (z80.h) & 0x01 ) | sz53p_table[(z80.h)];};
      break;
    case 0x05: /* RLC L */
      { (z80.l) = ( ((z80.l) & 0x7f)<<1 ) | ( (z80.l)>>7 ); z80.f = ( (z80.l) & 0x01 ) | sz53p_table[(z80.l)];};
      break;
    case 0x06: /* RLC (HL) */
      {
 var bytetemp = readbyte_internal((z80.l | (z80.h << 8)));
 tstates += (4);; tstates += (3);;
 { (bytetemp) = ( ((bytetemp) & 0x7f)<<1 ) | ( (bytetemp)>>7 ); z80.f = ( (bytetemp) & 0x01 ) | sz53p_table[(bytetemp)];};
 writebyte_internal((z80.l | (z80.h << 8)),bytetemp);
      }
      break;
    case 0x07: /* RLC A */
      { (z80.a) = ( ((z80.a) & 0x7f)<<1 ) | ( (z80.a)>>7 ); z80.f = ( (z80.a) & 0x01 ) | sz53p_table[(z80.a)];};
      break;
    case 0x08: /* RRC B */
      { z80.f = (z80.b) & 0x01; (z80.b) = ( (z80.b)>>1 ) | ( ((z80.b) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.b)];};
      break;
    case 0x09: /* RRC C */
      { z80.f = (z80.c) & 0x01; (z80.c) = ( (z80.c)>>1 ) | ( ((z80.c) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.c)];};
      break;
    case 0x0a: /* RRC D */
      { z80.f = (z80.d) & 0x01; (z80.d) = ( (z80.d)>>1 ) | ( ((z80.d) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.d)];};
      break;
    case 0x0b: /* RRC E */
      { z80.f = (z80.e) & 0x01; (z80.e) = ( (z80.e)>>1 ) | ( ((z80.e) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.e)];};
      break;
    case 0x0c: /* RRC H */
      { z80.f = (z80.h) & 0x01; (z80.h) = ( (z80.h)>>1 ) | ( ((z80.h) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.h)];};
      break;
    case 0x0d: /* RRC L */
      { z80.f = (z80.l) & 0x01; (z80.l) = ( (z80.l)>>1 ) | ( ((z80.l) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.l)];};
      break;
    case 0x0e: /* RRC (HL) */
      {
 var bytetemp = readbyte_internal((z80.l | (z80.h << 8)));
 tstates += (4);; tstates += (3);;
 { z80.f = (bytetemp) & 0x01; (bytetemp) = ( (bytetemp)>>1 ) | ( ((bytetemp) & 0x01)<<7 ); z80.f |= sz53p_table[(bytetemp)];};
 writebyte_internal((z80.l | (z80.h << 8)),bytetemp);
      }
      break;
    case 0x0f: /* RRC A */
      { z80.f = (z80.a) & 0x01; (z80.a) = ( (z80.a)>>1 ) | ( ((z80.a) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.a)];};
      break;
    case 0x10: /* RL B */
      { var rltemp = (z80.b); (z80.b) = ( ((z80.b) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.b)];};
      break;
    case 0x11: /* RL C */
      { var rltemp = (z80.c); (z80.c) = ( ((z80.c) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.c)];};
      break;
    case 0x12: /* RL D */
      { var rltemp = (z80.d); (z80.d) = ( ((z80.d) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.d)];};
      break;
    case 0x13: /* RL E */
      { var rltemp = (z80.e); (z80.e) = ( ((z80.e) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.e)];};
      break;
    case 0x14: /* RL H */
      { var rltemp = (z80.h); (z80.h) = ( ((z80.h) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.h)];};
      break;
    case 0x15: /* RL L */
      { var rltemp = (z80.l); (z80.l) = ( ((z80.l) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.l)];};
      break;
    case 0x16: /* RL (HL) */
      {
 var bytetemp = readbyte_internal((z80.l | (z80.h << 8)));
 tstates += (4);; tstates += (3);;
 { var rltemp = (bytetemp); (bytetemp) = ( ((bytetemp) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(bytetemp)];};
 writebyte_internal((z80.l | (z80.h << 8)),bytetemp);
      }
      break;
    case 0x17: /* RL A */
      { var rltemp = (z80.a); (z80.a) = ( ((z80.a) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.a)];};
      break;
    case 0x18: /* RR B */
      { var rrtemp = (z80.b); (z80.b) = ( (z80.b)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.b)];};
      break;
    case 0x19: /* RR C */
      { var rrtemp = (z80.c); (z80.c) = ( (z80.c)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.c)];};
      break;
    case 0x1a: /* RR D */
      { var rrtemp = (z80.d); (z80.d) = ( (z80.d)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.d)];};
      break;
    case 0x1b: /* RR E */
      { var rrtemp = (z80.e); (z80.e) = ( (z80.e)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.e)];};
      break;
    case 0x1c: /* RR H */
      { var rrtemp = (z80.h); (z80.h) = ( (z80.h)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.h)];};
      break;
    case 0x1d: /* RR L */
      { var rrtemp = (z80.l); (z80.l) = ( (z80.l)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.l)];};
      break;
    case 0x1e: /* RR (HL) */
      {
 var bytetemp = readbyte_internal((z80.l | (z80.h << 8)));
 tstates += (4);; tstates += (3);;
 { var rrtemp = (bytetemp); (bytetemp) = ( (bytetemp)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(bytetemp)];};
 writebyte_internal((z80.l | (z80.h << 8)),bytetemp);
      }
      break;
    case 0x1f: /* RR A */
      { var rrtemp = (z80.a); (z80.a) = ( (z80.a)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.a)];};
      break;
    case 0x20: /* SLA B */
      { z80.f = (z80.b) >> 7; (z80.b) <<= 1; (z80.b) &= 0xff; z80.f |= sz53p_table[(z80.b)];};
      break;
    case 0x21: /* SLA C */
      { z80.f = (z80.c) >> 7; (z80.c) <<= 1; (z80.c) &= 0xff; z80.f |= sz53p_table[(z80.c)];};
      break;
    case 0x22: /* SLA D */
      { z80.f = (z80.d) >> 7; (z80.d) <<= 1; (z80.d) &= 0xff; z80.f |= sz53p_table[(z80.d)];};
      break;
    case 0x23: /* SLA E */
      { z80.f = (z80.e) >> 7; (z80.e) <<= 1; (z80.e) &= 0xff; z80.f |= sz53p_table[(z80.e)];};
      break;
    case 0x24: /* SLA H */
      { z80.f = (z80.h) >> 7; (z80.h) <<= 1; (z80.h) &= 0xff; z80.f |= sz53p_table[(z80.h)];};
      break;
    case 0x25: /* SLA L */
      { z80.f = (z80.l) >> 7; (z80.l) <<= 1; (z80.l) &= 0xff; z80.f |= sz53p_table[(z80.l)];};
      break;
    case 0x26: /* SLA (HL) */
      {
 var bytetemp = readbyte_internal((z80.l | (z80.h << 8)));
 tstates += (4);; tstates += (3);;
 { z80.f = (bytetemp) >> 7; (bytetemp) <<= 1; (bytetemp) &= 0xff; z80.f |= sz53p_table[(bytetemp)];};
 writebyte_internal((z80.l | (z80.h << 8)),bytetemp);
      }
      break;
    case 0x27: /* SLA A */
      { z80.f = (z80.a) >> 7; (z80.a) <<= 1; (z80.a) &= 0xff; z80.f |= sz53p_table[(z80.a)];};
      break;
    case 0x28: /* SRA B */
      { z80.f = (z80.b) & 0x01; (z80.b) = ( (z80.b) & 0x80 ) | ( (z80.b) >> 1 ); z80.f |= sz53p_table[(z80.b)];};
      break;
    case 0x29: /* SRA C */
      { z80.f = (z80.c) & 0x01; (z80.c) = ( (z80.c) & 0x80 ) | ( (z80.c) >> 1 ); z80.f |= sz53p_table[(z80.c)];};
      break;
    case 0x2a: /* SRA D */
      { z80.f = (z80.d) & 0x01; (z80.d) = ( (z80.d) & 0x80 ) | ( (z80.d) >> 1 ); z80.f |= sz53p_table[(z80.d)];};
      break;
    case 0x2b: /* SRA E */
      { z80.f = (z80.e) & 0x01; (z80.e) = ( (z80.e) & 0x80 ) | ( (z80.e) >> 1 ); z80.f |= sz53p_table[(z80.e)];};
      break;
    case 0x2c: /* SRA H */
      { z80.f = (z80.h) & 0x01; (z80.h) = ( (z80.h) & 0x80 ) | ( (z80.h) >> 1 ); z80.f |= sz53p_table[(z80.h)];};
      break;
    case 0x2d: /* SRA L */
      { z80.f = (z80.l) & 0x01; (z80.l) = ( (z80.l) & 0x80 ) | ( (z80.l) >> 1 ); z80.f |= sz53p_table[(z80.l)];};
      break;
    case 0x2e: /* SRA (HL) */
      {
 var bytetemp = readbyte_internal((z80.l | (z80.h << 8)));
 tstates += (4);; tstates += (3);;
 { z80.f = (bytetemp) & 0x01; (bytetemp) = ( (bytetemp) & 0x80 ) | ( (bytetemp) >> 1 ); z80.f |= sz53p_table[(bytetemp)];};
 writebyte_internal((z80.l | (z80.h << 8)),bytetemp);
      }
      break;
    case 0x2f: /* SRA A */
      { z80.f = (z80.a) & 0x01; (z80.a) = ( (z80.a) & 0x80 ) | ( (z80.a) >> 1 ); z80.f |= sz53p_table[(z80.a)];};
      break;
    case 0x30: /* SLL B */
      { z80.f = (z80.b) >> 7; (z80.b) = ( (z80.b) << 1 ) | 0x01; (z80.b) &= 0xff; z80.f |= sz53p_table[(z80.b)];};
      break;
    case 0x31: /* SLL C */
      { z80.f = (z80.c) >> 7; (z80.c) = ( (z80.c) << 1 ) | 0x01; (z80.c) &= 0xff; z80.f |= sz53p_table[(z80.c)];};
      break;
    case 0x32: /* SLL D */
      { z80.f = (z80.d) >> 7; (z80.d) = ( (z80.d) << 1 ) | 0x01; (z80.d) &= 0xff; z80.f |= sz53p_table[(z80.d)];};
      break;
    case 0x33: /* SLL E */
      { z80.f = (z80.e) >> 7; (z80.e) = ( (z80.e) << 1 ) | 0x01; (z80.e) &= 0xff; z80.f |= sz53p_table[(z80.e)];};
      break;
    case 0x34: /* SLL H */
      { z80.f = (z80.h) >> 7; (z80.h) = ( (z80.h) << 1 ) | 0x01; (z80.h) &= 0xff; z80.f |= sz53p_table[(z80.h)];};
      break;
    case 0x35: /* SLL L */
      { z80.f = (z80.l) >> 7; (z80.l) = ( (z80.l) << 1 ) | 0x01; (z80.l) &= 0xff; z80.f |= sz53p_table[(z80.l)];};
      break;
    case 0x36: /* SLL (HL) */
      {
 var bytetemp = readbyte_internal((z80.l | (z80.h << 8)));
 tstates += (4);; tstates += (3);;
 { z80.f = (bytetemp) >> 7; (bytetemp) = ( (bytetemp) << 1 ) | 0x01; (bytetemp) &= 0xff; z80.f |= sz53p_table[(bytetemp)];};
 writebyte_internal((z80.l | (z80.h << 8)),bytetemp);
      }
      break;
    case 0x37: /* SLL A */
      { z80.f = (z80.a) >> 7; (z80.a) = ( (z80.a) << 1 ) | 0x01; (z80.a) &= 0xff; z80.f |= sz53p_table[(z80.a)];};
      break;
    case 0x38: /* SRL B */
      { z80.f = (z80.b) & 0x01; (z80.b) >>= 1; z80.f |= sz53p_table[(z80.b)];};
      break;
    case 0x39: /* SRL C */
      { z80.f = (z80.c) & 0x01; (z80.c) >>= 1; z80.f |= sz53p_table[(z80.c)];};
      break;
    case 0x3a: /* SRL D */
      { z80.f = (z80.d) & 0x01; (z80.d) >>= 1; z80.f |= sz53p_table[(z80.d)];};
      break;
    case 0x3b: /* SRL E */
      { z80.f = (z80.e) & 0x01; (z80.e) >>= 1; z80.f |= sz53p_table[(z80.e)];};
      break;
    case 0x3c: /* SRL H */
      { z80.f = (z80.h) & 0x01; (z80.h) >>= 1; z80.f |= sz53p_table[(z80.h)];};
      break;
    case 0x3d: /* SRL L */
      { z80.f = (z80.l) & 0x01; (z80.l) >>= 1; z80.f |= sz53p_table[(z80.l)];};
      break;
    case 0x3e: /* SRL (HL) */
      {
 var bytetemp = readbyte_internal((z80.l | (z80.h << 8)));
 tstates += (4);; tstates += (3);;
 { z80.f = (bytetemp) & 0x01; (bytetemp) >>= 1; z80.f |= sz53p_table[(bytetemp)];};
 writebyte_internal((z80.l | (z80.h << 8)),bytetemp);
      }
      break;
    case 0x3f: /* SRL A */
      { z80.f = (z80.a) & 0x01; (z80.a) >>= 1; z80.f |= sz53p_table[(z80.a)];};
      break;
    case 0x40: /* BIT 0,B */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.b & ( 0x08 | 0x20 ) ); if( ! ( (z80.b) & ( 0x01 << (0) ) ) ) z80.f |= 0x04 | 0x40; if( (0) == 7 && (z80.b) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x41: /* BIT 0,C */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.c & ( 0x08 | 0x20 ) ); if( ! ( (z80.c) & ( 0x01 << (0) ) ) ) z80.f |= 0x04 | 0x40; if( (0) == 7 && (z80.c) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x42: /* BIT 0,D */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.d & ( 0x08 | 0x20 ) ); if( ! ( (z80.d) & ( 0x01 << (0) ) ) ) z80.f |= 0x04 | 0x40; if( (0) == 7 && (z80.d) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x43: /* BIT 0,E */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.e & ( 0x08 | 0x20 ) ); if( ! ( (z80.e) & ( 0x01 << (0) ) ) ) z80.f |= 0x04 | 0x40; if( (0) == 7 && (z80.e) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x44: /* BIT 0,H */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.h & ( 0x08 | 0x20 ) ); if( ! ( (z80.h) & ( 0x01 << (0) ) ) ) z80.f |= 0x04 | 0x40; if( (0) == 7 && (z80.h) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x45: /* BIT 0,L */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.l & ( 0x08 | 0x20 ) ); if( ! ( (z80.l) & ( 0x01 << (0) ) ) ) z80.f |= 0x04 | 0x40; if( (0) == 7 && (z80.l) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x46: /* BIT 0,(HL) */
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates += (4);;
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( bytetemp & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (0) ) ) ) z80.f |= 0x04 | 0x40; if( (0) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x47: /* BIT 0,A */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.a & ( 0x08 | 0x20 ) ); if( ! ( (z80.a) & ( 0x01 << (0) ) ) ) z80.f |= 0x04 | 0x40; if( (0) == 7 && (z80.a) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x48: /* BIT 1,B */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.b & ( 0x08 | 0x20 ) ); if( ! ( (z80.b) & ( 0x01 << (1) ) ) ) z80.f |= 0x04 | 0x40; if( (1) == 7 && (z80.b) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x49: /* BIT 1,C */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.c & ( 0x08 | 0x20 ) ); if( ! ( (z80.c) & ( 0x01 << (1) ) ) ) z80.f |= 0x04 | 0x40; if( (1) == 7 && (z80.c) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x4a: /* BIT 1,D */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.d & ( 0x08 | 0x20 ) ); if( ! ( (z80.d) & ( 0x01 << (1) ) ) ) z80.f |= 0x04 | 0x40; if( (1) == 7 && (z80.d) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x4b: /* BIT 1,E */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.e & ( 0x08 | 0x20 ) ); if( ! ( (z80.e) & ( 0x01 << (1) ) ) ) z80.f |= 0x04 | 0x40; if( (1) == 7 && (z80.e) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x4c: /* BIT 1,H */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.h & ( 0x08 | 0x20 ) ); if( ! ( (z80.h) & ( 0x01 << (1) ) ) ) z80.f |= 0x04 | 0x40; if( (1) == 7 && (z80.h) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x4d: /* BIT 1,L */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.l & ( 0x08 | 0x20 ) ); if( ! ( (z80.l) & ( 0x01 << (1) ) ) ) z80.f |= 0x04 | 0x40; if( (1) == 7 && (z80.l) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x4e: /* BIT 1,(HL) */
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates += (4);;
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( bytetemp & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (1) ) ) ) z80.f |= 0x04 | 0x40; if( (1) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x4f: /* BIT 1,A */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.a & ( 0x08 | 0x20 ) ); if( ! ( (z80.a) & ( 0x01 << (1) ) ) ) z80.f |= 0x04 | 0x40; if( (1) == 7 && (z80.a) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x50: /* BIT 2,B */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.b & ( 0x08 | 0x20 ) ); if( ! ( (z80.b) & ( 0x01 << (2) ) ) ) z80.f |= 0x04 | 0x40; if( (2) == 7 && (z80.b) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x51: /* BIT 2,C */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.c & ( 0x08 | 0x20 ) ); if( ! ( (z80.c) & ( 0x01 << (2) ) ) ) z80.f |= 0x04 | 0x40; if( (2) == 7 && (z80.c) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x52: /* BIT 2,D */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.d & ( 0x08 | 0x20 ) ); if( ! ( (z80.d) & ( 0x01 << (2) ) ) ) z80.f |= 0x04 | 0x40; if( (2) == 7 && (z80.d) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x53: /* BIT 2,E */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.e & ( 0x08 | 0x20 ) ); if( ! ( (z80.e) & ( 0x01 << (2) ) ) ) z80.f |= 0x04 | 0x40; if( (2) == 7 && (z80.e) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x54: /* BIT 2,H */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.h & ( 0x08 | 0x20 ) ); if( ! ( (z80.h) & ( 0x01 << (2) ) ) ) z80.f |= 0x04 | 0x40; if( (2) == 7 && (z80.h) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x55: /* BIT 2,L */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.l & ( 0x08 | 0x20 ) ); if( ! ( (z80.l) & ( 0x01 << (2) ) ) ) z80.f |= 0x04 | 0x40; if( (2) == 7 && (z80.l) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x56: /* BIT 2,(HL) */
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates += (4);;
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( bytetemp & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (2) ) ) ) z80.f |= 0x04 | 0x40; if( (2) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x57: /* BIT 2,A */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.a & ( 0x08 | 0x20 ) ); if( ! ( (z80.a) & ( 0x01 << (2) ) ) ) z80.f |= 0x04 | 0x40; if( (2) == 7 && (z80.a) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x58: /* BIT 3,B */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.b & ( 0x08 | 0x20 ) ); if( ! ( (z80.b) & ( 0x01 << (3) ) ) ) z80.f |= 0x04 | 0x40; if( (3) == 7 && (z80.b) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x59: /* BIT 3,C */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.c & ( 0x08 | 0x20 ) ); if( ! ( (z80.c) & ( 0x01 << (3) ) ) ) z80.f |= 0x04 | 0x40; if( (3) == 7 && (z80.c) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x5a: /* BIT 3,D */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.d & ( 0x08 | 0x20 ) ); if( ! ( (z80.d) & ( 0x01 << (3) ) ) ) z80.f |= 0x04 | 0x40; if( (3) == 7 && (z80.d) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x5b: /* BIT 3,E */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.e & ( 0x08 | 0x20 ) ); if( ! ( (z80.e) & ( 0x01 << (3) ) ) ) z80.f |= 0x04 | 0x40; if( (3) == 7 && (z80.e) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x5c: /* BIT 3,H */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.h & ( 0x08 | 0x20 ) ); if( ! ( (z80.h) & ( 0x01 << (3) ) ) ) z80.f |= 0x04 | 0x40; if( (3) == 7 && (z80.h) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x5d: /* BIT 3,L */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.l & ( 0x08 | 0x20 ) ); if( ! ( (z80.l) & ( 0x01 << (3) ) ) ) z80.f |= 0x04 | 0x40; if( (3) == 7 && (z80.l) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x5e: /* BIT 3,(HL) */
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates += (4);;
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( bytetemp & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (3) ) ) ) z80.f |= 0x04 | 0x40; if( (3) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x5f: /* BIT 3,A */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.a & ( 0x08 | 0x20 ) ); if( ! ( (z80.a) & ( 0x01 << (3) ) ) ) z80.f |= 0x04 | 0x40; if( (3) == 7 && (z80.a) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x60: /* BIT 4,B */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.b & ( 0x08 | 0x20 ) ); if( ! ( (z80.b) & ( 0x01 << (4) ) ) ) z80.f |= 0x04 | 0x40; if( (4) == 7 && (z80.b) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x61: /* BIT 4,C */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.c & ( 0x08 | 0x20 ) ); if( ! ( (z80.c) & ( 0x01 << (4) ) ) ) z80.f |= 0x04 | 0x40; if( (4) == 7 && (z80.c) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x62: /* BIT 4,D */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.d & ( 0x08 | 0x20 ) ); if( ! ( (z80.d) & ( 0x01 << (4) ) ) ) z80.f |= 0x04 | 0x40; if( (4) == 7 && (z80.d) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x63: /* BIT 4,E */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.e & ( 0x08 | 0x20 ) ); if( ! ( (z80.e) & ( 0x01 << (4) ) ) ) z80.f |= 0x04 | 0x40; if( (4) == 7 && (z80.e) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x64: /* BIT 4,H */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.h & ( 0x08 | 0x20 ) ); if( ! ( (z80.h) & ( 0x01 << (4) ) ) ) z80.f |= 0x04 | 0x40; if( (4) == 7 && (z80.h) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x65: /* BIT 4,L */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.l & ( 0x08 | 0x20 ) ); if( ! ( (z80.l) & ( 0x01 << (4) ) ) ) z80.f |= 0x04 | 0x40; if( (4) == 7 && (z80.l) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x66: /* BIT 4,(HL) */
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates += (4);;
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( bytetemp & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (4) ) ) ) z80.f |= 0x04 | 0x40; if( (4) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x67: /* BIT 4,A */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.a & ( 0x08 | 0x20 ) ); if( ! ( (z80.a) & ( 0x01 << (4) ) ) ) z80.f |= 0x04 | 0x40; if( (4) == 7 && (z80.a) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x68: /* BIT 5,B */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.b & ( 0x08 | 0x20 ) ); if( ! ( (z80.b) & ( 0x01 << (5) ) ) ) z80.f |= 0x04 | 0x40; if( (5) == 7 && (z80.b) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x69: /* BIT 5,C */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.c & ( 0x08 | 0x20 ) ); if( ! ( (z80.c) & ( 0x01 << (5) ) ) ) z80.f |= 0x04 | 0x40; if( (5) == 7 && (z80.c) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x6a: /* BIT 5,D */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.d & ( 0x08 | 0x20 ) ); if( ! ( (z80.d) & ( 0x01 << (5) ) ) ) z80.f |= 0x04 | 0x40; if( (5) == 7 && (z80.d) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x6b: /* BIT 5,E */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.e & ( 0x08 | 0x20 ) ); if( ! ( (z80.e) & ( 0x01 << (5) ) ) ) z80.f |= 0x04 | 0x40; if( (5) == 7 && (z80.e) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x6c: /* BIT 5,H */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.h & ( 0x08 | 0x20 ) ); if( ! ( (z80.h) & ( 0x01 << (5) ) ) ) z80.f |= 0x04 | 0x40; if( (5) == 7 && (z80.h) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x6d: /* BIT 5,L */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.l & ( 0x08 | 0x20 ) ); if( ! ( (z80.l) & ( 0x01 << (5) ) ) ) z80.f |= 0x04 | 0x40; if( (5) == 7 && (z80.l) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x6e: /* BIT 5,(HL) */
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates += (4);;
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( bytetemp & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (5) ) ) ) z80.f |= 0x04 | 0x40; if( (5) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x6f: /* BIT 5,A */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.a & ( 0x08 | 0x20 ) ); if( ! ( (z80.a) & ( 0x01 << (5) ) ) ) z80.f |= 0x04 | 0x40; if( (5) == 7 && (z80.a) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x70: /* BIT 6,B */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.b & ( 0x08 | 0x20 ) ); if( ! ( (z80.b) & ( 0x01 << (6) ) ) ) z80.f |= 0x04 | 0x40; if( (6) == 7 && (z80.b) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x71: /* BIT 6,C */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.c & ( 0x08 | 0x20 ) ); if( ! ( (z80.c) & ( 0x01 << (6) ) ) ) z80.f |= 0x04 | 0x40; if( (6) == 7 && (z80.c) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x72: /* BIT 6,D */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.d & ( 0x08 | 0x20 ) ); if( ! ( (z80.d) & ( 0x01 << (6) ) ) ) z80.f |= 0x04 | 0x40; if( (6) == 7 && (z80.d) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x73: /* BIT 6,E */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.e & ( 0x08 | 0x20 ) ); if( ! ( (z80.e) & ( 0x01 << (6) ) ) ) z80.f |= 0x04 | 0x40; if( (6) == 7 && (z80.e) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x74: /* BIT 6,H */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.h & ( 0x08 | 0x20 ) ); if( ! ( (z80.h) & ( 0x01 << (6) ) ) ) z80.f |= 0x04 | 0x40; if( (6) == 7 && (z80.h) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x75: /* BIT 6,L */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.l & ( 0x08 | 0x20 ) ); if( ! ( (z80.l) & ( 0x01 << (6) ) ) ) z80.f |= 0x04 | 0x40; if( (6) == 7 && (z80.l) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x76: /* BIT 6,(HL) */
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates += (4);;
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( bytetemp & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (6) ) ) ) z80.f |= 0x04 | 0x40; if( (6) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x77: /* BIT 6,A */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.a & ( 0x08 | 0x20 ) ); if( ! ( (z80.a) & ( 0x01 << (6) ) ) ) z80.f |= 0x04 | 0x40; if( (6) == 7 && (z80.a) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x78: /* BIT 7,B */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.b & ( 0x08 | 0x20 ) ); if( ! ( (z80.b) & ( 0x01 << (7) ) ) ) z80.f |= 0x04 | 0x40; if( (7) == 7 && (z80.b) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x79: /* BIT 7,C */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.c & ( 0x08 | 0x20 ) ); if( ! ( (z80.c) & ( 0x01 << (7) ) ) ) z80.f |= 0x04 | 0x40; if( (7) == 7 && (z80.c) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x7a: /* BIT 7,D */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.d & ( 0x08 | 0x20 ) ); if( ! ( (z80.d) & ( 0x01 << (7) ) ) ) z80.f |= 0x04 | 0x40; if( (7) == 7 && (z80.d) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x7b: /* BIT 7,E */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.e & ( 0x08 | 0x20 ) ); if( ! ( (z80.e) & ( 0x01 << (7) ) ) ) z80.f |= 0x04 | 0x40; if( (7) == 7 && (z80.e) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x7c: /* BIT 7,H */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.h & ( 0x08 | 0x20 ) ); if( ! ( (z80.h) & ( 0x01 << (7) ) ) ) z80.f |= 0x04 | 0x40; if( (7) == 7 && (z80.h) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x7d: /* BIT 7,L */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.l & ( 0x08 | 0x20 ) ); if( ! ( (z80.l) & ( 0x01 << (7) ) ) ) z80.f |= 0x04 | 0x40; if( (7) == 7 && (z80.l) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x7e: /* BIT 7,(HL) */
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates += (4);;
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( bytetemp & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (7) ) ) ) z80.f |= 0x04 | 0x40; if( (7) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x7f: /* BIT 7,A */
      { z80.f = ( z80.f & 0x01 ) | 0x10 | ( z80.a & ( 0x08 | 0x20 ) ); if( ! ( (z80.a) & ( 0x01 << (7) ) ) ) z80.f |= 0x04 | 0x40; if( (7) == 7 && (z80.a) & 0x80 ) z80.f |= 0x80; };
      break;
    case 0x80: /* RES 0,B */
      z80.b &= 0xfe;
      break;
    case 0x81: /* RES 0,C */
      z80.c &= 0xfe;
      break;
    case 0x82: /* RES 0,D */
      z80.d &= 0xfe;
      break;
    case 0x83: /* RES 0,E */
      z80.e &= 0xfe;
      break;
    case 0x84: /* RES 0,H */
      z80.h &= 0xfe;
      break;
    case 0x85: /* RES 0,L */
      z80.l &= 0xfe;
      break;
    case 0x86: /* RES 0,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) & 0xfe);
      break;
    case 0x87: /* RES 0,A */
      z80.a &= 0xfe;
      break;
    case 0x88: /* RES 1,B */
      z80.b &= 0xfd;
      break;
    case 0x89: /* RES 1,C */
      z80.c &= 0xfd;
      break;
    case 0x8a: /* RES 1,D */
      z80.d &= 0xfd;
      break;
    case 0x8b: /* RES 1,E */
      z80.e &= 0xfd;
      break;
    case 0x8c: /* RES 1,H */
      z80.h &= 0xfd;
      break;
    case 0x8d: /* RES 1,L */
      z80.l &= 0xfd;
      break;
    case 0x8e: /* RES 1,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) & 0xfd);
      break;
    case 0x8f: /* RES 1,A */
      z80.a &= 0xfd;
      break;
    case 0x90: /* RES 2,B */
      z80.b &= 0xfb;
      break;
    case 0x91: /* RES 2,C */
      z80.c &= 0xfb;
      break;
    case 0x92: /* RES 2,D */
      z80.d &= 0xfb;
      break;
    case 0x93: /* RES 2,E */
      z80.e &= 0xfb;
      break;
    case 0x94: /* RES 2,H */
      z80.h &= 0xfb;
      break;
    case 0x95: /* RES 2,L */
      z80.l &= 0xfb;
      break;
    case 0x96: /* RES 2,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) & 0xfb);
      break;
    case 0x97: /* RES 2,A */
      z80.a &= 0xfb;
      break;
    case 0x98: /* RES 3,B */
      z80.b &= 0xf7;
      break;
    case 0x99: /* RES 3,C */
      z80.c &= 0xf7;
      break;
    case 0x9a: /* RES 3,D */
      z80.d &= 0xf7;
      break;
    case 0x9b: /* RES 3,E */
      z80.e &= 0xf7;
      break;
    case 0x9c: /* RES 3,H */
      z80.h &= 0xf7;
      break;
    case 0x9d: /* RES 3,L */
      z80.l &= 0xf7;
      break;
    case 0x9e: /* RES 3,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) & 0xf7);
      break;
    case 0x9f: /* RES 3,A */
      z80.a &= 0xf7;
      break;
    case 0xa0: /* RES 4,B */
      z80.b &= 0xef;
      break;
    case 0xa1: /* RES 4,C */
      z80.c &= 0xef;
      break;
    case 0xa2: /* RES 4,D */
      z80.d &= 0xef;
      break;
    case 0xa3: /* RES 4,E */
      z80.e &= 0xef;
      break;
    case 0xa4: /* RES 4,H */
      z80.h &= 0xef;
      break;
    case 0xa5: /* RES 4,L */
      z80.l &= 0xef;
      break;
    case 0xa6: /* RES 4,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) & 0xef);
      break;
    case 0xa7: /* RES 4,A */
      z80.a &= 0xef;
      break;
    case 0xa8: /* RES 5,B */
      z80.b &= 0xdf;
      break;
    case 0xa9: /* RES 5,C */
      z80.c &= 0xdf;
      break;
    case 0xaa: /* RES 5,D */
      z80.d &= 0xdf;
      break;
    case 0xab: /* RES 5,E */
      z80.e &= 0xdf;
      break;
    case 0xac: /* RES 5,H */
      z80.h &= 0xdf;
      break;
    case 0xad: /* RES 5,L */
      z80.l &= 0xdf;
      break;
    case 0xae: /* RES 5,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) & 0xdf);
      break;
    case 0xaf: /* RES 5,A */
      z80.a &= 0xdf;
      break;
    case 0xb0: /* RES 6,B */
      z80.b &= 0xbf;
      break;
    case 0xb1: /* RES 6,C */
      z80.c &= 0xbf;
      break;
    case 0xb2: /* RES 6,D */
      z80.d &= 0xbf;
      break;
    case 0xb3: /* RES 6,E */
      z80.e &= 0xbf;
      break;
    case 0xb4: /* RES 6,H */
      z80.h &= 0xbf;
      break;
    case 0xb5: /* RES 6,L */
      z80.l &= 0xbf;
      break;
    case 0xb6: /* RES 6,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) & 0xbf);
      break;
    case 0xb7: /* RES 6,A */
      z80.a &= 0xbf;
      break;
    case 0xb8: /* RES 7,B */
      z80.b &= 0x7f;
      break;
    case 0xb9: /* RES 7,C */
      z80.c &= 0x7f;
      break;
    case 0xba: /* RES 7,D */
      z80.d &= 0x7f;
      break;
    case 0xbb: /* RES 7,E */
      z80.e &= 0x7f;
      break;
    case 0xbc: /* RES 7,H */
      z80.h &= 0x7f;
      break;
    case 0xbd: /* RES 7,L */
      z80.l &= 0x7f;
      break;
    case 0xbe: /* RES 7,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) & 0x7f);
      break;
    case 0xbf: /* RES 7,A */
      z80.a &= 0x7f;
      break;
    case 0xc0: /* SET 0,B */
      z80.b |= 0x01;
      break;
    case 0xc1: /* SET 0,C */
      z80.c |= 0x01;
      break;
    case 0xc2: /* SET 0,D */
      z80.d |= 0x01;
      break;
    case 0xc3: /* SET 0,E */
      z80.e |= 0x01;
      break;
    case 0xc4: /* SET 0,H */
      z80.h |= 0x01;
      break;
    case 0xc5: /* SET 0,L */
      z80.l |= 0x01;
      break;
    case 0xc6: /* SET 0,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) | 0x01);
      break;
    case 0xc7: /* SET 0,A */
      z80.a |= 0x01;
      break;
    case 0xc8: /* SET 1,B */
      z80.b |= 0x02;
      break;
    case 0xc9: /* SET 1,C */
      z80.c |= 0x02;
      break;
    case 0xca: /* SET 1,D */
      z80.d |= 0x02;
      break;
    case 0xcb: /* SET 1,E */
      z80.e |= 0x02;
      break;
    case 0xcc: /* SET 1,H */
      z80.h |= 0x02;
      break;
    case 0xcd: /* SET 1,L */
      z80.l |= 0x02;
      break;
    case 0xce: /* SET 1,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) | 0x02);
      break;
    case 0xcf: /* SET 1,A */
      z80.a |= 0x02;
      break;
    case 0xd0: /* SET 2,B */
      z80.b |= 0x04;
      break;
    case 0xd1: /* SET 2,C */
      z80.c |= 0x04;
      break;
    case 0xd2: /* SET 2,D */
      z80.d |= 0x04;
      break;
    case 0xd3: /* SET 2,E */
      z80.e |= 0x04;
      break;
    case 0xd4: /* SET 2,H */
      z80.h |= 0x04;
      break;
    case 0xd5: /* SET 2,L */
      z80.l |= 0x04;
      break;
    case 0xd6: /* SET 2,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) | 0x04);
      break;
    case 0xd7: /* SET 2,A */
      z80.a |= 0x04;
      break;
    case 0xd8: /* SET 3,B */
      z80.b |= 0x08;
      break;
    case 0xd9: /* SET 3,C */
      z80.c |= 0x08;
      break;
    case 0xda: /* SET 3,D */
      z80.d |= 0x08;
      break;
    case 0xdb: /* SET 3,E */
      z80.e |= 0x08;
      break;
    case 0xdc: /* SET 3,H */
      z80.h |= 0x08;
      break;
    case 0xdd: /* SET 3,L */
      z80.l |= 0x08;
      break;
    case 0xde: /* SET 3,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) | 0x08);
      break;
    case 0xdf: /* SET 3,A */
      z80.a |= 0x08;
      break;
    case 0xe0: /* SET 4,B */
      z80.b |= 0x10;
      break;
    case 0xe1: /* SET 4,C */
      z80.c |= 0x10;
      break;
    case 0xe2: /* SET 4,D */
      z80.d |= 0x10;
      break;
    case 0xe3: /* SET 4,E */
      z80.e |= 0x10;
      break;
    case 0xe4: /* SET 4,H */
      z80.h |= 0x10;
      break;
    case 0xe5: /* SET 4,L */
      z80.l |= 0x10;
      break;
    case 0xe6: /* SET 4,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) | 0x10);
      break;
    case 0xe7: /* SET 4,A */
      z80.a |= 0x10;
      break;
    case 0xe8: /* SET 5,B */
      z80.b |= 0x20;
      break;
    case 0xe9: /* SET 5,C */
      z80.c |= 0x20;
      break;
    case 0xea: /* SET 5,D */
      z80.d |= 0x20;
      break;
    case 0xeb: /* SET 5,E */
      z80.e |= 0x20;
      break;
    case 0xec: /* SET 5,H */
      z80.h |= 0x20;
      break;
    case 0xed: /* SET 5,L */
      z80.l |= 0x20;
      break;
    case 0xee: /* SET 5,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) | 0x20);
      break;
    case 0xef: /* SET 5,A */
      z80.a |= 0x20;
      break;
    case 0xf0: /* SET 6,B */
      z80.b |= 0x40;
      break;
    case 0xf1: /* SET 6,C */
      z80.c |= 0x40;
      break;
    case 0xf2: /* SET 6,D */
      z80.d |= 0x40;
      break;
    case 0xf3: /* SET 6,E */
      z80.e |= 0x40;
      break;
    case 0xf4: /* SET 6,H */
      z80.h |= 0x40;
      break;
    case 0xf5: /* SET 6,L */
      z80.l |= 0x40;
      break;
    case 0xf6: /* SET 6,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) | 0x40);
      break;
    case 0xf7: /* SET 6,A */
      z80.a |= 0x40;
      break;
    case 0xf8: /* SET 7,B */
      z80.b |= 0x80;
      break;
    case 0xf9: /* SET 7,C */
      z80.c |= 0x80;
      break;
    case 0xfa: /* SET 7,D */
      z80.d |= 0x80;
      break;
    case 0xfb: /* SET 7,E */
      z80.e |= 0x80;
      break;
    case 0xfc: /* SET 7,H */
      z80.h |= 0x80;
      break;
    case 0xfd: /* SET 7,L */
      z80.l |= 0x80;
      break;
    case 0xfe: /* SET 7,(HL) */
      tstates += (4);; tstates += (3);;
      writebyte_internal((z80.l | (z80.h << 8)), readbyte_internal((z80.l | (z80.h << 8))) | 0x80);
      break;
    case 0xff: /* SET 7,A */
      z80.a |= 0x80;
      break;
 }
      }
      break;
    case 0xcc: /* CALL Z,nnnn */
      tstates += (3);; tstates += (3);;
      if( z80.f & 0x40 ) { { var calltempl, calltemph; calltempl=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (1);; calltemph=readbyte_internal(z80.pc++); z80.pc &= 0xffff; { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; var pcl=calltempl; var pch=calltemph; z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xcd: /* CALL nnnn */
      tstates += (3);; tstates += (3);;
      { var calltempl, calltemph; calltempl=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (1);; calltemph=readbyte_internal(z80.pc++); z80.pc &= 0xffff; { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; var pcl=calltempl; var pch=calltemph; z80.pc = pcl | (pch << 8);};
      break;
    case 0xce: /* ADC A,nn */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( z80.pc++ );
 { var adctemp = z80.a + (bytetemp) + ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( adctemp & 0x88 ) >> 1 ); z80.a=adctemp & 0xff; z80.f = ( adctemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0xcf: /* RST 8 */
      tstates++;
      { { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; z80.pc=(0x08);};
      break;
    case 0xd0: /* RET NC */
      tstates++;
      if( ! ( z80.f & 0x01 ) ) { { { tstates += (3);; var lowbyte =readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; var highbyte=readbyte_internal(z80.sp++); z80.sp &= 0xffff; (z80.pc) = lowbyte | (highbyte << 8);};}; }
      break;
    case 0xd1: /* POP DE */
      { tstates += (3);; (z80.e)=readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; (z80.d)=readbyte_internal(z80.sp++); z80.sp &= 0xffff;};
      break;
    case 0xd2: /* JP NC,nnnn */
      tstates += (3);; tstates += (3);;
      if( ! ( z80.f & 0x01 ) ) { { var jptemp=z80.pc; var pcl =readbyte_internal(jptemp++); jptemp &= 0xffff; var pch =readbyte_internal(jptemp); z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xd3: /* OUT (nn),A */
      {
 var outtemp;
 tstates += (4);;
 outtemp = readbyte_internal( z80.pc++ ) + ( z80.a << 8 );
 z80.pc &= 0xffff;
 { tstates += (3);; writeport(outtemp,z80.a);};
      }
      break;
    case 0xd4: /* CALL NC,nnnn */
      tstates += (3);; tstates += (3);;
      if( ! ( z80.f & 0x01 ) ) { { var calltempl, calltemph; calltempl=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (1);; calltemph=readbyte_internal(z80.pc++); z80.pc &= 0xffff; { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; var pcl=calltempl; var pch=calltemph; z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xd5: /* PUSH DE */
      tstates++;
      { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.d)); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.e));};
      break;
    case 0xd6: /* SUB nn */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( z80.pc++ );
 { var subtemp = z80.a - (bytetemp); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0xd7: /* RST 10 */
      tstates++;
      { { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; z80.pc=(0x10);};
      break;
    case 0xd8: /* RET C */
      tstates++;
      if( z80.f & 0x01 ) { { { tstates += (3);; var lowbyte =readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; var highbyte=readbyte_internal(z80.sp++); z80.sp &= 0xffff; (z80.pc) = lowbyte | (highbyte << 8);};}; }
      break;
    case 0xd9: /* EXX */
      {
 var bytetemp;
 bytetemp = z80.b; z80.b = z80.b_; z80.b_ = bytetemp;
 bytetemp = z80.c; z80.c = z80.c_; z80.c_ = bytetemp;
 bytetemp = z80.d; z80.d = z80.d_; z80.d_ = bytetemp;
 bytetemp = z80.e; z80.e = z80.e_; z80.e_ = bytetemp;
 bytetemp = z80.h; z80.h = z80.h_; z80.h_ = bytetemp;
 bytetemp = z80.l; z80.l = z80.l_; z80.l_ = bytetemp;
      }
      break;
    case 0xda: /* JP C,nnnn */
      tstates += (3);; tstates += (3);;
      if( z80.f & 0x01 ) { { var jptemp=z80.pc; var pcl =readbyte_internal(jptemp++); jptemp &= 0xffff; var pch =readbyte_internal(jptemp); z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xdb: /* IN A,(nn) */
      {
 var intemp;
 tstates += (4);;
 intemp = readbyte_internal( z80.pc++ ) + ( z80.a << 8 );
 z80.pc &= 0xffff;
 tstates += (3);;
        z80.a=readport( intemp );
      }
      break;
    case 0xdc: /* CALL C,nnnn */
      tstates += (3);; tstates += (3);;
      if( z80.f & 0x01 ) { { var calltempl, calltemph; calltempl=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (1);; calltemph=readbyte_internal(z80.pc++); z80.pc &= 0xffff; { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; var pcl=calltempl; var pch=calltemph; z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xdd: /* shift DD */
      {
 var opcode2;
 tstates += (4);;
 opcode2 = readbyte_internal( z80.pc++ );
 z80.pc &= 0xffff;
 z80.r = (z80.r+1) & 0x7f;
 switch(opcode2) {
/* opcodes_ddfd.c Z80 {DD,FD}xx opcodes
   Copyright (c) 1999-2008 Philip Kendall, Matthew Westcott

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Contact details: <matthew@west.co.tt>
    Matthew Westcott, 14 Daisy Hill Drive, Adlington, Chorley, Lancs PR6 9NE UNITED KINGDOM

*/
/* NB: this file is autogenerated by 'z80.pl' from 'opcodes_ddfd.dat',
   and included in 'z80_ops.jscpp' */
    case 0x09: /* ADD REGISTER,BC */
      { var add16temp = ((z80.ixl | (z80.ixh << 8))) + ((z80.c | (z80.b << 8))); var lookup = ( ( ((z80.ixl | (z80.ixh << 8))) & 0x0800 ) >> 11 ) | ( ( ((z80.c | (z80.b << 8))) & 0x0800 ) >> 10 ) | ( ( add16temp & 0x0800 ) >> 9 ); tstates += 7; (z80.ixh) = (add16temp >> 8) & 0xff; (z80.ixl) = add16temp & 0xff; z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) | ( add16temp & 0x10000 ? 0x01 : 0 )| ( ( add16temp >> 8 ) & ( 0x08 | 0x20 ) ) | halfcarry_add_table[lookup];};
      break;
    case 0x19: /* ADD REGISTER,DE */
      { var add16temp = ((z80.ixl | (z80.ixh << 8))) + ((z80.e | (z80.d << 8))); var lookup = ( ( ((z80.ixl | (z80.ixh << 8))) & 0x0800 ) >> 11 ) | ( ( ((z80.e | (z80.d << 8))) & 0x0800 ) >> 10 ) | ( ( add16temp & 0x0800 ) >> 9 ); tstates += 7; (z80.ixh) = (add16temp >> 8) & 0xff; (z80.ixl) = add16temp & 0xff; z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) | ( add16temp & 0x10000 ? 0x01 : 0 )| ( ( add16temp >> 8 ) & ( 0x08 | 0x20 ) ) | halfcarry_add_table[lookup];};
      break;
    case 0x21: /* LD REGISTER,nnnn */
      tstates += (3);;
      z80.ixl=readbyte_internal(z80.pc++);
      z80.pc &= 0xffff;
      tstates += (3);;
      z80.ixh=readbyte_internal(z80.pc++);
      z80.pc &= 0xffff;
      break;
    case 0x22: /* LD (nnnn),REGISTER */
      { var ldtemp; tstates += (3);; ldtemp=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (3);; ldtemp|=readbyte_internal(z80.pc++) << 8; z80.pc &= 0xffff; tstates += (3);; writebyte_internal(ldtemp++,(z80.ixl)); ldtemp &= 0xffff; tstates += (3);; writebyte_internal(ldtemp,(z80.ixh)); break;};
      break;
    case 0x23: /* INC REGISTER */
      tstates += 2;
      var wordtemp = ((z80.ixl | (z80.ixh << 8)) + 1) & 0xffff;
      z80.ixh = wordtemp >> 8;
      z80.ixl = wordtemp & 0xff;
      break;
    case 0x24: /* INC REGISTERH */
      { (z80.ixh) = ((z80.ixh) + 1) & 0xff; z80.f = ( z80.f & 0x01 ) | ( (z80.ixh)==0x80 ? 0x04 : 0 ) | ( (z80.ixh)&0x0f ? 0 : 0x10 ) | sz53_table[(z80.ixh)];};
      break;
    case 0x25: /* DEC REGISTERH */
      { z80.f = ( z80.f & 0x01 ) | ( (z80.ixh)&0x0f ? 0 : 0x10 ) | 0x02; (z80.ixh) = ((z80.ixh) - 1) & 0xff; z80.f |= ( (z80.ixh)==0x7f ? 0x04 : 0 ) | sz53_table[z80.ixh];};
      break;
    case 0x26: /* LD REGISTERH,nn */
      tstates += (3);;
      z80.ixh=readbyte_internal(z80.pc++); z80.pc &= 0xffff;
      break;
    case 0x29: /* ADD REGISTER,REGISTER */
      { var add16temp = ((z80.ixl | (z80.ixh << 8))) + ((z80.ixl | (z80.ixh << 8))); var lookup = ( ( ((z80.ixl | (z80.ixh << 8))) & 0x0800 ) >> 11 ) | ( ( ((z80.ixl | (z80.ixh << 8))) & 0x0800 ) >> 10 ) | ( ( add16temp & 0x0800 ) >> 9 ); tstates += 7; (z80.ixh) = (add16temp >> 8) & 0xff; (z80.ixl) = add16temp & 0xff; z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) | ( add16temp & 0x10000 ? 0x01 : 0 )| ( ( add16temp >> 8 ) & ( 0x08 | 0x20 ) ) | halfcarry_add_table[lookup];};
      break;
    case 0x2a: /* LD REGISTER,(nnnn) */
      { var ldtemp; tstates += (3);; ldtemp=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (3);; ldtemp|=readbyte_internal(z80.pc++) << 8; z80.pc &= 0xffff; tstates += (3);; (z80.ixl)=readbyte_internal(ldtemp++); ldtemp &= 0xffff; tstates += (3);; (z80.ixh)=readbyte_internal(ldtemp); break;};
      break;
    case 0x2b: /* DEC REGISTER */
      tstates += 2;
      var wordtemp = ((z80.ixl | (z80.ixh << 8)) - 1) & 0xffff;
      z80.ixh = wordtemp >> 8;
      z80.ixl = wordtemp & 0xff;
      break;
    case 0x2c: /* INC REGISTERL */
      { (z80.ixl) = ((z80.ixl) + 1) & 0xff; z80.f = ( z80.f & 0x01 ) | ( (z80.ixl)==0x80 ? 0x04 : 0 ) | ( (z80.ixl)&0x0f ? 0 : 0x10 ) | sz53_table[(z80.ixl)];};
      break;
    case 0x2d: /* DEC REGISTERL */
      { z80.f = ( z80.f & 0x01 ) | ( (z80.ixl)&0x0f ? 0 : 0x10 ) | 0x02; (z80.ixl) = ((z80.ixl) - 1) & 0xff; z80.f |= ( (z80.ixl)==0x7f ? 0x04 : 0 ) | sz53_table[z80.ixl];};
      break;
    case 0x2e: /* LD REGISTERL,nn */
      tstates += (3);;
      z80.ixl=readbyte_internal(z80.pc++); z80.pc &= 0xffff;
      break;
    case 0x34: /* INC (REGISTER+dd) */
      tstates += 15; /* FIXME: how is this contended? */
      {
 var wordtemp =
     ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff;
 z80.pc &= 0xffff;
 var bytetemp = readbyte_internal( wordtemp );
 { (bytetemp) = ((bytetemp) + 1) & 0xff; z80.f = ( z80.f & 0x01 ) | ( (bytetemp)==0x80 ? 0x04 : 0 ) | ( (bytetemp)&0x0f ? 0 : 0x10 ) | sz53_table[(bytetemp)];};
 writebyte_internal(wordtemp,bytetemp);
      }
      break;
    case 0x35: /* DEC (REGISTER+dd) */
      tstates += 15; /* FIXME: how is this contended? */
      {
 var wordtemp =
     ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff;
 z80.pc &= 0xffff;
 var bytetemp = readbyte_internal( wordtemp );
 { z80.f = ( z80.f & 0x01 ) | ( (bytetemp)&0x0f ? 0 : 0x10 ) | 0x02; (bytetemp) = ((bytetemp) - 1) & 0xff; z80.f |= ( (bytetemp)==0x7f ? 0x04 : 0 ) | sz53_table[bytetemp];};
 writebyte_internal(wordtemp,bytetemp);
      }
      break;
    case 0x36: /* LD (REGISTER+dd),nn */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var wordtemp =
     ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff;
 z80.pc &= 0xffff;
 writebyte_internal(wordtemp,readbyte_internal(z80.pc++));
 z80.pc &= 0xffff;
      }
      break;
    case 0x39: /* ADD REGISTER,SP */
      { var add16temp = ((z80.ixl | (z80.ixh << 8))) + (z80.sp); var lookup = ( ( ((z80.ixl | (z80.ixh << 8))) & 0x0800 ) >> 11 ) | ( ( (z80.sp) & 0x0800 ) >> 10 ) | ( ( add16temp & 0x0800 ) >> 9 ); tstates += 7; (z80.ixh) = (add16temp >> 8) & 0xff; (z80.ixl) = add16temp & 0xff; z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) | ( add16temp & 0x10000 ? 0x01 : 0 )| ( ( add16temp >> 8 ) & ( 0x08 | 0x20 ) ) | halfcarry_add_table[lookup];};
      break;
    case 0x44: /* LD B,REGISTERH */
      z80.b=z80.ixh;
      break;
    case 0x45: /* LD B,REGISTERL */
      z80.b=z80.ixl;
      break;
    case 0x46: /* LD B,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      z80.b = readbyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
      z80.pc &= 0xffff;
      break;
    case 0x4c: /* LD C,REGISTERH */
      z80.c=z80.ixh;
      break;
    case 0x4d: /* LD C,REGISTERL */
      z80.c=z80.ixl;
      break;
    case 0x4e: /* LD C,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      z80.c = readbyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
      z80.pc &= 0xffff;
      break;
    case 0x54: /* LD D,REGISTERH */
      z80.d=z80.ixh;
      break;
    case 0x55: /* LD D,REGISTERL */
      z80.d=z80.ixl;
      break;
    case 0x56: /* LD D,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      z80.d = readbyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
      z80.pc &= 0xffff;
      break;
    case 0x5c: /* LD E,REGISTERH */
      z80.e=z80.ixh;
      break;
    case 0x5d: /* LD E,REGISTERL */
      z80.e=z80.ixl;
      break;
    case 0x5e: /* LD E,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      z80.e = readbyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
      z80.pc &= 0xffff;
      break;
    case 0x60: /* LD REGISTERH,B */
      z80.ixh=z80.b;
      break;
    case 0x61: /* LD REGISTERH,C */
      z80.ixh=z80.c;
      break;
    case 0x62: /* LD REGISTERH,D */
      z80.ixh=z80.d;
      break;
    case 0x63: /* LD REGISTERH,E */
      z80.ixh=z80.e;
      break;
    case 0x64: /* LD REGISTERH,REGISTERH */
      break;
    case 0x65: /* LD REGISTERH,REGISTERL */
      z80.ixh=z80.ixl;
      break;
    case 0x66: /* LD H,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      z80.h = readbyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
      z80.pc &= 0xffff;
      break;
    case 0x67: /* LD REGISTERH,A */
      z80.ixh=z80.a;
      break;
    case 0x68: /* LD REGISTERL,B */
      z80.ixl=z80.b;
      break;
    case 0x69: /* LD REGISTERL,C */
      z80.ixl=z80.c;
      break;
    case 0x6a: /* LD REGISTERL,D */
      z80.ixl=z80.d;
      break;
    case 0x6b: /* LD REGISTERL,E */
      z80.ixl=z80.e;
      break;
    case 0x6c: /* LD REGISTERL,REGISTERH */
      z80.ixl=z80.ixh;
      break;
    case 0x6d: /* LD REGISTERL,REGISTERL */
      break;
    case 0x6e: /* LD L,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      z80.l = readbyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
      z80.pc &= 0xffff;
      break;
    case 0x6f: /* LD REGISTERL,A */
      z80.ixl=z80.a;
      break;
    case 0x70: /* LD (REGISTER+dd),B */
      tstates += 11; /* FIXME: how is this contended? */
      writebyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff, z80.b );
      z80.pc &= 0xffff;
      break;
    case 0x71: /* LD (REGISTER+dd),C */
      tstates += 11; /* FIXME: how is this contended? */
      writebyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff, z80.c );
      z80.pc &= 0xffff;
      break;
    case 0x72: /* LD (REGISTER+dd),D */
      tstates += 11; /* FIXME: how is this contended? */
      writebyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff, z80.d );
      z80.pc &= 0xffff;
      break;
    case 0x73: /* LD (REGISTER+dd),E */
      tstates += 11; /* FIXME: how is this contended? */
      writebyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff, z80.e );
      z80.pc &= 0xffff;
      break;
    case 0x74: /* LD (REGISTER+dd),H */
      tstates += 11; /* FIXME: how is this contended? */
      writebyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff, z80.h );
      z80.pc &= 0xffff;
      break;
    case 0x75: /* LD (REGISTER+dd),L */
      tstates += 11; /* FIXME: how is this contended? */
      writebyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff, z80.l );
      z80.pc &= 0xffff;
      break;
    case 0x77: /* LD (REGISTER+dd),A */
      tstates += 11; /* FIXME: how is this contended? */
      writebyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff, z80.a );
      z80.pc &= 0xffff;
      break;
    case 0x7c: /* LD A,REGISTERH */
      z80.a=z80.ixh;
      break;
    case 0x7d: /* LD A,REGISTERL */
      z80.a=z80.ixl;
      break;
    case 0x7e: /* LD A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      z80.a = readbyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
      z80.pc &= 0xffff;
      break;
    case 0x84: /* ADD A,REGISTERH */
      { var addtemp = z80.a + (z80.ixh); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.ixh) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x85: /* ADD A,REGISTERL */
      { var addtemp = z80.a + (z80.ixl); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.ixl) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x86: /* ADD A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { var addtemp = z80.a + (bytetemp); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0x8c: /* ADC A,REGISTERH */
      { var adctemp = z80.a + (z80.ixh) + ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.ixh) & 0x88 ) >> 2 ) | ( ( adctemp & 0x88 ) >> 1 ); z80.a=adctemp & 0xff; z80.f = ( adctemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x8d: /* ADC A,REGISTERL */
      { var adctemp = z80.a + (z80.ixl) + ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.ixl) & 0x88 ) >> 2 ) | ( ( adctemp & 0x88 ) >> 1 ); z80.a=adctemp & 0xff; z80.f = ( adctemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x8e: /* ADC A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { var adctemp = z80.a + (bytetemp) + ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( adctemp & 0x88 ) >> 1 ); z80.a=adctemp & 0xff; z80.f = ( adctemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0x94: /* SUB A,REGISTERH */
      { var subtemp = z80.a - (z80.ixh); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.ixh) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x95: /* SUB A,REGISTERL */
      { var subtemp = z80.a - (z80.ixl); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.ixl) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x96: /* SUB A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { var subtemp = z80.a - (bytetemp); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0x9c: /* SBC A,REGISTERH */
      { var sbctemp = z80.a - (z80.ixh) - ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.ixh) & 0x88 ) >> 2 ) | ( ( sbctemp & 0x88 ) >> 1 ); z80.a=sbctemp & 0xff; z80.f = ( sbctemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x9d: /* SBC A,REGISTERL */
      { var sbctemp = z80.a - (z80.ixl) - ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.ixl) & 0x88 ) >> 2 ) | ( ( sbctemp & 0x88 ) >> 1 ); z80.a=sbctemp & 0xff; z80.f = ( sbctemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x9e: /* SBC A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { var sbctemp = z80.a - (bytetemp) - ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( sbctemp & 0x88 ) >> 1 ); z80.a=sbctemp & 0xff; z80.f = ( sbctemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0xa4: /* AND A,REGISTERH */
      { z80.a &= (z80.ixh); z80.f = 0x10 | sz53p_table[z80.a];};
      break;
    case 0xa5: /* AND A,REGISTERL */
      { z80.a &= (z80.ixl); z80.f = 0x10 | sz53p_table[z80.a];};
      break;
    case 0xa6: /* AND A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { z80.a &= (bytetemp); z80.f = 0x10 | sz53p_table[z80.a];};
      }
      break;
    case 0xac: /* XOR A,REGISTERH */
      { z80.a ^= (z80.ixh); z80.f = sz53p_table[z80.a];};
      break;
    case 0xad: /* XOR A,REGISTERL */
      { z80.a ^= (z80.ixl); z80.f = sz53p_table[z80.a];};
      break;
    case 0xae: /* XOR A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { z80.a ^= (bytetemp); z80.f = sz53p_table[z80.a];};
      }
      break;
    case 0xb4: /* OR A,REGISTERH */
      { z80.a |= (z80.ixh); z80.f = sz53p_table[z80.a];};
      break;
    case 0xb5: /* OR A,REGISTERL */
      { z80.a |= (z80.ixl); z80.f = sz53p_table[z80.a];};
      break;
    case 0xb6: /* OR A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { z80.a |= (bytetemp); z80.f = sz53p_table[z80.a];};
      }
      break;
    case 0xbc: /* CP A,REGISTERH */
      { var cptemp = z80.a - z80.ixh; var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.ixh) & 0x88 ) >> 2 ) | ( ( cptemp & 0x88 ) >> 1 ); z80.f = ( cptemp & 0x100 ? 0x01 : ( cptemp ? 0 : 0x40 ) ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | ( z80.ixh & ( 0x08 | 0x20 ) ) | ( cptemp & 0x80 );};
      break;
    case 0xbd: /* CP A,REGISTERL */
      { var cptemp = z80.a - z80.ixl; var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.ixl) & 0x88 ) >> 2 ) | ( ( cptemp & 0x88 ) >> 1 ); z80.f = ( cptemp & 0x100 ? 0x01 : ( cptemp ? 0 : 0x40 ) ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | ( z80.ixl & ( 0x08 | 0x20 ) ) | ( cptemp & 0x80 );};
      break;
    case 0xbe: /* CP A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { var cptemp = z80.a - bytetemp; var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( cptemp & 0x88 ) >> 1 ); z80.f = ( cptemp & 0x100 ? 0x01 : ( cptemp ? 0 : 0x40 ) ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | ( bytetemp & ( 0x08 | 0x20 ) ) | ( cptemp & 0x80 );};
      }
      break;
    case 0xcb: /* shift DDFDCB */
      /* FIXME: contention here is just a guess */
      {
 var tempaddr; var opcode3;
 tstates += (3);;
 tempaddr =
     (z80.ixl | (z80.ixh << 8)) + sign_extend(readbyte_internal( z80.pc++ ));
 z80.pc &= 0xffff;
 tstates += (4);;
 opcode3 = readbyte_internal( z80.pc++ );
 z80.pc &= 0xffff;
 switch(opcode3) {
/* opcodes_ddfdcb.c Z80 {DD,FD}CBxx opcodes
   Copyright (c) 1999-2008 Philip Kendall, Matthew Westcott

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Contact details: <matthew@west.co.tt>
    Matthew Westcott, 14 Daisy Hill Drive, Adlington, Chorley, Lancs PR6 9NE UNITED KINGDOM

*/
/* NB: this file is autogenerated by 'z80.pl' from 'opcodes_ddfdcb.dat',
   and included in 'z80_ops.jscpp' */
    case 0x00: /* LD B,RLC (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { (z80.b) = ( ((z80.b) & 0x7f)<<1 ) | ( (z80.b)>>7 ); z80.f = ( (z80.b) & 0x01 ) | sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x01: /* LD C,RLC (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { (z80.c) = ( ((z80.c) & 0x7f)<<1 ) | ( (z80.c)>>7 ); z80.f = ( (z80.c) & 0x01 ) | sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x02: /* LD D,RLC (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { (z80.d) = ( ((z80.d) & 0x7f)<<1 ) | ( (z80.d)>>7 ); z80.f = ( (z80.d) & 0x01 ) | sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x03: /* LD E,RLC (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { (z80.e) = ( ((z80.e) & 0x7f)<<1 ) | ( (z80.e)>>7 ); z80.f = ( (z80.e) & 0x01 ) | sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x04: /* LD H,RLC (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { (z80.h) = ( ((z80.h) & 0x7f)<<1 ) | ( (z80.h)>>7 ); z80.f = ( (z80.h) & 0x01 ) | sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x05: /* LD L,RLC (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { (z80.l) = ( ((z80.l) & 0x7f)<<1 ) | ( (z80.l)>>7 ); z80.f = ( (z80.l) & 0x01 ) | sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x06: /* RLC (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { (bytetemp) = ( ((bytetemp) & 0x7f)<<1 ) | ( (bytetemp)>>7 ); z80.f = ( (bytetemp) & 0x01 ) | sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x07: /* LD A,RLC (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { (z80.a) = ( ((z80.a) & 0x7f)<<1 ) | ( (z80.a)>>7 ); z80.f = ( (z80.a) & 0x01 ) | sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x08: /* LD B,RRC (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { z80.f = (z80.b) & 0x01; (z80.b) = ( (z80.b)>>1 ) | ( ((z80.b) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x09: /* LD C,RRC (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { z80.f = (z80.c) & 0x01; (z80.c) = ( (z80.c)>>1 ) | ( ((z80.c) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x0a: /* LD D,RRC (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { z80.f = (z80.d) & 0x01; (z80.d) = ( (z80.d)>>1 ) | ( ((z80.d) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x0b: /* LD E,RRC (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { z80.f = (z80.e) & 0x01; (z80.e) = ( (z80.e)>>1 ) | ( ((z80.e) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x0c: /* LD H,RRC (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { z80.f = (z80.h) & 0x01; (z80.h) = ( (z80.h)>>1 ) | ( ((z80.h) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x0d: /* LD L,RRC (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { z80.f = (z80.l) & 0x01; (z80.l) = ( (z80.l)>>1 ) | ( ((z80.l) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x0e: /* RRC (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { z80.f = (bytetemp) & 0x01; (bytetemp) = ( (bytetemp)>>1 ) | ( ((bytetemp) & 0x01)<<7 ); z80.f |= sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x0f: /* LD A,RRC (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { z80.f = (z80.a) & 0x01; (z80.a) = ( (z80.a)>>1 ) | ( ((z80.a) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x10: /* LD B,RL (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { var rltemp = (z80.b); (z80.b) = ( ((z80.b) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x11: /* LD C,RL (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { var rltemp = (z80.c); (z80.c) = ( ((z80.c) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x12: /* LD D,RL (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { var rltemp = (z80.d); (z80.d) = ( ((z80.d) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x13: /* LD E,RL (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { var rltemp = (z80.e); (z80.e) = ( ((z80.e) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x14: /* LD H,RL (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { var rltemp = (z80.h); (z80.h) = ( ((z80.h) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x15: /* LD L,RL (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { var rltemp = (z80.l); (z80.l) = ( ((z80.l) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x16: /* RL (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { var rltemp = (bytetemp); (bytetemp) = ( ((bytetemp) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x17: /* LD A,RL (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { var rltemp = (z80.a); (z80.a) = ( ((z80.a) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x18: /* LD B,RR (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { var rrtemp = (z80.b); (z80.b) = ( (z80.b)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x19: /* LD C,RR (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { var rrtemp = (z80.c); (z80.c) = ( (z80.c)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x1a: /* LD D,RR (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { var rrtemp = (z80.d); (z80.d) = ( (z80.d)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x1b: /* LD E,RR (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { var rrtemp = (z80.e); (z80.e) = ( (z80.e)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x1c: /* LD H,RR (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { var rrtemp = (z80.h); (z80.h) = ( (z80.h)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x1d: /* LD L,RR (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { var rrtemp = (z80.l); (z80.l) = ( (z80.l)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x1e: /* RR (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { var rrtemp = (bytetemp); (bytetemp) = ( (bytetemp)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x1f: /* LD A,RR (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { var rrtemp = (z80.a); (z80.a) = ( (z80.a)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x20: /* LD B,SLA (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { z80.f = (z80.b) >> 7; (z80.b) <<= 1; (z80.b) &= 0xff; z80.f |= sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x21: /* LD C,SLA (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { z80.f = (z80.c) >> 7; (z80.c) <<= 1; (z80.c) &= 0xff; z80.f |= sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x22: /* LD D,SLA (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { z80.f = (z80.d) >> 7; (z80.d) <<= 1; (z80.d) &= 0xff; z80.f |= sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x23: /* LD E,SLA (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { z80.f = (z80.e) >> 7; (z80.e) <<= 1; (z80.e) &= 0xff; z80.f |= sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x24: /* LD H,SLA (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { z80.f = (z80.h) >> 7; (z80.h) <<= 1; (z80.h) &= 0xff; z80.f |= sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x25: /* LD L,SLA (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { z80.f = (z80.l) >> 7; (z80.l) <<= 1; (z80.l) &= 0xff; z80.f |= sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x26: /* SLA (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { z80.f = (bytetemp) >> 7; (bytetemp) <<= 1; (bytetemp) &= 0xff; z80.f |= sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x27: /* LD A,SLA (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { z80.f = (z80.a) >> 7; (z80.a) <<= 1; (z80.a) &= 0xff; z80.f |= sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x28: /* LD B,SRA (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { z80.f = (z80.b) & 0x01; (z80.b) = ( (z80.b) & 0x80 ) | ( (z80.b) >> 1 ); z80.f |= sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x29: /* LD C,SRA (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { z80.f = (z80.c) & 0x01; (z80.c) = ( (z80.c) & 0x80 ) | ( (z80.c) >> 1 ); z80.f |= sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x2a: /* LD D,SRA (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { z80.f = (z80.d) & 0x01; (z80.d) = ( (z80.d) & 0x80 ) | ( (z80.d) >> 1 ); z80.f |= sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x2b: /* LD E,SRA (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { z80.f = (z80.e) & 0x01; (z80.e) = ( (z80.e) & 0x80 ) | ( (z80.e) >> 1 ); z80.f |= sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x2c: /* LD H,SRA (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { z80.f = (z80.h) & 0x01; (z80.h) = ( (z80.h) & 0x80 ) | ( (z80.h) >> 1 ); z80.f |= sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x2d: /* LD L,SRA (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { z80.f = (z80.l) & 0x01; (z80.l) = ( (z80.l) & 0x80 ) | ( (z80.l) >> 1 ); z80.f |= sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x2e: /* SRA (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { z80.f = (bytetemp) & 0x01; (bytetemp) = ( (bytetemp) & 0x80 ) | ( (bytetemp) >> 1 ); z80.f |= sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x2f: /* LD A,SRA (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { z80.f = (z80.a) & 0x01; (z80.a) = ( (z80.a) & 0x80 ) | ( (z80.a) >> 1 ); z80.f |= sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x30: /* LD B,SLL (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { z80.f = (z80.b) >> 7; (z80.b) = ( (z80.b) << 1 ) | 0x01; (z80.b) &= 0xff; z80.f |= sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x31: /* LD C,SLL (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { z80.f = (z80.c) >> 7; (z80.c) = ( (z80.c) << 1 ) | 0x01; (z80.c) &= 0xff; z80.f |= sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x32: /* LD D,SLL (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { z80.f = (z80.d) >> 7; (z80.d) = ( (z80.d) << 1 ) | 0x01; (z80.d) &= 0xff; z80.f |= sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x33: /* LD E,SLL (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { z80.f = (z80.e) >> 7; (z80.e) = ( (z80.e) << 1 ) | 0x01; (z80.e) &= 0xff; z80.f |= sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x34: /* LD H,SLL (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { z80.f = (z80.h) >> 7; (z80.h) = ( (z80.h) << 1 ) | 0x01; (z80.h) &= 0xff; z80.f |= sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x35: /* LD L,SLL (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { z80.f = (z80.l) >> 7; (z80.l) = ( (z80.l) << 1 ) | 0x01; (z80.l) &= 0xff; z80.f |= sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x36: /* SLL (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { z80.f = (bytetemp) >> 7; (bytetemp) = ( (bytetemp) << 1 ) | 0x01; (bytetemp) &= 0xff; z80.f |= sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x37: /* LD A,SLL (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { z80.f = (z80.a) >> 7; (z80.a) = ( (z80.a) << 1 ) | 0x01; (z80.a) &= 0xff; z80.f |= sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x38: /* LD B,SRL (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { z80.f = (z80.b) & 0x01; (z80.b) >>= 1; z80.f |= sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x39: /* LD C,SRL (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { z80.f = (z80.c) & 0x01; (z80.c) >>= 1; z80.f |= sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x3a: /* LD D,SRL (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { z80.f = (z80.d) & 0x01; (z80.d) >>= 1; z80.f |= sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x3b: /* LD E,SRL (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { z80.f = (z80.e) & 0x01; (z80.e) >>= 1; z80.f |= sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x3c: /* LD H,SRL (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { z80.f = (z80.h) & 0x01; (z80.h) >>= 1; z80.f |= sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x3d: /* LD L,SRL (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { z80.f = (z80.l) & 0x01; (z80.l) >>= 1; z80.f |= sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x3e: /* SRL (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { z80.f = (bytetemp) & 0x01; (bytetemp) >>= 1; z80.f |= sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x3f: /* LD A,SRL (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { z80.f = (z80.a) & 0x01; (z80.a) >>= 1; z80.f |= sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x40:
    case 0x41:
    case 0x42:
    case 0x43:
    case 0x44:
    case 0x45:
    case 0x46:
    case 0x47: /* BIT 0,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (0) ) ) ) z80.f |= 0x04 | 0x40; if( (0) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x48:
    case 0x49:
    case 0x4a:
    case 0x4b:
    case 0x4c:
    case 0x4d:
    case 0x4e:
    case 0x4f: /* BIT 1,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (1) ) ) ) z80.f |= 0x04 | 0x40; if( (1) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x50:
    case 0x51:
    case 0x52:
    case 0x53:
    case 0x54:
    case 0x55:
    case 0x56:
    case 0x57: /* BIT 2,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (2) ) ) ) z80.f |= 0x04 | 0x40; if( (2) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x58:
    case 0x59:
    case 0x5a:
    case 0x5b:
    case 0x5c:
    case 0x5d:
    case 0x5e:
    case 0x5f: /* BIT 3,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (3) ) ) ) z80.f |= 0x04 | 0x40; if( (3) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x60:
    case 0x61:
    case 0x62:
    case 0x63:
    case 0x64:
    case 0x65:
    case 0x66:
    case 0x67: /* BIT 4,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (4) ) ) ) z80.f |= 0x04 | 0x40; if( (4) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x68:
    case 0x69:
    case 0x6a:
    case 0x6b:
    case 0x6c:
    case 0x6d:
    case 0x6e:
    case 0x6f: /* BIT 5,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (5) ) ) ) z80.f |= 0x04 | 0x40; if( (5) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x70:
    case 0x71:
    case 0x72:
    case 0x73:
    case 0x74:
    case 0x75:
    case 0x76:
    case 0x77: /* BIT 6,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (6) ) ) ) z80.f |= 0x04 | 0x40; if( (6) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x78:
    case 0x79:
    case 0x7a:
    case 0x7b:
    case 0x7c:
    case 0x7d:
    case 0x7e:
    case 0x7f: /* BIT 7,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (7) ) ) ) z80.f |= 0x04 | 0x40; if( (7) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x80: /* LD B,RES 0,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0xfe;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x81: /* LD C,RES 0,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0xfe;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x82: /* LD D,RES 0,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0xfe;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x83: /* LD E,RES 0,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0xfe;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x84: /* LD H,RES 0,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0xfe;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x85: /* LD L,RES 0,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0xfe;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x86: /* RES 0,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0xfe);
      break;
    case 0x87: /* LD A,RES 0,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0xfe;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x88: /* LD B,RES 1,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0xfd;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x89: /* LD C,RES 1,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0xfd;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x8a: /* LD D,RES 1,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0xfd;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x8b: /* LD E,RES 1,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0xfd;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x8c: /* LD H,RES 1,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0xfd;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x8d: /* LD L,RES 1,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0xfd;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x8e: /* RES 1,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0xfd);
      break;
    case 0x8f: /* LD A,RES 1,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0xfd;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x90: /* LD B,RES 2,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0xfb;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x91: /* LD C,RES 2,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0xfb;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x92: /* LD D,RES 2,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0xfb;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x93: /* LD E,RES 2,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0xfb;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x94: /* LD H,RES 2,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0xfb;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x95: /* LD L,RES 2,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0xfb;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x96: /* RES 2,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0xfb);
      break;
    case 0x97: /* LD A,RES 2,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0xfb;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x98: /* LD B,RES 3,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0xf7;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x99: /* LD C,RES 3,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0xf7;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x9a: /* LD D,RES 3,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0xf7;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x9b: /* LD E,RES 3,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0xf7;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x9c: /* LD H,RES 3,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0xf7;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x9d: /* LD L,RES 3,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0xf7;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x9e: /* RES 3,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0xf7);
      break;
    case 0x9f: /* LD A,RES 3,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0xf7;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xa0: /* LD B,RES 4,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0xef;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xa1: /* LD C,RES 4,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0xef;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xa2: /* LD D,RES 4,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0xef;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xa3: /* LD E,RES 4,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0xef;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xa4: /* LD H,RES 4,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0xef;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xa5: /* LD L,RES 4,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0xef;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xa6: /* RES 4,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0xef);
      break;
    case 0xa7: /* LD A,RES 4,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0xef;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xa8: /* LD B,RES 5,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0xdf;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xa9: /* LD C,RES 5,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0xdf;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xaa: /* LD D,RES 5,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0xdf;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xab: /* LD E,RES 5,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0xdf;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xac: /* LD H,RES 5,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0xdf;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xad: /* LD L,RES 5,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0xdf;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xae: /* RES 5,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0xdf);
      break;
    case 0xaf: /* LD A,RES 5,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0xdf;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xb0: /* LD B,RES 6,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0xbf;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xb1: /* LD C,RES 6,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0xbf;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xb2: /* LD D,RES 6,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0xbf;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xb3: /* LD E,RES 6,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0xbf;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xb4: /* LD H,RES 6,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0xbf;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xb5: /* LD L,RES 6,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0xbf;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xb6: /* RES 6,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0xbf);
      break;
    case 0xb7: /* LD A,RES 6,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0xbf;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xb8: /* LD B,RES 7,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0x7f;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xb9: /* LD C,RES 7,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0x7f;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xba: /* LD D,RES 7,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0x7f;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xbb: /* LD E,RES 7,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0x7f;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xbc: /* LD H,RES 7,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0x7f;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xbd: /* LD L,RES 7,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0x7f;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xbe: /* RES 7,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0x7f);
      break;
    case 0xbf: /* LD A,RES 7,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0x7f;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xc0: /* LD B,SET 0,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x01;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xc1: /* LD C,SET 0,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x01;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xc2: /* LD D,SET 0,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x01;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xc3: /* LD E,SET 0,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x01;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xc4: /* LD H,SET 0,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x01;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xc5: /* LD L,SET 0,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x01;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xc6: /* SET 0,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x01);
      break;
    case 0xc7: /* LD A,SET 0,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x01;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xc8: /* LD B,SET 1,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x02;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xc9: /* LD C,SET 1,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x02;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xca: /* LD D,SET 1,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x02;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xcb: /* LD E,SET 1,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x02;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xcc: /* LD H,SET 1,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x02;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xcd: /* LD L,SET 1,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x02;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xce: /* SET 1,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x02);
      break;
    case 0xcf: /* LD A,SET 1,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x02;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xd0: /* LD B,SET 2,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x04;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xd1: /* LD C,SET 2,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x04;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xd2: /* LD D,SET 2,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x04;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xd3: /* LD E,SET 2,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x04;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xd4: /* LD H,SET 2,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x04;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xd5: /* LD L,SET 2,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x04;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xd6: /* SET 2,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x04);
      break;
    case 0xd7: /* LD A,SET 2,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x04;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xd8: /* LD B,SET 3,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x08;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xd9: /* LD C,SET 3,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x08;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xda: /* LD D,SET 3,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x08;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xdb: /* LD E,SET 3,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x08;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xdc: /* LD H,SET 3,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x08;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xdd: /* LD L,SET 3,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x08;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xde: /* SET 3,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x08);
      break;
    case 0xdf: /* LD A,SET 3,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x08;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xe0: /* LD B,SET 4,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x10;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xe1: /* LD C,SET 4,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x10;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xe2: /* LD D,SET 4,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x10;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xe3: /* LD E,SET 4,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x10;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xe4: /* LD H,SET 4,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x10;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xe5: /* LD L,SET 4,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x10;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xe6: /* SET 4,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x10);
      break;
    case 0xe7: /* LD A,SET 4,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x10;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xe8: /* LD B,SET 5,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x20;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xe9: /* LD C,SET 5,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x20;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xea: /* LD D,SET 5,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x20;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xeb: /* LD E,SET 5,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x20;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xec: /* LD H,SET 5,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x20;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xed: /* LD L,SET 5,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x20;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xee: /* SET 5,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x20);
      break;
    case 0xef: /* LD A,SET 5,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x20;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xf0: /* LD B,SET 6,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x40;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xf1: /* LD C,SET 6,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x40;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xf2: /* LD D,SET 6,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x40;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xf3: /* LD E,SET 6,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x40;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xf4: /* LD H,SET 6,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x40;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xf5: /* LD L,SET 6,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x40;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xf6: /* SET 6,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x40);
      break;
    case 0xf7: /* LD A,SET 6,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x40;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xf8: /* LD B,SET 7,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x80;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xf9: /* LD C,SET 7,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x80;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xfa: /* LD D,SET 7,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x80;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xfb: /* LD E,SET 7,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x80;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xfc: /* LD H,SET 7,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x80;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xfd: /* LD L,SET 7,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x80;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xfe: /* SET 7,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x80);
      break;
    case 0xff: /* LD A,SET 7,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x80;
      writebyte_internal(tempaddr, z80.a);
      break;
 }
      }
      break;
    case 0xe1: /* POP REGISTER */
      { tstates += (3);; (z80.ixl)=readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; (z80.ixh)=readbyte_internal(z80.sp++); z80.sp &= 0xffff;};
      break;
    case 0xe3: /* EX (SP),REGISTER */
      {
 var bytetempl = readbyte_internal( z80.sp ),
                  bytetemph = readbyte_internal( z80.sp + 1 );
 tstates += (3);; tstates += (4);;
 tstates += (3);; tstates += (5);;
 writebyte_internal(z80.sp+1,z80.ixh); writebyte_internal(z80.sp,z80.ixl);
 z80.ixl=bytetempl; z80.ixh=bytetemph;
      }
      break;
    case 0xe5: /* PUSH REGISTER */
      tstates++;
      { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.ixh)); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.ixl));};
      break;
    case 0xe9: /* JP REGISTER */
      z80.pc=(z80.ixl | (z80.ixh << 8)); /* NB: NOT INDIRECT! */
      break;
    case 0xf9: /* LD SP,REGISTER */
      tstates += 2;
      z80.sp=(z80.ixl | (z80.ixh << 8));
      break;
    default: /* Instruction did not involve H or L, so backtrack
               one instruction and parse again */
      z80.pc--; /* FIXME: will be contended again */
      z80.pc &= 0xffff;
      z80.r--; /* Decrement the R register as well */
      z80.r &= 0x7f;
      break;
 }
      }
      break;
    case 0xde: /* SBC A,nn */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( z80.pc++ );
 { var sbctemp = z80.a - (bytetemp) - ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( sbctemp & 0x88 ) >> 1 ); z80.a=sbctemp & 0xff; z80.f = ( sbctemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0xdf: /* RST 18 */
      tstates++;
      { { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; z80.pc=(0x18);};
      break;
    case 0xe0: /* RET PO */
      tstates++;
      if( ! ( z80.f & 0x04 ) ) { { { tstates += (3);; var lowbyte =readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; var highbyte=readbyte_internal(z80.sp++); z80.sp &= 0xffff; (z80.pc) = lowbyte | (highbyte << 8);};}; }
      break;
    case 0xe1: /* POP HL */
      { tstates += (3);; (z80.l)=readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; (z80.h)=readbyte_internal(z80.sp++); z80.sp &= 0xffff;};
      break;
    case 0xe2: /* JP PO,nnnn */
      tstates += (3);; tstates += (3);;
      if( ! ( z80.f & 0x04 ) ) { { var jptemp=z80.pc; var pcl =readbyte_internal(jptemp++); jptemp &= 0xffff; var pch =readbyte_internal(jptemp); z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xe3: /* EX (SP),HL */
      {
 var bytetempl = readbyte_internal( z80.sp ),
                  bytetemph = readbyte_internal( z80.sp + 1 );
 tstates += (3);; tstates += (4);;
 tstates += (3);; tstates += (5);;
 writebyte_internal(z80.sp+1,z80.h); writebyte_internal(z80.sp,z80.l);
 z80.l=bytetempl; z80.h=bytetemph;
      }
      break;
    case 0xe4: /* CALL PO,nnnn */
      tstates += (3);; tstates += (3);;
      if( ! ( z80.f & 0x04 ) ) { { var calltempl, calltemph; calltempl=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (1);; calltemph=readbyte_internal(z80.pc++); z80.pc &= 0xffff; { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; var pcl=calltempl; var pch=calltemph; z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xe5: /* PUSH HL */
      tstates++;
      { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.h)); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.l));};
      break;
    case 0xe6: /* AND nn */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( z80.pc++ );
 { z80.a &= (bytetemp); z80.f = 0x10 | sz53p_table[z80.a];};
      }
      break;
    case 0xe7: /* RST 20 */
      tstates++;
      { { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; z80.pc=(0x20);};
      break;
    case 0xe8: /* RET PE */
      tstates++;
      if( z80.f & 0x04 ) { { { tstates += (3);; var lowbyte =readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; var highbyte=readbyte_internal(z80.sp++); z80.sp &= 0xffff; (z80.pc) = lowbyte | (highbyte << 8);};}; }
      break;
    case 0xe9: /* JP HL */
      z80.pc=(z80.l | (z80.h << 8)); /* NB: NOT INDIRECT! */
      break;
    case 0xea: /* JP PE,nnnn */
      tstates += (3);; tstates += (3);;
      if( z80.f & 0x04 ) { { var jptemp=z80.pc; var pcl =readbyte_internal(jptemp++); jptemp &= 0xffff; var pch =readbyte_internal(jptemp); z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xeb: /* EX DE,HL */
      {
 var bytetemp;
 bytetemp = z80.d; z80.d = z80.h; z80.h = bytetemp;
 bytetemp = z80.e; z80.e = z80.l; z80.l = bytetemp;
      }
      break;
    case 0xec: /* CALL PE,nnnn */
      tstates += (3);; tstates += (3);;
      if( z80.f & 0x04 ) { { var calltempl, calltemph; calltempl=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (1);; calltemph=readbyte_internal(z80.pc++); z80.pc &= 0xffff; { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; var pcl=calltempl; var pch=calltemph; z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xed: /* shift ED */
      {
 var opcode2;
 tstates += (4);;
 opcode2 = readbyte_internal( z80.pc++ );
 z80.pc &= 0xffff;
 z80.r = (z80.r+1) & 0x7f;
 switch(opcode2) {
/* opcodes_ed.c: Z80 CBxx opcodes
   Copyright (c) 1999-2008 Philip Kendall, Matthew Westcott

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Contact details: <matthew@west.co.tt>
    Matthew Westcott, 14 Daisy Hill Drive, Adlington, Chorley, Lancs PR6 9NE UNITED KINGDOM

*/
/* NB: this file is autogenerated by 'z80.pl' from 'opcodes_ed.dat',
   and included in 'z80_ops.jscpp' */
    case 0x40: /* IN B,(C) */
      tstates += 1;
      { tstates += (3);; (z80.b)=readport(((z80.c | (z80.b << 8)))); z80.f = ( z80.f & 0x01) | sz53p_table[(z80.b)];};
      break;
    case 0x41: /* OUT (C),B */
      tstates += 1;
      { tstates += (3);; writeport((z80.c | (z80.b << 8)),z80.b);};
      break;
    case 0x42: /* SBC HL,BC */
      tstates += 7;
      { var sub16temp = (z80.l | (z80.h << 8)) - ((z80.c | (z80.b << 8))) - (z80.f & 0x01); var lookup = ( ( (z80.l | (z80.h << 8)) & 0x8800 ) >> 11 ) | ( ( ((z80.c | (z80.b << 8))) & 0x8800 ) >> 10 ) | ( ( sub16temp & 0x8800 ) >> 9 ); z80.h = (sub16temp >> 8) & 0xff; z80.l = sub16temp & 0xff; z80.f = ( sub16temp & 0x10000 ? 0x01 : 0 ) | 0x02 | overflow_sub_table[lookup >> 4] | ( z80.h & ( 0x08 | 0x20 | 0x80 ) ) | halfcarry_sub_table[lookup&0x07] | ( (z80.l | (z80.h << 8)) ? 0 : 0x40) ;};
      break;
    case 0x43: /* LD (nnnn),BC */
      { var ldtemp; tstates += (3);; ldtemp=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (3);; ldtemp|=readbyte_internal(z80.pc++) << 8; z80.pc &= 0xffff; tstates += (3);; writebyte_internal(ldtemp++,(z80.c)); ldtemp &= 0xffff; tstates += (3);; writebyte_internal(ldtemp,(z80.b)); break;};
      break;
    case 0x44:
    case 0x4c:
    case 0x54:
    case 0x5c:
    case 0x64:
    case 0x6c:
    case 0x74:
    case 0x7c: /* NEG */
      {
 var bytetemp=z80.a;
 z80.a=0;
 { var subtemp = z80.a - (bytetemp); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0x45:
    case 0x4d:
    case 0x55:
    case 0x5d:
    case 0x65:
    case 0x6d:
    case 0x75:
    case 0x7d: /* RETN */
      z80.iff1=z80.iff2;
      { { tstates += (3);; var lowbyte =readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; var highbyte=readbyte_internal(z80.sp++); z80.sp &= 0xffff; (z80.pc) = lowbyte | (highbyte << 8);};};
      break;
    case 0x46:
    case 0x4e:
    case 0x66:
    case 0x6e: /* IM 0 */
      z80.im=0;
      break;
    case 0x47: /* LD I,A */
      tstates += 1;
      z80.i=z80.a;
      break;
    case 0x48: /* IN C,(C) */
      tstates += 1;
      { tstates += (3);; (z80.c)=readport(((z80.c | (z80.b << 8)))); z80.f = ( z80.f & 0x01) | sz53p_table[(z80.c)];};
      break;
    case 0x49: /* OUT (C),C */
      tstates += 1;
      { tstates += (3);; writeport((z80.c | (z80.b << 8)),z80.c);};
      break;
    case 0x4a: /* ADC HL,BC */
      tstates += 7;
      { var add16temp= (z80.l | (z80.h << 8)) + ((z80.c | (z80.b << 8))) + ( z80.f & 0x01 ); var lookup = ( ( (z80.l | (z80.h << 8)) & 0x8800 ) >> 11 ) | ( ( ((z80.c | (z80.b << 8))) & 0x8800 ) >> 10 ) | ( ( add16temp & 0x8800 ) >> 9 ); z80.h = (add16temp >> 8) & 0xff; z80.l = add16temp & 0xff; z80.f = ( add16temp & 0x10000 ? 0x01 : 0 )| overflow_add_table[lookup >> 4] | ( z80.h & ( 0x08 | 0x20 | 0x80 ) ) | halfcarry_add_table[lookup&0x07]| ( (z80.l | (z80.h << 8)) ? 0 : 0x40 );};
      break;
    case 0x4b: /* LD BC,(nnnn) */
      { var ldtemp; tstates += (3);; ldtemp=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (3);; ldtemp|=readbyte_internal(z80.pc++) << 8; z80.pc &= 0xffff; tstates += (3);; (z80.c)=readbyte_internal(ldtemp++); ldtemp &= 0xffff; tstates += (3);; (z80.b)=readbyte_internal(ldtemp); break;};
      break;
    case 0x4f: /* LD R,A */
      tstates += 1;
      /* Keep the RZX instruction counter right */
      /* rzx_instructions_offset += ( R - A ); */
      z80.r=z80.r7=z80.a;
      break;
    case 0x50: /* IN D,(C) */
      tstates += 1;
      { tstates += (3);; (z80.d)=readport(((z80.c | (z80.b << 8)))); z80.f = ( z80.f & 0x01) | sz53p_table[(z80.d)];};
      break;
    case 0x51: /* OUT (C),D */
      tstates += 1;
      { tstates += (3);; writeport((z80.c | (z80.b << 8)),z80.d);};
      break;
    case 0x52: /* SBC HL,DE */
      tstates += 7;
      { var sub16temp = (z80.l | (z80.h << 8)) - ((z80.e | (z80.d << 8))) - (z80.f & 0x01); var lookup = ( ( (z80.l | (z80.h << 8)) & 0x8800 ) >> 11 ) | ( ( ((z80.e | (z80.d << 8))) & 0x8800 ) >> 10 ) | ( ( sub16temp & 0x8800 ) >> 9 ); z80.h = (sub16temp >> 8) & 0xff; z80.l = sub16temp & 0xff; z80.f = ( sub16temp & 0x10000 ? 0x01 : 0 ) | 0x02 | overflow_sub_table[lookup >> 4] | ( z80.h & ( 0x08 | 0x20 | 0x80 ) ) | halfcarry_sub_table[lookup&0x07] | ( (z80.l | (z80.h << 8)) ? 0 : 0x40) ;};
      break;
    case 0x53: /* LD (nnnn),DE */
      { var ldtemp; tstates += (3);; ldtemp=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (3);; ldtemp|=readbyte_internal(z80.pc++) << 8; z80.pc &= 0xffff; tstates += (3);; writebyte_internal(ldtemp++,(z80.e)); ldtemp &= 0xffff; tstates += (3);; writebyte_internal(ldtemp,(z80.d)); break;};
      break;
    case 0x56:
    case 0x76: /* IM 1 */
      z80.im=1;
      break;
    case 0x57: /* LD A,I */
      tstates += 1;
      z80.a=z80.i;
      z80.f = ( z80.f & 0x01 ) | sz53_table[z80.a] | ( z80.iff2 ? 0x04 : 0 );
      break;
    case 0x58: /* IN E,(C) */
      tstates += 1;
      { tstates += (3);; (z80.e)=readport(((z80.c | (z80.b << 8)))); z80.f = ( z80.f & 0x01) | sz53p_table[(z80.e)];};
      break;
    case 0x59: /* OUT (C),E */
      tstates += 1;
      { tstates += (3);; writeport((z80.c | (z80.b << 8)),z80.e);};
      break;
    case 0x5a: /* ADC HL,DE */
      tstates += 7;
      { var add16temp= (z80.l | (z80.h << 8)) + ((z80.e | (z80.d << 8))) + ( z80.f & 0x01 ); var lookup = ( ( (z80.l | (z80.h << 8)) & 0x8800 ) >> 11 ) | ( ( ((z80.e | (z80.d << 8))) & 0x8800 ) >> 10 ) | ( ( add16temp & 0x8800 ) >> 9 ); z80.h = (add16temp >> 8) & 0xff; z80.l = add16temp & 0xff; z80.f = ( add16temp & 0x10000 ? 0x01 : 0 )| overflow_add_table[lookup >> 4] | ( z80.h & ( 0x08 | 0x20 | 0x80 ) ) | halfcarry_add_table[lookup&0x07]| ( (z80.l | (z80.h << 8)) ? 0 : 0x40 );};
      break;
    case 0x5b: /* LD DE,(nnnn) */
      { var ldtemp; tstates += (3);; ldtemp=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (3);; ldtemp|=readbyte_internal(z80.pc++) << 8; z80.pc &= 0xffff; tstates += (3);; (z80.e)=readbyte_internal(ldtemp++); ldtemp &= 0xffff; tstates += (3);; (z80.d)=readbyte_internal(ldtemp); break;};
      break;
    case 0x5e:
    case 0x7e: /* IM 2 */
      z80.im=2;
      break;
    case 0x5f: /* LD A,R */
      tstates += 1;
      z80.a=(z80.r&0x7f) | (z80.r7&0x80);
      z80.f = ( z80.f & 0x01 ) | sz53_table[z80.a] | ( z80.iff2 ? 0x04 : 0 );
      break;
    case 0x60: /* IN H,(C) */
      tstates += 1;
      { tstates += (3);; (z80.h)=readport(((z80.c | (z80.b << 8)))); z80.f = ( z80.f & 0x01) | sz53p_table[(z80.h)];};
      break;
    case 0x61: /* OUT (C),H */
      tstates += 1;
      { tstates += (3);; writeport((z80.c | (z80.b << 8)),z80.h);};
      break;
    case 0x62: /* SBC HL,HL */
      tstates += 7;
      { var sub16temp = (z80.l | (z80.h << 8)) - ((z80.l | (z80.h << 8))) - (z80.f & 0x01); var lookup = ( ( (z80.l | (z80.h << 8)) & 0x8800 ) >> 11 ) | ( ( ((z80.l | (z80.h << 8))) & 0x8800 ) >> 10 ) | ( ( sub16temp & 0x8800 ) >> 9 ); z80.h = (sub16temp >> 8) & 0xff; z80.l = sub16temp & 0xff; z80.f = ( sub16temp & 0x10000 ? 0x01 : 0 ) | 0x02 | overflow_sub_table[lookup >> 4] | ( z80.h & ( 0x08 | 0x20 | 0x80 ) ) | halfcarry_sub_table[lookup&0x07] | ( (z80.l | (z80.h << 8)) ? 0 : 0x40) ;};
      break;
    case 0x63: /* LD (nnnn),HL */
      { var ldtemp; tstates += (3);; ldtemp=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (3);; ldtemp|=readbyte_internal(z80.pc++) << 8; z80.pc &= 0xffff; tstates += (3);; writebyte_internal(ldtemp++,(z80.l)); ldtemp &= 0xffff; tstates += (3);; writebyte_internal(ldtemp,(z80.h)); break;};
      break;
    case 0x67: /* RRD */
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates += (7);; tstates += (3);;
 writebyte_internal((z80.l | (z80.h << 8)), ( (z80.a & 0x0f) << 4 ) | ( bytetemp >> 4 ) );
 z80.a = ( z80.a & 0xf0 ) | ( bytetemp & 0x0f );
 z80.f = ( z80.f & 0x01 ) | sz53p_table[z80.a];
      }
      break;
    case 0x68: /* IN L,(C) */
      tstates += 1;
      { tstates += (3);; (z80.l)=readport(((z80.c | (z80.b << 8)))); z80.f = ( z80.f & 0x01) | sz53p_table[(z80.l)];};
      break;
    case 0x69: /* OUT (C),L */
      tstates += 1;
      { tstates += (3);; writeport((z80.c | (z80.b << 8)),z80.l);};
      break;
    case 0x6a: /* ADC HL,HL */
      tstates += 7;
      { var add16temp= (z80.l | (z80.h << 8)) + ((z80.l | (z80.h << 8))) + ( z80.f & 0x01 ); var lookup = ( ( (z80.l | (z80.h << 8)) & 0x8800 ) >> 11 ) | ( ( ((z80.l | (z80.h << 8))) & 0x8800 ) >> 10 ) | ( ( add16temp & 0x8800 ) >> 9 ); z80.h = (add16temp >> 8) & 0xff; z80.l = add16temp & 0xff; z80.f = ( add16temp & 0x10000 ? 0x01 : 0 )| overflow_add_table[lookup >> 4] | ( z80.h & ( 0x08 | 0x20 | 0x80 ) ) | halfcarry_add_table[lookup&0x07]| ( (z80.l | (z80.h << 8)) ? 0 : 0x40 );};
      break;
    case 0x6b: /* LD HL,(nnnn) */
      { var ldtemp; tstates += (3);; ldtemp=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (3);; ldtemp|=readbyte_internal(z80.pc++) << 8; z80.pc &= 0xffff; tstates += (3);; (z80.l)=readbyte_internal(ldtemp++); ldtemp &= 0xffff; tstates += (3);; (z80.h)=readbyte_internal(ldtemp); break;};
      break;
    case 0x6f: /* RLD */
      {
 var bytetemp = readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates += (7);; tstates += (3);;
 writebyte_internal((z80.l | (z80.h << 8)), ((bytetemp & 0x0f) << 4 ) | ( z80.a & 0x0f ) );
 z80.a = ( z80.a & 0xf0 ) | ( bytetemp >> 4 );
 z80.f = ( z80.f & 0x01 ) | sz53p_table[z80.a];
      }
      break;
    case 0x70: /* IN F,(C) */
      tstates += 1;
      {
 var bytetemp;
 { tstates += (3);; (bytetemp)=readport(((z80.c | (z80.b << 8)))); z80.f = ( z80.f & 0x01) | sz53p_table[(bytetemp)];};
      }
      break;
    case 0x71: /* OUT (C),0 */
      tstates += 1;
      { tstates += (3);; writeport((z80.c | (z80.b << 8)),0);};
      break;
    case 0x72: /* SBC HL,SP */
      tstates += 7;
      { var sub16temp = (z80.l | (z80.h << 8)) - (z80.sp) - (z80.f & 0x01); var lookup = ( ( (z80.l | (z80.h << 8)) & 0x8800 ) >> 11 ) | ( ( (z80.sp) & 0x8800 ) >> 10 ) | ( ( sub16temp & 0x8800 ) >> 9 ); z80.h = (sub16temp >> 8) & 0xff; z80.l = sub16temp & 0xff; z80.f = ( sub16temp & 0x10000 ? 0x01 : 0 ) | 0x02 | overflow_sub_table[lookup >> 4] | ( z80.h & ( 0x08 | 0x20 | 0x80 ) ) | halfcarry_sub_table[lookup&0x07] | ( (z80.l | (z80.h << 8)) ? 0 : 0x40) ;};
      break;
    case 0x73: /* LD (nnnn),SP */
      { var ldtemp; tstates += (3);; ldtemp=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (3);; ldtemp|=readbyte_internal(z80.pc++) << 8; z80.pc &= 0xffff; tstates += (3);; writebyte_internal(ldtemp++,((z80.sp & 0xff))); ldtemp &= 0xffff; tstates += (3);; writebyte_internal(ldtemp,((z80.sp >> 8))); break;};
      break;
    case 0x78: /* IN A,(C) */
      tstates += 1;
      { tstates += (3);; (z80.a)=readport(((z80.c | (z80.b << 8)))); z80.f = ( z80.f & 0x01) | sz53p_table[(z80.a)];};
      break;
    case 0x79: /* OUT (C),A */
      tstates += 1;
      { tstates += (3);; writeport((z80.c | (z80.b << 8)),z80.a);};
      break;
    case 0x7a: /* ADC HL,SP */
      tstates += 7;
      { var add16temp= (z80.l | (z80.h << 8)) + (z80.sp) + ( z80.f & 0x01 ); var lookup = ( ( (z80.l | (z80.h << 8)) & 0x8800 ) >> 11 ) | ( ( (z80.sp) & 0x8800 ) >> 10 ) | ( ( add16temp & 0x8800 ) >> 9 ); z80.h = (add16temp >> 8) & 0xff; z80.l = add16temp & 0xff; z80.f = ( add16temp & 0x10000 ? 0x01 : 0 )| overflow_add_table[lookup >> 4] | ( z80.h & ( 0x08 | 0x20 | 0x80 ) ) | halfcarry_add_table[lookup&0x07]| ( (z80.l | (z80.h << 8)) ? 0 : 0x40 );};
      break;
    case 0x7b: /* LD SP,(nnnn) */
      { var ldtemp; tstates += (3);; ldtemp=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (3);; ldtemp|=readbyte_internal(z80.pc++) << 8; z80.pc &= 0xffff; tstates += (3);; var regl = readbyte_internal(ldtemp++); ldtemp &= 0xffff; tstates += (3);; var regh =readbyte_internal(ldtemp); z80.sp = regl | (regh << 8); break;};
      break;
    case 0xa0: /* LDI */
      {
 var bytetemp=readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates += (3);; tstates += (3);; tstates += (1);; tstates += (1);;
 var bctemp = ((z80.c | (z80.b << 8)) - 1) & 0xffff; z80.b = bctemp >> 8; z80.c = bctemp & 0xff;
 writebyte_internal((z80.e | (z80.d << 8)),bytetemp);
 var detemp = ((z80.e | (z80.d << 8)) + 1) & 0xffff; z80.d = detemp >> 8; z80.e = detemp & 0xff;
 var hltemp = ((z80.l | (z80.h << 8)) + 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 bytetemp = (bytetemp + z80.a) & 0xff;
 z80.f = ( z80.f & ( 0x01 | 0x40 | 0x80 ) ) | ( (z80.c | (z80.b << 8)) ? 0x04 : 0 ) |
   ( bytetemp & 0x08 ) | ( (bytetemp & 0x02) ? 0x20 : 0 );
      }
      break;
    case 0xa1: /* CPI */
      {
 var value = readbyte_internal( (z80.l | (z80.h << 8)) ), bytetemp = (z80.a - value) & 0xff,
   lookup = ( ( z80.a & 0x08 ) >> 3 ) |
            ( ( (value) & 0x08 ) >> 2 ) |
            ( ( bytetemp & 0x08 ) >> 1 );
 tstates += (3);; tstates += (1);; tstates += (1);; tstates += (1);;
 tstates += (1);; tstates += (1);;
 var hltemp = ((z80.l | (z80.h << 8)) + 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 var bctemp = ((z80.c | (z80.b << 8)) - 1) & 0xffff; z80.b = bctemp >> 8; z80.c = bctemp & 0xff;
 z80.f = ( z80.f & 0x01 ) | ( (z80.c | (z80.b << 8)) ? ( 0x04 | 0x02 ) : 0x02 ) |
   halfcarry_sub_table[lookup] | ( bytetemp ? 0 : 0x40 ) |
   ( bytetemp & 0x80 );
 if(z80.f & 0x10) bytetemp--;
 z80.f |= ( bytetemp & 0x08 ) | ( (bytetemp&0x02) ? 0x20 : 0 );
      }
      break;
    case 0xa2: /* INI */
      {
 var initemp = readport( (z80.c | (z80.b << 8)) );
 tstates += 2; tstates += (3);; tstates += (3);;
 writebyte_internal((z80.l | (z80.h << 8)),initemp);
 z80.b = (z80.b-1)&0xff;
 var hltemp = ((z80.l | (z80.h << 8)) + 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 z80.f = (initemp & 0x80 ? 0x02 : 0 ) | sz53_table[z80.b];
 /* C,H and P/V flags not implemented */
      }
      break;
    case 0xa3: /* OUTI */
      {
 var outitemp=readbyte_internal( (z80.l | (z80.h << 8)) );
 z80.b = (z80.b-1)&0xff; /* This does happen first, despite what the specs say */
 tstates++; tstates += (4);; tstates += (3);;
 var hltemp = ((z80.l | (z80.h << 8)) + 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 writeport((z80.c | (z80.b << 8)),outitemp);
 z80.f = (outitemp & 0x80 ? 0x02 : 0 ) | sz53_table[z80.b];
 /* C,H and P/V flags not implemented */
      }
      break;
    case 0xa8: /* LDD */
      {
 var bytetemp=readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates += (3);; tstates += (3);; tstates += (1);; tstates += (1);;
 var bctemp = ((z80.c | (z80.b << 8)) - 1) & 0xffff; z80.b = bctemp >> 8; z80.c = bctemp & 0xff;
 writebyte_internal((z80.e | (z80.d << 8)),bytetemp);
 var detemp = ((z80.e | (z80.d << 8)) - 1) & 0xffff; z80.d = detemp >> 8; z80.e = detemp & 0xff;
 var hltemp = ((z80.l | (z80.h << 8)) - 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 bytetemp = (bytetemp + z80.a) & 0xff;
 z80.f = ( z80.f & ( 0x01 | 0x40 | 0x80 ) ) | ( (z80.c | (z80.b << 8)) ? 0x04 : 0 ) |
   ( bytetemp & 0x08 ) | ( (bytetemp & 0x02) ? 0x20 : 0 );
      }
      break;
    case 0xa9: /* CPD */
      {
 var value = readbyte_internal( (z80.l | (z80.h << 8)) ), bytetemp = (z80.a - value) & 0xff,
   lookup = ( ( z80.a & 0x08 ) >> 3 ) |
            ( ( (value) & 0x08 ) >> 2 ) |
            ( ( bytetemp & 0x08 ) >> 1 );
 tstates += (3);; tstates += (1);; tstates += (1);; tstates += (1);;
 tstates += (1);; tstates += (1);;
 var hltemp = ((z80.l | (z80.h << 8)) - 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 var bctemp = ((z80.c | (z80.b << 8)) - 1) & 0xffff; z80.b = bctemp >> 8; z80.c = bctemp & 0xff;
 z80.f = ( z80.f & 0x01 ) | ( (z80.c | (z80.b << 8)) ? ( 0x04 | 0x02 ) : 0x02 ) |
   halfcarry_sub_table[lookup] | ( bytetemp ? 0 : 0x40 ) |
   ( bytetemp & 0x80 );
 if(z80.f & 0x10) bytetemp--;
 z80.f |= ( bytetemp & 0x08 ) | ( (bytetemp&0x02) ? 0x20 : 0 );
      }
      break;
    case 0xaa: /* IND */
      {
 var initemp = readport( (z80.c | (z80.b << 8)) );
 tstates += 2; tstates += (3);; tstates += (3);;
 writebyte_internal((z80.l | (z80.h << 8)),initemp);
 z80.b = (z80.b-1)&0xff;
 var hltemp = ((z80.l | (z80.h << 8)) - 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 z80.f = (initemp & 0x80 ? 0x02 : 0 ) | sz53_table[z80.b];
 /* C,H and P/V flags not implemented */
      }
      break;
    case 0xab: /* OUTD */
      {
 var outitemp=readbyte_internal( (z80.l | (z80.h << 8)) );
 z80.b = (z80.b-1)&0xff; /* This does happen first, despite what the specs say */
 tstates++; tstates += (4);; tstates += (3);;
 var hltemp = ((z80.l | (z80.h << 8)) - 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 writeport((z80.c | (z80.b << 8)),outitemp);
 z80.f = (outitemp & 0x80 ? 0x02 : 0 ) | sz53_table[z80.b];
 /* C,H and P/V flags not implemented */
      }
      break;
    case 0xb0: /* LDIR */
      {
 var bytetemp=readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates += (3);; tstates += (3);; tstates += (1);; tstates += (1);;
 writebyte_internal((z80.e | (z80.d << 8)),bytetemp);
 var hltemp = ((z80.l | (z80.h << 8)) + 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 var detemp = ((z80.e | (z80.d << 8)) + 1) & 0xffff; z80.d = detemp >> 8; z80.e = detemp & 0xff;
 var bctemp = ((z80.c | (z80.b << 8)) - 1) & 0xffff; z80.b = bctemp >> 8; z80.c = bctemp & 0xff;
 bytetemp = (bytetemp + z80.a) & 0xff;
 z80.f = ( z80.f & ( 0x01 | 0x40 | 0x80 ) ) | ( (z80.c | (z80.b << 8)) ? 0x04 : 0 ) |
   ( bytetemp & 0x08 ) | ( (bytetemp & 0x02) ? 0x20 : 0 );
 if((z80.c | (z80.b << 8))) {
   tstates += (1);; tstates += (1);; tstates += (1);;
   tstates += (1);; tstates += (1);;
   z80.pc-=2;
 }
      }
      break;
    case 0xb1: /* CPIR */
      {
 var value = readbyte_internal( (z80.l | (z80.h << 8)) ), bytetemp = (z80.a - value) & 0xff,
   lookup = ( ( z80.a & 0x08 ) >> 3 ) |
     ( ( (value) & 0x08 ) >> 2 ) |
     ( ( bytetemp & 0x08 ) >> 1 );
 tstates += (3);; tstates += (1);; tstates += (1);; tstates += (1);;
 tstates += (1);; tstates += (1);;
 var hltemp = ((z80.l | (z80.h << 8)) + 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 var bctemp = ((z80.c | (z80.b << 8)) - 1) & 0xffff; z80.b = bctemp >> 8; z80.c = bctemp & 0xff;
 z80.f = ( z80.f & 0x01 ) | ( (z80.c | (z80.b << 8)) ? ( 0x04 | 0x02 ) : 0x02 ) |
   halfcarry_sub_table[lookup] | ( bytetemp ? 0 : 0x40 ) |
   ( bytetemp & 0x80 );
 if(z80.f & 0x10) bytetemp--;
 z80.f |= ( bytetemp & 0x08 ) | ( (bytetemp&0x02) ? 0x20 : 0 );
 if( ( z80.f & ( 0x04 | 0x40 ) ) == 0x04 ) {
   tstates += (1);; tstates += (1);; tstates += (1);;
   tstates += (1);; tstates += (1);;
   z80.pc-=2;
 }
      }
      break;
    case 0xb2: /* INIR */
      {
 var initemp=readport( (z80.c | (z80.b << 8)) );
 tstates += 2; tstates += (3);; tstates += (3);;
 writebyte_internal((z80.l | (z80.h << 8)),initemp);
 z80.b = (z80.b-1)&0xff;
 var hltemp = ((z80.l | (z80.h << 8)) + 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 z80.f = (initemp & 0x80 ? 0x02 : 0 ) | sz53_table[z80.b];
 /* C,H and P/V flags not implemented */
 if(z80.b) {
   tstates += (1);; tstates += (1);; tstates += (1);; tstates += (1);;
   tstates += (1);;
   z80.pc-=2;
 }
      }
      break;
    case 0xb3: /* OTIR */
      {
 var outitemp=readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates++; tstates += (4);;
 z80.b = (z80.b-1)&0xff;
 var hltemp = ((z80.l | (z80.h << 8)) + 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 /* This does happen first, despite what the specs say */
 writeport((z80.c | (z80.b << 8)),outitemp);
 z80.f = (outitemp & 0x80 ? 0x02 : 0 ) | sz53_table[z80.b];
 /* C,H and P/V flags not implemented */
 if(z80.b) {
   tstates += (1);;
   tstates += (1);; tstates += (1);; tstates += (1);;
   tstates += (1);; tstates += (1);; tstates += (1);;
   tstates += (1);;
   z80.pc-=2;
 } else {
   tstates += (3);;
 }
      }
      break;
    case 0xb8: /* LDDR */
      {
 var bytetemp=readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates += (3);; tstates += (3);; tstates += (1);; tstates += (1);;
 writebyte_internal((z80.e | (z80.d << 8)),bytetemp);
 var hltemp = ((z80.l | (z80.h << 8)) - 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 var detemp = ((z80.e | (z80.d << 8)) - 1) & 0xffff; z80.d = detemp >> 8; z80.e = detemp & 0xff;
 var bctemp = ((z80.c | (z80.b << 8)) - 1) & 0xffff; z80.b = bctemp >> 8; z80.c = bctemp & 0xff;
 bytetemp = (bytetemp + z80.a) & 0xff;
 z80.f = ( z80.f & ( 0x01 | 0x40 | 0x80 ) ) | ( (z80.c | (z80.b << 8)) ? 0x04 : 0 ) |
   ( bytetemp & 0x08 ) | ( (bytetemp & 0x02) ? 0x20 : 0 );
 if((z80.c | (z80.b << 8))) {
   tstates += (1);; tstates += (1);; tstates += (1);;
   tstates += (1);; tstates += (1);;
   z80.pc-=2;
 }
      }
      break;
    case 0xb9: /* CPDR */
      {
 var value = readbyte_internal( (z80.l | (z80.h << 8)) ), bytetemp = (z80.a - value) & 0xff,
   lookup = ( ( z80.a & 0x08 ) >> 3 ) |
     ( ( (value) & 0x08 ) >> 2 ) |
     ( ( bytetemp & 0x08 ) >> 1 );
 tstates += (3);; tstates += (1);; tstates += (1);; tstates += (1);;
 tstates += (1);; tstates += (1);;
 var hltemp = ((z80.l | (z80.h << 8)) - 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 var bctemp = ((z80.c | (z80.b << 8)) - 1) & 0xffff; z80.b = bctemp >> 8; z80.c = bctemp & 0xff;
 z80.f = ( z80.f & 0x01 ) | ( (z80.c | (z80.b << 8)) ? ( 0x04 | 0x02 ) : 0x02 ) |
   halfcarry_sub_table[lookup] | ( bytetemp ? 0 : 0x40 ) |
   ( bytetemp & 0x80 );
 if(z80.f & 0x10) bytetemp--;
 z80.f |= ( bytetemp & 0x08 ) | ( (bytetemp&0x02) ? 0x20 : 0 );
 if( ( z80.f & ( 0x04 | 0x40 ) ) == 0x04 ) {
   tstates += (1);; tstates += (1);; tstates += (1);;
   tstates += (1);; tstates += (1);;
   z80.pc-=2;
 }
      }
      break;
    case 0xba: /* INDR */
      {
 var initemp=readport( (z80.c | (z80.b << 8)) );
 tstates += 2; tstates += (3);; tstates += (3);;
 writebyte_internal((z80.l | (z80.h << 8)),initemp);
 z80.b = (z80.b-1)&0xff;
 var hltemp = ((z80.l | (z80.h << 8)) - 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 z80.f = (initemp & 0x80 ? 0x02 : 0 ) | sz53_table[z80.b];
 /* C,H and P/V flags not implemented */
 if(z80.b) {
   tstates += (1);; tstates += (1);; tstates += (1);; tstates += (1);;
   tstates += (1);;
   z80.pc-=2;
 }
      }
      break;
    case 0xbb: /* OTDR */
      {
 var outitemp=readbyte_internal( (z80.l | (z80.h << 8)) );
 tstates++; tstates += (4);;
 z80.b = (z80.b-1)&0xff;
 var hltemp = ((z80.l | (z80.h << 8)) - 1) & 0xffff; z80.h = hltemp >> 8; z80.l = hltemp & 0xff;
 /* This does happen first, despite what the specs say */
 writeport((z80.c | (z80.b << 8)),outitemp);
 z80.f = (outitemp & 0x80 ? 0x02 : 0 ) | sz53_table[z80.b];
 /* C,H and P/V flags not implemented */
 if(z80.b) {
   tstates += (1);;
   tstates += (1);; tstates += (1);; tstates += (1);;
   tstates += (1);; tstates += (1);; tstates += (1);;
   tstates += (1);;
   z80.pc-=2;
 } else {
   tstates += (3);;
 }
      }
      break;
    default: /* All other opcodes are NOPD */
      break;
 }
      }
      break;
    case 0xee: /* XOR A,nn */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( z80.pc++ );
 { z80.a ^= (bytetemp); z80.f = sz53p_table[z80.a];};
      }
      break;
    case 0xef: /* RST 28 */
      tstates++;
      { { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; z80.pc=(0x28);};
      break;
    case 0xf0: /* RET P */
      tstates++;
      if( ! ( z80.f & 0x80 ) ) { { { tstates += (3);; var lowbyte =readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; var highbyte=readbyte_internal(z80.sp++); z80.sp &= 0xffff; (z80.pc) = lowbyte | (highbyte << 8);};}; }
      break;
    case 0xf1: /* POP AF */
      { tstates += (3);; (z80.f)=readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; (z80.a)=readbyte_internal(z80.sp++); z80.sp &= 0xffff;};
      break;
    case 0xf2: /* JP P,nnnn */
      tstates += (3);; tstates += (3);;
      if( ! ( z80.f & 0x80 ) ) { { var jptemp=z80.pc; var pcl =readbyte_internal(jptemp++); jptemp &= 0xffff; var pch =readbyte_internal(jptemp); z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xf3: /* DI */
      z80.iff1=z80.iff2=0;
      break;
    case 0xf4: /* CALL P,nnnn */
      tstates += (3);; tstates += (3);;
      if( ! ( z80.f & 0x80 ) ) { { var calltempl, calltemph; calltempl=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (1);; calltemph=readbyte_internal(z80.pc++); z80.pc &= 0xffff; { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; var pcl=calltempl; var pch=calltemph; z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xf5: /* PUSH AF */
      tstates++;
      { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.a)); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.f));};
      break;
    case 0xf6: /* OR nn */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( z80.pc++ );
 { z80.a |= (bytetemp); z80.f = sz53p_table[z80.a];};
      }
      break;
    case 0xf7: /* RST 30 */
      tstates++;
      { { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; z80.pc=(0x30);};
      break;
    case 0xf8: /* RET M */
      tstates++;
      if( z80.f & 0x80 ) { { { tstates += (3);; var lowbyte =readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; var highbyte=readbyte_internal(z80.sp++); z80.sp &= 0xffff; (z80.pc) = lowbyte | (highbyte << 8);};}; }
      break;
    case 0xf9: /* LD SP,HL */
      tstates += 2;
      z80.sp=(z80.l | (z80.h << 8));
      break;
    case 0xfa: /* JP M,nnnn */
      tstates += (3);; tstates += (3);;
      if( z80.f & 0x80 ) { { var jptemp=z80.pc; var pcl =readbyte_internal(jptemp++); jptemp &= 0xffff; var pch =readbyte_internal(jptemp); z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xfb: /* EI */
      z80.iff1=z80.iff2=1;
      break;
    case 0xfc: /* CALL M,nnnn */
      tstates += (3);; tstates += (3);;
      if( z80.f & 0x80 ) { { var calltempl, calltemph; calltempl=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (1);; calltemph=readbyte_internal(z80.pc++); z80.pc &= 0xffff; { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; var pcl=calltempl; var pch=calltemph; z80.pc = pcl | (pch << 8);}; }
      else z80.pc+=2;
      break;
    case 0xfd: /* shift FD */
      {
 var opcode2;
 tstates += (4);;
 opcode2 = readbyte_internal( z80.pc++ );
 z80.pc &= 0xffff;
 z80.r = (z80.r+1) & 0x7f;
 switch(opcode2) {
/* opcodes_ddfd.c Z80 {DD,FD}xx opcodes
   Copyright (c) 1999-2008 Philip Kendall, Matthew Westcott

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Contact details: <matthew@west.co.tt>
    Matthew Westcott, 14 Daisy Hill Drive, Adlington, Chorley, Lancs PR6 9NE UNITED KINGDOM

*/
/* NB: this file is autogenerated by 'z80.pl' from 'opcodes_ddfd.dat',
   and included in 'z80_ops.jscpp' */
    case 0x09: /* ADD REGISTER,BC */
      { var add16temp = ((z80.iyl | (z80.iyh << 8))) + ((z80.c | (z80.b << 8))); var lookup = ( ( ((z80.iyl | (z80.iyh << 8))) & 0x0800 ) >> 11 ) | ( ( ((z80.c | (z80.b << 8))) & 0x0800 ) >> 10 ) | ( ( add16temp & 0x0800 ) >> 9 ); tstates += 7; (z80.iyh) = (add16temp >> 8) & 0xff; (z80.iyl) = add16temp & 0xff; z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) | ( add16temp & 0x10000 ? 0x01 : 0 )| ( ( add16temp >> 8 ) & ( 0x08 | 0x20 ) ) | halfcarry_add_table[lookup];};
      break;
    case 0x19: /* ADD REGISTER,DE */
      { var add16temp = ((z80.iyl | (z80.iyh << 8))) + ((z80.e | (z80.d << 8))); var lookup = ( ( ((z80.iyl | (z80.iyh << 8))) & 0x0800 ) >> 11 ) | ( ( ((z80.e | (z80.d << 8))) & 0x0800 ) >> 10 ) | ( ( add16temp & 0x0800 ) >> 9 ); tstates += 7; (z80.iyh) = (add16temp >> 8) & 0xff; (z80.iyl) = add16temp & 0xff; z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) | ( add16temp & 0x10000 ? 0x01 : 0 )| ( ( add16temp >> 8 ) & ( 0x08 | 0x20 ) ) | halfcarry_add_table[lookup];};
      break;
    case 0x21: /* LD REGISTER,nnnn */
      tstates += (3);;
      z80.iyl=readbyte_internal(z80.pc++);
      z80.pc &= 0xffff;
      tstates += (3);;
      z80.iyh=readbyte_internal(z80.pc++);
      z80.pc &= 0xffff;
      break;
    case 0x22: /* LD (nnnn),REGISTER */
      { var ldtemp; tstates += (3);; ldtemp=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (3);; ldtemp|=readbyte_internal(z80.pc++) << 8; z80.pc &= 0xffff; tstates += (3);; writebyte_internal(ldtemp++,(z80.iyl)); ldtemp &= 0xffff; tstates += (3);; writebyte_internal(ldtemp,(z80.iyh)); break;};
      break;
    case 0x23: /* INC REGISTER */
      tstates += 2;
      var wordtemp = ((z80.iyl | (z80.iyh << 8)) + 1) & 0xffff;
      z80.iyh = wordtemp >> 8;
      z80.iyl = wordtemp & 0xff;
      break;
    case 0x24: /* INC REGISTERH */
      { (z80.iyh) = ((z80.iyh) + 1) & 0xff; z80.f = ( z80.f & 0x01 ) | ( (z80.iyh)==0x80 ? 0x04 : 0 ) | ( (z80.iyh)&0x0f ? 0 : 0x10 ) | sz53_table[(z80.iyh)];};
      break;
    case 0x25: /* DEC REGISTERH */
      { z80.f = ( z80.f & 0x01 ) | ( (z80.iyh)&0x0f ? 0 : 0x10 ) | 0x02; (z80.iyh) = ((z80.iyh) - 1) & 0xff; z80.f |= ( (z80.iyh)==0x7f ? 0x04 : 0 ) | sz53_table[z80.iyh];};
      break;
    case 0x26: /* LD REGISTERH,nn */
      tstates += (3);;
      z80.iyh=readbyte_internal(z80.pc++); z80.pc &= 0xffff;
      break;
    case 0x29: /* ADD REGISTER,REGISTER */
      { var add16temp = ((z80.iyl | (z80.iyh << 8))) + ((z80.iyl | (z80.iyh << 8))); var lookup = ( ( ((z80.iyl | (z80.iyh << 8))) & 0x0800 ) >> 11 ) | ( ( ((z80.iyl | (z80.iyh << 8))) & 0x0800 ) >> 10 ) | ( ( add16temp & 0x0800 ) >> 9 ); tstates += 7; (z80.iyh) = (add16temp >> 8) & 0xff; (z80.iyl) = add16temp & 0xff; z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) | ( add16temp & 0x10000 ? 0x01 : 0 )| ( ( add16temp >> 8 ) & ( 0x08 | 0x20 ) ) | halfcarry_add_table[lookup];};
      break;
    case 0x2a: /* LD REGISTER,(nnnn) */
      { var ldtemp; tstates += (3);; ldtemp=readbyte_internal(z80.pc++); z80.pc &= 0xffff; tstates += (3);; ldtemp|=readbyte_internal(z80.pc++) << 8; z80.pc &= 0xffff; tstates += (3);; (z80.iyl)=readbyte_internal(ldtemp++); ldtemp &= 0xffff; tstates += (3);; (z80.iyh)=readbyte_internal(ldtemp); break;};
      break;
    case 0x2b: /* DEC REGISTER */
      tstates += 2;
      var wordtemp = ((z80.iyl | (z80.iyh << 8)) - 1) & 0xffff;
      z80.iyh = wordtemp >> 8;
      z80.iyl = wordtemp & 0xff;
      break;
    case 0x2c: /* INC REGISTERL */
      { (z80.iyl) = ((z80.iyl) + 1) & 0xff; z80.f = ( z80.f & 0x01 ) | ( (z80.iyl)==0x80 ? 0x04 : 0 ) | ( (z80.iyl)&0x0f ? 0 : 0x10 ) | sz53_table[(z80.iyl)];};
      break;
    case 0x2d: /* DEC REGISTERL */
      { z80.f = ( z80.f & 0x01 ) | ( (z80.iyl)&0x0f ? 0 : 0x10 ) | 0x02; (z80.iyl) = ((z80.iyl) - 1) & 0xff; z80.f |= ( (z80.iyl)==0x7f ? 0x04 : 0 ) | sz53_table[z80.iyl];};
      break;
    case 0x2e: /* LD REGISTERL,nn */
      tstates += (3);;
      z80.iyl=readbyte_internal(z80.pc++); z80.pc &= 0xffff;
      break;
    case 0x34: /* INC (REGISTER+dd) */
      tstates += 15; /* FIXME: how is this contended? */
      {
 var wordtemp =
     ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff;
 z80.pc &= 0xffff;
 var bytetemp = readbyte_internal( wordtemp );
 { (bytetemp) = ((bytetemp) + 1) & 0xff; z80.f = ( z80.f & 0x01 ) | ( (bytetemp)==0x80 ? 0x04 : 0 ) | ( (bytetemp)&0x0f ? 0 : 0x10 ) | sz53_table[(bytetemp)];};
 writebyte_internal(wordtemp,bytetemp);
      }
      break;
    case 0x35: /* DEC (REGISTER+dd) */
      tstates += 15; /* FIXME: how is this contended? */
      {
 var wordtemp =
     ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff;
 z80.pc &= 0xffff;
 var bytetemp = readbyte_internal( wordtemp );
 { z80.f = ( z80.f & 0x01 ) | ( (bytetemp)&0x0f ? 0 : 0x10 ) | 0x02; (bytetemp) = ((bytetemp) - 1) & 0xff; z80.f |= ( (bytetemp)==0x7f ? 0x04 : 0 ) | sz53_table[bytetemp];};
 writebyte_internal(wordtemp,bytetemp);
      }
      break;
    case 0x36: /* LD (REGISTER+dd),nn */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var wordtemp =
     ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff;
 z80.pc &= 0xffff;
 writebyte_internal(wordtemp,readbyte_internal(z80.pc++));
 z80.pc &= 0xffff;
      }
      break;
    case 0x39: /* ADD REGISTER,SP */
      { var add16temp = ((z80.iyl | (z80.iyh << 8))) + (z80.sp); var lookup = ( ( ((z80.iyl | (z80.iyh << 8))) & 0x0800 ) >> 11 ) | ( ( (z80.sp) & 0x0800 ) >> 10 ) | ( ( add16temp & 0x0800 ) >> 9 ); tstates += 7; (z80.iyh) = (add16temp >> 8) & 0xff; (z80.iyl) = add16temp & 0xff; z80.f = ( z80.f & ( 0x04 | 0x40 | 0x80 ) ) | ( add16temp & 0x10000 ? 0x01 : 0 )| ( ( add16temp >> 8 ) & ( 0x08 | 0x20 ) ) | halfcarry_add_table[lookup];};
      break;
    case 0x44: /* LD B,REGISTERH */
      z80.b=z80.iyh;
      break;
    case 0x45: /* LD B,REGISTERL */
      z80.b=z80.iyl;
      break;
    case 0x46: /* LD B,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      z80.b = readbyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
      z80.pc &= 0xffff;
      break;
    case 0x4c: /* LD C,REGISTERH */
      z80.c=z80.iyh;
      break;
    case 0x4d: /* LD C,REGISTERL */
      z80.c=z80.iyl;
      break;
    case 0x4e: /* LD C,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      z80.c = readbyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
      z80.pc &= 0xffff;
      break;
    case 0x54: /* LD D,REGISTERH */
      z80.d=z80.iyh;
      break;
    case 0x55: /* LD D,REGISTERL */
      z80.d=z80.iyl;
      break;
    case 0x56: /* LD D,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      z80.d = readbyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
      z80.pc &= 0xffff;
      break;
    case 0x5c: /* LD E,REGISTERH */
      z80.e=z80.iyh;
      break;
    case 0x5d: /* LD E,REGISTERL */
      z80.e=z80.iyl;
      break;
    case 0x5e: /* LD E,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      z80.e = readbyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
      z80.pc &= 0xffff;
      break;
    case 0x60: /* LD REGISTERH,B */
      z80.iyh=z80.b;
      break;
    case 0x61: /* LD REGISTERH,C */
      z80.iyh=z80.c;
      break;
    case 0x62: /* LD REGISTERH,D */
      z80.iyh=z80.d;
      break;
    case 0x63: /* LD REGISTERH,E */
      z80.iyh=z80.e;
      break;
    case 0x64: /* LD REGISTERH,REGISTERH */
      break;
    case 0x65: /* LD REGISTERH,REGISTERL */
      z80.iyh=z80.iyl;
      break;
    case 0x66: /* LD H,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      z80.h = readbyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
      z80.pc &= 0xffff;
      break;
    case 0x67: /* LD REGISTERH,A */
      z80.iyh=z80.a;
      break;
    case 0x68: /* LD REGISTERL,B */
      z80.iyl=z80.b;
      break;
    case 0x69: /* LD REGISTERL,C */
      z80.iyl=z80.c;
      break;
    case 0x6a: /* LD REGISTERL,D */
      z80.iyl=z80.d;
      break;
    case 0x6b: /* LD REGISTERL,E */
      z80.iyl=z80.e;
      break;
    case 0x6c: /* LD REGISTERL,REGISTERH */
      z80.iyl=z80.iyh;
      break;
    case 0x6d: /* LD REGISTERL,REGISTERL */
      break;
    case 0x6e: /* LD L,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      z80.l = readbyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
      z80.pc &= 0xffff;
      break;
    case 0x6f: /* LD REGISTERL,A */
      z80.iyl=z80.a;
      break;
    case 0x70: /* LD (REGISTER+dd),B */
      tstates += 11; /* FIXME: how is this contended? */
      writebyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff, z80.b );
      z80.pc &= 0xffff;
      break;
    case 0x71: /* LD (REGISTER+dd),C */
      tstates += 11; /* FIXME: how is this contended? */
      writebyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff, z80.c );
      z80.pc &= 0xffff;
      break;
    case 0x72: /* LD (REGISTER+dd),D */
      tstates += 11; /* FIXME: how is this contended? */
      writebyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff, z80.d );
      z80.pc &= 0xffff;
      break;
    case 0x73: /* LD (REGISTER+dd),E */
      tstates += 11; /* FIXME: how is this contended? */
      writebyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff, z80.e );
      z80.pc &= 0xffff;
      break;
    case 0x74: /* LD (REGISTER+dd),H */
      tstates += 11; /* FIXME: how is this contended? */
      writebyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff, z80.h );
      z80.pc &= 0xffff;
      break;
    case 0x75: /* LD (REGISTER+dd),L */
      tstates += 11; /* FIXME: how is this contended? */
      writebyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff, z80.l );
      z80.pc &= 0xffff;
      break;
    case 0x77: /* LD (REGISTER+dd),A */
      tstates += 11; /* FIXME: how is this contended? */
      writebyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff, z80.a );
      z80.pc &= 0xffff;
      break;
    case 0x7c: /* LD A,REGISTERH */
      z80.a=z80.iyh;
      break;
    case 0x7d: /* LD A,REGISTERL */
      z80.a=z80.iyl;
      break;
    case 0x7e: /* LD A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      z80.a = readbyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
      z80.pc &= 0xffff;
      break;
    case 0x84: /* ADD A,REGISTERH */
      { var addtemp = z80.a + (z80.iyh); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.iyh) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x85: /* ADD A,REGISTERL */
      { var addtemp = z80.a + (z80.iyl); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.iyl) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x86: /* ADD A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { var addtemp = z80.a + (bytetemp); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( addtemp & 0x88 ) >> 1 ); z80.a=addtemp & 0xff; z80.f = ( addtemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0x8c: /* ADC A,REGISTERH */
      { var adctemp = z80.a + (z80.iyh) + ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.iyh) & 0x88 ) >> 2 ) | ( ( adctemp & 0x88 ) >> 1 ); z80.a=adctemp & 0xff; z80.f = ( adctemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x8d: /* ADC A,REGISTERL */
      { var adctemp = z80.a + (z80.iyl) + ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.iyl) & 0x88 ) >> 2 ) | ( ( adctemp & 0x88 ) >> 1 ); z80.a=adctemp & 0xff; z80.f = ( adctemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x8e: /* ADC A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { var adctemp = z80.a + (bytetemp) + ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( adctemp & 0x88 ) >> 1 ); z80.a=adctemp & 0xff; z80.f = ( adctemp & 0x100 ? 0x01 : 0 ) | halfcarry_add_table[lookup & 0x07] | overflow_add_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0x94: /* SUB A,REGISTERH */
      { var subtemp = z80.a - (z80.iyh); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.iyh) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x95: /* SUB A,REGISTERL */
      { var subtemp = z80.a - (z80.iyl); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.iyl) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x96: /* SUB A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { var subtemp = z80.a - (bytetemp); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( (subtemp & 0x88 ) >> 1 ); z80.a=subtemp & 0xff; z80.f = ( subtemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0x9c: /* SBC A,REGISTERH */
      { var sbctemp = z80.a - (z80.iyh) - ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.iyh) & 0x88 ) >> 2 ) | ( ( sbctemp & 0x88 ) >> 1 ); z80.a=sbctemp & 0xff; z80.f = ( sbctemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x9d: /* SBC A,REGISTERL */
      { var sbctemp = z80.a - (z80.iyl) - ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.iyl) & 0x88 ) >> 2 ) | ( ( sbctemp & 0x88 ) >> 1 ); z80.a=sbctemp & 0xff; z80.f = ( sbctemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      break;
    case 0x9e: /* SBC A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { var sbctemp = z80.a - (bytetemp) - ( z80.f & 0x01 ); var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( sbctemp & 0x88 ) >> 1 ); z80.a=sbctemp & 0xff; z80.f = ( sbctemp & 0x100 ? 0x01 : 0 ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | sz53_table[z80.a];};
      }
      break;
    case 0xa4: /* AND A,REGISTERH */
      { z80.a &= (z80.iyh); z80.f = 0x10 | sz53p_table[z80.a];};
      break;
    case 0xa5: /* AND A,REGISTERL */
      { z80.a &= (z80.iyl); z80.f = 0x10 | sz53p_table[z80.a];};
      break;
    case 0xa6: /* AND A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { z80.a &= (bytetemp); z80.f = 0x10 | sz53p_table[z80.a];};
      }
      break;
    case 0xac: /* XOR A,REGISTERH */
      { z80.a ^= (z80.iyh); z80.f = sz53p_table[z80.a];};
      break;
    case 0xad: /* XOR A,REGISTERL */
      { z80.a ^= (z80.iyl); z80.f = sz53p_table[z80.a];};
      break;
    case 0xae: /* XOR A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { z80.a ^= (bytetemp); z80.f = sz53p_table[z80.a];};
      }
      break;
    case 0xb4: /* OR A,REGISTERH */
      { z80.a |= (z80.iyh); z80.f = sz53p_table[z80.a];};
      break;
    case 0xb5: /* OR A,REGISTERL */
      { z80.a |= (z80.iyl); z80.f = sz53p_table[z80.a];};
      break;
    case 0xb6: /* OR A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { z80.a |= (bytetemp); z80.f = sz53p_table[z80.a];};
      }
      break;
    case 0xbc: /* CP A,REGISTERH */
      { var cptemp = z80.a - z80.iyh; var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.iyh) & 0x88 ) >> 2 ) | ( ( cptemp & 0x88 ) >> 1 ); z80.f = ( cptemp & 0x100 ? 0x01 : ( cptemp ? 0 : 0x40 ) ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | ( z80.iyh & ( 0x08 | 0x20 ) ) | ( cptemp & 0x80 );};
      break;
    case 0xbd: /* CP A,REGISTERL */
      { var cptemp = z80.a - z80.iyl; var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (z80.iyl) & 0x88 ) >> 2 ) | ( ( cptemp & 0x88 ) >> 1 ); z80.f = ( cptemp & 0x100 ? 0x01 : ( cptemp ? 0 : 0x40 ) ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | ( z80.iyl & ( 0x08 | 0x20 ) ) | ( cptemp & 0x80 );};
      break;
    case 0xbe: /* CP A,(REGISTER+dd) */
      tstates += 11; /* FIXME: how is this contended? */
      {
 var bytetemp =
     readbyte_internal( ((z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ))) & 0xffff );
     z80.pc &= 0xffff;
 { var cptemp = z80.a - bytetemp; var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( cptemp & 0x88 ) >> 1 ); z80.f = ( cptemp & 0x100 ? 0x01 : ( cptemp ? 0 : 0x40 ) ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | ( bytetemp & ( 0x08 | 0x20 ) ) | ( cptemp & 0x80 );};
      }
      break;
    case 0xcb: /* shift DDFDCB */
      /* FIXME: contention here is just a guess */
      {
 var tempaddr; var opcode3;
 tstates += (3);;
 tempaddr =
     (z80.iyl | (z80.iyh << 8)) + sign_extend(readbyte_internal( z80.pc++ ));
 z80.pc &= 0xffff;
 tstates += (4);;
 opcode3 = readbyte_internal( z80.pc++ );
 z80.pc &= 0xffff;
 switch(opcode3) {
/* opcodes_ddfdcb.c Z80 {DD,FD}CBxx opcodes
   Copyright (c) 1999-2008 Philip Kendall, Matthew Westcott

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Contact details: <matthew@west.co.tt>
    Matthew Westcott, 14 Daisy Hill Drive, Adlington, Chorley, Lancs PR6 9NE UNITED KINGDOM

*/
/* NB: this file is autogenerated by 'z80.pl' from 'opcodes_ddfdcb.dat',
   and included in 'z80_ops.jscpp' */
    case 0x00: /* LD B,RLC (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { (z80.b) = ( ((z80.b) & 0x7f)<<1 ) | ( (z80.b)>>7 ); z80.f = ( (z80.b) & 0x01 ) | sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x01: /* LD C,RLC (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { (z80.c) = ( ((z80.c) & 0x7f)<<1 ) | ( (z80.c)>>7 ); z80.f = ( (z80.c) & 0x01 ) | sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x02: /* LD D,RLC (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { (z80.d) = ( ((z80.d) & 0x7f)<<1 ) | ( (z80.d)>>7 ); z80.f = ( (z80.d) & 0x01 ) | sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x03: /* LD E,RLC (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { (z80.e) = ( ((z80.e) & 0x7f)<<1 ) | ( (z80.e)>>7 ); z80.f = ( (z80.e) & 0x01 ) | sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x04: /* LD H,RLC (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { (z80.h) = ( ((z80.h) & 0x7f)<<1 ) | ( (z80.h)>>7 ); z80.f = ( (z80.h) & 0x01 ) | sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x05: /* LD L,RLC (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { (z80.l) = ( ((z80.l) & 0x7f)<<1 ) | ( (z80.l)>>7 ); z80.f = ( (z80.l) & 0x01 ) | sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x06: /* RLC (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { (bytetemp) = ( ((bytetemp) & 0x7f)<<1 ) | ( (bytetemp)>>7 ); z80.f = ( (bytetemp) & 0x01 ) | sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x07: /* LD A,RLC (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { (z80.a) = ( ((z80.a) & 0x7f)<<1 ) | ( (z80.a)>>7 ); z80.f = ( (z80.a) & 0x01 ) | sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x08: /* LD B,RRC (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { z80.f = (z80.b) & 0x01; (z80.b) = ( (z80.b)>>1 ) | ( ((z80.b) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x09: /* LD C,RRC (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { z80.f = (z80.c) & 0x01; (z80.c) = ( (z80.c)>>1 ) | ( ((z80.c) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x0a: /* LD D,RRC (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { z80.f = (z80.d) & 0x01; (z80.d) = ( (z80.d)>>1 ) | ( ((z80.d) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x0b: /* LD E,RRC (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { z80.f = (z80.e) & 0x01; (z80.e) = ( (z80.e)>>1 ) | ( ((z80.e) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x0c: /* LD H,RRC (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { z80.f = (z80.h) & 0x01; (z80.h) = ( (z80.h)>>1 ) | ( ((z80.h) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x0d: /* LD L,RRC (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { z80.f = (z80.l) & 0x01; (z80.l) = ( (z80.l)>>1 ) | ( ((z80.l) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x0e: /* RRC (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { z80.f = (bytetemp) & 0x01; (bytetemp) = ( (bytetemp)>>1 ) | ( ((bytetemp) & 0x01)<<7 ); z80.f |= sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x0f: /* LD A,RRC (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { z80.f = (z80.a) & 0x01; (z80.a) = ( (z80.a)>>1 ) | ( ((z80.a) & 0x01)<<7 ); z80.f |= sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x10: /* LD B,RL (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { var rltemp = (z80.b); (z80.b) = ( ((z80.b) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x11: /* LD C,RL (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { var rltemp = (z80.c); (z80.c) = ( ((z80.c) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x12: /* LD D,RL (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { var rltemp = (z80.d); (z80.d) = ( ((z80.d) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x13: /* LD E,RL (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { var rltemp = (z80.e); (z80.e) = ( ((z80.e) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x14: /* LD H,RL (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { var rltemp = (z80.h); (z80.h) = ( ((z80.h) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x15: /* LD L,RL (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { var rltemp = (z80.l); (z80.l) = ( ((z80.l) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x16: /* RL (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { var rltemp = (bytetemp); (bytetemp) = ( ((bytetemp) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x17: /* LD A,RL (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { var rltemp = (z80.a); (z80.a) = ( ((z80.a) & 0x7f)<<1 ) | ( z80.f & 0x01 ); z80.f = ( rltemp >> 7 ) | sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x18: /* LD B,RR (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { var rrtemp = (z80.b); (z80.b) = ( (z80.b)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x19: /* LD C,RR (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { var rrtemp = (z80.c); (z80.c) = ( (z80.c)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x1a: /* LD D,RR (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { var rrtemp = (z80.d); (z80.d) = ( (z80.d)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x1b: /* LD E,RR (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { var rrtemp = (z80.e); (z80.e) = ( (z80.e)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x1c: /* LD H,RR (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { var rrtemp = (z80.h); (z80.h) = ( (z80.h)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x1d: /* LD L,RR (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { var rrtemp = (z80.l); (z80.l) = ( (z80.l)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x1e: /* RR (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { var rrtemp = (bytetemp); (bytetemp) = ( (bytetemp)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x1f: /* LD A,RR (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { var rrtemp = (z80.a); (z80.a) = ( (z80.a)>>1 ) | ( (z80.f & 0x01) << 7 ); z80.f = ( rrtemp & 0x01 ) | sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x20: /* LD B,SLA (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { z80.f = (z80.b) >> 7; (z80.b) <<= 1; (z80.b) &= 0xff; z80.f |= sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x21: /* LD C,SLA (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { z80.f = (z80.c) >> 7; (z80.c) <<= 1; (z80.c) &= 0xff; z80.f |= sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x22: /* LD D,SLA (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { z80.f = (z80.d) >> 7; (z80.d) <<= 1; (z80.d) &= 0xff; z80.f |= sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x23: /* LD E,SLA (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { z80.f = (z80.e) >> 7; (z80.e) <<= 1; (z80.e) &= 0xff; z80.f |= sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x24: /* LD H,SLA (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { z80.f = (z80.h) >> 7; (z80.h) <<= 1; (z80.h) &= 0xff; z80.f |= sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x25: /* LD L,SLA (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { z80.f = (z80.l) >> 7; (z80.l) <<= 1; (z80.l) &= 0xff; z80.f |= sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x26: /* SLA (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { z80.f = (bytetemp) >> 7; (bytetemp) <<= 1; (bytetemp) &= 0xff; z80.f |= sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x27: /* LD A,SLA (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { z80.f = (z80.a) >> 7; (z80.a) <<= 1; (z80.a) &= 0xff; z80.f |= sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x28: /* LD B,SRA (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { z80.f = (z80.b) & 0x01; (z80.b) = ( (z80.b) & 0x80 ) | ( (z80.b) >> 1 ); z80.f |= sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x29: /* LD C,SRA (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { z80.f = (z80.c) & 0x01; (z80.c) = ( (z80.c) & 0x80 ) | ( (z80.c) >> 1 ); z80.f |= sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x2a: /* LD D,SRA (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { z80.f = (z80.d) & 0x01; (z80.d) = ( (z80.d) & 0x80 ) | ( (z80.d) >> 1 ); z80.f |= sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x2b: /* LD E,SRA (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { z80.f = (z80.e) & 0x01; (z80.e) = ( (z80.e) & 0x80 ) | ( (z80.e) >> 1 ); z80.f |= sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x2c: /* LD H,SRA (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { z80.f = (z80.h) & 0x01; (z80.h) = ( (z80.h) & 0x80 ) | ( (z80.h) >> 1 ); z80.f |= sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x2d: /* LD L,SRA (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { z80.f = (z80.l) & 0x01; (z80.l) = ( (z80.l) & 0x80 ) | ( (z80.l) >> 1 ); z80.f |= sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x2e: /* SRA (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { z80.f = (bytetemp) & 0x01; (bytetemp) = ( (bytetemp) & 0x80 ) | ( (bytetemp) >> 1 ); z80.f |= sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x2f: /* LD A,SRA (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { z80.f = (z80.a) & 0x01; (z80.a) = ( (z80.a) & 0x80 ) | ( (z80.a) >> 1 ); z80.f |= sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x30: /* LD B,SLL (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { z80.f = (z80.b) >> 7; (z80.b) = ( (z80.b) << 1 ) | 0x01; (z80.b) &= 0xff; z80.f |= sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x31: /* LD C,SLL (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { z80.f = (z80.c) >> 7; (z80.c) = ( (z80.c) << 1 ) | 0x01; (z80.c) &= 0xff; z80.f |= sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x32: /* LD D,SLL (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { z80.f = (z80.d) >> 7; (z80.d) = ( (z80.d) << 1 ) | 0x01; (z80.d) &= 0xff; z80.f |= sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x33: /* LD E,SLL (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { z80.f = (z80.e) >> 7; (z80.e) = ( (z80.e) << 1 ) | 0x01; (z80.e) &= 0xff; z80.f |= sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x34: /* LD H,SLL (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { z80.f = (z80.h) >> 7; (z80.h) = ( (z80.h) << 1 ) | 0x01; (z80.h) &= 0xff; z80.f |= sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x35: /* LD L,SLL (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { z80.f = (z80.l) >> 7; (z80.l) = ( (z80.l) << 1 ) | 0x01; (z80.l) &= 0xff; z80.f |= sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x36: /* SLL (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { z80.f = (bytetemp) >> 7; (bytetemp) = ( (bytetemp) << 1 ) | 0x01; (bytetemp) &= 0xff; z80.f |= sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x37: /* LD A,SLL (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { z80.f = (z80.a) >> 7; (z80.a) = ( (z80.a) << 1 ) | 0x01; (z80.a) &= 0xff; z80.f |= sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x38: /* LD B,SRL (REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr);
      { z80.f = (z80.b) & 0x01; (z80.b) >>= 1; z80.f |= sz53p_table[(z80.b)];};
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x39: /* LD C,SRL (REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr);
      { z80.f = (z80.c) & 0x01; (z80.c) >>= 1; z80.f |= sz53p_table[(z80.c)];};
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x3a: /* LD D,SRL (REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr);
      { z80.f = (z80.d) & 0x01; (z80.d) >>= 1; z80.f |= sz53p_table[(z80.d)];};
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x3b: /* LD E,SRL (REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr);
      { z80.f = (z80.e) & 0x01; (z80.e) >>= 1; z80.f |= sz53p_table[(z80.e)];};
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x3c: /* LD H,SRL (REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr);
      { z80.f = (z80.h) & 0x01; (z80.h) >>= 1; z80.f |= sz53p_table[(z80.h)];};
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x3d: /* LD L,SRL (REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr);
      { z80.f = (z80.l) & 0x01; (z80.l) >>= 1; z80.f |= sz53p_table[(z80.l)];};
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x3e: /* SRL (REGISTER+dd) */
      tstates += 8;
      {
 var bytetemp = readbyte_internal(tempaddr);
 { z80.f = (bytetemp) & 0x01; (bytetemp) >>= 1; z80.f |= sz53p_table[(bytetemp)];};
 writebyte_internal(tempaddr,bytetemp);
      }
      break;
    case 0x3f: /* LD A,SRL (REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr);
      { z80.f = (z80.a) & 0x01; (z80.a) >>= 1; z80.f |= sz53p_table[(z80.a)];};
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x40:
    case 0x41:
    case 0x42:
    case 0x43:
    case 0x44:
    case 0x45:
    case 0x46:
    case 0x47: /* BIT 0,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (0) ) ) ) z80.f |= 0x04 | 0x40; if( (0) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x48:
    case 0x49:
    case 0x4a:
    case 0x4b:
    case 0x4c:
    case 0x4d:
    case 0x4e:
    case 0x4f: /* BIT 1,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (1) ) ) ) z80.f |= 0x04 | 0x40; if( (1) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x50:
    case 0x51:
    case 0x52:
    case 0x53:
    case 0x54:
    case 0x55:
    case 0x56:
    case 0x57: /* BIT 2,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (2) ) ) ) z80.f |= 0x04 | 0x40; if( (2) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x58:
    case 0x59:
    case 0x5a:
    case 0x5b:
    case 0x5c:
    case 0x5d:
    case 0x5e:
    case 0x5f: /* BIT 3,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (3) ) ) ) z80.f |= 0x04 | 0x40; if( (3) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x60:
    case 0x61:
    case 0x62:
    case 0x63:
    case 0x64:
    case 0x65:
    case 0x66:
    case 0x67: /* BIT 4,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (4) ) ) ) z80.f |= 0x04 | 0x40; if( (4) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x68:
    case 0x69:
    case 0x6a:
    case 0x6b:
    case 0x6c:
    case 0x6d:
    case 0x6e:
    case 0x6f: /* BIT 5,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (5) ) ) ) z80.f |= 0x04 | 0x40; if( (5) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x70:
    case 0x71:
    case 0x72:
    case 0x73:
    case 0x74:
    case 0x75:
    case 0x76:
    case 0x77: /* BIT 6,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (6) ) ) ) z80.f |= 0x04 | 0x40; if( (6) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x78:
    case 0x79:
    case 0x7a:
    case 0x7b:
    case 0x7c:
    case 0x7d:
    case 0x7e:
    case 0x7f: /* BIT 7,(REGISTER+dd) */
      tstates += 5;
      {
 var bytetemp = readbyte_internal( tempaddr );
 { z80.f = ( z80.f & 0x01 ) | 0x10 | ( ( tempaddr >> 8 ) & ( 0x08 | 0x20 ) ); if( ! ( (bytetemp) & ( 0x01 << (7) ) ) ) z80.f |= 0x04 | 0x40; if( (7) == 7 && (bytetemp) & 0x80 ) z80.f |= 0x80; };
      }
      break;
    case 0x80: /* LD B,RES 0,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0xfe;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x81: /* LD C,RES 0,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0xfe;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x82: /* LD D,RES 0,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0xfe;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x83: /* LD E,RES 0,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0xfe;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x84: /* LD H,RES 0,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0xfe;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x85: /* LD L,RES 0,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0xfe;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x86: /* RES 0,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0xfe);
      break;
    case 0x87: /* LD A,RES 0,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0xfe;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x88: /* LD B,RES 1,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0xfd;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x89: /* LD C,RES 1,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0xfd;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x8a: /* LD D,RES 1,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0xfd;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x8b: /* LD E,RES 1,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0xfd;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x8c: /* LD H,RES 1,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0xfd;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x8d: /* LD L,RES 1,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0xfd;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x8e: /* RES 1,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0xfd);
      break;
    case 0x8f: /* LD A,RES 1,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0xfd;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x90: /* LD B,RES 2,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0xfb;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x91: /* LD C,RES 2,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0xfb;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x92: /* LD D,RES 2,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0xfb;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x93: /* LD E,RES 2,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0xfb;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x94: /* LD H,RES 2,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0xfb;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x95: /* LD L,RES 2,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0xfb;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x96: /* RES 2,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0xfb);
      break;
    case 0x97: /* LD A,RES 2,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0xfb;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0x98: /* LD B,RES 3,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0xf7;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0x99: /* LD C,RES 3,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0xf7;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0x9a: /* LD D,RES 3,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0xf7;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0x9b: /* LD E,RES 3,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0xf7;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0x9c: /* LD H,RES 3,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0xf7;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0x9d: /* LD L,RES 3,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0xf7;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0x9e: /* RES 3,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0xf7);
      break;
    case 0x9f: /* LD A,RES 3,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0xf7;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xa0: /* LD B,RES 4,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0xef;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xa1: /* LD C,RES 4,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0xef;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xa2: /* LD D,RES 4,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0xef;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xa3: /* LD E,RES 4,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0xef;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xa4: /* LD H,RES 4,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0xef;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xa5: /* LD L,RES 4,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0xef;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xa6: /* RES 4,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0xef);
      break;
    case 0xa7: /* LD A,RES 4,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0xef;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xa8: /* LD B,RES 5,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0xdf;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xa9: /* LD C,RES 5,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0xdf;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xaa: /* LD D,RES 5,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0xdf;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xab: /* LD E,RES 5,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0xdf;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xac: /* LD H,RES 5,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0xdf;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xad: /* LD L,RES 5,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0xdf;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xae: /* RES 5,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0xdf);
      break;
    case 0xaf: /* LD A,RES 5,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0xdf;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xb0: /* LD B,RES 6,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0xbf;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xb1: /* LD C,RES 6,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0xbf;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xb2: /* LD D,RES 6,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0xbf;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xb3: /* LD E,RES 6,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0xbf;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xb4: /* LD H,RES 6,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0xbf;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xb5: /* LD L,RES 6,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0xbf;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xb6: /* RES 6,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0xbf);
      break;
    case 0xb7: /* LD A,RES 6,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0xbf;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xb8: /* LD B,RES 7,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) & 0x7f;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xb9: /* LD C,RES 7,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) & 0x7f;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xba: /* LD D,RES 7,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) & 0x7f;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xbb: /* LD E,RES 7,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) & 0x7f;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xbc: /* LD H,RES 7,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) & 0x7f;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xbd: /* LD L,RES 7,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) & 0x7f;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xbe: /* RES 7,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) & 0x7f);
      break;
    case 0xbf: /* LD A,RES 7,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) & 0x7f;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xc0: /* LD B,SET 0,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x01;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xc1: /* LD C,SET 0,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x01;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xc2: /* LD D,SET 0,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x01;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xc3: /* LD E,SET 0,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x01;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xc4: /* LD H,SET 0,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x01;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xc5: /* LD L,SET 0,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x01;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xc6: /* SET 0,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x01);
      break;
    case 0xc7: /* LD A,SET 0,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x01;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xc8: /* LD B,SET 1,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x02;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xc9: /* LD C,SET 1,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x02;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xca: /* LD D,SET 1,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x02;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xcb: /* LD E,SET 1,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x02;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xcc: /* LD H,SET 1,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x02;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xcd: /* LD L,SET 1,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x02;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xce: /* SET 1,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x02);
      break;
    case 0xcf: /* LD A,SET 1,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x02;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xd0: /* LD B,SET 2,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x04;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xd1: /* LD C,SET 2,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x04;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xd2: /* LD D,SET 2,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x04;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xd3: /* LD E,SET 2,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x04;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xd4: /* LD H,SET 2,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x04;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xd5: /* LD L,SET 2,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x04;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xd6: /* SET 2,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x04);
      break;
    case 0xd7: /* LD A,SET 2,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x04;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xd8: /* LD B,SET 3,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x08;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xd9: /* LD C,SET 3,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x08;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xda: /* LD D,SET 3,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x08;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xdb: /* LD E,SET 3,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x08;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xdc: /* LD H,SET 3,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x08;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xdd: /* LD L,SET 3,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x08;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xde: /* SET 3,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x08);
      break;
    case 0xdf: /* LD A,SET 3,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x08;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xe0: /* LD B,SET 4,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x10;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xe1: /* LD C,SET 4,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x10;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xe2: /* LD D,SET 4,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x10;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xe3: /* LD E,SET 4,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x10;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xe4: /* LD H,SET 4,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x10;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xe5: /* LD L,SET 4,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x10;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xe6: /* SET 4,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x10);
      break;
    case 0xe7: /* LD A,SET 4,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x10;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xe8: /* LD B,SET 5,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x20;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xe9: /* LD C,SET 5,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x20;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xea: /* LD D,SET 5,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x20;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xeb: /* LD E,SET 5,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x20;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xec: /* LD H,SET 5,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x20;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xed: /* LD L,SET 5,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x20;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xee: /* SET 5,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x20);
      break;
    case 0xef: /* LD A,SET 5,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x20;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xf0: /* LD B,SET 6,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x40;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xf1: /* LD C,SET 6,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x40;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xf2: /* LD D,SET 6,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x40;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xf3: /* LD E,SET 6,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x40;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xf4: /* LD H,SET 6,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x40;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xf5: /* LD L,SET 6,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x40;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xf6: /* SET 6,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x40);
      break;
    case 0xf7: /* LD A,SET 6,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x40;
      writebyte_internal(tempaddr, z80.a);
      break;
    case 0xf8: /* LD B,SET 7,(REGISTER+dd) */
      tstates += 8;
      z80.b=readbyte_internal(tempaddr) | 0x80;
      writebyte_internal(tempaddr, z80.b);
      break;
    case 0xf9: /* LD C,SET 7,(REGISTER+dd) */
      tstates += 8;
      z80.c=readbyte_internal(tempaddr) | 0x80;
      writebyte_internal(tempaddr, z80.c);
      break;
    case 0xfa: /* LD D,SET 7,(REGISTER+dd) */
      tstates += 8;
      z80.d=readbyte_internal(tempaddr) | 0x80;
      writebyte_internal(tempaddr, z80.d);
      break;
    case 0xfb: /* LD E,SET 7,(REGISTER+dd) */
      tstates += 8;
      z80.e=readbyte_internal(tempaddr) | 0x80;
      writebyte_internal(tempaddr, z80.e);
      break;
    case 0xfc: /* LD H,SET 7,(REGISTER+dd) */
      tstates += 8;
      z80.h=readbyte_internal(tempaddr) | 0x80;
      writebyte_internal(tempaddr, z80.h);
      break;
    case 0xfd: /* LD L,SET 7,(REGISTER+dd) */
      tstates += 8;
      z80.l=readbyte_internal(tempaddr) | 0x80;
      writebyte_internal(tempaddr, z80.l);
      break;
    case 0xfe: /* SET 7,(REGISTER+dd) */
      tstates += 8;
      writebyte_internal(tempaddr, readbyte_internal(tempaddr) | 0x80);
      break;
    case 0xff: /* LD A,SET 7,(REGISTER+dd) */
      tstates += 8;
      z80.a=readbyte_internal(tempaddr) | 0x80;
      writebyte_internal(tempaddr, z80.a);
      break;
 }
      }
      break;
    case 0xe1: /* POP REGISTER */
      { tstates += (3);; (z80.iyl)=readbyte_internal(z80.sp++); z80.sp &= 0xffff; tstates += (3);; (z80.iyh)=readbyte_internal(z80.sp++); z80.sp &= 0xffff;};
      break;
    case 0xe3: /* EX (SP),REGISTER */
      {
 var bytetempl = readbyte_internal( z80.sp ),
                  bytetemph = readbyte_internal( z80.sp + 1 );
 tstates += (3);; tstates += (4);;
 tstates += (3);; tstates += (5);;
 writebyte_internal(z80.sp+1,z80.iyh); writebyte_internal(z80.sp,z80.iyl);
 z80.iyl=bytetempl; z80.iyh=bytetemph;
      }
      break;
    case 0xe5: /* PUSH REGISTER */
      tstates++;
      { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.iyh)); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.iyl));};
      break;
    case 0xe9: /* JP REGISTER */
      z80.pc=(z80.iyl | (z80.iyh << 8)); /* NB: NOT INDIRECT! */
      break;
    case 0xf9: /* LD SP,REGISTER */
      tstates += 2;
      z80.sp=(z80.iyl | (z80.iyh << 8));
      break;
    default: /* Instruction did not involve H or L, so backtrack
               one instruction and parse again */
      z80.pc--; /* FIXME: will be contended again */
      z80.pc &= 0xffff;
      z80.r--; /* Decrement the R register as well */
      z80.r &= 0x7f;
      break;
 }
      }
      break;
    case 0xfe: /* CP nn */
      tstates += (3);;
      {
 var bytetemp = readbyte_internal( z80.pc++ );
 { var cptemp = z80.a - bytetemp; var lookup = ( ( z80.a & 0x88 ) >> 3 ) | ( ( (bytetemp) & 0x88 ) >> 2 ) | ( ( cptemp & 0x88 ) >> 1 ); z80.f = ( cptemp & 0x100 ? 0x01 : ( cptemp ? 0 : 0x40 ) ) | 0x02 | halfcarry_sub_table[lookup & 0x07] | overflow_sub_table[lookup >> 4] | ( bytetemp & ( 0x08 | 0x20 ) ) | ( cptemp & 0x80 );};
      }
      break;
    case 0xff: /* RST 38 */
      tstates++;
      { { z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) >> 8); z80.sp--; z80.sp &= 0xffff; tstates += (3);; writebyte_internal(z80.sp,(z80.pc) & 0xff);}; z80.pc=(0x38);};
      break;
    }
  }
}

var nanowasp = nanowasp || {};
nanowasp.data = {};
nanowasp.data.roms = {};
nanowasp.data.roms['char'] = "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\
AAAAAAAAAFxiQEBAQAAAAAAAAAAAAAA8QjAMQjwAAAAAAAAAABAQfBAQEBIMAAAA\
AAAAAAAAAEJCQkJGOgAAAAAAAAAAAABBQUEiFAgAAAAAAAAAAAAAQUlJSUk2AAAA\
AAAAAAAAAEIkGBgkQgAAAAAAAAAAAABCQkJCRjoCQjwAAAAAAAAAfgQIECB+AAAA\
AAAAAAwQEBAgEBAQDAAAAAAAAAAICAgAAAgICAAAAAAAAAAAGAQEBAIEBAQYAAAA\
AAAAADBJBgAAAAAAAAAAAAAAAAAkSRIkSRIkSRIAAAAAAD4iIiIiIj4AAAAAAAAA\
AAA+ICAgICAgAAAAAAAAAAAACAgICAgIPgAAAAAAAAAAAAICAgICAj4AAAAAAAAA\
AAAQCAQeCAQCAAAAAAAAAAAAPiI2KjYiPgAAAAAAAAAAAAACBCgwIAAAAAAAAAAA\
AAAcIiI+FBQ2AAAAAAAAAAAACBA8EgoCAgAAAAAAAAAAAAAIBD4ECAAAAAAAAAAA\
AAA+AAA+AAA+AAAAAAAAAAAAAAgIKhwIAAAAAAAAAAAAAAgqHAgqHAgAAAAAAAAA\
AAAACBA+EAgAAAAAAAAAAAAAHCI2KjYiHAAAAAAAAAAAABwiIioiIhwAAAAAAAAA\
AAA+IiI+IiI+AAAAAAAAAAAAHCoqLiIiHAAAAAAAAAAAABwiIi4qKhwAAAAAAAAA\
AAAcIiI6KiocAAAAAAAAAAAAHCoqOiIiHAAAAAAAAAAAAAAKBCowIAAAAAAAAAAA\
AAAcFBQUFBQ2AAAAAAAAAAAAAgICPgICAgAAAAAAAAAAAD4iFAgUIj4AAAAAAAAA\
AAAICBwcCAgIAAAAAAAAAAAAHCIgEAgACAAAAAAAAAAAABwiIj4iIhwAAAAAAAAA\
AAA+Kio6IiI+AAAAAAAAAAAAPiIiOioqPgAAAAAAAAAAAD4iIi4qKj4AAAAAAAAA\
AAA+KiouIiI+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICAgIAAgAAAAAAAAA\
AAAUFBQAAAAAAAAAAAAAAAAAFBQ+FD4UFAAAAAAAAAAAAAgeKBwKPAgAAAAAAAAA\
AAAwMgQIECYGAAAAAAAAAAAAECgoECokGgAAAAAAAAAAABgYECAAAAAAAAAAAAAA\
AAAECBAQEAgEAAAAAAAAAAAAEAgEBAQIEAAAAAAAAAAAAAgqHD4cKggAAAAAAAAA\
AAAACAg+CAgAAAAAAAAAAAAAAAAAABgYECAAAAAAAAAAAAAAAD4AAAAAAAAAAAAA\
AAAAAAAAABgYAAAAAAAAAAAAAAIECBAgAAAAAAAAAAAAABwiJioyIhwAAAAAAAAA\
AAAIGAgICAgcAAAAAAAAAAAAHCICHCAgPgAAAAAAAAAAABwiAgwCIhwAAAAAAAAA\
AAAEDBQkPgQEAAAAAAAAAAAAPiAcAgIiHAAAAAAAAAAAAAwQIDwiIhwAAAAAAAAA\
AAA+AgQIECAgAAAAAAAAAAAAHCIiHCIiHAAAAAAAAAAAABwiIh4CBBgAAAAAAAAA\
AAAAGBgAGBgAAAAAAAAAAAAAABgYABgYECAAAAAAAAAAAAQIECAQCAQAAAAAAAAA\
AAAAAD4APgAAAAAAAAAAAAAAEAgEAgQIEAAAAAAAAAAAABwiAgQIAAgAAAAAAAAA\
AAAcIgIaKiocAAAAAAAAAAAACBQiIj4iIgAAAAAAAAAAADwSEhwSEjwAAAAAAAAA\
AAAcIiAgICIcAAAAAAAAAAAAPBISEhISPAAAAAAAAAAAAD4gIDggID4AAAAAAAAA\
AAA+ICA4ICAgAAAAAAAAAAAAHiAgJiIiHgAAAAAAAAAAACIiIj4iIiIAAAAAAAAA\
AAAcCAgICAgcAAAAAAAAAAAAAgICAgIiHAAAAAAAAAAAACIkKDAoJCIAAAAAAAAA\
AAAgICAgICA+AAAAAAAAAAAAIjYqKiIiIgAAAAAAAAAAACIyKiYiIiIAAAAAAAAA\
AAAcIiIiIiIcAAAAAAAAAAAAPCIiPCAgIAAAAAAAAAAAABwiIiIqJBoAAAAAAAAA\
AAA8IiI8KCQiAAAAAAAAAAAAHCIgHAIiHAAAAAAAAAAAAD4ICAgICAgAAAAAAAAA\
AAAiIiIiIiIcAAAAAAAAAAAAIiIiFBQICAAAAAAAAAAAACIiIiIqNiIAAAAAAAAA\
AAAiIhQIFCIiAAAAAAAAAAAAIiIUCAgICAAAAAAAAAAAAD4CBAgQID4AAAAAAAAA\
AAAcEBAQEBAcAAAAAAAAAAAAACAQCAQCAAAAAAAAAAAAABwEBAQEBBwAAAAAAAAA\
AAAIFCIAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAAAAAAAAAAwMCAQAAAAAAAAAAAAA\
AAAAABwCHiIeAAAAAAAAAAAAICAsMiIyLAAAAAAAAAAAAAAAHCIgIhwAAAAAAAAA\
AAACAhomIiYaAAAAAAAAAAAAAAAcIj4gHAAAAAAAAAAAAAQKCBwICAgAAAAAAAAA\
AAAAABomJhoCIhwAAAAAAAAAICAsMiIiIgAAAAAAAAAAAAgAGAgICBwAAAAAAAAA\
AAAAAgACAgICIhwAAAAAAAAAICAkKDAoJAAAAAAAAAAAABgICAgICBwAAAAAAAAA\
AAAAADQqKioqAAAAAAAAAAAAAAAsMiIiIgAAAAAAAAAAAAAAHCIiIhwAAAAAAAAA\
AAAAACwyIjIsICAAAAAAAAAAAAAaJiImGgICAAAAAAAAAAAALDIgICAAAAAAAAAA\
AAAAAB4gHAI8AAAAAAAAAAAACAg+CAgKBAAAAAAAAAAAAAAAIiIiJhoAAAAAAAAA\
AAAAACIiIhQIAAAAAAAAAAAAAAAiIioqFAAAAAAAAAAAAAAAIhQIFCIAAAAAAAAA\
AAAAACIiIh4CIhwAAAAAAAAAAAA+BAgQPgAAAAAAAAAAAAQICBAICAQAAAAAAAAA\
AAAICAgACAgIAAAAAAAAAAAAEAgIBAgIEAAAAAAAAAAAABAqBAAAAAAAAAAAAAAA\
AAAUKhQqFCoUAAAAAAAAAA==";
nanowasp.data.roms['basic_5_22e'] = "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\
AYAwAgYF0T4BMuQIw+CUfv6AIOoBAIAY7c2Fvz04HM2Fvzw4J82Fvz7QzYW/PTg3\
zYW/PDgsId6VN8nNhb88OBzNhb8+OCAhzJU3yc2Fvz04C82Fvz44CiHSlTfJIc+V\
N8kh1pU3ySHolTfJebfJebfIeOaAyXm3KAKXyTzJebco+njugOaAyXm3yBj1zbGP\
3POhzU2H5SLFCM2Fvz3U8KHVGv4NzPCh/pkTIPXN24zr4+vVzduM0SrFCM03h83b\
jDrkCP4BzYyP0c1Fgv6a9TrkCP4BKDDNcYYhAQDxIAcTzeaMzU2H1eXNN4fNw4bN\
TYd8t/zwoSPjBgTFzTeHwQXKP5fhGPTNPIkhzbjxIAcTzZmOzQCM1eXNk5bNB4vN\
l5bNTYd8t/zwoSPjzZOWBgMY0dXDYo/NLZ7V682hltHJzUWC/jo/2P4r2P4tIAkT\
zR+CzR6HGAPNH4LDN4fNhb8q9c2xj9zzofEwC810lz4BMuQIw5yU1c1Nh+vNTYd8\
usKLl327wouX5SLFCM1Nh+XNTYcrfbQoOeU65Aj+AShNKtQIKytGI25gzTeHKsUI\
zW6NzWyGzU2H6yrFCHMjcuHNN4d94VRdzTeH4c03h+EYDTrkCP4B4eEoDM1Nh9E+\
ATLkCMPBg80AjNHDwYMq1Ag6wAgPLzxPBv8JK82TlirFCM2Tls0/ic0AjOsqxQjN\
qo8YrM1Nh81Nh81Nh81NhzrkCP4BygCMw02HzXSXw9yW8c1Nh81KgT5SzZKA0SrK\
CHy1zOah1c2FvyIwEBr+IhMoEc2SgP4NzOKhGPDNjIA+IBgDOuAIMuEIzYW/O82w\
rNXNwqXRISgH5c2xj+Hc86Hr5c0YmDipzYKP4evNsKwwF+vNsKzrOODNSoHNjIDN\
jIDVzcKl0RjN8T4+MuEIzYW/O9RKgRghOuQI/gHKbY/Sg5PDoZYqygh8tSgMzUiG\
IyNOBgAJK+sAw8GDIQAJIyNOBgDlI37+ICj6/pQoE+EJfjwg6iN+PCsg5CH//yLp\
CMkjwTcY981Fgv4oIA/NUpLNTYfNSIbE6aHNP5jNsY/c86Eq6Qh8pTzM4aHV683b\
jM2Cj82wrDgMzYW/DdTgoevNP5jr6yLpCNHNsKzSwYMYy83QjNzzoc1Nh348zPOh\
5TrkCP4BPgI4CMTzoTrACA88JgBvzTeHzYW/KNTfoQYAxc1Sks1NhyPNN4fNsKzB\
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\
5SrxCCMjfoVvMMMkGMDlKyISAc2ZosQPqM1KgREoBxr+DSgQRzoSAbsgAsv4eM2S\
gBMY683rgCD7/gPKX4T+LigE4fEYoPHh5e1L5wivuSgS8s21Dc2lo9TeoRjwDM2z\
oxjq4e1bzgga/i8oC/5+IAI+L3cjExjw5c3fgdTmoc1MgiEoB8NMtfU6CQG3IPo+\
/zIJAfHTAMn1rzIJAfH77U06AMD+w8oAwM0BojoA4P7DygDgzQGi9ToA4P7DKATx\
++1N8cMD4M2Fv0wwBSpFARgNzYW/Q9TwoTpEAW8mAM03h8n1Oo0At8IzhPHJU3Rv\
cCBhdKAgZXJyb/IHIGluIGxpbmWgDFJlYWT5TGluZSB0b28gbG9u51VucGFpcmVk\
IGJyYWNrZXTzTXVsdGlwbGUgc3RhdGVtZW70T3V0IG9mIGRhdOFNaXNzaW5nIGVu\
ZCBxdW905UZOIG5hbeVWQVIgbWlzbWF0Y+hOb3RoaW5nIHRvIGV4ZeNJbGxlZ2Fs\
IGRpcmVj9FVuZGVyL292ZXIgZmxv90tpbGwgbm9uIGxpbuVOb25leGlzdGVudCBs\
aW5lIG51bWJl8k1peGVkIG1vZOVQYXJhbWV0ZXIgc2l65VN0YWNrIG92ZXJmbG/3\
R3JhcGhpY/NPdXRwdXQgb3ZlcmZsb/dPdXQgb2YgbWVtb3L5U3ludGH4Wm9u5U5F\
WFQgd2l0aG91dCBGT9JJbGxlZ2FsIHZhcmlhYmzlT3V0IG9mIHN0cmluZyBzcGFj\
5VVua25vd24gZnVuY3Rpb+5JbGxlZ2FsIGxpbuVEaXZpZGUgYnkgemVy70ludGVn\
ZXIgc3RyaW7nSWxsZWdhbCBSVU4gbW9k5URJTSBzaXrlUHJvZ3JhbSB0b28gbG9u\
50JhZCBsb2HkQXJndW1lbvRHb3N1YiBzdGFj60xpbmUgbnVtYmVyIGNsYXPoQ2Fu\
J3QgY29udGludeVPcHRpb24gbm90IGZpdHRl5AwHQXBwbGllZCBUZWNobm9sb2d5\
IE1pY3JvQmVlIENvbG91ciBCYXNpYy4gVmVyIDUuMjJlDQoKQ29weXJpZ2h0IE1T\
IDE5ODMgZm9yIE1pY3JvV29ybGQgQXVzdHJhbGlhDYoAAAAAAMEjAlhQkplAwRAA\
AAAAAADAmFOYFjNXRMEgAAAAAAAAwAAAAAAAAABBEAAAAAAAAMEVcHljJnlJOSUF\
IQg4VEK7J1VzGSI5hj0ZhBJphBJwvoMzMzMzMzNAFmZmZmZmZsEQAAAAAAAA/zon\
VXMZIjmGvCSAFYcwFYc+E4iIiIiIiL9BZmZmZmZmQFAAAAAAAADBEAAAAAAAAP++\
KGYiVwAAAD8WFlc2cAAAv0KQlhPAAAA/dSiWQAAAAMAQZWJjkwAAQBQgiJlEAADA\
GZk1UIUAAEAzMzFFKAAAwRAAAAAAAAD/QFAAAAAAAABBEAAAAAAAAMExYid2YBaE\
wBkTN3FAAAC/lDdkdgAAAMAXdSIHEAAAwCiTNVJAAADAhoWRcYAAAP/BIwJYUJKZ\
QbppBgAAAAAAu1QwEAAAAAC9FxViAAAAAL4lkTcQAAAAvzEldYAAAADAJJmYcAAA\
AMEQAAAAAAAA/wgCBgAAAAAASAAAAAAAAAAACQEJAAQACAAAAAAAAD5GID4ACAEA\
AAAAAAAAAAAKZAAAAAAAAAj/fwAAAAAAAMkFAYjP/5f/BQOK/5m3fwAACLbIo8ij\
yKO/oye2AAAAAAAAAAAAAAAAAAAAAgIAAAAAQBeFAAAAAMMKvsMctsMRtgAvpvi1\
zKvTq3qof6hDrEOs6aPVo0SsSKwsqDGorKysrGtAUTcSCRARSA9vDwAAAACAQCAQ\
CAQCAf0c7x3hH9UhySO9JbInqCmfLJYujTGFNH03djtwPmlCY0ZdSlhOU1NOWEpd\
RWJBaDSQSpBSkHmUh4W2haS/yJnIme2VvpaymJyUyJmHoH+ZeZlinGeYJpipnJ6X\
14N+msiZyJnImciZt6G9nMuZ5pnVoZ6aWJpqmqyaw6JhrXGtfae4p8inFKl2qaid\
+6fAp7esyJnImciZMaFqoRumW63frHmtmK/umsua+poDmyibbJ2BrTe2lqGloQau\
qwCoAK4AE7VJm12blJu1m8Od7JwInd2bcp7TnuaeXZ/rn2CwsLQbshSnd6rImciZ\
yJkATEXUTFBSSU7UUFJJTtRJxk5F10xMSVPUTElT1EVMU8VUSEXORk/STkVY1ERJ\
zUdPVM9PRsZPzlNUT9BFTsRHT1NVwlJFQcREQVTBUkVUVVLOSU5QVdRSVc5SRVNU\
T1LFVM9TVEXQVEHCU1DDRs5WQdJQT0vFT1XUUkXNUFJN1FpPTsVTxENMRUHSRURJ\
1FNF1FJFU0XUU1BFRcROT1JNQcxVTkRFUkxJTsVTQVbFTE9BxFNUUtNJTlZFUlPF\
UEPHQ1VS005P1EFOxE/SVFJBQ8VDT07UQ0zTSElSRdNBVVTPSU5WRVLUTE9SRdNJ\
TtRJzlBFRctVU9JMRc5TRUFSQ8hQT0lO1EVSUk/SUE/TQVPDVVNFxE5F1FBBy0VE\
QVPNR9hBQtNSTsRGTNRGUsVWQcxGUkFD1FNHzlNR0lNJzkNP00FUQc5MT8dFWNBQ\
TE/UREVMRVTFUkVOVc1QTEHZRVhFw1NU0ktF2UNI0gD+SMTwoc1JrcM1sMX12wJP\
BgAE2wKp5gHKUr3xeMHJzVO2IQAAzRWCzUiG5c0XjK/U8KEOAMMWte1Z0w3tUdMN\
7UDygL3tQMtwwJTSeL2/ycvX0wLbAstnKPrLl9MCyTrkAOYgMuoA2wLLZygGzdO9\
wyuBy9fTAvXxy5fTAsUGCtsCy2cgBBD4wcnN073By7/DIoHF1cNCqM2EhM2fhM3v\
oc3rgCD7y7/+Cij1yTL8CDLJCMnKK4U+Dc0KpcIMhToDwP7DygPAwwyFzRWCOAN9\
0wrDEba3wouB5cXVIVm/BgQalubfIDojExD2Gsuv/lUgARMay6/+UiAnExrm3y42\
KAos/kIoBSz+TSAV6zYgKzYsKzYg4eU2nyM2MSM2NSNz0cHhw5KBcTqeAOYHBzKa\
ADqdAOYHDw8PTzqcALEymwDDwYM6mQC3OpoA0wjL99MIyc3evvHB0eHJwjOwNoD1\
zau+8cMzsOaAqHfNhL7Iy9w6mwB3y5w6mgDTCMnNhqfNhL7IIUD4EQD4AcAD7bAG\
QDqbABITEPw6mgDTCMnNhL7IOpsAIQD4EQH4Af8Dd+2wOpoA0wjJzd6+4cN5ps1q\
gSH//z5A0wivd9MIfjKZADb/ydUa/p8gOxPlzReMMbXhMDEaDiDWNigKDkI9KAUO\
TT0gIPHVEVm/BgQadxMjEPrRExr+ICAENlUTIzZSEyNxEyPV0Rr+gMlDT0xPDgD1\
CEcI66+GJ9JrvwwQ+OuGJzABDHcrG/HIPfV5DgCGJzABDHcY2+Ea/iDCj78TGPe+\
IygCt+kTN+k6nwC3GigCy+/+gMka/kwoBNZVIAQynwATw76FPiDTAuWvMgkBIeQA\
y04gECt+K7bLTygQPoDTAT4PGAY+iNMBPk/TAeHJ//////////////////////8m\
////BSH////S/////////w==";
