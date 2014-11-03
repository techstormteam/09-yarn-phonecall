package com.techstorm.yarn;

import java.lang.reflect.Method;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.telephony.TelephonyManager;
import android.widget.Toast;

import com.android.internal.telephony.ITelephony;

public class OutgoingCallReceiver extends BroadcastReceiver {
	
	public void onReceive(Context context, Intent intent) {
//		int duration = Toast.LENGTH_LONG;
//		Toast toast = Toast.makeText(context, "outgoing here",duration);
//		toast.show();
		if (Intent.ACTION_NEW_OUTGOING_CALL.equals(intent.getAction())) {
//			SharedPreferences prefs = PreferenceManager
//	                .getDefaultSharedPreferences(context);
//					SharedPreferences.Editor edit = prefs.edit();
//					boolean nativeCallEnable = prefs.getBoolean(context.getString(R.string.native_call_enable), false);
//					if (!nativeCallEnable) {
//						endCall(context);
//						String number = intent.getStringExtra(Intent.EXTRA_PHONE_NUMBER);
//						edit.putBoolean(context.getString(R.string.do_cellular_call), true);
//						edit.putString(context.getString(R.string.do_cellular_call_number), number);
//						edit.commit();
//						Intent i = new Intent(context, Yarn.class);
//						i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//						context.startActivity(i);
//					}
//					
//					edit.putBoolean(context.getString(R.string.native_call_enable), false);
//			        edit.commit();
	    }
	}

	private void endCall(Context context) {
		try {
			// Java reflection to gain access to TelephonyManager's
			// ITelephony getter
			TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
			Class<?> c = Class.forName(tm.getClass().getName());
			Method m = c.getDeclaredMethod("getITelephony");
			m.setAccessible(true);
			com.android.internal.telephony.ITelephony telephonyService = (ITelephony) m
					.invoke(tm);

			telephonyService = (ITelephony) m.invoke(tm);
//			telephonyService.silenceRinger(); // error at this
			telephonyService.endCall();
			

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}