'use strict';

let myChart1, myChart2;
let nLabels = 0, nTables = 0;

const setUpCharts = () => {
	const createChart = elementId => {
		const context = document.getElementById(elementId).getContext('2d');
		return new Chart(context, {
			type: 'line',
			data: {
				labels: ['Очень низкий', 'Низкий', 'Номинальный', 'Высокий', 'Очень высокий'],
				datasets: [],
			},
			options: {
				responsive: false,
				scales: {
					y: {beginAtZero: true},
				},
			},
		});
	};

	myChart1 = createChart('myChartPM');
	myChart2 = createChart('myChartTM');
}

const clearCharts = () => {
	myChart1.destroy();
	myChart2.destroy();
}

const randomRgba = () => {
	const maxIntensity = 200;
	const randomInt = () => Math.round(Math.random() * maxIntensity);
	return `rgba(${randomInt()}, ${randomInt()}, ${randomInt()}, 1)`;
}

class Model {
	constructor() {
		this.parameters = ['RELY', 'DATA', 'CPLX', 'TIME', 'STOR', 'VIRT', 'TURN', 'MODP', 'TOOL', 'SCED', 'ACAP', 'AEXP', 'PCAP', 'VEXP', 'LEXP'];
	}

	insertParams() {
		this.parameters.forEach(parameter => {
			this[parameter] = parseFloat(document.getElementById(parameter).value);
		});

		const map = {
			'Обычный':       {c1: 3.2, p1: 1.05, c2: 2.5, p2: 0.38},
			'Промежуточный': {c1: 3.0, p1: 1.12, c2: 2.5, p2: 0.35},
			'Встроенный':    {c1: 2.8, p1:  1.2, c2: 2.5, p2: 0.32},
		};

		const formula = document.getElementById('formula');
		this.formula = formula.options[formula.selectedIndex].text;
		this.c1 = map[this.formula].c1;
		this.p1 = map[this.formula].p1;
		this.c2 = map[this.formula].c2;
		this.p2 = map[this.formula].p2;

		this.SIZE = parseFloat(document.getElementById('SIZE').value);
		if (!this.SIZE) {
			this.SIZE = 100;
			document.getElementById('SIZE').value = this.SIZE;
		}
	}

	calculate() {
		this.EAF = this.parameters.map(parameter => this[parameter]).reduce((a, b) => a * b);

		this.PM = this.c1 * this.EAF * Math.pow(this.SIZE, this.p1);
		this.TM = this.c2 * Math.pow(this.PM, this.p2);
	}

	drawChart() {
		this.pmarray = [];
		this.tmarray = [];
		this.changes = document.getElementById('change').value;
		if (this.changes === 'nothing') {
			this.drawTable();
			document.getElementById('chart_labels').innerHTML += this.formLabel();
			return;
		}

		const map = {
			RELY: [0.75, 0.86, 1.0, 1.15,  1.4],
			DATA: [ NaN, 0.94, 1.0, 1.08, 1.16],
			CPLX: [ 0.7, 0.85, 1.0, 1.15,  1.3],

			TIME: [NaN,  NaN,  1.0, 1.11, 1.50],
			STOR: [NaN,  NaN,  1.0, 1.06, 1.21],
			VIRT: [NaN, 0.87,  1.0, 1.15, 1.30],
			TURN: [NaN, 0.87,  1.0, 1.15, 1.30],

			MODP: [1.24,  1.1, 1.0, 0.91, 0.82],
			TOOL: [1.24,  1.1, 1.0, 0.91, 0.82],
			SCED: [1.23, 1.08, 1.0, 1.04,  1.1],

			ACAP: [1.46, 1.19, 1.0, 0.86, 0.71],
			AEXP: [1.29, 1.15, 1.0, 0.91, 0.82],
			PCAP: [1.42, 1.17, 1.0, 0.86,  0.7],
			VEXP: [1.21,  1.1, 1.0,  0.9,  NaN],
			LEXP: [1.14, 1.07, 1.0, 0.95,  NaN],
		};

		const possibleValues = map[this.changes];
		possibleValues.forEach(possibleValue => {
			this[this.changes] = possibleValue;
			this.calculate();
			this.pmarray.push(this.PM);
			this.tmarray.push(this.TM);
		});

		const color = randomRgba();
		++nLabels;
		const createDataset = datum => {
			return {
				label: nLabels,
				data: datum,
				backgroundColor: [color],
				borderColor: [color],
				borderWidth: 2,
			};
		}
		const dataset1 = createDataset(this.pmarray);
		const dataset2 = createDataset(this.tmarray);
		addData(myChart1, dataset1);
		addData(myChart2, dataset2);
		document.getElementById('chart_labels').innerHTML += this.formLabel();
	}

	formLabel() {
		let str = '';
		if (this.changes === 'nothing') {
			str += `Таблицы ${nTables}.* — PM: ${this.PM.toFixed(2)}; TM: ${this.TM.toFixed(2)}`;
		} else {
			str += `Графики ${nLabels}.* — изменяя ${this.changes}`;
		}

		this.parameters.forEach(parameter => {
			if (this.changes !== parameter && this[parameter] !== 1) {
				str += `, ${parameter} = ${this[parameter]}`;
			}
		});

		str += `, ${this.SIZE} KLOC, ${this.formula} вариант<br>`;
		return str;
	}

