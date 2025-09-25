import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    login(user: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    register(email: string, password: string, name?: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}
