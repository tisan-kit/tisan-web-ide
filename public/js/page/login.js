(function(){
  //监听回车
  document.onkeydown=keyDownSearch;  
  function keyDownSearch(e) {    
    // 兼容FF和IE和Opera    
    var theEvent = e || window.event;    
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;    
    if (code == 13) {    
      $('#login-btn').click();
    }    
  }  

  var submit = {
    able:function(){
      $('#login-btn').removeClass('disabled');
    },
    disable:function(){
      $('#login-btn').addClass('disabled');
    }
  }
  function showErrorMsg(obj,msg){
      obj.css('display', 'block');
      obj.text(msg);
  }
  function sendForm(username,password){
    $.ajax({
      path:'/user/login',
      method:'POST',
      data:{username:username,password:password},
      success:function(result){
        if(result.code==0){
          if(document.referrer.indexOf('/user/login'!=-1)){
            window.location.href='/';
          }else{
            window.location.href=document.referrer;
          }
        }else if(result.code==1050){
          showErrorMsg($('#rc1'),'帐号不存在');
        }else if(result.code==1010){
          showErrorMsg($('#rc2'),'密码错误');
        }
      }
    }) 
  }
  $('#login-btn').on('click',function(){
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

  //用户名检测
  function usernameCheck(text) {
    check[0] = 0;

    if((text.length != 0 && text.length < 6) || /[^a-zA-Z0-9]/.test(text)) {
      $('#rc1').removeAttr('style');
      lastCheck();
    }   
    else {
      $('#rc1').css('display', 'none');
      check[0] = 1;
      lastCheck();
    }   
  } 
  var check = new Array(0, 0, 0, 0, 0, 0);

  //用户名检测
  function usernameCheck(text) {
    check[0] = 0;

    var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(text.length != 0 && !filter.test(text)) {
      $('#rc1').removeAttr('style');
      lastCheck();
    }
    else {
      $('#rc1').css('display', 'none');
      check[0] = 1;
      lastCheck();
    }
  }

  //密码检测
  function pwdCheck1(text) {
    check[1] = 0;

    if(text.length < 6 || /[^a-zA-Z0-9]/.test(text)) {
      $('#rc2').removeAttr('style');
      lastCheck();
    } else {
      $('#rc2').css('display', 'none');
      check[1] = 1;
      lastCheck();
    }
  }

  //总体检测
  function lastCheck() {
    var allow = false
    for(var i = 0; i < 2; i++) {
      if(check[i] == 0) break;
      if( i == 1 ) allow = true;
    }   

    if(allow) {
      submit.able();
    }   
    else {
      submit.disable();
    }   
  }
})()
