/************************************************************************
* DATA RELOAD extension for jTable                                      *
* Author: Guillermo Bisheimer                                           *
*************************************************************************/
(function($) {

    //Reference to base object members
    var base = {
        _create: $.hik.jtable.prototype._create
    };

    //extension members
    $.extend(true, $.hik.jtable.prototype, {

        /************************************************************************
         * DEFAULT OPTIONS / EVENTS                                              *
         *************************************************************************/
        options: {
            showReloadButton: false,
            messages: {
                reload: 'Reload table data'
            }
        },

        /************************************************************************
        * OVERRIDED METHODS                                                     *
        *************************************************************************/

        /* Overrides base method to create footer constructions.
         *************************************************************************/
        _create: function() {
            base._create.apply(this, arguments);
            if( this.options.showReloadButton ){
                this._createTableReloadButton();
            }
        },

        /************************************************************************
        * PRIVATE METHODS                                                       *
        *************************************************************************/        

        /* Creates reload button on table title DIV
         *************************************************************************/
        _createTableReloadButton: function () {
            var self = this;
            
            var $titleDiv = $('div.jtable-title', this._$mainContainer);
            var $textSpan = $('<span />')
            .html(self.options.messages.reload);

            $('<button></button>')
            .addClass('jtable-command-button jtable-reload-button')
            .attr('title', self.options.messages.reload)
            .append($textSpan)
            .appendTo($titleDiv)
            .click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                self.reload();
            });
        }
    });

})(jQuery);