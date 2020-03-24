import { Response, Request, NextFunction } from 'express';
import { User } from '../models/user';

export const verifyActiveUser = async ( req: Request, res: Response, next: NextFunction ) => {

    let userDB = await User.find({ email: req.body.email }).exec();
    if (userDB.length > 0) {
        if (userDB[0].status === true && userDB[0].email === req.body.email) {
            next();
        } else {
            return res.status(400).json({
                ok: false,
                message: 'Usuario inactivo.'
            });
        }
    } else {
        next();
    }

}