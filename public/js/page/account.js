(function(){
    var count=0;
    var avantPlay={
      block:function(){
        $('.avant-img-title').css({display:'block'});
        $('.avant-img').css({opacity:0.4});
      },
      none:function(result){
        if(result==''){
          $('.avant-img-title').css({display:'none'});
          $('.avant-img').css({opacity:1});
          return;
        } 
        if(result.toElement.className!='avant-img-title'){
          $('.avant-img-title').css({display:'none'});
          $('.avant-img').css({opacity:1});
        }
      }
    }
    $('.avant-img-title,.avant-img').on('click',function(){
        $('.cutting-avant-fix-box').css({'display':'block'})
    })
    $('.avant-img').mouseenter(function(){
      avantPlay.block();
    })
    
    $('.avant-img').mouseout(function(result){
      avantPlay.none(result);
    })
    $('.avant-img').click(function(result){
      $('.cutting-avant-fix-btn').click();
    })
    
    $('.thumbnail').on('click',function(){
      uploadAvant();
    })
    $('.avant-img-title').on('click',function(){
      //uploadAvant();
      $('.cutting-avant-fix-btn').click();
    })

    var t;
    function uploadAvant(){
        $('.upload-avant').click()
        t=setInterval(submit,500);
        avantPlay.none('');
    }
    function submit(){
        var obj=document.getElementById("f").files;
        if(obj.length){
            clearInterval(t);
            $('.files-name').text(obj[0].name);
            $('.files-name').css({display:'block'});
        }
    }

    var inputObj={
        nameObj:{
            nav:$('.name-nav'),
            input:$('.name-input'),
            box:$('.name-box')
        },
        emailObj:{
            nav:$('.email-nav'),
            input:$('.email-input'),
            box:$('.email-box')
        },
        phoneObj:{
            nav:$('.phone-nav'),
            input:$('.phone-input'),
            box:$('.phone-box')
        },
        changeBox:{
            wrong:function(obj){
                obj.addClass('has-error');
            },
            right:function(obj){
                obj.removeClass('has-error');
            }
        },
        changeNav:{
            wrong:function(obj){
                obj.removeClass('glyphicon-ok');
                obj.addClass('has-error');
                obj.addClass('glyphicon-remove');
            },
            right:function(obj){
                obj.removeClass('glyphicon-remove');
                obj.addClass('glyphicon-ok');
            }
        }
    }

    //save email name telephone
    function nameCheck(){
        //name check
        var name = inputObj.nameObj.input.val();
        if(name.length==0) return;
        var p = ['\\',',','"','\'','*','(',')','{','}','?']
        var q = true;
        
        for(var i in name){
            for(var j in p){
                if(name[i]==p[j]){
                    q=false;
                    break;
                }
            }
            if(!q) break;
        }

        if(!q){
            inputObj.changeNav.wrong(inputObj.nameObj.nav);
            inputObj.changeBox.wrong(inputObj.nameObj.box);
        }else{
            count++;
            inputObj.changeNav.right(inputObj.nameObj.nav);
            inputObj.changeBox.right(inputObj.nameObj.box);
        }
    }

    function emailCheck(){
        var email = inputObj.emailObj.input.val();
        if(email.length==0)return;
        if(email.match(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/)==null){
            inputObj.changeNav.wrong(inputObj.emailObj.nav);
            inputObj.changeBox.wrong(inputObj.emailObj.box);
        }else{
            count++;
            inputObj.changeNav.right(inputObj.emailObj.nav);
            inputObj.changeBox.right(inputObj.emailObj.box);
        }
    }
    
    function phoneCheck(){
        var phone = inputObj.phoneObj.input.val();
        if(phone.length==0||phone.match(/^1[3|4|5|8]\d{9}$/)==null){
            inputObj.changeNav.wrong(inputObj.phoneObj.nav);
            inputObj.changeBox.wrong(inputObj.phoneObj.box);
        }else{
            count++;
            inputObj.changeNav.right(inputObj.phoneObj.nav);
            inputObj.changeBox.right(inputObj.phoneObj.box);
        }
    }

    function buttonState(){
        if(count!=3){
            $('.btn-save-base').addClass('disabled');
        }else{
            $('.btn-save-base').removeClass('disabled');
        }
    }

    $('.name-input,.phone-input,.email-input').keyup(function(){
        count=0;
        emailCheck();
        nameCheck();
        phoneCheck();
        buttonState();
    })
    $('.name-input,.phone-input,.email-input').focus(function(){
        count=0;
        emailCheck();
        nameCheck();
        phoneCheck();
        buttonState();
    })
    $('.name-input,.phone-input,.email-input').change(function(){
        count=0;
        emailCheck();
        nameCheck();
        phoneCheck();
        buttonState();
    })

    $('.btn-save-base').on('click',function(){
        count=0;
        nameCheck();
        emailCheck();
        phoneCheck();
        buttonState();
        var prov=$('.prov').val();
        var city=$('.city').val();

        if(count==3){
            $.ajax({
                url:'/user/information',
                type:'POST',
                data:{
                    realname:inputObj.nameObj.input.val(),
                    email:inputObj.emailObj.input.val(),
                    telephone:inputObj.phoneObj.input.val(),
                    province:prov,
                    city:city 
                },
                success:function(result){
                    notification.show({
                        size:'xm',
                        title:'通知',
                        content:'保存成功'
                    });
                },
                failure:function(result){
                    console.log(result);
                }
            })
        }

    })
    
})()

