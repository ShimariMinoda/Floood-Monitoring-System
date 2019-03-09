
function id(i){
	return document.getElementById(i)
}

function sendReq(path,param) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", path, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(param);
}

function getSensors(mode){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if(mode == "loadSensor"){
				placeSensor(this.responseText)
			}else if(mode == "loadSimulation"){
				sensorTable(this.responseText)
			}
		}
	}
	xhttp.open("POST", "./php/updateFlood.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("action=getSensors");
}

function loadSensorMap(){
	setInterval(function(){getSensors("loadSensor")},4000)
}

function placeSensor(sensors){
	device = JSON.parse(sensors)
	id("senseLoc").innerHTML = ""
	for(x=0;x<device.sensors.length;x++){
		//Placing Sensor
		data = JSON.parse(device.sensors[x])
		if(eval("window." + data.name.replace(/ /g,"")) == undefined){
			eval(data.name.replace(/ /g,"") + " = new H.map.Circle({lat:"+data.latitude+",lng:"+data.longitude+"},"+data.radius+",{style:{strokeColor:'white',lineWidth:1,fillColor:'rgba(0,0,0,0.5)'}})")
			
			if(eval(data.name.replace(/ /g,"") + ".Me") == null){
				map.addObject(eval(data.name.replace(/ /g,"")));
			}
		}
		setLevel(data.name.replace(/ /g,""),data.state)
		
		id("senseLoc").innerHTML = id("senseLoc").innerHTML + "<a class='dropdown-item' href='#' onclick='changeLocation(" + JSON.parse(device.sensors[x]).latitude + "," + JSON.parse(device.sensors[x]).longitude + "," + JSON.parse(device.sensors[x]).zoomlvl + ")'>" + JSON.parse(device.sensors[x]).name + "</a>"
		
		
	}
}

function loadSimulateFlood(){
	setTimeout(function(){getSensors("loadSimulation")},2000)
}

function sensorTable(sensors){
	device = JSON.parse(sensors)
	id("senseLoc").innerHTML = ""
	for(x=0;x<device.sensors.length;x++){
		stateLevel = ""
		switch(JSON.parse(device.sensors[x]).state){
			case "0":
			stateLevel = "<option value=0 selected>0</option><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option>"
			break;
			
			case "1":
			stateLevel = "<option value=0>0</option><option value='1' selected>1</option><option value='2'>2</option><option value='3'>3</option>"
			break;
			
			case "2":
			stateLevel = "<option value=0>0</option><option value='1'>1</option><option value='2' selected>2</option><option value='3'>3</option>"
			break;
			
			case "3":
			stateLevel = "<option value=0>0</option><option value='1'>1</option><option value='2'>2</option><option value='3' selected>3</option>"
			break;
		}
		id("senseLoc").innerHTML = id("senseLoc").innerHTML + "<tr><td>" + JSON.parse(device.sensors[x]).name + "</td><td><select id='" + JSON.parse(device.sensors[x]).sid + "' onchange='simulateLevel(this.id,this.value)'>" + stateLevel + "</select></td></tr>"
	}
}

function simulateLevel(i,v){
	path = "./php/updateFlood.php"
	action = "simulateLevel"
	sendReq(path,"action=" + action + "&sid=" + i + "&level=" + v)
}


function setLevel(sense,lvl){
	switch(lvl){
		case "0":
		eval(sense + ".setStyle({strokeColor:'white',fillColor:'rgba(0,0,0,0.5)'})")
		break;
		
		case "1":
		eval(sense + ".setStyle({strokeColor:'white',fillColor:'rgba(255,255,0,0.5)'})")
		break;
		
		case "2":
		eval(sense + ".setStyle({strokeColor:'white',fillColor:'rgba(255,165,0,0.5)'})")
		break;
		
		case "3":
		eval(sense + ".setStyle({strokeColor:'white',fillColor:'rgba(255,0,0,0.5)'})")
		break;
	}
	
}

function putCoordinate(lat,lng,zoomlvl){
	marker.setCenter({lat:lat,lng:lng},true)
	id("lat").value = lat
	id("lng").value = lng
	id("zoom").value = zoomlvl
}

function updateRadius(rad){
	marker.setRadius(rad * 10)
	id("addSensor").removeAttribute("disabled")
}

function changeLocation(lat,lng,zoom){
	map.setCenter({lat:lat,lng:lng})
	map.setZoom(zoom)
}

function updateSensor(){
	path = "./php/updateFlood.php"
	action = "updateSensor"
	name = id("sensorName").value
	sid = id("sensorID").value
	lat = id("lat").value
	lng = id("lng").value
	zoom = id("zoom").value
	rad = id("rad").value
	if(name == "" || sid == ""){ alert("Please fill all the entry."); return;}
	sensors = JSON.parse(localStorage.sensors).sensors
	for(x=0;x<sensors.length;x++){
		if(name == JSON.parse(JSON.parse(localStorage.sensors).sensors[0]).name){
			alert("Sensor name already used");
			return;
		}
	}
	sendReq(path,"action=" + action + "&name=" + name + "&sid=" + sid + "&latitude=" + lat + "&longitude=" + lng + "&zoomlvl=" + zoom + "&radius=" + rad * 10)
	alert("Sensor Name : " + name + "\nSensor ID : " + sid)
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
setTimeout(function(){getLocation()},2000)

function showPosition(position) {
	changeLocation(position.coords.latitude,position.coords.longitude,15)
    userMarker = new H.map.Marker({lat:position.coords.latitude, lng:position.coords.longitude});
    map.addObject(userMarker);
}


/////////////////////////////////////////////////////////////////////////////////////////

coordinate = {'lat':'14.4445','lng':'120.9939'}

var platform = new H.service.Platform({
	'app_id': 'Dcy4qF63QMlEEGMJmA8l',
	'app_code': 'JruboChN7-HXegZGUHiZng',
	'useHTTPS': true
});

// Obtain the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(document.getElementById('mapContainer'),defaultLayers.satellite.traffic,{zoom:15,center: {lat: coordinate.lat , lng: coordinate.lng}});

var mapEvents = new H.mapevents.MapEvents(map);
var behavior = new H.mapevents.Behavior(mapEvents);

function setUpClickListener(map) {
	map.addEventListener('tap', function (evt) {
		var coord = map.screenToGeo(evt.currentPointer.viewportX,evt.currentPointer.viewportY);
		putCoordinate(coord.lat,coord.lng,map.getZoom());
  });
}
function setUpClickListener(map) {
	map.addEventListener('tap', function (evt) {
		var coord = map.screenToGeo(evt.currentPointer.viewportX,evt.currentPointer.viewportY);
		putCoordinate(coord.lat,coord.lng,map.getZoom());
  });
}
setUpClickListener(map)

var marker = new H.map.Circle({lat:0, lng:0},100,{style:{strokeColor:'white',lineWidth:1,fillColor:'rgba(0, 0, 0, 0.7)'}});
map.addObject(marker);



//var circle1 = new H.map.Circle({lat:14.471008954037039, lng:120.96182879186381},800,{style:{strokeColor:'rgba(55, 85, 170, 0.6)',lineWidth:1,fillColor:'rgba(0, 128, 0, 0.7)'}});
//map.addObject(circle1);

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	