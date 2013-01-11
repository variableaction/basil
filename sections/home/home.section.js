
/***
#############################################################################################################################

	Class: 			home_Section
	
	Creator: 		Jason Spangler
	Created: 		1/9/13
	
	Modifier:		Jason Spangler
	Modified: 		1/9/13

	Description: 	All necessary home functions go in here

#############################################################################################################################
*/
var home_Section = {

	/***
		Method:			basilDone
		Creator:		Jason Spangler
		Created:		8/29/12
	
		Modifier:		Jason Spangler
		Modified:		1/4/13
	
		Description:	Like the dom ready event, fired when basil is done processing all views
	*/
	basilDone: function() {

	},
	
	
	/***
		Method:			init
		Creator:		Jason Spangler
		Created:		8/29/12
	
		Modifier:		Jason Spangler
		Modified:		1/4/13
	
		Description:	Sets the browser title to current section
	*/
	init: function() {
		document.title = 'Home';
	},
	

	/***
		Method:			cleanupEvent
		Creator:		Jason Spangler
		Created:		8/29/12
	
		Modifier:		Jason Spangler
		Modified:		1/4/13
	
		Description:	The function to call before changing page to make sure
			 			there are no outstanding changes on the page
		@return:		(BOOL) True to keep loading content, false to stay on page
	*/
	cleanupEvent: function() {
		return true;
	},


	/***
		Method:			handleChangeDetected
		Creator:		Jason Spangler
		Created:		8/29/12
	
		Modifier:		Jason Spangler
		Modified:		1/4/13
	
		Description:	Called from basil object when a change is detected, updates save button text
		@see:			(CLASS) basil (METHOD) updateChangeDetected
	*/
	handleChangeDetected: function() {

	}
	
}

// end of home_Section
