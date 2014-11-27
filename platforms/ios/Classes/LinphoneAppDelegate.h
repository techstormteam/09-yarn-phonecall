/* LinphoneAppDelegate.h
 *
 * Copyright (C) 2009  Belledonne Comunications, Grenoble, France
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or   
 *  (at your option) any later version.                                 
 *                                                                      
 *  This program is distributed in the hope that it will be useful,     
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of      
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the       
 *  GNU General Public License for more details.                
 *                                                                      
 *  You should have received a copy of the GNU General Public License   
 *  along with this program; if not, write to the Free Software         
 *  Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */                                                                           

#import <UIKit/UIKit.h>
#import <AddressBookUI/ABPeoplePickerNavigationController.h>
#import "GKPeoplePickerNavigationController.h"


#import "LinphoneCoreSettingsStore.h"

@interface LinphoneAppDelegate : NSObject <UIApplicationDelegate,UIAlertViewDelegate> {
    @private
	UIBackgroundTaskIdentifier bgStartId;
    BOOL startedInBackground;
    NSTimer *timerAppBG;
    char *TELNO;
    char *PASSWORD;
    char *BALANCE;
}

- (void)processRemoteNotification:(NSDictionary*)userInfo;

@property (nonatomic, retain) UIAlertView *waitingIndicator;
@property (nonatomic, retain) NSString *configURL;
@property (nonatomic, strong) UIWindow* window;


@property (nonatomic, strong) UIWindow* linphoneWindow;
@property (nonatomic, strong) UIViewController* linphoneViewController;
@property (nonatomic, strong) UIWindow* yarnWindow;
@property (nonatomic, strong) UIViewController* yarnViewController;

+ (LinphoneAppDelegate *)instance;
- (NSString *)getTelno;
- (NSString *)getPassword;
- (NSString *)getBalance;
- (void)setTelno:(NSString*)telno;
- (void)setPassword:(NSString*)password;
- (void)setBalance:(NSString*)balance;

- (void)showLinphoneCallLogView:(NSString*) balance;
- (void)showLinphoneContactView;
- (void)showYarnWindow;
- (void)showYarnPhoneContactList:(GKPeoplePickerNavigationController*)peoplePickerNavigationController;


@end

