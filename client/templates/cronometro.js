import { Session } from 'meteor/session';

Template.cronometro2.onRendered(function () {
	if(localStorage.startCr=="1"){

		chronometer.seconds = Number(localStorage.seconds)
		chronometer.minutes = Number(localStorage.minutes)
		chronometer.hours = Number(localStorage.hours)
		chronometer.element = ".hora-crono";

		if(localStorage.pause!="0")	{
			$(".boton-play").find("i").removeClass("glyphicon-play").addClass("glyphicon-pause");
			$(".boton-play").removeClass("boton-play").addClass("boton-stop")
			chronometer.timer();
		}


		$(".hora-crono")[0].textContent = (chronometer.hours ? (chronometer.hours > 9 ? chronometer.hours : "0" + chronometer.hours) : "00") + "h " + (chronometer.minutes ? (chronometer.minutes > 9 ? chronometer.minutes + "m" : "0" + chronometer.minutes + "m") : "00m");


	}

})


Template.cronometro2.events({
	'click .boton-play'(){
		$(".boton-play").find("i").removeClass("glyphicon-play").addClass("glyphicon-pause");
		$(".boton-play").removeClass("boton-play").addClass("boton-stop")
		chronometer.element = ".hora-crono";
		chronometer.timer();
		Session.set("cronometro-pausado",false);
		$('.cd-stretchy-nav.add-content .g').toggleClass('red-flat');

	},
	'click .boton-stop'(){
		$(".boton-stop").find("i").removeClass("glyphicon-pause").addClass("glyphicon-play");
		$(".boton-stop").removeClass("boton-stop").addClass("boton-play")
		chronometer.stop();
		Session.set("cronometro-pausado",true);
		$('.cd-stretchy-nav.add-content .g').toggleClass('red-flat');
	},

	'click .boton-resetear'(){
		swal({  title: "¿Segúro que quieres resetear el cronómetro?",
				text: "El tiempo transcurrido ya no estara disponible",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#e74c3c",
				confirmButtonText: "Si, resetear",
				cancelButtonText: "No, cancelar",
				closeOnConfirm: true
			},
			function() {
				chronometer.reset();
				if(!$(".boton-principal").hasClass("boton-play")){
					$('.cd-stretchy-nav.add-content .g').toggleClass('red-flat');
					$(".boton-stop").find("i").removeClass("glyphicon-pause").addClass("glyphicon-play");
					return $(".boton-stop").removeClass("boton-stop").addClass("boton-play")
				}
				//swal("Horas eliminadas", "El cronometro se reinicio correctamente", "success");
			});

	},
	'click .boton-disminuir'(){
		chronometer.removeMinutes(5)
	},
	'click .boton-aumentar'(){
		chronometer.addMinutes(5)
	},
	'click .boton-agregar-hora'(){
		$(".boton-stop").find("i").removeClass("glyphicon-pause").addClass("glyphicon-play");
		$(".boton-stop").removeClass("boton-stop").addClass("boton-play")
		chronometer.stop();
		Session.set("cronometro-pausado",true);

		Modal.show('agregarHoras');

	},
	'click .boton-guardar-hora'(){

		if(localStorage.startCr=="1"){
			/*var datos = {
				bufeteId : Meteor.user().profile.bufeteId,
				horas: chronometer.hours+"",
				minutos: chronometer.minutes+"",
				fecha: new Date(),
				creador: {
					id: Meteor.user()._id,
					nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
				},
				responsable:{
					id: Meteor.user()._id,
					nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
				}
			}*/

			/*return Meteor.call('agregarHoraSinDetalles',datos,function (err) {
				//debugger;
				if(err) return //Bert.alert('Error al momento de crear las horas','danger');
				chronometer.reset();
				if(!$(".boton-principal").hasClass("boton-play")){
					$(".boton-stop").find("i").removeClass("glyphicon-pause").addClass("glyphicon-play");
					$(".boton-stop").removeClass("boton-stop").addClass("boton-play")
				}

				//Bert.alert('Se creo las horas correctamente','success');
				//FlowRouter.go('/facturacion/horas')
			})*/
		}

		//Bert.alert('Inicie el cronometro para guardar las horas','danger');

	}

});

Template.agregarHoras.onRendered(function () {
	//debugger;
	let template = this;
	if(Session.get("cronometro-pausado")){
		$(template.find("[name='horas']")).val(chronometer.hours);
		$(template.find("[name='minutos']")).val(chronometer.minutes);
	}
});

Template.agregarHoras.events({
	'change [name="asunto"]'(event,template){
		Session.set('asunto-select-id',event.target.value);
	},
	'click .agregar-trabajo': function (event, template) {
		event.preventDefault();
		// debugger;
		let datos = {
			descripcion: template.find('[name="descripcion"]').value,
			fecha: template.find('[name="fecha"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			horas: template.find('[name="horas"]').value,
			minutos: template.find('[name="minutos"]').value,
			cobrado: $(".cobrado").is(":checked"),
			esTarea: $(".es-tarea").is(":checked"),
			creador: {
				id: Meteor.user()._id,
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
			}
		}


		// debugger;
		datos.asunto = {
			nombre: Asuntos.findOne({_id:template.find(".asunto").value}).caratula,
			id: template.find(".asunto").value
		}

		datos.responsable = {
			nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
			id: Meteor.userId()
		}

		if (datos.horas !== "" && datos.asunto !== undefined && datos.fecha !== "") {

			if (datos.minutos === "") {
				datos.minutos = 0;
			}


			BUNQR.call('agregarHora', datos, function (err, result) {
				if (err) {

					return Bert.alert('Algo salió mal, vuelve a intentarlo', 'warning');
					Modal.hide('agregarHoras');
				}

				if(Session.get("cronometro-pausado")) chronometer.reset();
				Modal.hide('agregarHoras');
				Bert.alert('Agregaste horas', 'success');
			});

		} else {
			Bert.alert('Completa los datos, y luego vuelve a intentarlo', 'warning');
		}
	}
});