(async () => {
  //获取用户的登录信息，如果没有登录跳转到登录页面，有登录直接返回
  const resp = await API.profile();
  const user = resp.data;
  //   console.log(user);
  if (!user) {
    //登录失败
    alert('未登录或登录已过期，请重新登录');
    location.href = './login.html';
    return;
  }

  // 获取dom
  const doms = {
    aside: {
      nickname: $('#nickname'),
      loginId: $('#loginId'),
    },
    close: $('.close'),
    chatContainer: $('.chat-container'),
    txtMsg: $('#txtMsg'),
    msgContainer: $('.msg-container'),
  };
  //下面的代码环境一定是登录状态
  getUserInfo();
  loadHistory();

  // 注册注销事件
  doms.close.onclick = () => {
    API.loginOut();
    location.href = './login.html';
  };

  //注册聊天框提交事件
  doms.msgContainer.onsubmit = (e) => {
    e.preventDefault(); //阻止表单的默认提交事件
    sendChat();
  };

  //加载历史记录
  async function loadHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      addChat(item);
    }
    scrollBottom();
  }

  // 获取用户信息,设置昵称和id
  function getUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  //根据消息对象，将消息添加到内容中
  /*
    content:"发的什么呀你，乱打的吧",
    createdAt: 1652347195827,
    from: null,
    to: "haha",
    */
  function addChat(chatInfo) {
    const div = $$$('div');
    div.classList.add('chat-item');
    if (chatInfo.from) {
      div.classList.add('me');
    }
    const img = $$$('img');
    img.className = 'chat-avatar';
    img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg';

    const content = $$$('div');
    content.classList.add('chat-content');
    content.innerText = chatInfo.content;

    const date = $$$('div');
    date.classList.add('chat-date');
    date.innerText = formatDate(chatInfo.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);

    doms.chatContainer.appendChild(div);
  }

  //让聊天消息滚动到底部
  function scrollBottom() {
    //scrollHeight聊天内容的总高度
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  //转换时间戳
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  //发送消息
  async function sendChat() {
    const content = doms.txtMsg.value.trim(); //trim()去除首尾空格
    if (!content) {
      //若聊天消息为空则直接返回，什么都不做
      return;
    }
    addChat({
      from: user.loginId,
      to: null,
      content,
      createdAt: new Date(),
    });
    scrollBottom();
    doms.txtMsg.value = '';
    const resp = await API.sendChat(content);
    addChat({
      to: user.loginId,
      from: null,
      ...resp.data,
      //   content: resp.data.content,
      //   createdAt: new Date(),
    });
    scrollBottom();
  }
})();
