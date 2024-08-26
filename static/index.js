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
                    <input type="password" name="hash" value="" lay-verify="required" placeholder="hash" lay-reqtext="请填写api hash" autocomplete="off" class="layui-input" lay-affix="eye">
                  </div>
                </div>
                <div class="layui-form-item">
                    <a href="https://my.telegram.org/auth" target="_blank" style="float: right; margin-top: 7px;">如何获取API？</a>
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

function checkPhone(phone) {
    if (checkAccount()) {
        return false;
    }
    // 请求对应后端获取结果
    var result = {
        "phone": phone,
        "statu": "已注册"
    }

    layer.open({
        type: 1,
        area: ['420px', '140px'],
        title: false,
        closeBtn: 0,
        shadeClose: true,
        content: `<div class="centered-div">手机号:&nbsp;<h4>${result.phone}</h4></div><div class="centered-div">在 Telegram 上的注册状态为:&nbsp;<h4>${result.statu}</h4></div>`
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
            // alert(phone);
            checkPhone(phone);
        }
    });

}

window.onload = function () {
    checkAccount();
    addListeners();
}