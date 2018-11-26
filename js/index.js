
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
     	$('.vistaListaReportes .listaItems').html('');
    	$.each(snapshot.val(), function( index, value ) {
		     var html="<div class='item'>"+
		  		 			"<div class='img' style='background-image: url("+value.url+")'></div>"+
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
		obj.url=$('#url').val();
		obj.fecha=getDay();
		obj.latitude=0;
		obj.longitude=0;

		 if ("geolocation" in navigator){
           navigator.geolocation.getCurrentPosition(function(position){ 
            obj.latitude=position.coords.latitude;
		    obj.longitude=position.coords.longitude;
        });
       }

		//guardar datos;
		firebase.database().ref('reportes').push().set(obj);
		//Limpiar datos
		limpiarFormulario();
		verLista();
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

	if($('#url').val()!='false'){
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
	$('#formReporte')[0].reset();
	$('#titulo').val('');
	$('#descripcion').val('');
	$('#imagen').val('');
	$('#url').val('false');
	$('#vizualizarImagen').css("background-image","url('')").removeClass('activo');
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


  $('#imagen').change(function(e) {
      var file = e.target.files[0],
      imageType = /image.*/;
    
      if (!file.type.match(imageType))
       return;
  
      var reader = new FileReader();
      reader.onload = fileOnload;
      reader.readAsDataURL(file);

      function fileOnload(e) {
      	$('#vizualizarImagen').css("background-image","url('"+e.target.result+"')").addClass('activo');
       }
       var storageRef = firebase.storage().ref();
       var metadata = { contentType: 'image/jpeg'};
       var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);
       uploadTask.on('state_changed', function(snapshot){
       $('#btnAbrirCamara').removeClass('blue black').addClass('black');
       $('#vizualizarImagen .porcentaje').fadeIn();
       var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        $('#vizualizarImagen .porcentaje').html( parseFloat(progress).toFixed(0) + '%');
       switch (snapshot.state) {
       case firebase.storage.TaskState.PAUSED: 
       console.log('Upload is paused');
       break;
       case firebase.storage.TaskState.RUNNING: 
       console.log('Upload is running');
       break;
  }
}, function(error) {

}, function() {

  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
  	$('#btnAbrirCamara').removeClass('blue black').addClass('blue');
  	  $('#vizualizarImagen .porcentaje').fadeOut();
  	$('#url').val(downloadURL);

    console.log('File available at', downloadURL);
  });
});

     });

