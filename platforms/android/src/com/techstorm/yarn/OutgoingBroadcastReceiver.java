package com.techstorm.yarn;

import java.lang.reflect.Method;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.telephony.TelephonyManager;

import com.android.internal.telephony.ITelephony;

public class OutgoingBroadcastReceiver extends BroadcastReceiver {

	private Context appContext;
	
	@Override
	public void onReceive(Context context, Intent intent) {
		appContext = context;
		if (intent.getAction().equals("android.intent.action.PHONE_STATE")) {
			endCall();
			// If it is to call (outgoing)
//			Intent i = new Intent(context, OutgoingCallScreenDisplay.class);
			// i.putExtras(intent);
			// i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//			context.startActivity(i);
		}
	}

	private void endCall() {
		try {
			// Java reflection to gain access to TelephonyManager's
			// ITelephony getter
			TelephonyManager tm = (TelephonyManager) appContext.getSystemService(Context.TELEPHONY_SERVICE);
			Class<?> c = Class.forName(tm.getClass().getName());
			Method m = c.getDeclaredMethod("getITelephony");
			m.setAccessible(true);
			com.android.internal.telephony.ITelephony telephonyService = (ITelephony) m
					.invoke(tm);

			telephonyService = (ITelephony) m.invoke(tm);
			telephonyService.silenceRinger(); // error at this
			telephonyService.endCall();

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
