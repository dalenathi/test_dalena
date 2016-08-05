/*
*Http REST interface - Requires Node.js, and Express 
*Responds to GET requests wiith get parameters made at /api route
*Usage: 
localhost:3000/api?url=http://URL_to_get_base_json_from
*Example:
localhost:3000/api?https://gist.githubusercontent.com/ktilcu/ef1d416279e453389c5d4cf1e6fb708b/raw/277ca28a0999ce99ace12e2f1493dc85682e0d38/CreativeFamily.json

*/

var express = require('express');
var app = express();


app.get('/api/flat', function(req, res){

	var url = req.param('url');
	console.log('this');
	console.log(url);
	var getvs = new createFlatWidgets(url); 
	var flats = getvs.createFlat(getvs.getJson()['assets'], getvs.getKey('widgets')); 
	var output = {"flattenedWidgets" : flats} ; 

	//console.log(flats.length);
 
res.json(output);
  

});


var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Api is now listening at http://%s:%s", host, port)

})

/* include class to fin */ 

var createFlatWidgets = function (url_string) {
								this.url = url_string; 
								var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
								var xhr = new XMLHttpRequest();
								xhr.open("GET", this.url , false);
								xhr.send();
								if (xhr.status === 200) {
									this.jsonResponse = JSON.parse(xhr.responseText) ; 
								}
								
								// console.log(xhr.responseText);
								else {
									//throw new Error(xhr.statusText);
									console.log(xhr.statusText);
									throw new Error();
									

								}

							}

createFlatWidgets.prototype.getJson = function(){
	//console.log(this.got) ; 
	return this.jsonResponse ; 

}

createFlatWidgets.prototype.createFlat = function (assets, widgets) { 
 	//takes an array of assets and an array of widgets and returns 
 	//returns an union of matching asset and widget as flattened widget 
 	//assets =[{}, {}, {}] , widgets =[{}, {}, {}, ...]
 	
				 	function Flat(object_assets, object_widgets){
				    /*
				    *Takes two objects and creates a union of a, b such that "keys that are in A but Not in B are inserted into B". 
				    * to dos : input validation
				    *
				    */
				    
				    
				    for(var i in object_assets){
				        //if widgets has the same property 
				        if (object_widgets.hasOwnProperty(i)){
				            //do nothing at this time. 
				        }
				        else{
				            //insert into object_assets 
				            object_widgets[i] = object_assets[i] ; 
				        }
				    }//for loop 
				    delete object_widgets['asset-uuid']; 
				    return object_widgets 
				    
				};// function create flat. a generic function. 

    var hold =[]; 

 	for (var i = widgets.length - 1; i >= 0; i--) {
 		//loop through the assets now. 
 		//widgets[i]
 		var check = 0; 
 		for (var j = assets.length - 1; j >= 0; j--) {
 			if (widgets[i]['asset-uuid'] === assets[j]['uuid']){
 				//create flat widget 
 				hold.push(Flat(assets[j],widgets[i] ))
 				check = 1; 
 				break; 
 			}
 			else{
 				//do nothing
 			}

 		}//assets 
 		if (check === 0){ //matching asset not found. 
 			delete widgets[i]['asset-uuid']; 
 			 hold.push(widgets[i]);
 		}

 	}//for loops 

return hold;
}

createFlatWidgets.prototype.getKey = function(key_name) {

	//return an array of keys matching the string ='key_name'
	var parsed_json =  this.jsonResponse ;
	

	var placeholder =[]; 
	
	var x = function findKeys(parsed_json, key_string, placeholder) { 
    /*
    *Given an input object, finds all matching keys to given string ('widgets') and applies a callback function (required)
    *To dos: input validation, nested 'widgets'
    */
    //console.log(placeholder);

    for (var i in parsed_json) {
        
        if (i === key_string){
            /* immediately return widgets */
            
            var widget = parsed_json[i]; 
            //console.log(widget) ; 
            
            /* iterate further if widget contains another array of widgets */ 
            
            if (Array.isArray(widget) == false) {
                
                /*do something */ 
            
                placeholder.push(widget) ; 
  				//console.log(placeholder) ; 
            }
            
            
            else { 
                    for (var w=0; w<widget.length; w++){
                
                        /*do something */ 
                    
                        placeholder.push(widget[w]);
  						//console.log(placeholder) ; 
                        
                        }
            }
            
        }//if i = widget 

        else {

            /* check if the key points to an 'object', or an 'array'. we will be calling the same function
            /and expecetd input is an object. 
            /*to do : Generalize for any iterable. 
            
            */

                    if (parsed_json[i] !==null && typeof parsed_json[i] === 'object' 
                                                 && !(Array.isArray(parsed_json[i])) ) {
                                                                                         
                        var new_ob = parsed_json[i]; 
                        findKeys(new_ob, key_string, placeholder); //simply call the function again


                    } 
            
                    if (Array.isArray(parsed_json[i])) {
                        for (var j in parsed_json[i]){
                            
                            var new_ob = parsed_json[i][j]; 
                            findKeys(new_ob, key_string, placeholder); //simply call the function again
                        }
                    }


        } //else 

    }//for loop

}; // findKeys

x(parsed_json, key_name, placeholder);

/* 
this.keys = placeholder; 
return this.keys ;
*/
return placeholder; 

};

/* potentially include as a module */
//module.exports = createFlatWidgets