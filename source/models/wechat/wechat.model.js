;!function(){
    var getCurrentStatus = function(responseCallback) {
		$.ajax({
			url:'http://freeiot.pandocloud.com/api/device/status/current?identifier='+iotboard.identifier,
			crossDomain:true,
			type:'get',
			success:function(r){
				console.log(r);
				if(r.code!=0){
					alert(r.msg);
				}
				responseCallback(r);
			}
		});
    };
    var setCurrentStatus = function(data,responseCallback) {
		$.ajax({
			type:'post',
			url:'http://freeiot.pandocloud.com/api/device/status/current?identifier='+iotboard.identifier,
			crossDomain:true,
			data:JSON.stringify(data),
			contentType:'application/json',
			success:function(r){
				console.log(r);
				if(r.code!=0){
					alert(r.msg);
				}
				responseCallback();
			}
		});
    }
  if (!window.iotboard){
    console.log("iotboard not initialized!");
    return;
  }

  var model = {};

  /**
   * called when widget's status is changed.
   * @param  {String} widget [the widget name]
   * @param  {String} label  [the widget label to distinguish different widget of same type/name]
   * @param  {Object} status [the new status of widget]
   * @return {None}
   */
  model.onWidgetStatusChanged = function(widget, label, status){
    switch(widget){
      case "motor":
        (function(){
          console.log(JSON.stringify(status));
          var data = {};
          data[label] = [parseInt(status.speed)];
          console.log(data);
          setCurrentStatus(data, function(responseData) {
             console.log("responseData: " + responseData);
          });
        }());
        break;
      case "text":
        (function(){
          console.log(JSON.stringify(status));
          var data = {};
          data[label] = [status.text];
          console.log(data);
          setCurrentStatus(data, function(responseData) {
             console.log("sendCommand callback....");
             console.log("responseData: " + responseData);
          });
        }());
        break;
      case "plug":
        (function(){
          console.log("plug status changed:" + label);
          console.log(JSON.stringify(status));
          var data = {};
          data[label] = status.on?[1]:[0];
          console.log(data);
          setCurrentStatus(data, function(responseData) {
             console.log("sendCommand callback....");
             console.log("responseData: " + responseData);
          });
        }());
        break;
      case "default":
        (function(){
          console.log("defaultstatus changed:" + label);
          console.log(JSON.stringify(status));
          var data = {};
		  data[label]=[];
		  for(var i in status){
			  data[label].push(status[i]);
		  }
          console.log(data);
          window.pando.setCurrentStatus(data, function(responseData) {
            console.log("sendCommand callback....");
            console.log("responseData: " + JSON.stringify(responseData));
          });
        })();
        break;
      case "led":
        (function(){
          console.log("led status changed:" + label);
          console.log(JSON.stringify(status));
          var data = {};
          data[label] = [status['red'],
            status['green'],
            status['blue']];
          console.log(data);
          setCurrentStatus(data, function(responseData) {
            console.log("sendCommand callback....");
            console.log("responseData: " + JSON.stringify(responseData));
          });
        })();
        break;
      default:
        console.log("widget {" + widget + "}" + " handler not found!");
        break;
    }
  }

  /**
   * get widget current status 
   * @param  {String} widget [the widget name]
   * @param  {String} label  [the widget label to distinguish different widget of same type/name]
   * @param  {callback} callback [the result status will be passed through callback(status)]
   * @return {None}
   */
  model.getCurrentStatus = function(widget, label, callback) {
    switch(widget){
      case "text":
        console.log(label);
        (function(){
          getCurrentStatus(function(responseData) {
            var data = responseData.data;
            callback({
              text: data[label][0]
            });
          });
        })();
        break;
      case "plug":
        console.log(label);
        (function(){
          getCurrentStatus(function(responseData) {
            var data = responseData.data;
            callback({
              on: (data[label][0] == 0)?false:true
            });
          });
        })();
        break;
      case "led":
        (function(){
          getCurrentStatus(function(responseData) {
            var status = responseData.data[label];
            callback({
              red: status[1],
              green: status[2],
              blue: status[3]
            });
          });
        })();
        break;
      case "illumination":
        console.log(label);
        (function(){
          getCurrentStatus(function(responseData) {
            var data = responseData.data;
            callback({
              illumination: data[label][0]
            });
          });
        })();
        break;
      case "air":
        console.log(label);
        (function(){
          getCurrentStatus(function(responseData) {
            var data = responseData.data;
            callback({
              mark: data[label][0]
            });
          });
        })();
        break;
      case "pm25":
        console.log(label);
        (function(){
          getCurrentStatus(function(responseData) {
            var data = responseData.data;
            callback({
              pm25: data[label][0]
            });
          });
        })();
        break;
      case "motor":
        console.log(label);
        (function(){
          getCurrentStatus(function(responseData) {
            var data = responseData.data;
            callback({
              speed: data[label][0]
            });
          });
        })();
        break;
      case "temperature":
        console.log(label);
        (function(){
          getCurrentStatus(function(responseData) {
            var data = responseData.data;
			if(!data[label]||!data[label].length||!(data[label][0]>-99&&data[label][0]<99)){
				alert(label+'#temperature发生错误');
				alert(label+' '+JSON.stringify(data));
			}
            callback({
              temperature: data[label][0]
            });
          });
        })();
        break;
      case "humiture":
        console.log(label+"#humiture");
        (function(){
          getCurrentStatus(function(responseData) {
            var data = responseData.data;
			if(!data[label]||!data[label].length||!(data[label][0]>-99&&data[label][0]<101)){
				alert(label+'#humiture发生错误');
				alert(label+' '+JSON.stringify(data));
			}
            callback({
              humiture: data[label][0]
            });
          });
        })();
        break;
      case "thermohygrometer":
        console.log(label);
        (function(){
          getCurrentStatus(function(responseData) {
            var data = responseData.data;
            callback({
              temperature: data[label][0],
              humiture: data[label][1]
            });
          });
        })();
        break;
      case "default":
        console.log(label+'#default# getCurrentStatus');
        (function(){
          window.pando.getCurrentStatus(function(responseData) {
            var data = responseData.data;
			if(!data[label]||!data[label].length){
				alert(label+'#default发生错误');
				alert(label+' '+JSON.stringify(data));
			}
			var r={
			};
			for(var i in data[label]){
				r['default'+i]=data[label][i];
			}
            callback(r);
          });
        })();
        break;
      default:
        console.log("widget {" + widget + "}" + " handler not found!");
        break;
    }
  }

  window.iotboard.setModel(model);
}();
