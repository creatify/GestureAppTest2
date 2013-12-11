var dir = "";
var mXP = null;
var mYP = null;
var disToFire = 20;
var circ = null;
var hammertime = null;
var tf = null;
var tfSock = null;
var firstRun = true;
var firstRunWin = true;
var pmpSocket = null;


// These are the strings to send over the socket to the PMP middleware
var commandStrings = 		[];
commandStrings["up"] = 		"up-----";
commandStrings["left"] = 	"left---";
commandStrings["enter"] = 	"enter--";
commandStrings["right"] = 	"right--";
commandStrings["down"] = 	"down---";

// ON WINDOW READY
window.addEventListener('load', onWindowReady, false);

function onWindowReady() {
	document.body.addEventListener('touchmove', function(e) { 
		e.preventDefault();
    }, false);
    
	if (firstRunWin) {
		firstRunWin = false;
		document.addEventListener("deviceready", onDeviceReady, false);
	}
	
}

// ON DEVICE READY
function onDeviceReady() {

	console.log("setupGestures()");

	if (firstRun) {
		firstRun = false;
		setupGestures();
		setupSocket();
	}
}

// SET UP GESTURES
function setupGestures() {

	// circ = document.getElementById('circle');
	tf = document.getElementById("textoutputid");
	tf.innerHTML = "READY";
	tfSock = document.getElementById("textoutputsocketid");
	if (!hammertime) {
		// hammertime = Hammer(document.getElementById("toucharea"));
		hammertime = Hammer(document.body);
	} else {
		return;
	}
	console.log("setupGestures()");

	hammertime.on("dragend", handleDragEnd);
	hammertime.on("drag", handleDrag);
	hammertime.on("dragstart", handleDragStart);
	hammertime.on("tap", handleTap);

};

// HANDLE ON TAP
function handleTap(ev) {
	console.log("ON TAP: " + ev.type);
	tf.innerHTML = "TAP!";
	sendToSocket(commandStrings["enter"]);
};

// HANDLE DRAG START
function handleDragStart(ev) {
	ev.gesture.preventDefault();
	// tf.innerHTML = "START DRAG";
	console.log("START!!!!!!!!!");
	mXP = ev.gesture.center.pageX;
	mYP = ev.gesture.center.pageY;
};

// HANDLE DRAG END
function handleDragEnd(ev) {
	ev.gesture.preventDefault();
	// tf.innerHTML = "STOP DRAG";
	console.log("STOP!!!!!!!!!");
};

// HANDLE ON DRAGGING
function handleDrag(ev) {
	ev.gesture.preventDefault();
	// ev.stopPropagation();
	var tempXP = ev.gesture.center.pageX;
	var tempYP = ev.gesture.center.pageY;

	// circ.style.left = (tempXP - 10) + "px";
	// circ.style.top = (tempYP - 10) + "px";

	if (Math.abs(tempXP - mXP) >= disToFire) {
		if (tempXP - mXP >= 0) {
			dir = "RIGHT";
			sendToSocket(commandStrings["right"]);
		} else {
			dir = "LEFT";
			sendToSocket(commandStrings["left"]);
		}
		tf.innerHTML = dir;
		mXP = ev.gesture.center.pageX;
	}

	if (Math.abs(tempYP - mYP) >= disToFire) {
		if (tempYP - mYP >= 0) {
			dir = "DOWN";
			sendToSocket(commandStrings["down"]);
		} else {
			dir = "UP";
			sendToSocket(commandStrings["up"]);
		}
		tf.innerHTML = dir;
		mYP = ev.gesture.center.pageY;
	}
};

// SET UP WEB SOCKET
function setupSocket() {
	tfSock.innerHTML = "";
	/*
	tfSock.innerHTML = "setupSocket()";
	
	pmpSocket = new WebSocket('ws://172.16.22.18:5556');

	pmpSocket.onopen = function() {
		tfSock.innerHTML = "SOCKET OPEN";
	};

	pmpSocket.onclose = function() {
		tfSock.innerHTML = "SOCKET CLOSED";
		console.log('Connection closed');
	};

	pmpSocket.onerror = function(error) {
		tfSock.innerHTML = "SOCKET ERROR: " + error;
	};

	pmpSocket.onmessage = function(msg) {
		tfSock.innerHTML = "ON MSG: " + msg;
	};
	*/
};

// SEND BINARY TO SOCKET
function sendToSocket(str) {
	// var binary = toUTF8Array(str);
	// pmpSocket.send(binary.buffer);	
}

// CONVERT STRING TO UTF8 ARRAY
function toUTF8Array(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff))
            utf8.push(0xf0 | (charcode >>18), 
                      0x80 | ((charcode>>12) & 0x3f), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
    }
    // add one last empty bit to the array
    utf8.push(0x00);
    
    return utf8;
};
