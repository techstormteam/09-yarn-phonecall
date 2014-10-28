package com.techstorm.yarn;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class SMSReceiver extends BroadcastReceiver {
    private static final String LOG_TAG = "SMSApp";
 
    /* package */ static final String ACTION =
            "android.provider.Telephony.SMS_RECEIVED";


	@Override
	public void onReceive(Context arg0, Intent intent) {
		if (intent.getAction().equals(ACTION)) {
//            StringBuilder buf = new StringBuilder();
//            Bundle bundle = intent.getExtras();
//            if (bundle != null) {
//                android.telephony.SmsMessage[] messages = Telephony.Sms.Intents.getMessagesFromIntent(intent);
//                for (int i = 0; i < messages.length; i++) {
//                    SmsMessage message = messages[i];
//                    buf.append("Received SMS from  ");
//                    buf.append(message.getDisplayOriginatingAddress());
//                    buf.append(" - ");
//                    buf.append(message.getDisplayMessageBody());
//                }
//            }
//            Log.i(LOG_TAG, "[Yarn] onReceiveIntent: " + buf);
			String aaa = "";
        }
	}
}