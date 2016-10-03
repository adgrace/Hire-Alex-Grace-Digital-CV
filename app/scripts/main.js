$(document).ready(function() {
	'use strict';
	$('.navbar').hide();
	
    var $body   = $(document.body);
    var jumbotronHeight = $('.jumbotron').outerHeight(true);
    var navHeight = $('.navbar').outerHeight(true);
            
    $('#sidebar').affix({
        offset: {
            top: jumbotronHeight- navHeight
        }
    });

    $body.scrollspy({
	    target: '#leftCol',
	    offset: navHeight
    });
    
	$(window).scroll(function () {
		// set distance user needs to scroll before we fadeIn navbar
		if ($(this).scrollTop() > jumbotronHeight - navHeight) {
			$('.navbar').fadeIn();
		} else {
			$('.navbar').fadeOut();
		}
	});
    
    $('.sidebar li a').click(function (event) {
        var navOffset = $('.navbar').outerHeight(true);
        var scrollPos = $('body > .container').find($(this).attr('href')).offset().top - navOffset+1;
        $('body,html').animate({
            scrollTop: scrollPos
        }, 500, function () {
            $('.sidebar').click();
        });
        return false;
    });
    
    $('#inputCallBack').datetimepicker({
        format: 'mm/dd/yyyy hh:ii Z',
        timezone: 'GMT',
        weekStart: 1,
        startDate: '+1d',
        endDate: '+60d',
        autoclose: true,
        pickerPosition: 'top-left',
        maxView: 60,
        minuteStep: 15,
        fontAwesome: true
    }).on('changeDate', function(e) {
        var TimeZoned = new Date(e.date.setTime(e.date.getTime() + (e.date.getTimezoneOffset() * 60000)));
        $('#inputCallBack').datetimepicker('setDate', TimeZoned);
    });
    
    $('#inputPhone').intlTelInput({
        nationalMode: true,
        geoIpLookup: function(callback) {
            $.get('http://ipinfo.io', function() {}, 'jsonp').always(function(resp) {
                var countryCode = (resp && resp.country) ? resp.country : '';
                callback(countryCode);
            });
        },
        initialCountry: 'auto',
        utilsScript: 'scripts/utils.js'
    });
    
    $('.dropdown-toggle').click(function() {
        var location = $(this).attr('href');
        window.location.href = location;
        return false;
    });
   
        
    $('#contactForm').validator({
        custom: {
            'phonenumber': function($el) {
                var bool = $el.intlTelInput('isValidNumber');
                if (bool == false){
                    return true;
                }
            }
        },
        errors: {
            odd: 'Please enter a valid telephone number'
        }
    });
    
    
    $('#contactForm').validator().on('submit', function (e) {
        if (e.isDefaultPrevented()) {
            // handle the invalid form...
            $('#contactForm').validator('validate');
            $('.modal-title').html('I really want to get in contact with you but...');
            $('.modal-body').html('Please complete all fields');
            $('#contact-modal').modal('show');
        } else {
            // everything looks good!
            e.preventDefault();
            var inputName = $('#inputName').val();
            var inputCompany = $('#inputCompany').val();
            var inputEmail = $('#inputEmail').val();
            var inputPhone = $('#inputPhone').intlTelInput('getNumber');
            var inputMessage = $('#inputMessage').val();
            var inputCallBack = $('#inputCallBack').val();
            var dataString = {'inputName' : inputName, 'inputCompany' : inputCompany, 'inputEmail' : inputEmail , 'inputPhone' : inputPhone, 'inputMessage' : inputMessage , 'inputCallBack' : inputCallBack};
            $.ajax({
                cache: false,
                type: 'POST',
                url: 'contact-form-handler.php',
                data: dataString,
                dataType: 'json',
                async: false,
                success: function(data) {
                    if(data.status == 'success'){
                        $('.modal-title').html('Thank you for the message');
                        document.getElementById('contactForm').reset()
                        if (inputCallBack == '') {
                             $('.modal-body').html('Your message has been sent to me and I will reply as soon as possible.');
                        } else {
                             $('.modal-body').html('Your message has been sent to me and I look forward to speaking to you soon and finding out more about opportunites at ' + inputCompany + '.<br /><br />Phone Number: ' + inputPhone + '<br />Callback Date and Time: ' + inputCallBack);
                        }
                        $('#contact-modal').modal('show');
                    }else if(data.status == 'error'){
                        $('.modal-title').html('This is awkward');
                        $('.modal-body').html('I really want to be in contact with you but there seems to have been an error.<br />Please try resubmitted the form or alternatively email me (alex@grace6.plus.com)');
                        $('#contact-modal').modal('show');
                    }
                },
                error: function() {
                    $('.modal-title').html('This is awkward');
                    $('.modal-body').html('I really want to be in contact with you but there seems to have been an error.<br />Please try resubmitted the form or alternatively email me (alex@grace6.plus.com)');
                    $('#contact-modal').modal('show');
                }
            });
            return false;
        }
    });


    $('#HideShowDeutsche').click(function(){
        $('#Deutsche').collapse('toggle');
		if($('#HideShowDeutsche').attr('aria-expanded') === 'false'){
			$('#HideShowDeutsche').html('<p>More Details <i class="fa fa-chevron-up rotate down"></p>');			
		} else {
			$('#HideShowDeutsche').html('<p>Less Details <i class="fa fa-chevron-up rotate"></p>');
		}
	});
    $('#HideShowJPMorganChase').click(function(){
        $('#JPMorganChase').collapse('toggle');
		if($('#HideShowJPMorganChase').attr('aria-expanded') === 'false'){
			$('#HideShowJPMorganChase').html('<p>More Details <i class="fa fa-chevron-up rotate down"></p>');			
		} else {
			$('#HideShowJPMorganChase').html('<p>Less Details <i class="fa fa-chevron-up rotate"></p>');
		}
	});
    $('#HideShowStudentLifeMentor').click(function(){
        $('#StudentLifeMentor').collapse('toggle');
		if($('#HideShowStudentLifeMentor').attr('aria-expanded') === 'false'){
			$('#HideShowStudentLifeMentor').html('<p>More Details <i class="fa fa-chevron-up rotate down"></p>');			
		} else {
			$('#HideShowStudentLifeMentor').html('<p>Less Details <i class="fa fa-chevron-up rotate"></p>');
		}
	});
    $('#HideShowHollister').click(function(){
        $('#Hollister').collapse('toggle');
		if($('#HideShowHollister').attr('aria-expanded') === 'false'){
			$('#HideShowHollister').html('<p>More Details <i class="fa fa-chevron-up rotate down"></p>');			
		} else {
			$('#HideShowHollister').html('<p>Less Details <i class="fa fa-chevron-up rotate"></p>');
		}
	});
    $('#HideShowWaitrose').click(function(){
        $('#Waitrose').collapse('toggle');
		if($('#HideShowWaitrose').attr('aria-expanded') === 'false'){
			$('#HideShowWaitrose').html('<p>More Details <i class="fa fa-chevron-up rotate down"></p>');			
		} else {
			$('#HideShowWaitrose').html('<p>Less Details <i class="fa fa-chevron-up rotate"></p>');
		}
	});
    $('#HideShowCastle').click(function(){
        $('#Castle').collapse('toggle');
		if($('#HideShowCastle').attr('aria-expanded') === 'false'){
			$('#HideShowCastle').html('<p>More Details <i class="fa fa-chevron-up rotate down"></p>');			
		} else {
			$('#HideShowCastle').html('<p>Less Details <i class="fa fa-chevron-up rotate"></p>');
		}
	});
    
    $('.C').barrating({
        theme: 'bars-1to10',
        initialRating: '4',
        readonly: true,
        showSelectedRating: false
    });
    $('.CPP').barrating({
        theme: 'bars-1to10',
        initialRating: '3',
        readonly: true,
        showSelectedRating: false
    });
    $('.Java').barrating({
        theme: 'bars-1to10',
        initialRating: '3',
        readonly: true,
        showSelectedRating: false
    });
    $('.Javascript').barrating({
        theme: 'bars-1to10',
        initialRating: '4',
        readonly: true,
        showSelectedRating: false
    });
    $('.Node').barrating({
        theme: 'bars-1to10',
        initialRating: '3',
        readonly: true,
        showSelectedRating: false
    });
    $('.Swift').barrating({
        theme: 'bars-1to10',
        initialRating: '4',
        readonly: true,
        showSelectedRating: false
    });
    $('.SQL').barrating({
        theme: 'bars-1to10',
        initialRating: '4',
        readonly: true,
        showSelectedRating: false
    });
    $('.WebDev').barrating({
        theme: 'bars-1to10',
        initialRating: '5',
        readonly: true,
        showSelectedRating: false
    });
    $('.PHP').barrating({
        theme: 'bars-1to10',
        initialRating: '2',
        readonly: true,
        showSelectedRating: false
    });
   	$('.Unix').barrating({
        theme: 'bars-1to10',
        initialRating: '4',
        readonly: true,
        showSelectedRating: false
    });
   
   
    $('.Informatica').barrating({
        theme: 'bars-1to10',
        initialRating: '5',
        readonly: true,
        showSelectedRating: false
    });
    $('.Matlab').barrating({
        theme: 'bars-1to10',
        initialRating: '3',
        readonly: true,
        showSelectedRating: false
    });
    $('.Geneos').barrating({
        theme: 'bars-1to10',
        initialRating: '4',
        readonly: true,
        showSelectedRating: false
    });
    $('.Cloud').barrating({
        theme: 'bars-1to10',
        initialRating: '4',
        readonly: true,
        showSelectedRating: false
    });
    $('.Cognos').barrating({
        theme: 'bars-1to10',
        initialRating: '4',
        readonly: true,
        showSelectedRating: false
    });
    $('.BO').barrating({
        theme: 'bars-1to10',
        initialRating: '4',
        readonly: true,
        showSelectedRating: false
    });
   
    $('.match-languages-text').matchHeight();

    $('.match-software-text').matchHeight();

    $('.match-language').matchHeight();
  
    $('.match-software').matchHeight();

    $('.match-achievements').matchHeight();

    $('.uni-image').matchHeight({
        target: $('.uni-text'),
        property: 'height'
    });

    $('.chew-image').matchHeight({
        target: $('.chew-text'),
        property: 'height'
    });

    $('.tribe-image').matchHeight({
        target: $('.tribe-text'),
        property: 'height'
    });

    $('.deutsche-image').matchHeight({
        target: $('.deutsche-text'),
        property: 'height'
    });

    $('.jpmorganchase-image').matchHeight({
        target: $('.jpmorganchase-text'),
        property: 'height'
    });

    $('.surrey-image').matchHeight({
        target: $('.surrey-text'),
        property: 'height'
    });


    $('.hollister-image').matchHeight({
        target: $('.hollister-text'),
        property: 'height'
    });

    $('.waitrose-image').matchHeight({
        target: $('.waitrose-text'),
        property: 'height'
        });
  
    $('.quickfit').quickfit({
       	max: '28',
        min: '14',
        tolerance: 0.1
  	});
});