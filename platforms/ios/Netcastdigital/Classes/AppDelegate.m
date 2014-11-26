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

//
//  AppDelegate.m
//  Netcastdigital
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "AppDelegate.h"
#import "MainViewController.h"

#import "PhoneMainView.h"
#import "linphoneAppDelegate.h"
#import "AddressBook/ABPerson.h"

#import "CoreTelephony/CTCallCenter.h"
#import "CoreTelephony/CTCall.h"

#import "ConsoleViewController.h"
#import "LinphoneCoreSettingsStore.h"

#include "LinphoneManager.h"
#include "linphone/linphonecore.h"

#include "LinPhonePlugin.h"

#import <Cordova/CDVPlugin.h>

@implementation AppDelegate

@synthesize configURL;

@synthesize window, viewController;

static AppDelegate* appInstance = nil;

+ (AppDelegate *)instance {
    if( !appInstance ){
//        appInstance = [[AppDelegate alloc] init];
        appInstance = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    }
    return appInstance;
}

- (NSString *)getTelno
{
    return [NSString stringWithFormat:@"%s", TELNO];
}

- (NSString *)getPassword
{
    return [NSString stringWithFormat:@"%s", PASSWORD];
}


- (void)setTelno:(NSString*)telno
{
    char* s = (char*)[telno UTF8String];
    TELNO = (char*)[telno UTF8String];
}

- (void)setPassword:(NSString*)password
{
    PASSWORD = (char*)[password UTF8String];
}

- (id)init
{
    /** If you need to do any extra app-specific initialization, you can do it here
     *  -jm
     **/
    NSHTTPCookieStorage* cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];

    [cookieStorage setCookieAcceptPolicy:NSHTTPCookieAcceptPolicyAlways];

    int cacheSizeMemory = 8 * 1024 * 1024; // 8MB
    int cacheSizeDisk = 32 * 1024 * 1024; // 32MB
#if __has_feature(objc_arc)
        NSURLCache* sharedCache = [[NSURLCache alloc] initWithMemoryCapacity:cacheSizeMemory diskCapacity:cacheSizeDisk diskPath:@"nsurlcache"];
#else
        NSURLCache* sharedCache = [[[NSURLCache alloc] initWithMemoryCapacity:cacheSizeMemory diskCapacity:cacheSizeDisk diskPath:@"nsurlcache"] autorelease];
#endif
    [NSURLCache setSharedURLCache:sharedCache];

    self = [super init];
    if(self != nil) {
        self->startedInBackground = FALSE;
    }
    return self;
}

#pragma mark UIApplicationDelegate implementation

/**
 * This is main kick off after the app inits, the views and Settings are setup here. (preferred - iOS4 and up)
 */
- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    CGRect screenBounds = [[UIScreen mainScreen] bounds];

#if __has_feature(objc_arc)
        self.window = [[UIWindow alloc] initWithFrame:screenBounds];
#else
        self.window = [[[UIWindow alloc] initWithFrame:screenBounds] autorelease];
#endif
    self.window.autoresizesSubviews = YES;

#if __has_feature(objc_arc)
        self.viewController = [[MainViewController alloc] init];
#else
        self.viewController = [[[MainViewController alloc] init] autorelease];
