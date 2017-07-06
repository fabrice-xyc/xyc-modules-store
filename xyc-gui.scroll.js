
( function( $ ){
		var
		
		storageScroll = {},
		ScrollContainerID,
		scrollCount = 0,
		scrollYActive = false, 
		timeScroll = '',
		child_Scroll = false
	
		$.fn.extend({
			
			scroll: function( options ){
				/** Fonction de définition de la barre de scroll dans un element au cas
					ou son contenu déborde. La 1ere etape consiste à définire le elemens de test
					du débordement dans le contenu, en suite création du scrolling en fonction 
					des données et mésures recueillis. Sinon ( le test echoue ), pas de scrolling
					
				**/
					
					var params = merge( {
															width: '',
															wheel: true,
															barrHeight: 80,
															JumpSize: 50,
															barrChangeRapport: 0.7,
															borderActiveSize: 2,
															borderBlurColor: 'rgb(60, 60, 60)',
															borderActiveColor: 'rgb(225, 30, 70)',
															load: false,
															spy: 'begin',
															
														}, options )
					
					return this.each(function(){
						var $this = $(this)
							
							if( !$this.hasClass('scroll-container') ){
								// creation de l'environnement de scrolling
								
								var contents = $this.addClass('scroll-container').html() // conteneur
									$this.html('<div class="scroll-content">'+ contents +'</div><br>') // contenues
							}
							
							if( !$this.attr('id') )
								if( !/scrollID/.test( $this.attr('id') ) ){
									scrollCount++
									$this.attr("id", 'scrollID'+ scrollCount ) // identifiant unique dans la page
								}
							// ------------------------------------------------------------ initialisation des variables
							var
							
							ElemID = ScrollContainerID = $this.attr('id'),
							scrollBarrX,
							scrollBarrY,
							scrollBar_ContainerY,
							scrollBar_ContainerX,
							
							container_scrolled = $("#"+ ElemID ),
							content_scrolled = $("#"+ ElemID ).children().eq(0),
							scroller_Size = params.width == 'small' ? 6 : 8,
							
							container_Height,
							container_Width,
							
							content_Height,
							content_Width,
							
							Padding,
							$scrollerX,
							$scrollerY,
							
							init,
							OBJECT = {
								
								scrolled: content_scrolled,
								raison: 0,
								scrollTop: 0,
								scrollFinal: 0,
								scrollLoadEnd: 0,
								scrollLoadBegin: 0,
								scrollHeight: content_Height,
								add: function( $elem, before, spy ){ append( $elem, before, spy ) }
							},
							
							// alert("Ct:"+container_Height+"\nS-Ct:"+$scrollerY.height+"\nS-Ct-Top:"+$scrollerY.top+"\nS-c:"+content_Height)
							// alert("Ct:"+container_Width+"\nS-Ct:"+$scrollerX.width+"\nS-Ct-Left:"+$scrollerX.left+"\nS-c:"+content_Width)
							// ------------------------------------------------------------ récupération des mesures et application du scrolling
						
							sizeMaker = init = function(){
								
									container_Height = container_scrolled.height() // hauteur du conteneur de la page dépassant
									container_Width = container_scrolled.width() // hauteur du conteneur de la page dépassant
									
									content_Height = content_scrolled.height() // hauteur de la page dépassant
									content_Width = content_scrolled.width() // largeur de la page dépassant
									
									Padding = {
											top: parseInt( container_scrolled.css('padding-top').split('px') ), // largeur de la page dépassant
											left: parseInt( container_scrolled.css('padding-left').split('px') ), // largeur de la page dépassant
											right: parseInt( container_scrolled.css('padding-right').split('px') ), // largeur de la page dépassant
											bottom: parseInt( container_scrolled.css('padding-bottom').split('px') ), // largeur de la page dépassant
									}
									
									$scrollerX = {
										active: content_Width > container_Width + 1, // 1 pour conpenser le window-body-container
										Bar_Width: params.barrHeight,
										
										height: scroller_Size,
										width: container_Width - Padding.right,
										left: ( Padding.left + Padding.right  ) / 2 , // 4 => espacement
										// top: Padding.top,
										// left: container_Width - $scrollX.width
										bottom: Padding.bottom + 4,
										
										raison: 0, // raison de dénivélation
										scrollSize: 0, // en cas de défilement par clique
										Inital: 0 // limite de départ standard
									}
									
									$scrollerY = {
										active: content_Height > container_Height,
										Bar_Height: params.barrHeight,
										
										width: scroller_Size,
										height: container_Height - Padding.bottom,
										left: container_Width + Padding.left + Padding.right - ( scroller_Size + 4 ), // 4 => espacement
										top: Padding.top,
										
										raison: 0, // raison de dénivélation
										scrollSize: 0, // en cas de défilement par clique
										Inital: 0 // limite de départ standard
									}
									
							}
							
							function append( $elem, before, spy ){
								// Ajouter un element au contenue
								params.spy = spy ? spy : OBJECT.scrollTop
								
								before ?
									content_scrolled.prepend( $elem )
									: content_scrolled.append( $elem )
									
								init()
								apply()
							}
							
							function Events( type ){
								
								if( type == 'horizontal' ){
									
									scrollBarrX.mousedown(function(e){
										// recupération des données du scrollBarrX quand il est ciblé
										
										if( !container_scrolled.hasClass('no-scroll') && !container_scrolled.find('.scroll').hasClass('no-scroll') ){
											// si le scroll est autorisé
											
											var s = storageScroll;
												s.target = e.target || event.srcElement;
												s.offsetX = e.clientX - s.target.offsetLeft
												
												xyclone.GUI.inspector({ event: 'mousedown', target: $(this), toggle: 'scrolling on' })
										}
									}).parent().click(function(e){
										// défilement de la barre scroll en cas de clique
											
										if( !$(e.target).hasClass('scrollBar') && !container_scrolled.hasClass('no-scroll') && !container_scrolled.find('.scroll').hasClass('no-scroll') )
											if( $scrollerX.scrollSize >= $scrollerX.Inital && $scrollerX.scrollSize <= $scrollerX.Final ){
												
												var scrollBarLeft = e.target.childNodes[0].offsetLeft,
														rest = $scrollerX.Final - scrollBarLeft // ecartement restant inférieur au pas
														
												$scrollerX.scrollSize = scrollBarLeft;
												
												// alert(( e.clientX - $(this).offset().left )+"/"+scrollBarLeft)
												
												if( ( e.clientX - $(this).offset().left ) > scrollBarLeft ){
													// défilement vers le bas
													 
													$scrollerX.scrollSize = rest < params.JumpSize ? $scrollerX.Final : $scrollerX.scrollSize + params.JumpSize
													xyclone.GUI.inspector({ event: 'click', target: $(this), toggle: 'scroll right' })
												// alert("right : "+ $scrollerX.scrollSize)
												
												} else {
													
												// alert("'left : "+ $scrollerX.scrollSize)
												
													$scrollerX.scrollSize = scrollBarLeft < params.JumpSize ? $scrollerX.Inital : $scrollerX.scrollSize - params.JumpSize // défilement vers le haut
													xyclone.GUI.inspector({ event: 'click', target: $(this), toggle: 'scroll left' })
												}
													
												scrollBarrX.css("left", $scrollerX.scrollSize + 'px')
												content_scrolled.css("marginLeft", - ( OBJECT.scrollLeft = $scrollerX.scrollSize * $scrollerX.raison ) + 'px')
												
												// Exécution de la fonction load appliquer au scroll
												isFunction( params.load ) ? ( params.load )( OBJECT ) : null
											}
									})
									
									$(document).mouseup(function(e){
										
										if( storageScroll.target ){
											xyclone.GUI.inspector({ event: 'mouseup', target: $( storageScroll.target ), toggle: 'scrolling off' })
											storageScroll = {}
											
											// Exécution de la fonction load appliquer au scroll
											OBJECT.scrollLeft = - parseInt( content_scrolled.css('marginLeft').split('px')[0] )
											// isFunction( params.load ) ? ( params.load )( OBJECT ) : null
										}
									});
									
									container_scrolled.parent().mousemove(function(e){
										
											if( storageScroll.target && storageScroll.offsetX ){
												var scrollX = e.clientX - storageScroll.offsetX
												
												if ( scrollX && scrollX > $scrollerX.Inital && scrollX < $scrollerX.Final ){
													scrollBarrX.css("left", scrollX + 'px')
													content_scrolled.css("marginLeft", - ( scrollX * $scrollerX.raison ) + 'px')
												}
											}
									})
									
									if( params.wheel && !$('#'+ElemID).hasClass('scroll') ){
										$('#'+ElemID).mousewheel(function(event){
											// evenement de gestion du défilement par la molette de la souris
											
											if( !scrollYActive && !$('#'+ ScrollContainerID ).hasClass('no-scroll') && !$('#'+ ScrollContainerID ).find('.scroll').hasClass('no-scroll') ){
												// if( /^scrollID/.test( $( event.target ).attr( 'id' ) ) || $( event.target ) == $('#'+ ScrollContainerID ).parent() ){
															
													var content_Position_Now_X = parseInt( content_scrolled.css("marginLeft").split('px')[0] ),
															container_W = $('#'+ ScrollContainerID ).data('container-width'),
															content_W = $('#'+ ScrollContainerID ).data('content-width'),
															scrollContent_X
															
													if( event.deltaY == 1 ){
														scrollContent_X = content_Position_Now_X + params.JumpSize <= -params.JumpSize ? content_Position_Now_X + params.JumpSize : 0										
														xyclone.GUI.inspector({ event: 'mousewheel', target: $('#'+ ScrollContainerID ), toggle: 'scroll left' })
														
													} else {
														scrollContent_X = ( ( ( content_Position_Now_X + content_W ) - container_W - params.JumpSize ) >= params.JumpSize ) ? 
																																																		content_Position_Now_X - params.JumpSize
																																																		: container_W - content_W;
														xyclone.GUI.inspector({ event: 'mousewheel', target: $('#'+ ScrollContainerID ), toggle: 'scroll right' })
													}
													
													OBJECT.scrollLeft = - scrollContent_X // scrollTop present
													
													// Exécution de la fonction load appliquer au scroll
													isFunction( params.load ) ? ( params.load )( OBJECT ) : null
														
													$(this).data('content-container').css('marginLeft', scrollContent_X + 'px');
													$(this).data('scrollBar').css("left", - scrollContent_X / $('#'+ ScrollContainerID ).data('raison') + 'px');
													
												// }
											}
										})
										$('#'+ElemID).addClass('scroll')
									}
								}
								
								if( type == 'vertical' ){
									
									scrollBarrY.mousedown(function(e){
										// recupération des données du scrollBarrY quand il est ciblé
									
										if( !container_scrolled.hasClass('no-scroll') && !container_scrolled.find('.scroll').hasClass('no-scroll') ){
											// si le scroll est autorisé
											
											var s = storageScroll;
												s.target = e.target || event.srcElement
												s.offsetY = e.clientY - s.target.offsetTop;
												
												xyclone.GUI.inspector({ event: 'mousedown', target: $(this), toggle: 'scrolling on' })
										}
									}).parent().click(function(e){
										// défilement de la barre scroll en cas de clique
											
										if( !$(e.target).hasClass('scrollBar') && !container_scrolled.hasClass('no-scroll') && !container_scrolled.find('.scroll').hasClass('no-scroll') )
											if( $scrollerY.scrollSize >= $scrollerY.Inital && $scrollerY.scrollSize <= $scrollerY.Final ){
												
												var scrollBarTop = e.target.childNodes[0].offsetTop,
														rest = $scrollerY.Final - scrollBarTop // ecartement restant inférieur au pas
												$scrollerY.scrollSize = scrollBarTop;
												
												if( ( e.clientY - $(this).offset().top ) > scrollBarTop ){
													// défilement vers le bas
													 
													$scrollerY.scrollSize = rest < params.JumpSize ? $scrollerY.Final : $scrollerY.scrollSize + params.JumpSize
													xyclone.GUI.inspector({ event: 'click', target: $(this), toggle: 'scroll down' })
												} else {
													
													$scrollerY.scrollSize = scrollBarTop < params.JumpSize ? $scrollerY.Inital : $scrollerY.scrollSize - params.JumpSize // défilement vers le haut
													xyclone.GUI.inspector({ event: 'click', target: $(this), toggle: 'scroll up' })
												}
												
												scrollBarrY.css("top", $scrollerY.scrollSize + 'px')
												content_scrolled.css("marginTop", - ( OBJECT.scrollTop = $scrollerY.scrollSize * $scrollerY.raison ) + 'px')
												
												// Exécution de la fonction load appliquer au scroll
												isFunction( params.load ) ? ( params.load )( OBJECT ) : null
											}
									})
									
									$(document).mouseup(function(e){
										if( storageScroll.target ){
											// Fin de scrolling
											
											OBJECT.scrollTop = - parseInt( $( storageScroll.target ).parent().parent().children().css('marginTop').split('px')[0] ) // scrollTop present
											
											// Exécution de la fonction load appliquer au scroll
											isFunction( params.load ) ? ( params.load )( OBJECT ) : null
											// if( container_scrolled.data('scroll-load-function') )
												// ( eval( container_scrolled.data('scroll-load-function') ) )( OBJECT )
											
											// réinitilisation du storageScroll
											storageScroll = {}
											xyclone.GUI.inspector({ event: 'mouseup', target: $(storageScroll.target), toggle: 'scrolling off' })
										}
									});
									
									container_scrolled.mousemove(function(e){
										
											if( storageScroll.target && storageScroll.offsetY){
												var scrollY = e.clientY - storageScroll.offsetY
												
												if( scrollY && scrollY > $scrollerY.Inital && scrollY < $scrollerY.Final ){
													scrollBarrY.css("top", scrollY + 'px');
													content_scrolled.css("marginTop", - ( scrollY * $scrollerY.raison ) + 'px');
												}
											}
									})
									
									if( params.wheel && !$('#'+ElemID).hasClass('scroll') ){
										$('#'+ ScrollContainerID ).mousewheel(function(event){
											// evenement de gestion du défilement par la molette de la souris
											if( !$('#'+ ScrollContainerID ).hasClass('no-scroll') && !$('#'+ ScrollContainerID ).find('.scroll').hasClass('no-scroll') ){
												
												clearTimeout( timeScroll )
												// timeScroll = true // déclare qu'un element enfant est en mode scrolling
												scrollYActive = true
												// if( child_Scroll ){
													var content_Position_Now_Y = parseInt( content_scrolled.css("marginTop").split('px')[0] ),
															container_H = $(this).data('container-height'),
															content_H = $(this).data('content-height'),
															scrollContent_Y
															
													if( event.deltaY == 1 ){
														
														scrollContent_Y = content_Position_Now_Y + params.JumpSize <= -params.JumpSize ? content_Position_Now_Y + params.JumpSize : 0										
														if( parseInt( $(this).data('scrollBar').css('top').split('px')[0] ) <= 0 ) scrollYActive = false
														
														xyclone.GUI.inspector({ event: 'mousewheel', target: $(this), toggle: 'scroll up' })
													} else {
														
														scrollContent_Y = ( ( ( content_Position_Now_Y + content_H ) - container_H - params.JumpSize ) >= params.JumpSize ) ? 
																																																		content_Position_Now_Y - params.JumpSize
																																																		: container_H - content_H;	
														if( parseInt( $(this).data('scrollBar').css('top').split('px')[0] ) >= $(this).data('Scroll_FinalY') ) scrollYActive = false
														
														xyclone.GUI.inspector({ event: 'mousewheel', target: $(this), toggle: 'scroll down' })
													}
													$(this).data('content-container').css('marginTop', scrollContent_Y + 'px');
													$(this).data('scrollBar').css("top", - scrollContent_Y / $(this).data('raison') + 'px');
													
													OBJECT.scrollTop = - scrollContent_Y // scrollTop present
													
													// Exécution de la fonction load appliquer au scroll
													isFunction( params.load ) ? ( params.load )( OBJECT ) : null
													// if( $(this).data('scroll-load-function') ){
														// ( eval( $(this).data('scroll-load-function') ) )( OBJECT )
													// }
														
													// céder l'index au scrolling du parent
													timeScroll = setTimeout(function(){ scrollYActive = false }, 200 )
												// }
											}
										})
										$('#'+ElemID).addClass('scroll')
									}
								}
							}
							
							function apply(){
									
								if( $scrollerY.active ){
									// en cas de débordement du contenu de l'element (scroll obligatoire)
									xyclone.GUI.inspector({ event: 'updatewidgetheight', target: $this, toggle: 'scroll init' })
									
									if( !container_scrolled.children().hasClass("scrollBarContainer") ){
										// redimensionnement des block contenu dans le container et affichage de la barre de défilement
										$("#"+ElemID+" .scrollBarContainer").remove()
										container_scrolled.css("overflow", "hidden").append('<div class="scrollBarContainer '+ params.width +'"><div class="scrollBar '+ params.width +'"></div></div>');
									}
									
									scrollBar_ContainerY = $("#"+ElemID+" .scrollBarContainer")
									scrollBarrY = $("#"+ ElemID +" .scrollBarContainer .scrollBar")
									
									scrollBar_ContainerY.css({
																				"width": $scrollerY.width +"px",
																				"height": $scrollerY.height +"px",
																				"left": $scrollerY.left +"px",
																				"top": $scrollerY.top +"px",
																			});	
									
									// *** Nouveau mode de barre de défilement
									// il constite à ne pas varier le hauteur de scrollBarr mais de calculer la dénivélation 
									// en fonction de la distance qu'il va parcourir par rapport celui de la page à défiler
									var  Parcours_Content = content_Height - $scrollerY.height,
											Parcours_ScrollBar = $scrollerY.height - $scrollerY.Bar_Height - ( params.borderActiveSize * 2 );
										
									 // si la raison est inférieur à 0.3, on passe en mode ancien de barre de défilement le coéficient entre le déplacement de la barre
									 //  de défilement et celui de la page à défiler et la raison qui de compensation du déplacement et les crollbar est large
									if( ( Parcours_Content / Parcours_ScrollBar ) < params.barrChangeRapport ){
										
										$scrollerY.Bar_Height = ( container_Height * $scrollerY.height ) / content_Height
										Parcours_ScrollBar = $scrollerY.height - $scrollerY.Bar_Height - 20
									}
		
									$scrollerY.Final = $scrollerY.height - $scrollerY.Bar_Height - ( params.borderActiveSize * 2 ); // limite d'arrivé standard
									$scrollerY.raison = Parcours_Content / Parcours_ScrollBar,
									$scrollerY.currentPos = content_scrolled.height() - container_scrolled.data('content-height') // Position en cour avant la réactualisation
									
									// données data-*: stockage de l'état des scrollers
									container_scrolled.data({ 
																					'container-height': $scrollerY.height,
																					'content-height': content_Height,
																					'content-container': content_scrolled,
																					'scrollBar': scrollBarrY,
																					'Scroll_FinalY': $scrollerY.Final,
																					'raison': $scrollerY.raison,
																				})
									
									// actualisation du height et de la position du scrollBar
									scrollBarrY.css({ 
														'height': $scrollerY.Bar_Height +"px",
														'top': - ( parseInt( $("#"+ ElemID +' .scroll-content').css('marginTop').split('px') ) / $scrollerY.raison ),
												}).mouseover(function(){
													$(this).css({
																	'border-top-color': params.borderActiveColor,
																	'border-bottom-color': params.borderActiveColor,
																})
												}).mouseout(function(){
													$(this).css({
																	'border-top-color': params.borderBlurColor,
																	'border-bottom-color': params.borderBlurColor,
																})
												})
									
									// définition de la position spy du scroll ( définition d'une position initial )
									if( typeof params.spy == 'string' ){
										// si la position définit est un des deux position principal ( début et fin )
										
										if( params.spy == 'begin' )
											// En cas de positionnement initial ( par défaut )
											$scrollerY.scrollY = $scrollerY.Inital
										
										else if( params.spy == 'end' )
											// En cas de positionnement vers la fin ( scroll final )
											$scrollerY.scrollY = $scrollerY.Final
											
										else if( params.spy == 'current' )
											// En cas de repositionnement à la position précédent avant l'actualisation
											$scrollerY.scrollY = $scrollerY.currentPos / $scrollerY.raison
											
										else if( /%{1}$/.test( params.spy ) )
											// Au cas où un pourcentage ( X% ) est passé en params.spy
											$scrollerY.scrollY = ( ( ( $scrollerY.height * parseInt( params.spy.split('%')[0] ) )/ 100 ) - ( $scrollerY.Bar_Height / 2 ) )
										
										else if( /^#{1}/.test( params.spy ) ){
											// Au cas spy cible un element HTML du scroll-content ( Attribut de l'element )
											
											var  targetTop = $this.find( '.scroll-content '+ params.spy ).position().top,
													scrollTop = content_scrolled.scrollTop()
													
											$scrollerY.scrollY = ( targetTop - scrollTop ) / $scrollerY.raison
										}
									}
									else if( typeof params.spy == 'number' ){
										// si la position définit est un nombre
										$scrollerY.scrollY = params.spy < content_Height - container_Height ?
																	params.spy / $scrollerY.raison
																	: $scrollerY.Final // Si la position de la requête dépasse la taille du conteneur ( scroll-container )
									}
									
									OBJECT.raison = $scrollerY.raison // rapport du déplacement entre scrollBar et le Content_scrolled
									OBJECT.scrollFinal = $scrollerY.Final * $scrollerY.raison // limit ( destination final du scrollBar )
									
									// les limites minimal à atteindre par le scrollBar pour déclancher un reload automatique ( fonction "load" )
									OBJECT.scrollLoadBegin = OBJECT.scrollLoadEnd = OBJECT.scrollFinal - ( OBJECT.scrollFinal / 10 ) // en debut et fin de scroll
									
									// application de la position initialiser du scrolling
									scrollBarrY.css({ "top": $scrollerY.scrollY +'px', 'transition': '0.6s' })
									content_scrolled.css({ "marginTop": - ( OBJECT.scrollTop = $scrollerY.scrollY * $scrollerY.raison ) + 'px', 'transition': '0.6s' })
									setTimeout( function(){
										// Suppression de la transition
										
											scrollBarrY.css({ 'transition-duration': '0s' })
											content_scrolled.css({ 'transition-duration': '0s' })
											
											// Exécution de la fonction load appliquer au scroll
											isFunction( params.load ) ? ( params.load )( OBJECT ) : null
											/*
											if( params.load && typeof params.load == 'string' ){
												container_scrolled.attr('data-scroll-load-function', params.load )
												( eval( params.load ) )( OBJECT )
											}
											
											else if( container_scrolled.data('scroll-load-function') )
												( eval( container_scrolled.data('scroll-load-function') ) )( OBJECT )
											
											else if( isFunction( params.load ) )
												( params.load )( OBJECT )
											*/
									}, 600 )
									
									return 'vertical'
								}
								
								else if( $scrollerX.active ){
									// en cas de débordement du contenu de l'element (scroll obligatoire)
									xyclone.GUI.inspector({ event: 'updatewidgetwidth', target: $this, toggle: 'scroll init' })
									
									if( !container_scrolled.children().hasClass("scrollBarContainer-horiz") ){
										// redimensionnement des block contenu dans le container et affichage de la barre de défilement
										$("#"+ElemID+" .scrollBarContainer-horiz").remove()
										container_scrolled.css("overflow", "hidden").append('<div class="scrollBarContainer-horiz '+ params.width +'"><div class="scrollBar-horiz '+ params.width +'"></div></div>');
									}
									
									scrollBar_ContainerX = $("#"+ElemID+" .scrollBarContainer-horiz")
									scrollBarrX = $("#"+ ElemID +" .scrollBarContainer-horiz .scrollBar-horiz")
									
									scrollBar_ContainerX.css({
																						"width": $scrollerX.width +"px",
																						"height": $scrollerX.height +"px",
																						"left": container_Width - $scrollerX.width + 10 +"px",
																						"bottom": 0,
																					});	
									
									// *** Nouveau mode de barre de défilement
									// il constite à ne pas varier le hauteur de scrollBarr mais de calculer la dénivélation 
									// en fonction de la distance qu'il va parcourir par rapport celui de la page à défiler
									var  Parcours_Content = content_Width - $scrollerX.width,
											Parcours_ScrollBar = $scrollerX.width - $scrollerX.Bar_Width - ( params.borderActiveSize * 2 );
											
									 // si la raison est inférieur à 0.3, on passe en mode ancien de barre de défilement le coéficient entre le déplacement de la barre
									 //  de défilement et celui de la page à défiler et la raison qui de compensation du déplacement et les crollbar est large
									 
									if( ( Parcours_Content / Parcours_ScrollBar ) < params.barrChangeRapport ){
										
										$scrollerX.Bar_Width = ( container_Width * $scrollerX.width ) / content_Width
										Parcours_ScrollBar = $scrollerX.width - $scrollerX.Bar_Width - 20
									}
									$scrollerX.Final = $scrollerX.width - $scrollerX.Bar_Width - ( params.borderActiveSize * 2 ); // limite d'arrivé standard
									$scrollerX.raison = Parcours_Content / Parcours_ScrollBar
									
									// données data-*: stockage de l'état des scrollers
									container_scrolled.data({
																					'container-width': $scrollerX.width,
																					'content-width': content_Width,
																					'content-container': content_scrolled,
																					'scrollBar': scrollBarrX,
																					'Scroll_FinalX': $scrollerX.Final,
																					'raison': $scrollerX.raison,
																				})
									
									// actualisation du width et de la position du scrollBar
									scrollBarrX.css({ "width": $scrollerX.Bar_Width +"px" })
														.mouseover(function(){
															$(this).css({
																			'border-left-color': params.borderActiveColor,
																			'border-right-color': params.borderActiveColor,
																		})
														}).mouseout(function(){
															$(this).css({
																			'border-left-color': params.borderBlurColor,
																			'border-right-color': params.borderBlurColor,
																		})
														})
									
									// définition de la position spy du scroll ( définition d'une position initial )
									if( typeof params.spy == 'string' ){
										// si la position définit est un des deux position principal ( début et fin )
										
										if( params.spy == 'begin' )
											// En cas de positionnement initial ( par défaut )
											$scrollerX.scrollX = $scrollerX.Inital
										
										else if( params.spy == 'end' )
											// En cas de positionnement vers la fin ( scroll final )
											$scrollerX.scrollX = $scrollerX.Final
											
										else if( /%{1}$/.test( params.spy ) )
											// Au cas où un pourcentage ( X% ) est passé en params.spy
											$scrollerX.scrollX = ( ( ( $scrollerX.width * parseInt( params.spy.split('%')[0] ) )/ 100 ) - ( $scrollerX.Bar_Width / 2 ) )
										
										else if( /^#{1}/.test( params.spy ) ){
											// Au cas spy cible un element HTML du scroll-content ( Attribut de l'element )
											
											var  targetLeft = $this.find( '.scroll-content '+ params.spy ).position().left,
													scrollLeft = content_scrolled.scrollLeft()
													
											$scrollerX.scrollX = ( targetLeft - scrollLeft ) / $scrollerX.raison
										}
									}
									else if( typeof params.spy == 'number' ){
										// si la position définit est un nombre
										$scrollerX.scrollX = params.spy < content_Height - container_Height ?
																	params.spy / $scrollerX.raison
																	: $scrollerX.Final // Si la position de la requête dépasse la taille du conteneur ( scroll-container )
									}
									
									OBJECT.raison = $scrollerX.raison
									OBJECT.scrollFinal = $scrollerX.Final * $scrollerX.raison
									
									// les limites minimal à atteindre par le scrollBar pour déclancher un reload automatique ( fonction "load" )
									OBJECT.scrollLoadBegin = OBJECT.scrollLoadEnd = OBJECT.scrollFinal - ( OBJECT.scrollFinal / 10 ) // en debut et fin de scroll
									
									// application de la position initialiser du scrolling
									scrollBarrX.css({ "left": $scrollerX.scrollX +'px', 'transition': '0.6s' })
									content_scrolled.css({ "marginLeft": - ( OBJECT.scrollLeft = $scrollerX.scrollX * $scrollerX.raison ) + 'px', 'transition': '0.6s' })
									setTimeout( function(){
										// Suppression de la transition
										
										scrollBarrX.css({ 'transition-duration': '0s' })
										content_scrolled.css({ 'transition-duration': '0s' })
										
										// Exécution de la fonction load appliquer au scroll
										isFunction( params.load ) ? ( params.load )( OBJECT ) : null
										
									}, 600 )
									
									return 'horizontal'
								}
								
								else {
									// annulation de l'evenement mousewheel sur l'element
									$('#'+ElemID +', #'+ ScrollContainerID).unmousewheel().removeClass('scroll')
									
									if( $('#'+ ElemID).children().last().hasClass('scrollBarContainer') ){
										xyclone.GUI.inspector({ event: 'updatewidgetheight', target: $this, toggle: 'scroll leave' })
										
										content_scrolled.css({ 'marginTop': '0px' })
										$('#'+ ElemID).children().last().remove()
									}
									else if( $('#'+ ElemID).children().last().hasClass('scrollBarContainer-horiz') ){
										xyclone.GUI.inspector({ event: 'updatewidgetwidth', target: $this, toggle: 'scroll leave' })
										
										content_scrolled.css({ 'marginLeft': '0px' })
										$('#'+ ElemID).children().last().remove()
									}
									
									return false
								}
							}
							
							sizeMaker() // initialisation des dimensions
							
							Events( apply() )
					})
			}
		})
} )( $ )