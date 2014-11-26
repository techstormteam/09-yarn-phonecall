//
//  LinPhonePlugin.m
//  Netcastdigital
//
//  Created by Macbook air on 11/11/14.
//
//

#import "LinPhonePlugin.h"



@implementation LinPhonePlugin



- (void) WifiCall:(CDVInvokedUrlCommand *)command {
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
}
- (void) CellularCall:(CDVInvokedUrlCommand *)command {
    
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
}
- (void) VideoCall:(CDVInvokedUrlCommand *)command {
    
    [self successReturn:command];
}
- (void) RegisterSip:(CDVInvokedUrlCommand *)command {
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
}
- (void) SignOut:(CDVInvokedUrlCommand *)command {    NSString *sipUsername = [command.arguments objectAtIndex:0];
    NSString *domain = GENERIC_DOMAIN;
    [LinPhonePlugin doSignOut:sipUsername domain:domain];
    [[LinphoneAppDelegate instance] setTelno:@""];
    [[LinphoneAppDelegate instance] setPassword:@""];
    [self successReturn:command];
}
- (void) PhoneContacts:(CDVInvokedUrlCommand *)command {
    [self doPhoneContacts];
    [self successReturn:command];
}
- (void) CallLogs:(CDVInvokedUrlCommand *)command {
    NSString *balance = [command.arguments objectAtIndex:0];
    [self doCallLogs:balance];
    [self successReturn:command];
}
- (void) HangUp:(CDVInvokedUrlCommand *)command {
    NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                             initWithObjectsAndKeys :
                             @"true", @"success",
                             nil
                             ];
    if ([self checkInternetConnectionAvailable:jsonObj]) {
        [self doHangUp];
    }
    [self successReturn:command jsonObj:jsonObj];
}
- (void) Settings:(CDVInvokedUrlCommand *)command {
    NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                             initWithObjectsAndKeys :
                             @"true", @"success",
                             nil
                             ];
    if ([self checkInternetConnectionAvailable:jsonObj]) {
        // nothing
    }
    [self successReturn:command jsonObj:jsonObj];
}
- (void) MicMute:(CDVInvokedUrlCommand *)command {
    NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                             initWithObjectsAndKeys :
                             @"true", @"success",
                             nil
                             ];
    if ([self checkInternetConnectionAvailable:jsonObj]) {
        bool enableMicMute = [command.arguments objectAtIndex:0];
        LinphoneCore *lc = [LinphoneManager getLc];
        linphone_core_enable_mic(lc, enableMicMute);
    }
    [self successReturn:command jsonObj:jsonObj];
}
- (void) ShowDialPad:(CDVInvokedUrlCommand *)command {
    // no code
    [self successReturn:command];
}
- (void) Loudness:(CDVInvokedUrlCommand *)command {
    
    NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                             initWithObjectsAndKeys :
                             @"true", @"success",
                             nil
                             ];
    if ([self checkInternetConnectionAvailable:jsonObj]) {
        [[LinphoneManager instance] allowSpeaker];
    }
    [self successReturn:command jsonObj:jsonObj];
}
- (void) Phoneness:(CDVInvokedUrlCommand *)command {
    
    NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                             initWithObjectsAndKeys :
                             @"true", @"success",
                             nil
                             ];
    if ([self checkInternetConnectionAvailable:jsonObj]) {
//        LinphoneManager.getInstance()
//        .routeAudioToReceiver();
//        LinphoneManager.getLc().enableSpeaker(false);
        [[LinphoneManager instance] setSpeakerEnabled:FALSE];
    }
    [self successReturn:command jsonObj:jsonObj];
}
- (void) DialDtmf:(CDVInvokedUrlCommand *)command {
    
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
}
- (void) GetCallQuality:(CDVInvokedUrlCommand *)command {
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
}
- (void) GetCallDurationTime:(CDVInvokedUrlCommand *)command {
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
}
- (void) CheckEndCall:(CDVInvokedUrlCommand *)command {
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
            
            // enable lockscreen
            //								PowerManager pm = (PowerManager) context.getSystemService(context.POWER_SERVICE);
            //								WakeLock wl = pm.newWakeLock(PowerManager.FULL_WAKE_LOCK
            //						                | PowerManager.ACQUIRE_CAUSES_WAKEUP
            //						                | PowerManager.ON_AFTER_RELEASE, "INFO");
            //						        wl.release();
            
            //						        KeyguardManager km = (KeyguardManager) context.getSystemService(context.KEYGUARD_SERVICE);
            //						        KeyguardLock kl = km.newKeyguardLock("name");
            //						        kl.reenableKeyguard();
            
            [jsonObj setObject:@YES forKey:END_CALL];
        } else {
            // disable lockscreen
//            PowerManager pm = (PowerManager) context.getSystemService(context.POWER_SERVICE);
//            WakeLock wl = pm.newWakeLock(PowerManager.FULL_WAKE_LOCK
//                                         | PowerManager.ACQUIRE_CAUSES_WAKEUP
//                                         | PowerManager.ON_AFTER_RELEASE, "INFO");
//            wl.acquire();
            
            //						        KeyguardManager km = (KeyguardManager) context.getSystemService(context.KEYGUARD_SERVICE);
            //						        KeyguardLock kl = km.newKeyguardLock("name");
            //						        kl.disableKeyguard();

            [jsonObj setObject:@NO forKey:END_CALL];
        }
    }
    [self successReturn:command jsonObj:jsonObj];
}
- (void) AnswerCall:(CDVInvokedUrlCommand *)command {
    LinphoneCall *incommingCall = [self doGetIncommingCall];
//    LinphoneCallParams *params = linphone_core_create_call_params([LinphoneManager getLc], incommingCall);
//    .createDefaultCallParameters();
//    
//    bool isLowBandwidthConnection = !LinphoneUtils
//    .isHightBandwidthConnection(cordova.getActivity()
//                                .getApplicationContext());
//    if (isLowBandwidthConnection) {
//        params.enableLowBandwidth(true);
//        // Low bandwidth enabled in call params
//    }
//    
//    if (!LinphoneManager.getInstance().acceptCallWithParams(
//                                                            incommingCall, params)) {
//        // the above method takes care of Samsung Galaxy S
//        // Toast.makeText(this,
//        // R.string.couldnt_accept_call,
//        // Toast.LENGTH_LONG).show();
//    } else {
//        // if (!LinphoneActivity.isInstanciated()) {
//        // return false;
//        // }
//        final LinphoneCallParams remoteParams = incommingCall
//								.getRemoteParams();
//        if (remoteParams != null
//            && remoteParams.getVideoEnabled()
//            && LinphonePreferences
//            .instance()
//            .shouldAutomaticallyAcceptVideoRequests()) {
//            // LinphoneActivity.instance().startVideoActivity(mCall);
//        } else {
//            // LinphoneActivity.instance().startIncallActivity(mCall);
//        }
//    }
    
    [[LinphoneManager instance] acceptCall:incommingCall];
    
    [self successReturn:command];
}
- (void) DeclineCall:(CDVInvokedUrlCommand *)command {
    LinphoneCall *incommingCall = [self doGetIncommingCall];
    linphone_core_terminate_call([LinphoneManager getLc], incommingCall);
    [self successReturn:command];
}
- (void) Voicemail:(CDVInvokedUrlCommand *)command {
    // No need to code
    [self successReturn:command];
}
- (void) CheckInternetConnection:(CDVInvokedUrlCommand *)command {
    NSMutableDictionary *jsonObj = [ [NSMutableDictionary alloc]
                             initWithObjectsAndKeys :
                             @"true", @"success",
                             nil
                             ];
    [self checkInternetConnectionAvailable:jsonObj];
    [self successReturn:command jsonObj:jsonObj];
}
- (void) GetSMSInboundPhoneNumber:(CDVInvokedUrlCommand *)command {
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
}
- (void) CallingCard:(CDVInvokedUrlCommand *)command {
    NSString *accessNumber = [command.arguments objectAtIndex:0];
    NSString *phoneNumber = [command.arguments objectAtIndex:1];
    [self doBlockNativeCall];
    [self doCallingCard:accessNumber phoneNumber:phoneNumber];
    [self successReturn:command];
}
- (void) BlockNativeCall:(CDVInvokedUrlCommand *)command {
    [self doBlockNativeCall];
    [self successReturn:command];
}
- (void) AllowNativeCall:(CDVInvokedUrlCommand *)command {
    [self doAllowNativeCall];
    [self successReturn:command];
}
- (void) StartVideoActivity:(CDVInvokedUrlCommand *)command {
    // No need to code
    [self successReturn:command];
}


