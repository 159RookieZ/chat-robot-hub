// localStorage中是否存有token 且token是否相同
(async function () {
    const doms = {
        nickname: $('#nickname'),
        loginId: $('#loginId'),
        close: $('.close'),
        chatContainer: $('.chat-container'),
        txtMsg: $('#txtMsg'),
        button: $('button')
    }

    // 验证是否登录，如果没登录，跳转到登录页，如果有登录，获取到登陆的用户信息
    const resp = await API.profile()
    const user = resp.data
    if (!user) {
        alert('未登录或账号已过期，请重新登录')
        location.href = './login.html'
    }


    function setUserInfo() {
        doms.nickname.innerText = user.nickname
        doms.loginId.innerText = user.loginId
    }

    setUserInfo()

    // 注销事件
    doms.close.onclick = function () {
        API.loginOut()
        location.href = './login.html'
    }

    // 加载历史记录
    async function loadHistory() {
        const resp = await API.getHistory()
        for (const item of resp.data) {
            addChat(item)
        }
        scroll()
    }
    await loadHistory()

    // 根据消息对象，将其添加到页面中
    /**
        content:'你几岁啦',
        createAt:189512654564,
        from:'zxy',
        to:null
     */
    async function addChat(chatInfo) {
        const item = $$$('div')
        item.classList.add('chat-item')
        if (chatInfo.from) {
            item.classList.add('me')
        }

        const img = $$$('img')
        img.classList.add('chat-avatar')
        img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg'

        const content = $$$('div')
        content.classList.add('chat-content')
        content.innerText = chatInfo.content

        const date = $$$('div')
        date.classList.add('chat-date')
        date.innerText = formatDate(chatInfo.createdAt)

        item.appendChild(img)
        item.appendChild(content)
        item.appendChild(date)

        doms.chatContainer.appendChild(item)

        scroll()
    }

    // 获取当前时间
    function formatDate(time) {
        const date = new Date(time)

        const year = date.getFullYear().toString().padStart(4, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')

        const hour = date.getHours().toString().padStart(2, '0')
        const minute = date.getMinutes().toString().padStart(2, '0')
        const second = date.getSeconds().toString().padStart(2, '0')

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }

    // 让聊天区域滚动到最后
    function scroll() {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight
    }

    // 发送消息
    doms.button.onclick = async function (e) {
        e.preventDefault();
        const content = doms.txtMsg.value
        if (!content) {
            return
        }
        addChat({
            from: user.loginId,
            to: null,
            createdAt: Date.now(),
            content
        })
        doms.txtMsg.value = ''
        const resp = await API.sendChat(content)
        console.log(resp);
        addChat({
            from: null,
            to: user.loginId,
            ...resp.data
        })
        scroll()
    }
})()