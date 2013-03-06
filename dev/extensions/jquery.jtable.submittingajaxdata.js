/************************************************************************
* FOOTER extension for jTable                                           *
* Author: Abu Ali Muhammad Sharjeel                                     *
*************************************************************************/
(function ($) {

    //Reference to base object members
    var base = {
        _submitFormUsingAjax: $.hik.jtable.prototype._submitFormUsingAjax,
    };


    //extension members
    $.extend(true, $.hik.jtable.prototype, {



        /* OVERRIDES BASE METHOD */
        _submitFormUsingAjax: function (url, formData, success, error) {
            var self = this;

            if (self.option().submittingAjaxData) {

                var data = {
                    record: self._convertQueryStringToObject(formData)
                };

                data = self.option().submittingAjaxData(data);

                formData = $.param(data.record);
            }
            base._submitFormUsingAjax.apply(this, arguments);
        },
        
        _convertQueryStringToObject: function (queryString) {
            var jsonObj = {};
            var e,
                a = /\+/g,
                r = /([^&=]+)=?([^&]*)/g,
                d = function (s) { return decodeURIComponent(s.replace(a, " ")); };

            while (e = r.exec(queryString)) {
                jsonObj[d(e[1])] = d(e[2]);
            }

            return jsonObj;
        }
    });

})(jQuery);