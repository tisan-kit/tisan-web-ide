!function(){
  if (!window.iotboard){
    console.log("iotboard not initialized!");
    return;
  }

  var cnt = 0;

  window.iotboard.defineWidget("plug", {
    status: {
      on: false
    },
    render: function(dataset){
      cnt ++;
      var dataset=clone(dataset);
      dataset.status=this.status;
      dataset.cnt=cnt;
      return template('template-plug',dataset);
    },
    listeners: [
      {
        selector: ".plug-wrap label",
        event: "click",
        behavior: "set"
      }
    ],
    parseStatus: function(dom){
      return {
		  on: dom.find(".slider-v1").is( ":checked" )?0:1
      }
    },
  });

  console.log("add widget {plug}");
}();
