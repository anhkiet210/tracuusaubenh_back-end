import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const CauHoi = new Schema({
    noidung: {
        type: String,
        required: true,
    },
    NguoiDung: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'NguoiDung',
    },
    thoigian: {
        type: Date,
    },
    tieude: {
        type: String,
        required: true,
    },
});

const QuestionModel = mongoose.model('CauHoi', CauHoi);

export default QuestionModel;
