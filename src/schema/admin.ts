import * as Yup from 'yup';

export const registerAddSchema = Yup.object().shape({
    // 账号
    account: Yup.string()
        .matches(/^1[3-9]\d{9}$/, '账号格式不正确')
        .required('账号不能为空'),
    // 密码
    password: Yup.string()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
            '密码必须包含大写字母、小写字母、数字和特殊字符，并且长度在8到20之间'
        )
        .required('密码不能为空'),
});