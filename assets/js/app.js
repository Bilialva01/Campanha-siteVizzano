if (!window.jQuery || !window.CORE) {
	throw new Error('Dependency not found: jQuery or CORE', location.href, 0);
}

var APP = (function() {
	try {

		
		/* AUTOLOAD *****************************************-******************/
		/* Autoload de itens essenciais
		/* *******************************************************************/

		(function() {
			jQuery('a[rel=external]').click(function(e) {
				window.open(this.href);
				return false;
			});
		})();

		(function() {
			jQuery('a[rel=back]').click(function(e) {
				history.back();
			});
		})();

		(function() {
			jQuery('a[href=#]').click(function(e) {
				return false;
			});
		})();

		(function() {
			jQuery('a[rel=close]').click(function(e) {
				console.log('clicou pra fechar');
				jQuery(this).parents('.modal').addClass('hide');
				return false;
			});
		})();

		(function() {
			CORE.tools.dictionary();
		})();

		/* PRIVATE ***********************************************************/
		/* Funções padrões para uso restrito no app
		/* *******************************************************************/

		/*
		 * goToTop()
		 * @param string
		 * @param integer
		 */
		function goToTop(element, duration) {
			if (element == null) {
				if (window.pageYOffset !== 0) {
					jQuery('body, html').animate({
						scrollTop: 0
					}, duration);
				}
			} else {
				jQuery(element).click(function(){
					if (window.pageYOffset !== 0) {
						jQuery('body, html').animate({
							scrollTop: 0
						}, duration);
					}				
				});
			}
		}

		/*
		 * onlyNumbers()
		 * @param string
		 */
		function onlyNumbers(element) {
			jQuery(element).bind("keyup blur focus", function(e) {
	            e.preventDefault();
	            var expre = /[^\d]/g;
	            jQuery(this).val(jQuery(this).val().replace(expre,''));
	       });
		}

		/*
		 * highlightForm()
		 * @param string
		 * @param string
		 */
		function highlightForm(element, errorClass) {
			if (jQuery(element).is('select')) {
				jQuery(element).addClass(errorClass);
			} else if (jQuery(element).parents().is('.inputFile')) {
				jQuery(element).parents().addClass(errorClass);
				jQuery(element).parents().find('.placeholder').addClass(errorClass);
			} else {
				jQuery(element).addClass(errorClass);
			}
		}

		/*
		 * unhighlightForm()
		 * @param string
		 * @param string
		 */
		function unhighlightForm(element, errorClass) {
			if (jQuery(element).is('select')) {
				jQuery(element).removeClass(errorClass);
			} else if (jQuery(element).parents().is('.inputFile')) {
				jQuery(element).parents().removeClass(errorClass);
				jQuery(element).parents().find('.placeholder').removeClass(errorClass);
			} else {
				jQuery(element).removeClass(errorClass);
			}
		}

		/*
		 * customSelectsZeroValue()
		 */
		function customSelectsZeroValue() {
			jQuery('select').each(function(){
				jQuery(this).find('option:eq(0)').attr('selected', 'selected');
			});
		}		

		/*
		 * addressSearch()
		 * @param string
		 * @param string
		 * @param string
		 * @param string
		 * @param string
		 */
		function addressSearch(cep, rua, bairro, estado, cidade) {
			var form = jQuery('form'),
				ocep = jQuery(cep),
				oend = jQuery(rua),
				obai = jQuery(bairro),
				oest = jQuery(estado),
				acid = jQuery(cidade);

				oend.val("");
				obai.val("");
				oest.find('option:eq(0)').attr('selected', 'selected');
				acid.empty().html('<option value=""></option>');

			if (ocep.val() != '' && ocep.val() != null) {
				var validacep = /^[0-9]{5}-?[0-9]{3}$/;

                if (validacep.test(ocep.val())) {
                	jQuery('.overlay').fadeIn('fast').find('.loader').text('Verificando endereço ...');
                   
                    jQuery.getJSON("//viacep.com.br/ws/"+ ocep.val() +"/json/?callback=?", function(dados) {
                        if (!("erro" in dados)) {
                        	   jQuery('.overlay').delay(2000).fadeOut('fast', function(e){	
                            });
                        } else {
                        	jQuery('.overlay').find('.loader').text('CEP não encontrado...');
                        	jQuery('.overlay').delay(2000).fadeOut('fast', function(e){
                        		ocep.val('').focus();
                        	});
                        }
                    }).done(function(dados) {
						oend.val(dados.logradouro);	
						obai.val(dados.bairro);  

						oest.find('option[value='+dados.uf+']').attr('selected', 'selected');
						oest.parent().find('.valueSelect').text(oest.find('option:selected').text());
						changeCities(form, acid, dados.localidade, 'busca-cidades');
					}).fail(function() {
						jQuery('.overlay').find('.loader').text('Ocorreu um erro durante a pesquisa...');
                    	jQuery('.overlay').delay(2000).fadeOut('fast', function(e){
                    		ocep.val('').focus();
                    	});
					}).always(function() {
						console.log("complete");
					});
                } else {
                	jQuery('.overlay').find('.loader').text('Formato de CEP inválido...');
                	jQuery('.overlay').delay(2000).fadeOut('fast', function(e){
                		ocep.val('').focus();
                	});
                }
			}
		}

		/*
		 * changeCities()
		 * @param object
		 * @param object
		 * @param string
		 * @param string
		 */
		function changeCities(form, city, current, action) {
			var first  = city.find('option:eq(0)').text(),
				action = (action == null) ? 'lista-cidades' : action;

			CORE.tools.submit(form, 'post', 'json', null, CORE.BASE_URL + 'acoes/' + action, function(){
				city.empty().html('<option>...</option>');
			}, function(data){
				var markup  = '<option value="">'+first+'</option>',
					indice  = 0;

				jQuery.each(data, function() {
					actual = ((data[indice].label == current || data[indice].value == current) ? ' selected="selected"' : '');
					markup += '<option value="' + data[indice].label + '"' + actual + '>' + data[indice].label + '</option>';
					indice++;

				});

				markup += '<option disabled></option>';
				city.empty().html(markup);
			});
		}

		/* PUBLIC DEFAULT ****************************************************/
		/* Funções padrões do projeto que podem ser inicializadas 
		/* *******************************************************************/

		/*
		 * initFancybox()
		 * @param string
		 */
		function initFancybox(element) {
			head.js(CORE.dependency.plugin.fancybox, function() {
				jQuery(element).fancybox({
					padding: 5,
					autoSize: true,
					helpers: {
						title: null/*,
						thumbs: {
			                width  : 40,
			                height : 40
			            }*/
					}/*,
					afterShow: function() {
			            jQuery('.fancybox-wrap').swipe({
			                swipe : function(event, direction) {
			                    if (direction === 'left' || direction === 'up') {
			                        $.fancybox.prev( direction );
			                    } else {
			                        $.fancybox.next( direction );
			                    }
			                }
			            });
			        }*/
				});
			});
		}

		/*
		 * initCycle()
		 * @param string
		 */
		function initCycle(element) {
			head.js(CORE.dependency.plugin.cycle, CORE.dependency.plugin.swipe, function() {
				jQuery(element).cycle();
			
				jQuery(element).swipe({
					swipeLeft: function(){jQuery(element).cycle('next');},
					swipeRight: function(){jQuery(element).cycle('prev');}
				});			
			});
		}

		/*
		 *	slickSlider()
		 *	@param string
		 *	@param integer
		 *	@param integer
		 *	@param integer
		 */
		function slickSlider(element, toShowFull, toShow1024, toShow780, toShow640) {
			head.js(CORE.dependency.plugin.slickslider, function(){
				jQuery(element).slick({
			        infinite: false,
			        centerPadding: '0px',
					dots: true, 
					arrows: true,
			        slidesToShow: toShowFull,
			        responsive: [
				        {
				            breakpoint: 1279,
				            settings: {								
				            	slidesToShow: toShowFull
				            }
				        },
				        {
				            breakpoint: 1200,
				            settings: {
				            	slidesToShow: toShow1024
				            }
				        },
				        {
				            breakpoint: 780,
				            settings: {
				            	slidesToShow: toShow780
				            }
				        },
				        {
				            breakpoint: 640,
				            settings: {
								slidesToShow: toShow640
				            }
				        }
			        ]
				});
			});
		}

		/*
		 *	Input file 
		 */
		function inputFile() {
			jQuery('input[type=file]').change(function(e){ 
 				jQuery(this).prev().html(jQuery(this).val());
 			});
		}

		/*
		 *	menu()
		 */
		function menu() {
			jQuery('.toggleMenu').click(function(){	
				jQuery('.responsive, .toggleMenu').toggleClass('active');
			});
		}

		/*
		 *	loader()
		 */
		function loader() {
			jQuery(window).load(function(){
				setTimeout(function(){
					jQuery('.loaderSite').addClass('loaded');
				}, 800);

				setTimeout(function(){
					jQuery('.loaderSite').remove();
				}, 1000);
			});
		}		

		/* PUBLIC CUSTOM *****************************************************/
		/* Funções personalizadas para o projeto 
		/* *******************************************************************/

		/*
		 * formNewsValidate()
		 */
		function formNewsValidate() {
		 	head.js(CORE.dependency.plugin.validate, CORE.dependency.plugin.validate_methods, function(){		 		
				var theForm = jQuery('#formNewsletter'),
					label   = theForm.find('.submit').val()
					country = theForm.find('#pais'),
					state   = theForm.find('#estado'),
					city    = theForm.find('#cidade');

				country.change(function(e){
					var value = jQuery(this).val().toLowerCase();
					
					if (value != 'brasil' && value != 'brazil') {
						state.attr('disabled', 'disabled');
						city.attr('disabled', 'disabled');
					} else {
						state.removeAttr('disabled');
						city.removeAttr('disabled');
					}
				});

				state.change(function(e){
					changeCities(theForm, city, '');
				});

				theForm.validate({
					rules: {
						nome  : {required: true},
						email : {required: true, email: true},
						pais  : {required: true},
						estado  : {required: true},
						cidade  : {required: true}
					},
					errorPlacement: function() {
					},
					submitHandler: function(form) {
						CORE.tools.submit(theForm, 'post', 'json', null, CORE.BASE_URL + 'acoes/cadastro', function(){
							theForm.find('.submit').attr('disabled', 'disabled').val('...');
						}, function(data){
							alert(data.mens);
							theForm.find('input[type=text]').val('');
							theForm.find('.submit').removeAttr('disabled').val(label);
						});
					}
				});
		 	});
		}


		/*
		 * formStoreValidate()
		 */
		function formStoreValidate() {
		 	head.js(CORE.dependency.plugin.validate, function(){
		 		var theForm = jQuery('#formEncontrar'),
		 			result  = jQuery('.resultLojas'),
			 		country = theForm.find('#pais'),
					state   = theForm.find('#estado'),
					city    = theForm.find('#cidade'),
					line    = theForm.find('#linha'),
					label   = theForm.find('.submit').val();

				country.change(function(e){
					var value = jQuery(this).val().toLowerCase();
					
					if (value != 'brasil' && value != 'brazil') {
						alert(CORE.DICTIONARY.aviso_pais);
						location.href = CORE.BASE_URL + 'contato/' + CORE.LANGUAGE;
					}
				});

				state.change(function(e) {
	 				changeCities(theForm, city);
	 			});

	 			if (line.size() > 0) {
	 				var action = 'lista-lojas-produto',
	 					stores = 1;
	 			} else {
	 				var action = 'lista-lojas',
	 					stores = 2;
	 			}

				theForm.validate({
					rules: {
						pais 	: {required: true},
						estado  : {required: true},
						cidade  : {required: true}
					},
					errorPlacement: function() {
					},
					submitHandler: function(form) {
						CORE.tools.submit(theForm, 'post', 'html', null, CORE.BASE_URL + 'acoes/' + action, function(){
							theForm.find('.submit').attr('disabled', 'disabled').val('...');
						}, function(data){
							if (stores == 1) {
								result.empty().html(data);
								jQuery('.avisoLojista, .sobreModelo').removeClass('hide');

								if (jQuery('.lojasComModelo').val() == 0) {
									alert('Não encontramos lojas com o produto desejado em sua região. Entre em contato com as lojas abaixo para solicitar ou conhecer outros produtos da linha.');
								}

								if (jQuery(window).width() < 680) {
									APP.slickSlider('.slickLojas', 3, 3, 2, 2);
								}
							} else {
								result.empty().html(data);
							}

							theForm.find('.submit').removeAttr('disabled').val(label);
							listOfStorePhones();
						});
					}
				});
		 	});
		}

		/*
		 * formContactValidate()
		 */
		function formContactValidate() {
		 	head.js(CORE.dependency.plugin.validate, CORE.dependency.plugin.validate_methods, CORE.dependency.plugin.cpfcnpj, CORE.dependency.plugin.forms, function(){

		 		CORE.tools.mask();
		 		listFiles('#formContato');

		 		var theForm = jQuery('#formContato'),
		 			btnSec  = jQuery('.lkSEC'),
		 			area    = theForm.find('#area'),
		 			cpf     = theForm.find('#cpf'),
		 			cnpj    = theForm.find('#cnpj'),
			 		country = theForm.find('#pais'),
					state   = theForm.find('#estado'),
					city    = theForm.find('#cidade'),
					state1  = theForm.find('#estado1'),
					city1   = theForm.find('#cidade1'),
					lang    = theForm.find('#lang');

				btnSec.click(function(e) {
					//area.find('option:eq(2)').attr('selected', 'selected');
					//goToTop(null, 600);
					
					alert('Olá, você está sendo direcionado ao nosso novo portal para atendimento ao consumidor. Clique em OK para continuar.');
					location.href = 'http://sac.vizzano.com.br/novo-atendimento/vizzano';
				});

				//Atendimento exclusivo
				jQuery('.lkShowForm').click(function(e){
					e.preventDefault();
					jQuery(this).addClass('active');
					jQuery('.boxForm').removeClass('hide');
				});

				area.change(function(e) {
					var value = jQuery(this).val();

					jQuery('.dlocal').addClass('hide');
					jQuery('.slocal').removeClass('hide').removeAttr('disabled');

					if (value == 1) { 	
						//Comercial
						cpf.addClass('hide');
						cnpj.removeClass('hide');
					} else if (value == 2) {
						 //SEC
						btnSec.trigger('click');
						area.find('option:eq(0)').attr('selected', 'selected');
					} else if (value == 3) { 
						//Exportação
						cpf.addClass('hide');
						cnpj.removeClass('hide');
						jQuery('.slocal').addClass('hide').attr('disabled', 'disabled');
						jQuery('.dlocal').removeClass('hide').val('');
					} else if (value == 7) { 
						//RH
						location.href = "https://rh.calcadosbeirario.com.br";
					} else {
						//Outros
						cpf.removeClass('hide');
						cnpj.addClass('hide');
					}
				});

				//Verifica país selecionado
				country.change(function(e){
					var value = jQuery(this).val().toLowerCase();
					
					if (value != 'brasil' && value != 'brazil') {
						jQuery('.slocal').addClass('hide').attr('disabled', 'disabled');
						jQuery('.dlocal').removeClass('hide').val('');
					} else {
						jQuery('.dlocal').addClass('hide');
						jQuery('.slocal').removeClass('hide').removeAttr('disabled');
					}
				});

				state.change(function(e){
					changeCities(theForm, city, '');
				});

				if (lang.val() == 'pt') { 
					var txtAguarde = 'Aguarde...'; 
					var txtEnviar  = 'Enviar';
					var txtUpload  = "Você ultrapassou o limite de 5 arquivos, será necessário excluir um ou mais arquivos de sua lista.";  
				}
				if (lang.val() == 'en') { 
					var txtAguarde = 'Wait...'; 
					var txtEnviar  = 'Send'; 
					var txtUpload  = "You have exceeded the limit of 5 files, it must delete one or more files from your list."; 

					jQuery('.slocal').addClass('hide').attr('disabled', 'disabled');
					jQuery('.dlocal').removeClass('hide').val('');
				}
				if (lang.val() == 'es') { 
					var txtAguarde = 'Esperar...'; 
					var txtEnviar  = 'Enviar'; 
					var txtUpload  = "Se ha superado el límite del 5 archivos, debe eliminar uno o más archivos de la lista."; 

					jQuery('.slocal').addClass('hide').attr('disabled', 'disabled');
					jQuery('.dlocal').removeClass('hide').val('');
				}

				theForm.validate({
					rules: {
						area 	 : {required: true},
						telefone : {required: true},
						nome 	 : {required: true},
						email    : {required: true, email: true},
						pais 	 : {required: true},
						estado 	 : {required: true},
						cidade 	 : {required: true},
						estado1  : {required: true},
						cidade1  : {required: true},
						cpf 	 : {required: true, cpfcnpj:true},
						cnpj 	 : {required: true, cpfcnpj:true},
						mensagem : {required: true}
					},
					errorPlacement: function() {
					},
					submitHandler: function(form) {
						if (countUploadFile > 5) {
							alert(txtUpload);
							return false;
						} else {
							CORE.tools.submit(theForm, 'post', 'json', null, CORE.BASE_URL + 'acoes/contato', function(){
								theForm.find('.submit').attr('disabled', 'disabled').addClass('notsubmit').val(txtAguarde);
							}, function(data){
								if (data.erro == 0) {
									alert(data.mens);
									theForm.find('input[type=text], input[type=file], textarea').val('');
									theForm.find('.submit').removeAttr('disabled').removeClass('notsubmit').val(txtEnviar);
									customSelectsZeroValue();
									cleanFiles();
								} else {
									alert(data.mens);
									theForm.find('.submit').removeAttr('disabled').removeClass('notsubmit').val(txtEnviar);
								}
							});
						}
					}
				});
		 	});
		}

		/*
		 *	listFiles()
		 *	@param string
		 */
		var limitUploadFile = 5,
			limitUploadSize = 8388608,
			arrayUploadSize = new Array();
			countUploadFile = 0;

		function listFiles(form) {
	 		jQuery('.triggerUpload').on('click', function() {
				jQuery('#arquivo').trigger('click');
			});

	 		head.js(CORE.dependency.plugin.forms, function(){
				jQuery('#arquivo').live('change', function(e) {
					var files = this.files.length,
						lang  = jQuery(form).find('#lang').val();

					if (lang == 'pt') { var erroDeLimite = "Selecione no máximo 5 arquivos."; }
					if (lang == 'en') { var erroDeLimite = "Select up to 5 files.";  }
					if (lang == 'es') { var erroDeLimite = "Seleccione un máximo de 5 archivos."; }

					if (files > 5) {
						alert(erroDeLimite);
					} else {
				        for (var i = 0; i < files; i++) {
				        	name = this.files[i].name;
						    size = this.files[i].size;
						    type = this.files[i].type;

						    if (lang == 'pt') { 
						    	var erroDeTipo = "A imagem "+name+" deve ser do tipo JPG, GIF ou PNG."; 
						    	var erroDePeso = "O arquivo "+name+" ultrapassa o limite de 2mb.";
						    	var erroUpload = 'Você ultrassou o limite de 8Mb, será necessário excluir uma ou mais imagens.'; 
						    }
							if (lang == 'en') { 
								var erroDeTipo = "This "+name+" must be of type JPG, GIF or PNG."; 
								var erroDePeso = "The file "+name+" beyond the 2Mb limit.";
								var erroUpload = 'You have exceeded the 8Mb limit, you must delete one or more images.'; 
							}
							if (lang == 'es') { 
								var erroDeTipo = "Este "+name+" debe ser de tipo JPG, GIF o PNG."; 
								var erroDePeso = "El archivo "+name+" más allá del límite de 2Mb.";
								var erroUpload = 'Has superado el límite de 8Mb, debe eliminar una o más imágenes.'; 
							}
						    
						    if  (size > 2097152) {
						        alert(erroDePeso);
						        return false;
							} else if (type != 'image/png' && type != 'image/jpg' && type != 'image/gif' && type != 'image/jpeg' ) {
						        alert(erroDeTipo);
						        return false;
						    } else {
				        		jQuery('#formUpload').ajaxForm({
									url: CORE.BASE_URL + 'acoes/contato-upload',
									dataType: 'json',
									beforeSubmit:function(formData, jqForm, options){
										if (getFilesSize() > limitUploadSize) {
											alert(erroUpload);
											return false;
										}
									},
									success:function(data){
										//console.log(data);
										if (data.erro == 1) {
											alert(data.mens);
										}
									}
								}).trigger('submit');

				        		jQuery('#listFiles').append('<li><span>'+name+'</span><a href="javascript:;" title="Excluir" data-file="'+name+'" class="delFile">X</a></li><input type="hidden" name="arq[]" class="arquivados" value="'+name+'">');
				       			
				        		countUploadFile++;
				       			arrayUploadSize.push(size);
				       		}
				        }

		       			deleteFile(form);
				    	//console.log("Arquivos: "+countUploadFile);
			    	}
			    });
			});
		}

		/*
	     * cleanFiles()
	     */
	    function cleanFiles() {
		    jQuery('#listFiles').empty();
		    jQuery('input.deletados').remove();
		    jQuery('input.arquivados').remove();

		    arrayUploadSize = [];
		    countUploadFile = 0;
	    }

	    /*
	     * getFilesSize()
	     */
	    function getFilesSize() {
			var total = 0;

			for (var i = 0; i < arrayUploadSize.length; i++) {
				total += Number(arrayUploadSize[i]);
			}

			return total;
	    }

	    /*
	     * getFileSizePosition()
	     * @param number
	     */
	    function getFileSizePosition(size) {
			var index;

			for (var i = 0; i < arrayUploadSize.length; i++) {
				if (arrayUploadSize[i] == size) {
					index = i;
				}
			}

			return index;
	    }

	     /*
	     * deleteFile()
	     * @param string
	     */
	    function deleteFile(form) {
		    jQuery('.delFile').on('click', function(e) {
		    	var file   = jQuery(this).data("file"),
		    		pasta  = jQuery('input#pasta').val();
	    		
		    	countUploadFile--;
		    	arrayUploadSize.splice(getFileSizePosition(size), 1);

	    		jQuery(form).append('<input type="hidden" name="del[]" class="deletados" value="'+file+'">');
	    		jQuery(form).find('.arquivados[value="'+file+'"]').remove();
		    	jQuery(this).parent().remove();

		    	jQuery.post(CORE.BASE_URL + 'acoes/contato-upload-delete', { file:file, pasta:pasta }, function(data){
		    		console.log(data);
		    	});

		    	//console.log("Arquivos: "+countUploadFile);
		    });
	    }


		/*
		 *	feedInstagram()
		 */
		function feedInstagram() {			
			var userID = jQuery('#instafeed').data('user');
			var token  = jQuery('#instafeed').data('token');

			head.js(CORE.dependency.plugin.instafeed, function(){				
				//jQuery(window).load(function() {
					var feed = new Instafeed({	
				        sortBy : 'most-recent',
				        limit: 4,
				        resolution: 'standard_resolution', //'low_resolution',
				        get: 'user', 
				        userId: userID,
				        accessToken: token,
				        before: function(){
				        },
				        after: function(){
				        	var txtHover = jQuery("#instafeed").data('texto-hover');
				        	jQuery("#instafeed").find('.mouseIn').children('span').text(txtHover);

				        	if (jQuery(window).width() < 700) {
								slickSlider('#instafeed', 1, 1, 1, 1);				        	
				        	}
				        },
				        template: '<li class="item"><a href="{{link}}" class="hasHover" target="_blank" title="{{caption}}"><img src="{{image}}" alt="" /> <div class="mouseIn"><span></span></div></a></li>'
				    });
				    feed.run();
				//});
			});
		}

		/*
		 * productList()
		 */
		function productList() {
			var li = jQuery(".listaProdutos li").size();
			var x  = 12;

			jQuery('.listaProdutos li:lt('+x+')').removeClass('hide');
			jQuery('.btn').click(function(e) {
				x = (x+6 <= li) ? x+6 : li;
				jQuery('.listaProdutos li:lt('+x+')').removeClass('hide');
				if (x == li) {
					jQuery('.btn').addClass('hide');
					jQuery('.listaProdutos').addClass('margem');
				}
			});
		}

		/*
		 * blogList()
		 */
		function blogList() {
			var li = jQuery(".listPosts li").size();
			var x  = 4;

			console.log('Posts: ' + li);

			jQuery('.listPosts li:lt('+x+')').removeClass('hide');
			jQuery('.lkViewMore').click(function(e) {
				x = (x+2 <= li) ? x+2 : li;
				jQuery('.listPosts li:lt('+x+')').removeClass('hide');
				if (x == li) {
					jQuery('.lkViewMore').addClass('hide');
				}
			});
		}

		/*
		 * restrictProductSearch()
		 */
		function restrictProductSearch() {
			var category  = jQuery('#formFiltro').find('#estilo'),
				heel      = jQuery('#formFiltro').find('#salto'),
				reference = jQuery('#formFiltro, #formSearch').find("#referencia"),
				button    = jQuery('#formFiltro, #formSearch').find('.submit'),
				href	  = 'colecao/' + CORE.LANGUAGE;
				count     = 0;

			head.js(CORE.dependency.plugin.alphanum, function(){
				reference.alphanum({
					allow: '.-',
					allowThouSep: false,
					allowDecSep:  false,
					allowSpace: true,
					allowNumeric: true,
					allowUpper: false,
					allowLower: false
				});
			});

			category.change(function(e) {
				if (jQuery(this).val() != '') {
					href += '/' + jQuery(this).val();
					location.href = CORE.BASE_URL + href;
				}
			});

			heel.change(function(e) {
				if (jQuery(this).val() != '') {
					href += '/' + category.val() + '/' + jQuery(this).val();
					location.href = CORE.BASE_URL + href;
				}
			});

			button.click(function(e) {
				if (reference.val() != '') {
					href += '/?referencia=' + reference.val();
					location.href = CORE.BASE_URL + href;
				}

				return false;
			});
		}

		/*
		 *	productChangeColor()
		 */
		 function productChangeColor() {
		 	jQuery('.lkThumb').click(function(e){
		 		e.preventDefault();
		 		
				var srcThumb    = jQuery(this).find('img').attr('src');
				var srcAmpliada = jQuery('.mainImg').children('img').attr('src');

				//Change
				jQuery('.mainImg').children('img').attr('src', srcThumb.replace('pequenas', 'grandes'));
			});
		 }

		 /*
		  *	productWhereToFind()
		  */
		 function productWhereToFind() {
		 	jQuery('.boxEncontre a').click(function(e){
		 		e.preventDefault();

		 		var link = jQuery(this).attr('href');

		 		jQuery('#lojas-online, #lojas-fisicas').addClass('hide');
		 		jQuery('#'+link).removeClass('hide');

		 		jQuery('body, html').animate({
					scrollTop: jQuery('#'+link).offset().top
				}, 600);

				sortStories();
		 	});

		 	//Scroll link
		 	jQuery('.btnEncontre').click(function(){
		 		jQuery('body, html').animate({
					scrollTop: jQuery('.boxEncontre').offset().top
				}, 600);

				sortStories();
		 	});
		 }

		 /*
		 *	listOfStorePhones()
		 */
		 function listOfStorePhones() {
		 	jQuery('.lkMorePhones').click(function(){
		 		if (jQuery(this).hasClass('disabled')) {
		 			return false;
		 		} else {
					var btn      = jQuery(this);
					/*var txtClose = jQuery(this).data('txt-close');
					var txtOpen  = jQuery(this).data('txt-open');*/

		 			btn.parents('.loja').find('.morePhones').toggleClass('hide');
					btn.toggleClass('active');

					/*if(btn.hasClass('active')) {
						btn.attr('title', txtClose).children('span').text(txtClose);
					} else {
						btn.attr('title', txtOpen).children('span').text(txtOpen);
					}*/
		 		}
		 	});
		 }

		/*
		 *	playVideo()
		 */
		function playVideo() {
			jQuery('.lkVideo').click(function() {
				var idVideo = jQuery(this).data('video');
				var iframe = "<iframe id='video' src='https://www.youtube.com/embed/"+idVideo+"?rel=0&controls=1&showinfo=0&autoplay=1&version=3&enablejsapi=1' frameborder='0' allowfullscreen></iframe>";

				jQuery(this).parent().append(iframe);
			});
		}

		function showHideNewsletter() {
			head.js(CORE.dependency.plugin.cookie, function(){
				jQuery('.boxNewsFixed').click(function(){
					if (jQuery(this).is('.closed')) {
						jQuery(this).removeClass('closed');
					}
				});

				jQuery('.boxNewsFixed').find('.closeBox').click(function() {
					jQuery('.boxNewsFixed').addClass('closed');
					$.cookie('boxNewsStatus', 'closed', { expires: 7 });
				});
			});
		}

		function scrollWhereToFind() {
			var LF = jQuery('section#lojas-fisicas'),
				LO = jQuery('section#lojas-online'),
				SR = jQuery('section#showrooms');

			if (LF.size() > 0) { var elem = LF; }
			if (LO.size() > 0) { var elem = LO; }
			if (SR.size() > 0) { var elem = SR; }

			jQuery('body, html').animate({
		        scrollTop: elem.offset().top
		    }, 2000);
		}

		/*
		 *	sortStories()
		 */
		function sortStories () {
		 	head.js(CORE.dependency.plugin.mixitup, function () {
			 	jQuery('.listaLojas').mixItUp();

				jQuery('#filtroLojas').on('change', function(){
					console.log('sort');
					jQuery('.listaLojas').mixItUp('filter', this.value);
				});
			});
		}

		return {
			initFancybox: initFancybox,
			initCycle: initCycle,
			slickSlider: slickSlider,
			inputFile: inputFile,
			menu: menu,
			loader: loader,
			formNewsValidate: formNewsValidate,
			formStoreValidate: formStoreValidate,
			formContactValidate: formContactValidate,
			feedInstagram: feedInstagram,
			productList: productList,
			blogList: blogList,
			restrictProductSearch: restrictProductSearch,
			productChangeColor: productChangeColor,
			productWhereToFind: productWhereToFind,
			listOfStorePhones: listOfStorePhones,
			playVideo: playVideo,
			showHideNewsletter: showHideNewsletter,
			scrollWhereToFind: scrollWhereToFind,
			sortStories: sortStories
		};

	} catch (e) {
		throw new Error('[APP] - ' + e.message);
	}
})();