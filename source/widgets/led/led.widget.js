!function(){
  if (!window.iotboard){
    console.log("iotboard not initialized!");
    return;
  }

  window.iotboard.defineWidget("led", {
    status: {
      red: 255,
      green: 255,
      blue: 255
    },
    render: function(dataset){ var dataset=clone(dataset);
        dataset.status=this.status;
        return template('template-led',dataset);
    },
    listeners: [
      {
        selector: ".btn-refresh",
        event: "click",
        behavior: "get"
      },
      {
        selector: ".btn-set",
        event: "click",
        behavior: "set"
      }
    ],
    parseStatus: function(dom){
      return {
        red: parseInt(dom.find(".rVal").val()),
        green: parseInt(dom.find(".gVal").val()),
        blue: parseInt(dom.find(".bVal").val())
      }
    },
    onRendered: function(dom){
      console.log("on widget rendered.");
      // create canvas and context objects
      dom.find('.picker').each(function(){
        var ctx = this.getContext('2d');
  
        // drawing active image
        var image = new Image();
        image.onload = function () {
          console.log("color picker loaded...");
          ctx.drawImage(image, 0, 0); // draw the image on the canvas
        }
  
        // select desired colorwheel
        var imageSrc = '/iotboard/widgets/led/img/colorwheel.png';
        image.src = imageSrc;
      });
  
      dom.find('.picker').on("click", function(e) { // mouse move handler
        if (true) {
          // get coordinates of current position
          var widget = $(this).closest(".widget");
          var ctx = this.getContext('2d');
          var canvasOffset = $(this).offset();
          var canvasX = Math.floor(e.pageX - canvasOffset.left);
          var canvasY = Math.floor(e.pageY - canvasOffset.top);
  
          // get current pixel
          var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
          var pixel = imageData.data;
  
          // update preview color
          widget.find(".rPrev").css("background-color", "#" + pixel[0].toString(16) + "0000");
          widget.find(".gPrev").css("background-color", "#00" + pixel[1].toString(16) + "00");
          widget.find(".bPrev").css("background-color", "#0000" + pixel[2].toString(16));
  
          // update controls
          widget.find('.rVal').val(pixel[0]);
          widget.find('.gVal').val(pixel[1]);
          widget.find('.bVal').val(pixel[2]);
        }
      });
  
      dom.find('.freqCtrl').change(function(){
          $(this).closest(".controls").find(".freqVal").text($(this).val());
      });
  
      dom.find('.wCtrl').change(function(){
          $(this).closest(".controls").find(".wVal").text($(this).val());
      });
    }
  });

  console.log("add widget {led}");
}();
