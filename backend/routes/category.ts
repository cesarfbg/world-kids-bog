import { Category } from '../models/category';
import { Router, Request, Response } from 'express';
import { verifyToken } from '../middlewares/verifyToken';

const categoryRoutes = Router();

// Get categories endpoint
categoryRoutes.get('/get', async ( req: Request, res: Response ) => {

    try {
        return res.json({
            ok: true,
            count: await Category.countDocuments(),
            categories: await Category.find()
                .sort({name: 1})
        });
    } catch ( err ) {
        return res.json({
            ok: false,
            err
        });
    }

});

// Create category endpoint
categoryRoutes.post('/create', [verifyToken], async ( req: Request, res: Response ) => {

    const body = req.body;

    const category = {
        name: body.name,
        status: body.status,
    };

    try {

        const categoryDB = await Category.create(category);

        return res.json({
            ok: true,
            newCategory: categoryDB
        });

    } catch (err) {

        res.json({
            ok: false,
            err
        });

    }

});

// Update category endpoint
categoryRoutes.patch('/update', [verifyToken], async ( req: Request, res: Response ) => {

    try {

        const oldCategory = await Category.findById(req.body.id || '');

        if (!oldCategory) {
            return res.json({
                ok: false,
                message: 'The category id provided does not exist.'
            });
        }

        const modifiedCategory = {
            name: req.body.name || oldCategory.name,
            status: req.body.status || oldCategory.status
        }

        const categoryDB = await Category.findByIdAndUpdate(req.body.id || '', modifiedCategory, { new: true, runValidators: true });

        return res.json({
            ok: true,
            updatedCategory: categoryDB
        });

    } catch (err) {

        return res.json({
            ok: false,
            message: 'An error occurred while trying to update the DB.',
            err
        });

    }

});

export default categoryRoutes;