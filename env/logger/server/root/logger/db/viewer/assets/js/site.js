String.prototype.truncate =
     function (n, useWordBoundary) {
         if (this.length <= n) { return this; }
         var subString = this.substr(0, n - 1);
         return (useWordBoundary
            ? subString.substr(0, subString.lastIndexOf(' '))
            : subString) + "…";
     };

function getFormParamsAsObject(form) {//serialize data function
    var paramObj = {};
    $.each($(form).serializeArray(), function(_, kv) {
      if (paramObj.hasOwnProperty(kv.name)) {
        paramObj[kv.name] = $.makeArray(paramObj[kv.name]);
        paramObj[kv.name].push(kv.value);
      }
      else {
        paramObj[kv.name] = kv.value;
      }
    });
    
    return paramObj;
}

(function () {
    var time_formats = [
        [60, 'seconds', 1], // 60
        [120, '1 minute', '1 minute from now'], // 60*2
        [3600, 'minutes', 60], // 60*60, 60
        [7200, '1 hour', '1 hour from now'], // 60*60*2
        [86400, 'hours', 3600], // 60*60*24, 60*60
        [172800, 'yesterday', 'tomorrow'], // 60*60*24*2
        [604800, 'days', 86400], // 60*60*24*7, 60*60*24
        [1209600, 'last week', 'next week'], // 60*60*24*7*4*2
        [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, 'last month', 'next month'], // 60*60*24*7*4*2
        [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, 'last year', 'Next year'], // 60*60*24*7*4*12*2
        [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'last century', 'next century'], // 60*60*24*7*4*12*100*2
        [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];

    window.timeAgo = function(time) {
        switch (typeof time) {
            case 'number':
                break;
            case 'string':
                time = +new Date(time);
                break;
            case 'object':
                if (time.constructor === Date) time = time.getTime();
                break;
            default:
                time = +new Date();
        }

        var seconds = (+new Date() - time) / 1000,
          token = '',//' ago',
          list_choice = 1;

        if (seconds >= 0 && seconds < 1) {
            return 'just now'
        }

        if (seconds < 0) {
            seconds = Math.abs(seconds);
            token = '',//' from now';
            list_choice = 2;
        }

        var i = 0, format;

        while (format = time_formats[i++]) {
            if (seconds < format[0]) {
                if (typeof format[2] == 'string')
                    return format[list_choice];
                else
                    return Math.floor(seconds / format[2]) + ' ' + format[1] + token;
            }
        }

        return time;
    }

    window.getJtableDisplayTime = function (date) {
        if (!date) {
            return null;
        }
        var dateStr = date.replace(/(\.\d+)(Z|$)|[TZ]/ig, ' ').trim() + ' UTC';
        var date, timeStr;
        if (dateStr.indexOf("0001") == 0) {
            timeStr = "-";
        }
        else {
            date = new Date(dateStr);
            timeStr = timeAgo(date);
        }
        return '<span title="' + dateStr + '">' + timeStr + '</span>';
    }

})();

(function () {
    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    String.prototype.escapeHtml = function() {
        return this.replace(/[&<>"'`=\/]/g, function (s) {
            return entityMap[s];
        });
    }
})();

$(function () {
    $('iframe[data-src]:visible').livequery(function () {
        var iframe = $(this);
        var src = iframe.attr("data-src");
        iframe.removeAttr("data-src");
        iframe.attr("src", src);
    });
});

$(function () {
    window.showMessageDialog = function(title, message) {
        if (!title) {
            title = 'Alert';
        }

        if (!message) {
            output_msg = 'No Message to Display.';
        }

        $('<div style="overflow: auto; white-space: pre-wrap;"></div>').html(message.escapeHtml().replace(/\r+/ig, '')).dialog({
            title: title,
            height: 300,
            width: 450,
            resizable: true,
            modal: true,
            buttons: {
                "Ok": function () {
                    $(this).dialog("close");
                }
            }
        });
    }

    window.showErrorDialog = function (errorMessage) {
        window.showMessageDialog('Error', errorMessage);
    }
});

window.flipObjectProperties = function (obj) {
    var newObj = {};
    var keys = [];
    var key;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }

    for (var i = keys.length - 1; i >= 0; i--) {
        key = keys[i];
        newObj[key] = obj[key];
    }

    return newObj;
}

$.extend(true, $.hik.jtable.prototype, {
    deselectRows: function($rows) {
        this._deselectRows($rows);
        this._onSelectionChanged();
    }
});

/* test 3 */