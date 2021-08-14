__captchaError1={
	en:"Failed to connect to database.",
	ru:"Невозможно подключиться к базе данных."
};

/*__captchaDetectedDiv={
	en:"Captcha detected. <a id='__captchaShowButton' href=''>Show</a> <a id='__captchaCloseButton' style='position:absolute; top:0px; right:10px;' href=''><sup>x</sup></a><br><a id='__captchaRightButton' href=''>Right</a>|<a id='__captchaAnotherButton' href=''>Choose another/choose input field</a>|<a id='__captchaDontaskButton' href=''>Don't ask again</a>",
	ru:"Обнаружена капча. <a id='__captchaShowButton' href=''>Показать</a> <a id='__captchaCloseButton' style='position:absolute; top:0px; right:10px;' href=''><sup>x</sup></a><br><a id='__captchaRightButton' href=''>Верно</a>|<a id='__captchaAnotherButton' href=''>Выбрать другую/выбрать поле ввода</a>|<a id='__captchaDontaskButton' href=''>Не предлагать</a>"
};

__captchaSelectAnotherDiv={
	en:"Select another image with captcha. <br><a href='' id='__captchaSelectAnotherOKButton'>OK</a> | <a href='' id='__captchaSelectAnotherCancelButton'>Cancel</a>",
	ru:"Выберите другое изображение. <br><a href='' id='__captchaSelectAnotherOKButton'>OK</a> | <a href='' id='__captchaSelectAnotherCancelButton'>Отмена</a>"
};

__captchaSelectAutoDiv={
	en:"Select the captcha's options and the form's submit mode. <br><input type='checkbox' id='__captchaPhraseCheck'> Phrase (two words) | <input type='checkbox' id='__captchaSenseCheck'> Case sensitive | <input type='checkbox' id='__captchaNumericCheck'> Numeric <br> <input type='checkbox' id='__captchaCalcCheck'> Calculation | <input type='checkbox' id='__captchaRussianCheck'> Russian <br><a href='' id='__captchaAutoSubmitButton'>Auto</a> | <a href='' id='__captchaManualSubmitButton'>Manual</a>",
	ru:"Выберите свойства капчи и тип отправки формы. <br><input type='checkbox' id='__captchaPhraseCheck'> Фраза (два слова) | <input type='checkbox' id='__captchaSenseCheck'> Учитывать регистр | <input type='checkbox' id='__captchaNumericCheck'> Числовая <br> <input type='checkbox' id='__captchaCalcCheck'> Математическое выражение | <input type='checkbox' id='__captchaRussianCheck'> Русские буквы <br><a href='' id='__captchaAutoSubmitButton'>Авто</a> | <a href='' id='__captchaManualSubmitButton'>Ручной</a>"
};*/

__captchaLNG={
	en:{
		CAPTCHA_DETECTED:"Captcha detected. ",
		SHOW:"Show",
		RIGHT:"Right",
		CHOOSEANOTHER:"Choose another/choose input field",
		DONTASK:"Don't ask again",
		SELECTANOTHER:"Select another image with captcha/choose input field. ",
		OK:"OK",
		CANCEL:"Cancel",
		SELECTOPTIONS:"Select the captcha's options and the form's submit mode. ",
		PHRASE:" Phrase (two words) | ",
		CASE:" Case sensitive | ",
		NUMERIC:" Numeric ",
		CALC:" Calculation | ",
		RUSSIAN:" Russian ",
		AUTO:"Auto",
		MANUAL:"Manual"
	},
	ru:{
		CAPTCHA_DETECTED:"Обнаружена капча. ",
		SHOW:"Показать",
		RIGHT:"Верно",
		CHOOSEANOTHER:"Выбрать другую/выбрать поле ввода",
		DONTASK:"Не предлагать",
		SELECTANOTHER:"Выберите другое изображение/поле ввода. ",
		OK:"OK",
		CANCEL:"Отмена",
		SELECTOPTIONS:"Выберите свойства капчи и тип отправки формы. ",
		PHRASE:" Фраза (два слова) | ",
		CASE:" Учитывать регистр | ",
		NUMERIC:" Числовая ",
		CALC:" Математическое выражение | ",
		RUSSIAN:" Русские буквы ",
		AUTO:"Авто",
		MANUAL:"Ручной"
	}
};

