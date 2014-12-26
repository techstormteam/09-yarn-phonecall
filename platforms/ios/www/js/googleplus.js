function loginGooglePlus() {
    window.plugins.googleplus.login(
                                    {
                                    'iOSApiKey': '6535513912-uvpf249ak7avodois85tkjmh2lc2j952.apps.googleusercontent.com'
                                    },
                                    function (obj) {
                                    document.querySelector("#image").src = obj.imageUrl;
                                    document.querySelector("#image").style.visibility = 'visible';
                                    document.querySelector("#feedback").innerHTML = "Hi, " + obj.displayName + ", " + obj.email;
                                    },
                                    function (msg) {
                                    document.querySelector("#feedback").innerHTML = "error: " + msg;
                                    }
                                    );
}

function trySilentLogin() {
    window.plugins.googleplus.trySilentLogin(
                                             {
                                             'iOSApiKey': '6535513912-uvpf249ak7avodois85tkjmh2lc2j952.apps.googleusercontent.com'
                                             },
                                             function (obj) {
                                             document.querySelector("#image").src = obj.imageUrl;
                                             document.querySelector("#image").style.visibility = 'visible';
                                             document.querySelector("#feedback").innerHTML = "Silent hi, " + obj.displayName + ", " + obj.email;
                                             },
                                             function (msg) {
                                             document.querySelector("#feedback").innerHTML = "error: " + msg;
                                             }
                                             );
}

function logout() {
    window.plugins.googleplus.logout(
                                     function (msg) {
                                     document.querySelector("#image").style.visibility = 'hidden';
                                     document.querySelector("#feedback").innerHTML = msg;
                                     }
                                     );
}

function disconnect() {
    window.plugins.googleplus.disconnect(
                                         function (msg) {
                                         document.querySelector("#image").style.visibility = 'hidden';
                                         document.querySelector("#feedback").innerHTML = msg;
                                         }
                                         );
}

window.onerror = function(what, line, file) {
    alert(what + '; ' + line + '; ' + file);
};

function handleOpenURL (url) {
    document.querySelector("#feedback").innerHTML = "App was opened by URL: " + url;
}