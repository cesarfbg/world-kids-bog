import { Product } from '../models/product';
import { Router, Request, Response } from 'express';
import { verifyToken } from '../middlewares/verifyToken';

const productRoutes = Router();

// Get product endpoint
productRoutes.get('/get', async ( req: Request, res: Response ) => {

    try {
        return res.json({
            ok: true,
            count: await Product.countDocuments(),
            products: await Product.find()
                .populate('categories', 'name', 'Category')
                .populate('applications', 'name', 'Application')
                .populate('partner', 'name', 'Partner')
                .sort({name: -1})
        });
    } catch ( err ) {
        return res.json({
            ok: false,
            err
        });
    }

});

// Create product endpoint
productRoutes.post('/create', [verifyToken], async ( req: Request, res: Response ) => {

    const body = req.body;

    const product = {
        name: body.name,
        shortDesc: body.shortDesc,
        longDesc: body.longDesc,
        attributes: body.attributes,
        imageUrl: body.imageUrl,
        videoUrl: body.videoUrl,
        relevance: body.relevance,
        partner: body.partner,
        categories: body.categories,
        applications: body.applications,
        status: body.status
    };

    try {

        const productDB = await Product.create(product);

        return res.json({
            ok: true,
            newproduct: productDB
        });

    } catch (err) {

        res.json({
            ok: false,
            err
        });

    }

});

// Update product endpoint
productRoutes.patch('/update', [verifyToken], async ( req: Request, res: Response ) => {

    try {

        const oldProduct = await Product.findById(req.body.id || '');

        if (!oldProduct) {
            return res.json({
                ok: false,
                message: 'The product id provided does not exist.'
            });
        }

        const modifiedProduct = {
            name: req.body.name || oldProduct.name,
            shortDesc: req.body.shortDesc || oldProduct.shortDesc,
            longDesc: req.body.longDesc || oldProduct.longDesc,
            attributes: req.body.attributes || oldProduct.attributes,
            imageUrl: req.body.imageUrl || oldProduct.imageUrl,
            videoUrl: req.body.videoUrl || oldProduct.videoUrl,
            relevance: req.body.relevance || oldProduct.relevance,
            partner: req.body.partner || oldProduct.partner,
            categories: req.body.categories || oldProduct.categories,
            applications: req.body.applications || oldProduct.applications,
            status: req.body.status || oldProduct.status
        };

        const productDB = await Product.findByIdAndUpdate(req.body.id || '', modifiedProduct, { new: true, runValidators: true });

        return res.json({
            ok: true,
            updatedProduct: productDB
        });

    } catch (err) {

        return res.json({
            ok: false,
            message: 'An error occurred while trying to update the DB.',
            err
        });

    }

});

export default productRoutes;
