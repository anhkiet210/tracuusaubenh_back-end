import * as jwtHelper from '../../../helper/jwt.helper';
import UserModel from '../../../models/user.model';

const isAuth = async (req, res, next) => {
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
        // console.log('verify : ', isVerifyToken);
        if (!isVerifyToken) {
            res.status(401).json({
                success: false,
                message: 'Bạn không có quyền truy cập tính năng này!',
            });
            return;
        }
        req.user = await UserModel.findById(isVerifyToken.id);
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Phiên đăng nhập của bạn đã hết hạn, hãy đăng nhập lại' });
    }
};

export default isAuth;
