import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Benh = new Schema({
    ten: {
        type: String,
        required: true,
    },
    trieuchungchitiet: {
        type: String,
        required: true,
    },
    trieuchungnhandang: {
        la: {
            type: String,
        },
        than: {
            type: String,
        },
        re: {
            type: String,
        },
    },
    anh: {
        type: String,
        default:
            'https://res.cloudinary.com/ak-tracuusaubenh/image/upload/v1666934115/ak-tracuusaubenh/depositphotos_247872612-stock-illustration-no-image-available-icon-vector_gojmbi.webp',
    },
    LoaiCay: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'LoaiCay',
    },
});

const PestModel = mongoose.model('Benh', Benh);
export default PestModel;
