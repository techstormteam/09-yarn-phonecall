//
//  LinPhonePlugin.m
//  Netcastdigital
//
//  Created by Macbook air on 11/11/14.
//
//

#import "LinPhonePlugin.h"



@implementation LinPhonePlugin


- (void) ContinueCall:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                                        initWithObjectsAndKeys :
                                        @"true", @"success",
                                        nil
                                        ];
        [jsonObj setObject:@NO forKey:SUCCESS_STATUS];
        
        if ([self checkInternetConnectionAvailable:jsonObj]) {
            
            LinphoneCore* lc = [LinphoneManager getLc];
            if (lc != nil) {
                LinphoneCall* currentCall = linphone_core_get_current_call(lc);
                if (currentCall != nil) {
                    LinphoneCallState state = linphone_call_get_state(currentCall);
                    if (currentCall != nil && state == LinphoneCallPaused) {
                        //pauseOrResumeCall(currentCall);
                        [jsonObj setObject:@YES forKey:SUCCESS_STATUS];
                        
                    } else {
                        
                    }
                }
            }
        }
        [self successReturn:command jsonObj:jsonObj];
    }];
}
- (void) WifiCall:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"true", @"success",
                                 nil
                                 ];
        if ([self checkInternetConnectionAvailable:jsonObj]) {
            
            NSString *callTo = [command.arguments objectAtIndex:0];
            NSString *domain = GENERIC_DOMAIN;
            [self doSip:[NSString stringWithFormat:@"sip:%@@%@", callTo, domain]];
            [self insertPlaceholderCall:callTo];
            [self successReturn:command jsonObj:jsonObj];
        }
    }];
}
- (void) CellularCall:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSString *phoneNumber = [command.arguments objectAtIndex:0];
    //    SharedPreferences prefs = PreferenceManager
    //    .getDefaultSharedPreferences(context);
    //    SharedPreferences.Editor edit1 = prefs.edit();
    //    edit1.putStringSet(
    //                       context.getString(R.string.phone_number_list),
    //                       new HashSet<String>());
    //    edit1.commit();
        
    //    SharedPreferences.Editor edit = prefs.edit();
    //    edit.putBoolean(
    //                    context.getString(R.string.native_call_enable),
    //                    true);
    //    edit.commit();
        
        [self doBlockNativeCall];
        
        [self doCellularCall:(NSString*)phoneNumber];
        [self successReturn:command];
    }];
}
- (void) VideoCall:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        [self successReturn:command];
    }];
}
- (void) RegisterSip:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"true", @"success",
                                 nil
                                 ];
        if ([self checkInternetConnectionAvailable:jsonObj]) {
            NSString *sipUsername = [command.arguments objectAtIndex:0];
            NSString *password = [command.arguments objectAtIndex:1];
            NSString *registerStatus = [command.arguments objectAtIndex:2];
            NSString *domain = GENERIC_DOMAIN;
            
            [[LinphoneAppDelegate instance] setTelno:sipUsername];
            [[LinphoneAppDelegate instance] setPassword:password];

            [LinPhonePlugin doRegisterSip:sipUsername password:password domain:domain registerStatus:registerStatus];
        }
        [self successReturn:command jsonObj:jsonObj];
    }];
}
- (void) SignOut:(CDVInvokedUrlCommand *)command {    NSString *sipUsername = [command.arguments objectAtIndex:0];
    [self.commandDelegate runInBackground:^{
        NSString *domain = GENERIC_DOMAIN;
        [LinPhonePlugin doSignOut:sipUsername domain:domain];
        [[LinphoneAppDelegate instance] setTelno:@""];
        [[LinphoneAppDelegate instance] setPassword:@""];
        [self successReturn:command];
    }];
}
- (void) PhoneContacts:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSString *balance = [command.arguments objectAtIndex:0];
        [self doPhoneContacts:balance];
        [self successReturn:command];
    }];
}
- (void) CallLogs:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        [self doCallLogs];
        [self successReturn:command];
    }];
}
- (void) HangUp:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"true", @"success",
                                 nil
                                 ];
        if ([self checkInternetConnectionAvailable:jsonObj]) {
            [self doHangUp];
        }
        [self successReturn:command jsonObj:jsonObj];
    }];
}
- (void) Settings:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"true", @"success",
                                 nil
                                 ];
        if ([self checkInternetConnectionAvailable:jsonObj]) {
            // nothing
        }
        [self successReturn:command jsonObj:jsonObj];
    }];
}
- (void) MicMute:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"true", @"success",
                                 nil
                                 ];
        if ([self checkInternetConnectionAvailable:jsonObj]) {
            bool enableMicMute = [command.arguments objectAtIndex:0];
            linphone_core_mute_mic([LinphoneManager getLc], enableMicMute);
        }
        [self successReturn:command jsonObj:jsonObj];
    }];
}
static void audioRouteChangeListenerCallback (
                                              void                   *inUserData,                                 // 1
                                              AudioSessionPropertyID inPropertyID,                                // 2
                                              UInt32                 inPropertyValueSize,                         // 3
                                              const void             *inPropertyValue                             // 4
) {
    if (inPropertyID != kAudioSessionProperty_AudioRouteChange) return; // 5
    LinPhonePlugin* plugin = (LinPhonePlugin*)inUserData;
    [plugin update];
}

