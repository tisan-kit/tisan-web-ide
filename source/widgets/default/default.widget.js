!function(){
  if (!window.iotboard){
    console.log("iotboard not initialized!");
    return;
  }

  var widgetName='default';
  window.iotboard.defineWidget(widgetName, {
    status: {
      'loading':''
    },
    render: function(dataset){
		console.log(dataset);
		var id=dataset.id;
		var no=dataset.no;

		var w;
		for(var i in addedWidgets.objects){
			if(addedWidgets.objects[i].id==id&&addedWidgets.objects[i].no==no){
				w=clone(addedWidgets.objects[i]);
				break;
			}
		}
		for(i in dataset.status){
			w.status[i]=dataset.status[i];
		}
		console.log(w);
        return template('template-'+widgetName,w);
    },
    listeners: [
      {
        selector: ".btn-set",
        event: "click",
        behavior: "set"
      },
      {
        selector: ".btn-refresh",
        event: "click",
        behavior: "get"
      }
    ],
    parseStatus: function(dom){
		var res={
		};
		dom.find('.default-status-wrap').each(function(){
			res[$(this).find('.default-status-name').text()+'']=$(this).find('.default-status-input').val();
		});
		return res;
	},
  });
}();
