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
  
	<body onload="loadSimulateFlood()">
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
			<div class="col-sm-3" align="center">
				</br>
				<h4 data-toggle="collapse" data-target="#control" style="cursor:pointer">Simulate Flood</h4>
				<div style="overflow:auto">
					<table class="table table-striped">
					<thead>
					  <tr>
						<th>Sensor</th>
						<th>Flood Level</th>
					  </tr>
					</thead>
					<tbody id="senseLoc">
					  
					</tbody>
				  </table>
				</div>
			</div>
			<div id="mapContainer" class="col-sm-9"></div>
		</div>
		<script src="js/map.js"></script>
	</body>
</html>



























