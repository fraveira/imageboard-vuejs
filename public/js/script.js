(function() {
	Vue.component('first-component', {
		template: '#template',
		data: function() {
			return {
				images: [],
				username: '',
				desc: '',
				title: ''
			};
		},
		props: [ 'postTitle', 'selectedPic' ],
		mounted: function() {
			var myVue = this;
			axios.get(`/images/${this.selectedPic}`).then(function(resp) {
				myVue.images = resp.data[0];
			});
		},
		methods: {
			closeModal: function() {
				console.log('emitting from the component...');
				this.$emit('close', true);
			}
		}
	});

	new Vue({
		el: '#main',
		data: {
			images: [],
			username: '',
			desc: '',
			title: '',
			file: null,
			selectedPic: null
		},
		created: function() {
			console.log('created');
		},
		mounted: function() {
			console.log('mounted');
			var myVue = this;
			axios.get('/images').then(function(resp) {
				myVue.images = resp.data;
			});
		},
		updated: function() {
			console.log('updated');
		},
		methods: {
			closeMe: function(count) {
				console.log('Closing thingies, CloseMe running');
				this.selectedPic = null;
			},
			upload: function() {
				var myVue = this;
				var fd = new FormData();
				fd.append('image', this.file);
				fd.append('username', this.username);
				fd.append('title', this.title);
				fd.append('desc', this.desc);
				axios.post('/upload', fd).then(function(res) {
					myVue.images.unshift(res.data);
					myVue.username = res.data.username;
					myVue.title = res.data.title;
					myVue.desc = res.data.desc;
				});
			},
			fileSelected: function(e) {
				this.file = e.target.files[0];
			},
			imageClicked: function(id) {
				// .0console.log(id); // This works, it shows the image id we clicked in.
				this.selectedPic = id;
			}
		}
	});
})();
