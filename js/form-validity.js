'use strict';
(function (form) {
  var MAX_CHARACTERS = 20;
  var MAX_TAGS = 5;
  var hashTag = document.querySelector('.text__hashtags');
  var commentField = document.querySelector('.text__description');

  var showTagError = function (hashTags, input) {
    for (var i = 0; i < hashTags.length; i++) {
      if (hashTags[i].length === 0) {
        input.style.border = '';
        return '';
      } else if (hashTags[i].indexOf('#') !== 0) {
        input.style.border = '2px solid red';
        return 'Начните ваш хэштег с символа "#"';
      } else if (hashTags[i].length === 1) {
        input.style.border = '2px solid red';
        return 'Ваш хэштег не может состоять только из одной решетки';
      } else if (hashTags[i].length > MAX_CHARACTERS) {
        input.style.border = '2px solid red';
        return 'Ваш хэштег превышает максимальную длинну на ' + (hashTags[i].length - MAX_CHARACTERS) + ' символов';
      } else if (hashTags.length > MAX_TAGS) {
        input.style.border = '2px solid red';
        return 'Нельзя указывать больше пяти хэштегов';
      } else if (hashTags[i].indexOf('#', 1) > 0) {
        input.style.border = '2px solid red';
        return 'Хэштеги должны разделяться пробелом';
      } else if (hashTags.indexOf(hashTags[i], i + 1) > 0) {
        input.style.border = '2px solid red';
        return 'Хэштеги не должны повторяться';
      }
    }
    input.style.border = '';
    return '';
  };

  var setTagValidity = function () {
    var tagsArray = hashTag.value.toLowerCase().split(/[\s]+/);
    hashTag.setCustomValidity(showTagError(tagsArray, hashTag));
  };

  hashTag.addEventListener('input', function () {
    setTagValidity();
  });

  hashTag.addEventListener('focus', function () {
    document.removeEventListener('keydown', form.onUploadEscPress);
  });

  hashTag.addEventListener('blur', function () {
    document.addEventListener('keydown', form.onUploadEscPress);
  });

  commentField.addEventListener('focus', function () {
    document.removeEventListener('keydown', form.onUploadEscPress);
  });

  commentField.addEventListener('blur', function () {
    document.addEventListener('keydown', form.onUploadEscPress);
  });
})(window.form);
