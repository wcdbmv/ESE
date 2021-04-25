const parseFloatFromSelect = selectId => parseFloat(document.getElementById(selectId).value);
const parseFloatFromInput = parseFloatFromSelect;

const arraySum = (accumulator, currentValue) => accumulator + currentValue;
const arrayMult = (accumulator, currentValue) => accumulator * currentValue;

let nLanguages = 1;
let nFps = 0;

const ilfComplicity = (det, ret) => {
	const table = [[7, 7, 10], [7, 10, 15], [10, 15, 15]];
	const det_i = det < 20 ? 0 : (det > 50 ? 2 : 1);
	const ret_i = ret === 1 ? 0 : (ret > 5 ? 2 : 1);
	return table[ret_i][det_i];
};

const eifComplicity = (det, ret) => {
	const table = [[5, 5, 7], [5, 7, 10], [7, 10, 10]];
	const det_i = det < 20 ? 0 : (det > 50 ? 2 : 1);
	const ret_i = ret === 1 ? 0 : (ret > 5 ? 2 : 1);
	return table[ret_i][det_i];
};

const eiComplicity = (det, ftr) => {
	const table = [[3, 3, 4], [3, 4, 6], [4, 6, 6]];
	const det_i = det < 5 ? 0 : (det > 15 ? 2 : 1);
	const ftr_i = ftr <= 1 ? 0 : (ftr > 2 ? 2 : 1);
	return table[ftr_i][det_i];
};

const eoComplicity = (det, ftr) => {
	const table = [[4, 4, 5], [4, 5, 7], [5, 7, 7]];
	const det_i = det < 5 ? 0 : (det > 19 ? 2 : 1);
	const ftr_i = ftr <= 1 ? 0 : (ftr > 3 ? 2 : 1);
	return table[ftr_i][det_i];
};

const eqComplicity = (det, ftr) => {
	const table = [[3, 3, 4], [3, 4, 6], [4, 6, 6]];
	const det_i = det < 5 ? 0 : (det > 19 ? 2 : 1);
	const ftr_i = ftr <= 1 ? 0 : (ftr > 3 ? 2 : 1);
	return table[ftr_i][det_i];
};

class Model {
	constructor() {
		this.FiLabels = [
			'Data_exchange',                                // Передача данных
			'Distributed_processing',                       // Распределенная обработка данных
			'Performance',                                  // Производительность
			'Operating_Limitations_on_Hardware_Resources',  // Эксплуатационные ограничения
			'Transactional_Load',                           // Частота транзакций
			'Intensity_of_User_Interaction',                // Оперативный ввод данных
			'Ergonomics_Affecting_End_User_Efficiency',     // Эффективность работы конечных пользователей
			'Online_update',                                // Оперативное обновление
			'Processing_complexity',                        // Сложность обработки
			'Reuse',                                        // Повторная используемость
			'Ease_of_installation',                         // Легкость инсталляции
			'Ease_of_use_administration',                   // Легкость эксплуатации
			'Portability',                                  // Количество возможных установок на различных платформах
			'Flexibility',                                  // Простота изменений (гибкость)
		];
		this.FiValues = [];  // 0 — 5 are possible values

		this.CocomoLabels = [
			'RCPX',  // Надежность и уровень сложности разрабатываемой системы
			'RUSE',  // Повторное использование компонентов
			'PERS',  // Возможности персонала
			'PREX',  // Опыт персонала
			'PDIF',  // Сложность платформы разработки
			'FCIL',  // Средства поддержки
			'SCED',  // График работ
		];
		this.CocomoValues = [];

		this.pLabels = [
			'PREC',  // Новизна проекта
			'FLEX',  // Гибкость процесса разработки
			'RESL',  // Разрешение рисков в архитектуре системы
			'TEAM',  // Сплоченность команды
			'PMAT',  // Уровень зрелости процесса разработки
		];
		this.pValues = [];

		this.complicities = [
			eiComplicity,
			eoComplicity,
			eqComplicity,
			ilfComplicity,
			eifComplicity,
		];
	}

