<!DOCTYPE html>
<html>
<head>
	<title>Page de test</title>
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
   	<link rel="stylesheet" type="text/css" href="css/index.css">
</head>
<body>
	<div id="mymap"></div>
	<button id="pointbtn" class="btn btn-primary">Place point</button>Color:
	<select id="pointcolor">
		<option>Blue</option>
		<option>Red</option>
		<option>Green</option>
		<option>White</option>
		<option>Orange</option>
		<option>Black</option>
	</select>
	<button id="pathbtn" class="btn btn-primary">Draw path</button>Color:
	<select id="pathcolor">
		<option>Blue</option>
		<option>Red</option>
		<option>Green</option>
		<option>White</option>
		<option>Orange</option>
		<option>Black</option>
	</select>Speed:
	<select id="speed">
		<option>1</option>
		<option>2</option>
		<option>3</option>
		<option>4</option>
		<option>5</option>
		<option>6</option>
		<option>7</option>
		<option>8</option>
	</select>
	<select id="direction">
		<option>Forward</option>
		<option>Backward</option>
	</select>
	<select id="icon">
		<option value="marker1.png">Marker1</option>
		<option value="marker2.png">Marker2</option>
		<option value="marker3.png">Marker3</option>
		<option value="marker4.png">Marker4</option>
	</select>
	<select id="tile" >
		<option>Osmap</option>
		<option>MB Satellite</option>
		<option>OS France</option>
		<option>MB Terrain</option>
		<option>MB Streets</option>
		<option>MB Hybrid</option>	
	</select>
	<button id="simulate" class="btn btn-primary">Simulate</button>
	<button id="clear" class="btn btn-primary">Clear</button>
	<button id="save" class="btn btn-primary">Save</button>
	<button id="read" class="btn btn-primary">Retrieve</button>
	
	<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
				   integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
		   crossorigin=""></script>
	<script type="text/javascript" src="js/index.js"></script>
</body>
</html>
