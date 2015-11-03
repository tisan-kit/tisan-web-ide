!function(){
  if (!window.iotboard){
    console.log("iotboard not initialized!");
    return;
  }

  var widgetName='humiture';
  window.iotboard.defineWidget(widgetName, {
    status: {
      humiture:'-'
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
        humiture:dom.find('.humiture-text').text()
      }
    },
  });
}();
