/*
package de.elxala.langutil
(c) Copyright 2005-2020 Alejandro Xalabarder Aulet

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

package de.elxala.langutil;


import java.text.SimpleDateFormat;
import java.util.Date;

import de.elxala.zServices.*;

/*


 Symbol   Meaning                 Presentation        Example
 ------   -------                 ------------        -------
 G        era designator          (Text)              AD
 y        year                    (Number)            1996
 M        month in year           (Text & Number)     July & 07
 d        day in month            (Number)            10
 h        hour in am/pm (1~12)    (Number)            12
 H        hour in day (0~23)      (Number)            0
 m        minute in hour          (Number)            30
 s        second in minute        (Number)            55
 S        millisecond             (Number)            978
 E        day in week             (Text)              Tuesday
 D        day in year             (Number)            189
 F        day of week in month    (Number)            2 (2nd Wed in July)
 w        week in year            (Number)            27
 W        week in month           (Number)            2
 a        am/pm marker            (Text)              PM
 k        hour in day (1~24)      (Number)            24
 K        hour in am/pm (0~11)    (Number)            0
 z        time zone               (Text)              Pacific Standard Time
 '        escape for text         (Delimiter)
 ''       single quote            (Literal)           '



 Format Pattern                         Result
 --------------                         -------
 "yyyy.MM.dd G 'at' hh:mm:ss z"    ->>  1996.07.10 AD at 15:08:56 PDT
 "EEE, MMM d, ''yy"                ->>  Wed, July 10, '96
 "h:mm a"                          ->>  12:08 PM
 "hh 'o''clock' a, zzzz"           ->>  12 o'clock PM, Pacific Daylight Time
 "K:mm a, z"                       ->>  0:00 PM, PST
 "yyyyy.MMMMM.dd GGG hh:mm aaa"    ->>  1996.July.10 AD 12:08 PM
*/

public class DateFormat
{
   private static logger log = new logger (null, "de.elxala.langutil.DateFormat", null);

   public static String DEFAULT_PATTERN = "yyyy-MM-dd HH:mm:ss";  // for MySql
   public static String DEFAULT_ZEROED_PATTERN = "1970-01-01 00:00:00"; // for MySql

   public Date theDate = new Date ();
   public String thePattern = DEFAULT_PATTERN;

   public DateFormat (String pattern)
   {
      thePattern = pattern;
   }

   public DateFormat (String pattern, Date fecha)
   {
      thePattern = pattern;
      theDate = fecha;
   }

   public DateFormat (Date fecha)
   {
      theDate = fecha;
   }

   private static SimpleDateFormat simpleFormat (String pattern)
   {
      SimpleDateFormat formatter = null;
      try
      {
         formatter = new SimpleDateFormat (pattern);
      }
      catch (Exception e)
      {
         log.err ("DateFormat", "exception parsing pattern [" + pattern + "] : " + e);
      }
      return formatter;
   }

   public String get ()
   {
      SimpleDateFormat formatter = simpleFormat (thePattern);
      if (formatter != null)
         return formatter.format (theDate);
      return theDate.toString ();
   }

   public static Date getDate (String strDate)
   {
      return getDate (strDate, DEFAULT_PATTERN, DEFAULT_ZEROED_PATTERN);
   }

   public long getAsLong ()
   {
      //yyyy-MM-dd HH:mm:ss S
      // NOTE : FIX the timezone offset to obtain the same result as
      //        in sqlite "SELECT strftime('%s', p1)"
      //        for example "SELECT strftime('%s','1970-01-01')" gives 0
      // specifically ...
      //       SETVAR, ahora, @<:lsx date yyyy-MM-dd HH:mm:ss>
      //       //Now is @<ahora>
      //       //
      //       //Milliseconds since 1970 =
      //       STRCONV, DATE-LONG, @<ahora>
      //       //
      //       //
      //       LOOP, SQL,, //SELECT strftime('%s', '@<ahora>') AS va
      //           ,, //Milliseconds since 1970 =@<va>000
      //
      //
      return theDate.getTime () + java.util.TimeZone.getDefault ().getOffset (0);
   }
   
   public static long getAsLong (String strDate)
   {
      return getDate (strDate, "yyyy-MM-dd HH:mm:ss S", "1970-01-01 00:00:00 0").getTime () + java.util.TimeZone.getDefault ().getOffset (0);
   }

   public static Date getDate (String strDate, String strPattern, String zeroedPattern)
   {
      if (strPattern.length () != zeroedPattern.length ())
      {
         log.severe ("getDate", "Bad call to getDate strPattern and zeroedPattern has to be of the same length [" + strPattern + "] [" + zeroedPattern + "]");
         return new Date (0);
      }
      if (strDate.length () < strPattern.length ())
      {
         strDate = strDate + zeroedPattern.substring (strDate.length ());
      }

      Date da = new Date (0);
      SimpleDateFormat formatter = simpleFormat (strPattern);
      if (formatter != null)
      {
         try
         {
            da = formatter.parse (strDate);
         }
         catch (java.text.ParseException pe)
         {
            log.err ("getDate", "Exception parsing the date [" + strDate + "] : " + pe);
            //pe.printStackTrace ();
         }
      }

      return da;
   }

   public static String getTodayStr ()
   {
      return getStr (new Date ());
   }

   public static String getStr (Date fecha)
   {
      DateFormat df = new DateFormat (fecha);

      return df.get ();
   }

   public static String getStr (Date fecha, String pattern)
   {
      DateFormat df = new DateFormat (pattern, fecha);

      return df.get ();
   }

   public static String quantityToStr (long quantity, String unitname)
   {
      return quantity + " " + unitname + (quantity > 1 ? "s": "");
   }

   public static String millisecondsToSapiens (long milliseconds)
   {
      if (milliseconds < 500)
         return milliseconds + " ms";

      float fseconds = (float) (milliseconds / 1000.);
      if (fseconds < 60.)
         return fseconds + " s";

      if (fseconds/60. < 60.)
      {
         long minutes = milliseconds / 60000;
         milliseconds %= 60000;
         fseconds = (float) (milliseconds / 1000.);
         return minutes + " min " + fseconds + " s";
      }

      long years = ((milliseconds / 3600000) / 365) /24;
      milliseconds %= (long) ((long) 365* (long) 24* (long) 3600000);

      long days = milliseconds / (24*3600000);
      milliseconds %= (24*3600000);

      //milliseconds %= (24*3600000);
      long hours = milliseconds / 3600000;
      milliseconds %= 3600000;
      long minutes = milliseconds / 60000;
      milliseconds %= 60000;
      long seconds = milliseconds / 1000;

      // some kind of accepted precision
      return (years > 0 ? quantityToStr(years, "year") + ", ": "") +
             ((years+days > 0) ? quantityToStr(days, "day") + ", ": "") +
             quantityToStr(hours, "hour") +
             (years > 0 ? "":
                   (", " + quantityToStr(minutes, "minute")) +
                   (days > 60 ? "": ", " + quantityToStr(seconds, "second")));
   }

};