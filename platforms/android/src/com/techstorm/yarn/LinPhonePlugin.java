package com.techstorm.yarn;

import java.util.List;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.linphone.InCallActivity;
import org.linphone.LinphoneManager;
import org.linphone.LinphonePreferences;
import org.linphone.LinphonePreferences.AccountBuilder;
import org.linphone.LinphoneUtils;
import org.linphone.core.CallDirection;
import org.linphone.core.LinphoneAddress;
import org.linphone.core.LinphoneAddress.TransportType;
import org.linphone.core.LinphoneCall;
import org.linphone.core.LinphoneCall.State;
import org.linphone.core.LinphoneCallLog;
import org.linphone.core.LinphoneCallParams;
import org.linphone.core.LinphoneCore;
import org.linphone.core.LinphoneCoreException;
import org.linphone.core.LinphoneProxyConfig;
import org.linphone.setup.EchoCancellerCalibrationFragment;
import org.linphone.ui.AddressText;

import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.ContactsContract;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

public class LinPhonePlugin extends CordovaPlugin {

	private static final int CALL_ACTIVITY = 19;
	private Context context;
	private LinphonePreferences mPrefs = LinphonePreferences.instance();

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		context = cordova.getActivity()
				.getApplicationContext();
		if (action.equals("WifiCall")) {
			String address = (String) args.get(0);
			AddressText mAddress = new AddressText(context, null);
			mAddress.setContactAddress(address, address);
			wifiCall(mAddress);
			
			callbackContext.success("Call to " + address
					+ " successful via wifi call.");
			return true;
		} else if (action.equals("CellularCall")) {
			String phoneNumber = (String) args.get(0);
			cellularCall(phoneNumber);
			callbackContext.success("Call to " + phoneNumber
					+ " successful via cellular.");
			return true;
		} else if (action.equals("VideoCall")) {
			String address = (String) args.get(0);
			AddressText mAddress = new AddressText(context, null);
			mAddress.setContactAddress(address, address);
			videoCall(mAddress);
			callbackContext.success("Call to " + address
					+ " successful via video call.");
			return true;
		} else if (action.equals("RegisterSip")) {
			String sipUsername = (String) args.get(0);
			String password = (String) args.get(1);
			String domain = context.getResources().getString(
					R.string.sip_domain_default);

			logIn(sipUsername, password, domain, false);
			callbackContext.success("Register sip:"+sipUsername+"@"+domain+" successfully.");
			return true;
		} else if (action.equals("PhoneContacts")) {
			phoneContacts();
			callbackContext.success("Go to Phone Contact successfully.");
			return true;
		} else if (action.equals("CallLogs")) {
			callLogs();
			callbackContext.success("Go to Call Logs successfully.");
			return true;
		} else if (action.equals("HangUp")) {
			hangUp();
			callbackContext.success("Hang up the current call.");
			return true;
		} else if (action.equals("Settings")) {
			// Nothing to do
			callbackContext.success("Show settings screen.");
			return true;
		} else if (action.equals("SignOut")) {
			// Nothing to do
			callbackContext.success("Sign out.");
			return true;
		} else if (action.equals("EnableSpeaker")) {
			Boolean enableMic = (Boolean) args.get(0);
			LinphoneCore lc = LinphoneManager.getLc();
			lc.muteMic(enableMic);
			callbackContext.success("Enable/disable speaker.");
			return true;
		} else if (action.equals("ShowDialPad")) {
			// Need to code
			callbackContext.success("Shown dial pad.");
			return true;
		} else if (action.equals("Loudness")) {
			LinphoneManager.getInstance().routeAudioToSpeaker();
			LinphoneManager.getLc().enableSpeaker(true);
			callbackContext.success("Do loudness.");
			return true;
		} else if (action.equals("DialDtmf")) {
			String ch = (String) args.get(0).toString();
			if (ch == null || ch.length() != 1) {
				return false;
			}
			dialDtmf(ch.charAt(0));
			callbackContext.success("Dial dtmf: "+ch.charAt(0));
			return true;
		} else if (action.equals("GetCallQuality")) {
			JSONObject objJSON = new JSONObject();
			LinphoneCore lc = LinphoneManager.getLc();
			LinphoneCall currentCall = lc.getCurrentCall();
			PluginResult result = null;
			if (currentCall != null) {
				objJSON.put("quality", getCallQuality(currentCall));
				result = new PluginResult(Status.OK, objJSON);
			} else {
				objJSON.put("quality", 0);
				result = new PluginResult(Status.NO_RESULT, objJSON);
			}
			callbackContext.sendPluginResult(result);
			callbackContext.success("Get call quality successfully.");
			return true;
		} else if (action.equals("GetCallDurationTime")) {
			JSONObject objJSON = new JSONObject();
			LinphoneCore lc = LinphoneManager.getLc();
			LinphoneCall currentCall = lc.getCurrentCall();
			if (currentCall != null) {
				int duration = currentCall.getDuration();
				objJSON.put("time", String.format("%02d:%02d", duration / 60, duration % 60));
			} else {
				objJSON.put("time", "00:00");
			}
			PluginResult result = new PluginResult(Status.OK, objJSON);
			callbackContext.sendPluginResult(result);
			callbackContext.success("Get call duration time successfully.");
			return true;
		} else if (action.equals("CheckEndCall")) {
			JSONObject objJSON = new JSONObject();
			LinphoneCore lc = LinphoneManager.getLc();
			LinphoneCall currentCall = lc.getCurrentCall();
			if (currentCall == null) {
				objJSON.put("state", LinphoneCall.State.CallEnd);
				objJSON.put("endCall", true);
			} else {
				LinphoneCall.State state = currentCall.getState();
				objJSON.put("state", state);
				if (state == LinphoneCall.State.Idle
						|| state == LinphoneCall.State.Error
						|| state == LinphoneCall.State.CallEnd
						|| state == LinphoneCall.State.CallReleased) {
					hangUp();
					objJSON.put("endCall", true);
				} else {
					objJSON.put("endCall", false);
				}
			}
			PluginResult result = new PluginResult(Status.OK, objJSON);
			callbackContext.sendPluginResult(result);
			callbackContext.success("Check End Call successfully.");
			return true;
		} else if (action.equals("AnswerCall")) {
			LinphoneCall incommingCall = getIncommingCall();
			LinphoneCallParams params = LinphoneManager.getLc().createDefaultCallParameters();
			
			boolean isLowBandwidthConnection = !LinphoneUtils.isHightBandwidthConnection(cordova.getActivity().getApplicationContext());
			if (isLowBandwidthConnection) {
				params.enableLowBandwidth(true);
				//Low bandwidth enabled in call params
			}
			
			if (!LinphoneManager.getInstance().acceptCallWithParams(incommingCall, params)) {
				// the above method takes care of Samsung Galaxy S
//				Toast.makeText(this, R.string.couldnt_accept_call, Toast.LENGTH_LONG).show();
			} else {
//				if (!LinphoneActivity.isInstanciated()) {
//					return false;
//				}
				final LinphoneCallParams remoteParams = incommingCall.getRemoteParams();
				if (remoteParams != null && remoteParams.getVideoEnabled() && LinphonePreferences.instance().shouldAutomaticallyAcceptVideoRequests()) {
//					LinphoneActivity.instance().startVideoActivity(mCall);
				} else {
//					LinphoneActivity.instance().startIncallActivity(mCall);
				}
			}
			callbackContext.success("Answer the call successfully.");
			return true;
		} else if (action.equals("DeclineCall")) {
			LinphoneCall incommingCall = getIncommingCall();
			LinphoneManager.getLc().terminateCall(incommingCall);
			callbackContext.success("Decline the call successfully.");
			return true;
		}
		return false;
	}

	private LinphoneCall getIncommingCall() {
		LinphoneCall incommingCall = null;
		// Only one call ringing at a time is allowed
				if (LinphoneManager.getLcIfManagerNotDestroyedOrNull() != null) {
					List<LinphoneCall> calls = LinphoneUtils.getLinphoneCalls(LinphoneManager.getLc());
					for (LinphoneCall call : calls) {
						if (State.IncomingReceived == call.getState()) {
							incommingCall = call;
							break;
						}
					}
				}
				if (incommingCall == null) {
//					Log.e("Couldn't find incoming call");
//					finish();
					return null;
				}
				LinphoneAddress address = incommingCall.getRemoteAddress();
				// May be greatly sped up using a drawable cache
//				Uri uri = LinphoneUtils.findUriPictureOfContactAndSetDisplayName(address, getContentResolver());
//				LinphoneUtils.setImagePictureFromUri(this, mPictureView.getView(), uri, R.drawable.unknown_small);
		return incommingCall;
	}
	
	private void dialDtmf(char keyCode) {
		LinphoneCore lc = LinphoneManager.getLc();
		lc.stopDtmf();
		if (lc.isIncall()) {
			lc.sendDtmf(keyCode);
		}
	}
	
	private float getCallQuality(LinphoneCall call) {
		return call.getCurrentQuality();
	}
	
	public Uri getPhotoUri(long contactId) {
        ContentResolver contentResolver = this.context.getContentResolver();

        try {
            Cursor cursor = contentResolver
                    .query(ContactsContract.Data.CONTENT_URI,
                            null,
                            ContactsContract.Data.CONTACT_ID
                                    + "="
                                    + contactId
                                    + " AND "

                                    + ContactsContract.Data.MIMETYPE
                                    + "='"
                                    + ContactsContract.CommonDataKinds.Photo.CONTENT_ITEM_TYPE
                                    + "'", null, null);

            if (cursor != null) {
                if (!cursor.moveToFirst()) {
                    return null; // no photo
                }
            } else {
                return null; // error in cursor process
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        Uri person = ContentUris.withAppendedId(
                ContactsContract.Contacts.CONTENT_URI, contactId);
        return Uri.withAppendedPath(person,
                ContactsContract.Contacts.Photo.CONTENT_DIRECTORY);
    }
	
	private void hangUp() {
		LinphoneCore lc = LinphoneManager.getLc();
		LinphoneCall currentCall = lc.getCurrentCall();
		
		if (currentCall != null) {
			lc.terminateCall(currentCall);
		} else if (lc.isInConference()) {
			lc.terminateConference();
		} else {
			lc.terminateAllCalls();
		}
		
//		mThread.interrupt();
	}
	
	private boolean videoCall(AddressText mAddress) {
		if (wifiCall(mAddress)) {
			LinphoneCore lc = LinphoneManager.getLc();
			LinphoneCall currentCall = lc.getCurrentCall();	
			startVideoActivity(currentCall);
			return true;
		}
		return false;
	}
	
	public void startVideoActivity(LinphoneCall currentCall) {
		Intent intent = new Intent(this.cordova.getActivity().getApplicationContext(), InCallActivity.class);
		intent.putExtra("VideoEnabled", true);
//		startOrientationSensor();
		this.cordova.startActivityForResult(this, intent, CALL_ACTIVITY);
		LinphoneCallParams params = currentCall.getCurrentParamsCopy();
		params.setVideoEnabled(true);
		LinphoneManager.getLc().updateCall(currentCall, params);
	}
	
	private void phoneContacts() {
		Intent callIntent = new Intent(Intent.ACTION_VIEW);
		callIntent.setData(Uri.parse("content://contacts/people/"));
		this.cordova.startActivityForResult(this,callIntent,0);
	}
	
	private void callLogs() {
		Intent callIntent = new Intent(Intent.ACTION_VIEW);
		callIntent.setData(Uri.parse("content://call_log/calls"));
		this.cordova.startActivityForResult(this,callIntent,0);
	}
	
	private void cellularCall(String phoneNumber) {
		// add PhoneStateListener
		PhoneCallListener phoneListener = new PhoneCallListener();
		TelephonyManager telephonyManager = (TelephonyManager) context
				.getSystemService(Context.TELEPHONY_SERVICE);
		telephonyManager.listen(phoneListener,
				PhoneStateListener.LISTEN_CALL_STATE);

		Intent callIntent = new Intent(Intent.ACTION_CALL);
		callIntent.setData(Uri.parse("tel:" + phoneNumber));
		this.cordova.startActivityForResult(this,callIntent,0);
	}

	private void logIn(String username, String password, String domain,
			boolean sendEcCalibrationResult) {

		saveCreatedAccount(username, password, domain);

		if (LinphoneManager.getLc().getDefaultProxyConfig() != null) {
			launchEchoCancellerCalibration(sendEcCalibrationResult);
		}
	}

	private void launchEchoCancellerCalibration(boolean sendEcCalibrationResult) {
		boolean needsEchoCalibration = LinphoneManager.getLc()
				.needsEchoCalibration();
		if (needsEchoCalibration && mPrefs.isFirstLaunch()) {
			EchoCancellerCalibrationFragment fragment = new EchoCancellerCalibrationFragment();
			fragment.enableEcCalibrationResultSending(sendEcCalibrationResult);
			// changeFragment(fragment);
			// currentFragment = SetupFragmentsEnum.ECHO_CANCELLER_CALIBRATION;
			// back.setVisibility(View.VISIBLE);
			// next.setVisibility(View.GONE);
			// next.setEnabled(false);
			// cancel.setEnabled(false);
		} else {
			if (mPrefs.isFirstLaunch()) {
				mPrefs.setEchoCancellation(false);
			}
			success();
		}
	}

	public void success() {
		mPrefs.firstLaunchSuccessful();
		// setResult(Activity.RESULT_OK);
		// finish();
	}

	public void saveCreatedAccount(String username, String password,
			String domain) {

		boolean isMainAccountLinphoneDotOrg = domain.equals(context
				.getResources().getString(R.string.default_domain));
		boolean useLinphoneDotOrgCustomPorts = context.getResources()
				.getBoolean(R.bool.use_linphone_server_ports);
		AccountBuilder builder = new AccountBuilder(LinphoneManager.getLc())
				.setUsername(username).setDomain(domain).setPassword(password);

		if (isMainAccountLinphoneDotOrg && useLinphoneDotOrgCustomPorts) {
			if (context.getResources().getBoolean(
					R.bool.disable_all_security_features_for_markets)) {
				builder.setProxy(domain + ":5228").setTransport(
						TransportType.LinphoneTransportTcp);
			} else {
				builder.setProxy(domain + ":5223").setTransport(
						TransportType.LinphoneTransportTls);
			}

			builder.setExpires("604800")
					.setOutboundProxyEnabled(true)
					.setAvpfEnabled(true)
					.setAvpfRRInterval(3)
					.setQualityReportingCollector(
							"sip:voip-metrics@sip.linphone.org")
					.setQualityReportingEnabled(true)
					.setQualityReportingInterval(180)
					.setRealm("sip.linphone.org");

			mPrefs.setStunServer(context.getResources().getString(
					R.string.default_stun));
			mPrefs.setIceEnabled(true);
			mPrefs.setPushNotificationEnabled(true);
		} else {
			String forcedProxy = context.getResources().getString(
					R.string.setup_forced_proxy);
			if (!TextUtils.isEmpty(forcedProxy)) {
				builder.setProxy(forcedProxy).setOutboundProxyEnabled(true)
						.setAvpfRRInterval(5);
			}
		}

		if (context.getResources().getBoolean(R.bool.enable_push_id)) {
			String regId = mPrefs.getPushNotificationRegistrationID();
			String appId = context.getResources().getString(
					R.string.push_sender_id);
			if (regId != null && mPrefs.isPushNotificationEnabled()) {
				String contactInfos = "app-id=" + appId
						+ ";pn-type=google;pn-tok=" + regId;
				builder.setContactParameters(contactInfos);
			}
		}

		try {
			builder.saveNewAccount();
		} catch (LinphoneCoreException e) {
			e.printStackTrace();
		}
	}

	private boolean wifiCall(AddressText mAddress) {
		try {
			if (!LinphoneManager.getInstance().acceptCallIfIncomingPending()) {
				if (mAddress.getText().length() > 0) {
					LinphoneManager.getInstance().newOutgoingCall(mAddress);
				} else {

					if (context.getResources().getBoolean(
							R.bool.call_last_log_if_adress_is_empty)) {
						LinphoneCallLog[] logs = LinphoneManager.getLc()
								.getCallLogs();
						LinphoneCallLog log = null;
						for (LinphoneCallLog l : logs) {
							if (l.getDirection() == CallDirection.Outgoing) {
								log = l;
								break;
							}
						}
						if (log == null) {
							return false;
						}

						LinphoneProxyConfig lpc = LinphoneManager.getLc()
								.getDefaultProxyConfig();
						if (lpc != null
								&& log.getTo().getDomain()
										.equals(lpc.getDomain())) {
							mAddress.setText(log.getTo().getUserName());
						} else {
							mAddress.setText(log.getTo().asStringUriOnly());
						}
						mAddress.setSelection(mAddress.getText().toString()
								.length());
						mAddress.setDisplayedName(log.getTo().getDisplayName());
					}
				}
			}
		} catch (LinphoneCoreException e) {
			LinphoneManager.getInstance().terminateCall();
			onWrongDestinationAddress(context, mAddress);
			return false;
		}
		;

		return true;
	}

	private void onWrongDestinationAddress(Context context, AddressText mAddress) {
		Toast.makeText(
				context,
				String.format(
						context.getResources().getString(
								R.string.warning_wrong_destination_address),
						mAddress.getText().toString()), Toast.LENGTH_LONG)
				.show();
	}

	// monitor phone call activities
	private class PhoneCallListener extends PhoneStateListener {

		private boolean isPhoneCalling = false;

		String LOG_TAG = "LOGGING 123";

		@Override
		public void onCallStateChanged(int state, String incomingNumber) {

			if (TelephonyManager.CALL_STATE_RINGING == state) {
				// phone ringing
				Log.i(LOG_TAG, "RINGING, number: " + incomingNumber);
			}

			if (TelephonyManager.CALL_STATE_OFFHOOK == state) {
				// active
				Log.i(LOG_TAG, "OFFHOOK");

				isPhoneCalling = true;
			}

			if (TelephonyManager.CALL_STATE_IDLE == state) {
				// run when class initial and phone call ended,
				// need detect flag from CALL_STATE_OFFHOOK
				Log.i(LOG_TAG, "IDLE");

				if (isPhoneCalling) {

					Log.i(LOG_TAG, "restart app");

					// restart app
//					Intent i = getBaseContext().getPackageManager()
//							.getLaunchIntentForPackage(
//									getBaseContext().getPackageName());
//					i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
//					startActivity(i);

					isPhoneCalling = false;
				}

			}
		}
	}
}