- (bool)update {
    [[LinphoneManager instance] allowSpeaker];
    return [[LinphoneManager instance] speakerEnabled];
}

- (void) ShowDialPad:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        // no code
        [self successReturn:command];
    }];
}
- (void) Loudness:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"true", @"success",
                                 nil
                                 ];
        if ([self checkInternetConnectionAvailable:jsonObj]) {
            [self initUISpeaker];
            [[LinphoneManager instance] setSpeakerEnabled:TRUE];
        }
        [self successReturn:command jsonObj:jsonObj];
    }];
}
- (void) Phoneness:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"true", @"success",
                                 nil
                                 ];
        if ([self checkInternetConnectionAvailable:jsonObj]) {
            [self initUISpeaker];
            [[LinphoneManager instance] setSpeakerEnabled:FALSE];
        }
        [self successReturn:command jsonObj:jsonObj];
    }];
}
- (void) DialDtmf:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"true", @"success",
                                 nil
                                 ];
        if ([self checkInternetConnectionAvailable:jsonObj]) {
            NSString *sipUsername = [command.arguments objectAtIndex:0];
            [self doDialDtmf:[sipUsername characterAtIndex:0]];
        }
        [self successReturn:command jsonObj:jsonObj];
    }];
}
- (void) GetCallQuality:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"true", @"success",
                                 nil
                                 ];
        if ([self checkInternetConnectionAvailable:jsonObj]) {
            LinphoneCore *lc = [LinphoneManager getLc];
            LinphoneCall *currentCall = linphone_core_get_current_call(lc);
            
            if (currentCall != nil) {
                [jsonObj setObject:[NSNumber numberWithFloat:[self doGetCallQuality:currentCall]] forKey:QUALITY];
    //            result = new PluginResult(Status.OK, objJSON);
            } else {
                [jsonObj setObject:[NSNumber numberWithInt:0] forKey:QUALITY];
    //            result = new PluginResult(Status.NO_RESULT, objJSON);
            }
        }
        [self successReturn:command jsonObj:jsonObj];
    }];
}
- (void) GetCallDurationTime:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"true", @"success",
                                 nil
                                 ];
        LinphoneCore *lc = [LinphoneManager getLc];
        LinphoneCall *currentCall = linphone_core_get_current_call(lc);
        if (currentCall != nil) {
            int duration = linphone_core_get_current_call_duration(lc);
            [jsonObj setObject:[NSString stringWithFormat:@"%02d:%02d", duration / 60, duration % 60] forKey:TIME];
        } else {
            [jsonObj setObject:@"00:00" forKey:TIME];
        }
        [self successReturn:command jsonObj:jsonObj];
    }];
}
- (void) CheckEndCall:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"true", @"success",
                                 nil
                                 ];
        LinphoneCore *lc = [LinphoneManager getLc];
        LinphoneCall *currentCall = linphone_core_get_current_call(lc);
        if (currentCall == nil) {
            [jsonObj setObject:@YES forKey:END_CALL];
        } else {
            LinphoneCallState state = linphone_call_get_state(currentCall);
            if (state == LinphoneCallIdle
                || state == LinphoneCallError
                || state == LinphoneCallEnd
                || state == LinphoneCallReleased) {
                [self doHangUp];

                [jsonObj setObject:@YES forKey:END_CALL];
            } else {
                [jsonObj setObject:@NO forKey:END_CALL];
            }
        }
        [self successReturn:command jsonObj:jsonObj];
    }];
}
- (void) AnswerCall:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        LinphoneCall *incommingCall = [self doGetIncommingCall];
        [[LinphoneManager instance] acceptCall:incommingCall];
        
        [self successReturn:command];
    }];
}
- (void) DeclineCall:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        LinphoneCall *incommingCall = [self doGetIncommingCall];
        linphone_core_terminate_call([LinphoneManager getLc], incommingCall);
        [self successReturn:command];
    }];
}
- (void) Voicemail:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        // No need to code
        [self successReturn:command];
    }];
}
- (void) CheckInternetConnection:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"true", @"success",
                                 nil
                                 ];
        [self checkInternetConnectionAvailable:jsonObj];
        [self successReturn:command jsonObj:jsonObj];
    }];
}
- (void) GetSMSInboundPhoneNumber:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                                 initWithObjectsAndKeys :
                                 @"true", @"success",
                                 nil
                                 ];
        if ([self checkInternetConnectionAvailable:jsonObj]) {
            NSMutableArray * arrayJSON = [[NSMutableArray alloc] init];
    //        SharedPreferences prefs = PreferenceManager
    //        .getDefaultSharedPreferences(context);
    //        Set<String> defaultSet = new HashSet<String>();
    //        Set<String> phoneSet = prefs.getStringSet(context
    //                                                  .getString(R.string.phone_number_list),
    //                                                  defaultSet);
    //        if (phoneSet != null && phoneSet.size() > 0) {
    //            for (String phone : phoneSet) {
    //                [arrayJSON addObject:phone]];
    //            }
    //            phoneSet.clear();
    //        }
            [jsonObj setObject:arrayJSON forKey:PHONE_NUMBER_LIST];
        }
        [self successReturn:command jsonObj:jsonObj];
    }];
}
- (void) CallingCard:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSString *accessNumber = [command.arguments objectAtIndex:0];
        NSString *phoneNumber = [command.arguments objectAtIndex:1];
        [self doBlockNativeCall];
        [self doCallingCard:accessNumber phoneNumber:phoneNumber];
        [self successReturn:command];
    }];
}
- (void) BlockNativeCall:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        [self doBlockNativeCall];
        [self successReturn:command];
    }];
}
- (void) AllowNativeCall:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        [self doAllowNativeCall];
        [self successReturn:command];
    }];
}
- (void) StartVideoActivity:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        // No need to code
        [self successReturn:command];
    }];
}


