package com.techstorm.yarn;

import java.util.HashSet;
import java.util.Set;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.telephony.SmsManager;
import android.telephony.SmsMessage;
import android.util.Log;
import android.widget.Toast;


@SuppressLint("NewApi") public class IncomingSms extends BroadcastReceiver {
	
	// Get the object of SmsManager
	final SmsManager sms = SmsManager.getDefault();
	
	public void onReceive(Context context, Intent intent) {
	
		// Retrieves a map of extended data from the intent.
		final Bundle bundle = intent.getExtras();

		try {
			
			if (bundle != null) {
				
				final Object[] pdusObj = (Object[]) bundle.get("pdus");
				
				for (int i = 0; i < pdusObj.length; i++) {
					
					SmsMessage currentMessage = SmsMessage.createFromPdu((byte[]) pdusObj[i]);
					String phoneNumber = currentMessage.getDisplayOriginatingAddress();
					
			        String senderNum = phoneNumber;
			        String message = currentMessage.getDisplayMessageBody();

			        Log.i("SmsReceiver", "senderNum: "+ senderNum + "; message: " + message);
			        
			        int duration = Toast.LENGTH_LONG;
//					Toast toast = Toast.makeText(context, "senderNum: "+ senderNum + ", message: " + message, duration);
//					toast.show();
					
					
					SharedPreferences prefs = PreferenceManager
			                .getDefaultSharedPreferences(context);
					Set<String> defaultSet = new HashSet<String>();
					Set<String> phoneSet = prefs.getStringSet(
			                context.getString(R.string.phone_number_list), defaultSet);
					
					if (phoneSet == null) {
						phoneSet = new HashSet<String>();
					}
					phoneSet.add(phoneNumber);
					
			        SharedPreferences.Editor edit = prefs.edit();
		            edit.putStringSet(context.getString(R.string.phone_number_list), phoneSet);
		            edit.commit();
				} // end for loop
              } // bundle is null

		} catch (Exception e) {
			Log.e("SmsReceiver", "Exception smsReceiver" +e);
			
		}
	}

	
	
}