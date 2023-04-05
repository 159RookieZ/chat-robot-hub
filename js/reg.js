const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号'
    }
    if (val.length > 20) {
        return '账号不能超过20位'
    }
    const resp = await API.exists(val)
    if (resp.data) {
        return '账号已存在'
    }
})

const nickNameValidator = new FieldValidator('txtNickname', function (val) {
    if (!val) {
        return '请填写昵称'
    }
    if (val.length > 20) {
        return '昵称不能超过20位'
    }
})

const loginPwdValidator = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '请填写密码'
    }
})

const loginPwdConfirmValidator = new FieldValidator('txtLoginPwdConfirm', function (val) {
    if (!val) {
        return '请再次填写密码'
    }
    if (val !== loginPwdValidator.input.value) {
        return '两次输入的密码不一致'
    }
})

const form = $('.user-form');

form.onsubmit = async function (e) {
    e.preventDefault();
    const result = await FieldValidator.validateAll(
        loginIdValidator,
        nickNameValidator,
        loginPwdValidator,
        loginPwdConfirmValidator
    );
    if (!result) {
        return; // 验证未通过
    }
    const formData = new FormData(form); // 传入表单dom，得到一个表单数据对象
    const data = Object.fromEntries(formData.entries());
    const resp = await API.reg(data);

    // const resp = {
    //     loginId: loginIdValidator.input.value,
    //     nickname: nickNameValidator.input.value,
    //     loginPwd: loginPwdValidator.input.value,
    // }
    if (resp.code === 0) {
        location.href = './login.html';
    }
};