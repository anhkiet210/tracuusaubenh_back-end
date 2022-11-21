import jwt from 'jsonwebtoken';

// const generateToken = (user, tokenLife) => {
//     return new Promise((resolve, reject) => {
//         jwt.sign(user, process.env.SECRET, { expiresIn: tokenLife }, (error, token) => {
//             if (error) {
//                 return reject(error);
//             }
//             resolve(token);
//         });
//     });
// };

const sendToken = (user, res, message) => {
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE });
    res.status(200).json({
        success: true,
        message: message,
        accessToken: token,
    });
};

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.TOKEN_SECRET, (error, decode) => {
            if (error) {
                return reject(error);
            }
            resolve(decode);
        });
    });
};

export { sendToken, verifyToken };
