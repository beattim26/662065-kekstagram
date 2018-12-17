'use strict';
(function () {
  var URL_SAVE = 'https://js.dump.academy/kekstagram/data';
  var URL_LOAD = 'https://js.dump.academy/kekstagra';
  var TIMEOUT = 10000;
  var StatusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  };

  var createRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case StatusCode.OK:
          onLoad(xhr.response);
          break;
        case StatusCode.BAD_REQUEST:
          error = 'Неверный запрос';
          break;
        case StatusCode.NOT_FOUND:
          error = 'Ничего не найдено';
          break;
        case StatusCode.SERVER_ERROR:
          error = 'Внутренняя ошибка сервера';
          break;
        default:
          error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        onError(error);
      }
    });
    return xhr;
  };

  var receiveData = function (onLoad, onError) {
    var xhr = createRequest(onLoad, onError);

    xhr.open('GET', URL_SAVE);
    xhr.send();
  };

  var uploadData = function (data, onLoad, onError) {
    var xhr = createRequest(onLoad, onError);

    xhr.open('POST', URL_LOAD);
    xhr.send(data);
  };

  window.backend = {
    receiveData: receiveData,
    uploadData: uploadData
  };
})();