	insertFiValues() {
		this.FiLabels.forEach(label => this[label] = parseFloatFromSelect(label));
		this.FiValues = this.FiLabels.map(label => this[label]);
	}

	insertCocomoValues() {
		this.CocomoLabels.forEach(label => this[label] = parseFloatFromSelect(label));
		this.CocomoValues = this.CocomoLabels.map(label => this[label]);
	}

	insertPValues() {
		this.pLabels.forEach(label => this[label] = parseFloatFromSelect(label));
		this.pValues = this.pLabels.map(label => this[label]);
	}

	insertFps() {
		if (nFps === 0) {
			alert('Добавьте исходные данные для расчёта функциональных точек');
		}

		this.fps = [];
		for (let i = 0; i < nFps; ++i) {
			const id = `fp${i}`;
			const idx = parseFloatFromSelect(id);
			const det = parseFloatFromSelect(`${id}det`);
			const ret = parseFloatFromSelect(`${id}ret`);
			this.fps.push({idx, det, ret});
		}
	}

	insertLanguages() {
		this.languages = [];
		let sumProp = 0;
		for (let i = 0; i < nLanguages; ++i) {
			const id = `lang${i}`;
			const lan_fp =  parseFloatFromSelect(id);
			const prop = parseFloatFromSelect(`${id}prop`);
			this.languages.push({prop, fp: lan_fp});
			sumProp += prop;
		}

		if (sumProp !== 100) {
			alert('Языками программирования покрыто не 100 % кода');
		}
	}

	insertSalary() {
		this.salary = parseFloatFromInput('salary');
	}

	insertApplicationCompositionModel() {
		this.ops = parseFloatFromInput('ops');
		this.pRUSE = parseFloatFromInput('%RUSE');
		this.PROD = parseFloatFromSelect('PROD');

		this.insertPValues();
		this.insertSalary();
	}

	insertEarlyArchitectureModel() {
		this.insertCocomoValues();
		this.insertFps();
		this.insertFiValues();
		this.insertLanguages();
		this.insertPValues();
		this.insertSalary();
	}

	calculateKSLOC() {
		this.nFps = this.fps.reduce((acc, fp) => acc + this.complicities[fp.idx](fp.det, fp.ret), 0);
		this.sumFi = this.FiValues.reduce(arraySum);
		this.FP = this.nFps * (0.65 + 0.01 * this.sumFi);

		this.KSLOC = this.FP * this.languages.reduce((acc, lang) => acc + lang.fp * lang.prop / 100, 0);

		return this.KSLOC;
	}

	calculateP() {
		this.p = this.pValues.reduce(arraySum) / 100 + 1.01;
	}

	calculateTime() {
		this.time = 3.0 * Math.pow(this.work, 0.33 + 0.2 * (this.p - 1.01));
		this.workers = Math.round(this.work / this.time);
		this.budget = this.workers * this.salary * this.time;
	}

	calculateApplicationCompositionModel() {
		this.nop = this.ops * ((100 - this.pRUSE) / 100);
		this.work = this.nop / this.PROD;

		this.calculateP();
		this.calculateTime();
	}

	calculateEarlyArchitectureModel() {
		this.EArch = this.CocomoValues.reduce(arrayMult);
		this.calculateKSLOC();
		this.calculateP();
		this.work = 2.45 * this.EArch * Math.pow(this.KSLOC, this.p);

		this.calculateTime();
	}
}

const LANGUAGES = [
	['Ассемблер', 320],
	['C', 128],
	['Кобол', 106],
	['Фортран', 106],
	['Паскаль', 90],
	['C++', 53],
	['Java / C#', 53],
	['Ada 95', 49],
	['Visual Basic 6', 24],
	['Visual C++', 34],
	['Delphi Pascal', 29],
	['Perl', 21],
	['Prolog', 54],
];

const addInputGroup = (id, inputGroup) => {
	const div = document.getElementById(id);

	const input = document.createElement('div');
	input.classList.add('input-group', 'mb-2');
	input.innerHTML = inputGroup;

	div.appendChild(input);
};

