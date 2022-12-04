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

    try {
        const isVerifyToken = await jwtHelper.verifyToken(tokenFromClient);
        if (!isVerifyToken) {
            return res.status(401).json({
                success: false,
                message: 'Bạn không có quyền truy cập tính năng này!',
            });
        }
        req.user = await AdminModel.findById(isVerifyToken.id);
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Phiên đăng nhập của bạn đã hết hạn, hãy đăng nhập lại' });
    }
};

export default isAuthAdmin;
