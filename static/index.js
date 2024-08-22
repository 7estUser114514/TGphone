function sayHello(){
    alert("Hello!")
}
function checkAccount() {
    return localStorage.getItem("apiId") !== null && localStorage.getItem("apiHash")
}

function saveAccount(id, hash) {
    localStorage.setItem("apiId", id)
    localStorage.setItem("apiHash", hash)
}

window.onload = function() {
    if(!checkAccount()) {
        alert("请配置TG的Api ID 和 API Hash")
    }
}