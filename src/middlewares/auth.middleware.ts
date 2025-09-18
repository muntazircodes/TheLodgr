import { NextFunction, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const url = process.env.SUPABASE_URL!;
    const anon = process.env.SUPABASE_ANON_KEY!;

    const authHeader = (req.headers['authorization'] || req.headers['Authorization']) as string | undefined;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length).trim() : undefined;

    if (!token) return res.status(401).json({ error: 'Missing Authorization Bearer token' });

    const supabase = createClient(url, anon, {
        global: {
            headers: { Authorization: `Bearer ${token}` },
        },
        auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase.auth.getUser(token); //[3]
    if (error || !data.user) return res.status(401).json({ error: 'Invalid or expired token' });

    (req as any).supabase = supabase;
    (req as any).user = data.user;
    next();
};
