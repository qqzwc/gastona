/*
trassos2D-min.js version 0.201906 / canvasynca
composed by vec3.js + canvasSync.js + trassos2D.js minified
is part of the open source project https://github.com/wakeupthecat/gastona

Copyright (C) 2015-2019 Alejandro Xalabarder Aulet
@license : GNU General Public License (GPL) version 3

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.
*/
function vec3(a,c,b){this.x=a||0;this.y=c||0;this.z=b||0}vec3.prototype={toString:function(){return this.x+", "+this.y+", "+this.z},fromArray:function(a,b,d){d=d||3;var c=(b||0)*d;this.set(+(a[c]),+(a[1+c]),(d>2?+(a[2+c]):0))},setIntoArray:function(a,b,d){d=d||3;b=b||(a.length/d);var c=b*d;a[c]=this.x;a[c+1]=this.y;if(d>2){a[c+2]=this.z}},plus:function(a){this.x+=a.x;this.y+=a.y;this.z+=a.z},minus:function(a){this.x-=a.x;this.y-=a.y;this.z-=a.z},mult:function(a){this.x*=a;this.y*=a;this.z*=a},div:function(a){if(a===0){a=1e-20}this.x/=a;this.y/=a;this.z/=a},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},cross:function(a){return new vec3(this.y*a.z-this.z*a.y,this.z*a.x-this.x*a.z,this.x*a.y-this.y*a.x)},norm:function(){return Math.sqrt(this.dot(this))},normalize:function(){this.div(this.norm())},angle:function(b){return Math.acos(this.dot(b)/(this.norm()*b.norm()))},clone:function(){return new vec3(this.x,this.y,this.z)},set:function(a,c,b){if(a instanceof vec3){this.x=a.x;this.y=a.y;this.z=a.z}else{this.x=a||0;this.y=c||0;this.z=b||0}}};function vec3FromTo(c,b){var a=b.clone();a.minus(c);return a}function vec3FromArray(a,b,d){var c=new vec3();c.fromArray(a,b,d);return c}function canvasSync(h){var l=h;var j={};var c=[];var e=[];var a={reset:f,declareImage:k,renderImage:b,addRender:d,renderAll:i,ctx:l};return a;function f(){j={};c=[];e=[]}function k(m){var n=new Image();n.onload=function(){j[m]=n};n.onerror=function(){j[m]=-1};n.src=m;c.push(m)}function b(u,r,q,o,n,s,p,m,t){if(c.indexOf(u)==-1){console.log('Error: call renderImage with unknow image "'+u+'"');return}if(!j[u]){console.log('Error: call renderImage "'+u+'" out of addRender, renderAll contexts');return}if(j[u]&&j[u]!==-1){l.closePath();if(t){l.drawImage(j[u],r,q,o,n,s,p,m,t)}else{if(n){l.drawImage(j[u],r,q,o,n)}else{l.drawImage(j[u],r||0,q||0)}}l.beginPath()}}function g(){for(var m in c){if(!j[c[m]]){return false}}return true}function d(m){e.push(m)}function i(){if(!g()){setTimeout(i,100);return}l.beginPath();for(var m in e){e[m].call(a)}l.closePath()}}function trassos2D(){var SVGNamespace="http://www.w3.org/2000/svg";var DEFAULT_GRAPH_DX=300;var DEFAULT_GRAPH_DY=200;var graffitiPila=[];var TT_UNDEF=-1;var TT_DEFSTYLE=0;var TT_IMAGE=1;var TT_TEXT=2;var TT_TRASS=3;var TT_RECT=4;var TT_CIRCLE=5;var TT_ELLIPSE=6;var TT_GRAFFITI=7;return{renderCanvasGraffitis:renderCanvasGraffitis,renderSvgGraffitis:renderSvgGraffitis,renderClassGraffiti:renderClassGraffiti,drawGraffiti2canvas:drawGraffiti2canvas,trassShapeNoSyncCanvas:trassShapeNoSyncCanvas,drawGraffiti2svg:drawGraffiti2svg,trassShape2svg:trassShape2svg,autoCasteljau:autoCasteljau,convertPathArrayJ2C:convertPathArrayJ2C,getSVGById:getSVGById,getCanvasById:getCanvasById,clearSvg:clearSvg};function getTrassType(str){if(str==="z"){return TT_TRASS}if(str==="defstyle"||str==="def"){return TT_DEFSTYLE}if(str==="rect"||str==="rec"){return TT_RECT}if(str==="image"||str==="img"){return TT_IMAGE}if(str==="circle"||str==="cir"){return TT_CIRCLE}if(str==="ellipse"||str==="ell"){return TT_ELLIPSE}if(str==="text"||str==="txt"){return TT_TEXT}if(str==="graffiti"||str==="gra"||str==="graf"){return TT_GRAFFITI}return TT_UNDEF}function parse2DStyle(stylestr){var reto={};if(!stylestr){return reto}var atts=stylestr.split(";");if(!atts||atts.length===0){return reto}var aliases={op:"opacity",sc:"stroke",sw:"stroke-width",so:"stroke-opacity",sd:"stroke-dasharray",fc:"fill",fr:"fill-rule",fo:"fill-opacity",font:"font-family",ff:"font-family",fof:"font-family",fs:"font-size",fos:"font-size",ft:"font-type",fot:"font-type"};function toHex(strDeci){var twochar=Number(strDeci).toString(16);return(twochar.length==1?"0":"")+twochar}for(var ii=0;ii<atts.length;ii++){var atval=atts[ii].split(":");if(atval.length!==2){continue}var name=atval[0].trim();name=aliases[name]||name;var value=atval[1].trim();if(value.length>=10&&value[0]=="+"&&(name=="fill"||name=="stroke")){value="#"+toHex(value.substr(1,3))+toHex(value.substr(4,3))+toHex(value.substr(7,3))+(value.length>=13?toHex(value.substr(10,3)):"")}reto[name]=value}return reto}function convertPathArrayJ2C(px,py,closePath,arrJ){var au=autoCasteljau(px,py,closePath,arrJ);au.computePoints();return au.getArrayCasteljau().slice(2)}function autoCasteljau(x0,y0,close,arrPtos){var arrCasteljau=[];var arreglo=-1;var MISTAD=0.5;return{x0:x0,y0:y0,arrPtos:arrPtos,computePoints:computeAutoCasteljau,getArrayCasteljau:function(){return arrCasteljau}};function computeAutoCasteljau(){if(!arrPtos||arrPtos.length<2){return[]}var NP=3*(2+arrPtos.length)-4;var ctrl;var posa=0;arrCasteljau=[];var prev=new vec3();var p1=new vec3(x0,y0);var p2=new vec3();var p3=new vec3();for(var ii=0;ii<arrPtos.length-3;ii+=2){if(ii>0){p1.fromArray(arrPtos,ii/2-1,2)}p2.fromArray(arrPtos,ii/2+0,2);p3.fromArray(arrPtos,ii/2+1,2);p1.plus(prev);p2.plus(p1);p3.plus(p2);prev.set(p1.x,p1.y,p1.z);ctrl=getControlPoints(p1,p2,p3);p1.setIntoArray(arrCasteljau,posa+0,2);ctrl[0].setIntoArray(arrCasteljau,posa+2,2);ctrl[1].setIntoArray(arrCasteljau,posa+4,2);posa+=3}if(close){NP+=6;p1=new vec3(x0,y0);ctrl=getControlPoints(p2,p3,p1);p2.setIntoArray(arrCasteljau,posa+0,2);ctrl[0].setIntoArray(arrCasteljau,posa+2,2);p3.setIntoArray(arrCasteljau,posa+3,2);ctrl[1].setIntoArray(arrCasteljau,posa+4,2);p2.fromArray(arrPtos,0,2);p2.plus(p1);ctrl=getControlPoints(p3,p1,p2);ctrl[0].setIntoArray(arrCasteljau,posa+5,2);p1.setIntoArray(arrCasteljau,posa+6,2);ctrl[1].setIntoArray(arrCasteljau,1,2)}else{p1=p3.clone();p1.plus(vec3FromTo(p2,p3));ctrl=getControlPoints(p2,p3,p1);p2.setIntoArray(arrCasteljau,posa+0,2);ctrl[0].setIntoArray(arrCasteljau,posa+2,2);p3.setIntoArray(arrCasteljau,posa+3,2);p1.set(x0,y0);p2.fromArray(arrPtos,0,2);p2.plus(p1);p3=p1.clone();p3.plus(vec3FromTo(p2,p1));ctrl=getControlPoints(p3,p1,p2);ctrl[0].setIntoArray(arrCasteljau,1,2)}if(NP!==arrCasteljau.length){console.log("Error: Error calculating final array NP "+NP+" !== "+(arrCasteljau.length))}return arrCasteljau}function getControlPoints(p1,p2,p3){var cp0=new vec3();var cp1=new vec3();var v1=vec3FromTo(p1,p2);var v2=vec3FromTo(p3,p2);var n1=v1.norm();var n2=v2.norm();var fator=(n1+n2)*(n1+n2);var dir=vec3FromTo(v2,v1);if(fator>0){dir.div(fator)}var faco1=n1>n2?n1*n1:n2*n2;var faco2=n1*n2;var prop=n2>0?n1/n2:1;if(arreglo<0){arreglo=(prop>1?1/prop:prop)}dir.mult(MISTAD*(arreglo*faco1+(1-arreglo)*faco2));cp0.set(p2);cp1.set(p2);cp0.minus(dir);cp1.plus(dir);return[cp0,cp1]}}function boundingBoxAndAutoScale(trasses,width,height,squareratio,marginPercent){marginPercent=marginPercent||10;var bounds=calcBoundingBox(trasses);var scalex=width*(1-2*marginPercent/100)/bounds.dx;var scaley=height*(1-2*marginPercent/100)/bounds.dy;var extrax=0;var extray=0;if(squareratio){if(scalex<scaley){extray=(0.5*(scaley-scalex)*bounds.dy)/scalex;scaley=scalex}else{extrax=(0.5*(scalex-scaley)*bounds.dx)/scaley;scalex=scaley}}return{scalex:scalex,scaley:scaley,offsetx:extrax-bounds.x+(marginPercent/100)*bounds.dx,offsety:extray-bounds.y+(marginPercent/100)*bounds.dy}}function calcBoundingBox(trasses){var DEF_SIZE_IMG=100;var DEF_SIZE_CHAR=25;var xx,yy,ii;var x0=null,y0,x1,y1;function computePair(x,y){if(x0==null){x0=x;y0=y;x1=x+1;y1=y+1;return}if(x<x0){x0=x}if(x>x1){x1=x+1}if(y<y0){y0=y}if(y>y1){y1=y+1}}function computeTrassa(trass){xx=+(trass[1]);yy=+(trass[2]);computePair(xx,yy);for(ii=5;ii+1<trass.length;ii+=2){xx+=+(trass[ii]);yy+=+(trass[ii+1]);computePair(xx,yy)}}function computeSquare(x,y,dx,dy){computePair(x,y);computePair(x+dx,y+dy)}function computeRect(trass){computeSquare(+(trass[1]),+(trass[2]),+(trass[4]),+(trass[5]))}function computeCircle(trass){computeSquare(+(trass[1])-(trass[4]),+(trass[2])-(trass[4]),+(trass[4]),+(trass[4]))}function computeEllipse(trass){computeSquare(+(trass[1])-(trass[4]),+(trass[2])-(trass[5]),+(trass[4]),+(trass[5]))}function computeText(trass){computeSquare(+(trass[1]),+(trass[2]),(+(trass[4]))*DEF_SIZE_CHAR,DEF_SIZE_CHAR)}for(var tt in trasses){switch(getTrassType(trasses[tt][0])){case TT_TRASS:computeTrassa(trasses[tt]);break;case TT_RECT:computeRect(trasses[tt]);break;case TT_CIRCLE:computeCircle(trasses[tt]);break;case TT_ELLIPSE:computeEllipse(trasses[tt]);break;case TT_TEXT:computeText(trasses[tt]);break;case TT_IMAGE:break;case TT_GRAFFITI:break;default:break}}return{x:x0,y:y0,dx:(x1-x0),dy:(y1-y0)}}function trassShapeNoSyncCanvas(c2d,form,px,py,pathStyle,closep,arrp){var relative=true;var xx=+(px),yy=+(py);c2d.beginPath();c2d.moveTo(px,py);if(form==="jau"){var curv=autoCasteljau(+(px),+(py),closep,arrp);curv.computePoints();var cc=curv.getArrayCasteljau();for(var ii=2;ii+5<cc.length;ii+=6){c2d.bezierCurveTo(cc[ii],cc[ii+1],cc[ii+2],cc[ii+3],cc[ii+4],cc[ii+5])}}else{for(var ii=0;ii<arrp.length;ii+=2){var plusx=relative?xx:0;var plusy=relative?yy:0;if(form==="pol"){xx=+(arrp[ii+0])+plusx;yy=+(arrp[ii+1])+plusy;c2d.lineTo(xx,yy)}else{if(form=="qua"){xx=+(arrp[ii+2])+plusx;yy=+(arrp[ii+3])+plusy;c2d.quadraticCurveTo(+(arrp[ii])+plusx,+(arrp[ii+1])+plusy,xx,yy);ii+=2}else{if(form=="cub"||form=="bez"){xx=+(arrp[ii+4])+plusx;yy=+(arrp[ii+5])+plusy;c2d.bezierCurveTo(+(arrp[ii])+plusx,+(arrp[ii+1])+plusy,+(arrp[ii+2])+plusx,+(arrp[ii+3])+plusy,xx,yy);ii+=4}else{console.log("ERROR: unknow form "+form+" calling trassShapeNoSyncCanvas!");break}}}}if(closep){c2d.closePath()}}}function drawGraffiti2canvas(atrass,canv,props){var canvSync=canvasSync(canv.getContext("2d"));function makestyle(a){return a}var styles={};var applyprop=props||{autofit:true,squareratio:true};if(applyprop.autofit){applyprop=boundingBoxAndAutoScale(atrass,canv.width,canv.height,applyprop.squareratio)}var hasScaleAndOffsets="scalex" in applyprop;for(var rr in atrass){var lotrass=atrass[rr];if(lotrass&&lotrass.length>4&&lotrass[0]==="img"){canvSync.declareImage(lotrass[4])}}canvSync.addRender(function(){var thas=this;function applyCanvasStyle(styles,strstyle){var estilos=parse2DStyle(styles[strstyle]||strstyle);var oldWidth;var oldLineDash;if("fill" in estilos){if(estilos.fill!=="none"){thas.ctx.fillStyle=estilos.fill;thas.ctx.fill()}}if("stroke-width" in estilos){oldWidth=thas.ctx.lineWidth;thas.ctx.lineWidth=estilos["stroke-width"]}if("stroke-dasharray" in estilos){thas.ctx.setLineDash(eval("["+estilos["stroke-dasharray"]+"]"))}thas.ctx.strokeStyle=("stroke" in estilos)?estilos.stroke:"#000000";thas.ctx.stroke();if(oldWidth!==undefined){thas.ctx.lineWidth=oldWidth}if(oldLineDash!==undefined){thas.ctx.setLineDash([])}}function trassShape2canvas(form,px,py,pathStyle,closep,arrp){var relative=true;var xx=+(px),yy=+(py);thas.ctx.beginPath();thas.ctx.moveTo(px,py);if(form==="jau"){var curv=autoCasteljau(+(px),+(py),closep,arrp);curv.computePoints();var cc=curv.getArrayCasteljau();for(var ii=2;ii+5<cc.length;ii+=6){thas.ctx.bezierCurveTo(cc[ii],cc[ii+1],cc[ii+2],cc[ii+3],cc[ii+4],cc[ii+5])}}else{for(var ii=0;ii<arrp.length;ii+=2){var plusx=relative?xx:0;var plusy=relative?yy:0;if(form==="pol"){xx=+(arrp[ii+0])+plusx;yy=+(arrp[ii+1])+plusy;thas.ctx.lineTo(xx,yy)}else{if(form=="qua"){xx=+(arrp[ii+2])+plusx;yy=+(arrp[ii+3])+plusy;thas.ctx.quadraticCurveTo(+(arrp[ii])+plusx,+(arrp[ii+1])+plusy,xx,yy);ii+=2}else{if(form=="cub"||form=="bez"){xx=+(arrp[ii+4])+plusx;yy=+(arrp[ii+5])+plusy;thas.ctx.bezierCurveTo(+(arrp[ii])+plusx,+(arrp[ii+1])+plusy,+(arrp[ii+2])+plusx,+(arrp[ii+3])+plusy,xx,yy);ii+=4}else{console.log("ERROR: unknow form "+form+" calling trassShape2canvas!");break}}}}if(closep){thas.ctx.closePath()}}}var escalax;var escalay;if(hasScaleAndOffsets){escalax=applyprop.scalex;escalay=applyprop.scaley;this.ctx.save();this.ctx.lineWidth=1/applyprop.scalex;this.ctx.scale(escalax,escalay);this.ctx.translate(applyprop.offsetx,applyprop.offsety)}for(var rr in atrass){var lotrass=atrass[rr];if(!lotrass||lotrass.length<3){continue}switch(getTrassType(lotrass[0])){case TT_DEFSTYLE:styles[lotrass[1]]=makestyle(lotrass[2]);break;case TT_IMAGE:this.renderImage(lotrass[4],+(lotrass[1]),+(lotrass[2]));break;case TT_TEXT:var estilos=parse2DStyle(styles[lotrass[3]]||lotrass[3]);if("font-family" in estilos){if("font-size" in estilos){this.ctx.font=estilos["font-size"]+"px "+estilos["font-family"]}else{this.ctx.font=estilos["font-family"]}}if("fill" in estilos){this.ctx.fillStyle=estilos.fill;this.ctx.fillText(lotrass[4],lotrass[1],lotrass[2])}if("stroke" in estilos){this.ctx.strokeStyle=estilos.stroke;this.ctx.strokeText(lotrass[4],lotrass[1],lotrass[2])}break;case TT_TRASS:if(lotrass.length>=6){trassShape2canvas(lotrass[4].substring(0,3),lotrass[1],lotrass[2],styles[lotrass[3]]||lotrass[3],lotrass[4].length>3&&lotrass[4].substring(3)==="z",lotrass.slice(5));applyCanvasStyle(styles,lotrass[3])}break;case TT_RECT:this.ctx.beginPath();this.ctx.rect(lotrass[1],lotrass[2],lotrass[4],lotrass[5]);applyCanvasStyle(styles,lotrass[3]);break;case TT_CIRCLE:this.ctx.beginPath();this.ctx.ellipse(lotrass[1],lotrass[2],lotrass[4],lotrass[4],0,2*Math.PI,0);applyCanvasStyle(styles,lotrass[3]);break;case TT_ELLIPSE:this.ctx.beginPath();this.ctx.ellipse(lotrass[1],lotrass[2],lotrass[4],lotrass[5],0,2*Math.PI,0);applyCanvasStyle(styles,lotrass[3]);break;case TT_GRAFFITI:console.log("Error: element graffiti not implemented in canvas!");break;default:break}}if(hasScaleAndOffsets){this.ctx.restore()}});canvSync.renderAll()}function trassText2svg(svgEle,px,py,pathStyle,textContent){var pato=document.createElementNS(SVGNamespace,"text");pato.setAttribute("x",+(px));pato.setAttribute("y",+(py));pato.textContent=textContent;var estilos=parse2DStyle(pathStyle);for(var ee in estilos){pato.setAttribute(ee,estilos[ee])}if(!("stroke" in estilos)){pato.setAttribute("stroke","#000000")}svgEle.appendChild(pato)}function trassImage2svg(svgEle,px,py,pathStyle,imageSource){var pato=document.createElementNS(SVGNamespace,"image");pato.setAttribute("x",+(px));pato.setAttribute("y",+(py));pato.setAttribute("href",imageSource);var estilos=parse2DStyle(pathStyle);for(var ee in estilos){pato.setAttribute(ee,estilos[ee])}svgEle.appendChild(pato)}function createSvgElement(svgtype,style){var pato=document.createElementNS(SVGNamespace,svgtype);var estilos=parse2DStyle(style);for(var ee in estilos){pato.setAttribute(ee,estilos[ee])}if(!("stroke" in estilos)){pato.setAttribute("stroke","#000000")}return pato}function trassShape2svg(svgEle,forma,px,py,pathStyle,closep,arrp){var pato=createSvgElement("path",pathStyle);var dstr=["M "+px+" "+py+" "];if(forma==="jau"){var curv=autoCasteljau(+(px),+(py),closep,arrp);curv.computePoints();var cc=curv.getArrayCasteljau();dstr.push(" C ");for(var ii=2;ii+5<cc.length;ii+=6){dstr.push(cc[ii]+" "+cc[ii+1]+" "+cc[ii+2]+" "+cc[ii+3]+" "+cc[ii+4]+" "+cc[ii+5]+" ")}}else{if(forma==="pol"){dstr.push(" l ")}else{if(forma=="qua"){dstr.push(" q ")}else{if(forma=="cub"||forma=="bez"){dstr.push(" c ")}}}for(var ii=0;ii<arrp.length;){if(forma==="pol"){dstr.push(arrp[ii]+" "+arrp[ii+1]+" ");ii+=2}else{if(forma=="qua"){dstr.push(arrp[ii]+" "+arrp[ii+1]+" "+arrp[ii+2]+" "+arrp[ii+3]+" ");ii+=4}else{if(forma=="cub"||forma=="bez"){dstr.push(arrp[ii]+" "+arrp[ii+1]+" "+arrp[ii+2]+" "+arrp[ii+3]+" "+arrp[ii+4]+" "+arrp[ii+5]+" ");ii+=6}else{console.log("ERROR: unknow form "+forma+" calling trassShape!");break}}}}if(closep){dstr.push(" Z")}}pato.setAttribute("d",dstr.join(""));svgEle.appendChild(pato)}function drawGraffiti2svg(atrass,svgElem,props,restData){function makestyle(a){return a}var styles={};var gaga=document.createElementNS(SVGNamespace,"g");var applyprop=props||{autofit:true,squareratio:true};if(applyprop.autofit){var wi=parseInt(svgElem.style.width||DEFAULT_GRAPH_DX);var hi=parseInt(svgElem.style.height||DEFAULT_GRAPH_DY);if(svgElem.width&&svgElem.width.baseVal){wi=parseInt(svgElem.width.baseVal.value)}if(svgElem.height&&svgElem.height.baseVal){hi=parseInt(svgElem.height.baseVal.value)}applyprop=boundingBoxAndAutoScale(atrass,wi,hi,applyprop.squareratio)}if("scalex" in applyprop){gaga.setAttribute("stroke-width",""+(1/applyprop.scalex));gaga.setAttribute("transform"," scale     ("+applyprop.scalex+", "+applyprop.scaley+") translate ("+applyprop.offsetx+", "+applyprop.offsety+")")}svgElem.appendChild(gaga);for(var rr in atrass){var lotrass=atrass[rr];if(!lotrass||lotrass.length<3){continue}switch(getTrassType(lotrass[0])){case TT_DEFSTYLE:styles[lotrass[1]]=makestyle(lotrass[2]);break;case TT_IMAGE:trassImage2svg(gaga,lotrass[1],lotrass[2],styles[lotrass[3]]||lotrass[3],lotrass[4]);break;case TT_TEXT:trassText2svg(gaga,lotrass[1],lotrass[2],styles[lotrass[3]]||lotrass[3],lotrass[4]);break;case TT_TRASS:if(lotrass.length>=6){trassShape2svg(gaga,lotrass[4].substring(0,3),lotrass[1],lotrass[2],styles[lotrass[3]]||lotrass[3],lotrass[4].length>3&&lotrass[4].substring(3)=="z",lotrass.slice(5))}break;case TT_RECT:var pato=createSvgElement("rect",styles[lotrass[3]]||lotrass[3]);pato.setAttribute("x",lotrass[1]);pato.setAttribute("y",lotrass[2]);pato.setAttribute("width",lotrass[4]);pato.setAttribute("height",lotrass[5]);pato.setAttribute("rx",lotrass[6]||0);pato.setAttribute("ry",lotrass[7]||0);gaga.appendChild(pato);break;case TT_CIRCLE:var pato=createSvgElement("circle",styles[lotrass[3]]||lotrass[3]);pato.setAttribute("cx",lotrass[1]);pato.setAttribute("cy",lotrass[2]);pato.setAttribute("r",lotrass[4]);gaga.appendChild(pato);break;case TT_ELLIPSE:var pato=createSvgElement("ellipse",styles[lotrass[3]]||lotrass[3]);pato.setAttribute("cx",lotrass[1]);pato.setAttribute("cy",lotrass[2]);pato.setAttribute("rx",lotrass[4]);pato.setAttribute("ry",lotrass[5]);gaga.appendChild(pato);break;case TT_GRAFFITI:var graffitiName=lotrass[3];var enPila=graffitiPila.indexOf(graffitiName)>-1;var graf=restData?restData[graffitiName]:null;if(graf&&!enPila){var gelo=document.createElementNS(SVGNamespace,"svg");gelo.setAttribute("width",lotrass[4]+"px");gelo.setAttribute("height",lotrass[5]+"px");gelo.setAttribute("x",lotrass[1]+"px");gelo.setAttribute("y",lotrass[2]+"px");graffitiPila.push(graffitiName);drawGraffiti2svg(graf,gelo,null,restData);graffitiPila.slice(-1,1);gaga.appendChild(gelo)}break;default:break}}}function renderClassGraffiti(uData,scalesAndOffsets){var supportSVG=!!window.SVGSVGElement;var arr=[].slice.call(document.getElementsByClassName("graffiti"),0);for(var indx in arr){var grafo=arr[indx].id+" graffiti";if(!uData[grafo]){continue}var styW=parseInt(arr[indx].style.width||DEFAULT_GRAPH_DX);var styH=parseInt(arr[indx].style.height||DEFAULT_GRAPH_DY);var gele=(supportSVG)?document.createElementNS(SVGNamespace,"svg"):document.createElement("canvas");gele.setAttribute("width",styW+"px");gele.setAttribute("height",styH+"px");if(supportSVG){drawGraffiti2svg(uData[grafo],gele,scalesAndOffsets,uData)}else{drawGraffiti2canvas(uData[grafo],gele,scalesAndOffsets)}while(arr[indx].hasChildNodes()){arr[indx].removeChild(arr[indx].firstChild)}arr[indx].appendChild(gele)}}function getCanvasById(canvasId){var arr=[].slice.call(document.getElementsByTagName("canvas"),0);for(var indx in arr){if(arr[indx].id===canvasId){return arr[indx]}}return null}function renderCanvasGraffitis(uData,scalesAndOffsets){var arr=[].slice.call(document.getElementsByTagName("canvas"),0);for(var indx in arr){var grafo=arr[indx].id+" graffiti";if(uData[grafo]){drawGraffiti2canvas(uData[grafo],arr[indx],scalesAndOffsets)}}}function getSVGById(svgId){var arr=[].slice.call(document.getElementsByTagNameNS(SVGNamespace,"svg"));for(var indx in arr){if(arr[indx].id===svgId){return arr[indx]}}return null}function renderSvgGraffitis(uData,scalesAndOffsets){var arr=[].slice.call(document.getElementsByTagNameNS(SVGNamespace,"svg"));for(var indx in arr){clearSvg(arr[indx]);var grafo=arr[indx].id+" graffiti";if(uData[grafo]){drawGraffiti2svg(uData[grafo],arr[indx],scalesAndOffsets,uData)}}}function clearSvg(svgelem){while(svgelem.lastChild){svgelem.removeChild(svgelem.lastChild)}}};