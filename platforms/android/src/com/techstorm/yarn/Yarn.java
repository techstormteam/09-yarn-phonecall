/*

       Licensed to the Apache Software Foundation (ASF) under one

       or more contributor license agreements.  See the NOTICE file

       distributed with this work for additional information

       regarding copyright ownership.  The ASF licenses this file

       to you under the Apache License, Version 2.0 (the

       "License"); you may not use this file except in compliance

       with the License.  You may obtain a copy of the License at



         http://www.apache.org/licenses/LICENSE-2.0



       Unless required by applicable law or agreed to in writing,

       software distributed under the License is distributed on an

       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY

       KIND, either express or implied.  See the License for the

       specific language governing permissions and limitations

       under the License.

 */

package com.techstorm.yarn;

import static android.content.Intent.ACTION_MAIN;

import org.apache.cordova.CordovaActivity;
import org.linphone.LinphoneActivity;
import org.linphone.LinphoneManager;
import org.linphone.LinphoneService;
import org.linphone.LinphoneSimpleListener.LinphoneOnCallStateChangedListener;
import org.linphone.core.LinphoneCall;
import org.linphone.core.LinphoneCall.State;
import org.linphone.core.LinphoneCore;
import org.linphone.core.LinphoneCoreException;
import org.linphone.core.PayloadType;

import android.app.Activity;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;

public class Yarn extends CordovaActivity implements
		LinphoneOnCallStateChangedListener

