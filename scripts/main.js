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

	jQuery("#ajaxPostTest").click(function(){
		jQuery("#ajaxForm").show();
	})

	jQuery("#ajaxFormTest").click(function(){
		jQuery("#ajaxFormForm").show();
	})


	jQuery("#postIt").click(function(){
		jQuery.ajax({
			url: "/home/loop",
			method: "POST",
			data: {
				"name": jQuery("#name").val(),
				"nick": jQuery("#nick").val(),
				"isImpresed": jQuery("#isImpresed").is(':checked'),
			},
			success: function(result){
				if(result.isImpresed === "true")
					alert("Oh my! Someone is impressed about my work! Thank you " + result.name);
				else
					alert("Ohh... I will try harder! See you next time " + result.name + "!");
			}
		});
	})
});