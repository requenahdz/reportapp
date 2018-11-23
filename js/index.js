
$( document ).ready(function() {
  var config = {
    apiKey: "AIzaSyA-kKxNgIANFXh55KttiHfRVzhojKixBhI",
    authDomain: "reportapp-649e1.firebaseapp.com",
    databaseURL: "https://reportapp-649e1.firebaseio.com",
    projectId: "reportapp-649e1",
    storageBucket: "reportapp-649e1.appspot.com",
    messagingSenderId: "960497270778"
  };
  firebase.initializeApp(config);   

     firebase.database().ref("reportes/").orderByChild("fecha").on('value', function(snapshot) {

    	$.each(snapshot.val(), function( index, value ) {
		     var html="<div class='item'>"+
		  		 			"<div class='img' style='background-image: url(img/soriana.png)'></div>"+
		  		 			"<div class='info'>"+
		  		 				"<div class='fecha'>"+value.fecha+"</div>"+
		  		 				"<div class='titulo'>"+value.titulo+"</div>"+
		  		 				"<div class='descripcion'>"+value.descripcion+"</div>"+
		  		 			"</div>"+
		  		 		"</div>";
	   		$('.vistaListaReportes .listaItems').prepend(html);
	    });
	   
  });  	

})





$('#formReporte').submit(function(e){
	e.preventDefault();
	if (validar()) {
		//crear objeto de datos
		var obj= new Object();
		obj.titulo=$('#titulo').val();
		obj.descripcion=$('#descripcion').val();
		obj.fecha=getDay();
		//guardar datos;
		firebase.database().ref('reportes').push().set(obj);
		//Limpiar datos
		limpiarFormulario();
		verLista();
		//
	 }

});

$(document).on('click','#btnGuardar',function(){
	$('#formReporte').submit();
});

function validar(){
	var validado=false;
	if($('#titulo').val().length>0){
		validado=true;
	}else{
		validado=false;
	}

	if($('#descripcion').val().length>0){
		validado=true;
	}else{
		validado=false;
	}
	return validado;
}

$(document).on('click','#btnNuevo',verFormulario);
$(document).on('click','#btnCancelar',verLista);

function verFormulario(){
	$('.vistaListaReportes').hide();
  	$('.vistaNuevoReporte').fadeIn();
}
function verLista(){
   	$('.vistaNuevoReporte').hide();
  	$('.vistaListaReportes').fadeIn();
}
function limpiarFormulario(){
	$('#titulo').val('');
	$('#descripcion').val('');
}



function getDay() {
	function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
	}
  var now = new Date();
    var strDateTime = [[AddZero(now.getDate()), 
        AddZero(now.getMonth() + 1), 
        now.getFullYear()].join("/"), 
        [AddZero(now.getHours()), 
        AddZero(now.getMinutes())].join(":"), 
        now.getHours() >= 12 ? "PM" : "AM"].join(" ");
    return strDateTime;	
}




