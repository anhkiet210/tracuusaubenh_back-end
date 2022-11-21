import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const LoaiCay = new Schema({
    tenloai: {
        type: String,
        required: true,
    },
    anh: {
        type: String,
        default:
            'https://res.cloudinary.com/ak-tracuusaubenh/image/upload/v1666934115/ak-tracuusaubenh/depositphotos_247872612-stock-illustration-no-image-available-icon-vector_gojmbi.webp',
    },
    mota: {
        type: String,
    },
});

const CropModel = mongoose.model('LoaiCay', LoaiCay);
export default CropModel;