#endif

    // Set your app's start page by setting the <content src='foo.html' /> tag in config.xml.
    // If necessary, uncomment the line below to override it.
    // self.viewController.startPage = @"index.html";

    // NOTE: To customize the view's frame size (which defaults to full screen), override
    // [self.viewController viewWillAppear:] in your view controller.

    self.window.rootViewController = self.viewController;
    [self.window makeKeyAndVisible];

    
    
    UIApplication* app= [UIApplication sharedApplication];
    UIApplicationState state = app.applicationState;
    
    if( [app respondsToSelector:@selector(registerUserNotificationSettings:)] ){
        /* iOS8 notifications can be actioned! Awesome: */
        UIUserNotificationType notifTypes = UIUserNotificationTypeBadge|UIUserNotificationTypeSound|UIUserNotificationTypeAlert;
        
        NSSet* categories = [NSSet setWithObjects:[self getCallNotificationCategory], [self getMessageNotificationCategory], nil];
        UIUserNotificationSettings* userSettings = [UIUserNotificationSettings settingsForTypes:notifTypes categories:categories];
        [app registerUserNotificationSettings:userSettings];
        [app registerForRemoteNotifications];
    } else {
        NSUInteger notifTypes = UIRemoteNotificationTypeAlert|UIRemoteNotificationTypeSound|UIRemoteNotificationTypeBadge|UIRemoteNotificationTypeNewsstandContentAvailability;
        [app registerForRemoteNotificationTypes:notifTypes];
    }
    
    LinphoneManager* instance = [LinphoneManager instance];
    BOOL background_mode = [instance lpConfigBoolForKey:@"backgroundmode_preference"];
    BOOL start_at_boot   = [instance lpConfigBoolForKey:@"start_at_boot_preference"];
    
    
    if (state == UIApplicationStateBackground)
    {
        // we've been woken up directly to background;
        if( !start_at_boot || !background_mode ) {
            // autoboot disabled or no background, and no push: do nothing and wait for a real launch
            /*output a log with NSLog, because the ortp logging system isn't activated yet at this time*/
            NSLog(@"Linphone launch doing nothing because start_at_boot or background_mode are not activated.", NULL);
            return YES;
        }
        
    }
    bgStartId = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:^{
        [LinphoneLogger log:LinphoneLoggerWarning format:@"Background task for application launching expired."];
        [[UIApplication sharedApplication] endBackgroundTask:bgStartId];
    }];
    
    [[LinphoneManager instance]	startLibLinphone];
    // initialize UI
    [self.window makeKeyAndVisible];
//    [RootViewManager setupWithPortrait:(PhoneMainView*)self.window.rootViewController];
//    [[PhoneMainView instance] startUp];
//    [[PhoneMainView instance] updateStatusBar:nil];
//    [[PhoneMainView instance] changeToCallLogView];
    
    
    
    NSDictionary *remoteNotif =[launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
    if (remoteNotif){
        [LinphoneLogger log:LinphoneLoggerLog format:@"PushNotification from launch received."];
        [self processRemoteNotification:remoteNotif];
    }
    if (bgStartId!=UIBackgroundTaskInvalid) [[UIApplication sharedApplication] endBackgroundTask:bgStartId];
    
    
    [[AppDelegate instance] setPassword:@""];
    [[AppDelegate instance] setTelno:@""];
    timerAppBG = [NSTimer scheduledTimerWithTimeInterval:60.0f target:self selector:@selector(applicationWillResign) userInfo:nil repeats:YES];
    
    [self enableCodecs:linphone_core_get_audio_codecs([LinphoneManager getLc])];
    [self enableCodecs:linphone_core_get_video_codecs([LinphoneManager getLc])];
    return YES;
}

- (void)enableCodecs: (const MSList *)codecs {
    LinphoneCore *lc=[LinphoneManager getLc];
    const MSList *elem=codecs;
    for(;elem!=NULL;elem=elem->next){
        PayloadType *pt=(PayloadType*)elem->data;
        NSString *pref=[LinphoneManager getPreferenceForCodec:pt->mime_type withRate:pt->clock_rate];
        if (pref){
            linphone_core_enable_payload_type(lc,pt,YES);
        }else{
            [LinphoneLogger logc:LinphoneLoggerWarning format:"Codec %s/%i supported by core is not shown in iOS app config view.",
             pt->mime_type,pt->clock_rate];
        }
    }
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    if ((alertView.tag == 1) && (buttonIndex==1))  {
        [self showWaitingIndicator];
        [self attemptRemoteConfiguration];
    }
}

