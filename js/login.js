// 登录页面的所有验证规则

//针对账号的验证规则
const loginIdValidator = new FieldValidator('txtLoginId', async (val) => {
  if (!val) {
    return '请填写账号';
  }
});

// 针对密码的验证规则
const loginPwdValidator = new FieldValidator('txtLoginPwd', async (val) => {
  if (!val) {
    return '请填写密码';
  }
});

const form = $('.user-form');
form.onsubmit = async (e) => {
  e.preventDefault(); //阻止表单事件的默认行为，
  const result = await FieldValidator.validate(
    loginIdValidator,
    loginPwdValidator
  );
  if (!result) {
    return; //验证未通过
  }

  const formData = new FormData(form); //传入表单dom，得到一个表单数据
  const data = Object.fromEntries(formData.entries());
  console.log(data);

  const resp = await API.login(data);
  if (resp.code === 0) {
    alert('登录成功，点击确认跳转到聊天页');
    location.href = './index.html';
  } else {
    // alert('请检查账号和密码');
    loginIdValidator.p.innerText = '账号或密码错误';
    loginPwdValidator.input.value = '';
  }
};
