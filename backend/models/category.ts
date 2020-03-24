import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface ICategory extends Document {
    name: string,
    status: boolean
}

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

categorySchema.methods.toJSON = function() {
    let model = this;
    let modelObject = model.toObject();
    delete modelObject.__v;
    return modelObject;
};

categorySchema.plugin(uniqueValidator, { message: 'Ya existe una categoría con el nombre <b>{VALUE}</b>' });

export const Category = model<ICategory>('Category', categorySchema);