var layer = layui.layer
var form = layui.form;

function checkAccount() {

    if (!(localStorage.getItem("apiId") !== null && localStorage.getItem("apiHash"))) {
        alertBind();
        return true;
    }
}

function saveAccount(field) {
    localStorage.setItem("apiId", field.id);
    localStorage.setItem("apiHash", field.hash);
    localStorage.setItem("proxyAddr", field.proxy);
}

function islegal(field) {
    return true;
}

function alertBind() {
    layer.open({
        type: 1,
        area: '350px',
        resize: false,
        shadeClose: true,
        title: '绑定TG API',
        content: `
            <div class="layui-form" lay-filter="filter-test-layer" style="margin: 16px;">
              <div class="demo-login-container">
                <div class="layui-form-item">
                  <div class="layui-input-wrap">
                    <div class="layui-input-prefix">
                      <i class="layui-icon layui-icon-username"></i>
                    </div>
                    <input type="text" name="id" value="" lay-verify="required" placeholder="id" lay-reqtext="请填写api id" autocomplete="off" class="layui-input" lay-affix="clear">
                  </div>
                </div>
                <div class="layui-form-item">
                  <div class="layui-input-wrap">
                    <div class="layui-input-prefix">
                      <i class="layui-icon layui-icon-password"></i>
                    </div>
                    <input type="text" name="hash" value="" lay-verify="required" placeholder="hash" lay-reqtext="请填写api hash" autocomplete="off" class="layui-input">
                  </div>
                </div>
                <div class="layui-form-item">
                  <div class="layui-input-wrap">
                    <div class="layui-input-prefix">
                      <i class="layui-icon layui-icon-website"></i>
                    </div>
                    <input type="text" name="proxy" value="" placeholder="代理地址(http://xx或https://xx, 选填)" autocomplete="off" class="layui-input">
                  </div>
                </div>

                <div class="layui-form-item">
                    <a href="https://core.telegram.org/api/obtaining_api_id" target="_blank" style="float: right; margin-top: 7px;">如何获取API？</a>
                </div>

                <div class="layui-form-item">
                  <button class="layui-btn layui-btn-fluid" lay-submit lay-filter="demo-login">绑定</button>
                </div>
                
              </div>
            </div>
          `,
        success: function () {
            form.render();
            form.on('submit(demo-login)', function (data) {
                var field = data.field;
                if (islegal(field)) {
                    saveAccount(field);
                    layer.closeLast();
                    layer.msg('绑定成功', { icon: 6 });
                    location.reload();
                } else {
                    layer.closeLast();
                    layer.msg('绑定失败: 参数不合法', { icon: 5 });
                }


            });
        }
    });
}

function cancelBind() {
    localStorage.clear();
    layer.msg("成功取消绑定TG API~");
}

function changeBind() {
    localStorage.clear();
    alertBind();
}

function checkPhone(phone) {
    var result = {
        "phone": phone,
        "status": 0
    }
    if (checkAccount()) {
        return false;
    }
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('api_id', localStorage.getItem("apiId"));
    formData.append('api_hash', localStorage.getItem("apiHash"));
    formData.append('proxy', localStorage.getItem("proxyAddr"));

    fetch('/checkPhone', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(response => {
            if (response.code != 0) {
                layer.msg("Net work error!");
                return false;
            }
            result = response.ret
            var ret = (result.status == 0) ? "已经在Telegrame上注册" : "还未在Telegram上注册"
            layer.open({
                type: 1,
                area: '420px',
                title: false,
                closeBtn: 0,
                shadeClose: true,
                content: `
        <div style="padding: 15px;">
                <fieldset class="layui-elem-field">
                <legend>${result.phone}</legend>
                <div class="layui-field-box">
                    ${ret}
                </div>
                </fieldset>
        </div>
                `
            });

        });


}

function addListeners() {
    var searchElement = document.getElementById('search');
    searchElement.addEventListener('click', function () {
        var phoneElement = document.getElementById('search-input');
        phone = phoneElement.value
        if (phone == "") {
            layer.tips('手机号不能为空!', phoneElement, {
                tips: 1
            });

        } else {
            checkPhone(phone);
        }
    });
}

function downloadExample() {
    const link = document.createElement('a');
    link.href = 'static/example.txt';
    link.download = 'example.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function openHistory() {
    var result = [
        {
            'phone': '114514',
            'status': '已注册'
        }
    ]
    // 获取历史记录的json并解析添加到content中
    fetch('/showHistory')
        .then(response => response.json())
        .then(response => {
            if (response.code != 0) {
                layer.msg("Net work error!");
                return false;
            }
            result = response.ret
            var content = `
            <div style="padding: 15px;">
                <fieldset class="layui-elem-field layui-field-title">
                <legend>历史查询记录</legend>
                </fieldset>
                <div style="text-align: right;">
                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick="saveHistory()">
                        <i class="layui-icon layui-icon-download-circle"></i> 保存记录
                    </button>
                    <button type="button" class="layui-btn layui-btn-sm layui-btn-danger" onclick="clearHistory()">
                        <i class="layui-icon layui-icon-delete"></i> 清空记录
                    </button>
                </div>
                <table class="layui-table" lay-even>
                <colgroup>
                    <col width="150">
                    <col width="150">
                    <col>
                </colgroup>
                <thead>
                    <tr>
                    <th>手机号</th>
                    <th>注册状态</th>
                    </tr> 
                </thead>
                <tbody>
            `
            result.forEach(function (item) {
                content += `
                    <tr>
                    <td>${item.phone}</td>
                    <td>${item.status}</td>
                    </tr>
            `
            });

            content += `
                </tbody>
                </table>
            </div>`
            layer.open({
                type: 1,
                area: ['420px', '280px'],
                title: false,
                closeBtn: 0,
                shadeClose: true,
                content: content
            });
        });
}

function clearHistory() {
    layer.confirm('确实要删除历史记录?(不可找回，建议保存历史记录后删除)', { icon: 3 }, function () {
        fetch("/clearHistory");
        layer.closeAll();
        layer.msg("清除历史记录成功")
    });
}

function saveHistory() {
    // 发起请求并下载 db 文件
    const link = document.createElement('a');
    link.href = '/saveHistory';
    link.download = 'history.db';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

}

window.onload = function () {
    checkAccount();
    addListeners();
}