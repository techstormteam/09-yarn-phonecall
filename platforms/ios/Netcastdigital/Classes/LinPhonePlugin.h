//
//  LinPhonePlugin.h
//  Netcastdigital
//
//  Created by Macbook air on 11/11/14.
//
//


#import <Cordova/CDV.h>
#import "Reachability.h"
#include "LinphoneManager.h"
#include "linphone/linphonecore.h"
#import "LinphoneAppDelegate.h"
#import "GKPeoplePickerNavigationController.h"

#define GENERIC_DOMAIN @"cloud.netcastdigital.net"
#define NOT_IN_CALL @"NOT-IN-CALL"
#define NOT_REGISTERED @"NOT-REGISTERED"
#define INTERNET_CONNECTION_AVAILABLE @"internetConnectionAvailable"
#define QUALITY @"quality"
#define TIME @"time"
#define END_CALL @"endCall"
#define STATE @"state"
#define PHONE_NUMBER_LIST @"phone_number_list"
#define SUCCESS_STATUS @"success"

@interface LinPhonePlugin : CDVPlugin {
    Reachability *internetReachableFoo;
}


//----- Yarn ------
- (void) WifiCall:(CDVInvokedUrlCommand *)command;
- (void) CellularCall:(CDVInvokedUrlCommand *)command;
- (void) VideoCall:(CDVInvokedUrlCommand *)command;
- (void) RegisterSip:(CDVInvokedUrlCommand *)command;
- (void) SignOut:(CDVInvokedUrlCommand *)command;
- (void) PhoneContacts:(CDVInvokedUrlCommand *)command;
- (void) CallLogs:(CDVInvokedUrlCommand *)command;
- (void) HangUp:(CDVInvokedUrlCommand *)command;
- (void) Settings:(CDVInvokedUrlCommand *)command;
- (void) MicMute:(CDVInvokedUrlCommand *)command;
- (void) ShowDialPad:(CDVInvokedUrlCommand *)command;
- (void) Loudness:(CDVInvokedUrlCommand *)command;
- (void) Phoneness:(CDVInvokedUrlCommand *)command;
- (void) DialDtmf:(CDVInvokedUrlCommand *)command;
- (void) GetCallQuality:(CDVInvokedUrlCommand *)command;
- (void) GetCallDurationTime:(CDVInvokedUrlCommand *)command;
- (void) CheckEndCall:(CDVInvokedUrlCommand *)command;
- (void) AnswerCall:(CDVInvokedUrlCommand *)command;
- (void) DeclineCall:(CDVInvokedUrlCommand *)command;
- (void) Voicemail:(CDVInvokedUrlCommand *)command;
- (void) CheckInternetConnection:(CDVInvokedUrlCommand *)command;
- (void) GetSMSInboundPhoneNumber:(CDVInvokedUrlCommand *)command;
- (void) CallingCard:(CDVInvokedUrlCommand *)command;
- (void) BlockNativeCall:(CDVInvokedUrlCommand *)command;
- (void) AllowNativeCall:(CDVInvokedUrlCommand *)command;
- (void) StartVideoActivity:(CDVInvokedUrlCommand *)command;

+ (void) doRegisterSip:(NSString *)sipUsername password:(NSString*)password domain:(NSString*)domain registerStatus:(NSString*)registerStatus;
+ (void) doLogIn:(NSString*)sipUsername password:(NSString*)password domain:(NSString*)domain;
+ (void)setDefaultSettings:(LinphoneProxyConfig*)proxyCfg;
+ (void)clearProxyConfig;
+ (NSMutableArray*) findAuthIndexOf:(NSString*)sipAddress;
+ (void) doSignOut:(NSString*)sipUsername domain:(NSString*)domain;


@end