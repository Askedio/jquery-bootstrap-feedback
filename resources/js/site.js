(function ( $ ) {
    $.fn.feedback = function(success, fail) {
    	$(this).each(function() {
            var self = $(this),
                form = self.find('form'),
				screenshot = self.find('.feedback-screenshot');

            self.find('.dropdown-menu-form').on('click', function(e){e.stopPropagation()});

            if (screenshot.is(":checkbox")) {
                screenshot.on('change', function() {
                	if (screenshot.is(":checked")) {
                		render()
					}
					else {
                        self.find('.feedback-screen-uri').val('');
					}
				});
			}
			else {
                screenshot.on('click', function(){
                    screenshot.find('.fa').removeClass('fa-camera fa-check').addClass('fa-refresh fa-spin');
                    render(function() {
                        screenshot.find('.fa').removeClass('fa-refresh fa-spin').addClass('fa-check');
					});
                });
			}
			
			function render(callback) {
                if (self.is(".modal")) {
                    $(".modal-backdrop").attr("data-html2canvas-ignore", "true");
                }
                html2canvas($(document.body), {
                    onrendered: function(canvas) {
                        self.find('.feedback-screen-uri').val(canvas.toDataURL("image/png"));
                        if (callback) callback();
                    }
                });
			}

            self.find('.feedback-close').on('click', function(){
                self.find('.dropdown-toggle').dropdown('toggle');
                reset();
            });

            function reset() {
                self.find('.feedback-reported, .feedback-failed').hide();
                self.find('.feedback-report').show();
                self.find('.feedback-cam fa').removeClass('fa-check').addClass('fa-camera');
                form[0].reset();
            }

            function failed(){
                self.find('.feedback-loading').hide();
                self.find('.feedback-failed').show();
                if(fail) fail();
            }

            form.on('submit', function(){
                self.find('.feedback-report').hide();
                self.find('.feedback-loading').show();
                $.post( $(this).attr('action'), $(this).serialize(), null, 'json').done(function(res){
                    if(res.result === 'success'){
                        self.find('.feedback-loading').hide();
                        self.find('.feedback-reported').show();
                        if(success) success();
                    } else failed();
                }).fail(function(){
                    failed();
                });
                return false;
            });
		});
	};
}( jQuery ));

$(document).ready(function () {
	$('.feedback').feedback();
});