// 注册页面的所有验证规则

//针对账号的验证规则
const loginIdValidator = new FieldValidator('txtLoginId', async (val) => {
  if (!val) {
    return '请填写账号';
  }
  const resp = await API.exists(val);
  if (resp.data) {
    return '该账号已经存在，请重新输入一个账号';
  }
});

// 针对昵称的验证规则
const nicknameValidator = new FieldValidator('txtNickname', async (val) => {
  if (!val) {
    return '请填写昵称';
  }
});

// 针对密码的验证规则
const loginPwdValidator = new FieldValidator('txtLoginPwd', async (val) => {
  if (!val) {
    return '请填写密码';
  }
});

// 针对确认密码的验证规则
const loginPwdConfirmValidator = new FieldValidator(
  'txtLoginPwdConfirm',
  async (val) => {
    if (!val) {
      return '请填写确认密码';
    }
    if (val !== loginPwdValidator.input.value) {
      return '两次密码不一致';
    }
  }
);

const form = $('.user-form');
form.onsubmit = async (e) => {
  e.preventDefault(); //阻止表单事件的默认行为，
  const result = await FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator
  );
  if (!result) {
    return; //验证未通过
  }

  const formData = new FormData(form); //传入表单dom，得到一个表单数据
  const data = Object.fromEntries(formData.entries());
  console.log(data);

  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert('注册成功，点击确认跳转到登录页');
    location.href = './login.html';
  }
};
