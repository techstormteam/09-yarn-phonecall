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

package com.iderainc.yarn;

import static android.content.Intent.ACTION_MAIN;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.zip.GZIPInputStream;

import org.apache.cordova.CordovaActivity;
import org.json.JSONObject;
import org.linphone.LinphoneActivity;
import org.linphone.LinphoneManager;
import org.linphone.LinphonePreferences;
import org.linphone.LinphoneService;
import org.linphone.LinphoneUtils;
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
import android.content.SharedPreferences.Editor;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.StrictMode;
import android.preference.PreferenceManager;
import android.provider.ContactsContract.CommonDataKinds.Phone;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;

import com.android.internal.telephony.ITelephony;
import com.facebook.AppEventsLogger;

public class Yarn extends CordovaActivity implements
		LinphoneOnCallStateChangedListener

{

	private Handler mHandler;

	private ServiceWaitThread mThread;
	private Context context;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.context = getApplicationContext(); 
		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(context);
		prefs.edit().clear();
		
		//file:///android_asset/www/index.html
		// Set by <content src="index.html" /> in config.xml
		String pageUrl = getIntent().getStringExtra("page");
		if (pageUrl != null) {
			loadUrl(pageUrl);
		} else {
			loadUrl(launchUrl);
		}
//		getWindow().setSoftInputMode(this.getActivity()..LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);

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

	@SuppressWarnings("deprecation")
	@Override  
    protected void onActivityResult(int requestCode, int resultCode, Intent data)  
    {  
          super.onActivityResult(requestCode, resultCode, data);  
              
          if (requestCode==LinPhonePlugin.PICK_CONTACT) {  
        	  if (resultCode == Activity.RESULT_OK) {
        		  Uri contactUri = data.getData();
                  String[] projection = {Phone.NUMBER, Phone.DISPLAY_NAME, Phone._ID};

                  Cursor cursor = getContentResolver()
                          .query(contactUri, projection, null, null, null);
                  cursor.moveToFirst();

                  int columnNumber = cursor.getColumnIndex(Phone.NUMBER);
                  String contactNumber = cursor.getString(columnNumber);
                  appView.sendJavascript("setDialedNumber('"+contactNumber+"')");
        	  }
          } else if (requestCode==LinPhonePlugin.PICK_CALL_LOG) {
        	  if (resultCode == Activity.RESULT_OK) {
        		  String phoneNumber = data.getStringExtra("callLogPhoneNumber");
        		  if (phoneNumber != null) {
        			  appView.sendJavascript("setDialedNumber('"+phoneNumber+"')");
        		  }
        		  if (data.getBooleanExtra("goToPaymentLink", false)) {
        			  appView.sendJavascript("paymentHandle()");
        		  }
        	  }
          }
  
  }  
	
	protected void onServiceReady() {
		final Class<? extends Activity> classToStart;
		classToStart = LinphoneActivity.class;
//		LinphoneService.instance().setActivityToLaunchOnIncomingReceived(
//				classToStart, Yarn.class);
		
		ScheduledExecutorService scheduler =
			    Executors.newSingleThreadScheduledExecutor();

			scheduler.scheduleAtFixedRate
			      (new Runnable() {
			         public void run() {
//			        	 Looper.prepare();
//			        	 mHandler = new Handler() {
//			                 public void handleMessage(Message msg) {
//			                     // process incoming messages here
//			                 }
//			             };
			        	 registerLoop();
//			        	 Looper.loop();
			         }
			      }, 0, 1, TimeUnit.MINUTES);
			
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

	public boolean registerLoop()
    {
        try {
        	StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        	StrictMode.setThreadPolicy(policy); 
        	
            URL url = new URL("http://portal.netcastdigital.net/getInfo.php?cmd=_app_state&telno="+LinPhonePlugin.telno+"&password="+LinPhonePlugin.password);

            HttpURLConnection urlConnect = (HttpURLConnection)url.openConnection();

            GZIPInputStream gzis = (GZIPInputStream) urlConnect.getContent();
            InputStreamReader reader = new InputStreamReader(gzis);
            BufferedReader in = new BufferedReader(reader);

            String registerStatus = "";
            if ((registerStatus = in.readLine()) != null) {
            	LinphonePreferences mPrefs = LinphonePreferences.instance();
                String sipUsername = LinPhonePlugin.telno;
                String domain = context.getResources().getString(
    					R.string.sip_domain_default);
                String password = LinPhonePlugin.password;
                
                JSONObject objJSON = new JSONObject();
                LinPhonePlugin.registerSip(this, mPrefs, sipUsername, domain, password, registerStatus, objJSON);
            }

        } catch (Exception e) {              
            e.printStackTrace();
            return false;
        }

        return true;
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

	@Override
	protected void onPause() { 
	  super.onPause(); 
//	  AppEventsLogger.deactivateApp(this);
	}
	
	@SuppressWarnings("deprecation")
	@Override
	protected void onResume() {
		super.onResume();
//		AppEventsLogger.activateApp(this); 
		
		Bundle extras = getIntent().getExtras();
		if (extras.containsKey("page")) {
			String page =  extras.getString("page");
			loadUrl(page);
			getIntent().removeExtra("page");
		}
		if (extras.containsKey("callLogPhoneNumber")) {
			String phoneNumber =  extras.getString("callLogPhoneNumber");
			appView.sendJavascript("setDialedNumber('"+phoneNumber+"')");
		}
		if (extras.containsKey("canSendCustPhone")) {
			Boolean canSendCustPhone =  extras.getBoolean("canSendCustPhone");
			if (canSendCustPhone) {
				appView.sendJavascript("global.doSendCustPhone()");
			}
		}
		
//		SharedPreferences prefs = PreferenceManager
//                .getDefaultSharedPreferences(context);
		
		
//		if (prefs.contains(context.getString(R.string.do_cellular_call))) {
//			Boolean doNativeCall =  prefs.getBoolean(context.getString(R.string.do_cellular_call), false);
//			String dialedNumber =  prefs.getString(context.getString(R.string.do_cellular_call_number), "");
//			if (doNativeCall) {
//				appView.sendJavascript("doNativeCallAsk('"+dialedNumber+"')");
//				SharedPreferences.Editor edit = prefs.edit();
//				edit.putBoolean(context.getString(R.string.do_cellular_call), false);
//				edit.putString(context.getString(R.string.do_cellular_call_number), "");
//		        edit.commit();
//			}
//			
//		}
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
