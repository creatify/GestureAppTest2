var dir = "";
var mXP = null;
var mYP = null;
var disToFire = 20;
var circ = null;
var hammertime = null;
var tf = null;
var firstRun = true;
var firstRunWin = true;

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
	// tf.innerHTML = "READY";
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
	// tf.innerHTML = "TAP!";
};

// HANDLE DRAG START
function handleDragStart(ev) {
	ev.gesture.preventDefault();
	// tf.innerHTML = "START!";
	console.log("START!!!!!!!!!");
	mXP = ev.gesture.center.pageX;
	mYP = ev.gesture.center.pageY;
};

// HANDLE DRAG END
function handleDragEnd(ev) {
	ev.gesture.preventDefault();
	// tf.innerHTML = "STOP!";
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
		// tf.innerHTML = dir;
		mXP = ev.gesture.center.pageX;
	}

	if (Math.abs(tempYP - mYP) >= disToFire) {
		if (tempYP - mYP >= 0) {
			dir = "DOWN";
		} else {
			dir = "UP";
		}
		// tf.innerHTML = dir;
		mYP = ev.gesture.center.pageY;
	}
};
var pmpSocket = null;
function setUpSocket() {
	var pmpSocket = new WebSocket('ws://172.16.22.18:5556');

	pmpSocket.onopen = function() {
		tf.innerHTML = "SOCKET OPEN";
		pmpSocket.send("enter--");
	};

	pmpSocket.onclose = function() {
		tf.innerHTML = "SOCKET CLOSED";
		console.log('Connection closed');
	};

	pmpSocket.onerror = function(error) {
		tf.innerHTML = "SOCKET ERROR: " + error;
	};

	pmpSocket.onmessage = function(msg) {
		tf.innerHTML = "ON MSG: " + msg;
	};
};
