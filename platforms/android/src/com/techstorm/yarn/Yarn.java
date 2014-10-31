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
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

public class Yarn extends CordovaActivity implements
		LinphoneOnCallStateChangedListener

{

	private Handler mHandler;

	private ServiceWaitThread mThread;

	@Override
	public void onCreate(Bundle savedInstanceState)

	{

		super.onCreate(savedInstanceState);
		//file:///android_asset/www/index.html
		// Set by <content src="index.html" /> in config.xml
		String pageUrl = getIntent().getStringExtra("page");
		if (pageUrl != null) {
			loadUrl(pageUrl);
		} else {
			loadUrl(launchUrl);
		}

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

		classToStart = Yarn.class;

		LinphoneService.instance().setActivityToLaunchOnIncomingReceived(
				classToStart);

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
