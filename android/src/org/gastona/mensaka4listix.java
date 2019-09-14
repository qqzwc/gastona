/*
library de.elxala
Copyright (C) 2005-2019 Alejandro Xalabarder Aulet

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 59 Temple
Place - Suite 330, Boston, MA 02111-1307, USA.
*/

package org.gastona;

import org.gastona.cmds.*;

import de.elxala.Eva.*;
import de.elxala.langutil.filedir.*;
import de.elxala.mensaka.*;
import de.elxala.langutil.*;
import de.elxala.zServices.*;

import java.util.List;
import java.util.Vector;
import javaj.*;
import javaj.widgets.basics.*;
import listix.table.*;
import listix.cmds.*;
import listix.*;


/**
   04.08.2007 23:14

   //(o) gastona_TODO_DOC

   agente que se subscribe a todos los mensajes "evas de listix que empiezan por --"
   y llama a listix cuando estos son recibidos

   adema's realiza la accio'n de subscribirse al mensaje especial para javaj
   "gastona switchJavajLayout data!"


*/
public class mensaka4listix implements MensakaTarget
{
   public static final String INITIAL_TEXT_ACTION = "-- ";

//   private static final int RX_JAVAJ_EXIT_JAVAJ = 3;
   private static final int RX_JAVAJ_FRAME = 4;
   private static final int RX_JAVAJ_MASK = 5;
   private static final int RX_BASE_ACTION = 2000;

   private MessageHandle TX_REVERT_ALL_TEXTS = new MessageHandle ();
   private logger log = new logger (this, "gastona.mensaka4listix", null);

   private listix theListix = null;
   //-!- private javaj36 theJavaj = null;

   private Eva EActions = new Eva (":gastona actions");

   public mensaka4listix (EvaUnit euListix, EvaUnit euJavaj, EvaUnit euData, String[] aa)
   {

      log.dbg (2, "constructor", "starting with listix # " + euListix.size () +
                                              " javaj # "  + euJavaj.size () +
                                              " data # "   + euData.size () +
                                              " params # " + aa.length);

      Mensaka.subscribe (this, RX_JAVAJ_FRAME, ":gastona javaj FRAME");
      Mensaka.subscribe (this, RX_JAVAJ_MASK , ":gastona javaj MASK");

      // this message is not mandatory to be subscribed, the are provided only for text widgets
      Mensaka.declare (this, TX_REVERT_ALL_TEXTS,  widgetEBS.sMSG_FORECAST_DATA_FROM_WIDGET_TO_MODEL, logServer.LOG_DEBUG_0);

      log.dbg (2, "constructor", "preparing listix");
      // prepar listix. Note that call to <main> format of listix is postponed (see  startListixMain)
      prepareListix (euListix, aa);
      theListix.setGlobalData (euData);

      // now start javaj

      if (euJavaj != null && euJavaj.size () > 0)
      {
         log.dbg (2, "constructor", "preparing javaj");
         //-!- theJavaj = new javaj36 (euJavaj, euData);
      }

      //(o) Android_startup calling main and main0 by first load

      //-!- if (theJavaj != null)
      //-!- {
      //-!-    log.dbg (2, "constructor", "staring javaj");
      //-!-
      //-!-    theJavaj.startPhase1 ();
      //-!-
         log.dbg (2, "constructor", "loading rest of listix actions");
         loadActions (euListix);

         startListixMain (euData, "main0");
      //-!-    theJavaj.startPhase2 ();
      //-!- }
      //-!- else
      //-!- {
      //-!-    // we have to start manually the listix main
      //-!-    log.dbg (2, "constructor", "staring listix (no javaj script found)");
      //-!-    startListixMain (euData, "main0");
      //-!- }

      // 08.01.2011 12:57 now the main will be called in gastonaFlexActor!
      //
      // log.dbg (2, "constructor", "staring listix main");
      // startListixMain(euData, "main");
  }

   public boolean hasListix ()
   {
      return theListix != null;
   }

   private void prepareListix (EvaUnit euListix, String [] aa)
   {
      // preload listix : only the formats to add the gastona specific listix commands
      theListix = new listix (euListix, null /* data */, new tableCursorStack (), aa);
      theListix.addInternCommand (new CmdMsgBox ());        // command "MSGBOX"
      theListix.addInternCommand (new CmdJavaj ());         // command "JAVAJ"
      theListix.addInternCommand (new CmdLaunchGastona ()); // command "LAUNCH GASTONA"
      theListix.addInternCommand (new CmdGast2 ()); // command "LAUNCH GASTONA2"
   }

