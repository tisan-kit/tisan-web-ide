!function(){
  if (!window.iotboard){
    console.log("iotboard not initialized!");
    return;
  }

  window.iotboard.defineWidget("atmosphere", {
    status: {
      temperature: 0.0,
      humidity: 0.0,
      pm25: 0.0
    },
    render: function(dataset){
        var dataset=clone(dataset);
        dataset.status=this.status;
        return template('template-atmosphere',dataset);
    }
  });

  console.log("add widget {atmosphere}");
}();
