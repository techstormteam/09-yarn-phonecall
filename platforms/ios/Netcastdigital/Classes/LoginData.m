//
//  LoginData.m
//  Yarn
//
//  Created by Macbook air on 11/24/14.
//
//

#import <Foundation/Foundation.h>
#import "LoginData.h"


@implementation LoginData

- (NSString *)telnoStr
{
    return _TELNO;
}

- (NSString *)passwordStr
{
    return _PASSWORD;
}


- (void)setTelno:(NSString*)telno
{
    _TELNO = telno;
}

- (void)setPassword:(NSString*)password
{
    _PASSWORD = password;
}

@end