!function(){
  if (!window.iotboard){
    console.log("iotboard not initialized!");
    return;
  }

  window.iotboard.defineWidget("text", {
    status: {
      text: "loading..."
    },
    render: function(dataset){
        var data=clone(dataset);
        data.status=this.status;
        return template('template-text',data);
    },
    listeners: [
      {
        selector: ".text",
        event: "click",
        behavior: "set"
      },
      {
        selector: ".title",
        event: "click",
        behavior: "get"
      }
    ],
    parseStatus: function(dom){
      return {
        text: dom.find(".text").html()
      }
    },
  });

  console.log("add widget {text}");
}();
