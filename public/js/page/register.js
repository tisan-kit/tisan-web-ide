(function(){
  //监听回车
  document.onkeydown=keyDownSearch;  
  function keyDownSearch(e) {    
    // 兼容FF和IE和Opera    
    var theEvent = e || window.event;    
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;    
    if (code == 13) {    
      $('#subBtn').click();
    }    
  }  
  var submit = {
    able:function(){
      $('#subBtn').removeClass('disabled');
    },
    disable:function(){
      $('#subBtn').addClass('disabled');
    }
  }
  function showErrorMsg(msg){
      $('#rc1').css('display', 'block');
      $('#rc1').text(msg);
  }
  function sendForm(username,password){
    $.ajax({
      path:'/user/register',
      method:'POST',
      data:{username:username,password:password},
      success:function(result){
        if(result.code==0){
          location.reload();
        }else if(result.code==1001){
          showErrorMsg('帐号已被注册');
        }else if(result.code==2001){
          showErrorMsg('输入数据格式错误');
        }else if(result.code==3000){
          var login = window.confirm('帐号激活邮件发送成功,请查收');
          if(login){
            window.location.href="/";
          }
        }
      }
    }) 
  }
  $('#subBtn').on('click',function(){
    var username = $('.username').val(),
        password = $('.password').val();

    submit.disable(); 
    sendForm(username,password);
  }) 
  
  //username输入绑定事件
  
  $('.username').focus(function(){
    usernameCheck(this.value);
  });
  $('.username').keydown(function(){
    usernameCheck(this.value);
  })
  $('.username').keyup(function(){
    usernameCheck(this.value);
  })
  $('.username').on('change',function(){
    usernameCheck(this.value);
  })


  $('.password').focus(function(){
    pwdCheck1(this.value);
  });
  $('.password').keydown(function(){
    pwdCheck1(this.value);
  })
  $('.password').keyup(function(){
    pwdCheck1(this.value);
  })
  $('.password').on('change',function(){
    pwdCheck1(this.value);
  })


  $('.rpt-password').focus(function(){
    pwdCheck2(this.value);
  });
  $('.rpt-password').keydown(function(){
    pwdCheck2(this.value);
  })
  $('.rpt-password').keyup(function(){
    pwdCheck2(this.value);
  })
  $('.rpt-password').on('change',function(){
    pwdCheck2(this.value);
  })

  var check = new Array(0, 0, 0, 0, 0, 0);
  //用户名检测
  function usernameCheck(text) {
    check[0] = 0;
    var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(text.length != 0 && !filter.test(text)) {
      $('#rc1').removeAttr('style');
      lastCheck();
    }   else {
      $('#rc1').css('display', 'none');
      check[0] = 1;
      lastCheck();
    }   
  } 

  //密码检测
  function pwdCheck1(text) {
    check[1] = 0;

    if($('#nPwd2').val().length != 0 && $('#nPwd2').val() != text ) {
      $('#rc3').removeAttr('style');
      check[2] = 0;
      lastCheck();
      return;
    } else {
      $('#rc3').css('display', 'none');
      check[2] = 1;
      lastCheck();
    }

    if(text.length < 6 || /[^a-zA-Z0-9]/.test(text)) {
      $('#rc2').removeAttr('style');
      lastCheck();
    } else {
      $('#rc2').css('display', 'none');
      check[1] = 1;
      lastCheck();
    }
  }

  //重复密码检测
  function pwdCheck2(text) {
    check[2] = 0;

    if($('#nPwd1').val().length == 0) {
      $('#rc2').removeAttr('style');
      check[1] = 0;
      lastCheck();
      return;
    }

    if(text.length < 6 || /[^a-zA-Z0-9]/.test(text) || text != $('#nPwd1').val()) {
      $('#rc3').removeAttr('style');
      lastCheck();
    } else {
      $('#rc3').css('display', 'none');
      check[2] = 1;
      lastCheck();
    }
  }

  //选项检测
  function departCheck(num) {
    if(num!=0) {
      check[5] = 1;
      lastCheck();
    }
    else {
      check[5] = 0;
      lastCheck();
    }

  }
  //总体检测
  function lastCheck() {
    var allow = false
    for(var i = 0; i < 3; i++) {
      if(check[i] == 0) break;
      if( i == 2 ) allow = true;
    }   

    if($('#nPwd2').val().length==0){
      return;
    };
    if(allow) {
      submit.able();
    }   
    else {
      submit.disable();
    }   
  }   
  
})()
