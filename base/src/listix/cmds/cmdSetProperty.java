/*
library listix (www.listix.org)
Copyright (C) 2005 Alejandro Xalabarder Aulet

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
   //(o) WelcomeGastona_source_listix_command SET PROP

   ========================================================================================
   ================ documentation for javajCatalog.gast ===================================
   ========================================================================================

   This embedded EvaUnit describe the documentation for this listix command. Basically contains
   the syntaxes, options and examples for the listix commnad.

#gastonaDoc#

   <docType>    listix_command
   <name>       SET PROP
   <groupInfo>  lang_variables
   <javaClass>  listix.cmds.cmdSetProperty
   <importance> 6
   <desc>       //Sets a java property

   <help>
      //
      // Sets a java Property

   <aliases>
      alias
      SET PROPERTY

   <syntaxHeader>
      synIndx, importance, desc
         1   ,    5      , //Set a java property

   <syntaxParams>
      synIndx, name          , defVal, desc
         1   , propertyName  ,       , //Name of java property
         1   , value         ,       , //Value to set

   <options>
      synIndx, optionName, parameters, defVal, desc
          1  , SOLVE LSX , 1 / 0    ,    1  , If false (0) 'value' will be set without any listix replacement (variables @<..>) at all

   <examples>
      gastSample




#**FIN_EVA#
*/

package listix.cmds;

import listix.*;
import de.elxala.Eva.*;

public class cmdSetProperty implements commandable
{
   /**
      get all the different names that the command can have
   */
   public String [] getNames ()
   {
      return new String [] {
         "SET PROP",
         "SET PROPERTY",
         "PROP=",
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

      //(o) TODO_remove old compatibility
      boolean solveLsx = "1".equals (cmd.takeOptionString(new String [] { "SOLVE", "SOLVELSX", "SOLVELISTIX" }, "1" ));

      /*
         <setado>
            SET VAR, Reina De los Mares, @<campo>...etc...blabla

      */
      String propertyName = cmd.getArg (0);  // parameter 1
      String value        = cmd.getArg (1, solveLsx);  // parameter 2

      if (propertyName.length () > 0)
      {
         cmd.getLog().dbg (2, "SET PROP", "System property [" + propertyName + "] set to [" + value + "]");
         System.setProperty(propertyName, value);
      }
      else
         cmd.getLog().err ("SET PROP", "Empty property name, value [" + value + "] cannot be set.");

      cmd.checkRemainingOptions (true);
      return 1;
   }
}