- (void) showWaitingIndicator {
    _waitingIndicator = [[UIAlertView alloc] initWithTitle:NSLocalizedString(@"Fetching remote configuration...",nil) message:@"" delegate:self cancelButtonTitle:nil otherButtonTitles:nil];
    UIActivityIndicatorView *progress= [[UIActivityIndicatorView alloc] initWithFrame:CGRectMake(125, 60, 30, 30)];
    progress.activityIndicatorViewStyle = UIActivityIndicatorViewStyleWhiteLarge;
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 7.0){
        [_waitingIndicator setValue:progress forKey:@"accessoryView"];
        [progress setColor:[UIColor blackColor]];
    } else {
        [_waitingIndicator addSubview:progress];
    }
    [progress startAnimating];
    [progress release];
    [_waitingIndicator show];
    
}

- (void)attemptRemoteConfiguration {
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(ConfigurationStateUpdateEvent:)
                                                 name:kLinphoneConfiguringStateUpdate
                                               object:nil];
    linphone_core_set_provisioning_uri([LinphoneManager getLc] , [configURL UTF8String]);
    [[LinphoneManager instance] destroyLibLinphone];
    [[LinphoneManager instance] startLibLinphone];
    
}

- (void) registerLoop {
    NSString *sipUsername = [[AppDelegate instance] getTelno];
    NSString *password = [[AppDelegate instance] getPassword];
//    NSString *sipUsername = @"123456";
//    NSString *password = @"1234566";
    if (sipUsername != nil && ![sipUsername isEqualToString:@""] ) {
        NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"http://portal.netcastdigital.net/getInfo.php?cmd=_app_state&telno=%@&password=%@", sipUsername, password]];
        NSLog(@"URL : %@",url);
        NSData *data = [[NSData alloc] initWithContentsOfURL:url];
        NSString *domain = GENERIC_DOMAIN;
        NSString *registerStatus = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        [LinPhonePlugin doRegisterSip:sipUsername password:password domain:domain registerStatus:registerStatus];
    }

}

- (UIUserNotificationCategory*)getMessageNotificationCategory {
    
    UIMutableUserNotificationAction* reply = [[[UIMutableUserNotificationAction alloc] init] autorelease];
    reply.identifier = @"reply";
    reply.title = NSLocalizedString(@"Reply", nil);
    reply.activationMode = UIUserNotificationActivationModeForeground;
    reply.destructive = NO;
    reply.authenticationRequired = YES;
    
    UIMutableUserNotificationAction* mark_read = [[[UIMutableUserNotificationAction alloc] init] autorelease];
    mark_read.identifier = @"mark_read";
    mark_read.title = NSLocalizedString(@"Mark Read", nil);
    mark_read.activationMode = UIUserNotificationActivationModeBackground;
    mark_read.destructive = NO;
    mark_read.authenticationRequired = NO;
    
    NSArray* localRingActions = @[mark_read, reply];
    
    UIMutableUserNotificationCategory* localRingNotifAction = [[[UIMutableUserNotificationCategory alloc] init] autorelease];
    localRingNotifAction.identifier = @"incoming_msg";
    [localRingNotifAction setActions:localRingActions forContext:UIUserNotificationActionContextDefault];
    [localRingNotifAction setActions:localRingActions forContext:UIUserNotificationActionContextMinimal];
    
    return localRingNotifAction;
}


- (UIUserNotificationCategory*)getCallNotificationCategory {
    UIMutableUserNotificationAction* answer = [[[UIMutableUserNotificationAction alloc] init] autorelease];
    answer.identifier = @"answer";
    answer.title = NSLocalizedString(@"Answer", nil);
    answer.activationMode = UIUserNotificationActivationModeForeground;
    answer.destructive = NO;
    answer.authenticationRequired = YES;
    
    UIMutableUserNotificationAction* decline = [[[UIMutableUserNotificationAction alloc] init] autorelease];
    decline.identifier = @"decline";
    decline.title = NSLocalizedString(@"Decline", nil);
    decline.activationMode = UIUserNotificationActivationModeBackground;
    decline.destructive = YES;
    decline.authenticationRequired = NO;
    
    
    NSArray* localRingActions = @[decline, answer];
    
    UIMutableUserNotificationCategory* localRingNotifAction = [[[UIMutableUserNotificationCategory alloc] init] autorelease];
    localRingNotifAction.identifier = @"incoming_call";
    [localRingNotifAction setActions:localRingActions forContext:UIUserNotificationActionContextDefault];
    [localRingNotifAction setActions:localRingActions forContext:UIUserNotificationActionContextMinimal];
    
    return localRingNotifAction;
}

