export function invertColor(hex) {

    if (hex)
   {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        return '#000000';
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
  
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }

return '#000000';
}

export  function recordGameEvent(name, eventType, eventData) {

    let  userService = 'https://dtml.org/Activity/Record/';

    var data = {
        "envelop": null,
        "page": name,
        "time": null,
        "eventType": eventType,
        "eventData": eventData
    }
    fetch(userService, {
        method: 'post',
        credentials: 'same-origin',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        }
    }).catch (err => {
        console.log('err', err)
    });
}