/*
package javaj.widgets
Copyright (C) 2011 Alejandro Xalabarder Aulet

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

package javaj.widgets.gestures;

import de.elxala.math.space.*;

import android.content.Context;
import android.util.Log;
import android.view.MotionEvent;
import android.graphics.Rect;

/**
 * Detects a single touch performing a stroke
 *
 */
public class strokeDetector
{
   public vect3f pos_ini = null;
   public vect3f pos_now = null;
   public vect3f pos_fin = null;

   /**
    */
   public interface interested
   {
      public boolean onGestureStart    (strokeDetector detector);
      public boolean onGestureContinue (strokeDetector detector);
      public void    onGestureEnd      (strokeDetector detector, boolean cancel);
   }

    /**
     */
   public class SimpleStrokeListener implements interested
   {
      public boolean onGestureStart (strokeDetector detector)
      {
         return true;
      }

      public boolean onGestureContinue (strokeDetector detector)
      {
         return true;
      }

      public void onGestureEnd (strokeDetector detector, boolean cancel)
      {
      }
   }

   private Context mContext;
   private interested myInterested;

   public strokeDetector(Context context, interested listener)
   {
      mContext = context;
      myInterested = listener;
   }

   private float refOffX = 0.f, refOffY = 0.f, refScaleX = 1.f, refScaleY = 1.f;

   public void setRefOffsetScale(float offsetX, float offsetY, float scaleX, float scaleY)
   {
      refOffX = offsetX;
      refOffY = offsetY;
      refScaleX = scaleX;
      refScaleY = scaleY;
   }

   public float nowOffsetX = 0.f;
   public float nowOffsetY = 0.f;

   public float calcVectorX ()
   {
      return nowOffsetX - refOffX;
   }

   public float calcVectorY ()
   {
      return nowOffsetY - refOffY;
   }

   public void calcTranslationNow ()
   {
      android.util.Log.d ("soom", "   translation ...");

      // add 0.01 to avoid raise conditions (factor 0 or infinite)
      float desplazaX = (pos_now.x - pos_ini.x) / refScaleX;
      float desplazaY = (pos_now.y - pos_ini.y) / refScaleY;

      nowOffsetX = refOffX + desplazaX;
      nowOffsetY = refOffY + desplazaY;
   }

//////   public boolean onTouchEvent(MotionEvent event)
//////   {
//////      final int action = event.getAction();
//////      boolean handled = true;
//////
//////      android.util.Log.d ("CASCOS", "action = " + action + ", gestureInProgress " + gestureInProgress () + " pointers " + event.getPointerCount());
//////
//////      if (! gestureInProgress ())
//////      {
//////         //android.util.Log.d ("CASCOS", "no en marcha");
//////         // It could start a stroke
//////         if (event.getPointerCount() == 1 && action == MotionEvent.ACTION_DOWN)
//////         {
//////            pos_ini = new vect3f (event.getX(0), event.getY(0));
//////            pos_fin = null;
//////            pos_now = null;
//////
//////            //android.util.Log.d ("CASCOS", "pos_ini " + pos_ini.x + ", " + pos_ini.y);
//////            if (! myInterested.onGestureStart(this))
//////            {
//////               //android.util.Log.d ("CASCOS", "RETIROOOO");
//////               pos_ini = null;
//////            }
//////            return true;
//////         }
//////         return true;
//////      }
//////
//////      //android.util.Log.d ("CASCOS", "SEGUIM action = " + action + ", " + event.getPointerCount());
//////      switch (action)
//////      {
//////         case MotionEvent.ACTION_UP:
//////         case MotionEvent.ACTION_POINTER_1_UP:
//////         case MotionEvent.ACTION_POINTER_2_UP:
//////            //android.util.Log.d ("CASCOS", "UPPPD");
//////            pos_fin = pos_now;
//////            if (event.getPointerCount() > 0)
//////               pos_fin = new vect3f (event.getX(0), event.getY(0));
//////
//////            finalizeGesture (false);
//////            break;
//////
//////         case MotionEvent.ACTION_CANCEL:
//////            finalizeGesture (true);
//////            pos_ini = null;
//////            break;
//////
//////         case MotionEvent.ACTION_MOVE:
//////            //android.util.Log.d ("CASCOS", "MOVE");
//////            if (event.getPointerCount() > 0)
//////               pos_now = new vect3f (event.getX(0), event.getY(0));
//////            if (! myInterested.onGestureContinue(this))
//////               pos_ini = null;
//////            break;
//////
//////         default:
//////            return false; // not handled!
//////      }
//////
//////      return true;
//////   }
//////
//////
//////   protected void finalizeGesture (boolean dueCancel)
//////   {
//////      // here still gestureInProgress and gestureFinalized gives true
//////      myInterested.onGestureEnd (this, dueCancel);
//////
//////      // reset gestureInProgress and gestureFinalized
//////      pos_ini = null;
//////      pos_now = null;
//////      pos_fin = null;
//////   }
//////
//////    /**
//////     */
//////    public boolean gestureInProgress ()
//////    {
//////      return pos_ini != null && pos_fin == null;
//////    }
//////
//////    public boolean gestureFinalized ()
//////    {
//////      return pos_ini != null && pos_fin != null;
//////    }
}
