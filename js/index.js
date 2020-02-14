const mymap = L.map("mymap").setView([51.508, -0.11],13),marker = L.marker(),
path = L.polyline([],{weight:2}).addTo(mymap);

let pen="up", points=[], reference=null, positions=[], paces=[], pointcolor="blue", pathcolor="blue",
firstpoint = true, currentTile = null;
let tiles = {	openstreetmap:['https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
					{attribution:' <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				}],
				'mapbox/streets-v11':['https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
				{	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    				id: 'mapbox/streets-v11',accessToken: 'pk.eyJ1IjoiaGFuYXRvbGUiLCJhIjoiY2s2bGVwZ21jMDQ1ajNocnVzbnB0eXN0NyJ9.CwOTvqqLpO8EKvECEN4mDQ'
    			}],
    			'mapbox/satellite-v9':['https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
				{	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    				id: 'mapbox/satellite-v9',accessToken: 'pk.eyJ1IjoiaGFuYXRvbGUiLCJhIjoiY2s2bGVwZ21jMDQ1ajNocnVzbnB0eXN0NyJ9.CwOTvqqLpO8EKvECEN4mDQ'
    			}]
			};

setTile();
mymap.on("click", mapClicked);
document.querySelector("#clear").addEventListener("click", clear);
document.querySelector("#pathbtn").addEventListener("click", function(e){setPen("path");});
document.querySelector("#pointbtn").addEventListener("click", function(e){setPen("point");});
document.querySelector("#read").addEventListener("click", retrieve);
document.querySelector("#save").addEventListener("click", save);
document.querySelector("#tile").addEventListener("change", setTile);

document.querySelector("#pathcolor").addEventListener("change", function(e){
	setPathcolor(e.target.value);
});

document.querySelector("#icon").addEventListener("change", function(e){
	if(pen==="busy" || positions.length==0) 
		return;
	marker.setIcon(L.icon({iconUrl:"images/"+e.target.value, iconSize:[50, 50], iconAnchor:[25,50]}));
});

document.querySelector("#pointcolor").addEventListener("change", function(e){
	setPointcolor(e.target.value);
	points.forEach(point=>{ point.setStyle({color:pointcolor, fillColor:pointcolor}); });
});

document.querySelector("#simulate").addEventListener("click", function(e){
	if(positions.length==0 || pen==="busy") 
		return;
	setPen("busy");
	simulate(e);
});

function clear(){
	if(positions.length==0){
		points.forEach(point=>{ point.remove();});
		points =[];
		setPen("point");
	}else{
		positions =[], paces=[];
		clearInterval(reference), path.setLatLngs([]), marker.remove();
		setPen("path");
	}
	firstpoint=true;
}

function computePaces(x1, y1, alpha, beta, dl){
	let speed=9-parseInt(getValue("#speed"));
	for(let i=1; i<speed; ++i)
		paces.push([y1+alpha*i*dl, x1+beta*i*dl]);
}

function draw(latlng){
	if(points.length==0) return;
	if(positions.length==0){
		let icon = getValue("#icon");
		marker.setLatLng(latlng).addTo(mymap);
		marker.setIcon(L.icon({iconUrl : "images/"+icon, iconSize: [50, 50], iconAnchor:[25,50]}));
	}
	positions.push(latlng);
	path.addLatLng(latlng);
}

function getValue(id){
	return document.querySelector(id).value;
}

function mapClicked(e){
	switch(pen){
		case "point":{
			place(e.latlng);
			break;
		}
		case "path":{
			draw(e.latlng);
			break;
		}
		default:
			return;
	}
}

function parsePath(point1, point2){
	let x1 = point1.lng, y1= point1.lat, x2 = point2.lng, y2 = point2.lat;
	
	if(x1==x2 && y1==y2) 
		return;
	speed=9-parseInt(getValue("#speed"));
	paces.push([y1, x1]);
	if(x1==x2){
		computePaces(x1, y1, 1, 0, (y2-y1)/speed);
	}else{
		if(y1==y2){
			computePaces(x1, y1, 0, 1, (x2-x1)/speed);
		}else{
			computePaces(x1, y1, (y2-y1)/(x2-x1), 1, (x2-x1)/speed);
		}
	}
}

function place(point){
	let color = getValue("#pointcolor");
	if(firstpoint){
		mymap.setView(point);
		firstpoint=false;
	}
	point = L.circle(point, {color: color, fillColor:color, fillOpacity: 1,radius: 70}).addTo(mymap);
	points.push(point);
}

function retrieve(){
	let data;

	data = prompt("Enter a name: ");
	data = (data!=="")?data.trim():"";
	if(sessionStorage[data]===undefined){
		alert("There is no such data!!");
		return;
	}
	clear();
	data = JSON.parse(sessionStorage.getItem(data));
	pointcolor = data["pointcolor"];
	path.setStyle({color:data["pathcolor"]});

	data["points"].forEach(point=>{place(point);});
	data["positions"].forEach(position=>{draw(position);});
}

function save(){
	let cities = [], name, value;

	if(points.length===0)
		return;
	do{
		name =prompt("Enter a name: ");
		name = (name==="")?"":name.trim();
		if(sessionStorage[name]===undefined)
			break;
	} while(!confirm("This name is already used. Do you want overriding the existing data ?"));
	
	points.forEach(e=>{ cities.push(e.getLatLng());});
	value = {
		points : cities, positions : positions, pointcolor : pointcolor,
		pathcolor :getValue("#pathcolor")
	}
	sessionStorage.setItem(name, JSON.stringify(value));
}

function setPaces(){
	let i=1, direction = getValue("#direction");

	if(direction==="Forward"){
		for(i=1; i<positions.length; ++i)
			parsePath(positions[i-1], positions[i]);
		paces.push(positions[positions.length-1]);
	}else{
		for(i=positions.length-1; i>0; --i)
			parsePath(positions[i], positions[i-1]);
		paces.push(positions[0]);
	}
	marker.setLatLng(paces[0]);
}

function setPathcolor(color){
	pathcolor = color;
	path.setStyle({color:color})
}

function setPen(value){
	pen = (pen==="busy" && value!=="up")?pen:value;
}

function setPointcolor(color){
	pointcolor = color;
}

function setTile(){
	let name = getValue("#tile").toLowerCase();
	if(currentTile)
		currentTile.remove();
	currentTile = L.tileLayer(tiles[name][0], tiles[name][1]).addTo(mymap);
}

function simulate(e){
	let i=1;

	paces=[], firstClick=true;
	setPaces();
	reference = setInterval(function(){
		if(i>=paces.length) {
			setPen("up");
			clearInterval(reference);
		}else{
			marker.setLatLng(paces[i]).bindPopup("<strong>"+paces[i]+"</strong>");
		}
		i++;
	},1000);
}