import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name?: string | null;
            image?: string | null;
            role?: string;
            plan?: string;
            walletBalance?: number;
        };
    }

    interface User {
        id: string;
        email: string;
        name?: string | null;
        role?: string;
        plan?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role?: string;
        plan?: string;
    }
}
