import { upload } from '../../../helper/cloudinary';
import PesticideModel from '../../../models/pesticide.model';

const folder = 'ak-tracuusaubenh/img-pesticides';
const createPesticide = async (req, res, next) => {
    try {
        const { pesticideName, uses, pests } = req.body;
        const { file } = req.files;

        if (!pesticideName) {
            return res.status(404).json({
                success: false,
                message: 'Hãy nhập tên thuốc!',
            });
        }

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'Hãy chọn ảnh cho thuốc!',
            });
        }

        if (!uses) {
            return res.status(404).json({
                success: false,
                message: 'Hãy nhập công dụng của thuốc!',
            });
        }

        const checkPesticide = await PesticideModel.findOne({ tenthuoc: pesticideName });

        if (checkPesticide) {
            return res.status(402).json({
                success: false,
                message: 'Loại thuốc này đã tồn tại trong cơ sở dữ liệu!',
            });
        }

        const linkImg = await upload(file.tempFilePath, folder);

        const infoPesticide = {
            tenthuoc: pesticideName,
            congdung: uses,
            anh: linkImg.url,
        };

        const pesticide = new PesticideModel({
            ...infoPesticide,
        });
        pests.forEach((item) => {
            pesticide.Benhs.push(JSON.parse(item));
        });
        pesticide.save();
        return res.status(200).json({
            success: true,
            message: 'Thêm thông tin thuốc trị thành công.',
            data: pesticide,
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
            data: pesticides,
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
            data: listPesticides,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updatePesticide = async (req, res, next) => {
    try {
        const { pesticideName, uses, pests } = req.body;
        const { file } = req.files;

        const checkPesticide = await PesticideModel.findById(req.params.id);
        if (!checkPesticide) {
            return res.status(404).json({
                success: false,
                message: 'Loại thuốc này không tồn tại!',
            });
        }

        let linkImg;
        if (!file) {
            linkImg = null;
        } else {
            linkImg = await upload(file.tempFilePath, folder);
        }

        checkPesticide.tenthuoc = pesticideName || checkPesticide.tenthuoc;
        checkPesticide.congdung = uses || checkPesticide.congdung;
        checkPesticide.anh = linkImg.url || checkPesticide.anh;
        checkPesticide.Benhs = pests || checkPesticide.Benhs;
        checkPesticide.save();
        return res.status(200).json({
            success: true,
            message: 'Thêm thông tin thuốc trị thành công.',
            data: checkPesticide,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { createPesticide, getAllPesticides, getPesticedeByIdPest, updatePesticide };
