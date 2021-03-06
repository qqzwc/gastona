/*
Copyright (C) 2013 Alejandro Xalabarder Aulet

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

/*
   //(o) WelcomeGastona_source_listix_command JAVA STATIC

   ========================================================================================
   ================ documentation for javajCatalog.gast ===================================
   ========================================================================================

   This embedded EvaUnit describe the documentation for this listix command. Basically contains
   the syntaxes, options and examples for the listix commnad.

#gastonaDoc#

   <docType>    listix_command
   <name>       PERL
   <groupInfo>  system_run
   <javaClass>  listix.cmds.cmdPerl
   <importance> 3
   <desc>       //To call Perl with a script

   <help>
      //
      //  Calls perl EXPERIMENTAL for Windows platform
      //
      //    PERL, Perl expresion
      //
      //

   <aliases>
      alias
      PERL
      PERLA
      GASTPERL

   <syntaxHeader>
      synIndx, importance, desc
         1   ,    2      , //Makes a call to perl binary with the given script, the output will be written in the current listix target

   <syntaxParams>
      synIndx, name            , defVal, desc
         1   , [Perl expresion],       , //Perl expresion

   <options>
      synIndx, optionName  , parameters     , defVal    , desc
         1   , BODY        , perlCode       ,           , Perl code
         1   , FILE INPUT  , filename       ,           , File to be used for input
         1   , FILE OUTPUT , filename       ,           , File to be used for output
         1   , FILE ERROR  , filename       ,           , File to be used for error output

   <examples>
      gastSample

      calling perl1
      calling perl2

   <calling perl1>
      //#javaj#
      //
      //   <frames> oConsola
      //
      //#listix#
      //
      //   <main>
      //      PERL, //print "Hola perl!"

   <calling perl2>
      //#javaj#
      //
      //   <frames> main, Perl
      //
      //   <layout of main>
      //      EVA, 10, 10, 4, 4
      //
      //         , X
      //       X , xPerla
      //         , bRun
      //       X , oConso
      //
      //   <sysDefaultFonts>
      //      Consolas, 13, 0, TextArea
      //
      //#data#
      //
      //   <xPerla>
      //     //#!/usr/bin/perl
      //     //
      //     //print "gastona guys:\n";
      //     //
      //     //@guys = ("javaj");
      //     //
      //     //print "@guys\n";
      //     //
      //     //push (@guys, "lsx+sqlite");
      //     //
      //     //print "@guys\n";
      //     //
      //     //unshift(@guys, "gastona");
      //     //pop (@guys);
      //     //push (@guys, "listix");
      //     //push (@guys, "sqlite");
      //     //
      //     //print "@guys\n";
      //     //
      //     //push (@guys, "ruby");
      //     //print "@guys\n";
      //     //
      //     //push (@guys, "lua");
      //     //print "@guys\n";
      //     //
      //     //push (@guys, "perl");
      //     //print "@guys\n";
      //     //
      //
      //#listix#
      //
      //   <-- bRun>
      //      MSG, oConso clear
      //      PERL, @<xPerla>

#**FIN_EVA#
*/

package listix.cmds;

import listix.*;
import listix.cmds.callCaptureInpOut;
import de.elxala.Eva.*;
import de.elxala.langutil.*;
import de.elxala.langutil.streams.*;
import de.elxala.langutil.filedir.*;
import de.elxala.zServices.*;

/**
   Listix command PERL

*/
public class cmdPerl implements commandable
{
   /**
      get all the different names that the command can have
   */
   public String [] getNames ()
   {
      return new String [] {
          "PERL",
          "PERLA",
          "GASTPERL",
       };
   }

   /**
      Execute the commnad and returns how many rows of commandEva
      the command had.

         that           : the environment where the command is called
         commandEva     : the whole command Eva
         indxCommandEva : index of commandEva where the commnad starts
   */
   public int execute (listix that, Eva commandEva, int indxComm)
   {
      listixCmdStruct cmd = new listixCmdStruct (that, commandEva, indxComm);

      String script = cmd.getArg(0);

      // be compatible with old "ON FLY"
      if (cmd.getArgSize () > 1)
      {
         if (script.equals ("") || script.equalsIgnoreCase ("onfly") || script.equalsIgnoreCase ("on fly"))
            script = cmd.getArg(1);
         else {
            cmd.getLog().err ("PERL", "unsupported option \"" + script + "\"");
            return 1;
         }
      }

      that.log().dbg (4, "PERL", "inline script");
      String perlProcess = utilSys.isOSWindows () ? microToolInstaller.getExeToolPath("perl"): "perl";

      callCaptureInpOut.callCapture ("PERL", perlProcess, script, that, commandEva, indxComm);

      // callCapture already process the options but it is not updated in this variable "cmd"!
      // so we cannot check the remaining options now
      // we should pass cmd to callCapture, then remaining options will be ok at this point
      //
      //cmd.checkRemainingOptions ();
      return 1;
   }
}
