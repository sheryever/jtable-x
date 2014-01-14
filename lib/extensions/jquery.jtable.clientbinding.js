/************************************************************************
* CLIENT BINDING extension for jTable                                           *
* Author:                                           *
*************************************************************************/
(function($) {

    //Reference to base object members
    var base = {
        _createRecordLoadUrl: $.hik.jtable.prototype._createRecordLoadUrl,
        _reloadTable: $.hik.jtable.prototype._reloadTable
    };

    //extension members
    $.extend(true, $.hik.jtable.prototype, {

        /************************************************************************
        * DEFAULT OPTIONS / EVENTS                                              *
         *************************************************************************/
        options: {
        	clientBinding: false,
			clientData: null
        },

        /************************************************************************
        * PRIVATE FIELDS                                                        *
        *************************************************************************/
		//define client binding related future stuff here
		//Reference to the clientBinding 

		_$clientData: null,
        /************************************************************************
        * OVERRIDED METHODS                                                     *
        *************************************************************************/

    	/* Overrides _createRecordLoadUrl method create custom or Empty URL in client binding mode.
        *************************************************************************/
        _createRecordLoadUrl: function () {
        	if (this.options.clientBinding == true) {
        		this._$clientData = this.options.clientData;

        		return 'CUSTOM';
        	} else {
        		return base._createRecordLoadUrl.apply(this, arguments);
        	}
        },

    	/* Overrides _reloadTable method to re-load data for table.
        *************************************************************************/
        _reloadTable: function (completeCallback) {

        	if (this.options.clientBinding == false) {
        		return base._reloadTable.apply(this, arguments);
        	}

        	var self = this;

        	//Disable table since it's busy
        	self._showBusy(self.options.messages.loadingMessage, self.options.loadingAnimationDelay);

        	//Load data from server
        	self._onLoadingRecords();

        	//Re-generate table rows
        	self._removeAllRows('reloading');
        	self._addRecordsToTable(this._$clientData.Records);
        	self._hideBusy();

        	self._onRecordsLoaded(this._$clientData);

        	//Call complete callback
        	if (completeCallback) {
        		completeCallback();
        	}

        	return null;
        },

		/************************************************************************
		* PUBLIC METHODS                                                       *
		*************************************************************************/

    	/* When in client side binding mode, use this method for loading jTable instead of simple load
		*************************************************************************/
        loadClient: function (clientData, completeCallback) {
        	this._$clientData = clientData;
        	this._reloadTable(completeCallback);
        },
		
        /************************************************************************
        * PRIVATE METHODS                                                       *
        *************************************************************************/        

		//write private functionaly here if any
    });

})(jQuery);