__captchaStatus={
	en:[
		"Sending...",
		"Send"
	],
	ru:[
		"Отправляем...",
		"Отправлено"
	]
};

__captchaResponse={
	en:{
		ERROR_WRONG_USER_KEY:"Wrong user key",
		ERROR_KEY_DOES_NOT_EXIST:"Wrong captha key",
		ERROR_ZERO_BALANCE:"Your balance is zero",
		ERROR_NO_SLOT_AVAILABLE:"All workers are busy, next try in five second",
		ERROR_ZERO_CAPTCHA_FILESIZE:"Image too small",
		ERROR_TOO_BIG_CAPTCHA_FILESIZE:"Image too big",
		ERROR_WRONG_FILE_EXTENSION:"Wrong file extension",
		ERROR_IMAGE_TYPE_NOT_SUPPORTED:"Wrong image type",
		ERROR_IP_NOT_ALLOWED:"IP not allowed",
		ERROR_WRONG_ID_FORMAT:"Wrong ID format",
		ERROR_CAPTCHA_UNSOLVABLE:"Captcha unsolvable",
		CAPCHA_NOT_READY:"Captcha not ready. Please, wait."
	},
	ru:{
		ERROR_WRONG_USER_KEY:"Неверный формат ключа",
		ERROR_KEY_DOES_NOT_EXIST:"Неверный ключ капчи",
		ERROR_ZERO_BALANCE:"Нулевой баланс",
		ERROR_NO_SLOT_AVAILABLE:"Нет свободных работников, повторная попытка через 5 секунд",
		ERROR_ZERO_CAPTCHA_FILESIZE:"Картинка слишком маленькая",
		ERROR_TOO_BIG_CAPTCHA_FILESIZE:"Картинка слишком большая",
		ERROR_WRONG_FILE_EXTENSION:"Неверный тип файла",
		ERROR_IMAGE_TYPE_NOT_SUPPORTED:"Неверный формат файла",
		ERROR_IP_NOT_ALLOWED:"IP заблокирован",
		ERROR_WRONG_ID_FORMAT:"Неверный ID капчи",
		ERROR_CAPTCHA_UNSOLVABLE:"Капча не распознана",
		CAPCHA_NOT_READY:"Капча распознается, подождите"
	}
	
};

__captchaTable={
	en:{
		notquestion:'not question',
		work:'work',
		autosubmit:'auto submit',
		phrase:'phrase (2 words)',
		regsense:'case sensitive',
		numeric:'numeric',
		calc:'calculation',
		is_russian:'russian'
	},
	ru:{
		notquestion:'не спрашивать',
		work:'работает',
		autosubmit:'автоотправка формы',
		phrase:'фраза (2 слова)',
		regsense:'учитывать регистр',
		numeric:'число',
		calc:'математическое выражение',
		is_russian:'русские буквы'
	}
};

__captchaInstruction={
	en:{
		title:'Instruction:',
		sites:'List of the sites:',
		text:'The extension automatically detects a CAPTCHA, but does not always determine the correct captcha\'s input field. To do it, in the case of an incorrect definition of the image, simply click "Choose another/choose input field". To manually select the captcha, if the system is not able to identify yourself, click on "Manual selection" in the popup window extension, in this case future perfomance not guaranteed for the choise.'
	},
	ru:{
		title:'Инструкция:',
		sites:'Список сайтов:',
		text:'Расширение автоматически определяет капчу, но не всегда определяет правильно поле ввода капчи, для его указания, а так же, в случае неверного определения изображения, достаточно нажать "Выбрать другую/выбрать поле ввода". Для ручного выбора капчи, в случае, если система не смогла определить самостоятельно, нажмите "Ручной выбор" во всплывающем окне расширения, в этом случае будущая работоспособность для этого выбора не гарантируется.'
	}
	
};