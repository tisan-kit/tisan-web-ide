!function(){
  if (!window.iotboard){
    console.log("iotboard not initialized!");
    return;
  }

  var widgetName='pm25';
  window.iotboard.defineWidget(widgetName, {
    status: {
      pm25:'-'
    },
    render: function(dataset){
        var dataset=clone(dataset);
        dataset.status=this.status;
        return template('template-'+widgetName,dataset);
    },
    listeners: [
      {
        selector: ".btn-refresh",
        event: "click",
        behavior: "get"
      }
    ],
    parseStatus: function(dom){
      return {
        on: dom.find(".pm25").val()
      }
    },
  });
}();
