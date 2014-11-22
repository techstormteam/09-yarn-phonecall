//
//  LinPhonePlugin.h
//  Netcastdigital
//
//  Created by Macbook air on 11/11/14.
//
//


#import <Cordova/CDV.h>
#import "Reachability.h"

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

@end