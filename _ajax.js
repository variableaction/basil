var LOG_DASHES = '#---------------------------------------------';
var LOG_ERROR  = '#*********************************************';
var LOG_OPENER = '# ';


/***
#############################################################################################################################

	Class: 			_ajax
	
	Creator: 		Jason Spangler
	Created: 		8/29/12
	
	Modifier:		Jason Spangler
	Modified: 		1/4/13

	Description: 	All the ajax methods currently using mootools request

#############################################################################################################################
*/
var _ajax = {

	/***
		Method:			report
		Creator:		Jason Spangler
		Created:		8/29/12
	
		Modifier:		Jason Spangler
		Modified:		1/4/13
	
		Description:	Central spot where all consoleLogs happen for ajax
		@param: 		message (MIXED) The message/object to log
	*/
	report: function() {
		for (str in arguments) {
			consoleLog(arguments[str]);
		}
	},
	
	
	/***
		Method:			reportIssueWithCode
		Creator:		Jason Spangler
		Created:		8/29/12
	
		Modifier:		Jason Spangler
		Modified:		1/4/13
	
		Description:	Reports an error code to the user
		@param: 		request_object (INT) The request error code number
		@param:			type (STRING) Either a failure or error
	*/
	reportIssueWithCode: function(request_object, type) {
		_ajax.report(request_object.status + ' ' + type + '!', request_object, LOG_ERROR);
		
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
		Method:			reportSuccess
		Creator:		Jason Spangler
		Created:		8/29/12
	
		Modifier:		Jason Spangler
		Modified:		1/4/13
	
		Description:	Reports the success of the ajax call
		@param: 		data (OBJECT) The response object
	*/
	reportSuccess: function(data) {
		_ajax.report('Success!', data, LOG_DASHES);
	},
	


	/***
		Method:			reportComplete
		Creator:		Jason Spangler
		Created:		8/29/12
	
		Modifier:		Jason Spangler
		Modified:		1/4/13
	
		Description:	Reports after a complete ajax call
		@param: 		data (OBJECT) The response object
	*/
	reportComplete: function(data) {
		_ajax.report('Complete!', { content: data }, LOG_DASHES);
	},
	


	/***
		Method:			reportRequest
		Creator:		Jason Spangler
		Created:		8/29/12
	
		Modifier:		Jason Spangler
		Modified:		1/4/13
	
		Description:	Logs the object of the request being sent
		@param: 		url (STRING) The url to send request to
		@param:			data (OBJECT) The data being sent
	*/
	reportRequest: function(url, data) {
		_ajax.report(LOG_DASHES, 'Sending request to: ' + url, data);
	},
	
	
	/*************************************************************************
		
	**************************************************************************/
	request: function(request, type, url, data, cbfunc, async) {
		
		new request({
			url: url,
			async: !async,
			onRequest: function(response) {
				_ajax.reportRequest(url, data);
			},
			onSuccess: function(json, text) {
				_ajax.reportSuccess(json);
				if (cbfunc && typeof cbfunc == 'function') cbfunc(json);
			},
			onError: function(response) {
				_ajax.reportIssueWithCode(response, 'error');
			},
			onFailure: function(response) {
				_ajax.reportIssueWithCode(response, 'failure');
			}
		})[type](data);
	},
	
	
	/***
		Method:			postJSON
		Creator:		Jason Spangler
		Created:		8/29/12
	
		Modifier:		Jason Spangler
		Modified:		1/4/13
	
		Description:	Does a JSON post using the Mootools request class
		@param: 		url (STRING) The url to send the request to
		@param:			data (OBJECT) The data to post
		@param:			cbfunc (FUNCTION) The call back function
		@param:			async (BOOL) If true, the request will pause all computation and wait for response
	*/
	postJSON: function(url, data, cbfunc, async) {
		_ajax.request(Request.JSON, 'post', url, data, cbfunc, async);
	},
	

	/***
		Method:			post
		Creator:		Jason Spangler
		Created:		8/29/12
	
		Modifier:		Jason Spangler
		Modified:		1/4/13
	
		Description:	Does an ajax post and returns non-json content
		@param: 		url (STRING) The url to send the request to
		@param:			data (OBJECT) The data to post
		@param:			cbfunc (FUNCTION) The call back function
		@param:			async (BOOL) If true, the request will pause all computation and wait for response
	*/
	post: function(url, data, cbfunc, async) {
		_ajax.request(Request, 'post', url, data, cbfunc, async);
	},
	
	/***
		Method:			getJSON
		Creator:		Jason Spangler
		Created:		8/29/12
	
		Modifier:		Jason Spangler
		Modified:		1/4/13
	
		Description:	Does an ajax get and returns json content
		@param: 		url (STRING) The url to send the request to
		@param:			data (OBJECT) The data to post
		@param:			cbfunc (FUNCTION) The call back function
		@param:			async (BOOL) If true, the request will pause all computation and wait for response
	*/
	getJSON: function(url, data, cbfunc, async) {
		_ajax.request(Request.JSON, 'get', url, data, cbfunc, async);
	},
	
	/***
		Method:			get
		Creator:		Jason Spangler
		Created:		8/29/12
	
		Modifier:		Jason Spangler
		Modified:		1/4/13
	
		Description:	Does an ajax get and returns non-json content
		@param: 		url (STRING) The url to send the request to
		@param:			data (OBJECT) The data to post
		@param:			cbfunc (FUNCTION) The call back function
		@param:			async (BOOL) If true, the request will pause all computation and wait for response
	*/
	get: function(url, data, cbfunc, async) {
		_ajax.request(Request, 'get', url, data, cbfunc, async);
	},

};
