const parseFloatFromSelect = selectId => parseFloat(document.getElementById(selectId).value);

const array_sum = (accumulator, currentValue) => accumulator + currentValue;
const array_mult = (accumulator, currentValue) => accumulator * currentValue;

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
		this.Fi_labels = [
			'Распределенная обработка данных',
			'Производительность',
			'Эксплуатационные ограничения',
			'Частота транзакций',
			'Оперативный ввод данных',
			'Эффективность работы конечных пользователей',
			'Оперативное обновление',
			'Сложность обработки',
			'Повторная используемость',
			'Легкость инсталляции',
			'Легкость эксплуатации',
			'Количество возможных установок на различных платформах',
			'Простота изменений (гибкость)',
		];

		this.Fi_labels_eng = [
			'Data_exchange',
			'Distributed_processing',
			'Performance',
			'Operating_Limitations_on_Hardware_Resources',
			'Transactional_Load',
			'Intensity_of_User_Interaction',
			'Ergonomics_Affecting_End_User_Efficiency',
			'Online_update',
			'Processing_complexity',
			'Reuse',
			'Ease_of_installation',
			'Ease_of_use_administration',
			'Portability',
			'Flexibility',
		];

		this.Fi_values = [];  // 0 — 5 are possible values

		this.Cocomo_labels = [
			'RCPX',
			'RUSE',
			'PERS',
			'PREX',
			'PDIF',
			'FCIL',
			'SCED',
		];

		this.Cocomo_label_meanings = [
			'Надежность и уровень сложности разрабатываемой системы',
			'Повторное использование компонентов',
			'Возможности персонала',
			'Опыт персонала',
			'Сложность платформы разработки',
			'Средства поддержки',
			'График работ',
		];

		// Очень низкий, Низкий, Номинальный, Высокий, Очень высокий, Сверхвысокий
		this.Cocomo_possible_values = [
			[ 0.6, 0.83, 1.0, 1.33, 1.91, 2.72],
			[ NaN, 0.95, 1.0, 1.07, 1.15, 1.24],
			[1.62, 1.26, 1.0, 0.83, 0.63,  0.5],
			[1.33, 1.22, 1.0, 0.87, 0.74, 0.62],
			[ NaN, 0.87, 1.0, 1.29, 1.81, 2.61],
			[ 1.3,  1.1, 1.0, 0.87, 0.73, 0.62],
			[1.43, 1.14, 1.0,  1.0,  1.0,  NaN],
		];
		this.Cocomo_values = [];

		this.p_factors_labels = [
			'PREC',
			'FLEX',
			'RESL',
			'TEAM',
			'PMAT',
		];
		this.p_factors_labels_meanings = [
			'Новизна проекта',
			'Гибкость процесса разработки',
			'Разрешение рисков в архитектуре системы',
			'Сплоченность команды',
			'Уровень зрелости процесса разработки',
		];
		this.p_factors_possible_values = [
			[['Полное отсутствие прецедентов, полностью непредсказуемый проект', 6.2],
			 ['Почти полное отсутствие прецедентов, взначительной мере непредсказуемый проект', 4.96],
			 ['Наличие некоторого количества прецедентов', 3.72],
			 ['Общее знакомство с проектом', 2.48],
			 ['Значительное знакомство с проектом', 1.24],
			 ['Полное знакомство с проектом', 0]],
			[['Точный, строгий процесс разработки', 5.07],
			 ['Случайные послабления в процессе', 4.05],
			 ['Некоторые послабления в процессе', 3.04],
			 ['Большей частью согласованный процесс', 2.03],
			 ['Некоторое согласование процесса', 1.01],
			 ['Заказчик определил только общие цели', 0]],
			[['Малое (20 %)', 7],
			 ['Некоторое (40 %)', 5.65],
			 ['Частое (60 %)', 4.24],
			 ['В целом (75 %)', 2.83],
			 ['Почти полное (90 %)', 1.41],
			 ['Полное (100%)', 0]],
			[['Сильно затрудненное взаимодействие', 5.48],
			 ['Несколько затрудненное взаимодействие', 4.38],
			 ['Некоторая согласованность', 3.29],
			 ['Повышенная согласованность', 2.19],
			 ['Высокая согласованность', 1.1],
			 ['Взаимодействие как в едином целом', 0]],
			[['Уровень 1 СММ', 7],
			 ['Уровень 1+ СММ', 6.24],
			 ['Уровень 2 СММ', 4.68],
			 ['Уровень 3 СММ', 1.12],
			 ['Уровень 7 СММ', 1.56],
			 ['Уровень 5 СММ', 0]],
		];
		this.p_factors_values = [];

		this.complicities = [
			eiComplicity,
			eoComplicity,
			eqComplicity,
			ilfComplicity,
			eifComplicity,
		];
	}

	insert_Fi_data() {
		this.Fi_labels_eng.forEach(label => this[label] = parseFloatFromSelect(label));

		this.Fi_values = this.Fi_labels_eng.map(label => this[label]);

		this.languages = [];
		let allprop = 0;
		for (let i = 0; i < nLanguages; ++i) {
			let id = `lang${i}`;
			let lan_fp =  parseFloatFromSelect(id);
			let prop = parseFloatFromSelect(`${id}prop`);
			allprop += prop;
			this.languages.push({
				prop: prop,
				fp: lan_fp,
			});
		}
		if (allprop !== 100) {
			alert('not 100 % of code covered with programming language');
		}

		this.fps = [];
		for (let i = 0; i < nFps; ++i) {
			let id = `fp${i}`;
			const idx = parseFloatFromSelect(id);
			const det = parseFloatFromSelect(`${id}det`);
			const ret = parseFloatFromSelect(`${id}ret`);
			this.fps.push({
				idx,
				det,
				ret,
			});
		}
	}

	insert_Cocomo_data() {
		this.Cocomo_labels.forEach(label => this[label] = parseFloatFromSelect(label));
		this.Cocomo_values = this.Cocomo_labels.map(label => this[label]);
		this.salary = parseFloatFromSelect('salary');
	}

	insert_p_data() {
		this.p_factors_labels.forEach(label => this[label] = parseFloatFromSelect(label));
		this.p_factors_values = this.p_factors_labels.map(label => this[label]);
	}

	calculate_KLOC() {
		this.nFps = this.fps.reduce((acc, fp) => acc + this.complicities[fp.idx](fp.det, fp.ret), 0);
		this.fp = this.nFps * (0.65 + 0.01 * this.Fi_values.reduce(array_sum));

		this.kloc = this.fp / 1000 * this.languages.reduce((acc, lang) => acc + lang.fp * lang.prop / 100, 0);

		return this.kloc;
	}

	calculate_Cocomo() {
		this.p = this.p_factors_values.reduce(array_sum) / 100 + 1.01;
		this.work = 2.45 * this.Cocomo_values.reduce(array_mult) * Math.pow(this.kloc, this.p);
		this.time = 3.0 * Math.pow(this.work, 0.33 + 0.2 * (this.p - 1.01));
		this.workers = Math.round(this.work / this.time);
		this.budget = this.workers * this.salary * this.time;
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
			<option selected="selected" value="1">Внешние вводы</option>
			<option value="2">Внешние выводы</option>
			<option value="3">Внешние запросы</option>
			<option value="4">Внутренние логические файлы</option>
			<option value="5">Внешние интерфейсные файлы</option>
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

const tableCreate = rows => {
	const table = document.createElement('table');
	['table', 'table-hover'].forEach(className => table.classList.add(className));

	const tbody = document.createElement('tbody');
	for (let row of rows) {
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

	return table;
};

const setData = () => {
	const model = new Model();
	model.insert_Fi_data();
	model.insert_Cocomo_data();
	model.insert_p_data();
	console.log('Fi_values', model.Fi_values);
	console.log('Cocomo values', model.Cocomo_values);
	console.log('values for p', model.p_factors_values);

	model.calculate_KLOC();
	model.calculate_Cocomo();

	const table = tableCreate([
		['Количество функциональных точек', model.fp],
		['Размер кода, KLOC', model.kloc],
		['Показатель степени', model.p],
		['Трудозатраты, чм', model.work],
		['Время, м', model.time],
		['Количество работников', model.workers],
		['Бюджет', model.budget],
	]);

	const result = document.querySelector('.row:last-child .card-body');
	result.appendChild(table);
};

const clearAll = () => {
	const result = document.querySelector('.row:last-child .card-body');
	result.innerHTML = '<h3 class="card-title">Результаты вычислений</h3>';

	clearLanguages();
	clearFps();
};

