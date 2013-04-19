			//context.fillRect(0,0,canvas.width(),canvas.height())
			var pi=Math.PI;
			var v=0.2;
			var allGears=new Array();
			/*init a gear
			 * in 2 ways
			 * 
			 */
			var Gear = function (z,m,x,y){
				this.z=z;
				this.m=m;
				this.d=m*z;
				this.h=m;
				this.c=0.25*m;
				this.x=x;
				this.y=y;
				this.fGear=null;
				this.angle=0;
			}
			function writePosition(fGear,angle){
				var l=(this.d+fGear.d)/2;
				this.x=fGear.x+l*Math.cos(angle);
				this.y=fGear.y+l*Math.sin(angle);
			}
			Gear.prototype.writePosition=writePosition;
			function genGearP(z,fGear,angle){			//create a new gear by angle and gears created before
				
				var tmpGear=new Gear(z,fGear.m,0,0);
				tmpGear.fGear=fGear;
				tmpGear.writePosition(fGear,angle);
				return tmpGear;
			}

			function getAngle(firstGear,secondGear,angle1){
				var x1=firstGear.x;
				var x2=secondGear.x;
				var y1=firstGear.y;
				var y2=secondGear.y;
				var z1=firstGear.z;
				var z2=secondGear.z;
				var a=Math.atan2(y1-y2,x2-x1);
				return (-a+Math.PI*(1-1/z2)-angle1*z1/z2-a*z1/z2);
				
			}
			
			function preCanvasG(anyGear){
				var gcanvas=document.createElement('canvas');
				gcanvas.width=anyGear.d+2*anyGear.h;
				gcanvas.height=anyGear.d+2*anyGear.h;
				var gcontext=gcanvas.getContext('2d');
				gcontext.beginPath();
				for (var i=0; i < anyGear.z; i++) {
					var pi=Math.PI;
					var z=anyGear.z;
					gcontext.arc(anyGear.d/2+anyGear.h,anyGear.d/2+anyGear.h,anyGear.d/2+anyGear.h,i*2*pi/z,(i+1/4)*2*pi/z,false);
					gcontext.arc(anyGear.d/2+anyGear.h,anyGear.d/2+anyGear.h,anyGear.d/2-anyGear.h-anyGear.c,(i+1/2)*2*pi/z,(i+3/4)*2*pi/z,false);
				};
				gcontext.closePath();
				gcontext.stroke();
				gcontext.fillStyle="rgb(255,255,255)";
				gcontext.globalCompositeOperation="destination-over";
				gcontext.globalAlpha="0.7";
				gcontext.fill();
				return gcanvas;
			}
			function prepareAllGears(){ //input gears here
				var i=arguments.length;
				var j;
				var canvases=[];
				for (j=0;j<i;j++){
					canvases.push(preCanvasG(arguments[j]));
					allGears.push(arguments[j]);
				}				
				
				return canvases;
			}
			
			function drawAGear2(canvasG,thisGear,angle){
				var angle=angle-2*Math.PI/thisGear.z*5/8;
				context.save();
				context.translate(thisGear.x,thisGear.y);
				context.rotate(angle);
				context.drawImage(canvasG,-(thisGear.d/2+thisGear.h),-(thisGear.d/2+thisGear.h));
				context.restore();
			}
					
			function eraseAGear(){
				/*TODO*/
			}

			function drawAll(){
				if (rotateTime>=360){
					rotateTime=rotateTime-360;
				}
				context.clearRect(0,0,canvas.width(),canvas.height());
				var rAngle=rotateTime/180*Math.PI;
				// drawAGear2(canvases[0],gear1,rAngle);
				// var angle2=getAngle(gear1,gear2,rAngle);
				// drawAGear2(canvases[1],gear2,angle2);
				// var angle3=getAngle(gear2,gear3,angle2);
				// drawAGear2(canvases[2],gear3,angle3);
				for (var i=0; i < allGears.length; i++) {
				  if(allGears[i].fGear==null){
				  	allGears[i].angle=rAngle;
				  	//console.log(allGears[1].fGear);
				  }
				  else{
				  	allGears[i].angle=getAngle(allGears[i].fGear,allGears[i],allGears[i].fGear.angle);
				  }
				  drawAGear2(canvases[i],allGears[i],allGears[i].angle);
				};
				rotateTime=rotateTime+v;
				requestAnimFrame(function() {drawAll();});
			}
			
		window.requestAnimFrame = (function(callback){
    		return window.requestAnimationFrame ||
   				window.webkitRequestAnimationFrame ||
   				window.mozRequestAnimationFrame ||
    			window.oRequestAnimationFrame ||
    			window.msRequestAnimationFrame ||
    			function(callback){
        			window.setTimeout(callback, 1000 / 60);
    			};
		})();