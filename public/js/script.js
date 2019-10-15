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
				var myVue = this;
				console.log(this.username, this.title, this.desc, this.file);
				var fd = new FormData();
				fd.append('image', this.file);
				fd.append('username', this.username);
				fd.append('title', this.title);
				fd.append('desc', this.desc);
				axios.post('/upload', fd).then(function(res) {
					console.log('This is the response', res.data);
					myVue.images.unshift(res.data);
					console.log(myVue.images);
					myVue.username = res.data.username;
					myVue.title = res.data.title;
					myVue.desc = res.data.desc;
				});
			},
			fileSelected: function(e) {
				console.log(e.target.files);
				this.file = e.target.files[0];
			}
		}
	});
})();
