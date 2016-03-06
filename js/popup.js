$(document).ready(function() {
	var TOP_STORIES_URL = '*********/topstories/';

	function extractResponseInfo(response){
		//Because the name of the response changes constantly, extract the first attribute of the response
		//then use that name to access the results
		var extractedResponse;

		if(response !== undefined) {
			var responseName = Object.keys(response)[0];
			 extractedResponse = response[responseName];
		} else {
			//nothing?
		}
		return extractedResponse;
	}

	//Model Definition
	var HomeArticle = Backbone.Model.extend({
		parse: function(response) {
			var homeArticle = {};
			homeArticle.section = response.section;
			homeArticle.title = response.title;
			homeArticle.url = response.url;
			homeArticle.author = response.byline;

			if (response.multimedia !== undefined && response.multimedia !== "") {
				homeArticle.imgUrl = response.multimedia[1].url;
			} else {
				homeArticle.imgUrl = 'img/default-news-img.png';
			}

			return homeArticle;
		}
	});

	//Collection Definition
	var HomeArticleList	= Backbone.Collection.extend({
		model: HomeArticle,
		url: TOP_STORIES_URL,
		parse: function(data, options) {
			var homeArticles = [];
			var response = extractResponseInfo(data);
			homeArticles = response.results;
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
					self.articles.copyright = extractResponseInfo(response).copyright;
					self.render();					
				},

				error: function(collection, response, options) {
					// nothing?
				}
			});
		},

		render: function() {
			var source = $('#stories').html();
			var template = Handlebars.compile(source);
			var html = template({articles: this.articles});
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