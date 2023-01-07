// 用户登录和注册通用表单项验证代码
/**
 * 对某一项表单进行验证的构造函数
 */

class FieldValidator {
  /**
   *
   * @param {String} textId 需要验证的表单的Id
   * @param {Function} validatorFunc 验证规则函数，当表单需要验证时调用该函数，函数的参数是输入表单的内容，函数返回错误内容，没有返回则无错误
   */
  constructor(txtId, validatorFunc) {
    this.input = $('#' + txtId); //获取需要验证的表单
    this.p = this.input.nextElementSibling; //返回下一个兄弟元素
    this.validatorFunc = validatorFunc; //保存一下验证规则函数
    //失去焦点时验证
    this.input.onblur = () => {
      // 失去焦点，调用验证函数，
      this.validate();
    };
  }

  /**
   *
   * 需要验证时，调用该函数，成功返回 true 失败返回 false
   */
  async validate() {
    const err = await this.validatorFunc(this.input.value); //调用验证规则函数，返回错误消息
    if (err) {
      //有错误
      this.p.innerText = err;
      return false;
    } else {
      //没错误
      this.p.innerText = '';
      return true;
    }
  }

  // 静态方法
  /**
   * 对传入的所有验证器进行统一的验证，如果所有验证全部通过，返回 true，否则返回false
   * @param {FieldValidator[]} validators
   */
  static async validate(...validators) {
    const proms = validators.map((v) => v.validate());
    const results = await Promise.all(proms);
    return results.every((r) => r); //查找所有项目返回的值是否都为 true，如果是返回true
  }
}

// function test() {
//   FieldValidator.validate(loginIdValidator, nicknameValidator).then(
//     (resule) => {
//       console.log(resule);
//     }
//   );
// }
