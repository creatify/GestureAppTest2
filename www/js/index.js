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
commandStrings["up"] = 		"up-----\0";
commandStrings["left"] = 	"left---\0";
commandStrings["enter"] = 	"enter--\0";
commandStrings["right"] = 	"right--\0";
commandStrings["down"] = 	"down---\0";

// ON WINDOW READY
window.addEventListener('load', onWindowReady, false);
function onWindowReady() {
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

	circ = document.getElementById('circle');
	tf = document.getElementById("textoutputid");
	tf.innerHTML = "READY";
	tfSock = document.getElementById("textoutputsocketid");
	if (!hammertime) {
		hammertime = Hammer(document.getElementById("toucharea"));
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
};

// HANDLE DRAG START
function handleDragStart(ev) {
	ev.gesture.preventDefault();
	tf.innerHTML = "START DRAG";
	console.log("START!!!!!!!!!");
	mXP = ev.gesture.center.pageX;
	mYP = ev.gesture.center.pageY;
};

// HANDLE DRAG END
function handleDragEnd(ev) {
	ev.gesture.preventDefault();
	tf.innerHTML = "STOP DRAG";
	console.log("STOP!!!!!!!!!");
};

// HANDLE ON DRAGGING
function handleDrag(ev) {
	ev.gesture.preventDefault();
	// ev.stopPropagation();
	var tempXP = ev.gesture.center.pageX;
	var tempYP = ev.gesture.center.pageY;

	circ.style.left = (tempXP - 10) + "px";
	circ.style.top = (tempYP - 10) + "px";

	if (Math.abs(tempXP - mXP) >= disToFire) {
		if (tempXP - mXP >= 0) {
			dir = "RIGHT";
		} else {
			dir = "LEFT";
		}
		tf.innerHTML = dir;
		mXP = ev.gesture.center.pageX;
	}

	if (Math.abs(tempYP - mYP) >= disToFire) {
		if (tempYP - mYP >= 0) {
			dir = "DOWN";
		} else {
			dir = "UP";
		}
		tf.innerHTML = dir;
		mYP = ev.gesture.center.pageY;
	}
};

// SET UP WEB SOCKET
function setupSocket() {
	
	tfSock.innerHTML = "setupSocket()";
	
	pmpSocket = new WebSocket('ws://172.16.22.18:5556');

	pmpSocket.onopen = function() {
		tfSock.innerHTML = "SOCKET OPEN";
		// ​var array = new Uint8Array(new ArrayBuffer(commandStrings["enter"]));	pmpSocket.send(array.buffer);
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
};
