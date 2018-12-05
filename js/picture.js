'use strict';
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var STEP_VALUE = 25;
var similarListElement = document.querySelector('.pictures');
var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var bigPicture = document.querySelector('.big-picture');
var socialCommentsElement = bigPicture.querySelector('.social__comments');
var socialCommentsTemplate = document.getElementById('social-comment').content.querySelector('.social__comment');
var fragment = document.createDocumentFragment();
var uploadButton = document.getElementById('upload-file');
var uploadPopup = document.querySelector('.img-upload__overlay');
var closeButtonUpload = document.getElementById('upload-cancel');
var closeButtonPhoto = bigPicture.querySelector('.big-picture__cancel');
var scaleValue = uploadPopup.querySelector('.scale__control--value');
var scaleSmaller = uploadPopup.querySelector('.scale__control--smaller');
var scaleBigger = uploadPopup.querySelector('.scale__control--bigger');
var imagePreview = uploadPopup.querySelector('.img-upload__preview-photo');
var effectsList = uploadPopup.querySelector('.img-upload__effects');
var effectLevel = uploadPopup.querySelector('.img-upload__effect-level');
var effectPin = uploadPopup.querySelector('.effect-level__pin');
var effectValue = uploadPopup.querySelector('.effect-level__value');
var comments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var descriptions = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];
var names = ['Артем', 'Петр', 'Василий', 'Иван', 'Генадий', 'Виктория', 'Елена', 'Мария'];

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getImagesUrls = function (n) {
  var anyUrls = [];
  var randomUrl = 'photos/' + getRandomNumber(1, n) + '.jpg';
  while (anyUrls.length < n) {
    randomUrl = 'photos/' + getRandomNumber(1, n) + '.jpg';
    if (anyUrls.indexOf(randomUrl) === -1) {
      anyUrls.push(randomUrl);
    }
  }
  return anyUrls;
};

var imagesUrls = getImagesUrls(25);

var getRandomFromArray = function (arr) {
  return arr[getRandomNumber(0, arr.length)];
};

var getRandomMessage = function (n) {
  if (n === 1) {
    return getRandomFromArray(comments);
  }
  return getRandomFromArray(comments) + ' ' + getRandomFromArray(comments);
};

var getRandomComments = function (n) {
  var randomComments = [];
  for (var i = 0; i < n; i++) {
    randomComments.push({
      avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
      message: getRandomMessage(getRandomNumber(1, 2)),
      name: getRandomFromArray(names)
    });
  }
  return randomComments;
};

var getRandomPictures = function (n) {
  var randomData = [];
  for (var i = 0; i < n; i++) {
    randomData.push({
      url: imagesUrls[i],
      likes: getRandomNumber(15, 200),
      comments: getRandomComments(5),
      description: getRandomFromArray(descriptions)
    });
  }
  return randomData;
};

var renderPicture = function (picture) {
  var pictureElement = similarPictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__img').dataset.picture = i;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = getRandomNumber(3, 15);

  return pictureElement;
};

var pictures = getRandomPictures(25);

for (var i = 0; i < pictures.length; i++) {
  fragment.appendChild(renderPicture(pictures[i]));
}

similarListElement.appendChild(fragment);

var renderComments = function (comment) {
  var commentEllement = socialCommentsTemplate.cloneNode(true);

  commentEllement.querySelector('.social__picture').src = comment.avatar;
  commentEllement.querySelector('.social__text').textContent = comment.message;

  return commentEllement;
};

for (i = 0; i < getRandomNumber(0, 5); i++) {
  fragment.appendChild(renderComments(pictures[i].comments[i]));
}

socialCommentsElement.appendChild(fragment);

bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');

var onUploadEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeEffect();
  }
};

var onPhotoEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePhoto();
  }
};

var openEffect = function () {
  uploadPopup.classList.remove('hidden');
  document.addEventListener('keydown', onUploadEscPress);
};

var closeEffect = function () {
  uploadPopup.classList.add('hidden');
  document.removeEventListener('keydown', onUploadEscPress);
  uploadButton.value = '';
};

var showPhoto = function (picture) {
  bigPicture.classList.remove('hidden');

  bigPicture.querySelector('.big-picture__img').firstElementChild.src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  bigPicture.querySelector('.social__caption').textContent = picture.description;

  document.addEventListener('keydown', onPhotoEscPress);
};

var closePhoto = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onPhotoEscPress);
};

uploadButton.addEventListener('change', function () {
  openEffect();
});

closeButtonUpload.addEventListener('click', function () {
  closeEffect();
});

similarListElement.addEventListener('click', function (evt) {
  if (evt.target.className === 'picture__img') {
    showPhoto(pictures[event.target.dataset.picture]);
  }
});

closeButtonPhoto.addEventListener('click', function () {
  closePhoto();
});

var getEffect = function () {
  effectLevel.classList.remove('hidden');

  imagePreview.className = '';
  imagePreview.classList.add('effects__preview--' + event.target.value);

  if (event.target.value === 'none') {
    imagePreview.style.filter = null;
    effectLevel.classList.add('hidden');
  } else if (event.target.value === 'chrome') {
    imagePreview.style.filter = 'grayscale(1)';
  } else if (event.target.value === 'sepia') {
    imagePreview.style.filter = 'sepia(1)';
  } else if (event.target.value === 'marvin') {
    imagePreview.style.filter = 'invert(100%)';
  } else if (event.target.value === 'phobos') {
    imagePreview.style.filter = 'blur(5px)';
  } else if (event.target.value === 'heat') {
    imagePreview.style.filter = 'brightness(3)';
  }
};

var applyFilter = function () {
  var filterName = imagePreview.className;
  if (filterName.indexOf('chrome') !== -1) {
    imagePreview.style.filter = 'grayscale(0.' + (0.1 * effectValue.value) + ')';
  } else if (filterName.indexOf('sepia') !== -1) {
    imagePreview.style.filter = 'sepia(0.' + (0.1 * effectValue.value) + ')';
  } else if (filterName.indexOf('marvin') !== -1) {
    imagePreview.style.filter = 'invert(' + effectValue.value + '%)';
  } else if (filterName.indexOf('phobos') !== -1) {
    imagePreview.style.filter = 'blur(' + (0.05 * effectValue.value) + 'px)';
  } else if (filterName.indexOf('heat') !== -1) {
    imagePreview.style.filter = 'brightness(' + (0.03 * effectValue.value) + ')';
  }
};

scaleBigger.addEventListener('click', function () {
  if (scaleValue.value !== '100%') {
    var currentValue = parseInt(scaleValue.value, 10);
    scaleValue.value = currentValue + STEP_VALUE + '%';
    imagePreview.style = 'transform: scale(' + parseInt(scaleValue.value, 10) / 100 + ')';
  }
});

scaleSmaller.addEventListener('click', function () {
  if (scaleValue.value !== '25%') {
    var currentValue = parseInt(scaleValue.value, 10);
    scaleValue.value = currentValue - STEP_VALUE + '%';
    imagePreview.style = 'transform: scale(' + parseInt(scaleValue.value, 10) / 100 + ')';
  }
});

effectsList.addEventListener('change', function () {
  getEffect();
});

effectPin.addEventListener('mouseup', function () {
  applyFilter();
});

effectPin.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    applyFilter();
  }
});

