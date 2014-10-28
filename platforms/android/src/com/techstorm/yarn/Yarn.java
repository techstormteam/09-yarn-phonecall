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

import java.lang.reflect.Method;

import org.apache.cordova.CordovaActivity;
import org.linphone.LinphoneManager;
import org.linphone.LinphoneService;
import org.linphone.core.LinphoneCore;
import org.linphone.core.LinphoneCoreException;
import org.linphone.core.PayloadType;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;

public class Yarn extends CordovaActivity
{
	private Handler mHandler;
	private ServiceWaitThread mThread;
	
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
        
        mHandler = new Handler();
		
		if (LinphoneService.isReady()) {
			onServiceReady();
		} else {
			// start linphone as background  
			startService(new Intent(ACTION_MAIN).setClass(this, LinphoneService.class));
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
					throw new RuntimeException("waiting thread sleep() has been interrupted");
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
		
		LinphoneService.instance().setActivityToLaunchOnIncomingReceived(classToStart);
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
			LinphoneManager.getLcIfManagerNotDestroyedOrNull().enablePayloadType(pt, true);
		}
	}
    
    private void enableAllVideoCodecs() throws LinphoneCoreException {
		LinphoneCore lc = LinphoneManager.getLcIfManagerNotDestroyedOrNull();
		for (final PayloadType pt : lc.getVideoCodecs()) {
			LinphoneManager.getLcIfManagerNotDestroyedOrNull().enablePayloadType(pt, true);
		}
	}
}
