//
//  LoginData.h
//  Yarn
//
//  Created by Macbook air on 11/24/14.
//
//

#import <Foundation/Foundation.h>

@interface LoginData : NSObject  {
    //NSString *TELNO;
}

@property (nonatomic, assign) NSString *TELNO;
@property (nonatomic, assign) NSString *PASSWORD;

- (NSString *)telnoStr;
- (NSString *)passwordStr;
- (void)setTelno:(NSString*)telno;
- (void)setPassword:(NSString*)password;

@end
