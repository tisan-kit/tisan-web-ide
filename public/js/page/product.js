(function(){
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
    $('.avant-img').mouseenter(function(){
      avantPlay.block();
    })
    
    $('.avant-img').mouseout(function(result){
      avantPlay.none(result);
    })
    $('.avant-img').click(function(result){
      $('.cutting-avant-fix-btn').click();
    })
    $('.avant-img-title').on('click',function(){
      $('.cutting-avant-fix-btn').click();
    })
    $('.avant-img-title,.avant-img').on('click',function(){
        $('.cutting-avant-fix-box').css({'display':'block'})
    })

    $('.save-btn').on('click',function(){
        var tmp={
            productName:$('.name-input').val(),
            productDescript:$('.descript-input').val()
        }          
        
        $.ajax({
            url:'/workspace/product/info',
            type:'POST',
            data:tmp,
            success:function(result){
                console.log(result);
            }
        })
    })
})()


