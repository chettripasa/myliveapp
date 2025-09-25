import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [AuthModule, UserModule, WalletModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