{

	private Handler mHandler;

	private ServiceWaitThread mThread;
	
	private Context context;
	
	@Override
	public void onCreate(Bundle savedInstanceState)

	{

		super.onCreate(savedInstanceState);
		this.context = getApplicationContext();
		//file:///android_asset/www/index.html
		// Set by <content src="index.html" /> in config.xml
		String pageUrl = getIntent().getStringExtra("page");
		if (pageUrl != null) {
			loadUrl(pageUrl);
		} else {
			loadUrl(launchUrl);
		}
//		getWindow().setSoftInputMode(this.getActivity()..LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);
		
		
		TelephonyManager tm = (TelephonyManager) this.getApplicationContext()
				.getSystemService(Service.TELEPHONY_SERVICE);
		tm.listen(new MyPhoneStateListener(), PhoneStateListener.LISTEN_CALL_STATE);

		mHandler = new Handler();

		if (LinphoneService.isReady()) {

			onServiceReady();

		} else {

			// start linphone as background

			startService(new Intent(ACTION_MAIN).setClass(this,
					LinphoneService.class));

			mThread = new ServiceWaitThread();

			mThread.start();

		}

	}

	public class MyPhoneStateListener extends PhoneStateListener {

    	@Override
    	public void onCallStateChanged(int state, String incomingNumber) {

			super.onCallStateChanged(state, incomingNumber);
			switch (state) {
			case TelephonyManager.CALL_STATE_IDLE:
				break;
			case TelephonyManager.CALL_STATE_OFFHOOK:
				
				break;
			case TelephonyManager.CALL_STATE_RINGING:
				Intent i = new Intent(context, Yarn.class);
//				i.putExtras(intent);
				i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
				context.startActivity(i);
				if (incomingNumber == null) {
					// outgoing call
				} else {
					// incoming call
				}
				break;
			}
    	}
    	
    	
    }
	
	private class ServiceWaitThread extends Thread {

		public void run() {

			while (!LinphoneService.isReady()) {

				try {

					sleep(30);

				} catch (InterruptedException e) {

					throw new RuntimeException(
							"waiting thread sleep() has been interrupted");

				}

			}

			mHandler.post(new Runnable() {

				@Override
				public void run() {

					onServiceReady();

				}

			});

			mThread = null;

		}

	}

	protected void onServiceReady() {

		final Class<? extends Activity> classToStart;

		classToStart = LinphoneActivity.class;

		LinphoneService.instance().setActivityToLaunchOnIncomingReceived(
				classToStart, Yarn.class);

		mHandler.postDelayed(new Runnable() {

			@Override
			public void run() {

				try {

					enableAllAudioCodecs();

					enableAllVideoCodecs();
					
				} catch (LinphoneCoreException e) {

					e.printStackTrace();

				}

			}

		}, 1000);

	}

	
	
	private void enableAllAudioCodecs() throws LinphoneCoreException {

		LinphoneCore lc = LinphoneManager.getLcIfManagerNotDestroyedOrNull();

		for (final PayloadType pt : lc.getAudioCodecs()) {

			LinphoneManager.getLcIfManagerNotDestroyedOrNull()
					.enablePayloadType(pt, true);

		}

	}

	private void enableAllVideoCodecs() throws LinphoneCoreException {

		LinphoneCore lc = LinphoneManager.getLcIfManagerNotDestroyedOrNull();

		for (final PayloadType pt : lc.getVideoCodecs()) {

			LinphoneManager.getLcIfManagerNotDestroyedOrNull()
					.enablePayloadType(pt, true);

		}

	}

	@SuppressWarnings("deprecation")
	@Override
	protected void onResume() {
		super.onResume();
		Bundle extras = getIntent().getExtras();
		if (extras.containsKey("canSendCustPhone")) {
			Boolean canSendCustPhone =  extras.getBoolean("canSendCustPhone");
			if (canSendCustPhone) {
				appView.sendJavascript("global.doSendCustPhone()");
			}
		}
		
		SharedPreferences prefs = PreferenceManager
                .getDefaultSharedPreferences(context);
		if (prefs.contains(context.getString(R.string.do_cellular_call))) {
			Boolean doNativeCall =  prefs.getBoolean(context.getString(R.string.do_cellular_call), false);
			String dialedNumber =  prefs.getString(context.getString(R.string.do_cellular_call_number), "");
			if (doNativeCall) {
//				loadUrl(launchUrl);
//				appView.sendJavascript("setDialedNumber('"+dialedNumber+"')");
				appView.sendJavascript("doCellularCall('"+dialedNumber+"')");
				SharedPreferences.Editor edit = prefs.edit();
				edit.putBoolean(context.getString(R.string.do_cellular_call), false);
				edit.putString(context.getString(R.string.do_cellular_call_number), "");
		        edit.commit();
			}
			
		}
	}
	
	
	@Override
	public void onCallStateChanged(LinphoneCall call, State state,

	String message) {

		if (state == State.IncomingReceived) {

			startActivity(new Intent(this, Yarn.class));

		} else if (state == State.OutgoingInit) {

			// if (call.getCurrentParamsCopy().getVideoEnabled()) {

			// startVideoActivity(call);

			// } else {

			startIncallActivity(call);

			// }

		} else if (state == State.CallEnd || state == State.Error
				|| state == State.CallReleased) {

			// Convert LinphoneCore message for internalization

			// if (message != null && message.equals("Call declined.")) {

			// displayCustomToast(getString(R.string.error_call_declined),
			// Toast.LENGTH_LONG);

			// } else if (message != null && message.equals("Not Found")) {

			// displayCustomToast(getString(R.string.error_user_not_found),
			// Toast.LENGTH_LONG);

			// } else if (message != null &&
			// message.equals("Unsupported media type")) {

			// displayCustomToast(getString(R.string.error_incompatible_media),
			// Toast.LENGTH_LONG);

			// }

			// resetClassicMenuLayoutAndGoBackToCallIfStillRunning();

		}

		// int missedCalls = LinphoneManager.getLc().getMissedCallsCount();

		// displayMissedCalls(missedCalls);

	}

	public void startIncallActivity(LinphoneCall currentCall) {

		Intent intent = new Intent(this, Yarn.class);

		intent.putExtra("VideoEnabled", false);

		// startOrientationSensor();

		// startActivityForResult(intent, CALL_ACTIVITY);

		startActivity(intent);

	}

}
