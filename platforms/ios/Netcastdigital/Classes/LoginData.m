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
    return TELNO;
}

- (NSString *)passwordStr
{
    return PASSWORD;
}


- (void)setTelno:(NSString*)telno
{
    TELNO = telno;
}

- (void)setPassword:(NSString*)password
{
    PASSWORD = password;
}

@end