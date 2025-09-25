
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}


  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyWallet(@Request() req: any) {
    return this.walletService.getWalletByUserId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('credit')
  async credit(@Request() req: any, @Body('amount') amount: number) {
    return this.walletService.credit(req.user.userId, amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post('debit')
  async debit(@Request() req: any, @Body('amount') amount: number) {
    return this.walletService.debit(req.user.userId, amount);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  async getTransactionHistory(@Request() req: any) {
    return this.walletService.getTransactionHistory(req.user.userId);
  }
}
