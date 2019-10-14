(function() {
	new Vue({
		el: '#main',
		data: {
			images: [] // Or whatever you do to call imageurls.
		},
		created: function() {
			console.log('created');
		},
		mounted: function() {
			console.log('mounted');
			var myVue = this;
			axios.get('/images').then(function(resp) {
				console.log(resp.data);
				myVue.images = resp.data; // This should come from JSON or from DB.
			});
		},
		updated: function() {
			console.log('updated');
		}
	});
})();
