import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Env } from "src/env";
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
       useFactory(config: ConfigService<Env, true>) {
        const privateKey = config.get('JWT_PRIVATE_KEY', {infer: true});
        const publicKey = config.get('JWT_PUBLIC_KEY', {infer: true});

        return {
          signOptions: { algorithm: 'RS256'},
            privateKey: Buffer.from(privateKey, 'base64').toString('utf-8'),
            publicKey: Buffer.from(publicKey, 'base64').toString('utf-8'),
        }
       }
    }),
  ],
})
export class AuthModule {}