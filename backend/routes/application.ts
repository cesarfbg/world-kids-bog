import { Router, Request, Response } from 'express';
import { Application } from '../models/application';
import { verifyToken } from '../middlewares/verifyToken';

const applicationRoutes = Router();

// Get applications endpoint
applicationRoutes.get('/get', async ( req: Request, res: Response ) => {

    try {
        return res.json({
            ok: true,
            count: await Application.countDocuments(),
            users: await Application.find()
                .sort({name: 1})
        });
    } catch ( err ) {
        return res.json({
            ok: false,
            err
        });
    }

});

// Create application endpoint
applicationRoutes.post('/create', [verifyToken], async ( req: Request, res: Response ) => {

    const body = req.body;

    const application = {
        name: body.name,
        icon: body.icon,
        status: body.status,
        bgImage: body.bgImage
    };

    try {

        const applicationDB = await Application.create(application);

        return res.json({
            ok: true,
            newApplication: applicationDB
        });

    } catch (err) {

        res.json({
            ok: false,
            err
        });

    }

});

// Update application endpoint
applicationRoutes.patch('/update', [verifyToken], async ( req: Request, res: Response ) => {

    try {

        const oldApplication = await Application.findById(req.body.id || '');

        if (!oldApplication) {
            return res.json({
                ok: false,
                message: 'The application id provided does not exist.'
            });
        }

        const modifiedApplication = {
            name: req.body.name || oldApplication.name,
            icon: req.body.icon || oldApplication.icon,
            status: req.body.status || oldApplication.status,
            bgImage: req.body.bgImage || oldApplication.bgImage
        };

        const applicationDB = await Application.findByIdAndUpdate(req.body.id, modifiedApplication, { new: true, runValidators: true });

        return res.json({
            ok: true,
            updatedApplication: applicationDB
        });

    } catch (err) {

        return res.json({
            ok: false,
            message: 'An error occurred while trying to update the DB.',
            err
        });

    }

});

export default applicationRoutes;
