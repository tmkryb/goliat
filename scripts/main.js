require.config({
    paths: {
        jquery: 'http://code.jquery.com/jquery-2.1.0.min'
    }
});

define('jquery-private', ['jquery'], function (jq) {
    return jq.noConflict( true );
});


require(["jquery-private"], function(jQuery){
	jQuery("#testButton").click(function(){
		alert("Script loading is working very fine!");
	})	
});