import { PrismaService } from '../prisma.service';
export declare class WalletController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMyWallet(req: any): Promise<({
        transactions: {
            id: string;
            createdAt: Date;
            userId: string;
            walletId: string;
            amount: number;
            type: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        balance: number;
    }) | null>;
    getWallet(id: string): Promise<({
        transactions: {
            id: string;
            createdAt: Date;
            userId: string;
            walletId: string;
            amount: number;
            type: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        balance: number;
    }) | null>;
}
