!function(){
  if (!window.iotboard){
    console.log("iotboard not initialized!");
    return;
  }

  var widgetName='thermohygrometer';
  window.iotboard.defineWidget(widgetName, {
    status: {
      thermometer:'-',
      hygrometer:'-'
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
        thermometer:dom.find('.thermometer').text(),
        hygrometer:dom.find('.hygrometer').text()
      }
    },
  });
}();
