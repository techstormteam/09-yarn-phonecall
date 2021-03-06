package com.iderainc.yarn;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.linphone.InCallActivity;
import org.linphone.LinphoneManager;
import org.linphone.LinphoneManager.EcCalibrationListener;
import org.linphone.LinphonePreferences;
import org.linphone.LinphonePreferences.AccountBuilder;
import org.linphone.LinphoneUtils;
import org.linphone.core.CallDirection;
import org.linphone.core.LinphoneAddress;
import org.linphone.core.LinphoneAddress.TransportType;
import org.linphone.core.LinphoneAuthInfo;
import org.linphone.core.LinphoneCall;
import org.linphone.core.LinphoneCall.State;
import org.linphone.core.LinphoneCallLog;
import org.linphone.core.LinphoneCallParams;
import org.linphone.core.LinphoneCore;
import org.linphone.core.LinphoneCore.EcCalibratorStatus;
import org.linphone.core.LinphoneCore.RegistrationState;
import org.linphone.core.LinphoneCoreException;
import org.linphone.core.LinphoneProxyConfig;
import org.linphone.setup.EchoCancellerCalibrationFragment;
import org.linphone.ui.AddressText;

import android.annotation.SuppressLint;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.os.StrictMode;
import android.preference.PreferenceManager;
import android.provider.CallLog;
import android.provider.ContactsContract;
import android.provider.ContactsContract.Contacts;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.Toast;

