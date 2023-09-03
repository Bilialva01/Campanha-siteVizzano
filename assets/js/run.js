if (!window.jQuery || !window.CORE || !window.APP) {
	throw new Error('Dependency not found: jQuery, CORE or APP', location.href, 0);
}

jQuery(document).ready(function () {
	try {

		APP.menu();
		APP.loader();
		APP.showHideNewsletter();
		APP.formNewsValidate();

		/***********************************************************************
		 * HOME
		 **********************************************************************/
		if (jQuery('#home').size() > 0) {			
			//APP.feedInstagram();

			//Video
			var video = document.getElementById("video");
			video.autoplay = true;
			video.load();
			
			//APP.initCycle('.cycle');
			//APP.slickSlider('.slickLinks', 3, 3, 1, 1); //element, toShowFull, toShow1024, toShow780, toShow640
		}

		/***********************************************************************
		 * COLEÇÃO
		 **********************************************************************/
		if (jQuery('#colecao').size() > 0) {
			APP.productList();
			APP.restrictProductSearch();
		}

		/***********************************************************************
		 * PRODUTO
		 **********************************************************************/
		if (jQuery('#produto').size() > 0) {
			APP.slickSlider('.slickCores', 3, 3, 3, 3);
			APP.slickSlider('.slickProdutos', 3, 3, 2, 1);
			APP.slickSlider('.slickCombinacao', 3, 3, 3, 3);
			APP.productWhereToFind();

			setTimeout(function(){
				APP.productChangeColor();
			}, 300);
			
			APP.formStoreValidate();
			APP.restrictProductSearch();
			//APP.sortStories();
		}

		/***********************************************************************
		 * ENCONTRE
		 **********************************************************************/
		if (jQuery('#encontre').size() > 0) {
			APP.productWhereToFind();
			APP.formStoreValidate();
			APP.listOfStorePhones();
			APP.scrollWhereToFind();
			APP.slickSlider('.listShowrooms', 1, 1, 1, 1);
			APP.sortStories();
		}

		/***********************************************************************
		 * CAMPANHA
		 **********************************************************************/
		if (jQuery('#campanha').size() > 0) {
			APP.playVideo();
			APP.slickSlider('.slickFotos', 3, 3, 2, 2);
			APP.initFancybox('.fancybox');
		}

		/***********************************************************************
		 * CONTATO
		 **********************************************************************/
		if (jQuery('#contato').size() > 0) {
			APP.formContactValidate();
		}


		/***********************************************************************
		 * BLOG
		 **********************************************************************/
		if (jQuery('#blog').size() > 0) {			
			APP.blogList();
			APP.initCycle('.cycle');
		}

	} catch (e) {
		throw new Error('[RUN] - ' + e.message);
	}

});