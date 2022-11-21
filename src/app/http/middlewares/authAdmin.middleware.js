import * as jwtHelper from '../../../helper/jwt.helper';
import AdminModel from '../../../models/admin.model';

const isAuthAdmin = async (req, res, next) => {
    const tokenFromClient = req.headers['authorization']?.split(' ')[1].replace(/"/g, '');
    if (!tokenFromClient) {
        return res.status(401).json({
            success: false,
            message: 'Vui lòng đăng nhập để truy cập tài nguyên này!',
        });
    }
    // console.log({ tokenFromClient });

    const isVerifyToken = await jwtHelper.verifyToken(tokenFromClient);
    if (!isVerifyToken) {
        return res.status(401).json({
            success: false,
            message: 'Bạn không có quyền truy cập tính năng này!',
        });
    }
    try {
        req.user = await AdminModel.findById(isVerifyToken.id);
        next();
    } catch (error) {
        console.log(error.code);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default isAuthAdmin;
