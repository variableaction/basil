var LOG_DASHES = '#---------------------------------------------';
var LOG_ERROR  = '#*********************************************';
var LOG_OPENER = '# ';


/***
#############################################################################################################################

	Class: 			Basil.ajax

	Description: 	All the ajax methods currently using mootools request

#############################################################################################################################
*/
Basil.ajax = {

	/***
		Description:	Central spot where all consoleLogs happen for ajax
		@param: 		message (MIXED) The message/object to log
	*/
	report: function() {
		for (str in arguments) {
			consoleLog(arguments[str]);
		}
	},
	
	
	/***	
		Description:	Reports an error code to the user
		@param: 		request_object (INT) The request error code number
		@param:			type (STRING) Either a failure or error
	*/
	reportIssueWithCode: function(request_object, type) {
		Basil.ajax.report(request_object.status + ' ' + type + '!', request_object, LOG_ERROR);
		
		switch (request_object.status) {
			case '401', 401:
				consoleLog('Your session has expired, please store all unsaved changes and log back in!');
				break;
			default:
				consoleLog('There was a request ' + type + ', try reloading. If issue persists please email support!');
				break;
		}
	},



	/***
		Description:	Reports the success of the ajax call
		@param: 		data (OBJECT) The response object
	*/
	reportSuccess: function(data) {
		Basil.ajax.report('Success!', data, LOG_DASHES);
	},
	


	/***
		Description:	Reports after a complete ajax call
		@param: 		data (OBJECT) The response object
	*/
	reportComplete: function(data) {
		Basil.ajax.report('Complete!', { content: data }, LOG_DASHES);
	},
	


	/***
		Description:	Logs the object of the request being sent
		@param: 		url (STRING) The url to send request to
		@param:			data (OBJECT) The data being sent
	*/
	reportRequest: function(url, data) {
		Basil.ajax.report(LOG_DASHES, 'Sending request to: ' + url, data);
	},
	
	
	/***
		Description:	Needs dataType, type, url, data, cbfunc, async
		@param: 		options (OBJECT) The options to instantiate and send the request
	*/
	request: function(options) {
		
		defaults = {
			'method'	: 'GET',
			'async'		: false,
			'data'		: {},
			'dataType'	: 'html',
			'callback'	: function(response) {}
		};
		
		options = Basil.util.extend(defaults, options); // (options extends defaults)
		
		// Internal only tools
		// Basil.util.ajax()
		// Basil.util.extend()
		// Basil.util.stringify()
		
		// Basil.events
		// Basil.content.events
		//*Basil.app.events
		// Basil.user.events
		
		//options.method;
		
		
		if (window.jQuery) {
			
			jQuery_options = {
				
			}
			
			if (options.dataType == 'JSONP') {
				jQuery_options['jsonpCallback'] = options.callback;
			}
			
			$.ajax({
				dataType	: options.dataType,
				url			: options.url,
				type		: options.type
			}).done(function() {
				$(this).addClass("done");
			});
			
			
		} else if (window.MooTools) {
			new Request({
				url: url,
				format: options.dataType,
				async: !async,
				onRequest: function(response) {
					Basil.ajax.reportRequest(url, data);
				},
				onSuccess: function(json, text) {
					Basil.ajax.reportSuccess(json);
					if (cbfunc && typeof cbfunc == 'function') cbfunc(json);
				},
				onError: function(response) {
					Basil.ajax.reportIssueWithCode(response, 'error');
				},
				onFailure: function(response) {
					Basil.ajax.reportIssueWithCode(response, 'failure');
				}
			})[type.toLowerCase()](data);
		
		} else {
			frameworkNotice('Basil currently depends on jQuery or MooTools to run');
		}
		
	},


	/***
		Description:	Does a JSON post using the Mootools request class
		@param: 		url (STRING) The url to send the request to
		@param:			data (OBJECT) The data to post
		@param:			cbfunc (FUNCTION) The call back function
		@param:			async (BOOL) If true, the request will pause all computation and wait for response
	*/
	postJSON: function(url, data, cbfunc, async) {
		Basil.ajax.request(Request.JSON, 'post', url, data, cbfunc, async);
	},
	

	/***
		Description:	Does an ajax post and returns non-json content
		@param: 		url (STRING) The url to send the request to
		@param:			data (OBJECT) The data to post
		@param:			cbfunc (FUNCTION) The call back function
		@param:			async (BOOL) If true, the request will pause all computation and wait for response
	*/
	post: function(url, data, cbfunc, async) {
		Basil.ajax.request(Request, 'post', url, data, cbfunc, async);
	},
	
	/***
		Description:	Does an ajax get and returns json content
		@param: 		url (STRING) The url to send the request to
		@param:			data (OBJECT) The data to post
		@param:			cbfunc (FUNCTION) The call back function
		@param:			async (BOOL) If true, the request will pause all computation and wait for response
	*/
	getJSON: function(url, data, cbfunc, async) {
		Basil.ajax.request(Request.JSON, 'get', url, data, cbfunc, async);
	},
	
	/***
		Description:	Does an ajax get and returns non-json content
		@param: 		url (STRING) The url to send the request to
		@param:			data (OBJECT) The data to post
		@param:			cbfunc (FUNCTION) The call back function
		@param:			async (BOOL) If true, the request will pause all computation and wait for response
	*/
	get: function(url, data, cbfunc, async) {
		Basil.ajax.request(Request, 'get', url, data, cbfunc, async);
	},

};
