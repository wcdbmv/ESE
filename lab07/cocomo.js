const parseFloatFromSelect = selectId => parseFloat(document.getElementById(selectId).value);

const array_sum = (accumulator, currentValue) => accumulator + currentValue;
const array_mult = (accumulator, currentValue) => accumulator * currentValue;

let number_of_languages = 1;

class Model {
	constructor() {
		this.Fi_labels = [
			'Обмен данными',
			'Распределенная обработка',
			'Производительность',
			'Эксплуатационные ограничения по аппаратным ресурсам',
			'Транзакционная нагрузка',
			'Интенсивность взаимодействия с пользователем (оперативный ввод данных)',
			'Эргономические характеристики, влияющие на эффективность работы конечных пользователей',
			'Оперативное обновление',
			'Сложность обработки',
			'Повторное использование',
			'Легкость инсталляции',
			'Легкость эксплуатации/администрирования',
			'Портируемость',
			'Гибкость',
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
	}

	insert_Fi_data() {
		this.Fi_labels_eng.forEach(label => this[label] = parseFloatFromSelect(label));

		this.Fi_values = this.Fi_labels_eng.map(label => this[label]);

		this.languages = [];
		let allprop = 0;
		for (let i = 0; i < number_of_languages; ++i) {
			let id = `lang${i}`;
			let lan_fp =  parseFloatFromSelect(id);
			let prop = parseFloatFromSelect(`${id}prop`);
			allprop += prop;
			console.log(id, prop, lan_fp);
			if (isNaN(lan_fp)) {
				alert('unknown programming language');
			}
			this.languages.push({
				prop: prop,
				fp: lan_fp,
			});
		}
		if (allprop !== 100) {
			alert('not 100 % of code covered with programming language');
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

	calculate_KLOC(allFP) {
		this.fp = allFP * (0.65 + 0.01 * this.Fi_values.reduce(array_sum));

		// 30 % кода будет написано на SQL (13 LOC на один оператор);
		// 10 % — на JavaScript (56 LOC);
		// 60 % — на Java (53 LOC).
		this.kloc = 0;
		for (let i = 0; i < this.languages.length; ++i) {
			this.kloc += this.languages[i].prop / 100 * this.languages[i].fp;
		}
		this.kloc *= this.fp / 1000;

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

const dict_lang = {
	'assembley': 320,
	'c': 128,
	'kobol': 196,
	'fortran': 106,
	'pascal': 90,
	'c++': 53,
	'java; c#': 53,
	'sql': 13,
	'js': 56,
	'ada 95': 49,
	'visual basic': 24,
	'visual c++': 34,
	'delphi': 29,
	'perl': 21,
	'prolog': 54,
};

const addLanguage = () => {
	const langdiv = document.getElementById('langs');
	const newlanguage = document.createElement('div');
	newlanguage.innerHTML = `<div inputdata>
	<label for="lang${number_of_languages}">яп: </label>
	<select name="lang${number_of_languages}" id="lang${number_of_languages}">
		<option value="320">assembley</option>
		<option value="128">c</option>
		<option value="196">kobol</option>
		<option value="106">fortran</option>
		<option value="90">pascal</option>
		<option value="53">c++</option>
		<option value="53">java; c#</option>
		<option value="13">sql</option>
		<option value="56">js</option>
		<option value="49">ada 95</option>
		<option value="24">visual basic</option>
		<option value="34">visual c++</option>
		<option value="29">delphi</option>
		<option value="21">perl</option>
		<option value="54">prolog</option>
	</select>
	<input id="lang${number_of_languages}prop" value="0">
	<label for="lang${number_of_languages}prop">%</label>
	</div>`;
	langdiv.appendChild(newlanguage);
	++number_of_languages;
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

	model.calculate_KLOC(79);
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
};

