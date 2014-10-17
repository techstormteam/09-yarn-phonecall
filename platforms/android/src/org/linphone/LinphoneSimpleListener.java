/*
LinphoneServiceListener.java
Copyright (C) 2011  Belledonne Communications, Grenoble, France

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
*/
package org.linphone;

import org.linphone.core.LinphoneAddress;
import org.linphone.core.LinphoneCall;
import org.linphone.core.LinphoneContent;
import org.linphone.core.LinphoneCore;
import org.linphone.core.LinphoneEvent;
import org.linphone.core.LinphoneProxyConfig;
import org.linphone.core.LinphoneCall.State;
import org.linphone.core.LinphoneChatMessage;
import org.linphone.core.LinphoneChatRoom;
import org.linphone.core.LinphoneCore.GlobalState;
import org.linphone.core.LinphoneCore.RegistrationState;
import org.linphone.core.LinphoneCore.RemoteProvisioningState;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

public interface LinphoneSimpleListener {

	public static interface LinphoneServiceListener extends
				LinphoneOnGlobalStateChangedListener,
				LinphoneOnCallStateChangedListener,
				LinphoneOnCallEncryptionChangedListener
		{
		void tryingNewOutgoingCallButCannotGetCallParameters();
		void tryingNewOutgoingCallButWrongDestinationAddress();
		void tryingNewOutgoingCallButAlreadyInCall();
		void onDisplayStatus(String message);
		void onRegistrationStateChanged(LinphoneProxyConfig proxy,RegistrationState state, String message);
	}


	public static interface LinphoneOnCallEncryptionChangedListener extends LinphoneSimpleListener {
		void onCallEncryptionChanged(LinphoneCall call, boolean encrypted, String authenticationToken);
	}

	public static interface LinphoneOnGlobalStateChangedListener extends LinphoneSimpleListener {
		void onGlobalStateChanged(GlobalState state, String message);
	}

	public static interface LinphoneOnCallStateChangedListener extends LinphoneSimpleListener {
		void onCallStateChanged(LinphoneCall call, State state, String message);
	}

	public static interface LinphoneOnAudioChangedListener extends LinphoneSimpleListener {
		public enum AudioState {EARPIECE, SPEAKER, BLUETOOTH}
		void onAudioStateChanged(AudioState state);
	}
	
	public static interface LinphoneOnMessageReceivedListener extends LinphoneSimpleListener {
		void onMessageReceived(LinphoneAddress from, LinphoneChatMessage message, int id);
	}

	public static interface LinphoneOnRegistrationStateChangedListener extends LinphoneSimpleListener {
		void onRegistrationStateChanged(LinphoneProxyConfig proxy, RegistrationState state, String message);
	}

	public static interface ConnectivityChangedListener extends LinphoneSimpleListener {
		void onConnectivityChanged(Context context, NetworkInfo eventInfo, ConnectivityManager cm);
	}
	
	public static interface LinphoneOnDTMFReceivedListener extends LinphoneSimpleListener {
		void onDTMFReceived(LinphoneCall call, int dtmf);
	}
	public static interface LinphoneOnNotifyReceivedListener extends LinphoneSimpleListener {
		void onNotifyReceived(LinphoneEvent ev,String eventName, LinphoneContent content);
	}
	public static interface LinphoneOnComposingReceivedListener extends LinphoneSimpleListener {
		void onComposingReceived(LinphoneChatRoom room);
	}
	public static interface LinphoneOnRemoteProvisioningListener extends LinphoneSimpleListener {
		void onConfiguringStatus(RemoteProvisioningState state);
	}
}
