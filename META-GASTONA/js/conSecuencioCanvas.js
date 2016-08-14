/**
 * conSecuencioCanvas - simple canvas sequence diagram
 * Copyright (c) 2016, Alejandro Xalabarder
 */

// c2d Canvas from canv.getContext('2d');
//
function conSecuencioCanvas (c2d, diagData)
{
   var arr = diagData["sequenceTable"];
   var dia = diagData["distanceAgents"];
   var dit = diagData["distanceTimeUnit"];
   var maxGapTime = diagData["maxGapTime"];
   var autoElapsed = diagData["autoElapsed"];
   if (typeof dia === "string") dia = parseInt (dia);
   if (typeof dit === "string") dit = parseInt (dit);
   if (typeof maxGapTime === "string") maxGapTime = parseInt (maxGapTime);

   if (arr.length == 0) return ;
   
   // expected schema of sequenceTable (columns):  time, source, target, message
   //
   var iTimeStamp = arr[0].indexOf ("time");
   var iAgentTx   = arr[0].indexOf ("source");
   var iAgentRx   = arr[0].indexOf ("target");
   var iMessage   = arr[0].indexOf ("message");

   var agents = getAgents(arr, iAgentTx, iAgentRx);
   var timesIda = {}; // track elapsed times (or try to)

   function hasTime ()
   {
      return iTimeStamp != -1;
   }
   
   function getAgents (mats, tx, rx)
   {
      var agArr = [];
      var siz = mats.length;
      if (siz < 2) return agArr;

      if (rx === -1 || tx === -1) return agArr;

      for (var ii in mats)
      {
         if (ii === "0") continue;

         if (tx != -1 && agArr.indexOf (mats[ii][tx]) == -1)
            agArr.push (mats[ii][tx]);
         if (rx != -1 && agArr.indexOf (mats[ii][rx]) == -1)
            agArr.push (mats[ii][rx]);
      }

      return agArr;
   }
     
   function getElapsed (tnow, indxFrom, indxTo, /**/ telapsed)
   {
      if (!autoElapsed) return "";

      telapsed = timesIda["" + indxTo + "/" + indxFrom];
      delete timesIda["" + indxFrom + "/" + indxTo];

      if (telapsed)
      {
         telapsed = "(" + Math.round ((tnow - telapsed) * 1000)/1000 + " s)";
      }
      else timesIda["" + indxFrom + "/" + indxTo] = tnow;
      return telapsed;
   }
   

   // ----- CANVAS

   // DEFAULT VALUES
   //
   dia = dia || 360;  // horizontal distance between agents
   dit = dit ||  50;  // vertical distance between time units (i.e. seconds)
   maxGapTime = maxGapTime || 6;
   autoElapsed = autoElapsed || true;

   function textWidth (txt) { return c2d.measureText (txt).width ; }

   c2d.font = "22px Tahoma";
   var PIX_CHAR = textWidth ("X"); // suppose width == height for X
   var DIM_PTA = PIX_CHAR * .6;
   var DIM_PTAx2 = 2 * DIM_PTA;
   var DIM_PTAx4 = 4 * DIM_PTA;

   dia = dia || (PIX_CHAR * 30);  // horizontal distance between agents
   dit = dit || (PIX_CHAR * 3);  // vertical distance between time units (i.e. seconds)


   function flecha (x0, x1, y0, L2R, text)
   {
      var xpunt = L2R ? x1: x0,
          xbase = xpunt + (L2R ? - DIM_PTAx2: + DIM_PTAx2),
          xtext = xbase + (L2R ? - 3 * DIM_PTAx2 - textWidth (text): +3 * DIM_PTAx2),
          xend  = L2R ? x0: x1;

      c2d.beginPath();

      // line from end to base   ---------------| >
      c2d.moveTo (xend, y0);
      c2d.lineTo (xbase, y0);
      
      // arrow    | >
      c2d.moveTo (xbase, y0 - DIM_PTA);
      c2d.lineTo (xbase, y0 + DIM_PTA);
      c2d.lineTo (xpunt, y0);
      c2d.lineTo (xbase, y0 - DIM_PTA);
      c2d.stroke ();

      if (text && text.length > 0)
      {
         // text background 
         c2d.fillStyle = "#EEEEEE";
         c2d.fillRect (xtext - DIM_PTA, 
                       y0 - DIM_PTAx2, 
                       DIM_PTA + DIM_PTAx2 + textWidth (text), 
                       DIM_PTAx2 * 2);
      
         // text itself
         c2d.fillStyle = "#000000";
         c2d.fillText (text, xtext, y0 + DIM_PTA);
      }
   }

   function label (timo, indxFrom, indxTo, txt)
   {
      ////
      ////// split text into a text array if larger than distance between agents
      //////
      ////if (dia < 2) dia = 2;   // some minimum
      ////
      ////// make array of strings if needed
      ////var txtarr = [];
      ////for (p1 = 0, ii = 0; p1 < txt.length; p1 += (dia-sPre.length), ii ++)
      ////{
      ////   txtarr [ii] = txt.substring (p1, p1+(dia-sPre.length));
      ////}
      ////
      ////// time
      //////
      ////var stim = timo >= 0 ? (timo + ""): "";
      ////
      ////// first line(s) for label
      //////
      ////var sPos, title, b1, b2;
      ////for (ii = 0; ii < txtarr.length; ii ++)
      ////{
      ////   sPos = rechar (' ', dia - sPre.length - txtarr[ii].length);
      ////   title, b1, b2;
      ////
      ////   if (indxFrom < indxTo)
      ////   {
      ////      title = sPre + txtarr[ii] + sPos;
      ////      b1 = i0;
      ////      b2 = agents.length - i0 - 2;
      ////   }
      ////   else
      ////   {
      ////      title = sPos + txtarr[ii] + sPre;
      ////      b1 = i1 - 1;
      ////      b2 = agents.length - i1 - 1;
      ////   }
      ////
      ////   // label
      ////   out (rechar (' ', stim.length) + barras (b1) + title + barras (b2));
      ////}
   }

   var timeLine = dia * .50;
   var x0, y0 = 2*DIM_PTAx4, x1;
   var currTim = 0.;
   var dtFin = dit * 2 * arr.length;

   if (hasTime ())
   {
      currTim = arr[1][iTimeStamp];
      dtFin   = Math.min (dit * (arr[arr.length-1][iTimeStamp] - currTim), (arr.length-1) * maxGapTime * dit);
      //dtFin   = dit * (arr[arr.length-1][iTimeStamp] - currTim);
   }

   c2d.beginPath();
   c2d.setLineDash([3,6]);

   // draw all agents and their columns
   //
   for (var ag = 0, x0 = timeLine; ag < agents.length; ag ++, x0 += dia)
   {
      c2d.moveTo (x0, y0);
      c2d.lineTo (x0, dtFin);
      c2d.moveTo (x0 - dia * 0.2, y0);
      c2d.lineTo (x0 + dia * 0.2, y0);

      c2d.fillText (agents[ag], x0 - textWidth (agents[ag]) * 0.5, y0 - PIX_CHAR);
   }
   c2d.stroke();
   c2d.setLineDash([1,0]);

   y0 += dit;

   var ti, a1, a2, tx, dirLR, dimFlex = DIM_PTA;

   for (var aa in arr)
   {
      if (aa === "0") continue;

      ti = hasTime () ? arr[aa][iTimeStamp]: parseInt (aa);
      a1 = agents.indexOf (arr[aa][iAgentTx]);
      a2 = agents.indexOf (arr[aa][iAgentRx]);
      tx = arr[aa][iMessage];

      dirLR = a1 < a2;

      // add time gap
      //
      if (dit > 0 && ti >= 0)
      {
         if (!hasTime () || (ti - currTim) < maxGapTime)
            y0 += Math.max(DIM_PTAx2 + DIM_PTAx4, (ti - currTim) * dit);
         else
         {
            // text background 
            c2d.fillStyle = "#EEEEEE";
            c2d.fillRect (-DIM_PTAx4 + timeLine, y0 + DIM_PTAx4, dia * (agents.length - 1) + 2 * DIM_PTAx4, DIM_PTAx4);
            c2d.fillStyle = "#000000";
            c2d.fillText ("... " + Math.round (ti - currTim) + " s ...", DIM_PTAx2 + timeLine, y0 + DIM_PTAx4 + DIM_PTAx2 + DIM_PTA);

            y0 += (3 * DIM_PTAx2 + dit);
         }
         currTim = ti;
      }
      
      if (hasTime () && currTim > 0)
      {
         x0 = timeLine - 3 * DIM_PTA - textWidth (currTim);
         c2d.fillText (currTim, x0, y0 + DIM_PTA);
      }

      x0 = timeLine + (dirLR ? a1: a2) * dia;
      x1 = timeLine + (dirLR ? a2: a1) * dia;

      if (dirLR)
           c2d.fillText (tx, x0 + DIM_PTAx2, y0 - DIM_PTAx2);
      else c2d.fillText (tx, x1 - DIM_PTAx2 - textWidth (tx), y0 - DIM_PTA);

      flecha (x0, x1, y0, dirLR, getElapsed (ti, a1, a2));
   }
}
