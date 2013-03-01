
var zClass = (function () {
	
    /*!
     * JavaScript meaningfull zClassic OOP zClass Factory
     * @author  Andrea Giammarchi
     * @license Mit Style
     */

    /**
     * Public exposed zClass function
     * @param   Object  the zClass definition
     */
    function zClass(definition) {
        // create the function via named declaration
        function zClass() {}

        // find out if this is an extend
        var $extend = hasOwnProperty.call(definition, "extend");
        
        // temporary shortcut for inherited statics
        var $;

        // reassign the zClass if there is a constructor ...
        if (hasOwnProperty.call(definition, "constructor")) {
            // wrapping it for faster execution
            zClass = constructor(definition.constructor);
        } else if ($extend && definition.extend) {
	        zClass = constructor(definition.extend.prototype.constructor);
        }

        // assign inherited public static properties/methods, if defined in the extend definition
        if (
            $extend &&
            hasOwnProperty.call($ = definition.extend, "definition") &&
            hasOwnProperty.call($ = $.definition, "statics")
        ) {
            extend.call(zClass, $.statics);
        }

        // assign public static properties/methods, if defined
        // eventually overwrite inherited statics
        if (hasOwnProperty.call(definition, "statics")) {
            extend.call(zClass, definition.statics);
        }

        // assign the prototype accordingly with extend
        ($extend ?
            // chain the prototype extending it with the definition object
            extend.call(zClass.prototype = create(definition.extend.prototype), definition) :
            
            zClass.prototype = create(definition)
        )
            // be sure the constructor is the right one
            .constructor = zClass
        ;
        
        zClass.prototype.setOptions = storeOptions;

        // return the created zClass
        return zClass;
    }

    // wrap the constructor via closure
    function constructor(constructor) {
        // creating a named declared zClass function
        function zClass() {
            // return in any case for dual behaviors (factories)
            return constructor.apply(this, arguments);
        }
        return zClass;
    }

    // extend a gneric context via __proto__ object
    function extend(__proto__) {
        for (var key in __proto__) {
            if (hasOwnProperty.call(__proto__, key)) {
                this[key] = __proto__[key];
            }
        }
        
       // if (!has_constructor) this.constructor()
        return this;
    }
    
    function storeOptions(options) {
	    if (!this.options) this.options = {};
	    
	    Object.each(options, function(key, value) {
		   this.options[value] = key; 
	    }.bind(this));
    }

    // trap the original Object.prototype.hasOwnProperty function
    // as shortcut and hoping nobody changed it before this file inclusion ...
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    
    // quick/fast Object.create emulator, if not in ES5
    var create = Object.create || (function () {
        function Object() {}
        return function (__proto__) {
            Object.prototype = __proto__;
            return new Object;
        };
    })();

    //* optional standard "for in" for Internet Explorer
    // it could be removed if we don't define "magic mathods" in definition objects
    // Internet Explorer does not enumerate properties/methods
    // with name present in the Object.prototype
    if (!({toString:null}).propertyIsEnumerable("toString")) {
        // if this happens, to make the extend consistent
        // we need to force Object.prototype names
        extend = (function ($extend) {
            function extend(__proto__) {
                for (var i = length, key; i--;) {
                    if (hasOwnProperty.call(__proto__, key = split[i])) {
                        this[key] = __proto__[key];
                    }
                }
                // execute the original extend in any case for other properties/methods
                return $extend.call(this, __proto__);
            }
            // constructor is not in the list since there is a re-assignment in any case
            var split = "hasOwnProperty.isPrototypeOf.propertyIsEnumerable.toLocaleString.toString.valueOf".split(".");
            var length = split.length;
            return extend;
        })(extend);
    }
    //*/

    // a zClass is a Function and nothing else
    zClass.prototype = Function.prototype;

    return zClass;

})();