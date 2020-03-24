import { Response, NextFunction } from 'express';

export const verifyAdminRole = async ( req: any, res: Response, next: NextFunction ) => {

    if (req.user.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.status(401).json({
            ok: false,
            message: 'No eres administrador, inicia sesión nuevamente.'
        });
    }

}