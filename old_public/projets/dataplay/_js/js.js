$( document ).ready(function() {

	var myApp = new Framework7({
			// Default title for modals
			modalTitle: 'My App',

			// If it is webapp, we can enable hash navigation:
			pushState: true,

			// Hide and show indicator during ajax requests
			onAjaxStart: function (xhr) {
					myApp.showIndicator();
			},
			onAjaxComplete: function (xhr) {
					myApp.hideIndicator();
			}
	});

	// DEBUT CODE GET DATA /////////////////////////////////

	var data2 =	$.post("http://christian-delfosse.infographie-heaj.eu/Twitter/relayQuery.php",{"query":"http://ergast.com/api/f1/current/results.json"},jsonCallback2,"json");

	function jsonCallback2(bite){
			databite = bite;
			var data =	$.post("http://christian-delfosse.infographie-heaj.eu/Twitter/relayQuery.php",{"query":"http://ergast.com/api/f1/current.json"},jsonCallback,"json");
	}

	var round = [],
			lat = [],
			long = [],
			locality = [],
			circuitName = [],
			country = [],
			databite,
			position = [],
			driverName = [],
			driverSurname = [],
			driverName2 = [],
			driverSurname2 = [],
			points = [];

	// var races = [];
	//
	//   races.push({
	//     "positon" : [],
	//     "driverName" : [],
	//     "driverSurname" : [],
	//     "points" :[]
	//   })
	//
	//   races[0].position[];

	function jsonCallback(data){
		function onDataGet() {

			for (var i = 0; i < data.MRData.RaceTable.Races.length; i++) {

				round.push(data.MRData.RaceTable.Races[i].round);
				lat.push(data.MRData.RaceTable.Races[i].Circuit.Location.lat);
				long.push(data.MRData.RaceTable.Races[i].Circuit.Location.long);
				locality.push(data.MRData.RaceTable.Races[i].Circuit.Location.locality);
				circuitName.push(data.MRData.RaceTable.Races[i].Circuit.circuitName);
				country.push(data.MRData.RaceTable.Races[i].Circuit.Location.country);
			}

			for (var i = 0; i < databite.MRData.RaceTable.Races[0].Results.length; i++) {

				driverName.push(databite.MRData.RaceTable.Races[0].Results[i].Driver.familyName);
				driverSurname.push(databite.MRData.RaceTable.Races[0].Results[i].Driver.givenName);
				points.push(databite.MRData.RaceTable.Races[0].Results[i].points);

			}

			for (var i = 0; i < databite.MRData.RaceTable.Races[1].Results.length; i++) {

				driverName2.push(databite.MRData.RaceTable.Races[1].Results[i].Driver.familyName);
				driverSurname2.push(databite.MRData.RaceTable.Races[1].Results[i].Driver.givenName);

			}
		}
		onDataGet();
		// driverName.push(databite.MRData.RaceTable.Races[i].Results[i].Driver.familyName);
		// console.log(driverName);

	// FIN CODE GET DATA //////////////////////////////////

		// Initialize some variables:
					var mousePos;

					var element = '.globe',
						width = $(element).width(),
						height = $(element).height(),
						centered,
						sens = 0.25,
  					focused;

					var radius = 10,
						hoverRadius = 15;
					var features, circles;

					// Configuration for the spinning effect
						var time = Date.now();
						var rotate = [0, 0];
						var velocity = [.010, -0];

				    var projection = d3.geo.orthographic()
					    .scale(225)
					    .translate([width / 2, height / 2])
					    .clipAngle(90);

					// Save the path generator for the current projection:
					var path = d3.geo.path()
					    .projection(projection)
					    .pointRadius( function(d,i) {
				    		return radius;
				    	});
					// Define the longitude and latitude scales, which allow us to map lon/lat coordinates to pixel values:
					var lambda = d3.scale.linear()
					    .domain([0, width])
					    .range([-180, 180]);

					var lambdaInv = d3.scale.linear()
							.domain([-180,180])
							.range([0,width]);

					var phi = d3.scale.linear()
					    .domain([0, height])
					    .range([90, -90]);

					var phiInv = d3.scale.linear()
							.domain([90,-90])
							.range([0,height]);
					// Create the drawing canvas:
					var svg = d3.select(".globe").append("svg:svg")
					    .attr("width", '100%')
					    .attr("height", '100%');
					//Create a base circle: (could use this to color oceans)
				    var backgroundCircle = svg.append("svg:circle")
				        .attr('cx', width / 2)
				        .attr('cy', height / 2)
				        .attr('r', 0)
				        .attr('class', 'geo-globe');

					// Make a <g> tag to group all our countries, which is useful for zoom purposes. (child elements belong to a 'group', which we can zoom all-at-once)
				    var world = svg.append('svg:g').attr('id', 'world');
				    var zoomScale = 1;

				    // Create the element group to mark individual locations:
				    var locations = svg.append('svg:g')
				    	.attr('id', 'locations');

						var countryTooltip = d3.select("body").append("div").attr("class", "countryTooltip animated fadeIn").attr("id", "countryTooltip");

						var roundTool =
						d3.select("div.countryTooltip").append("h2").attr("class", "titleTool");

						var circuitTool = d3.select("div.countryTooltip").append("p").attr("class", "circuitTool");

						var localityTool = d3.select("div.countryTooltip").append("p").attr("class", "localityTool");

						var countryTool = d3.select("div.countryTooltip").append("p").attr("class", "countryTool");
				    // Having defined the projection, update the backgroundCircle radius:

					backgroundCircle.attr('r', projection.scale() );

					// Construct our world map based on the projection:
		    d3.json('_js/world-110m.json', function(collection) {

				features = world.selectAll('path')
					.data(collection.features)
					.enter()
					.append('svg:path')
						.attr('class', 'geo-path')
						.attr('d', path);

				features.append('svg:title')
					.text( function(d) { return d.properties.name; });


			}); // end FUNCTION d3.json()

			function drawPointOnMap() {

			for (var i = 0; i < round.length; i++) {

					locations.append("path")
					 .datum({type: "Point", coordinates: [long[i],lat[i]]})
					 .attr('class', 'geo-node')
					 .attr("id", i)
					 .attr('d', path)
					 .attr("fill", "red")
						.on('mouseover', mouseover)
						.on('mouseout', mouseout)

						document.getElementsByClassName('geo-node')[i].addEventListener("click",function(e){
							var index = this.id;
							this.classList.add("geo-node-click");

							if (this.classList.contains("geo-node-click")) {
								this.classList.remove("geo-node-click");
							}

							(function(index) {

								d3.transition()
					      .duration(1500)
					      .tween("rotate", function() {
					        var r = d3.interpolate(projection.rotate(), [-long[index],-lat[index]] );
									return function(t) {
					        	projection.rotate(r(t));
					        	svg.selectAll("path").attr("d", path);
									}

								});

					    })(index);

						});
			}

		}
		drawPointOnMap();


		// START INTERFACE

		for(var i in locality){
			var node = document.createElement("li");
			var divShow = document.createElement("div");
			var divHide = document.createElement("div");
			var h2 = document.createElement("h2");
			node.appendChild(divShow);
			node.appendChild(divHide);
			divShow.appendChild(h2);
			// divShow.appendChild(arrow);
			node.setAttribute("id",i);
			node.setAttribute("class","place accordion-item");
			h2.setAttribute("class","round");
			divShow.setAttribute("class","divShow accordion-item-toggle");
			divHide.setAttribute("class","divHide accordion-item-content");
			var roundLi = document.createTextNode("Race "+round[i]);

			h2.appendChild(roundLi);
			document.getElementById('select-country').appendChild(node);

			for (var x = 0; x < 5; x++) {

				var divPilote = document.createElement("div");
				divHide.appendChild(divPilote);
				divPilote.setAttribute("class","pilote");
				var p = document.createElement("p");
				var p2 = document.createElement("p");
				var p3 = document.createElement("p");
				divPilote.appendChild(p);
				divPilote.appendChild(p2);
				divPilote.appendChild(p3);
				p.setAttribute("class","position");
				p2.setAttribute("class","name");
				p3.setAttribute("class","points");
				var positionLi = document.createTextNode(x+1);
				var nomLi = document.createTextNode(driverSurname[x] +" "+ driverName[x]);
				var pointsLi = document.createTextNode(points[x]+" points");
				p.appendChild(positionLi);
				p2.appendChild(nomLi);
				p3.appendChild(pointsLi);
			}
		}

		for(var i in locality){
			document.getElementsByClassName('place')[i].addEventListener("click",function(e){
				var index = this.id

				path.pointRadius( function(d,i) {
					return hoverRadius;
				});


				(function(index) {

					d3.transition()
		      .duration(1500)
		      .tween("rotate", function() {
		        var r = d3.interpolate(projection.rotate(), [-long[index],-lat[index]] );
						return function(t) {
		        	projection.rotate(r(t));
		        	svg.selectAll("path").attr("d", path);
						}

					});

		    })(index);

			});
		}

		// END INTERFACE

		// GLOBE ROTATION


			function spinning_globe(){
   d3.timer(function() {

      // get current time
      var dt = Date.now() - time;

      // get the new position from modified projection function
	      projection.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);

      // update cities position = redraw
      svg.selectAll("path").attr("d", path);
			locations.select("path"[i])
				.on('mouseover', mouseover)
				.on('mouseout', mouseout);
   });

	}
		// spinning_globe();

						// console.log(locations.selectAll("path"));
						// .on('mouseover', mouseover)
						// .on('mouseout', mouseout)

		// END GLOBE ROTATION

		//Drag event
		svg.selectAll("#world, circle")
    .call(d3.behavior.drag()
      .origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
      .on("drag", function() {
        var rotate = projection.rotate();
        projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
        svg.selectAll("path").attr("d", path);
        // svg.selectAll(".focused").classed("focused", focused = false);
      }))


			// d3.select(window)
			//     .on("mousemove", mousemove)
			//     .on("mouseup", mouseup);
			//
			// svg.on('mousedown', mousedown);
			// // Setup zoom behavior:
		  //   var zoom = d3.behavior.zoom(true)
		  //       .scale( projection.scale() )
		  //       .scaleExtent([100, 800])
		  //       .on("zoom", globeZoom);
		    // svg.call(zoom)
		    // 	.on('dblclick.zoom', null);
		    // MOUSE EVENTS //

		    function mouseover(d, i) {

		    	path.pointRadius( function(d,i) {
		    		return hoverRadius;
		    	});

					for(var i in locality){
						// var points = document.getElementsByClassName('geo-node')[i];
						// console.log(points);
						var index = this.id;

						var el = document.getElementById("countryTooltip");
						el.classList.add("fadeIn");
						el.classList.remove("fadeOut");

			      d3.select(this).attr('d', path);
						roundTool.text("Race "+round[index])
						circuitTool.text(circuitName[index])
						localityTool.text(locality[index])
						countryTool.text(country[index])
						countryTooltip.style("left", (d3.event.pageX + 7) + "px")
			      .style("top", (d3.event.pageY - 15) + "px")
			      .style("display", "block")
			      .style("opacity", 1);

						// var text = document.createTextNode(round[i]);
						// titleTool.appendChild(text);


				}

		    }; // end FUNCTION mouseover(d,i)

		    function mouseout(d, i) {
					var el = document.getElementById("countryTooltip");
					el.classList.add("fadeOut");
					el.classList.remove("fadeIn");
					countryTooltip.style("opacity", 0);
					d3.select("countryTooltip").attr("class", "fadeOut");
		    	path.pointRadius( function(d,i) {
		    		return radius;
		    	});

		    	// Reduce the circle radius to its pre-mouseover state:
		        d3.select(this).attr('d', path);

		    }; // end FUNCTION mouseout(d,i)

		  //  	function mousedown() {
			//
		  //   	// Determine mouse pixel coordinates:
			//   	mousePos = [d3.event.pageX, d3.event.pageY];
			//
			//   	// Prevent the default behavior for mouse down events:
			//   	d3.event.preventDefault();
			//
			// }; // end FUNCTION mousedown()
			//
			function mousemove() {
				// Has the mouse button been released?
			  	if (mousePos) {
						countryTooltip.style("left", (d3.event.pageX + 7) + "px")
      			.style("top", (d3.event.pageY - 15) + "px");
			  		// var p = d3.mouse(svg[0][0]);
				    // projection.rotate([lambda(p[0]), phi(p[1])]);
				    // svg.selectAll("path").attr("d", path);
			    };
			//
			 }; // end FUNCTION mousemouse()
			//
			// function mouseup() {
			//
			// 	// Do we have mouse coordinates?
			//   if (mousePos) {
			//
			//   	// Yes, so update the map based on the final mouse coordinates and clear the mouse position:
			//     mousemove();
			//     mousePos = null;
			//
			//   };
			//
			// }; // end FUNCTION mouseup()
		//
		// function globeZoom() {
		// 		if (d3.event) {
		// 			var _scale = d3.event.scale;
		// 				projection.scale(_scale);
		// 				backgroundCircle.attr('r', _scale);
		// 				path.pointRadius( radius );
		// 				features.attr('d', path);
		// 			svg.selectAll("path").attr('d', path);
		// 		};
		// 	};

	}

	// document.getElementById("link").addEventListener("click", function(event){
	//     event.preventDefault();
	// });

// $('#link').unbind('click');

$('#link').on("click", function(d) {
          var url = "https://medium.com/@benjaminbours/case-study-workshop-dataplay-6567d8d64eff#.r0fxupdfh" + d.name +
                      "?id2=" + (d.parent ? d.parent.name : "");
          $(location).attr('href', url);
          window.location = url;
 });

});