	drawTable() {
		++nTables;

		let budget = 0;
		const prices = [100000, 192000, (140000 + 150000) / 2, (120000 + 100000) / 2, (120000 + 100000) / 2];
		const tableObj1 = {
			title: `Таблица ${nTables}.1 — Распределение работ и времени по стадиям жизненного цикла`,
			head: ['Вид деятельности', 'Трудозатраты (чм)', 'Время (м)', 'Кол-во сотрудников (Work/Time)'],
			data: [['Планирование и определение требований', 0.08 * this.PM, 0.36 * this.TM, Math.round(0.08 * this.PM / (0.36 * this.TM))],
				   ['Проектирование продукта', 0.18 * this.PM, 0.36 * this.TM, Math.round(0.18 * this.PM / (0.36 * this.TM))],
				   ['Детальное проектирование', 0.25 * this.PM, 0.18 * this.TM, Math.round(0.25 * this.PM / (0.18 * this.TM))],
				   ['Кодирование и тестирование отдельных модулей', 0.26 * this.PM, 0.18 * this.TM, Math.round(0.26 * this.PM / (0.18 * this.TM))],
				   ['Интеграция и тестирование', 0.31 * this.PM, 0.28 * this.TM, Math.round(0.31 * this.PM / (0.28 * this.TM))],
				   ['Итого', (0.08 + 0.18 + 0.25 + 0.26 + 0.31) * this.PM, (0.36 + 0.36 + 0.18 + 0.18 + 0.28) * this.TM, '']],
					// ['Итого', (0.08 + 0.18 + 0.25 + 0.26 + 0.31) * this.PM, (0.36 + 0.36 + 0.18 + 0.18 + 0.28) * this.TM, Math.round((0.08 + 0.18 + 0.25 + 0.26 + 0.31) * this.PM / ((0.36 + 0.36 + 0.18 + 0.18 + 0.28) * this.TM))]],
		}
		const table1 = tableCreate(tableObj1);

		for (let i = 0; i < 5; ++i) {
			budget += tableObj1.data[i][1] * prices[i];
		}
		const tableObj2 = {
			title: `Таблица ${nTables}.2 — Предположительный бюджет`,
			data: [['Анализ требований (4%)', Math.round(0.04 * budget)],
					['Проектирование продукта (12%)', Math.round(0.12 * budget)],
					['Программирование (44%)', Math.round(0.44 * budget)],
					['Тестирование (6%)', Math.round(0.06 * budget)],
					['Верификация и аттестация (14%)', Math.round(0.14 * budget)],
					['Канцелярия проекта (7%)', Math.round( 0.7 * budget)],
					['Управление конфигурацией и обеспечение качества (7%)', Math.round(0.07 * budget)],
					['Создание руководств (6%)', Math.round(0.06 * budget)],
					['Непредвиденные риски(+20%)', Math.round(0.20 * budget)],
					['Итого', Math.round(1.2 * budget)]],
		}
		const table2 = tableCreate(tableObj2);

		const div = document.getElementById('result');
		const row = document.createElement('div');
		row.classList.add('row');
		row.appendChild(table1);
		row.appendChild(table2);
		div.appendChild(row);
	}
}

const tableCreate = tableObj => {
	const div = document.createElement('div');
	div.classList.add(tableObj.hasOwnProperty('head') ? 'col-7' : 'col');

	const tableTitle = document.createElement('h4');
	tableTitle.innerHTML = tableObj.title;

	const table = document.createElement('table');
	['table', 'table-hover'].forEach(className => table.classList.add(className));

	if (tableObj.hasOwnProperty('head')) {
		const thead = document.createElement('thead');
		const tr = document.createElement('tr');
		for (let i = 0; i < tableObj.head.length; ++i) {
			const th = document.createElement('th');
			th.setAttribute('scope', 'col');
			th.appendChild(document.createTextNode(tableObj.head[i]));
			tr.appendChild(th);
		}
		thead.appendChild(tr);
		table.appendChild(thead);
	}

	const tbody = document.createElement('tbody');
	for (let i = 0; i < tableObj.data.length; ++i) {
		const tr = document.createElement('tr');
		for (let j = 0; j < tableObj.data[0].length; ++j) {
			const td = tr.insertCell();
			const text = typeof tableObj.data[i][j] === 'number' ? tableObj.data[i][j].toFixed(2) : tableObj.data[i][j];
			td.appendChild(document.createTextNode(text));
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	table.appendChild(tbody);

	div.appendChild(tableTitle);
	div.appendChild(table);

	return div;
}

const addData = (chart, dataset) => {
    chart.data.datasets.push(dataset);
    chart.update();
}

function calculate() {
	const model = new Model();
	model.insertParams();
	model.calculate();
	model.drawChart();
}

function clearAll() {
	nLabels = nTables = 0;
	clearCharts();
	setUpCharts();

	document.querySelectorAll('#result .row').forEach(element => element.parentNode.removeChild(element));
	document.getElementById('chart_labels').innerHTML = '';

	const clearSelect = (element, value) => {
		element.value = value;
		element.style.backgroundColor = 'rgb(255, 255, 255)';
	};

	document.querySelectorAll('.card select').forEach(element => clearSelect(element, '1'));
	clearSelect(document.getElementById('formula'), '1');
	clearSelect(document.getElementById('change'), 'nothing');
}

const changeColor = element => {
	const labels = ['Очень низкий', 'Низкий', 'Номинальный', 'Высокий', 'Очень высокий'];
	const colors = ['rgb(255, 87, 87)', 'rgb(255, 126, 87)', /* 'rgb(255, 216, 87)' */ 'rgb(255, 255, 255)', 'rgb(177, 255, 87)', 'rgb(87, 255, 95)']
	const selectedIndex = labels.indexOf(element.options[element.selectedIndex].text);
	const colorIndex = element.classList.contains('reversed-colors') ? colors.length - 1 - selectedIndex : selectedIndex;
	element.style.backgroundColor = colors[colorIndex];
}
