/*
de.elxala.parse.xml
Copyright (C) 2014 Alejandro Xalabarder Aulet

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

package de.elxala.parse.json;

import de.elxala.Eva.*;
import de.elxala.langutil.*;
import de.elxala.langutil.filedir.*;
import de.elxala.db.utilEscapeStr;

import de.elxala.zServices.*;

import java.util.*;
import org.json.*;

import de.elxala.parse.xmelonSchema;

/**
*/
public class jsonXmelon
{
   private static logger log = new logger (null, "de.elxala.parse.json.jsonXmelon", null);

   private xmelonSchema xemi = new xmelonSchema ();

   public static final String DEFAULT_IFNOT_STRING = "";
   public static final int TABLE_POLICY_REDUCED = 0;  // Only creates new tables when a new array is found
   public static final int TABLE_POLICY_PROLIFIC = 1; // Creates new tables also when a object type is found

   private String rootPathName = "joot";

   public int theTablePolicy = TABLE_POLICY_PROLIFIC;

   public jsonXmelon ()
   {
   }

   /// ignore rootTag list : these tags and all its descendants will be ignored
   public List optRootTagIgnoreList = new Vector ();

   /// ignore subTag list : these tags will be transparent (the descendant elements will be treated)
   public List optTransparentTagList = new Vector ();

   /// the tags will be replaced in the database
   public Map optTagAliases = new TreeMap ();



   public void parseFile (String fileToParse, String dbName, String tablePrefix)
   {
      parseFile (fileToParse, dbName, tablePrefix, false);
   }

   public void setRootName (String rootName)
   {
      rootPathName = rootName;
   }


   /**
      Parses the xml file 'fileToParse' and places the results in an xmelon
      schema into the database dbName using 'tablePrefix' for naming the tables.
   */
   public void parseFile (String fileToParse, String dbName, String tablePrefix, boolean keepCache)
   {
      TextFile textF = new TextFile ();
      if (! textF.fopen (fileToParse, "rb"))  // mode "rb" to be able to get the InputStream!
      {
         log.err ("processOneFile", "file to parse [" + fileToParse + "] cannot be opened!");
      }

      processOneFile (textF, dbName, fileToParse, tablePrefix, keepCache);
   }

   public void clearCache ()
   {
      xemi.clearCache ();
   }

   private void processOneFile (TextFile tfi, String dbName, String jsooFileName, String tablePrefix, boolean keepCache)
   {
      xemi.openDBforFileName (dbName, jsooFileName, tablePrefix);

      StringBuffer sb = tfi.readFileIntoStringBuffer (jsooFileName);
      if (sb == null)
      {
         log.err ("processOneFile", "file " + jsooFileName + " could not be read");
         return;
      }

      buildXmelonFromJSONString (sb.toString ());

      // run the script even if there is some parse error
      // this way we can know the last succsessful record
      xemi.closeDB ();
      tfi.fclose ();
      if (!keepCache)
         xemi.clearCache ();
   }

   // keep it private until the initialization of "xemi" is solved
   //
   private void buildXmelonFromJSONString (String jsooString)
   {
      JSONObject jsoo = null;
      try
      {
         jsoo = new JSONObject (jsooString);
      }
      catch (Exception e)
      {
         log.err ("buildEvaUnitFromJSONString", "exception parsing a JSON string : " + e);
      }
      if (jsoo != null)
      {
         pushLayer (rootPathName);
         buildXmelonFromJSONobj (jsoo);
         popLayer ();
      }
   }

   private void pushLayer (String layerName)
   {
      EvaLine ele = new EvaLine ();

      ele.setValue (layerName, xemi.cNODE);
      // ele.setValue ("json?", xemi.cNAMESPACE);  // not used!
      ele.setValue ("localname?", xemi.cLOCALNAME);
      ele.setValue ("" + (xemi.perFile.pathCounter ++), xemi.cCOUNTER);
      ele.setValue ("" + xemi.getPathCounterParent (), xemi.cPARENT_COUNTER);
      ele.setValue ("0", xemi.cHASDATA); // we don't know yet
      ele.setValue ("0", xemi.cHASATTRIB); // we don't know yet
      // ele.setValue (valor,

      // push element stack
      xemi.perFile.currentPath.addLine (ele);
   }

   private void popLayer ()
   {
      xemi.perFile.currentPath.removeLine (xemi.perFile.currentPath.rows () - 1);
   }


