import AnswerModel from '../../../models/answer.model';
import UserModel from '../../../models/user.model';

const createAnwser = async (req, res, next) => {
    try {
        const { content, idQuestion, time } = req.body;
        const infoAnwser = {
            noidung: content,
            NguoiDung: req.user.id,
            CauHoi: idQuestion,
            thoigian: time,
        };

        const answer = await AnswerModel.create(infoAnwser);
        const user = await UserModel.findById(answer.NguoiDung, { hoten: 1, anhdaidien: 1 });
        return res.status(200).json({
            success: true,
            message: 'Thêm câu trả lời thành công.',
            data: { answer, user },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAnwserByIdQuestion = async (req, res, next) => {
    try {
        const answers = await AnswerModel.find({ CauHoi: req.params.id }).sort({ thoigian: 'desc' });
        let list = [];
        for (let i = 0; i < answers.length; i++) {
            const user = await UserModel.findById(answers[i].NguoiDung, { hoten: 1, anhdaidien: 1 });
            list.push({
                answer: answers[i],
                user,
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Thành công.',
            data: list,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { createAnwser, getAnwserByIdQuestion };