- (void)processRemoteNotification:(NSDictionary*)userInfo{
    if ([LinphoneManager instance].pushNotificationToken==Nil){
        [LinphoneLogger log:LinphoneLoggerLog format:@"Ignoring push notification we did not subscribed."];
        return;
    }
    
    NSDictionary *aps = [userInfo objectForKey:@"aps"];
    
    if(aps != nil) {
        NSDictionary *alert = [aps objectForKey:@"alert"];
        if(alert != nil) {
            NSString *loc_key = [alert objectForKey:@"loc-key"];
            /*if we receive a remote notification, it is probably because our TCP background socket was no more working.
             As a result, break it and refresh registers in order to make sure to receive incoming INVITE or MESSAGE*/
            LinphoneCore *lc = [LinphoneManager getLc];
            if (linphone_core_get_calls(lc)==NULL){ //if there are calls, obviously our TCP socket shall be working
                linphone_core_set_network_reachable(lc, FALSE);
                [LinphoneManager instance].connectivity=none; /*force connectivity to be discovered again*/
                [[LinphoneManager instance] refreshRegisters];
                if(loc_key != nil) {
                    if([loc_key isEqualToString:@"IM_MSG"]) {
                        [[PhoneMainView instance] addInhibitedEvent:kLinphoneTextReceived];
                        [[PhoneMainView instance] changeCurrentView:[ChatViewController compositeViewDescription]];
                    } else if([loc_key isEqualToString:@"IC_MSG"]) {
                        //it's a call
                        NSString *callid=[userInfo objectForKey:@"call-id"];
                        if (callid)
                            [[LinphoneManager instance] enableAutoAnswerForCallId:callid];
                        else
                            [LinphoneLogger log:LinphoneLoggerError format:@"PushNotification: does not have call-id yet, fix it !"];
                        
                        [self fixRing];
                    }
                }
            }
        }
    }
}

- (void) applicationWillResign
{
    [self registerLoop];
    [self myVcInitMethod];
}

- (void) myVcInitMethod
{
    [[NSNotificationCenter defaultCenter]
     addObserver:self
     selector:@selector(applicationWillResign)
     name:UIApplicationWillResignActiveNotification
     object:NULL];
}

// this happens while we are running ( in the background, or from within our own app )
// only valid if Netcastdigital-Info.plist specifies a protocol to handle
- (BOOL)application:(UIApplication*)application openURL:(NSURL*)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation
{
    if (!url) {
        return NO;
    }

    // calls into javascript global function 'handleOpenURL'
    NSString* jsString = [NSString stringWithFormat:@"handleOpenURL(\"%@\");", url];
    CDVViewController* viewCont = (CDVViewController*)self.viewController;
    [viewCont.webView stringByEvaluatingJavaScriptFromString:jsString];

    // all plugins will get the notification, and their handlers will be called
    [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPluginHandleOpenURLNotification object:url]];

    return YES;
}

// repost all remote and local notification using the default NSNotificationCenter so multiple plugins may respond
- (void)            application:(UIApplication*)application
    didReceiveLocalNotification:(UILocalNotification*)notification
{
    // re-post ( broadcast )
    [[NSNotificationCenter defaultCenter] postNotificationName:CDVLocalNotification object:notification];
}

