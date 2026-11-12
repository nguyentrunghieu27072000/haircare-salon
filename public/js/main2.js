
let base_url = location.origin;
function number_format(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function increaseValue() {
    var value = parseInt($('.number').val(), 10);
    value = isNaN(value) ? 0 : value;
    value++;
    $('.number').val(value);
}

function decreaseValue() {
    var value = parseInt($('.number').val(), 10);
    value = isNaN(value) ? 0 : value;
    value < 2 ? value = 2 : '';
    value--;
    $('.number').val(value);
}

const firebaseConfig = {
    apiKey: "AIzaSyD6Nt2leK_3iGOBmPybm1rGYndfme8ov8A",
    authDomain: "myblog-b22d7.firebaseapp.com",
    projectId: "myblog-b22d7",
    storageBucket: "myblog-b22d7.appspot.com",
    messagingSenderId: "626165196076",
    appId: "1:626165196076:web:619be27f818cb004c27889",
    measurementId: "G-371YK6B31X"
  };
firebase.initializeApp(firebaseConfig);
    window.onload = function() {
    render();
};

function render() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container", {
        size: "invisible",
        callback: function(response) {
            submitPhoneNumberAuth();
        }
        }
    );
}

$(document).ready(function () {
    let sdt = "";
    $('#sdt').focus(() => {
        $('.error-phone-number').text('');
    })
    $(document).on('click','#send-OTP',function(){
        let number = $("#sdt").val();
        $.ajax({
            url: 'Check-User',
            type: 'get',
            data:{'user': number}
        })
        .done(function(response){
            if(response != 0){
                passwordUser(number);
            }else{
                sendOTP(number);
                $(document).on('keydown','.code-input',function(e){
                    let key = e.which;
                    if( ((key < 37 || key > 57) && key != 8)){
                        return false;
                    }
                })
                $(document).on('keyup','.code-input',function(e){
                    let key = e.which;
                    if( key >= 37 && key <= 57){
                        if($(this).next().val()){
                            $(this).next().select();
                        }else{
                            $(this).next().select();
                        }
                    }
                    if( key === 8){
                        $(this).prev().select();
                    }
                    else{
                        return false;
                    }
                })
            }
        });
    })
    $(document).on('click','#verify',function(){
        verify();
    })
    function sendOTP(number) {
        sdt = number;
        regex = /^0[0-9]{9}$/
        if (regex.test(number)) {
          number_vn = "+84" + number.substring(1);
          firebase.auth().signInWithPhoneNumber(number_vn, window.recaptchaVerifier).then(function(confirmationResult) {
            // window.confirmationResult = confirmationResult;
            coderesult = confirmationResult;
            let html = `
            <div class="modal-header border-bottom-0">
                <div style="position:absolute;left:50%;top: 15%;"><h4 style="position: relative;font-weight: bold;left: -50%;">Nhập mã xác nhận</h4></div>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div id="recaptcha-container"></div>
            </div>
            <div class="modal-body">
                <div id="phone-number">
                    <div class="form-title mt-3 mb-3 text-center">
                    <span>Anh nhập mã xác nhận (6 chữ số) được gửi đến SĐT ${number} để hoàn tất</span>
                    </div>
                    <div class="d-flex flex-column text-center">
                    <form>
                        <div class="number-code">
                            <input type="text" class="code-input">
                            <input type="text" class="code-input">
                            <input type="text" class="code-input">
                            <input type="text" class="code-input">
                            <input type="text" class="code-input">
                            <input type="text" class="code-input">
                        </div>
                        <label class="error-phone-number"></label>
                        <button type="button" class="btn btn-warning btn-block btn-round rounded text-uppercase font-weight-bold" id="verify">Hoàn tất</button>
                    </form>
                    </div>
                </div>
            </div>
            `;
          $('.modal-content').html(html);
          }).catch(function(error) {
            $("#error").text(error.message);
            $("#error").show();
          });
        } else {
          $('.error-phone-number').text('Số điện thoại sai định dạng.')
        }
    }
    function verify() {
        var code = "";
        $('.code-input').each(function(){
            code += $(this).val();
        })
        coderesult.confirm(code).then(function (result) {
            var user = result.user;
            let html = `
            <div class="modal-header border-bottom-0">
                <div style="position:absolute;left:50%;top: 15%;"><h4 style="position: relative;font-weight: bold;left: -50%;">Nhập mật khẩu</h4></div>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div id="recaptcha-container"></div>
            </div>
            <div class="modal-body">
                <div id="phone-number">
                    <div class="form-title mt-3 mb-3 text-center">
                    <span>Mật khẩu ít nhất là 6 ký tự</span>
                    </div>
                    <div class="d-flex flex-column text-center">
                        <form action="Add-Account" method="post">
                            <div class="add-pass">
                                <div class="form-group">
                                <input type="password" class="form-control password" name="password1" placeholder="Nhập mật khẩu" autocomplete="off">
                                <input type="password" class="form-control password" name="password2" placeholder="Nhập lại mật khẩu" autocomplete="off">
                                </div>
                            </div>
                            <button type="submit" name="completed" class="btn btn-warning btn-block btn-round rounded text-uppercase font-weight-bold" value="${sdt}">Hoàn tất</button>
                        </form>
                    </div>
                </div>
            </div>
            `;
            $('.modal-content').html(html);
        }).catch(function (error) {
            $('.error-phone-number').text('Mã xác nhận không chính xác.')
        });
    }
    function passwordUser(sdt){
        let html = `
            <div class="modal-header border-bottom-0">
                <div style="position:absolute;left:50%;top: 15%;"><h4 style="position: relative;font-weight: bold;left: -50%;">Nhập mật khẩu</h4></div>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div id="recaptcha-container"></div>
            </div>
            <div class="modal-body">
                <div id="phone-number">
                    <div class="form-title mt-3 mb-3 text-center">
                    <span>Nhập mật khẩu của SĐT ${sdt}.</span>
                    </div>
                    <div class="d-flex flex-column text-center">
                        <form action="Login" method="post">
                            <div class="add-pass">
                                <div class="form-group">
                                    <input type="password" class="form-control password" name="password-user" autocomplete="off">
                                    <label class="error-phone-number"></label>
                                </div>
                            </div>
                            <button id="login" type="button" name="login" class="btn btn-warning btn-block btn-round rounded text-uppercase font-weight-bold" value="${sdt}">Hoàn tất</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        console.log(html);
        $('.modal-content').html(html);
    }
    $(document).on('click','#login',function(){
        $.ajax({
            url: 'Login',
            type: 'post',
            data:{
                'user': $(this).val(),
                'pass': $('input[name=password-user]').val(),
            }
        })
        .done(function(response){
            if(response == 'ok'){
                Swal.fire({icon: 'success',title: 'Đăng nhập thành công!',showConfirmButton: false,time: 2000,})
                location.reload();
            }else{
                $('.error-phone-number').text('Mật khẩu không chính xác.')
            }
        })
    })
})
