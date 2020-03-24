import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface IProduct extends Document {
    name: string,
    shortDesc: string,
    longDesc: string,
    attributes: string[],
    imageUrl: string,
    videoUrl: string,
    relevance: number,
    partner: string,
    categories: string[],
    applications: string[],
    status: boolean
}

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        unique: true
    },
    shortDesc: {
        type: String
    },
    longDesc: {
        type: String
    },
    attributes: {
        type: [String]
    },
    imageUrl: {
        type: String,
        required: [true, 'ImageUrl is required.']
    },
    videoUrl: {
        type: String
    },
    relevance: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
    },
    status: {
        type: Boolean,
        default: true
    },
    partner: {
        type: Schema.Types.ObjectId,
        ref: 'Partner',
        required: [true, 'Product partner is required.']
    },
    categories: {
        type: [Schema.Types.ObjectId],
        ref: 'Category',
        validate: {
            validator: ( prop:any ) => prop == null || prop.length > 0,
            message: 'At least 1 product category is required.'
        }
    },
    applications: {
        type: [Schema.Types.ObjectId],
        ref: 'Application',
        validate: {
            validator: ( prop:any ) => prop == null || prop.length > 0,
            message: 'At least 1 product application is required.'
        }
    }
});

productSchema.methods.toJSON = function() {
    let model = this;
    let modelObject = model.toObject();
    delete modelObject.__v;
    return modelObject;
};

productSchema.plugin(uniqueValidator, { message: 'Ya existe un producto con el nombre <b>{VALUE}</b>' });

export const Product = model<IProduct>('Product', productSchema);