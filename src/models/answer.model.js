import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const CauTraLoi = new Schema({
    noidung: {
        type: String,
        required: true,
    },
    CauHoi: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'CauHoi',
    },
    thoigian: {
        type: Date,
    },
    NguoiDung: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'NguoiDung',
    },
});

const AnswerModel = mongoose.model('CauTraLoi', CauTraLoi);
export default AnswerModel;
