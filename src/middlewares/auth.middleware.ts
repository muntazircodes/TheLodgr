import { createClient } from '@supabase/supabase-js';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const url = process.env.SUPABASE_URL!;
    const anon = process.env.SUPABASE_ANON_KEY!;

    const authHeader = (req.headers['authorization'] || req.headers['Authorization']) as string | undefined;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length).trim() : undefined;

    if (!token) return res.status(401).json({ error: 'Missing Authorization Bearer token' });

    const supabase = createClient(url, anon, {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { persistSession: false, autoRefreshToken: false },
    });

    const authService = new AuthService();
    try {
        const user = await authService.verifyToken(token);
        req.supabase = supabase;
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
