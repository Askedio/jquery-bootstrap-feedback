(function ( $ ) {
    $.fn.feedback = function(success, fail) {
		self=$(this);
		$(this).find('.dropdown-menu-form').on('click', function(e){e.stopPropagation()})

		$(this).find('.screenshot').on('click', function(){
			$this=$(this);
			$this.find('i').removeClass('fa-camera fa-check').addClass('fa-refresh fa-spin');
			html2canvas($(document.body), {
				onrendered: function(canvas) {
					$this.find('.screen-uri').val(canvas.toDataURL("image/png"));
					$this.find('i').removeClass('fa-refresh fa-spin').addClass('fa-check');
				}
			});
		});

		$(this).find('.do-close').on('click', function(){
			self.find('.dropdown-toggle').dropdown('toggle');
			self.find('.reported, .failed').hide();
			self.find('.report').show();
			self.find('i').removeClass('fa-check').addClass('fa-camera');
		    self.find('.screen-uri').val('');
		});

		failed = function(){
			self.find('.report').hide();
			self.find('.failed').show();
			if(fail) fail();
		}

		$(this).find('form').on('submit', function(){
			$.post( $(this).attr('action'), $(this).serialize(), null, 'json').done(function(res){
				if(res.result == 'success'){
					self.find('.report').hide();
					self.find('.reported').show();
					if(success) success();
				} else failed();
			}).fail(function(){
				failed();
			});
			return false;
		});
	};
}( jQuery ));

$(document).ready(function () {
	$('.feedback').feedback();
});