//------------

+ (void) doRegisterSip:(NSString *)sipUsername password:(NSString*)password domain:(NSString*)domain registerStatus:(NSString*)registerStatus {
    //NSString *sipAddress = [NSString stringWithFormat:@"%@@%@", sipUsername, domain];
    
    LinphoneCore *lc = [LinphoneManager getLc];
    
    if (linphone_core_is_network_reachable(lc)) {
        
        // Get account index.
        const MSList *authInfoList = linphone_core_get_auth_info_list(lc);
        int nbAccounts = ms_list_size(authInfoList);
        
        if (nbAccounts > 0
                && [NOT_REGISTERED isEqualToString:registerStatus]) {
            [LinPhonePlugin doSignOut:sipUsername domain:domain];
        }
        
        if (nbAccounts == 0) { // User haven't registered in linphone
            [self doLogIn:sipUsername password:password domain:domain];
            [[LinphoneManager instance] refreshRegisters];
        } else {
            LinphoneCoreSettingsStore *settingsStore = [[LinphoneCoreSettingsStore alloc] init];
            [settingsStore switchAccount:sipUsername];
        }
        

    }
}

+ (int) getProxyConfigIndex:(LinphoneProxyConfig*) proxyConfig {
    int resultIndex = -1;
    LinphoneCore *lc = [LinphoneManager getLc];
    const MSList *proxyConfigList = linphone_core_get_proxy_config_list(lc);
    int size = ms_list_size(proxyConfigList);
    for (int index = 0; index < size; index++) {
        LinphoneProxyConfig *proxyCfg = ms_list_nth_data(proxyConfigList, index);
        if (linphone_proxy_config_get_identity(proxyCfg) == linphone_proxy_config_get_identity(proxyConfig)) {
            resultIndex = index;
            break;
        }
    }
    return resultIndex;
}

