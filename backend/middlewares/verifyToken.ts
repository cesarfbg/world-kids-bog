import { Response, NextFunction } from 'express';
import Token from '../classes/token';
import { User } from '../models/user';

export const verifyToken = async ( req: any, res: Response, next: NextFunction ) => {

    const userToken = req.get('Authorization') || '';

    try {
        const jwtData: any = Token.verifyToken(userToken);
        const userDB = await User.findById(jwtData.user.id).exec();
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: 'La sesióna actual es inválida, inicie sesión nuevamente.'
            });
        }
        if (jwtData.user.status) {
            req.user = jwtData.user;
            next();
        } else {
            return res.status(400).json({
                ok: false,
                message: 'Usuario inactivo.'
            })
        }
    } catch ( err ) {
        return res.status(401).json({
            ok: false,
            message: 'Sesión caducada, inicie sesión nuevamente.'
        });
    }

};
