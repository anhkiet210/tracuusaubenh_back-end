import PestModel from '../../../models/pest.model';
// import DecisionTree from '../../../helper/decisionTree';
import DecisionTree from 'decision-tree';
import CropModel from '../../../models/crop.model';
import cloudinary from 'cloudinary';
import { upload } from '../../../helper/cloudinary';

const folder = 'ak-tracuusaubenh/img-pests';

const createPest = async (req, res, next) => {
    try {
        const { pestName, detailedSymptoms, identificationSymptoms, idCrop } = req.body;
        const { file } = req.files;

        if (!pestName) {
            return res.status(404).json({
                success: false,
                message: 'Hãy nhập tên sâu bệnh!',
            });
        }

        const checkPest = await PestModel.find({ ten: pestName });

        if (checkPest) {
            return res.status(502).json({
                success: false,
                message: 'Bệnh đã tồn tại trong cơ sở dữ liệu!',
            });
        }

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'Hãy thêm ảnh cho loại bệnh này!',
            });
        }

        if (!identificationSymptoms) {
            return res.status(404).json({
                success: false,
                message: 'Hãy nhập đặc điểm nhận dạng cho sâu bệnh!',
            });
        }

        if (!idCrop) {
            return res.status(404).json({
                success: false,
                message: 'Hãy chọn loại cây cho bệnh này!',
            });
        }

        const linkImg = await upload(file.tempFilePath, folder);
        const info = {
            ten: pestName,
            trieuchungchitiet: detailedSymptoms,
            trieuchungnhandang: identificationSymptoms,
            LoaiCay: idCrop,
            anh: linkImg.url,
        };

        const pest = await PestModel.create(info);
        const crop = await CropModel.findById(pest.LoaiCay);
        return res.status(200).json({
            success: true,
            message: 'Thêm thông tin sâu bệnh thành công.',
            data: {
                pest: pest,
                crop: crop,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllPests = async (req, res, next) => {
    try {
        const pests = await PestModel.find();
        let list = [];
        for (let i = 0; i < pests.length; i++) {
            const LoaiCay = await CropModel.findById(pests[i].LoaiCay);
            list.push({
                pest: pests[i],
                crop: LoaiCay,
            });
        }
        res.status(200).json({
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

const getPestById = async (req, res, next) => {
    try {
        const pest = await PestModel.findById(req.params.id);
        let list;
        const LoaiCay = await CropModel.findById(pest.LoaiCay);
        list = {
            pest: pest,
            crop: LoaiCay,
        };
        res.status(200).json({
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

const detectPest = async (req, res, next) => {
    try {
        const pests = await PestModel.find();
        const infoPest = {
            la: req.body.la,
            than: req.body.than,
            re: req.body.re,
        };
        // const training_data = [
        //     {
        //         la: 'vàng xanh xám',
        //         than: 'lùn',
        //         re: '',
        //         benh: { name: 'vàng lùn', id: 'abc13' },
        //     },
        //     { la: 'vàng xanh xám', than: '', re: '', benh: 'vàng lá' },
        //     { la: 'có đốm xám', than: '', re: '', benh: 'khô vằn' },
        //     { la: 'có đốm xám', than: 'thấp', re: '', benh: 'khô vằn' },
        // ];

        let training_data = [];

        for (let i = 0; i < pests.length; i++) {
            training_data.push({
                la: pests[i].trieuchungnhandang.la,
                than: pests[i].trieuchungnhandang.than,
                re: pests[i].trieuchungnhandang.re,
                benh: pests[i],
            });
        }

        const test_data = [
            {
                la: 'vàng',
                than: 'lùn',
                re: 'héo',
                benh: { name: 'vàng lùn', id: 'abc13' },
            },
            { la: 'vàng', than: '', re: '', benh: 'vàng lá' },
            { la: 'có đốm xám', than: '', re: '', benh: 'khô vằn' },
            { la: 'có đốm xám', than: 'thấp', re: '', benh: 'khô vằn' },
        ];

        const class_name = 'benh';
        const features = ['la', 'than', 're'];
        const dt = new DecisionTree(class_name, features);
        dt.train(training_data);
        const treeJson = dt.toJSON();
        dt.import(treeJson);

        const predicted_class = dt.predict(infoPest);
        const crop = await CropModel.findById(predicted_class.LoaiCay);
        res.status(200).json({
            success: true,
            message: 'Thành công.',
            data: { pest: predicted_class, crop },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updatePest = async (req, res, next) => {
    try {
        const pest = await PestModel.findById(req.params.id);
        if (!pest) {
            return res.status(404).json({
                success: false,
                message: 'Bệnh này không tồn tại!',
            });
        }
        const { pestName, detailedSymptoms, identificationSymptoms, idCrop } = req.body;
        const { file } = req.files;
        let linkImg;
        if (!file) {
            linkImg = null;
        } else {
            linkImg = await upload(file.tempFilePath, folder);
        }

        pest.ten = pestName || pest.ten;
        pest.trieuchungchitiet = detailedSymptoms || pest.trieuchungchitiet;
        pest.trieuchungnhandang = identificationSymptoms || pest.trieuchungnhandang;
        pest.anh = linkImg.url || pest.anh;
        pest.LoaiCay = idCrop || pest.LoaiCay;
        pest.save();
        res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin sâu bệnh thành công.',
            data: pest,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { createPest, getAllPests, getPestById, detectPest, updatePest };