- (void) doSip:(NSString *)sipUrl {
    if( [sipUrl length] > 0){
        [[LinphoneManager instance] call:sipUrl displayName:sipUrl transfer:FALSE];
    }
}

- (void) doDialDtmf:(char)keyCode {
    linphone_core_send_dtmf([LinphoneManager getLc], keyCode);
}



+ (void) doSignOut:(NSString*)sipUsername domain:(NSString*)domain {
    if ([LinphoneManager isLcReady]) {
        LinphoneCore *lc = [LinphoneManager getLc];
        LinphoneProxyConfig* proxyCfg = NULL;
        linphone_core_get_default_proxy(lc, &proxyCfg);
        if (proxyCfg != NULL) {
            
            linphone_proxy_config_edit(proxyCfg);
            linphone_proxy_config_enable_register(proxyCfg, false);
            linphone_proxy_config_done(proxyCfg);
            
            linphone_core_get_default_proxy([LinphoneManager getLc], &proxyCfg);
            [LinPhonePlugin doProxyConfigUpdate:proxyCfg];

        }
    }
}

+ (void)doProxyConfigUpdate: (LinphoneProxyConfig*) config {
    LinphoneRegistrationState state = LinphoneRegistrationNone;
    NSString* message = nil;
//    UIImage* image = nil;
    LinphoneCore* lc = [LinphoneManager getLc];
    LinphoneGlobalState gstate = linphone_core_get_global_state(lc);
    
    if( gstate == LinphoneGlobalConfiguring ){
        message = NSLocalizedString(@"Fetching remote configuration", nil);
    } else if (config == NULL) {
        state = LinphoneRegistrationNone;
        if(linphone_core_is_network_reachable([LinphoneManager getLc]))
            message = NSLocalizedString(@"No SIP account configured", nil);
        else
            message = NSLocalizedString(@"Network down", nil);
    } else {
        state = linphone_proxy_config_get_state(config);
        
        switch (state) {
            case LinphoneRegistrationOk:
                message = NSLocalizedString(@"Registered", nil); break;
            case LinphoneRegistrationNone:
            case LinphoneRegistrationCleared:
                message =  NSLocalizedString(@"Not registered", nil); break;
            case LinphoneRegistrationFailed:
                message =  NSLocalizedString(@"Registration failed", nil); break;
            case LinphoneRegistrationProgress:
                message =  NSLocalizedString(@"Registration in progress", nil); break;
            default: break;
        }
    }
    
//    registrationStateLabel.hidden = NO;
    switch(state) {
        case LinphoneRegistrationFailed:
//            registrationStateImage.hidden = NO;
//            image = [UIImage imageNamed:@"led_error.png"];
            break;
        case LinphoneRegistrationCleared:
        case LinphoneRegistrationNone:
//            registrationStateImage.hidden = NO;
//            image = [UIImage imageNamed:@"led_disconnected.png"];
            break;
        case LinphoneRegistrationProgress:
//            registrationStateImage.hidden = NO;
//            image = [UIImage imageNamed:@"led_inprogress.png"];
            break;
        case LinphoneRegistrationOk:
//            registrationStateImage.hidden = NO;
//            image = [UIImage imageNamed:@"led_connected.png"];
            break;
    }
//    [registrationStateLabel setText:message];
//    [registrationStateImage setImage:image];
}


