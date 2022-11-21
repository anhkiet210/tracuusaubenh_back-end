import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const tempBenh = new Schema({
    idBenh: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Benh',
    },
    ten: {
        type: String,
        required: true,
    },
});

const ThuocTri = new Schema({
    tenthuoc: {
        type: String,
        required: true,
    },
    congdung: {
        type: String,
        required: true,
    },
    anh: {
        type: String,
        default:
            'https://res.cloudinary.com/ak-tracuusaubenh/image/upload/v1666934115/ak-tracuusaubenh/depositphotos_247872612-stock-illustration-no-image-available-icon-vector_gojmbi.webp',
    },
    Benhs: {
        type: [tempBenh],
    },
});

const PesticideModel = mongoose.model('ThuocTri', ThuocTri);
export default PesticideModel;
