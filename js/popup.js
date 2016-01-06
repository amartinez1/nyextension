$(document).ready(function() {
	//Model Definition
	var HomeArticle = Backbone.Model.extend({
	});

	//Collection Definition
	var HomeArticleList	= Backbone.Collection.extend({
		model: HomeArticle,
		url: URL_ROOT +'topstories/v1/home.json?api-key='+ TOP_STORIES_KEY,
		parse: function( data, options) {
			var homeArticles = [];
			_.each(data.results, function(article) {
				var homeArticle = {};
				homeArticle.section = article.section;
				homeArticle.title = article.title;
				homeArticle.url = article.url;
				homeArticle.author = article.byline;

				if (article.multimedia !== undefined && article.multimedia !== "") {
					homeArticle.imgUrl = article.multimedia[1].url;
				} else {
					homeArticle.imgUrl = 'img/default-news-img.png';
				}

				homeArticles.push(homeArticle);
			});

			return homeArticles;
		}
	});

	//View
	var HomeArticlesView = Backbone.View.extend({
		articles: undefined,
		el: '#app-container',
		events: {
			'click .story-container': 'goToArticle'
		},

		initialize: function() {
			var self = this;
			var HomeArticles = new HomeArticleList();
			HomeArticles.fetch({
				success: function(collection, response, options) {
					self.articles = collection;
					self.render();					
				},

				error: function(collection, response, options) {

				}
			});
		},

		render: function() {
			var source = $('#stories').html();
			var template = Handlebars.compile(source);
			var html = template({articles: this.articles.models});
			this.$el.html(html);
		},

		goToArticle: function(e) {
			var currentTarget = e.currentTarget;
			var cid = $(currentTarget).data('story-id');
			var article = this.articles.get(cid);
			window.open(article.attributes.url);
		}
	});

	// Kick off the App
	var homeArticleView = new HomeArticlesView();
});