+ (void) doLogIn:(NSString*)sipUsername password:(NSString*)password domain:(NSString*)domain {
    LinphoneCore* lc = [LinphoneManager getLc];
    LinphoneProxyConfig* proxyCfg = linphone_core_create_proxy_config(lc);
    
    char normalizedUserName[256];
    linphone_proxy_config_normalize_number(proxyCfg, [sipUsername cStringUsingEncoding:[NSString defaultCStringEncoding]], normalizedUserName, sizeof(normalizedUserName));
    
    const char* identity = linphone_proxy_config_get_identity(proxyCfg);
    if( !identity || !*identity ) identity = "sip:user@example.com";
    
    LinphoneAddress* linphoneAddress = linphone_address_new(identity);
    linphone_address_set_username(linphoneAddress, normalizedUserName);
    
    if( domain && [domain length] != 0) {
        // when the domain is specified (for external login), take it as the server address
        linphone_proxy_config_set_server_addr(proxyCfg, [domain UTF8String]);
        linphone_address_set_domain(linphoneAddress, [domain UTF8String]);
    }
    
    identity = linphone_address_as_string_uri_only(linphoneAddress);
    
    linphone_proxy_config_set_identity(proxyCfg, identity);
    
    
    
    LinphoneAuthInfo* info = linphone_auth_info_new([sipUsername UTF8String]
                                                    , NULL, [password UTF8String]
                                                    , NULL
                                                    , NULL
                                                    ,linphone_proxy_config_get_domain(proxyCfg));
    
    [self setDefaultSettings:proxyCfg];
    
    [self clearProxyConfig];
    
    linphone_proxy_config_enable_register(proxyCfg, true);
    linphone_core_add_auth_info(lc, info);
    linphone_core_add_proxy_config(lc, proxyCfg);
    linphone_core_set_default_proxy(lc, proxyCfg);

}

+ (void)setDefaultSettings:(LinphoneProxyConfig*)proxyCfg {
    LinphoneManager* lm = [LinphoneManager instance];
    
    BOOL pushnotification = [lm lpConfigBoolForKey:@"pushnotification_preference"];
    if(pushnotification) {
        [lm addPushTokenToProxyConfig:proxyCfg];
    }
}

+ (void)clearProxyConfig {
    linphone_core_clear_proxy_config([LinphoneManager getLc]);
    linphone_core_clear_all_auth_info([LinphoneManager getLc]);
}

+ (NSMutableArray*) findAuthIndexOf:(NSString*)sipAddress {
    LinphoneCore *lc = [LinphoneManager getLc];
    const MSList *accountList = linphone_core_get_auth_info_list(lc);
    int nbAccounts = ms_list_size(accountList);
    NSMutableArray *indexes = [[NSMutableArray alloc] init];
    for (int index = 0; index < nbAccounts; index++)
    {
        LinphoneAuthInfo* authInfo = ms_list_nth_data(accountList, index);
        
        const char *accountUsername = linphone_auth_info_get_username(authInfo);
        const char *accountDomain = linphone_auth_info_get_domain(authInfo);
        NSString *identity = [NSString stringWithFormat:@"%s@%s", accountUsername, accountDomain];
        if ([identity isEqualToString:sipAddress]) {
            [indexes addObject:[NSNumber numberWithInteger:index]];
        }
    }
    return indexes;
}


// ------------------------

- (bool) checkInternetConnectionAvailable:(NSMutableDictionary*)jsonObj {
    if ([self isInternetReachable]) {
        [jsonObj setObject:@YES forKey:INTERNET_CONNECTION_AVAILABLE];
        return YES;
    } else {
        [jsonObj setObject:@NO forKey:INTERNET_CONNECTION_AVAILABLE];
    }
    return NO;
}

- (bool) isInternetReachable {
    internetReachableFoo = [Reachability reachabilityWithHostname:@"www.google.com"];
    NetworkStatus internetStatus = [internetReachableFoo currentReachabilityStatus];
    if(internetStatus == NotReachable) {
        return NO;
    }
    return YES;
}

- (void) successReturn:(CDVInvokedUrlCommand *)command jsonObj:(NSMutableDictionary*)jsonObj {
    
    CDVPluginResult *pluginResult = [ CDVPluginResult
                                     resultWithStatus    : CDVCommandStatus_OK
                                     messageAsDictionary : jsonObj
                                     ];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) successReturn:(CDVInvokedUrlCommand *)command {
    NSDictionary *jsonObj = [ [NSDictionary alloc]
                             initWithObjectsAndKeys :
                             @"true", @"success",
                             nil
                             ];
    
    CDVPluginResult *pluginResult = [ CDVPluginResult
                                     resultWithStatus    : CDVCommandStatus_OK
                                     messageAsDictionary : jsonObj
                                     ];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) insertPlaceholderCall:callTo {
    
}

