import QuestionModel from '../../../models/question.model';
import UserModel from '../../../models/user.model';

const createQuestion = async (req, res, next) => {
    try {
        const { title, content, time } = req.body;
        const infoQuestion = {
            tieude: title,
            noidung: content,
            NguoiDung: req.user.id,
            thoigian: time,
        };

        const question = await QuestionModel.create(infoQuestion);
        const user = await UserModel.findById(question.NguoiDung, { hoten: 1, anhdaidien: 1 });
        return res.status(200).json({
            success: true,
            message: 'Thêm câu hỏi thành công.',
            data: { question, user },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllQuestions = async (req, res, next) => {
    try {
        const questions = await QuestionModel.find().sort({ thoigian: 'desc' });
        let list = [];
        // questions.forEach(async (question) => {
        //     const user = await UserModel.findById(question.NguoiDung, { hoten: 1, anhdaidien: 1 });
        //     list.push({
        //         question: question,
        //         user: user,
        //     });
        // });
        for (let i = 0; i < questions.length; i++) {
            const user = await UserModel.findById(questions[i].NguoiDung, { hoten: 1, anhdaidien: 1 });
            list.push({
                question: questions[i],
                user: user,
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

const getQuestionById = async (req, res, next) => {
    try {
        const question = await QuestionModel.findById(req.params.id);
        const user = await UserModel.findById(question.NguoiDung, { hoten: 1, anhdaidien: 1 });
        return res.status(200).json({
            success: true,
            message: 'Thành công.',
            data: { question, user },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { createQuestion, getAllQuestions, getQuestionById };
