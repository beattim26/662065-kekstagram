'use strict';
(function (util) {
  var uploadButton = document.getElementById('upload-file');
  var closeButtonUpload = document.getElementById('upload-cancel');
  var uploadPopup = document.querySelector('.img-upload__overlay');
  var form = document.getElementById('upload-select-image');
  var imagePreview = document.querySelector('.img-upload__preview-photo');
  var radioEffectNone = document.getElementById('effect-none');
  var effectLevel = document.querySelector('.img-upload__effect-level');

  var onUploadEscPress = function (evt) {
    if (evt.keyCode === util.ESC_KEYCODE) {
      closeUploadPopup();
    }
  };

  var openUploadPopup = function () {
    uploadPopup.classList.remove('hidden');
    document.addEventListener('keydown', onUploadEscPress);
    radioEffectNone.checked = true;
    effectLevel.classList.add('hidden');
  };

  var closeUploadPopup = function () {
    uploadPopup.classList.add('hidden');
    document.removeEventListener('keydown', onUploadEscPress);
    uploadButton.value = '';
    imagePreview.className = '';
    imagePreview.style = '';
  };

  uploadButton.addEventListener('change', function () {
    openUploadPopup();
  });

  closeButtonUpload.addEventListener('click', function () {
    closeUploadPopup();
  });

  var showSuccess = function () {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successElement = successTemplate.cloneNode(true);

    closeUploadPopup();
    document.body.appendChild(successElement);

    successElement.addEventListener('click', function () {
      document.body.removeChild(successElement);
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === util.ESC_KEYCODE) {
        document.body.removeChild(successElement);
      }

      document.removeEventListener('keydown', showSuccess);
    });
  };

  var showError = function (onError) {
    var similarErrorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorElement = similarErrorTemplate.cloneNode(true);

    errorElement.querySelector('.error__title').textContent = onError;

    document.body.appendChild(errorElement);
    uploadPopup.classList.add('hidden');

    var errorButtons = document.querySelectorAll('.error__button');
    var submitButton = errorButtons[0];
    var closeButton = errorButtons[1];

    submitButton.addEventListener('click', function () {
      uploadPopup.classList.remove('hidden');
      document.body.removeChild(document.querySelector('.error'));
    });

    closeButton.addEventListener('click', function () {
      document.body.removeChild(document.querySelector('.error'));
      closeUploadPopup();
    });
  };

  form.addEventListener('submit', function (evt) {
    window.backend.uploadData(new FormData(form), showSuccess, showError);
    evt.preventDefault();
  });

  window.form = {
    onUploadEscPress: onUploadEscPress,
    imagePreview: imagePreview,
    effectLevel: effectLevel
  };
})(window.util);
