import { Router, Request, Response } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verifyToken } from '../middlewares/verifyToken';
import { verifyAdminRole } from '../middlewares/verifyAdminRole';
import { verifyActiveUser } from '../middlewares/verifyActiveUser';

const userRoutes = Router();

// Login endpoint
userRoutes.post('/login', [verifyActiveUser], async ( req: Request, res: Response ) => {

    const body = req.body || '';

    try {
        const userDB = await User.findOne( { email: body.email } ).exec();
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario y/o contraseña inválido.'
            });
        }
        if (bcrypt.compareSync( body.password || '', userDB.password ) ) {
            return res.json({
                ok: true,
                token: Token.getJwtToken({
                    id: userDB._id,
                    name: userDB.name,
                    email: userDB.email,
                    role: userDB.role,
                    status: userDB.status,
                    img: userDB.img
                }),
                user: userDB
            });
        } else {
            return res.status(400).json({
                ok: false,
                message: 'Usuario y/o contraseña inválido.'
            });
        }
    } catch ( err ) {
        return res.status(400).json({
            ok: false,
            message: 'Algo malo esta pasando aquí.',
            err
        });
    }

});

// Token renew endpoint
userRoutes.get('/renewSession', [verifyToken], async ( req: any, res: Response  ) => {

    const userDB = await User.findById(req.user.id).exec();

    if (userDB) {
        return res.json({
            ok: true,
            token: Token.getJwtToken({
                id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                role: userDB.role,
                status: userDB.status,
                img: userDB.img
            }),
            user: userDB
        });
    } else {
        return res.status(400).json({
            ok: false,
            message: 'Sesión inválida, inicie sesión nuevamente.'
        });
    }


});

// Get users endpoint
userRoutes.get('/get', [ verifyToken, verifyAdminRole ], async ( req: Request, res: Response ) => {

    try {
        return res.json({
            ok: true,
            count: await User.countDocuments(),
            users: await User.find()
                .sort({role: 1})
                .sort({name: 1})
        });
    } catch ( err ) {
        return res.json({
            ok: false,
            err
        });
    }

});

// Create user endpoint
userRoutes.post('/create', [verifyToken, verifyAdminRole], async ( req: Request, res: Response ) => {

    const body = req.body;

    const user = {
        name: body.name,
        email: body.email,
        role: body.role,
        img: body.img,
        password: ''
    };

    if ( body.password ) {
        user.password = bcrypt.hashSync( body.password || '', 10 );
    } else {
        user.password = undefined;
    }

    try {

        const userDB = await User.create( user );

        return res.json({
            ok: true,
            newUser: userDB
        });

    } catch ( err ) {


        return res.status(400).json({
            ok: false,
            err
        });

    }

});

// Update user endpoint
userRoutes.patch('/update', [verifyToken, verifyAdminRole], async ( req: any, res: Response ) => {

    try {

        const oldUser = await User.findById(req.body._id || '');

        if (!oldUser) {
            return res.status(400).json({
                ok: false,
                message: 'The user id provided does not exist.'
            });
        }


        const modifiedUser: any = {
            name: req.body.name || oldUser.name,
            email: req.body.email || oldUser.email,
            role: req.body.role || oldUser.role,
            img: req.body.img || oldUser.img
        };

        if (req.body.status !== undefined) {
            modifiedUser.status = req.body.status;
        }

        if (req.body.password !== undefined) {
            modifiedUser.password = bcrypt.hashSync( req.body.password, 10 )
        }

        const userDB = await User.findByIdAndUpdate(req.body._id || '', modifiedUser, { new: true, runValidators: true, context: 'query' });

        return res.json({
            ok: true,
            updatedUser: userDB,
            token: Token.getJwtToken({
                id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                role: userDB.role,
                status: userDB.status,
                img: userDB.img
            })
        });

    } catch (err) {

        return res.status(400).json({
            ok: false,
            message: 'An error occurred while trying to update the DB.',
            err
        });

    }

});

export default userRoutes;
