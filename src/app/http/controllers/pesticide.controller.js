import PesticideModel from '../../../models/pesticide.model';

const createPesticide = async (req, res, next) => {
    try {
        const { pesticideName, uses, pests } = req.body;
        const infoPesticide = {
            tenthuoc: pesticideName,
            congdung: uses,
            Benhs: pests,
        };

        const pesticide = await PesticideModel.create(infoPesticide);
        return res.status(200).json({
            success: true,
            message: 'Thêm thông tin thuốc trị thành công.',
            pesticide,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllPesticides = async (req, res, next) => {
    try {
        const pesticides = await PesticideModel.find();
        return res.status(200).json({
            success: true,
            message: 'Thành công.',
            pesticides,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getPesticedeByIdPest = async (req, res, next) => {
    try {
        const listPesticides = await PesticideModel.find({ idBenh: req.params.id });
        return res.status(200).json({
            success: true,
            message: 'Thành công.',
            listPesticides,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { createPesticide, getAllPesticides, getPesticedeByIdPest };
