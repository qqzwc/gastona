/*
jGastonaEva-min.js version 0.201903 / 2ddotter
composed by Eva.js + EvaLayout.js + LayoutManager.js + httSaco.js + zWidgetsHtml.js + jGastona.js + codiFinestreta.js minified
is part of the open source project https://github.com/wakeupthecat/gastona

Copyright (C) 2015-2019 Alejandro Xalabarder Aulet
@license : GNU General Public License (GPL) version 3

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.
*/
function vec3(a,c,b){this.x=a||0;this.y=c||0;this.z=b||0}vec3.prototype={toString:function(){return this.x+", "+this.y+", "+this.z},fromArray:function(a,b,d){d=d||3;var c=(b||0)*d;this.set(a[c],a[1+c],(d>2?a[2+c]:0))},setIntoArray:function(a,b,d){d=d||3;b=b||(a.length/d);var c=b*d;a[c]=this.x;a[c+1]=this.y;if(d>2){a[c+2]=this.z}},plus:function(a){this.x+=a.x;this.y+=a.y;this.z+=a.z},minus:function(a){this.x-=a.x;this.y-=a.y;this.z-=a.z},mult:function(a){this.x*=a;this.y*=a;this.z*=a},div:function(a){if(a===0){a=1e-20}this.x/=a;this.y/=a;this.z/=a},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},cross:function(a){return new vec3(this.y*a.z-this.z*a.y,this.z*a.x-this.x*a.z,this.x*a.y-this.y*a.x)},norm:function(){return Math.sqrt(this.dot(this))},normalize:function(){this.div(this.norm())},angle:function(b){return Math.acos(this.dot(b)/(this.norm()*b.norm()))},clone:function(){return new vec3(this.x,this.y,this.z)},set:function(a,c,b){if(a instanceof vec3){this.x=a.x;this.y=a.y;this.z=a.z}else{this.x=a||0;this.y=c||0;this.z=b||0}}};function vec3FromTo(c,b){var a=b.clone();a.minus(c);return a}function vec3FromArray(a,b,d){var c=new vec3();c.fromArray(a,b,d);return c}function trazos2D(){var SVGNamespace="http://www.w3.org/2000/svg";var DEFAULT_GRAPH_DX=300;var DEFAULT_GRAPH_DY=200;var graffitiPila=[];return{renderCanvasGraffitis:renderCanvasGraffitis,renderSvgGraffitis:renderSvgGraffitis,renderClassGraffiti:renderClassGraffiti,drawGraffiti2canvas:drawGraffiti2canvas,trazoShape2canvas:trazoShape2canvas,drawGraffiti2svg:drawGraffiti2svg,trazoShape2svg:trazoShape2svg,autoCasteljau:autoCasteljau,convertPathArrayJ2C:convertPathArrayJ2C};function parse2DStyle(stylestr){var reto={};if(!stylestr){return reto}var atts=stylestr.split(";");if(!atts||atts.length===0){return reto}var aliases={op:"opacity",sc:"stroke",sw:"stroke-width",so:"stroke-opacity",sd:"stroke-dasharray",fc:"fill",fr:"fill-rule",fo:"fill-opacity",font:"font-family",ff:"font-family",fof:"font-family",fs:"font-size",fos:"font-size",ft:"font-type",fot:"font-type"};for(var ii=0;ii<atts.length;ii++){var atval=atts[ii].split(":");if(atval.length!==2){continue}var name=atval[0].trim();reto[aliases[name]||name]=atval[1].trim()}return reto}function convertPathArrayJ2C(px,py,closePath,arrJ){var au=autoCasteljau(px,py,closePath,arrJ);au.computePoints();return au.getArrayCasteljau().slice(2)}function autoCasteljau(x0,y0,close,arrPtos){var arrCasteljau=[];var arreglo=-1;var MISTAD=0.5;return{x0:x0,y0:y0,arrPtos:arrPtos,computePoints:computeAutoCasteljau,getArrayCasteljau:function(){return arrCasteljau}};function computeAutoCasteljau(){if(!arrPtos||arrPtos.length<2){return[]}var NP=3*(2+arrPtos.length)-4;var ctrl;var posa=0;arrCasteljau=[];var prev=new vec3();var p1=new vec3(x0,y0);var p2=new vec3();var p3=new vec3();for(var ii=0;ii<arrPtos.length-3;ii+=2){if(ii>0){p1.fromArray(arrPtos,ii/2-1,2)}p2.fromArray(arrPtos,ii/2+0,2);p3.fromArray(arrPtos,ii/2+1,2);p1.plus(prev);p2.plus(p1);p3.plus(p2);prev.set(p1.x,p1.y,p1.z);ctrl=getControlPoints(p1,p2,p3);p1.setIntoArray(arrCasteljau,posa+0,2);ctrl[0].setIntoArray(arrCasteljau,posa+2,2);ctrl[1].setIntoArray(arrCasteljau,posa+4,2);posa+=3}if(close){NP+=6;p1=new vec3(x0,y0);ctrl=getControlPoints(p2,p3,p1);p2.setIntoArray(arrCasteljau,posa+0,2);ctrl[0].setIntoArray(arrCasteljau,posa+2,2);p3.setIntoArray(arrCasteljau,posa+3,2);ctrl[1].setIntoArray(arrCasteljau,posa+4,2);p2.fromArray(arrPtos,0,2);p2.plus(p1);ctrl=getControlPoints(p3,p1,p2);ctrl[0].setIntoArray(arrCasteljau,posa+5,2);p1.setIntoArray(arrCasteljau,posa+6,2);ctrl[1].setIntoArray(arrCasteljau,1,2)}else{p1=p3.clone();p1.plus(vec3FromTo(p2,p3));ctrl=getControlPoints(p2,p3,p1);p2.setIntoArray(arrCasteljau,posa+0,2);ctrl[0].setIntoArray(arrCasteljau,posa+2,2);p3.setIntoArray(arrCasteljau,posa+3,2);p1.set(x0,y0);p2.fromArray(arrPtos,0,2);p2.plus(p1);p3=p1.clone();p3.plus(vec3FromTo(p2,p1));ctrl=getControlPoints(p3,p1,p2);ctrl[0].setIntoArray(arrCasteljau,1,2)}if(NP!==arrCasteljau.length){alert("Error calculating final array NP "+NP+" !== "+(arrCasteljau.length))}return arrCasteljau}function getControlPoints(p1,p2,p3){var cp0=new vec3();var cp1=new vec3();var v1=vec3FromTo(p1,p2);var v2=vec3FromTo(p3,p2);var n1=v1.norm();var n2=v2.norm();var fator=(n1+n2)*(n1+n2);var dir=vec3FromTo(v2,v1);if(fator>0){dir.div(fator)}var faco1=n1>n2?n1*n1:n2*n2;var faco2=n1*n2;var prop=n2>0?n1/n2:1;if(arreglo<0){arreglo=(prop>1?1/prop:prop)}dir.mult(MISTAD*(arreglo*faco1+(1-arreglo)*faco2));cp0.set(p2);cp1.set(p2);cp0.minus(dir);cp1.plus(dir);return[cp0,cp1]}}function boundingBoxAndAutoScale(trazos,width,height,marginPercent){marginPercent=marginPercent||10;var bounds=calcBoundingBox(trazos);var scalex=width*(1-2*marginPercent/100)/bounds.dx;var scaley=height*(1-2*marginPercent/100)/bounds.dy;if(scalex<scaley){scaley=scalex}else{scalex=scaley}return{scalex:scalex,scaley:scaley,offsetx:-bounds.x+(marginPercent/100)*bounds.dx,offsety:-bounds.y+(marginPercent/100)*bounds.dy}}function calcBoundingBox(trazos){var xx,yy,ii;var x0=null,y0,x1,y1;function computePair(x,y){if(x0==null){x0=x;y0=y;x1=x+1;y1=y+1;return}if(x<x0){x0=x}if(x>x1){x1=x+1}if(y<y0){y0=y}if(y>y1){y1=y+1}}function compute(trazo){xx=+(trazo[1]);yy=+(trazo[2]);computePair(xx,yy);for(ii=5;ii+1<trazo.length;ii+=2){xx+=+(trazo[ii]);yy+=+(trazo[ii+1]);computePair(xx,yy)}}for(var tt in trazos){if(trazos[tt][0]==="z"){compute(trazos[tt])}}return{x:x0,y:y0,dx:(x1-x0),dy:(y1-y0)}}function trazoShape2canvas(c2d,form,px,py,pathStyle,closep,arrp){c2d.beginPath();c2d.moveTo(px,py);var relative=true;var xx=+(px),yy=+(py);if(form==="jau"){var curv=autoCasteljau(+(px),+(py),closep,arrp);curv.computePoints();var cc=curv.getArrayCasteljau();for(var ii=2;ii+5<cc.length;ii+=6){c2d.bezierCurveTo(cc[ii],cc[ii+1],cc[ii+2],cc[ii+3],cc[ii+4],cc[ii+5])}}else{for(var ii=0;ii<arrp.length;ii+=2){var plusx=relative?xx:0;var plusy=relative?yy:0;if(form==="pol"){xx=+(arrp[ii+0])+plusx;yy=+(arrp[ii+1])+plusy;c2d.lineTo(xx,yy)}else{if(form=="qua"){xx=+(arrp[ii+2])+plusx;yy=+(arrp[ii+3])+plusy;c2d.quadraticCurveTo(+(arrp[ii])+plusx,+(arrp[ii+1])+plusy,xx,yy);ii+=2}else{if(form=="cub"||form=="bez"){xx=+(arrp[ii+4])+plusx;yy=+(arrp[ii+5])+plusy;c2d.bezierCurveTo(+(arrp[ii])+plusx,+(arrp[ii+1])+plusy,+(arrp[ii+2])+plusx,+(arrp[ii+3])+plusy,xx,yy);ii+=4}else{console.log("ERROR: unknow form "+form+" calling trazoShape!");break}}}}if(closep){c2d.closePath()}}}function drawImage2canvas(c2d,source,px,py){var img=new Image();img.onload=function(){c2d.drawImage(img,+(px),+(py))};img.src=source}function applyCanvasStyle(c2d,styles,strstyle){var estilos=parse2DStyle(styles[strstyle]||strstyle);var oldWidth;var oldLineDash;if("fill" in estilos){c2d.fillStyle=estilos.fill;c2d.fill()}if("stroke-width" in estilos){oldWidth=c2d.lineWidth;c2d.lineWidth=estilos["stroke-width"]}if("stroke-dasharray" in estilos){oldLineDash=true;c2d.setLineDash(eval("["+estilos["stroke-dasharray"]+"]"))}c2d.strokeStyle=("stroke" in estilos)?estilos.stroke:"#000000";c2d.stroke();if(oldWidth!==undefined){c2d.lineWidth=oldWidth}if(oldLineDash!==undefined){c2d.setLineDash([])}}function drawGraffiti2canvas(trazos,canv,props){var c2d=canv.getContext("2d");function makestyle(a){return a}var styles={};var applyprop=(!props||props.autofit)?boundingBoxAndAutoScale(trazos,canv.width,canv.height):props;var hasScaleAndOffsets="scalex" in applyprop;if(hasScaleAndOffsets){c2d.save();c2d.lineWidth=1/applyprop.scalex;c2d.scale(applyprop.scalex,applyprop.scaley);c2d.translate(applyprop.offsetx,applyprop.offsety)}for(var rr in trazos){if(!trazos[rr]||trazos[rr].length<3){continue}if(trazos[rr][0]==="defstyle"){styles[trazos[rr][1]]=makestyle(trazos[rr][2])}else{if(trazos[rr][0]==="img"){drawImage2canvas(c2d,trazos[rr][4],trazos[rr][1],trazos[rr][2])}else{if(trazos[rr][0]==="text"||trazos[rr][0]==="txt"){var estilos=parse2DStyle(styles[trazos[rr][3]]||trazos[rr][3]);if("fill" in estilos){c2d.fillStyle=estilos.fill;c2d.fillText(trazos[rr][4],trazos[rr][1],trazos[rr][2])}if("stroke" in estilos){c2d.strokeStyle=estilos.stroke;c2d.strokeText(trazos[rr][4],trazos[rr][1],trazos[rr][2])}}else{if(trazos[rr][0]==="rect"||trazos[rr][0]==="rec"){c2d.rect(trazos[rr][1],trazos[rr][2],trazos[rr][4],trazos[rr][5]);applyCanvasStyle(c2d,styles,trazos[rr][3])}else{if(trazos[rr][0]==="circle"||trazos[rr][0]==="cir"){c2d.beginPath();c2d.ellipse(trazos[rr][1],trazos[rr][2],trazos[rr][4],trazos[rr][4],0,2*Math.PI,0);applyCanvasStyle(c2d,styles,trazos[rr][3])}else{if(trazos[rr][0]==="ellipse"||trazos[rr][0]==="ell"){c2d.beginPath();c2d.ellipse(trazos[rr][1],trazos[rr][2],trazos[rr][4],trazos[rr][5],0,2*Math.PI,0);applyCanvasStyle(c2d,styles,trazos[rr][3])}else{if(trazos[rr][0]==="z"&&trazos[rr].length>=6){trazoShape2canvas(c2d,trazos[rr][4].substring(0,3),trazos[rr][1],trazos[rr][2],styles[trazos[rr][3]]||trazos[rr][3],trazos[rr][4].length>3&&trazos[rr][4].substring(3)==="z",trazos[rr].slice(5));applyCanvasStyle(c2d,styles,trazos[rr][3])}}}}}}}}if(hasScaleAndOffsets){c2d.restore()}}function trazoText2svg(svgEle,px,py,pathStyle,textContent){var pato=document.createElementNS(SVGNamespace,"text");pato.setAttribute("x",+(px));pato.setAttribute("y",+(py));pato.textContent=textContent;var estilos=parse2DStyle(pathStyle);for(var ee in estilos){pato.setAttribute(ee,estilos[ee])}if(!("stroke" in estilos)){pato.setAttribute("stroke","#000000")}svgEle.appendChild(pato)}function trazoImage2svg(svgEle,px,py,pathStyle,imageSource){var pato=document.createElementNS(SVGNamespace,"image");pato.setAttribute("x",+(px));pato.setAttribute("y",+(py));pato.setAttribute("href",imageSource);var estilos=parse2DStyle(pathStyle);for(var ee in estilos){pato.setAttribute(ee,estilos[ee])}svgEle.appendChild(pato)}function createSvgElement(svgtype,style){var pato=document.createElementNS(SVGNamespace,svgtype);var estilos=parse2DStyle(style);for(var ee in estilos){pato.setAttribute(ee,estilos[ee])}if(!("stroke" in estilos)){pato.setAttribute("stroke","#000000")}return pato}function trazoShape2svg(svgEle,forma,px,py,pathStyle,closep,arrp){var pato=createSvgElement("path",pathStyle);var dstr=["M "+px+" "+py+" "];if(forma==="jau"){var curv=autoCasteljau(+(px),+(py),closep,arrp);curv.computePoints();var cc=curv.getArrayCasteljau();dstr.push(" C ");for(var ii=2;ii+5<cc.length;ii+=6){dstr.push(cc[ii]+" "+cc[ii+1]+" "+cc[ii+2]+" "+cc[ii+3]+" "+cc[ii+4]+" "+cc[ii+5]+" ")}}else{if(forma==="pol"){dstr.push(" l ")}else{if(forma=="qua"){dstr.push(" q ")}else{if(forma=="cub"||forma=="bez"){dstr.push(" c ")}}}for(var ii=0;ii<arrp.length;){if(forma==="pol"){dstr.push(arrp[ii]+" "+arrp[ii+1]+" ");ii+=2}else{if(forma=="qua"){dstr.push(arrp[ii]+" "+arrp[ii+1]+" "+arrp[ii+2]+" "+arrp[ii+3]+" ");ii+=4}else{if(forma=="cub"||forma=="bez"){dstr.push(arrp[ii]+" "+arrp[ii+1]+" "+arrp[ii+2]+" "+arrp[ii+3]+" "+arrp[ii+4]+" "+arrp[ii+5]+" ");ii+=6}else{console.log("ERROR: unknow form "+forma+" calling trazoShape!");break}}}}if(closep){dstr.push(" Z")}}pato.setAttribute("d",dstr.join(""));svgEle.appendChild(pato)}function drawGraffiti2svg(trazos,svgElem,props,restData){function makestyle(a){return a}var styles={};var gaga=document.createElementNS(SVGNamespace,"g");var applyprop=props||{autofit:true};if(applyprop.autofit){var wi=parseInt(svgElem.style.width||DEFAULT_GRAPH_DX);var hi=parseInt(svgElem.style.height||DEFAULT_GRAPH_DY);if(svgElem.width&&svgElem.width.baseVal){wi=parseInt(svgElem.width.baseVal.value)}if(svgElem.height&&svgElem.height.baseVal){hi=parseInt(svgElem.height.baseVal.value)}applyprop=boundingBoxAndAutoScale(trazos,wi,hi)}var hasScaleAndOffsets="scalex" in applyprop;if(hasScaleAndOffsets){gaga.setAttribute("stroke-width",""+(1/applyprop.scalex));gaga.setAttribute("transform"," scale     ("+applyprop.scalex+", "+applyprop.scaley+") translate ("+applyprop.offsetx+", "+applyprop.offsety+")")}svgElem.appendChild(gaga);for(var rr in trazos){if(!trazos[rr]||trazos[rr].length<3){continue}if(trazos[rr][0]==="defstyle"){styles[trazos[rr][1]]=makestyle(trazos[rr][2])}else{if(trazos[rr][0]==="gra"||trazos[rr][0]==="graf"||trazos[rr][0]==="graffiti"){var graffitiName=trazos[rr][3];var enPila=graffitiPila.indexOf(graffitiName)>-1;var graf=restData?restData[graffitiName]:null;if(graf&&!enPila){var gelo=document.createElementNS(SVGNamespace,"svg");gelo.setAttribute("width",trazos[rr][4]+"px");gelo.setAttribute("height",trazos[rr][5]+"px");gelo.setAttribute("x",trazos[rr][1]+"px");gelo.setAttribute("y",trazos[rr][2]+"px");graffitiPila.push(graffitiName);drawGraffiti2svg(graf,gelo,null,restData);graffitiPila.slice(-1,1);gaga.appendChild(gelo)}}else{if(trazos[rr][0]==="img"){trazoImage2svg(gaga,trazos[rr][1],trazos[rr][2],styles[trazos[rr][3]]||trazos[rr][3],trazos[rr][4])}else{if(trazos[rr][0]==="text"||trazos[rr][0]==="txt"){trazoText2svg(gaga,trazos[rr][1],trazos[rr][2],styles[trazos[rr][3]]||trazos[rr][3],trazos[rr][4])}else{if(trazos[rr][0]==="rect"||trazos[rr][0]==="rec"){var pato=createSvgElement("rect",styles[trazos[rr][3]]||trazos[rr][3]);pato.setAttribute("x",trazos[rr][1]);pato.setAttribute("y",trazos[rr][2]);pato.setAttribute("width",trazos[rr][4]);pato.setAttribute("height",trazos[rr][5]);pato.setAttribute("rx",trazos[rr][6]||0);pato.setAttribute("ry",trazos[rr][7]||0);gaga.appendChild(pato)}else{if(trazos[rr][0]==="circle"||trazos[rr][0]==="cir"){var pato=createSvgElement("circle",styles[trazos[rr][3]]||trazos[rr][3]);pato.setAttribute("cx",trazos[rr][1]);pato.setAttribute("cy",trazos[rr][2]);pato.setAttribute("r",trazos[rr][4]);gaga.appendChild(pato)}else{if(trazos[rr][0]==="ellipse"||trazos[rr][0]==="ell"){var pato=createSvgElement("ellipse",styles[trazos[rr][3]]||trazos[rr][3]);pato.setAttribute("cx",trazos[rr][1]);pato.setAttribute("cy",trazos[rr][2]);pato.setAttribute("rx",trazos[rr][4]);pato.setAttribute("ry",trazos[rr][5]);gaga.appendChild(pato)}else{if(trazos[rr][0]==="z"&&trazos[rr].length>=6){trazoShape2svg(gaga,trazos[rr][4].substring(0,3),trazos[rr][1],trazos[rr][2],styles[trazos[rr][3]]||trazos[rr][3],trazos[rr][4].length>3&&trazos[rr][4].substring(3)=="z",trazos[rr].slice(5))}}}}}}}}}}function renderClassGraffiti(uData,scalesAndOffsets){var supportSVG=!!window.SVGSVGElement;var arr=[].slice.call(document.getElementsByClassName("graffiti"),0);for(var indx in arr){var grafo=arr[indx].id+" graffiti";if(!uData[grafo]){continue}var styW=parseInt(arr[indx].style.width||DEFAULT_GRAPH_DX);var styH=parseInt(arr[indx].style.height||DEFAULT_GRAPH_DY);var gele=(supportSVG)?document.createElementNS(SVGNamespace,"svg"):document.createElement("canvas");gele.setAttribute("width",styW+"px");gele.setAttribute("height",styH+"px");if(supportSVG){drawGraffiti2svg(uData[grafo],gele,scalesAndOffsets,uData)}else{drawGraffiti2canvas(uData[grafo],gele,scalesAndOffsets)}while(arr[indx].hasChildNodes()){arr[indx].removeChild(arr[indx].firstChild)}arr[indx].appendChild(gele)}}function renderCanvasGraffitis(uData,scalesAndOffsets){var arr=[].slice.call(document.getElementsByTagName("canvas"),0);for(var indx in arr){var grafo=arr[indx].id+" graffiti";if(uData[grafo]){drawGraffiti2canvas(uData[grafo],arr[indx],scalesAndOffsets)}}}function renderSvgGraffitis(uData,scalesAndOffsets){var arr=[].slice.call(document.getElementsByTagNameNS(SVGNamespace,"svg"));for(var indx in arr){var grafo=arr[indx].id+" graffiti";if(uData[grafo]){drawGraffiti2svg(uData[grafo],arr[indx],scalesAndOffsets,uData)}}}};
