'use strict';

let myChart1, myChart2;
let label = 0;

const setUpCharts = () => {
	const ctx = document.getElementById('myChartPM').getContext('2d');
	myChart1 = new Chart(ctx, {
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

	const ctx2 = document.getElementById('myChartTM').getContext('2d');
	myChart2 = new Chart(ctx2, {
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
}

const randomRgba = () => {
	const o = Math.round, r = Math.random, s = 200;
	return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + '1)';
}

class Model {
	constructor() {}

	insertParams() {
		this.RELY = parseFloat(document.getElementById("RELY").value);
		this.DATA = parseFloat(document.getElementById("DATA").value);
		this.CPLX = parseFloat(document.getElementById("CPLX").value);

		this.TIME = parseFloat(document.getElementById("TIME").value);
		this.STOR = parseFloat(document.getElementById("STOR").value);
		this.VIRT = parseFloat(document.getElementById("VIRT").value);
		this.TURN = parseFloat(document.getElementById("TURN").value);

		this.MODP = parseFloat(document.getElementById("MODP").value);
		this.TOOL = parseFloat(document.getElementById("TOOL").value);
		this.SCED = parseFloat(document.getElementById("SCED").value);

		this.ACAP = parseFloat(document.getElementById("ACAP").value);
		this.AEXP = parseFloat(document.getElementById("AEXP").value);
		this.PCAP = parseFloat(document.getElementById("PCAP").value);
		this.VEXP = parseFloat(document.getElementById("VEXP").value);
		this.LEXP = parseFloat(document.getElementById("LEXP").value);

		const index = document.getElementById("formula").selectedIndex;
		this.formula = document.getElementById("formula").options[index].text;
		if (this.formula === "Промежуточный") {
			this.c1 = 3.0;
			this.p1 = 1.12;
			this.c2 = 2.5;
			this.p2 = 0.35;
		}  else if (this.formula === "Встроенный") {
			this.c1 = 2.8;
			this.p1 = 1.2;
			this.c2 = 2.5;
			this.p2 = 0.32;
		} else /* if (formula === "Обычный") */ {
			this.c1 = 3.2;
			this.p1 = 1.05;
			this.c2 = 2.5;
			this.p2 = 0.38;
		}

		this.SIZE = parseFloat(document.getElementById("SIZE").value);
		if (!this.SIZE) {
			this.SIZE = 100;
			document.getElementById("SIZE").value = this.SIZE;
		}
	}

	calculate() {
		this.EAF = this.RELY * this.DATA * this.CPLX * this.TIME * this.STOR * this.VIRT * this.TURN * this.MODP * this.TOOL * this.SCED * this.ACAP * this.AEXP * this.PCAP * this.VEXP * this.LEXP;

		this.PM = this.c1 * this.EAF * Math.pow(this.SIZE, this.p1);
		this.TM = this.c2 * Math.pow(this.PM, this.p2);
	}

	drawChart() {
		this.pmarray = []
		this.tmarray = []
		this.changes = document.getElementById("change").value
		if (this.changes === "nothing")
		{
			document.getElementById("chart_labels").innerHTML += this.formLabel()
			this.drawTable();
			return;
		}
		let possibleValues = [];
		if (this.changes === "RELY") possibleValues = [0.75, 0.86, 1.0, 1.15, 1.4];
		if (this.changes === "DATA") possibleValues = [0.94, 0.94, 1.0, 1.08, 1.16];
		if (this.changes === "CPLX") possibleValues = [0.7, 0.85, 1.0, 1.15, 1.3];

		if (this.changes === "TIME") possibleValues = [1.0, 1.0, 1.0, 1.11, 1.50];
		if (this.changes === "STOR") possibleValues = [1.0, 1.0, 1.0, 1.06, 1.21];
		if (this.changes === "VIRT") possibleValues = [0.86, 1.0, 1.15, 1.30];
		if (this.changes === "TURN") possibleValues = [0.86, 1.0, 1.15, 1.30];

		if (this.changes === "MODP") possibleValues = [1.24, 1.1, 1.0, 0.91, 0.82];
		if (this.changes === "TOOL") possibleValues = [1.24, 1.1, 1.0, 0.91, 0.82];
		if (this.changes === "SCED") possibleValues = [1.23, 1.08, 1.0, 1.04, 1.1];

		if (this.changes === "ACAP") possibleValues = [1.46, 1.19, 1.0, 0.86, 0.71];
		if (this.changes === "AEXP") possibleValues = [1.29, 1.15, 1.0, 0.91, 0.82];
		if (this.changes === "PCAP") possibleValues = [1.42, 1.17, 1.0, 0.86, 0.7];
		if (this.changes === "VEXP") possibleValues = [1.21, 1.1, 1.0, 0.9, 0.9];
		if (this.changes === "LEXP") possibleValues = [1.14, 1.07, 1.0, 0.95, 0.95];

		for (let i = 0; i < 5; i++) {
			if (this.changes === "RELY") this.RELY = possibleValues[i];
			if (this.changes === "DATA") this.DATA = possibleValues[i];
			if (this.changes === "CPLX") this.CPLX = possibleValues[i];

			if (this.changes === "TIME") this.TIME = possibleValues[i];
			if (this.changes === "STOR") this.STOR = possibleValues[i];
			if (this.changes === "VIRT") this.VIRT = possibleValues[i];
			if (this.changes === "TURN") this.TURN = possibleValues[i];

			if (this.changes === "MODP") this.MODP = possibleValues[i];
			if (this.changes === "TOOL") this.TOOL = possibleValues[i];
			if (this.changes === "SCED") this.SCED = possibleValues[i];

			if (this.changes === "ACAP") this.ACAP = possibleValues[i];
			if (this.changes === "AEXP") this.AEXP = possibleValues[i];
			if (this.changes === "PCAP") this.PCAP = possibleValues[i];
			if (this.changes === "VEXP") this.VEXP = possibleValues[i];
			if (this.changes === "LEXP") this.LEXP = possibleValues[i];
			this.calculate();
			this.pmarray.push(this.PM);
			this.tmarray.push(this.TM);
		}

		const color = randomRgba();
		++label;
		const dataset1 = {
			label: label,
			data: this.pmarray,
			backgroundColor: [color],
			borderColor: [color],
			borderWidth: 2,
		};
		const dataset2 = {
			label: label,
			data: this.tmarray,
			backgroundColor: [color],
			borderColor: [color],
			borderWidth: 2,
		};
		addData(myChart1, dataset1);
		addData(myChart2, dataset2);
		document.getElementById("chart_labels").innerHTML += this.formLabel();
	}

	formLabel() {
		let str = '';
		if (this.changes === "nothing") {
			str += "PM: " + this.PM + "; TM: " + this.TM;
		} else {
			str += label;
			str += ": changing " + this.changes;
		}

		if (this.changes !== "RELY" && this.RELY !== 1) str += ", RELY = " + this.RELY;
		if (this.changes !== "DATA" && this.DATA !== 1) str += ", DATA = " + this.DATA;
		if (this.changes !== "CPLX" && this.CPLX !== 1) str += ", CPLX = " + this.CPLX;

		if (this.changes !== "TIME" && this.TIME !== 1) str += ", TIME = " + this.TIME;
		if (this.changes !== "STOR" && this.STOR !== 1) str += ", STOR = " + this.STOR;
		if (this.changes !== "VIRT" && this.VIRT !== 1) str += ", VIRT = " + this.VIRT;
		if (this.changes !== "TURN" && this.TURN !== 1) str += ", TURN = " + this.TURN;

		if (this.changes !== "MODP" && this.MODP !== 1) str += ", MODP = " + this.MODP;
		if (this.changes !== "TOOL" && this.TOOL !== 1) str += ", TOOL = " + this.TOOL;
		if (this.changes !== "SCED" && this.SCED !== 1) str += ", SCED = " + this.SCED;

		if (this.changes !== "ACAP" && this.ACAP !== 1) str += ", ACAP = " + this.ACAP;
		if (this.changes !== "AEXP" && this.AEXP !== 1) str += ", AEXP = " + this.AEXP;
		if (this.changes !== "PCAP" && this.PCAP !== 1) str += ", PCAP = " + this.PCAP;
		if (this.changes !== "VEXP" && this.VEXP !== 1) str += ", VEXP = " + this.VEXP;
		if (this.changes !== "LEXP" && this.LEXP !== 1) str += ", LEXP = " + this.LEXP;

		str += ", " + this.SIZE + " KLOC, " + this.formula + " вариант</br>";
		return str;
	}

	drawTable() {
		let budget = 0;
		const prices = [100000, 192000, (140000 + 150000) / 2, (120000 + 100000) / 2, (120000 + 100000) / 2];
		const table1 = {
			title: "Распределение работ и времени по стадиям жизненного цикла",
			data: [["Вид деятельности", "Трудозатраты (чм)", "Время (м)", "Кол-во сотрудников (Work/Time)"],
					["Планирование и определение требований", 0.08 * this.PM, 0.36 * this.TM, Math.round(0.08 * this.PM / (0.36 * this.TM))],
					["Проектирование продукта", 0.18 * this.PM, 0.36 * this.TM, Math.round(0.18 * this.PM / (0.36 * this.TM))],
					["Детальное проектирование", 0.25 * this.PM, 0.18 * this.TM, Math.round(0.25 * this.PM / (0.18 * this.TM))],
					["Кодирование и тестирование отдельных модулей", 0.26 * this.PM, 0.18 * this.TM, Math.round(0.26 * this.PM / (0.18 * this.TM))],
					["Интеграция и тестирование", 0.31 * this.PM, 0.28 * this.TM, Math.round(0.31 * this.PM / (0.28 * this.TM))],
					["Итого", (0.08 + 0.18 + 0.25 + 0.26 + 0.31) * this.PM, (0.36 + 0.36 + 0.18 + 0.18 + 0.28) * this.TM, ""]],
					// ["Итого", (0.08 + 0.18 + 0.25 + 0.26 + 0.31) * this.PM, (0.36 + 0.36 + 0.18 + 0.18 + 0.28) * this.TM, Math.round((0.08 + 0.18 + 0.25 + 0.26 + 0.31) * this.PM / ((0.36 + 0.36 + 0.18 + 0.18 + 0.28) * this.TM))]],
		}
		tableCreate(table1);

		table1.data.forEach((dataRow, index) => {if (index > 0 && index < 6) {budget += (dataRow[1] * prices[index - 1])}});
		const table2 = {
			title: "Предположительный бюджет",
			data: [["Анализ требований (4%)", Math.round(0.04 * budget)],
					["Проектирование продукта (12%)", Math.round(0.12 * budget)],
					["Программирование (44%)", Math.round(0.44 * budget)],
					["Тестирование (6%)", Math.round(0.06 * budget)],
					["Верификация и аттестация (14%)", Math.round(0.14 * budget)],
					["Канцелярия проекта (7%)",Math.round( 0.7 * budget)],
					["Управление конфигурацией и обеспечение качества (7%)", Math.round(0.07 * budget)],
					["Создание руководств (6%)", Math.round(0.06 * budget)],
					["Непредвиденные риски(+20%)", Math.round(0.20 * budget)],
					["Итого", Math.round(1.2 * budget)]],
		}
		tableCreate(table2);
	}
}

const tableCreate = tableObj => {
	const {body} = document;
	const table = document.createElement('table');
	const tableTitle = document.createElement('h6');
	table.style.border = '1px solid black';

	tableTitle.innerHTML = tableObj.title;
	for (let i = 0; i < tableObj.data.length; i++) {
		const tr = table.insertRow();
		for (let j = 0; j < tableObj.data[0].length; j++) {
			const td = tr.insertCell();
			td.appendChild(document.createTextNode(tableObj.data[i][j]));
			td.style.border = '1px solid black';
		}
	}
	body.appendChild(tableTitle);
	body.appendChild(table);
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

const changeColor = element => {
	const labels = ['Очень низкий', 'Низкий', 'Номинальный', 'Высокий', 'Очень высокий'];
	const colors = ['rgb(255, 87, 87)', 'rgb(255, 126, 87)', /* 'rgb(255, 216, 87)' */ 'rgb(255, 255, 255)', 'rgb(177, 255, 87)', 'rgb(87, 255, 95)']
	const selectedIndex = labels.indexOf(element.options[element.selectedIndex].text);
	const colorIndex = element.classList.contains('reversed-colors') ? colors.length - 1 - selectedIndex : selectedIndex;
	element.style.backgroundColor = colors[colorIndex];
}
