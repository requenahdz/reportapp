
 var latitude=0;
 var longitude=0;
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
    $('select').formSelect();
    $.each(snapshot.val(), function( index, value ) {
		var html="<div class='item' data-value='"+JSON.stringify(value)+"'>"+
		  		    "<div class='img' style='background-image: url("+value.url+")'></div>"+
		  		 		"<div class='info'>"+
		  		 			"<div class='fecha'>"+value.fecha+"</div>"+
		  		 			"<div class='titulo'>"+value.titulo+"</div>"+
		  		 			"<div class='descripcion'>"+value.descripcion+"</div>"+
		  		 		"</div>"+
		  		 	"</div>";
	   	$('.vistaListaReportes .listaItems').prepend(html);
	});

	if ("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition(function(position){ 
            longitude=position.coords.longitude
            latitude=position.coords.latitude;
        });
    }

  });  	
});


$('#formReporte').submit(function(e){
	e.preventDefault();
	if (validar()) {
		//crear objeto de datos
		var obj= new Object();
		obj.titulo=$('#titulo').val();
		obj.descripcion=$('#descripcion').val();
		obj.url=$('#url').val();
		obj.fecha=getDay();
		obj.prioridad=$('#prioridad').val();;
		obj.longitude=longitude;
		obj.latitude=latitude;

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
	var v1=false, v2=false,v3=false;
	if($('#titulo').val().length>0){
		v1=true;		
	}
	if($('#url').val()!=='false'){
		v2=true;
	}
	if($('#prioridad').val().length>0){
		v3=true;
	}
	return v1 && v2 && v3;
}

$(document).on('click','.brand-logo',verLista)
$(document).on('click','#btnNuevo',verFormulario);
$(document).on('click','#btnCancelar',verLista);
$(document).on('click','.listaItems .item',function(e){
	$('.vistaNuevoReporte').hide();
  	$('.vistaListaReportes').hide();
    $('.vistaDetalle').fadeIn();
     var datos=$(this).data('value');
    $('.vistaDetalle .titulo').html(datos.titulo);
    $('.vistaDetalle .prioridad').html(datos.prioridad);
    $('.vistaDetalle .descripcion').html(datos.descripcion);
    $('.vistaDetalle .imagen').css("background-image","url('"+datos.url+"')");
    $('.vistaDetalle .enlace').attr('href',datos.url);
});


function verFormulario(){
	   $('.vistaDetalle').hide();
	$('.vistaListaReportes').hide();
  	$('.vistaNuevoReporte').fadeIn();
}
function verLista(){
	   $('.vistaDetalle').hide();
   	$('.vistaNuevoReporte').hide();
  	$('.vistaListaReportes').fadeIn();
  	limpiarFormulario();
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

