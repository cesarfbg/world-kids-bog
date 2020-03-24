import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface IPartner extends Document {
    name: string,
    desc: string,
    url: string,
    imageUrl: string,
    status: boolean
}

const partnerSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        unique: true
    },
    desc: {
        type: String,
        required: [true, 'Description is required.']
    },
    url: {
        type: String,
        required: [true, 'Partner URL is required.']
    },
    imageUrl: {
        type: String,
        required: [true, 'Logo/image URL is required.']
    },
    status: {
        type: Boolean,
        default: true
    }
});

partnerSchema.methods.toJSON = function() {
    let model = this;
    let modelObject = model.toObject();
    delete modelObject.__v;
    return modelObject;
};

partnerSchema.plugin(uniqueValidator, { message: 'Ya existe un socio con el nombre <b>{VALUE}</b>' });

export const Partner = model<IPartner>('Partner', partnerSchema);