import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { DDP } from 'meteor/ddp-client';

import './main.html';

const BUNQR = DDP.connect('http://localhost:5000');
//const BUNQR = DDP.connect('https://bunqr.grupoddv.com');

Horas = new Mongo.Collection('horas', BUNQR); 

Template.index.onCreated(function () {});

Template.index.helpers({
	estaLogeado() {
		if ( BUNQR.userId() ) {
			return true;
		} else {
			return false;
		}
	},
	misHoras() {
		return Horas.find({}, {sort: {fecha: -1}});
	},
	sucedio(fecha) {
		let dia = new Date()
		if (fecha.getDay() === dia.getDay()) {
			return 'Hoy';
		} else {
			return fecha.toISOString().substring(0, 10);		
		}
	}
});

Template.index.events({
  
  'submit form': function (e, template) {
  	e.preventDefault();
  	let datos = {
  		email: template.find('[name="email"]').value,
  		password: template.find('[name="password"]').value
  	}

  	if (datos.email !== "" && datos.password !== "") {
  		BUNQR.call("login", 
	{
        "password": datos.password,
        "user" : {
            "email": datos.email
        }
    },
   	function(err,result) {
    	if (err) {
    		console.log(err);
    	} else {
    		BUNQR.setUserId(result.id);

    			console.log('funciona');
    			console.log(BUNQR.userId());

    			BUNQR.subscribe('MisHoras', function() {
  					var horas = Horas.find();
  					console.log(horas.fetch().length);  
				});	
    		}
    	});
  	}
  }
 
	
});

Template.index.onRendered(function () {
	if( $('.cd-stretchy-nav').length > 0 ) {
		//var stretchyNavs = $('.cd-stretchy-nav.e');
		var stretchyNavs2 = $('.cd-stretchy-nav');
		

		stretchyNavs2.each(function(){
			var stretchyNav = $(this),
				stretchyNavTrigger2 = stretchyNav.find('.cd-nav-trigger.t');

			stretchyNavTrigger2.on('click', function(event){
				event.preventDefault();
				console.log('Funciona');
				$('.cd-stretchy-nav.add-content .g').toggleClass('red-flat');
			});

		});
	}
});
