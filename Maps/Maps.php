<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
		
		<link rel="stylesheet" href="style/style.css">
		
		
		<script src="https://js.api.here.com/v3/3.0/mapsjs-core.js" type="text/javascript" charset="utf-8"></script>
		<script src="https://js.api.here.com/v3/3.0/mapsjs-service.js" type="text/javascript" charset="utf-8"></script>
		<script src="https://js.api.here.com/v3/3.0/mapsjs-mapevents.js" type="text/javascript" charset="utf-8"></script>
	</head>
  
	<body onload="loadSensorMap()">
		<nav class="navbar navbar-expand-sm bg-dark navbar-dark">
			<ul class="navbar-nav">
				<li class="nav-item active">
					<a class="nav-link" href="./Client.php">Flood Sense</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="./Client.php">User View</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="./Maps.php">Add Sensor</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="./Simulate.php">Simulate Flood</a>
				</li>
			</ul>
		</nav>

		<div class="row">
			<div class="col-sm-2" align="center">
				</br>
				<h5 data-toggle="collapse" data-target="#control" style="cursor:pointer">Add Sensor Location</h5>
				<div id="control" class="collapse">
					<input type="text" id="sensorName" class="form-control" placeholder="Sensor Name" maxlength="30">
					<input type="text" id="sensorID" class="form-control" placeholder="Sensor ID" maxlength="6">
					<input type="text" id="lat" class="form-control" placeholder="Latitude" disabled>
					<input type="text" id="lng" class="form-control" placeholder="Longitude" disabled>
					<input type="text" id="zoom" class="form-control" placeholder="Zoom Level" disabled>
					<input type="number" id="rad" value="1" onchange="updateRadius(this.value)" class="form-control" placeholder="Radius" min=0>
					<button id="addSensor" type="button" class="btn btn-primary btn-block" onclick="updateSensor()" disabled>Add Sensor</button>
				</div>
				<hr>
				<div class="dropdown" align="right">
					<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
						Available Sensor
					</button>
					<div class="dropdown-menu" id="senseLoc">
					</div>
				</div>
			</div>
			<div id="mapContainer" class="col-sm-10"></div>
		</div>
		<script src="js/map.js"></script>
	</body>
</html>



























