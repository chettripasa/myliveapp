import { PrismaService } from '../prisma.service';
export declare class UserController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMe(req: any): Promise<({
        wallet: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            balance: number;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        name: string | null;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    getUser(id: string): Promise<({
        wallet: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            balance: number;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        name: string | null;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
}
