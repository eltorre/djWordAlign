var sentence1 = "Ayer mismo había comprado un tractor rojo".split(" ")
var sentence2 = "Ayer compró un coche".split(" ")
var graph1 = []
var graph2 = []
var y1 = 50;
var y2 = 400;
var x_min = 50;
var x_max = 500;
var incX1 = (x_max - x_min) / sentence1.length;
var incX2 = (x_max - x_min) / sentence1.length;
var clickDown = false;
var toJoin = [];
var topWord = false;
var bottom = false;
var linked = [];
var slots = [];
var slotSpace = 15;
var mouseLeft = true;

var paper;

function createLink(elm1, elm2) {
	var myLink = new joint.dia.Link({
		source: {
			id: elm1.id
		},
		target: {
			id: elm2.id
		},
		interactive: false
	});
	paper.model.addCell(myLink);
};

function xslot(desiredx) {
	positive = true;
	times = 1;
	qDesired = ((desiredx - (desiredx % slotSpace)) / slotSpace) * slotSpace;
	while (slots.indexOf(qDesired) != -1) {
		if (positive) {
			qDesired += slotSpace * times;
		} else {
			qDesired -= slotSpace * times;
		}
		positive = !positive;
		times += 1;
	}
	slots.push(qDesired);
	return qDesired;
}

function initpaper(){
	paper = new joint.dia.Paper({
		el: $('#paper'),
		gridSize: 1,
		model: new joint.dia.Graph(),
		interactive: false
	});	
	
	paper.on('cell:pointerdown', function(eventName, cell) {
		mouseLeft = false;
		clickDown = true;
		if (checkLegal(eventName.model), true) {
			toJoin.push(eventName.model);
		}
	});

	paper.on('blank:pointerdown', function(eventName, cell) {
		mouseLeft = false;
		clickDown = true;
	});

	paper.on('cell:pointerup', function(eventName, cell) {
		clickDown = false;
		handleUp();
	});

	paper.on('blank:pointerup', function(eventName, cell) {
		clickDown = false;
		handleUp();
	});

	paper.on('cell:mouseover', function(eventName, cell) {
		if (clickDown == true && checkLegal(eventName.model)) {
			toJoin.push(eventName.model);
		}
	});

	paper.on('cell:mouseout', function(eventName, cell) {
		if (!mouseLeft) {
			if (paper.model.getConnectedLinks(toJoin[0], {inbound: true}).length > 0) {
				toJoin = [];
			}
		}
		mouseLeft = true;
	});

	paper.on('cell:pointerclick', function(eventName, cell) {
		mouseLeft = false;
	});
	
}

function init() {
	initpaper()
	paper.model.clear();
	graph1 = [];
	graph2 = [];
	slots = [];
	for (var i = 0; i < sentence1.length; i++) {
		r = new joint.shapes.basic.Rect({
			position: {
				y: x_min + incX1 * i,
				x: y1
			},
			size: {
				width: 100,
				height: 40
			},
			attrs: {
				text: {
					text: sentence1[i]
				}
			}
		});
		graph1.push(r);
		paper.model.addCell(r);
	}
	for (var i = 0; i < sentence2.length; i++) {
		r = new joint.shapes.basic.Rect({
			position: {
				y: x_min + incX2 * i,
				x: y2
			},
			size: {
				width: incX2 - 5,
				height: 40
			},
			attrs: {
				text: {
					text: sentence2[i]
				}
			}
		});
		graph2.push(r);
		paper.model.addCell(r);
	}
	for (var i = 0; i < sentence1.length; i++) {
		currIndex = -1
		for (var j = 0; j < sentence2.length; j++) {
			if (sentence1[i] == sentence2[j]) {
				if (currIndex == -1) {
					currIndex = j;
				} else {
					currIndex = -1;
					break;
				}
			}
		}
		if (currIndex != -1) {
			toLink = [];
			toLink.push(graph1[i]);
			toLink.push(graph2[currIndex]);
			linkElems(toLink, 'gray');
		}
	}
}

function nextSentence() {
	for (var i = 0; i < graph1.length; i++) {
		if (paper.model.getConnectedLinks(graph1[i], {inbound: true}).length == 0){
			alert ("Align every word");
			return;
		}
	}
	for (var i = 0; i < graph2.length; i++) {
		if (paper.model.getConnectedLinks(graph2[i], {inbound: true}).length == 0){
			alert ("Align every word");
			return;
		}
	}
	init();
}

function handleUp() {
	if (mouseLeft) {
		if (topWord && bottom) {
			linkElems(toJoin, 'aqua');
		} else if (topWord || bottom) {
			linkElems(toJoin, 'lightcoral');
		}
	} else {
		clearConnections(toJoin);
	}
	toJoin = [];
	topWord = false;
	bottom = false;
}

function checkLegal(elem, dontCheckOutgoing) {
	if (toJoin.indexOf(elem) != -1) {	
		return false;	//Already in the list of elements to join
	}
	if (!dontCheckOutgoing && (paper.model.getConnectedLinks(elem, {inbound: true}).length > 0)) {
		return false;	//The word already has a connection
	}
	for (var i = 0; i < graph1.length; i++) {
		if (elem.id == graph1[i].id) {	//The word belongs to the topWord list
			topWord = true;
			return true;
		}
	}
	for (var i = 0; i < graph2.length; i++) {
		if (elem.id == graph2[i].id) {	//The word belongs to the bottom list
			bottom = true;
			return true;
		}
	}
}

function linkElems(toJoin, color) {
	if (toJoin.length > 0) {
		avgX = 0;
		avgY = 0;
		for (var i = 0; i < toJoin.length; i++) {
			toJoin[i].attr({
				rect: {
					fill: color
				}
			});
			avgX += toJoin[i].get('position').y;
		}
		avgX /= toJoin.length;
		r = new joint.shapes.basic.Rect({
			position: {
				y: xslot(avgX + 50),
				x: (x_min + x_max) / 2
			},
			size: {
				width: 5,
				height: 5
			}
		});
		paper.model.addCell(r);
		for (i = 0; i < toJoin.length; i++) {
			createLink(r, toJoin[i]);
		}
	}
}

function clearConnections(toClear) {
	if (toClear.length > 0) {
		toRoot = paper.model.getConnectedLinks(toClear[0], {
			inbound: true
		});
		if (toRoot.length > 0) {
			source = toRoot[0].get('source');
			slots.splice(slots.indexOf(paper.model.getCell(source).get('position').x),1);
			fromRoot = paper.model.getConnectedLinks(source);
			for (var i = 0; i < fromRoot.length; i++) {
				paper.model.getCell(fromRoot[i].get('target')).attr({
					rect: {
						fill: 'white'
					}
				});
			}
			paper.model.getCell(source).remove();
		}
	}
}

