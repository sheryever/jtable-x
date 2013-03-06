/* 

ASP.NET Web Api Controller METHODS EXTENSION FOR JTABLE
http://www.jtable.org

Note: jquery.jtable.aspnetwebapi.js is extended from jquery.jtable.aspnetpagemethod.js written 
by Halil Ýbrahim Kalkan (http://www.halilibrahimkalkan.com)

------------------------------------------------------------------------------

Copyright (C) 2011 by Abu Ali Muhammad Sharjeel 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
(function ($) {

    //extension members
    $.extend(true, $.hik.jtable.prototype, {

        _getWebApiActionOptions: function (url) {

            var httpMethodIndex = url.indexOf('@');
            if (httpMethodIndex < 1)
                return undefined;

            var httpMethod = url.substring(0, httpMethodIndex);
            var newUrl = url.substring(++httpMethodIndex, url.length);

            return { httpMethod: httpMethod, url: newUrl };
        },

        /* OVERRIDES BASE METHOD */
        _ajax: function (options) {
            var self = this;

            var opts = $.extend({}, this.options.ajaxSettings, options);

            if (opts.data == null || opts.data == undefined) {
                opts.data = {};
            } else if (typeof opts.data == 'string') {
                opts.data = self._convertQueryStringToObject(opts.data);
            }

            var qmIndex = opts.url.indexOf('?');
            if (qmIndex > -1) {
                $.extend(opts.data, self._convertQueryStringToObject(opts.url.substring(qmIndex + 1)));
            }

            opts.data = JSON.stringify(opts.data);
            opts.contentType = 'application/json; charset=utf-8';


            var webApiActionOptions = this._getWebApiActionOptions(opts.url);

            if (!webApiActionOptions) {
                webApiActionOptions = { url: url, httpMethod: 'POST' };
            }

            opts.url = webApiActionOptions.url;
            opts.type = webApiActionOptions.httpMethod;

            //Override success
            opts.success = function (data) {
                if (options.success) {
                    data = self._fixDefaultDateInJSONReturnData(data);
                    options.success(data);
                }
            };

            //Override error
            opts.error = function () {
                if (options.error) {
                    options.error();
                }
            };

            //Override complete
            opts.complete = function () {
                if (options.complete) {
                    options.complete();
                }
            };

            $.ajax(opts);
        },

        /* OVERRIDES BASE METHOD */
        _submitFormUsingAjax: function (url, formData, success, error) {
            var self = this;

            formData = {
                //record: formData//self._convertQueryStringToObject(formData)
                record: self._convertQueryStringToObject(formData)
            };

            formData.record = self._convertDateToIsoString(self.option().fields, formData.record);

            if (self.option().submittingAjaxData) {
                formData = self.option().submittingAjaxData(formData);
            }

            var qmIndex = url.indexOf('?');
            if (qmIndex > -1) {
                $.extend(formData, self._convertQueryStringToObject(url.substring(qmIndex + 1)));
            }

            var postData = JSON.stringify(formData.record);
            //var postData = formData.record;
            
            var webApiActionOptions = this._getWebApiActionOptions(url);

            if (!webApiActionOptions) {
                webApiActionOptions = { url: url, httpMethod: 'POST' };
            }
 
            $.ajax({
                url: webApiActionOptions.url,
                type: webApiActionOptions.httpMethod,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: postData,
                success: function (data) {
                    data = self._fixDefaultDateInJSONReturnData(data);
                    success(data);
                },
                error: function () {
                    error();
                }
            });
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
        },
        
        _convertDateToIsoString: function(fields, record) {
            
            for (var fieldKey in fields) {
                var field = fields[fieldKey];
            
                if (field.type == 'date') {
                    var value = record[fieldKey];
                    if (value) {
                        var date = this._stringToDate(value, field.displayFormat);
                        value = date.toJSON();
                        record[fieldKey] = value;
                    } else {
                        record[fieldKey] = "2000-01-01T00:00:00";
                    }
                }
            }
            
            return record;
        },
        
        _stringToDate: function(dateString, dateFormat) {

            if (dateString.length > 12)
                return new Date(dateString);
            
            return $.datepicker.parseDate(dateFormat, dateString);
        },
        
        _fixDefaultDateInJSONReturnData: function (data) {
            var self = this;
            if (data.hasOwnProperty('Record')) {
                data.Record = self._fixDefaultJSONDate(self.option().fields, data.Record);
            }
            
            if (data.hasOwnProperty('Records')) {
                for (var i = 0; i < data.Records.length; i++) {
                    data.Records[i] = self._fixDefaultJSONDate(self.option().fields, data.Records[i]);
                }
            }

            return data;
        },
        
        _fixDefaultJSONDate: function(fields, record) {
            
            for (var fieldKey in fields) {
                var field = fields[fieldKey];
                
                if (field.type == 'date') {
                    var value = record[fieldKey];
                    if (value == "2000-01-01T00:00:00")
                        record[fieldKey] = null;
                }
            }
            return record;
        }

    });

})(jQuery);