- (void)                                application:(UIApplication *)application
   didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
    // re-post ( broadcast )
    NSString* token = [[[[deviceToken description]
                         stringByReplacingOccurrencesOfString: @"<" withString: @""]
                        stringByReplacingOccurrencesOfString: @">" withString: @""]
                       stringByReplacingOccurrencesOfString: @" " withString: @""];

    [[NSNotificationCenter defaultCenter] postNotificationName:CDVRemoteNotification object:token];
}

- (void)                                 application:(UIApplication *)application
    didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
    // re-post ( broadcast )
    [[NSNotificationCenter defaultCenter] postNotificationName:CDVRemoteNotificationError object:error];
}

- (NSUInteger)application:(UIApplication*)application supportedInterfaceOrientationsForWindow:(UIWindow*)window
{
    // iPhone doesn't support upside down by default, while the iPad does.  Override to allow all orientations always, and let the root view controller decide what's allowed (the supported orientations mask gets intersected).
    NSUInteger supportedInterfaceOrientations = (1 << UIInterfaceOrientationPortrait) | (1 << UIInterfaceOrientationLandscapeLeft) | (1 << UIInterfaceOrientationLandscapeRight) | (1 << UIInterfaceOrientationPortraitUpsideDown);

    return supportedInterfaceOrientations;
}

- (void)applicationDidReceiveMemoryWarning:(UIApplication*)application
{
    [[NSURLCache sharedURLCache] removeAllCachedResponses];
}


- (void)applicationDidEnterBackground:(UIApplication *)application{
    Linphone_log(@"%@", NSStringFromSelector(_cmd));
    [[LinphoneManager instance] enterBackgroundMode];
}

- (void)applicationWillResignActive:(UIApplication *)application {
    
    Linphone_log(@"%@", NSStringFromSelector(_cmd));
    LinphoneCore* lc = [LinphoneManager getLc];
    LinphoneCall* call = linphone_core_get_current_call(lc);
    
    if (call){
        /* save call context */
        LinphoneManager* instance = [LinphoneManager instance];
        instance->currentCallContextBeforeGoingBackground.call = call;
        instance->currentCallContextBeforeGoingBackground.cameraIsEnabled = linphone_call_camera_enabled(call);
        
        const LinphoneCallParams* params = linphone_call_get_current_params(call);
        if (linphone_call_params_video_enabled(params)) {
            linphone_call_enable_camera(call, false);
        }
    }
    
    if (![[LinphoneManager instance] resignActive]) {
        
    }
    
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    Linphone_log(@"%@", NSStringFromSelector(_cmd));
    
    if( startedInBackground ){
        startedInBackground = FALSE;
        [[PhoneMainView instance] startUp];
        [[PhoneMainView instance] updateStatusBar:nil];
    }
    
    LinphoneManager* instance = [LinphoneManager instance];
    
    [instance becomeActive];
    
    LinphoneCore* lc = [LinphoneManager getLc];
    LinphoneCall* call = linphone_core_get_current_call(lc);
    
    if (call){
        if (call == instance->currentCallContextBeforeGoingBackground.call) {
            const LinphoneCallParams* params = linphone_call_get_current_params(call);
            if (linphone_call_params_video_enabled(params)) {
                linphone_call_enable_camera(
                                            call,
                                            instance->currentCallContextBeforeGoingBackground.cameraIsEnabled);
            }
            instance->currentCallContextBeforeGoingBackground.call = 0;
        } else if ( linphone_call_get_state(call) == LinphoneCallIncomingReceived ) {
            [[PhoneMainView  instance ] displayIncomingCall:call];
            // in this case, the ringing sound comes from the notification.
            // To stop it we have to do the iOS7 ring fix...
            [self fixRing];
        }
    }
}

- (void)fixRing{
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 7) {
        // iOS7 fix for notification sound not stopping.
        // see http://stackoverflow.com/questions/19124882/stopping-ios-7-remote-notification-sound
        [[UIApplication sharedApplication] setApplicationIconBadgeNumber: 1];
        [[UIApplication sharedApplication] setApplicationIconBadgeNumber: 0];
    }
}

@end
