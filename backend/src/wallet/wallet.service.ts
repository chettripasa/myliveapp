import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getWalletByUserId(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: { transactions: true },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async credit(userId: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.update({
        where: { userId },
        data: { balance: { increment: amount } },
      });
      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          userId,
          amount,
          type: 'credit',
        },
      });
      return wallet;
    });
  }

  async debit(userId: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet || wallet.balance < amount) throw new BadRequestException('Insufficient balance');
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: { balance: { decrement: amount } },
      });
      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          userId,
          amount: -amount,
          type: 'debit',
        },
      });
      return updatedWallet;
    });
  }

  async getTransactionHistory(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return this.prisma.transaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
    });
  }
}
