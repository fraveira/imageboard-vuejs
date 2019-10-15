(function() {
	new Vue({
		el: '#main',
		data: {
			images: [],
			username: '',
			desc: '',
			title: '',
			file: null
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
		},
		methods: {
			upload: function() {
				console.log(this.username, this.title, this.desc, this.file);
				var fd = new FormData();
				fd.append('image', this.file);
				fd.append('username', this.username);
				fd.append('title', this.title);
				fd.append('desc', this.desc);
				axios.post('/upload', fd).then(function(res) {
					console.log(res);
					// unshift the new image into the array.
				});
			},
			fileSelected: function(e) {
				console.log(e.target.files);
				this.file = e.target.files[0];
			}
		}
	});
})();
