let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;

$.fn.extend({ 
    disableSelection: function() { 
        this.each(function() { 
            if (typeof this.onselectstart != 'undefined') {
                this.onselectstart = function() { return false; };
            } else if (typeof this.style.MozUserSelect != 'undefined') {
                this.style.MozUserSelect = 'none';
            } else {
                this.onmousedown = function() { return false; };
            }
        }); 
    } 
});
function get(fn, method, data) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: `${url}/api/${fn}`,
            method: method,
            data: data,
            dataType: 'json'
        }).done(function(result) {
            if (result.length > 0) {
                resolve(result);
            } else {
                resolve([]); // Resolve with an empty array if result length is 0
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('An error occurred, errorThrown:', errorThrown);
            console.error('An error occurred, status:', textStatus);
            console.error('An error occurred, jqXHR:', jqXHR);
            reject([]); // Reject with an empty array on failure
        });
    })
    .catch(function(error) {
        console.error('Error or empty result:', error);
        return []; // Return an empty array for errors
    });
}


// $.ajax({
//     url: `${url}/api/${fn}`,
//     method: method,
//     data: data,
//     dataType: 'json',
//     success: function(result) {
//         if (result.length > 0) {
//             if (successCallback) 
//                 successCallback(result);
//             return result;
//         } else {
//             console.error('No data returned.');
//         }
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//         console.error('An error occurred, errorThrown:', errorThrown);
//         console.error('An error occurred, status:', textStatus);
//         console.error('An error occurred, jqXHR:', jqXHR);
//         if (errorCallback) {
//             errorCallback(errorThrown);
//             return []
//         }
//     }
// });