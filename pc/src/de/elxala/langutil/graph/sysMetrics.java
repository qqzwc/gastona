/*
package de.elxala.langutil
(c) Copyright 2011 Alejandro Xalabarder Aulet

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

package de.elxala.langutil.graph;

//import java.awt.*;

/**
   @file   sysMetrics.java
   @author Alejandro Xalabarder Aulet
   @date   05.06.2011 14:13
   @project de.elxala.langutil.graph

   Some system metric abstractions


*/
public class sysMetrics
{
   public static int getScreenPixelWidth ()
   {
      return (int) java.awt.Toolkit.getDefaultToolkit().getScreenSize().getWidth();
   }

   public static int getScreenPixelHeight ()
   {
      return (int) java.awt.Toolkit.getDefaultToolkit().getScreenSize().getHeight();
   }

}
