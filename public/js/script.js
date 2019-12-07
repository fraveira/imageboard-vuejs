(function() {
	Vue.component('first-component', {
		template: '#template',
		data: function() {
			return {
				images: [],
				username: '',
				desc: '',
				title: '',
				url: '',
				comments: [],
				created_at: '',
				usercmt: '',
				comment: ''
			};
		},
		props: [ 'postTitle', 'selectedPic' ],
		mounted: function() {
			var myVue = this;
			axios
				.get(`/images/${this.selectedPic}`)
				.then(function(resp) {
					myVue.images = resp.data;
					if (myVue.images.length === 8) {
						myVue.showButton = false;
					}
				})
				.catch(function(e) {
					console.log(e);
				});

			axios
				.get(`/comment?id=${this.selectedPic}`)
				.then(
					function(resp) {
						myVue.comments = resp.data;
					}.bind(myVue)
				)
				.catch(function(err) {
					console.log('This is an error fetching the comments', err);
				});
		},
		watch: {
			selectedPic: function() {
				var myVue = this;
				axios
					.get(`/images/${this.selectedPic}`)
					.then(function(resp) {
						myVue.images = resp.data[0];
					})
					.catch(function(e) {
						console.log(e);
					});
			}
		},
		methods: {
			closeModal: function() {
				console.log('emitting from the component...');
				this.$emit('close', true);
			},
			submitComment: function() {
				var myVue = this;
				let commentContent = {
					currImg: this.selectedPic,
					usercmt: this.usercmt,
					comment: this.comment
				};
				axios.post('/comment', commentContent).then(function(resp) {
					myVue.comments.unshift(commentContent);
				});
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
			selectedPic: location.hash.slice(1),
			showButton: true
		},
		created: function() {
			console.log('created');
		},
		mounted: function() {
			console.log('mounted');
			var myVue = this;
			axios
				.get('/images')
				.then(function(resp) {
					myVue.images = resp.data;
				})
				.catch(function(e) {
					console.log(e);
				});
			addEventListener('hashchange', function() {
				myVue.selectedPic = location.hash.slice(1);
			});
		},
		updated: function() {
			console.log('updated');
		},
		methods: {
			closeMe: function() {
				this.selectedPic = false;
				location.hash = '';
				history.replaceState(null, null, ' ');
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
				this.selectedPic = id;
			},
			moreImages: function() {
				var myVue = this;
				let lastId = this.images.slice(-1)[0].id;
				axios.get(`/moreimages/${lastId}`).then(function(res) {
					console.log('What is res.data?', res.data);
					for (let i = 0; i < res.data.length; i++) {
						if (res.data[i].id === res.data[i].lowest_id) {
							myVue.showButton = false;
						}
						myVue.images.push(res.data[i]);
					}
				});
			}
		}
	});
})();
