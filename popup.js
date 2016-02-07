chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    var html_source = request.source;
	//get all the comment
	var result_source = html_source.match(/<span class="description item">(.*?)<\/span>/gi).toString();	
	//message.innerText = result_source;
	
	//key word array
	var key_word_list = ["insurance","agent","service","customer","claims","call","money","policy","accident","Agent","good","adjuster","treated","service","paperwork","payment","premium","helpful","friendly","don't","cancelled","blame","bad","wouldn't","terminated","ridiculous","problem","nothing","negative"];
	
	//init the hashmap
	var obj_list = new Object;
	var i = 0;
	var result_str = "";

	for(i = 0; i < key_word_list.length; i++){
		var re = new RegExp(key_word_list[i], 'g');
		if(result_source.match(re) != null){
			size1 = result_source.match(re).length;
			if(size1 > 10){
				obj_list[key_word_list[i]] = size1;
			}else{
				obj_list[key_word_list[i]] = 0;
			}
		}else{
			obj_list[key_word_list[i]] = 0;
		}
		//message.innerText += obj_list[key_word_list[i]].toString(),
	}

	//store the arry and object used for display histogram and word cloud
	var final_result = [];
	var final_array = [];
	function mydata(text, weight){
		this.text = text;
		this.weight = weight;
	}

	i = 0;
	for (key1 in obj_list){
		if(obj_list[key1] > 0){
			//document.write(obj_list[key1] + " " + key1 + "<br>");
			final_array.push(key1);
			final_result[i] = new mydata(key1, obj_list[key1]);
			i += 1;
		}
	}
	//draw graph
	//word cloud
	$('#demo-simple').jQCloud(final_result);

	//histogram
	i = 0;
	num_arr = [];
	name_arr = [];
	for(i = 0; i < final_result.length; i++){
		num_arr.push(final_result[i].weight);
		name_arr.push(final_result[i].text);
	}
	var svg_width = 400;
	var svg_height = 200;
	var bar_padding = 2;
	var dataset = num_arr;
	var svg = d3.select("body")
	        .append("svg")
	        .attr("width", svg_width)
	        .attr("height", svg_height);
	svg.selectAll("rect").data(dataset).enter().append("rect")
		 .attr("x", function(d, i) {
            return i * (svg_width / dataset.length);
         })
         .attr("y", function(d) {
            return svg_height - (d * 4);
         })
         .attr("width", svg_width / dataset.length)
         .attr("width", svg_width / dataset.length - bar_padding)
         .attr("height", function(d) {
            return d * 4;
         })
         .attr("fill", function(d) {
		  	return "rgb(" +  d*5 + ",0 ,0 )";
		 });

    svg.selectAll("text")
   		.data(dataset)
   		.enter()
   		.append("text")
   		.text(function(d) {
		  return d;
		})
		.attr("x", function(d, i) {
		  return i * (svg_width / dataset.length) + (svg_width / dataset.length  - bar_padding) / 2;
		})
		.attr("y", function(d) {
		  return svg_height - (d * 4) + 20;
		})
		.attr("text-anchor", "middle")
		.attr("x", function(d, i) {
		  return i * (svg_width / dataset.length) + (svg_width / dataset.length - bar_padding) / 2;
		})
		.attr("y", function(d) {
	        return svg_height - (d * 4) + 20;
	     })
	     .attr("font-family", "sans-serif")
	     .attr("font-size", "20px")
	     .attr("fill", "white");

  }
});

function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;
