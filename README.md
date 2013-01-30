# Basil
______
## Overview

*Currently depends on MooTools

*Basil*, is a view/controller package for frontend designers and javascript developers. *Basil* dyanmically loads views, can attach events to tags, and load dynamic content from simple HTML attributes. Basil has a built in hash change listener built with HTML/Javascript, and is javascript framework independent. 

**Designers:** *Basil* uses Simple HTML markup attributes to control the the behaviors, triggers, views, and data calls. This enables you to mark up views/templates with little to no coordination with the backend developers. Views are stored as .tpl files in the views folder, views are are purely HTML.  

**Developers:** *Basil* abstracts interface codings into behaviors, triggers, and data calls. There is a little more work on your end to understand how Basil accesses the code, but it will pay off as your designers can be marking up and styling as your develop. Let's look at some quick examples before we get into detail. 

### Quick Examples
*Basil* is organized into views, behavoirs, and triggers. Here we briefly explain each one.

#####View Example
___
Views are the base of Basil, they are simple to operate and worth using Basil alone for.

`<div data-view="snippet-contact-form"></div>`

*Basil* sees the **data-view="snipper-contact-form"** attribute on the div tag, it then looks for the file in the "**basil/views/snippet/contact-form.tpl**" and injects the content found there. If there is no view the error is printed to console.

#####Datacall Example
___
Datacalls directly inject dynamic data into your HTML markup. You can have a datacall on any tag. The tags inner html is replaced with the value of the field you are asking for in the call.

`<span data-field="first_name"></span>`

*Basil* sees the **data-field="first_name-contact-form"** attribute on the span tag, it then looks in to the **view_object**  JSON object inside basil and references **basil.view_object.first_name** value. One more quick example:

`<span data-call="my_custom_object" data-field="person.first_name"></span>`

*Basil* sees the **data-call="my_custom_object"** attribute on the span tag, it then looks in to the **my_custom_object** global JSON object and references **my_custom_object.person.last_name** value. This can be used with any global object.

#####Trigger Example
___
Triggers are fired on the load of the views, they are meant to be javascript dependent items that are loaded dyanmically. Examples are dynamic tables, external widgets, and reponses.

`<span data-trigger="loadTwitterWidget"></span>`

*Basil* sees the **data-trigger="loadTwitterWidget"** attribute on the span tag, it then looks into the trigger object and calls the function **loadTwitterWidget**. By default the element that has the trigger is passed into the **loadTwitterWidget** function as the first parameter. Note you could also call views, triggers, behaviors, and data calls within markup created by your trigger.

#####Behavior Example
___
Behaviors add event listeners to tags. If you want 

`<a href="javascript:void(0)" data-behavior="onhover:showHelpImage">Show Help Image</a>`

*Basil* sees the **data-behavior="onhover:showHelpImage"** attribute on the a tag, it then looks into the behavoir object and attaches the event listener found in the **showHelpImage** behavior.


## Developer Documentation

### Data Calls & *view_object*

The **view_object** is the base JSON object that is accessed by your basic data call in Basil. You will want the dynamic page values the designer needs to access in the current_view object. Alternatively you can use custom global JSON objects. Called by `<span data-call="my_custom_object" data-field="person.first_name"></span>` 

### Triggers

When Basil see's a **data-trigger** it looks at the Trigger object for the function declared inside the **data-trigger** attribute.  `<div data-trigger="loadUserInformation"></div>` calls the function **Trigger.loadUserInformation(el)** as soon as the element is inserted in the dom. The **/basil/triggers/** folder is where you can add more functions to the Trigger object.



### Behaviors

A behavior is an event you can attach to any element. When Basil encounters a **data-behavior** it will look at the behavior type and the function associated with it and attach a listener. For instance, `<a href="javascript:void(0)" data-behavior="click:savePage">Save</a>` will create a click event calling the function **Behavior.savePage(event)**. You can attach multiple events by separating the attribute with a semi-colon, `<input type="text" data-behavior"click:expandText;keyup:checkText">`. The **/basic/behaviors/** folder is where you can add more functions to the Behavior object.