   private void buildXmelonFromJSONobj (JSONObject jsoo)
   {
      if (xemi.checkMisprog (xemi.perFile == null, "perFile")) return;
      if (xemi.checkMisprog (xemi.cached == null, "cached")) return;

      try
      {
         // only for Java PC, Android's JSON does not have the method getNames !!
         // String [] fields = JSONObject.getNames (jsoo);
         JSONArray fieldsArr = jsoo.names();

         long pathTyId = -1;

         for (int ii = 0; ii < fieldsArr.length (); ii ++)
         {
            String propName = fieldsArr.getString (ii);
            String dimension = propName;
            JSONObject theObj = jsoo.optJSONObject(propName);
            JSONArray theArr = jsoo.optJSONArray(propName);
            

            // resolve alias
            //
            String alias = (String) optTagAliases.get (propName);
            if (alias != null)
               dimension = alias;            

            if (optRootTagIgnoreList.contains (dimension))
            {
               log.dbg (2, "buildXmelonFromJSONobj", "ignoring field " + dimension);
               continue;
            }
            
            boolean transparent = optTransparentTagList.contains (dimension);

            if (theObj != null)
            {
               if (theTablePolicy == TABLE_POLICY_REDUCED)
               {
                  // buildXmelonFromJSONobj (theObj, parentRecord, baseName, "", newpropName);
                  log.err ("buildXmelonFromJSONobj", "TABLE_POLICY_REDUCED not supported!!");
               }
               else
               {
                  if (!transparent)  pushLayer (dimension);
                  buildXmelonFromJSONobj (theObj);
                  if (!transparent)  popLayer ();
               }
               continue;
            }
            if (theArr != null)
            {
               // an JSONArray might contain object but also be just an array of strings! (or objects ?)
               // so if it is an array of strings/objects we create an artificial object called value
               //   "value": stringvalue
               for (int aa = 0; aa < theArr.length (); aa ++)
               {
                  JSONObject jo = theArr.optJSONObject(aa);
                  if (jo == null)
                  {
                     jo = new JSONObject ("{ value: \"" + theArr.optString (aa, DEFAULT_IFNOT_STRING) + "\" }");
                  }

                  // Note : push and pop the same layer for each element of the array
                  //        so they get different patCnt (or layerCounter)
                  if (!transparent)  pushLayer (dimension);
                  buildXmelonFromJSONobj (jo);
                  if (!transparent)  popLayer ();
               }
               continue;
            }
            // No JSONObject, no JSONArray, then normal field
            //

            String valor = jsoo.optString (propName);

            if (pathTyId == -1)
               pathTyId = xemi.getPathTypeIdentifier();

            xemi.outData (pathTyId, dimension, xemi.DATA_PLACE_TAGVALUE, valor);
         }
      }
      catch (Exception e)
      {
         log.err ("poblateEvaUnitFromJSONobj", "exception parsing JSON : " + e);
      }
   }

   // o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o
   // MAIN CALL
   // o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o

   public static void main (String [] aa)
   {
      if (aa.length < 1)
      {
         System.out.println ("jsonXmelon Syntax: dbName jsonFile ...");
         return;
      }

      if ((new java.io.File("sessionLog")).exists ())
      {
         System.setProperty (org.gastona.gastonaCtes.PROP_SESSION_LOG_DIR, ".\\sessionLog");
         logServer.configure (".\\sessionLog\\", "xmelon", "v1.0");
      }


      // aa = new String [] {"data\\test_01.xml"};
      String outputDBName = aa[0];

      //Check is a valid sqlite3 db! (or not exists)
      TextFile dbFile = new TextFile ();
      if (dbFile.fopen(outputDBName, "rb"))
      {
         byte [] magic = new byte[16];

         int leidos = dbFile.readBytes(magic);
         boolean bad = (leidos > 0 && leidos != 16);
         if (bad || !(new String (magic)).equals("SQLite format 3\0"))
         {
            System.out.println ("First parameter has to be either a non existing file or a sqlite3 database file!");
            System.out.println ("[" + outputDBName + "] seems to belong to another kind of file.");
            System.out.println ("Take care and walk by the shadow (on a heavy sun)! (leidos = " + leidos + " composasa [" + new String (magic) + "]");
            System.exit (1);
         }
      }

      jsonXmelon jxan = new jsonXmelon ();
      for (int ii = 1; ii < aa.length; ii ++)
      {
         System.out.println ("parsing " + aa[ii] + "...");
         jxan.parseFile (aa[ii], outputDBName, "xmelon");
      }

      System.out.println ("well done!");
   }
}