   /**
      clean up method
      (at this moment, don't know if it is even needed)
   */
   public void destroy ()
   {
      if (theListix != null)
         theListix.destroy ();
   }

   private void startListixMain (EvaUnit pData, String script)
   {
      theListix.setGlobalData (pData);
      if (theListix.getVarEva (script) != null)
      {
         theListix.printLsxFormat (script);
      }
   }

   public void runListixFormat (String lsxFormat)
   {
      runListixFormat (lsxFormat, null);
   }

   public void runListixFormat (String lsxFormat, String [] params)
   {
      if (!hasListix ())
      {
         log.severe ("runListixFormat", "trying to call format " + lsxFormat + " but no listix!");
         return;
      }
      if (theListix.getVarEva (lsxFormat) != null)
      {
         log.dbg (2, "runListixFormat", "calling format " + lsxFormat);
         theListix.printLsxFormat (lsxFormat, params);
      }
      else log.dbg (2, "runListixFormat", "format " + lsxFormat + " not found");
   }

   /*
      load actions from #listix# (evas beginning with "<--")

      08.03.2009 23:05
      Note: It is safe to call this method more times
   */
   private void loadActions (EvaUnit unitListix)
   {
      if (unitListix == null)
      {
         return;
      }

      // subscribe to all the actions
      //
      for (int ii = 0; ii < unitListix.size (); ii ++)
      {
         String evaName = unitListix.getEva (ii).getName ();  // e.g. "<-- bBoton>"

         if (evaName.startsWith (INITIAL_TEXT_ACTION) && EActions.rowOf(evaName) == -1)
         {
            String message = evaName.substring (INITIAL_TEXT_ACTION.length ());  // e.g. "bBoton"

            log.dbg (2, "loadActions", "listix subscribes to [" + message + "]");
            Mensaka.subscribe (this, RX_BASE_ACTION + EActions.rows (), message);
            EActions.addRow (evaName);
         }
      }
   }

   /**
      Here we might receive either the JAVAJ_DEFAULT_DATA signal
      or an action which are contained into the eva EActions and
      the subscription of each one is mapped to 2000 + index of action in EActions eva
   */
   public boolean takePacket (int map, EvaUnit data, String [] pars)
   {
      boolean seguimos = false;

      switch (map)
      {
         case RX_JAVAJ_FRAME:
            {
               //-!- String frameName = data.getSomeHowEva ("frameName").getValue ();
               //-!- String visi      = data.getSomeHowEva ("visible").getValue ();
               //-!- log.dbg (2, "takePacket", "received JAVAJ FRAME " + frameName + " " + visi);
               //-!- if (theJavaj != null)
               //-!- {
               //-!-    theJavaj.showFrame (frameName, visi.equals("1") || visi.length () == 0); // default is visible
               //-!- }
               //-!- else log.err ("takePacket", "received JAVAJ FRAME but application has no javaj instance!");
            }
            break;

         case RX_JAVAJ_MASK:
            String lay1 = data.getSomeHowEva ("layoutToMask").getValue ();
            String lay2 = data.getSomeHowEva ("masklayout").getValue ();

            //-!- log.dbg (2, "takePacket", "received JAVAJ MASK [" + lay1 + "] -> [" + lay2 + "]");
            //-!- if (theJavaj != null)
            //-!- {
            //-!-    theJavaj.maskLayout (lay1, lay2);
            //-!-    theJavaj.relayout ();
            //-!- }
            //-!- else log.err ("takePacket", "received JAVAJ MASK but application has no javaj instance!");
            break;

          default:
            seguimos = true;
      }

      if (! seguimos) return true;

      // an action (evas which name start with "-- " e.g. <-- bBoton>
      // is an action called "bBoton" and we received it mapped to a number
      // > 2000
      //
      int actionIndx = map - RX_BASE_ACTION;
      if (actionIndx < 0 || actionIndx >= EActions.rows ())
      {
         // it is not an action ?
         // !error
         return false;
      }

      // collect parameters if given
      //
      String [] params = pars;

      // always collect all edit widgets
      //
      Mensaka.sendPacket (TX_REVERT_ALL_TEXTS, null);

      // get the action by index
      String action = EActions.getValue (actionIndx, 0);
      theListix.printLsxFormat (action, params);
      
      // *** required for programMe demo since it closes the mico http on exit
      if (action.equals ("-- javaj exit"))
      {
         // Script finishing listening to this message gets automatically unsubscribed
         
         log.dbg (2, "takePacket", "This is the end my friend!");
         Mensaka.unsubscribe (this);
      }

      return true;
   }
}