const addLanguage = () => {
	const options = LANGUAGES.map(lang => `<option value="${lang[1]}">${lang[0]}</option>`).join('\n');
	const inputGroup = `
		<span class="input-group-text">Язык программирования</span>
		<select class="form-select" id="lang${nLanguages}">
			${options}
		</select>
		<input class="form-control" id="lang${nLanguages}prop" max="100" min="0" step="10" type="number" value="0">
		<span class="input-group-text">%</span>`;
	++nLanguages;

	addInputGroup('langs', inputGroup);
};

const addFp = () => {
	const inputGroup = `
		<label class="input-group-text" for="fp${nFps}">Характеристика</label>
		<select class="form-select" id="fp${nFps}">
			<option selected="selected" value="0">Внешние вводы</option>
			<option value="1">Внешние выводы</option>
			<option value="2">Внешние запросы</option>
			<option value="3">Внутренние логические файлы</option>
			<option value="4">Внешние интерфейсные файлы</option>
		</select>
		<label class="input-group-text" for="fp${nFps}det">DET</label>
		<input class="form-control" id="fp${nFps}det" max="100" min="0" step="1" type="number" value="0">
		<label class="input-group-text" for="fp${nFps}ret">FTR/RET</label>
		<input class="form-control" id="fp${nFps}ret" max="100" min="0" step="1" type="number" value="0">`;
	++nFps;

	addInputGroup('fps', inputGroup);
};

const clearLanguages = () => {
	nLanguages = 0;
	const langdiv = document.getElementById('langs');
	langdiv.innerHTML = '';
	addLanguage();
};

const clearFps = () => {
	nFps = 0;
	const fpdiv = document.getElementById('fps');
	fpdiv.innerHTML = '';
};

const tableCreate = data => {
	const div = document.createElement('div');

	const tableTitle = document.createElement('h5');
	tableTitle.innerHTML = data.title;

	const table = document.createElement('table');
	['table', 'table-hover'].forEach(className => table.classList.add(className));

	const tbody = document.createElement('tbody');
	for (let row of data.rows) {
		const tr = document.createElement('tr');

		const th = document.createElement('th');
		th.setAttribute('scope', 'row');
		th.appendChild(document.createTextNode(row[0]));

		const td = document.createElement('td');
		td.appendChild(document.createTextNode(row[1]));

		tr.appendChild(th);
		tr.appendChild(td);
		tbody.appendChild(tr);
	}
	table.appendChild(tbody);

	div.appendChild(tableTitle);
	div.appendChild(table);

	return div;
};

const calculateACM = () => {
	const model = new Model();

	model.insertApplicationCompositionModel();
	model.calculateApplicationCompositionModel();

	const table = tableCreate({
		title: 'Модель ранней разработки архитектуры',
		rows: [
			['NOP', model.nop],
			['Трудозатраты, чел.-мес.', model.work.toFixed(2)],
			['Время, мес.', model.time.toFixed(2)],
			['Количество работников', model.workers],
			['Бюджет', model.budget.toFixed(2)],
		],
	});

	const result = document.querySelector('.row:last-child .card-body');
	result.appendChild(table);
};

const calculateEAM = () => {
	const model = new Model();

	model.insertEarlyArchitectureModel();
	model.calculateEarlyArchitectureModel();

	const table = tableCreate({
		title: 'Модель композиции приложения',
		rows: [
			['Количество функциональных точек', model.FP.toFixed(2)],
			['Размер кода, KLOC', model.KSLOC.toFixed(2)],
			['Показатель степени', model.p.toFixed(2)],
			['Трудозатраты, чел.-мес.', model.work.toFixed(2)],
			['Время, мес.', model.time.toFixed(2)],
			['Количество работников', model.workers],
			['Бюджет', model.budget.toFixed(2)],
		],
	});

	const result = document.querySelector('.row:last-child .card-body');
	result.appendChild(table);
};

const clearAll = () => {
	const result = document.querySelector('.row:last-child .card-body');
	result.innerHTML = '<h3 class="card-title">Результаты вычислений</h3>';

	clearLanguages();
	clearFps();
};

