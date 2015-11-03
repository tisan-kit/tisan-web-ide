$(document).ready(function(){
	window.initIot=function(){
  if (!window.iotboard){
    console.log("iotboard not initialized!");
    return;
  }
  var iotboard = window.iotboard;
  var model = iotboard.getModel();

  console.log("parsing dom for bindings...");
  $("div.widget").each(function(){
    var self = $(this);
    var name = self.attr("iotb-widget");
    var widget = iotboard.newWidget(self, name);
    if (widget == null) {
      console.log("init widget {" + name + "} failed.");
      return;
    }

    console.log("rendering default widget " + name + "...");
	var id=$(this).attr('data-id');
	var no=$(this).attr('data-no');
	var w;
	for(var i in addedWidgets.objects){
		if(addedWidgets.objects[i].id==id&&addedWidgets.objects[i].no==no){
			w=addedWidgets.objects[i];
			break;
		}
	}
	widget.statuses={
	};
	for(var i in w.status){
		widget.statuses[i]=w.status[i];
	}

    widget.render();

    console.log("binding widget" + name + "...");
    if (widget.config.listeners){
      for(var i=0; i<widget.config.listeners.length; i++) {
        (function(l){
          widget.dom.on(l["event"], l["selector"], function(e){
            console.log("listener " + l["event"] + " fired.");
            switch (l["behavior"]){
              case "set":
                widget.config.status = widget.config["parseStatus"](widget.dom);
                iotboard.getModel().onWidgetStatusChanged(widget.dom.attr("iotb-widget"), widget.dom.data("label"), widget.config.status);
                break;
              case "get":
                console.log("updating widget " + name + "...");
                model.getCurrentStatus(name, self.data("label"), function(status){
                  widget.status = status;
                });
                break;
            }
            
          })
        })(widget.config.listeners[i]);
      }
    }

    console.log("updating widget " + name +  ":" + JSON.stringify(self.data("label")) + "...");
    model.getCurrentStatus(name, self.data("label"), function(status){
      widget.status = status;
    })
  });

  console.log("end parsing dom for bindings...");
	};
});