public class LinPhonePlugin extends CordovaPlugin implements
		EcCalibrationListener {

	public static final int CALL_ACTIVITY = 19;
	public static final int PICK_CONTACT = 30;
	public static final int PICK_CALL_LOG = 31;
	public static String NOT_REGISTERED = "NOT-REGISTERED";
	public static String REGISTERED = "REGISTERED";

	public static String telno = "";
	public static String password = "";

	private Context context;
	private LinphonePreferences mPrefs = LinphonePreferences.instance();

	@SuppressLint("NewApi")
	@Override
	public boolean execute(String action, final JSONArray args,
			final CallbackContext callbackContext) throws JSONException {
		context = cordova.getActivity().getApplicationContext();
		if (action.equals("ContinueCall")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();
						objJSON.put("success", false);
						LinphoneCore lc = LinphoneManager
								.getLcIfManagerNotDestroyedOrNull();
						if (lc.isNetworkReachable()) {
							if (lc != null) {
								LinphoneCall currentCall = lc.getCurrentCall();
								if (currentCall != null && currentCall.getState() == State.Paused) {
									pauseOrResumeCall(currentCall);
//									appView.sendJavascript("window.location.href = 'dial.html';");
									objJSON.put("success", true);
								}
							}
						} else {
							objJSON.put("internetConnectionAvailable", false);
						}
						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);

					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});

			return true;
		} else if (action.equals("WifiCall")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();
						String address = (String) args.get(0);
						AddressText mAddress = new AddressText(context, null);
						mAddress.setContactAddress(address, address);
						LinphoneCore lc = LinphoneManager
								.getLcIfManagerNotDestroyedOrNull();
						if (lc.isNetworkReachable()) {
							objJSON.put("internetConnectionAvailable", true);
							registerIfFailed(lc);
							wifiCall(mAddress);
							insertPlaceholderCall(context.getContentResolver(),
									address, CallLog.Calls.OUTGOING_TYPE);
						} else {
							objJSON.put("internetConnectionAvailable", false);
						}
						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);

					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});

			return true;
		} else if (action.equals("CellularCall")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						String phoneNumber = (String) args.get(0);
						SharedPreferences prefs = PreferenceManager
								.getDefaultSharedPreferences(context);
						SharedPreferences.Editor edit1 = prefs.edit();
						edit1.putStringSet(
								context.getString(R.string.phone_number_list),
								new HashSet<String>());
						edit1.commit();

						SharedPreferences.Editor edit = prefs.edit();
						edit.putBoolean(
								context.getString(R.string.native_call_enable),
								true);
						edit.commit();

						blockNativeCall();

						cellularCall(phoneNumber);
						callbackContext.success("Call to " + phoneNumber
								+ " successful via cellular.");
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("VideoCall")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();
						String address = (String) args.get(0);
						AddressText mAddress = new AddressText(context, null);
						mAddress.setContactAddress("video:" + address, "video:"
								+ address);
						LinphoneCore lc = LinphoneManager
								.getLcIfManagerNotDestroyedOrNull();
						if (lc.isNetworkReachable()) {
							objJSON.put("internetConnectionAvailable", true);
							registerIfFailed(lc);
							videoCall(mAddress);
							insertPlaceholderCall(context.getContentResolver(),
									address, CallLog.Calls.OUTGOING_TYPE);
						} else {
							objJSON.put("internetConnectionAvailable", false);
						}
						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
						callbackContext.success("Call to " + address
								+ " successful via video call.");
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("RegisterSip")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						String message = "";
						JSONObject objJSON = new JSONObject();
						String sipUsername = (String) args.get(0);
						String password = (String) args.get(1);
						String registerStatus = (String) args.get(2);
						String domain = context.getResources().getString(
								R.string.sip_domain_default);

						LinPhonePlugin.telno = sipUsername;
						LinPhonePlugin.password = password;
						registerSip(context, mPrefs, sipUsername, domain,
								password, registerStatus, objJSON);
						objJSON.put("message", message);
						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("SignOut")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						String sipUsername = (String) args.get(0);
						String domain = context.getResources().getString(
								R.string.sip_domain_default);
						signOut(sipUsername, domain);
						LinPhonePlugin.telno = "";
						LinPhonePlugin.password = "";
						callbackContext.success("Sign out successful.");
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("GetIncommingContactImageUri")) {
			// JSONObject objJSON = new JSONObject();
			// LinphoneCore lc = LinphoneManager.getLc();
			// LinphoneCall mCall = lc.getCurrentCall();
			// if (mCall == null) {
			// return false;
			// }
			// // String telNo = mCall.get;
			// String telNo = "123456";
			// String contactId = getContactIdByPhoneNumber(telNo);
			// PluginResult result = null;
			// if (!contactId.equals("-1")) {
			// objJSON.put("uri",
			// String.format("content://com.android.contacts/contacts/%s/photo",
			// contactId));
			// // objJSON.put("uri",
			// String.format("content://com.android.contacts/contacts/272/photo",
			// contactId));
			// result = new PluginResult(Status.OK, objJSON);
			// } else {
			// objJSON.put("uri", "");
			// result = new PluginResult(Status.NO_RESULT, objJSON);
			// }
			// callbackContext.sendPluginResult(result);
			// callbackContext.success("Get contact image uri successfully.");
			// return true;
		} else if (action.equals("PhoneContacts")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					phoneContacts();
					callbackContext
							.success("Go to Phone Contact successfully.");
				}
			});
			return true;
		} else if (action.equals("CallLogs")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
						callLogs();
						callbackContext
								.success("Go to Call Logs successfully.");
				}
			});
			return true;
		} else if (action.equals("HangUp")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();
						if (checkInternetConnectionAvailable(objJSON)) {
							hangUp();
						}
						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
						callbackContext.success("Hang up the current call.");
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("Settings")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();
						if (checkInternetConnectionAvailable(objJSON)) {
							// nothing
						}
						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
						callbackContext.success("Show settings screen.");
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("MicMute")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();
						if (checkInternetConnectionAvailable(objJSON)) {
							Boolean enableMicMute = (Boolean) args.get(0);
							LinphoneCore lc = LinphoneManager.getLc();
							lc.muteMic(enableMicMute);
						}

						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
						callbackContext.success("Enable/disable Mic Mute.");
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("ShowDialPad")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					// Need to code
					callbackContext.success("Shown dial pad.");
				}
			});
			return true;
		} else if (action.equals("Loudness")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();
						if (checkInternetConnectionAvailable(objJSON)) {
							LinphoneManager.getInstance().routeAudioToSpeaker();
							LinphoneManager.getLc().enableSpeaker(true);
						}

						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
						callbackContext.success("Do loudness.");
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("Phoneness")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();
						if (checkInternetConnectionAvailable(objJSON)) {
							LinphoneManager.getInstance()
									.routeAudioToReceiver();
							LinphoneManager.getLc().enableSpeaker(false);
						}
						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
						callbackContext.success("Do phoneness.");
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("DialDtmf")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						String ch = (String) args.get(0).toString();
						JSONObject objJSON = new JSONObject();
						if (checkInternetConnectionAvailable(objJSON)) {
							// if (ch == null || ch.length() != 1) {
							// return false;
							// }
							dialDtmf(ch.charAt(0));
						}

						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
						callbackContext.success("Dial dtmf: " + ch.charAt(0));
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("GetCallQuality")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();

						if (checkInternetConnectionAvailable(objJSON)) {
							LinphoneCore lc = LinphoneManager.getLc();
							LinphoneCall currentCall = lc.getCurrentCall();
							PluginResult result = null;

							if (currentCall != null) {
								objJSON.put("quality",
										getCallQuality(currentCall));
								result = new PluginResult(Status.OK, objJSON);
							} else {
								objJSON.put("quality", 0);
								result = new PluginResult(Status.NO_RESULT,
										objJSON);
							}
							callbackContext.sendPluginResult(result);
						}

						callbackContext
								.success("Get call quality successfully.");
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("GetCallDurationTime")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();
						LinphoneCore lc = LinphoneManager.getLc();
						LinphoneCall currentCall = lc.getCurrentCall();
						if (currentCall != null) {
							int duration = currentCall.getDuration();
							objJSON.put("time", String.format("%02d:%02d",
									duration / 60, duration % 60));
						} else {
							objJSON.put("time", "00:00");
						}
						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
						callbackContext
								.success("Get call duration time successfully.");
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("CheckEndCall")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
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
								// disable lockscreen
						        cordova.getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
						        // set this flag so this activity will stay in front of the keyguard
						        int flags = WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON;
						        cordova.getActivity().getWindow().addFlags(flags);
						        
						        
								objJSON.put("endCall", false);
							}
						}
						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
						callbackContext.success("Check End Call successfully.");
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("AnswerCall")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					LinphoneCall incommingCall = getIncommingCall();
					LinphoneCallParams params = LinphoneManager.getLc()
							.createDefaultCallParameters();

					boolean isLowBandwidthConnection = !LinphoneUtils
							.isHightBandwidthConnection(cordova.getActivity()
									.getApplicationContext());
					if (isLowBandwidthConnection) {
						params.enableLowBandwidth(true);
						// Low bandwidth enabled in call params
					}

					if (!LinphoneManager.getInstance().acceptCallWithParams(
							incommingCall, params)) {
						// the above method takes care of Samsung Galaxy S
						// Toast.makeText(this,
						// R.string.couldnt_accept_call,
						// Toast.LENGTH_LONG).show();
					} else {
						// if (!LinphoneActivity.isInstanciated()) {
						// return false;
						// }
						final LinphoneCallParams remoteParams = incommingCall
								.getRemoteParams();
						if (remoteParams != null
								&& remoteParams.getVideoEnabled()
								&& LinphonePreferences
										.instance()
										.shouldAutomaticallyAcceptVideoRequests()) {
							// LinphoneActivity.instance().startVideoActivity(mCall);
						} else {
							// LinphoneActivity.instance().startIncallActivity(mCall);
						}
					}
					callbackContext.success("Answer the call successfully.");
				}
			});
			return true;
		} else if (action.equals("DeclineCall")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					LinphoneCall incommingCall = getIncommingCall();
					LinphoneManager.getLc().terminateCall(incommingCall);
					callbackContext.success("Decline the call successfully.");

				}
			});
			return true;
		} else if (action.equals("Voicemail")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					// Need to code
					callbackContext.success("Voicemail successfully.");
				}
			});
			return true;
		} else if (action.equals("CheckInternetConnection")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();
						checkInternetConnectionAvailable(objJSON);
						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
						callbackContext
								.success("Check internet connection successfully.");
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("GetSMSInboundPhoneNumber")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();
						if (checkInternetConnectionAvailable(objJSON)) {
							objJSON.put("internetConnectionAvailable", true);
							JSONArray arrayJSON = new JSONArray();
							SharedPreferences prefs = PreferenceManager
									.getDefaultSharedPreferences(context);
							Set<String> defaultSet = new HashSet<String>();
							Set<String> phoneSet = prefs.getStringSet(context
									.getString(R.string.phone_number_list),
									defaultSet);
							if (phoneSet != null && phoneSet.size() > 0) {
								TelephonyManager phoneManager = (TelephonyManager) 
									    cordova.getActivity().getSystemService(Context.TELEPHONY_SERVICE);
									String phoneNumber = phoneManager.getLine1Number();
//								for (String phone : phoneSet) {
								for (int index = 0; index < phoneSet.size(); index++) {
									arrayJSON.put(phoneNumber);
								}
//								}
								phoneSet.clear();
							}
							objJSON.put(context
									.getString(R.string.phone_number_list),
									arrayJSON);

						} else {
							objJSON.put("internetConnectionAvailable", false);
						}
						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
						callbackContext
								.success("Check internet connection successfully.");
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("CallingCard")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();
						String accessNumber = (String) args.get(0);
						String phoneNumber = (String) args.get(1);
						callingCard(accessNumber, phoneNumber);
						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("BlockNativeCall")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					JSONObject objJSON = new JSONObject();
					blockNativeCall();
					PluginResult result = new PluginResult(Status.OK, objJSON);
					callbackContext.sendPluginResult(result);
				}
			});
			return true;
		} else if (action.equals("AllowNativeCall")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					JSONObject objJSON = new JSONObject();
					//allowNativeCall();
					PluginResult result = new PluginResult(Status.OK, objJSON);
					callbackContext.sendPluginResult(result);
				}
			});
			return true;
		} else if (action.equals("StartVideoActivity")) {
			final CordovaPlugin instance = this;
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();
						if (checkInternetConnectionAvailable(objJSON)) {
							SharedPreferences prefs = PreferenceManager
									.getDefaultSharedPreferences(context);
							if (prefs.contains(context
									.getString(R.string.call_established))) {
								Boolean callEstablished = prefs.getBoolean(
										context.getString(R.string.call_established),
										false);
								if (callEstablished) {

									LinphoneCore lc = LinphoneManager.getLc();
									LinphoneCall call = lc.getCurrentCall();
									if (call != null) {
										objJSON.put("success", true);
										LinphoneCallParams params = call
												.getCurrentParamsCopy();
										Intent intent = new Intent(context,
												InCallActivity.class);
										intent.putExtra("VideoEnabled", true);
										// startOrientationSensor();
										instance.cordova.startActivityForResult(
												instance, intent,
												LinPhonePlugin.CALL_ACTIVITY);
										if (params.getVideoEnabled() == false) {
											params.setVideoEnabled(true);
											LinphoneManager.getLc().updateCall(
													call, params);
										}
										SharedPreferences.Editor edit = prefs
												.edit();
										edit.putBoolean(
												context.getString(R.string.call_established),
												false);
										edit.commit();
									} else {
										objJSON.put("success", false);
									}
								} else {
									objJSON.put("success", false);
								}
							}
						}
						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("GetCurrentCallNumberFrom")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();
						objJSON.put("telno", getCurrentCallNumberForm());
						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("GetNumberOfCallLogs")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {
				public void run() {
					try {
						JSONObject objJSON = new JSONObject();
						Uri allCalls = Uri.parse("content://call_log/calls");
						Cursor cursor = LinPhonePlugin.this.cordova.getActivity()
								.getContentResolver().query(allCalls, null, null, null, null);
						objJSON.put("count", cursor.getCount());
						PluginResult result = new PluginResult(Status.OK,
								objJSON);
						callbackContext.sendPluginResult(result);
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		}

		return false;
	}
	
	private static void signOut(String sipUsername, String domain) {
		if (LinphoneManager.isInstanciated()) {

			String sipAddress = sipUsername + "@" + domain;
			List<Integer> accountIndexes = findAuthIndexOf(sipAddress);
			for (Integer accountIndex : accountIndexes) {
				// LinphonePreferences.instance().setAccountEnabled(accountIndex,
				// false);
				// LinphoneProxyConfig proxyCfg =
				// lc.getProxyConfigList()[accountIndex];
				// lc.removeProxyConfig(proxyCfg);
				deleteAccount(accountIndex);
			}

			// LinphoneAuthInfo authInfo = lc.findAuthInfo(sipUsername, null,
			// domain);
			// lc.removeAuthInfo(authInfo);
			// lc.refreshRegisters();

		}
	}

	public static void registerSip(Context context, LinphonePreferences mPrefs,
			String sipUsername, String domain, String password,
			String registerStatus, JSONObject objJSON) throws JSONException {
		String sipAddress = sipUsername + "@" + domain;
		LinphoneCore lc = LinphoneManager.getLcIfManagerNotDestroyedOrNull();

		if (lc.isNetworkReachable()) {

			objJSON.put("internetConnectionAvailable", true);

			// Get account index.
			int nbAccounts = LinphonePreferences.instance().getAccountCount();
			List<Integer> accountIndexes = findAuthIndexOf(sipAddress);

			if (accountIndexes != null && !accountIndexes.isEmpty()
					&& NOT_REGISTERED.equals(registerStatus)) {
				signOut(sipUsername, domain);
			}

			nbAccounts = LinphonePreferences.instance().getAccountCount();
			accountIndexes = findAuthIndexOf(sipAddress);
			if (accountIndexes == null || accountIndexes.isEmpty()) { // User
																		// haven't
																		// registered
																		// in
																		// linphone
				logIn(context, mPrefs, sipUsername, password, domain, false);
				lc.refreshRegisters();
				accountIndexes.add(nbAccounts);
			}

			for (Integer accountIndex : accountIndexes) {
				if (LinphonePreferences.instance().getDefaultAccountIndex() != accountIndex) {

					LinphonePreferences.instance().setDefaultAccount(
							accountIndex);
					if (accountIndex < LinphonePreferences.instance()
							.getAccountCount()) {
						LinphonePreferences.instance().setAccountEnabled(
								accountIndex, true);
						lc.setDefaultProxyConfig((LinphoneProxyConfig) LinphoneManager
								.getLc().getProxyConfigList()[accountIndex]);
						lc.refreshRegisters();
					}
				} else {
					if (lc != null && lc.getDefaultProxyConfig() != null) {
						if (RegistrationState.RegistrationOk == LinphoneManager
								.getLc().getDefaultProxyConfig().getState()) {
							// callbackContext.success("User Sip have registered. Ignored action...");
						} else if (RegistrationState.RegistrationFailed == LinphoneManager
								.getLc().getDefaultProxyConfig().getState()
								|| RegistrationState.RegistrationNone == LinphoneManager
										.getLc().getDefaultProxyConfig()
										.getState()) {
							// logIn(sipUsername, password, domain, false);
							LinphonePreferences.instance().setAccountEnabled(
									accountIndex, true);
							lc.refreshRegisters();
							// callbackContext.success("Re-register sip:"+sipUsername+"@"+domain);
						}
					}
				}
			}
		} else {
			objJSON.put("internetConnectionAvailable", false);
		}
	}

	public static void deleteAccount(int n) {
		final LinphoneProxyConfig proxyCfg = getProxyConfig(n);

		if (proxyCfg != null)
			LinphoneManager.getLc().removeProxyConfig(proxyCfg);
		if (LinphoneManager.getLc().getProxyConfigList().length == 0) {
			LinphoneManager.getLc().refreshRegisters();
		} else {
			resetDefaultProxyConfig();
			LinphoneManager.getLc().refreshRegisters();
		}
	}

	public static void resetDefaultProxyConfig() {
		int count = LinphoneManager.getLc().getProxyConfigList().length;
		for (int i = 0; i < count; i++) {
			if (isAccountEnabled(i)) {
				LinphoneManager.getLc()
						.setDefaultProxyConfig(getProxyConfig(i));
				break;
			}
		}

		if (LinphoneManager.getLc().getDefaultProxyConfig() == null) {
			LinphoneManager.getLc().setDefaultProxyConfig(getProxyConfig(0));
		}
	}

	public static boolean isAccountEnabled(int n) {
		return getProxyConfig(n).registerEnabled();
	}

	// Accounts settings
	private static LinphoneProxyConfig getProxyConfig(int n) {
		LinphoneProxyConfig[] prxCfgs = LinphoneManager.getLc()
				.getProxyConfigList();
		if (n < 0 || n >= prxCfgs.length)
			return null;
		return prxCfgs[n];
	}

	private boolean checkInternetConnectionAvailable(JSONObject objJSON)
			throws JSONException {
		boolean available = false;
		LinphoneCore lc = LinphoneManager.getLcIfManagerNotDestroyedOrNull();
		if (lc.isNetworkReachable() && isInternetReachable()) {
			objJSON.put("internetConnectionAvailable", true);
			available = true;
		} else {
			objJSON.put("internetConnectionAvailable", false);
			available = false;
		}
		return available;
	}

	public boolean isInternetReachable() {
		try {
			StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder()
					.permitAll().build();
			StrictMode.setThreadPolicy(policy);

			// make a URL to a known source
			URL url = new URL("http://www.google.com");

			// open a connection to that source
			HttpURLConnection urlConnect = (HttpURLConnection) url
					.openConnection();

			// trying to retrieve data from the source. If there
			// is no connection, this line will fail
			@SuppressWarnings("unused")
			Object objData = urlConnect.getContent();

		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}

		return true;
	}

	public static String getCurrentCallNumberForm() {
		LinphoneCore lc = LinphoneManager
				.getLcIfManagerNotDestroyedOrNull();
		if (lc == null
				|| lc.getCurrentCall() == null
				|| lc.getCurrentCall().getCallLog() == null
				|| lc.getCurrentCall().getCallLog().getFrom() == null
				|| lc.getCurrentCall().getCallLog().getFrom().getUserName() == null) {
			return "";
		}
		return lc.getCurrentCall().getCallLog().getFrom().getUserName();
	}
	
	private void blockNativeCall() {
		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(context);
		SharedPreferences.Editor edit = prefs.edit();
		edit.putBoolean(context.getString(R.string.do_cellular_call), false);
		edit.putString(context.getString(R.string.do_cellular_call_number), "");
		edit.commit();
	}

	private void allowNativeCall() {
		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(context);
		SharedPreferences.Editor edit = prefs.edit();
		edit.putBoolean(context.getString(R.string.native_call_enable), true);
		edit.commit();
	}

	private void echoCalibration() throws LinphoneCoreException {
		LinphoneManager.getInstance().startEcCalibration(LinPhonePlugin.this);
	}

	@Override
	public void onEcCalibrationStatus(final EcCalibratorStatus status,
			final int delayMs) {
		// mHandler.post(new Runnable() {
		// public void run() {
		// CheckBoxPreference echoCancellation = (CheckBoxPreference)
		// findPreference(getString(R.string.pref_echo_cancellation_key));
		// Preference echoCancellerCalibration =
		// findPreference(getString(R.string.pref_echo_canceller_calibration_key));
		//
		// if (status == EcCalibratorStatus.DoneNoEcho) {
		// echoCancellerCalibration.setSummary(R.string.no_echo);
		// echoCancellation.setChecked(false);
		// LinphonePreferences.instance().setEchoCancellation(false);
		// } else if (status == EcCalibratorStatus.Done) {
		// echoCancellerCalibration.setSummary(String.format(getString(R.string.ec_calibrated),
		// delayMs));
		// echoCancellation.setChecked(true);
		// LinphonePreferences.instance().setEchoCancellation(true);
		// } else if (status == EcCalibratorStatus.Failed) {
		// echoCancellerCalibration.setSummary(R.string.failed);
		// echoCancellation.setChecked(true);
		// LinphonePreferences.instance().setEchoCancellation(true);
		// }
		// }
		// });
	}

	public static void insertPlaceholderCall(ContentResolver contentResolver,
			String number, int callType) {
		ContentValues values = new ContentValues();
		values.put(CallLog.Calls.NUMBER, number);
		values.put(CallLog.Calls.DATE, System.currentTimeMillis());
		values.put(CallLog.Calls.DURATION, 0);
		values.put(CallLog.Calls.TYPE, callType);
		values.put(CallLog.Calls.NEW, 1);
		values.put(CallLog.Calls.CACHED_NAME, "");
		values.put(CallLog.Calls.CACHED_NUMBER_TYPE, 0);
		values.put(CallLog.Calls.CACHED_NUMBER_LABEL, "");
		contentResolver.insert(CallLog.Calls.CONTENT_URI, values);
	}

	private static List<Integer> findAuthIndexOf(String sipAddress) {
		int nbAccounts = LinphonePreferences.instance().getAccountCount();
		List<Integer> indexes = new ArrayList<Integer>();
		for (int index = 0; index < nbAccounts; index++) {
			String accountUsername = LinphonePreferences.instance()
					.getAccountUsername(index);
			String accountDomain = LinphonePreferences.instance()
					.getAccountDomain(index);
			String identity = accountUsername + "@" + accountDomain;
			if (identity.equals(sipAddress)) {
				indexes.add(index);
			}
		}
		return indexes;
	}

	private void registerIfFailed(LinphoneCore lc) {

		if (lc != null && lc.getDefaultProxyConfig() != null) {
			if (RegistrationState.RegistrationFailed == LinphoneManager.getLc()
					.getDefaultProxyConfig().getState()
					|| RegistrationState.RegistrationNone == LinphoneManager
							.getLc().getDefaultProxyConfig().getState()) {

				int accountIndex = LinphonePreferences.instance()
						.getDefaultAccountIndex();
				String sipUsername = LinphonePreferences.instance()
						.getAccountUsername(accountIndex);
				String password = LinphonePreferences.instance()
						.getAccountPassword(accountIndex);
				String domain = LinphonePreferences.instance()
						.getAccountDomain(accountIndex);
				// logIn(sipUsername, password, domain, false);
				// lc.setDefaultProxyConfig((LinphoneProxyConfig)
				// LinphoneManager.getLc().getProxyConfigList()[accountIndex]);
				if (lc.isNetworkReachable()) {
					lc.refreshRegisters();
				}

			}
		}
	}

	private String getContactIdByPhoneNumber(String telNo) {
		String contactId = "-1";
		Cursor cursor = cordova
				.getActivity()
				.getApplicationContext()
				.getContentResolver()
				.query(ContactsContract.Contacts.CONTENT_URI, null, null, null,
						null);

		// if (cursor.getCount() > 0) {
		// if (cursor.moveToFirst()) {
		// do {
		// contactId = cursor.getString(
		// cursor.getColumnIndex(ContactsContract.Contacts._ID));
		// String phoneNumber = "";
		// if
		// (Integer.parseInt(cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts.HAS_PHONE_NUMBER)))
		// > 0) {
		// Cursor pCur =
		// cordova.getActivity().getApplicationContext().getContentResolver()
		// .query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI, null,
		// ContactsContract.CommonDataKinds.Phone.CONTACT_ID +" = ?",
		// new String[]{contactId}, null);
		// while (pCur.moveToNext()) {
		// phoneNumber = cursor.getString(
		// cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER));
		// }
		// pCur.close();
		// }
		// if (phoneNumber.equals(telNo)) {
		// break;
		// }
		// } while (cursor.moveToNext());
		//
		// }
		// }
		// cursor.close();
		return contactId;
	}

	private void unregisterAllAuth() {
		if (LinphoneManager.isInstanciated()) {
			LinphoneAuthInfo[] authInfoList = LinphoneManager.getLc()
					.getAuthInfosList();
			if (authInfoList != null && authInfoList.length > 0) {
				for (int index = 0; index < authInfoList.length; index++) {
					LinphoneAuthInfo authInfo = authInfoList[index];
					LinphoneManager.getLc().removeAuthInfo(authInfo);
				}
			}
		}
	}

	private LinphoneCall getIncommingCall() {
		LinphoneCall incommingCall = null;
		// Only one call ringing at a time is allowed
		if (LinphoneManager.getLcIfManagerNotDestroyedOrNull() != null) {
			List<LinphoneCall> calls = LinphoneUtils
					.getLinphoneCalls(LinphoneManager.getLc());
			for (LinphoneCall call : calls) {
				if (State.IncomingReceived == call.getState()) {
					incommingCall = call;
					break;
				}
			}
		}
		if (incommingCall == null) {
			// Log.e("Couldn't find incoming call");
			// finish();
			return null;
		}
		LinphoneAddress address = incommingCall.getRemoteAddress();
		// May be greatly sped up using a drawable cache
		// Uri uri =
		// LinphoneUtils.findUriPictureOfContactAndSetDisplayName(address,
		// getContentResolver());
		// LinphoneUtils.setImagePictureFromUri(this, mPictureView.getView(),
		// uri, R.drawable.unknown_small);
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

		// mThread.interrupt();
	}

	private boolean videoCall(AddressText mAddress) {
		if (wifiCall(mAddress)) {
			LinphoneCore lc = LinphoneManager.getLc();
			LinphoneCall currentCall = lc.getCurrentCall();
			// startVideoActivity(currentCall);
			return true;
		}
		return false;
	}

	public void startVideoActivity(LinphoneCall currentCall) {
		Intent intent = new Intent(this.cordova.getActivity()
				.getApplicationContext(), InCallActivity.class);
		intent.putExtra("VideoEnabled", true);
		// startOrientationSensor();
		this.cordova.startActivityForResult(this, intent, CALL_ACTIVITY);
		LinphoneCallParams params = currentCall.getCurrentParamsCopy();
		params.setVideoEnabled(true);
		LinphoneManager.getLc().updateCall(currentCall, params);
	}

	private void phoneContacts() {
		// Intent callIntent = new Intent(Intent.ACTION_PICK);
		// callIntent.setType(ContactsContract.Contacts.CONTENT_TYPE);
		// callIntent.setData(Uri.parse("content://contacts/people/"));
		Intent intent = new Intent(Intent.ACTION_PICK, Contacts.CONTENT_URI);
		intent.setType(ContactsContract.CommonDataKinds.Phone.CONTENT_TYPE);
		this.cordova.startActivityForResult(this, intent, PICK_CONTACT);
	}

	public void pauseOrResumeCall(LinphoneCall call) {
		LinphoneCore lc = LinphoneManager.getLc();
		if (call != null && LinphoneUtils.isCallRunning(call)) {
			if (call.isInConference()) {
				lc.removeFromConference(call);
				if (lc.getConferenceSize() <= 1) {
					lc.leaveConference();
				}
			} else {
				lc.pauseCall(call);
//				if (isVideoEnabled(LinphoneManager.getLc().getCurrentCall())) {
//					isVideoCallPaused = true;
//					showAudioView();
//				}
//				pause.setBackgroundResource(R.drawable.pause_on);
			}
		} else {
			List<LinphoneCall> pausedCalls = LinphoneUtils.getCallsInState(lc, Arrays.asList(State.Paused));
			if (pausedCalls.size() == 1) {
				LinphoneCall callToResume = pausedCalls.get(0);
				if ((call != null && callToResume.equals(call)) || call == null) {
					lc.resumeCall(callToResume);
//					if (isVideoCallPaused) {
//						isVideoCallPaused = false;
//						showVideoView();
//					}
//					pause.setBackgroundResource(R.drawable.pause_off);
				}
			} else if (call != null) {
				lc.resumeCall(call);
//				if (isVideoCallPaused) {
//					isVideoCallPaused = false;
//					showVideoView();
//				}
//				pause.setBackgroundResource(R.drawable.pause_off);
			}
		}
	}
	
	private void callLogs() {
		Intent intent = new Intent(context, CallHistoryActivity.class);
//		intent.putExtra("balance", balance);
		this.cordova.startActivityForResult(this, intent, PICK_CALL_LOG);
	}

	private void cellularCall(String phoneNumber) {
		Intent callIntent = new Intent(Intent.ACTION_CALL);
		callIntent.setData(Uri.parse("tel:" + phoneNumber));
		this.cordova.startActivityForResult(this, callIntent, 0);
	}

	private void callingCard(String accessNumber, String phoneNumber) {
		Intent callIntent = new Intent(Intent.ACTION_CALL);
		callIntent.setData(Uri.parse("tel:" + accessNumber + "," + phoneNumber
				+ "#"));
		this.cordova.startActivityForResult(this, callIntent, 0);
	}

	private static void logIn(Context context, LinphonePreferences mPrefs,
			String username, String password, String domain,
			boolean sendEcCalibrationResult) {

		saveCreatedAccount(context, mPrefs, username, password, domain);

		if (LinphoneManager.getLc().getDefaultProxyConfig() != null) {
			// launchEchoCancellerCalibration(mPrefs, sendEcCalibrationResult);
		}
	}

	private static void launchEchoCancellerCalibration(
			LinphonePreferences mPrefs, boolean sendEcCalibrationResult) {
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
			success(mPrefs);
		}
	}

	public static void success(LinphonePreferences mPrefs) {
		mPrefs.firstLaunchSuccessful();
		// setResult(Activity.RESULT_OK);
		// finish();
	}

	public static void saveCreatedAccount(Context context,
			LinphonePreferences mPrefs, String username, String password,
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
		//blockNativeCall();
		try {
			// echoCalibration();
			if (!LinphoneManager.getInstance().acceptCallIfIncomingPending()) {
				LinphoneManager.getInstance().routeAudioToReceiver();
				LinphoneManager.getLc().enableSpeaker(false);

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

}
