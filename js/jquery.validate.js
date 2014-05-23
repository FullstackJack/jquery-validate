/***************************
   jQuery Validate Plugin
   Author: Kyle Bedell
   Version: 1.0.0
****************************/
(function($){
	$.fn.validate = function( options ){
		var PLUGIN_TAG = 'jQuery Validate: ';
		
		var settings = $.extend({
			type: null, /* Values: "phone","email","password","ABA", etc. */
			phone: false,
			email: false,
			passwordOptions: {
				uppercase: false,
				lowercase: false,
				number: false,
				special: false,
				minimum: 8,
				maximum: null
			},
			onDone: null,
			required: false,
			match: null,
			debug: false,
			force: false
		}, options );
		
		return this.each( function( idx, el ){
			
			var result;
			var init = function(){
				
				$value = $(this).val();
				// If the value is not blank.
				if( $value != "" ){
					if( settings.phone || settings.type == "phone" ){
						regex = new RegExp(/^(\()?[2-9]\d{2}(\))?(\s)*(-|)?(\s)*[2-9]\d{2}(\s)*(-|)?(\s)*\d{4}$/);
						if( regex.test( $value ) ){
							if( settings.debug ){
								console.log( PLUGIN_TAG+$value+' is a phone number.' );
							}
							result = true;
						} else {
							if( settings.debug ){
								console.log( PLUGIN_TAG+$value+" is not a valid phone number.");
							}
							result = false;
						}
					} else if ( settings.email || settings.type == "email" ){
						regex = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
						if( regex.test( $value ) ){
							if( settings.debug ){
								console.log( PLUGIN_TAG+$value+' is a valid email address.' );
							}
							result = true;
						} else {
							if( settings.debug ){
								console.log( PLUGIN_TAG+$value+" is not a valid email address.");
							}
							result = false;
						}
					} else if ( settings.type == "password" ){
						// Start the regular expression.
						regexString = "(^";
						
						// Require a number?
						if( settings.passwordOptions.number ){
							regexString += "(?=.*\\d)";
						}
						
						// Require a lower case letter?
						if( settings.passwordOptions.lowercase ){
							regexString += "(?=.*[a-z])";
						}
						
						// Require an upper case letter?
						if( settings.passwordOptions.uppercase ){
							regexString += "(?=.*[A-Z])";
						}
						
						if( settings.passwordOptions.special ){
							regexString += "(?=.*[\\W])";
						}
						
						// Minimum length. ( Default: 8 )
						regexString += ".{"+settings.passwordOptions.minimum+",";
						
						// Set a maximum length.
						if( settings.passwordOptions.maximum > settings.passwordOptions.minimum ){
							regexString += settings.passwordOptions.maximum;
						}
						
						// Close the regular expression.
						regexString += "}$)";
						
						// Log regular expression in debug mode.
						if( settings.debug ){
							console.log( PLUGIN_TAG+regexString );
						}
						
						// RegExp initialization.
						regex = new RegExp( regexString );
						
						// Test the string.
						if( regex.test( $value ) ){
							if( settings.debug ){
								console.log( PLUGIN_TAG+$value+' is a valid password.' );
							}
							result = true;
						} else {
							if( settings.debug ){
								console.log( PLUGIN_TAG+$value+" is not a valid password.");
							}
							result = false;
						}
					
					} else if( settings.type == "date"){
						
						var month,
							day,
							year,
							date;
							
						date = $value.split('/');
						
						if( settings.debug ){
							console.log(PLUGIN_TAG+'Date ('+$value+')');
						}
						
						month = parseInt( date[0] );
						day = parseInt( date[1] );
						year = parseInt( date[2] );
						
						if( month >= 1 && month <= 12 ){
							if( day >= 1 && day <= 31 ){
								if( year >= 1 && year <= new Date().getFullYear() ){
									if ( (month==4 || month==6 || month==9 || month==11) && day ==31 ){
										result = false;
									} else if ( month == 2 ){
										var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
										if (day > 29 || (day ==29 && !isleap)){
											result = false;
										} else {
											result = true;
										}
									} else {
										result = true;
									}
								}
							}
						}			

					} else if( settings.type == "ABA" ){
					
						// Run through each digit and calculate the total.
						n = 0;
						for (i = 0; i < $value.length; i += 3) {
							n += parseInt( $value.charAt(i), 10 ) * 3
							+  parseInt( $value.charAt(i + 1), 10) * 7
							+  parseInt( $value.charAt(i + 2), 10);
						}

						// If the resulting sum is an even multiple of ten (but not zero),
						// the aba routing number is good.
						if (n != 0 && n % 10 == 0){
							result = true;
						} else {
							result = false;
						}
					} else if( settings.type == "number" ){
						result = new RegExp( /^\d+$/ ).test( $value );
					}
				} else {
					result = false;
				}
				
				// Is this a required field?
				if( settings.required ){
					// Perform a simple empty string check.
					if( $value == "" ){
						result = false;
					} else {
						result = true;
					}
				}
				
				// If the value needs to match a second input's value.
				if( settings.match ){
					
					// If the parameter is a jQuery object...
					if( settings.match instanceof jQuery ){
						// Check the value for a match.
						if( settings.match.val() != "" ){
							if( $value == settings.match.val() ){
								result = true;
							} else {
								result = false;
							}
						}
					// Else, if we have a CSS selector string...
					} else if( typeof settings.match === 'string' ){
						console.log( "String" );
						// If the CSS selector string is not empty.
						if( settings.match != "" ){
							if( $( settings.match ).val() != "" ){
								// Get the jQuery object of the CSS selector string and test.
								if( $value == $( settings.match ).val() ){
									result = true;
								} else {
									result = false;
								}
							}
						} else {
							result = false;
						}
					}
				}
				
				// Callback when done.
				if( typeof settings.onDone == "function" ){
					settings.onDone.call( this, result );
					// Return the jQuery object for chaining.
					return this;
				}
			}
			
			// Add keyup tests.
			$( el ).on('keyup', function( e ){
				init.call( this );
			});
			
			if( settings.force ){
				// Run initial test.
				init.call( this );
			}
			
			
			// Fall back for older version of plugin.
			return result;
				
		});
	}
})(jQuery);