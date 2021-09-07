// Memory Game
// © 2014 Nate Wiley
// License -- MIT
// best in full screen, works on phones/tablets (min height for game is 500px..) enjoy ;)
// Follow me on Codepen

(function(){
	
	var Memory = {

		init: function(cards){
			this.$game = $(".game");
			this.$modal = $(".modal");
			this.$overlay = $(".modal-overlay");
			this.$restartButton = $("button.restart");
			this.cardsArray = $.merge(cards, cards);
			this.shuffleCards(this.cardsArray);
			this.setup();
		},

		shuffleCards: function(cardsArray){
			this.$cards = $(this.shuffle(this.cardsArray));
		},

		setup: function(){
			this.html = this.buildHTML();
			this.$game.html(this.html);
			this.$memoryCards = $(".card");
			this.paused = false;
     	this.guess = null;
			this.binding();
		},

		binding: function(){
			this.$memoryCards.on("click", this.cardClicked);
			this.$restartButton.on("click", $.proxy(this.reset, this));
		},
		// kinda messy but hey
		cardClicked: function(){
			var _ = Memory;
			var $card = $(this);
			if(!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
				$card.find(".inside").addClass("picked");
				if(!_.guess){
					_.guess = $(this).attr("data-id");
				} else if(_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){
					$(".picked").addClass("matched");
					_.guess = null;
				} else {
					_.guess = null;
					_.paused = true;
					setTimeout(function(){
						$(".picked").removeClass("picked");
						Memory.paused = false;
					}, 600);
				}
				if($(".matched").length == $(".card").length){
					_.win();
				}
			}
		},

		win: function(){
			this.paused = true;
			setTimeout(function(){
				Memory.showModal();
				Memory.$game.fadeOut();
			}, 1000);
		},

		showModal: function(){
			this.$overlay.show();
			this.$modal.fadeIn("slow");
		},

		hideModal: function(){
			this.$overlay.hide();
			this.$modal.hide();
		},

		reset: function(){
			this.hideModal();
			this.shuffleCards(this.cardsArray);
			this.setup();
			this.$game.show("slow");
		},

		// Fisher--Yates Algorithm -- https://bost.ocks.org/mike/shuffle/
		shuffle: function(array){
			var counter = array.length, temp, index;
	   	// While there are elements in the array
	   	while (counter > 0) {
        	// Pick a random index
        	index = Math.floor(Math.random() * counter);
        	// Decrease counter by 1
        	counter--;
        	// And swap the last element with it
        	temp = array[counter];
        	array[counter] = array[index];
        	array[index] = temp;
	    	}
	    	return array;
		},

		buildHTML: function(){
			var frag = '';
			this.$cards.each(function(k, v){
				frag += '<div class="card" data-id="'+ v.id +'"><div class="inside">\
				<div class="front"><img src="'+ v.img +'"\
				alt="'+ v.name +'" /></div>\
				<div class="back"><img src="js/game-memory/img-game/gojo-intro.png"\
				alt="Codepen" /></div></div>\
				</div>';
			});
			return frag;
		}
	};

	var cards = [
		{
			name: "Kirito",
			img: "js/game-memory/img-game/sao-chibi.png",
			id: 1,
		},
		{
			name: "Saints Sama",
			img: "js/game-memory/img-game/dod-chibi.png",
			id: 2
		},
		{
			name: "Kakashi",
			img: "js/game-memory/img-game/kakashi-chibi.png",
			id: 3
		},
		{
			name: "Naruto",
			img: "js/game-memory/img-game/naruto-chibi.png",
			id: 4
		}, 
		{
			name: "Levi",
			img: "js/game-memory/img-game/levi-chibi.png",
			id: 5
		},
		{
			name: "Yato",
			img: "js/game-memory/img-game/yato-chibi.png",
			id: 6
		},
		// {
		// 	name: "photoshop",
		// 	img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/photoshop-logo.png",
		// 	id: 7
		// },
		// {
		// 	name: "python",
		// 	img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/python-logo.png",
		// 	id: 8
		// },
		// {
		// 	name: "rails",
		// 	img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/rails-logo.png",
		// 	id: 9
		// },
		// {
		// 	name: "sass",
		// 	img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/sass-logo.png",
		// 	id: 10
		// },
		// {
		// 	name: "sublime",
		// 	img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/sublime-logo.png",
		// 	id: 11
		// },
		// {
		// 	name: "wordpress",
		// 	img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/wordpress-logo.png",
		// 	id: 12
		// },
	];
    
	Memory.init(cards);


})();