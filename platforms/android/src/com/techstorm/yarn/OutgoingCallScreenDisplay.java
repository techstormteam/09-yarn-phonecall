package com.techstorm.yarn;

import android.app.Activity;
import android.app.Service;
import android.os.Bundle;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;

public class OutgoingCallScreenDisplay extends Activity {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		TelephonyManager tm = (TelephonyManager) this.getApplicationContext()
				.getSystemService(Service.TELEPHONY_SERVICE);
		tm.listen(new MyPhoneStateListener(), PhoneStateListener.LISTEN_CALL_STATE);
		
	}

	public class MyPhoneStateListener extends PhoneStateListener {

    	@Override
    	public void onCallStateChanged(int state, String incomingNumber) {
    		// TODO Auto-generated method stub

			super.onCallStateChanged(state, incomingNumber);
			switch (state) {
			case TelephonyManager.CALL_STATE_IDLE:
				break;
			case TelephonyManager.CALL_STATE_OFFHOOK:
				String Sdsdsd = "";
				if (incomingNumber == null) {
					// outgoing call
				} else {
					// incoming call
				}
				break;
			case TelephonyManager.CALL_STATE_RINGING:

				if (incomingNumber == null) {
					// outgoing call
				} else {
					// incoming call
				}
				break;
			}
    	}
    }
	
}
