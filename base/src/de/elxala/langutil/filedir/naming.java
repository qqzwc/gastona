/*
java package de.elxala.Eva (see EvaFormat.PDF)
Copyright (C) 2005  Alejandro Xalabarder Aulet

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 3 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/

package de.elxala.langutil.filedir;

/**   ======== de.elxala.langutil.filedir ==========================================
   Alejandro Xalabarder
*/

import de.elxala.langutil.*;

/**
   class naming
   @author Alejandro Xalabarder Aulet
   @date   2010

   Utilities with names
*/
public class naming
{
   static int UNIQUE_LONNAME_ID = 0;

   public static String toVariableName (String text)
   {
      if (text.length () == 0) return "_";
      return reduceName (text, true);
   }

   // allow array as parameter for static call JAVAJ STATIC
   // but only the first element will be processed
   public static String toVariableName (String [] text)
   {
      if (text.length == 0) return "_";
      return toVariableName (text[0]);
   }

   // if fullname length is less that 61 then return it unchanged
   // if not the resulting name will have 63 characters and the last
   // 7 are a "unique" number (until 10 millions unique numbers!)
   private static String upto64LenName (String fullname)
   {
      if (fullname.length () <= 60) return fullname;

      String uniqueNr = "000000" + (UNIQUE_LONNAME_ID ++);
      uniqueNr = uniqueNr.substring (uniqueNr.length ()-7);

      return fullname.substring (0, 56) + uniqueNr;
   } 

   /**
      for instance, when burning a CD with files
      the name of the files has to be ISO 9660-Joliet

      file name length <= 64
      file name do not contain strange characters (like ';' typically when saving internet pages with IExplorer)
   */
   public static String toNameISO_9660Joliet (String fileName)
   {
      return reduceName (fileName, false);
   }


   protected static String reduceName (String name, boolean valid4Variable)
   {
      if (valid4Variable && name.length () > 0 && name.charAt (0) >= '0' && name.charAt (0) <= '9')
      {
         // don't allow starting with 0..9
         name = "v" + name;
      }
      
      String ss = upto64LenName (name);

      for (int ii = 0; ii < ss.length (); ii ++)
      {
         char ica = ss.charAt (ii);
         if ((ica >= '0' && ica <= '9') ||
             (ica >= 'A' && ica <= 'Z') ||
             (ica >= 'a' && ica <= 'z') || 
             (ica == '_') ||
             (!valid4Variable && (ica == '-' || ica == '.'))) continue;
         ss = ss.replace (ica, '_');
      }

      return ss;
   }

   //ensure a path name is ISO 9660 Joliet
   public static String ensurePathJoliet (String thePath)
   {
      if (thePath.length () == 0) return "";

      String [] subpaths = thePath.split("[\\\\\\/]"); // either \ or /
      StringBuffer ss = new StringBuffer ();
      int ii = 0;

      if (subpaths.length > 0)
      {
         // for each except the last one!
         for (ii = 0; ii + 1 < subpaths.length; ii ++)
         {
            toNameISO_9660Joliet (subpaths[ii] + "/");
         }
         ss.append (toNameISO_9660Joliet (subpaths[ii]));
      }

      return ss.toString ();
   }
}