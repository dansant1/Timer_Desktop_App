FlowRouter.route('/', {
	name: 'home',
	action() {
		BlazeLayout.render('index')
	}
});