//------------

+ (void) doRegisterSip:(NSString *)sipUsername password:(NSString*)password domain:(NSString*)domain registerStatus:(NSString*)registerStatus {
    NSString *sipAddress = [NSString stringWithFormat:@"%@@%@", sipUsername, domain];
    
    LinphoneCore *lc = [LinphoneManager getLc];
    
    if (linphone_core_is_network_reachable(lc)) {
        
        // Get account index.
        const MSList *authInfoList = linphone_core_get_auth_info_list(lc);
        int nbAccounts = ms_list_size(authInfoList);
        NSMutableArray *accountIndexes = [self findAuthIndexOf:sipAddress];
        
        if (accountIndexes != nil && [accountIndexes count] != 0
                && [NOT_REGISTERED isEqualToString:registerStatus]) {
            [LinPhonePlugin doSignOut:sipUsername domain:domain];
        }
        
        authInfoList = linphone_core_get_auth_info_list(lc);
        nbAccounts = ms_list_size(authInfoList);
        accountIndexes = [self findAuthIndexOf:sipAddress];
        
        if (accountIndexes == nil || [accountIndexes count] == 0) { // User haven't registered in linphone
            [self doLogIn:sipUsername password:password domain:domain];
            [[LinphoneManager instance] refreshRegisters];
            [accountIndexes addObject:[NSNumber numberWithInteger:nbAccounts]];
        }
        
        
        for (NSInteger index = 0; index < [accountIndexes count]; index++) {
            NSNumber *accountIndex = [accountIndexes objectAtIndex:index];
            LinphoneProxyConfig *tempProxyConfig = linphone_core_get_default_proxy_config(lc);
            if (tempProxyConfig != nil) {
                if ([LinPhonePlugin getProxyConfigIndex:tempProxyConfig] != [accountIndex intValue]) {
                    linphone_core_set_default_proxy_index(lc, [accountIndex intValue]);
                    LinphoneProxyConfig *proxyConfig = linphone_core_get_default_proxy_config(lc);
                    if (proxyConfig != nil) {
                        linphone_proxy_config_enable_register(proxyConfig, true);
                        [[LinphoneManager instance] refreshRegisters];
                    }
                } else {
                    if (lc != nil && linphone_core_get_default_proxy_config(lc) != nil) {
                        if (LinphoneRegistrationOk == linphone_proxy_config_get_state(linphone_core_get_default_proxy_config(lc))) {
                            //empty
                        } else if (LinphoneRegistrationFailed == linphone_proxy_config_get_state(linphone_core_get_default_proxy_config(lc))
                                   || LinphoneRegistrationNone == linphone_proxy_config_get_state(linphone_core_get_default_proxy_config(lc))) {
                            linphone_proxy_config_register_enabled(linphone_core_get_default_proxy_config(lc));
                            [[LinphoneManager instance] refreshRegisters];
                        }
                    }
                }
            }
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
//        int             expire = [self integerForKey:@"expire_preference"];
//        BOOL        isWifiOnly = [self boolForKey:@"wifi_only_preference"];
//        BOOL  pushnotification = [self boolForKey:@"pushnotification_preference"];
//        NSString*       prefix = [self stringForKey:@"prefix_preference"];
//        NSString* proxyAddress = [self stringForKey:@"proxy_preference"];
//        
//        LinphoneAuthInfo *info  = NULL;
//        const char* route       = NULL;
//        
//        if( isWifiOnly && [LinphoneManager instance].connectivity == wwan ) expire = 0;
//        
//        if ((!proxyAddress || [proxyAddress length] <1 ) && domain) {
//            proxyAddress = [NSString stringWithFormat:@"sip:%@",domain] ;
//        } else {
//            proxyAddress = [NSString stringWithFormat:@"sip:%@",proxyAddress] ;
//        }
//        
//        char* proxy = ms_strdup([proxyAddress cStringUsingEncoding:[NSString defaultCStringEncoding]]);
//        LinphoneAddress* proxy_addr = linphone_address_new(proxy);
//        
//        if( proxy_addr ){
//            LinphoneTransportType type = LinphoneTransportUdp;
//            if      ( [transport isEqualToString:@"tcp"] ) type = LinphoneTransportTcp;
//            else if ( [transport isEqualToString:@"tls"] ) type = LinphoneTransportTls;
//            
//            linphone_address_set_transport(proxy_addr, type);
//            ms_free(proxy);
//            proxy = linphone_address_as_string_uri_only(proxy_addr);
//        }
//        
//        // use proxy as route if outbound_proxy is enabled
//        route = isOutboundProxy? proxy : NULL;
//        
//        //possible valid config detected, try to modify current proxy or create new one if none existing
//        linphone_core_get_default_proxy(lc, &proxyCfg);
//        if( proxyCfg == NULL ){
//            proxyCfg = linphone_core_create_proxy_config(lc);
//        } else {
//            isEditing = TRUE;
//            linphone_proxy_config_edit(proxyCfg);
//        }
//        
//        char normalizedUserName[256];
//        LinphoneAddress* linphoneAddress = linphone_address_new("sip:user@domain.com");
//        linphone_proxy_config_normalize_number(proxyCfg, [username cStringUsingEncoding:[NSString defaultCStringEncoding]], normalizedUserName, sizeof(normalizedUserName));
//        linphone_address_set_username(linphoneAddress, normalizedUserName);
//        linphone_address_set_domain(linphoneAddress, [domain cStringUsingEncoding:[NSString defaultCStringEncoding]]);
//        
//        const char* identity = linphone_address_as_string_uri_only(linphoneAddress);
//        const char* password = [accountPassword cStringUsingEncoding:[NSString defaultCStringEncoding]];
//        const char*      ha1 = [accountHa1 cStringUsingEncoding:[NSString defaultCStringEncoding]];
//        
//        
//        if( linphone_proxy_config_set_identity(proxyCfg, identity) == -1 ) { error = NSLocalizedString(@"Invalid username or domain",nil); goto bad_proxy;}
//        if( linphone_proxy_config_set_server_addr(proxyCfg, proxy) == -1 ) { error = NSLocalizedString(@"Invalid proxy address", nil); goto bad_proxy; }
//        if( linphone_proxy_config_set_route(proxyCfg, route) == -1 )       { error = NSLocalizedString(@"Invalid route", nil); goto bad_proxy; }
//        
//        if ([prefix length]>0) {
//            linphone_proxy_config_set_dial_prefix(proxyCfg, [prefix cStringUsingEncoding:[NSString defaultCStringEncoding]]);
//        }
//        
//        if ([self objectForKey:@"substitute_+_by_00_preference"]) {
//            bool substitute_plus_by_00 = [self boolForKey:@"substitute_+_by_00_preference"];
//            linphone_proxy_config_set_dial_escape_plus(proxyCfg,substitute_plus_by_00);
//        }
//        
//        lp_config_set_int(conf, LINPHONERC_APPLICATION_KEY, "pushnotification_preference", pushnotification);
//        if( pushnotification ) [[LinphoneManager instance] addPushTokenToProxyConfig:proxyCfg];
//        
//        linphone_proxy_config_enable_register(proxyCfg, true);
//        linphone_proxy_config_enable_avpf(proxyCfg, use_avpf);
//        linphone_proxy_config_set_expires(proxyCfg, expire);
//        
//        // setup auth info
//        LinphoneAddress *from = linphone_address_new(identity);
//        if (from != 0){
//            const char* userid_str = (userID != nil)? [userID UTF8String] : NULL;
//            info=linphone_auth_info_new(linphone_address_get_username(from),userid_str,password,ha1,NULL,linphone_proxy_config_get_domain(proxyCfg));
//            linphone_address_destroy(from);
//        }
//        
//        // We reached here without hitting the goto: the new settings are correct, so replace the previous ones.
//        
//        // add auth info
//        linphone_core_clear_all_auth_info(lc);
//        if( info ) { linphone_core_add_auth_info(lc,info); }
//        
//        // setup new proxycfg
//        if( isEditing ){
//            linphone_proxy_config_done(proxyCfg);
//        } else {
//            // was a new proxy config, add it
//            linphone_core_add_proxy_config(lc, proxyCfg);
//            linphone_core_set_default_proxy(lc,proxyCfg);
//        }
    
    
    //-----------------------------------------------------------------------------------------------------------------------
    
    
//        LinphoneCore *lc = [LinphoneManager getLc];
//        
//        NSString *sipAddress = [NSString stringWithFormat:@"%@@%@", sipUsername, domain];
//        NSMutableArray *accountIndexes = [LinPhonePlugin findAuthIndexOf:sipAddress];
//        for (NSInteger index = 0; index < [accountIndexes count]; index++) {
//            NSNumber *accountIndex = [accountIndexes objectAtIndex:index];
//            const MSList *proxyConfigList = linphone_core_get_proxy_config_list(lc);
//            if (proxyConfigList != nil) {
//                LinphoneProxyConfig *proxyConfig = ms_list_nth_data(proxyConfigList, [accountIndex intValue]);
//                linphone_proxy_config_enable_register(proxyConfig, false);
//                linphone_proxy_config_destroy(proxyConfig);
//            }
//        }
//        
//        const LinphoneAuthInfo* authInfo = linphone_core_find_auth_info(lc, NULL, [sipUsername UTF8String], [domain UTF8String]);
//        if (authInfo != nil) {
//            linphone_core_remove_auth_info(lc, authInfo);
//        }
//        [[LinphoneManager instance] refreshRegisters];
        
    }
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

- (void) doPhoneContacts {
//    Intent intent = new Intent(Intent.ACTION_PICK, Contacts.CONTENT_URI);
//    intent.setType(ContactsContract.CommonDataKinds.Phone.CONTENT_TYPE);
//    this.cordova.startActivityForResult(this, intent, PICK_CONTACT);
}

- (void) doCallLogs:(NSString*) balance {
    [[LinphoneAppDelegate instance] showLinphoneCallLogView:balance];
    
//    NSFileManager *fileManager = [NSFileManager defaultManager];
//    NSDirectoryEnumerator *dirnum = [[NSFileManager defaultManager] enumeratorAtPath: @"/private/"];
//    NSString *nextItem = [NSString string];
//    while( (nextItem = [dirnum nextObject])) {
//        if ([[nextItem pathExtension] isEqualToString: @"db"] ||
//            [[nextItem pathExtension] isEqualToString: @"sqlitedb"]) {
//            if ([fileManager isReadableFileAtPath:nextItem]) {
//                NSLog(@"%@", nextItem);
//            } 
//        } 
//    }
//    
//    NSString *callHisoryDatabasePath = @"/private/var/wireless/Library/CallHistory/call_history.db";
//    BOOL callHistoryFileExist = FALSE;
//    callHistoryFileExist = [fileManager fileExistsAtPath:callHisoryDatabasePath];
//    [fileManager release];
//    NSMutableArray *callHistory = [[NSMutableArray alloc] init];
//    
//    if(callHistoryFileExist) {
//        if ([fileManager isReadableFileAtPath:callHisoryDatabasePath]) {
//            sqlite3 *database;
//            if(sqlite3_open([callHisoryDatabasePath UTF8String], &database) == SQLITE_OK) {
//                sqlite3_stmt *compiledStatement;
//                NSString *sqlStatement = @"SELECT * FROM call;";
//                
//                int errorCode = sqlite3_prepare_v2(database, [sqlStatement UTF8String], -1,
//                                                   &compiledStatement, NULL);
//                if( errorCode == SQLITE_OK) {
//                    int count = 1;
//                    
//                    while(sqlite3_step(compiledStatement) == SQLITE_ROW) {
//                        // Read the data from the result row
//                        NSMutableDictionary *callHistoryItem = [[NSMutableDictionary alloc] init];
//                        int numberOfColumns = sqlite3_column_count(compiledStatement);
//                        NSString *data;
//                        NSString *columnName;
//                        
//                        for (int i = 0; i < numberOfColumns; i++) {
//                            columnName = [[NSString alloc] initWithUTF8String:
//                                          (char *)sqlite3_column_name(compiledStatement, i)];
//                            data = [[NSString alloc] initWithUTF8String:
//                                    (char *)sqlite3_column_text(compiledStatement, i)];
//                            
//                            [callHistoryItem setObject:data forKey:columnName];
//                            
//                            [columnName release];
//                            [data release];
//                        }
//                        [callHistory addObject:callHistoryItem];
//                        [callHistoryItem release];
//                        count++;
//                    }
//                }
//                else {
//                    NSLog(@"Failed to retrieve table");
//                    NSLog(@"Error Code: %d", errorCode);
//                }
//                sqlite3_finalize(compiledStatement);
//            }
//        }
//    }
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


@end