- (void) doBlockNativeCall {
//    SharedPreferences prefs = PreferenceManager
//				.getDefaultSharedPreferences(context);
//    SharedPreferences.Editor edit = prefs.edit();
//    edit.putBoolean(context.getString(R.string.do_cellular_call), false);
//    edit.putString(context.getString(R.string.do_cellular_call_number), "");
//    edit.commit();
}

- (void) doCellularCall:(NSString *)phoneNumber {
    NSString *telString = [@"tel://" stringByAppendingString:phoneNumber];
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:telString]];
}

- (void) doPhoneContacts:(NSString*) balance  {
    [[LinphoneAppDelegate instance] showLinphoneContactView];

}

- (void) doCallLogs {
    [[LinphoneAppDelegate instance] showLinphoneCallLogView];
}

- (void) doHangUp {
    LinphoneCore* lc = [LinphoneManager getLc];
    LinphoneCall* currentcall = linphone_core_get_current_call(lc);
    if (linphone_core_is_in_conference(lc) || // In conference
        (linphone_core_get_conference_size(lc) > 0 // && [UIHangUpButton callCount:lc] == 0
         ) // Only one conf
        ) {
        linphone_core_terminate_conference(lc);
    } else if(currentcall != NULL) { // In a call
        linphone_core_terminate_call(lc, currentcall);
    } else {
        const MSList* calls = linphone_core_get_calls(lc);
        if (ms_list_size(calls) == 1) { // Only one call
            linphone_core_terminate_call(lc,(LinphoneCall*)(calls->data));
        }
    }
}

- (float) doGetCallQuality:(LinphoneCall*) linphoneCall {
    return linphone_call_get_current_quality(linphoneCall);
}

- (LinphoneCall*) doGetIncommingCall {
    LinphoneCall *incommingCall = nil;
    // Only one call ringing at a time is allowed
    LinphoneCore *lc = [LinphoneManager getLc];
    if (lc != nil) {
        const MSList* calls = linphone_core_get_calls(lc);
        int size = ms_list_size(calls);
        for (int index = 0; index < size; index++) {
            LinphoneCall *call = ms_list_nth_data(calls, index);
            if (LinphoneCallIncoming == linphone_call_get_state(call)) {
                incommingCall = call;
                break;
            }
        }
    }
    if (incommingCall == nil) {
        // Log.e("Couldn't find incoming call");
        // finish();
        return nil;
    }
    //LinphoneAddress address = incommingCall.getRemoteAddress();
    // May be greatly sped up using a drawable cache
    // Uri uri =
    // LinphoneUtils.findUriPictureOfContactAndSetDisplayName(address,
    // getContentResolver());
    // LinphoneUtils.setImagePictureFromUri(this, mPictureView.getView(),
    // uri, R.drawable.unknown_small);
    return incommingCall;
}

- (void) doCallingCard:(NSString*)accessNumber phoneNumber:(NSString*)phoneNumber {
    NSString *telString = [NSString stringWithFormat:@"tel:%@,%@", accessNumber, phoneNumber];
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:telString]];
}

- (void) doAllowNativeCall {
//    SharedPreferences prefs = PreferenceManager
//				.getDefaultSharedPreferences(context);
//    SharedPreferences.Editor edit = prefs.edit();
//    edit.putBoolean(context.getString(R.string.native_call_enable), true);
//    edit.commit();
}

- (void)initUISpeaker {
    AudioSessionInitialize(NULL, NULL, NULL, NULL);
//    OSStatus lStatus = AudioSessionAddPropertyListener(kAudioSessionProperty_AudioRouteChange, audioRouteChangeListenerCallback, self);
//    if (lStatus) {
//        [LinphoneLogger logc:LinphoneLoggerError format:"cannot register route change handler [%ld]",lStatus];
//    }
}

@end