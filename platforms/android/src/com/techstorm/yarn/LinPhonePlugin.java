package com.techstorm.yarn;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.linphone.BluetoothManager;
import org.linphone.InCallActivity;
import org.linphone.LinphoneManager;
import org.linphone.LinphonePreferences;
import org.linphone.LinphonePreferences.AccountBuilder;
import org.linphone.VideoCallFragment;
import org.linphone.core.CallDirection;
import org.linphone.core.LinphoneAddress.TransportType;
import org.linphone.core.LinphoneCall;
import org.linphone.core.LinphoneCallLog;
import org.linphone.core.LinphoneCoreException;
import org.linphone.core.LinphoneProxyConfig;
import org.linphone.setup.EchoCancellerCalibrationFragment;
import org.linphone.ui.AddressText;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.Log;
import android.widget.ImageView;
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
		}
		return false;
	}

	private void videoCall(AddressText mAddress) {
		//startVideoActivity();
	}
	
	public void startVideoActivity(LinphoneCall currentCall) {
		Intent intent = new Intent(this.cordova.getActivity().getApplicationContext(), InCallActivity.class);
		intent.putExtra("VideoEnabled", true);
//		startOrientationSensor();
		this.cordova.startActivityForResult(this, intent, CALL_ACTIVITY);
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
