import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface IApplication extends Document {
    name: string,
    icon: string,
    status: boolean,
    bgImage: string
}

const applicationSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        unique: true
    },
    icon: {
        type: String,
        required: [true, 'Icon is required.']
    },
    status: {
        type: Boolean,
        default: true
    },
    bgImage: {
        type: String,
        required: [true, 'Backgroung Image URL is required.']
    }
});

applicationSchema.methods.toJSON = function() {
    let model = this;
    let modelObject = model.toObject();
    delete modelObject.__v;
    return modelObject;
};

applicationSchema.plugin(uniqueValidator, { message: 'Ya existe una aplicación con el nombre <b>{VALUE}</b>' });

export const Application = model<IApplication>('Application', applicationSchema);