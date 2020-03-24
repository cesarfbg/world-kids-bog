import { Partner } from '../models/partner';
import { Router, Request, Response } from 'express';
import { verifyToken } from '../middlewares/verifyToken';

const partnerRoutes = Router();

// Get partners endpoint
partnerRoutes.get('/get', async ( req: Request, res: Response ) => {

    try {
        return res.json({
            ok: true,
            count: await Partner.countDocuments(),
            partners: await Partner.find()
                .sort({name: 1})
        });
    } catch ( err ) {
        return res.json({
            ok: false,
            err
        });
    }

});

// Create partner endpoint
partnerRoutes.post('/create', [verifyToken], async ( req: Request, res: Response ) => {

    const body = req.body;

    const partner = {
        name: body.name,
        desc: body.desc,
        url: body.url,
        imageUrl: body.imageUrl,
        status: body.status
    };

    try {

        const partnerDB = await Partner.create(partner);

        return res.json({
            ok: true,
            newPartner: partnerDB
        });

    } catch (err) {

        res.json({
            ok: false,
            err
        });

    }

});

// Update partner endpoint
partnerRoutes.patch('/update', [verifyToken], async ( req: Request, res: Response ) => {

    try {

        const oldPartner = await Partner.findById(req.body.id || '');

        if (!oldPartner) {
            return res.json({
                ok: false,
                message: 'The partner id provided does not exist.'
            });
        }

        const modifiedPartner = {
            name: req.body.name || oldPartner.name,
            desc: req.body.desc || oldPartner.desc,
            url: req.body.url || oldPartner.url,
            imageUrl: req.body.imageUrl || oldPartner.imageUrl,
            status: req.body.status || oldPartner.status
        };

        const partnerDB = await Partner.findByIdAndUpdate(req.body.id || '', modifiedPartner, { new: true, runValidators: true });

        return res.json({
            ok: true,
            updatedPartner: partnerDB
        });

    } catch (err) {

        return res.json({
            ok: false,
            message: 'An error occurred while trying to update the DB.',
            err
        });

    }

});

export default partnerRoutes;
