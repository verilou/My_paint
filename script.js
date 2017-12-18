$(function(){
	var context = $('#canvas')[0].getContext("2d");
	var clickColor, clickSize, paint, url, action;
	var tool = "Draw";
	var steps = true;
	var started = false;

	$(this).mouseup(function() {
			painting = false;
			started = false;
	});
	var Tool = {
		begX :0,
		begY :0,
		endX :0,
		endY :0,
		init: function(e){
			return [e.pageX - $("#canvas")[0].offsetLeft, e.pageY - $("#canvas")[0].offsetTop];
		},
		Circle: function(){
			var a = this.begX - this.endX
			var b = this.begY - this.endY
			var c = Math.sqrt( a*a + b*b );
			steps = true;
			context.beginPath();
			context.arc(this.begX, this.begY, c, 0, 2 * Math.PI);
			context.lineWidth = clickSize;
			context.strokeStyle, context.fillStyle = clickColor;
			context[action]();
			context.closePath();
		},
		Square: function(){
			steps = true;
			context.beginPath();
			context.rect(this.begX, this.begY, (this.endX - this.begX), (this.endY - this.begY));
			context.strokeStyle, context.fillStyle = clickColor;
			context.lineWidth = clickSize; 
			context.lineJoin = "round";
			context.lineCap="round"; 
			context[action]();
			context.closePath();
		},
		Line: function(){
			steps = true;
			context.beginPath();
			context.moveTo(this.begX, this.begY);
			context.lineTo(this.endX, this.endY);
			context.strokeStyle = clickColor;
			context.lineWidth = clickSize; 
			context.lineJoin = "round";
			context.lineCap="round"; 
			context.stroke();
			context.closePath();
		},
		Draw: function() {
			steps = true;
			if (!started) {
				context.beginPath();
				context.moveTo(this.begX, this.begY);
				context.lineTo(this.begX, this.begY);
				context.strokeStyle = clickColor;
				context.lineWidth = clickSize;
				context.lineJoin = "round";
				context.lineCap="round";
				context.stroke();
				paint = true;
				started = true;
			} 
			else {
				context.lineTo(this.begX, this.begY);
				context.stroke();
			}
		},
		File: function() {
			steps = true;
			var file = new Image();
			console.log(url);
			file.src = url;
			var Y = this.begY;
			var X = this.begX;
			file.onload = function(){
				context.drawImage(file, X, Y);
			}
		}
	}
	$('#canvas').mouseup(function(e){
		paint = false;
	});
	$('#canvas').mouseleave(function(e){
		paint = false;
	});
	$('#File').change(function(e){
		tool = "File";
		url = URL.createObjectURL(e.target.files[0]);
	});
	$('.cmd').click(function(e){ 
		context.globalCompositeOperation="source-over";
		tool = e.target.id;
	});
	$("#canvas").mousedown(function(e){
		clickColor = $("#color").val();
		clickSize = $("#taille").val();
		action = $("#remplir").val();
		if (steps) {
			var coord = Tool.init(e);
			Tool.begX = coord[0];
			Tool.begY = coord[1];
			steps = false;
			if (tool == "Draw" || tool == "File") { 
				Tool[tool]();
			}
		} else if(tool !== "Draw" || tool !== "File") {
			var coord = Tool.init(e);
			Tool.endX = coord[0];
			Tool.endY = coord[1];
			Tool[tool]();
		}
		context.closePath();
		
	});
	$("#Download").click(function(){
		var canvas = document.getElementById("canvas");
		var img = canvas.toDataURL("image/png").replace("image/png","image/octet-stream");
    	window.location = img;
	})
	$("#Rubber").click(function(){
		context.globalCompositeOperation="destination-out";
	});
	$("#canvas").mousemove(function(e) {
		if (paint) {
			var coord = Tool.init(e);
			Tool.begX = coord[0];
			Tool.begY = coord[1];
			Tool[tool]();
		}
	});
});