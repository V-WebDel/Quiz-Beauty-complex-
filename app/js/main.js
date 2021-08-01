/* jQuery */
$(function () {

	// Mask form
	$('input[name="Lead[phone]"]').mask('8 (999) 999 - 99 - 99');
	$('input.quiz-input').mask('99');


});

/* Javascript */
/* Функции для модальных окон и отмена прокрутки документа */
const cancelScroll = () => {
	const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
	const body = document.body;

	body.style.position = 'fixed';
	body.style.top = `-${scrollY}`;
};

const startScroll = () => {
	const body = document.body;
	const scrollY = body.style.top;

	body.style.position = '';
	body.style.top = '';

	window.scrollTo(0, parseInt(scrollY || '0') * -1);
};

window.addEventListener('scroll', () => {
	document.documentElement.style.setProperty(
		'--scroll-y',
		`${window.scrollY}px`
	);
});

/* Клик по фону - Закрытие модального окна */
const modalOverlay = document.querySelector('.modal__overlay');
const modalWraps = document.querySelectorAll('.modal__wrap');
const modalCloses = document.querySelectorAll('.modal__close');

modalOverlay.addEventListener('click', function (event) {
	if (event.target.matches('.modal__overlay')) {
		this.classList.add('hidden');

		modalWraps.forEach(function (wrap) {
			wrap.classList.add('hidden');
		});

		startScroll();
	}
});

/* Клик по крестику - Закрытие модального окна */
modalCloses.forEach(function (btn) {
	btn.addEventListener('click', function () {
		modalOverlay.classList.add('hidden');

		modalWraps.forEach(function (wrap) {
			wrap.classList.add('hidden');
		});

		startScroll();
	});
});

/* Нажатие кнопки Esc - Закрытие модального окна */
document.addEventListener(
	'keydown',
	(event) => {
		if (event.key === 'Escape') {
			modalOverlay.classList.add('hidden');
			modalWraps.forEach(function (wrap) {
				wrap.classList.add('hidden');
			});

			startScroll();
		}
	},
	false
);

/* Открытие модальных окон */
let callbackBtns = document.querySelectorAll('.callback-btn');
let modalWrapCallback = document.querySelector('.modal__wrap--callback');
let quizBtns = document.querySelectorAll('.quiz-btn');
let modalWrapQuiz = document.querySelector('.modal__wrap--quiz');

callbackBtns.forEach(function (btn) {
	btn.addEventListener('click', function (event) {
		event.preventDefault();

		modalOverlay.classList.remove('hidden');
		modalWrapCallback.classList.remove('hidden');
		modalWrapQuiz.classList.add('hidden');

		cancelScroll();
	});
});

quizBtns.forEach(function (btn) {
	btn.addEventListener('click', function (event) {
		event.preventDefault();

		modalOverlay.classList.remove('hidden');
		modalWrapQuiz.classList.remove('hidden');

		cancelScroll();
	});
});


/* Много шаговая форма */
const parentSteps = document.querySelector('.quiz__inner');


if (parentSteps) {
	const steps = parentSteps.querySelectorAll('.quiz__tab');
	let currentStep = 0;

	const pagination = document.querySelector('.pagination');
	const price = document.querySelector('.m-aside__price');
	const priceItems = price.querySelectorAll('span');
	const paginationLine = document.querySelector('.pagination__line-active');

	const navWrap = document.querySelector('.quiz__nav');
	const btnPrev = navWrap.querySelector('.quiz__btn--prev');
	const btnNext = navWrap.querySelector('.quiz__btn--next');
	const btnEnd = navWrap.querySelector('.quiz__btn--end');

	
	function creatPaginationPoints() {
		for (let i = 0; i < steps.length - 1; i++) {
			let point = document.createElement('span');
			point.className = 'pagination__point'

			if(i == 0) {
				point.className = 'pagination__point active'
			}

			pagination.append(point)
		}
	}

	creatPaginationPoints()

	btnPrev.addEventListener('click', function (event) {
		event.preventDefault();

		currentStep--;
		changeStep(currentStep);

		btnEnd.classList.add('hidden')
		btnNext.classList.remove('hidden')

		if (currentStep < 1) {
			btnPrev.classList.add('hidden');
		}
	});

	btnNext.addEventListener('click', function (event) {
		event.preventDefault();

		btnPrev.classList.remove('hidden');

		currentStep++;
		changeStep(currentStep);

		if (currentStep == steps.length - 1) {
			pagination.classList.add('hidden')
		}

		if (currentStep == steps.length - 2) {

			this.classList.add('hidden')
			btnEnd.classList.remove('hidden')
		}
	});

	btnEnd.addEventListener('click', function (event) {
		event.preventDefault();

		currentStep++;
		changeStep(currentStep);

		this.parentElement.classList.add('hidden');
		pagination.classList.add('hidden')

		changeHiddenField();

	});

	let ageInput = document.querySelector('.quiz-input')

	ageInput.addEventListener('focus', function (event) {

		let parentElement = this.parentElement;
		let radioBtns = parentElement.querySelectorAll('input[type="radio"]');

		radioBtns.forEach(function (btn) {
			btn.checked = false;
		});

	});

	function changeHiddenField() {
		let formQuiz = document.querySelector('.form-quiz')
		let hiddenInputs = formQuiz.querySelectorAll('[type="hidden"]')

		let fieldsChecked = parentSteps.querySelectorAll('input.radio__default:checked, input.checkbox__default:checked')

		fieldsChecked.forEach(function (field) {

			let nameInput = field.name;
			let valInput = field.previousElementSibling.textContent;

			hiddenInputs.forEach(function (item) {

				let dataName = item.dataset.name

				if (dataName == nameInput) {
					item.value = item.value + valInput + ' '
				}
			});
		});

		if (ageInput.value !== '') {
			let ageHidden = formQuiz.querySelector('input[data-name=age]')
			ageHidden.value = ageInput.value
		}
	}

	steps.forEach((item, index) => {
		if (index !== 0) {
			item.classList.add('hidden');
		}
	});

	priceItems.forEach(function (elem, index) {
		if (index !== 0) {
			elem.classList.add('hidden');
		}
	});

	function changeStep(i) {
		steps.forEach(function (step, index) {
			step.classList.add('hidden');

			if (index == i) {
				step.classList.remove('hidden');
			}
		});

		paginationLine.style.width = (100 / (steps.length - 2)) * i + "%";

		priceItems.forEach(function (elem, index) {
			elem.classList.add('hidden');

			if (index == i) {
				elem.classList.remove('hidden');
			}
		});

		const paginationItems = pagination.querySelectorAll('.pagination__point');

		paginationItems.forEach(function (item, index) {
			item.classList.remove('active');

			if (index <= i) {
				item.classList.add('active');
			}
		});
	}
}


// Swiper для страницы Online
let swiper_top = new Swiper('.swiper-top', {
	speed: 600,
	slidesPerView: 1,
	centeredSlides: false,
	spaceBetween: 10,
	touchRatio: 1,
	loop: true,
	effect: 'fade',

	fadeEffect: {
		crossFade: true,
	},

	autoplay: {
		delay: 5000,
	},

	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
});

swiper_top.on('transitionStart', function () {
	let topInfoWrap = document.querySelector('.top__info-wrap');
	let topInfoItems = topInfoWrap.querySelectorAll('.top__info-item');

	topInfoItems.forEach(function (item) {
		let dataInfo = item.dataset.number

		item.classList.add('hidden')

		if (swiper_top.realIndex == dataInfo) {
			item.classList.remove('hidden')
		}
	})
})