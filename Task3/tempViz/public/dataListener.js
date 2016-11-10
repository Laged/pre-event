//Graph parameters
var dataset = new vis.DataSet();
var graph2d;
//Initialize graph
function createGraph() {
	var container = document.getElementById('dataGraph');
	var options = {
		start: vis.moment().add(-1, 'minutes'),
		end: vis.moment().add(+1, 'minutes'),
		dataAxis: {
			left: {
				range: {
					min: 15, max: 30
				},
				title: {
					text: 'Temperature'
				}
			}
		},
		drawPoints: {
			style: 'circle'
		},
		graphHeight: '100%',
		interpolation: {
			enabled: false
		},
		format: {
		  minorLabels: {
		    millisecond:'',
		    second:     '',
		    minute:     'HH:mm',
		    hour:       'HH:mm',
		    weekday:    '',
		    day:        '',
		    month:      '',
		    year:       ''
		  },
		  majorLabels: {
		    millisecond:'',
		    second:     '',
		    minute:     '',
		    hour:       '',
		    weekday:    '',
				day:        '',
				month:      '',
				year:       ''
		  }
		},
		legend: {
			right: {
				position: 'top-left'
			},
			enabled: false
		},
		defaultGroup: '?',
  	timeAxis: {
			scale: 'minute',
			 step: 5
		 }
	 };
	graph2d = new vis.Graph2d(container, dataset, options);
	graph2d.fit();
	//Define the rendering step
	function renderStep() {
		var now = vis.moment();
		var range = graph2d.getWindow();
		var interval = range.end - range.start;
		graph2d.setWindow(now - interval, now, {animation: false});
		//setTimeout(renderStep, 500);
		requestAnimationFrame(renderStep);
	}
	//Start rendering
	renderStep();
}

//Add data to log
function addLog(data) {
	//Get the data log container
	var mainContainer = document.getElementById('dataLog');
	//Create HTML based on data
	var dataContainer = document.createElement('div');
	dataContainer.setAttribute('class', 'dataElement');
	var currentData = document.createElement('p');
	currentData.setAttribute('class', 'data');
	var currentDataText = document.createTextNode(data.id + ': ' + data.value);
	currentData.appendChild(currentDataText);
	var timeStamp = document.createElement('p');
	timeStamp.setAttribute('class', 'timeStamp');
	var timeStampText = document.createTextNode(data.timeStamp);
	timeStamp.appendChild(timeStampText);
	var clear = document.createElement('div');
	clear.setAttribute('class', 'clear');
	//Append data do the container
	dataContainer.appendChild(currentData);
	dataContainer.appendChild(timeStamp);
	dataContainer.appendChild(clear);
	mainContainer.appendChild(dataContainer);
	//Scroll if needed
	mainContainer.scrollTop = mainContainer.scrollHeight;
}

//Dummy data adding function
function y(x) {
	return 3 + Math.sin(x)/ 4;
}

//Add data to graph
function addDummyData() {
	var now = vis.moment().subtract(1, 'minutes');
	//Add dummy data
	dataset.add({
		x: now,
		y: y(now/1000),
		group: 'E1',
		content: 'E1'
	});
	//Remove data that is not visible
	var range = graph2d.getWindow();
	var interval = range.end - range.start;
	var oldIds = dataset.getIds({
		filter: function(item) {
			return item.x < range.start - interval;
		}
	});
	dataset.remove(oldIds);
	setTimeout(addDummyData, 1000);
}

function addData(data) {
	console.log("Adding: ", data);
	//Add new data
	var now = vis.moment().subtract(1, 'minutes');
	var options = {
			x: now,
			y: data.value,
			group: data.id
	}
	if (data.label === '1') {
		options['label'] = {content: data.id};
	}
	dataset.add(options);
	//Remove data that is not visible
	var range = graph2d.getWindow();
	var interval = range.end - range.start;
	var oldIds = dataset.getIds({
		filter: function(item) {
			return item.x < range.start - interval;
		}
	});
	dataset.remove(oldIds);
}


//Listen to websockets
//Change when hosting locally
var ws = new WebSocket('ws://temperatureviz.azurewebsites.net/');
//var ws = new WebSocket('ws://localhost:1337/');
ws.onmessage = function(msg) {
	//Parse data
	var data = JSON.parse(msg.data);
	//addLog(data);
	addData(data);
};

createGraph();
addDummyData();
