'use strict';

// элементы DOM:
const btnStart = document.getElementById('start'),
      btnReset = document.getElementById('cancel'),
      btnAddInc = document.getElementsByTagName('button')[0],
      btnAddExp = document.getElementsByTagName('button')[1],
      // мес. доход:
      inpSalaryAmt = document.querySelector('.salary-amount'),
      // возм. доход:
      inpAdIncome = document.querySelectorAll('.additional_income-item'),
      // возм. расходы:
      inpAdExpList = document.querySelector('.additional_expenses-item'),
      // депозит:
      chkDeposit = document.querySelector('#deposit-check'),
      // цель:
      inpTarAmt = document.querySelector('.target-amount'),
      // период расчета:
      periodSelect = document.querySelector('.period-select'),
      periodAmount = document.querySelector('.period-amount'),
      // поля справа (результаты):
      resultBudgetM = document.querySelector('.budget_month-value'),
      resultBudgetD = document.querySelector('.budget_day-value'),
      resultExpM = document.querySelector('.expenses_month-value'),
      resultAdInc = document.querySelector('.additional_income-value'),
      resultAdExp = document.querySelector('.additional_expenses-value'),
      resultIncPrd = document.querySelector('.income_period-value'),
      resultTargM = document.querySelector('.target_month-value'),
      // все поля ввода слева:
      dataInputs = document.querySelectorAll('.data input[type=text]'),
      // все поля ввода справа (результаты):
      resultInputs = document.querySelectorAll('.result input[type=text]'),
      // все поля для ввода наименования:
      allNameInputs = document.querySelectorAll('input[placeholder="Наименование"]'),
      // все поля для ввода суммы:
      allSumInputs = document.querySelectorAll('input[placeholder="Сумма"]');

// доп. доход (блок):
let incomeItems = document.querySelectorAll('.income-items');
// обяз. расходы (блок):
let expensesItems = document.querySelectorAll('.expenses-items');

const isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const AppData = function() {
  // вводимые данные:
  this.budget = 0;
  this.income = {};
  this.addIncome = [];
  this.expenses = {};
  this.addExpenses = [];
  this.deposit = false;
  this.percentDeposit = 0;
  this.moneyDeposit = 0;
  // вычисляемые данные:
  this.budgetMonth = 0;
  this.budgetDay = 0;
  this.incomeMonth = 0;
  this.expensesMonth = 0;
};

AppData.prototype.start = function() {
  this.budget = +inpSalaryAmt.value;
  this.getIncome();
  this.getIncomeMonth();
  this.getAddIncome();
  this.getExpenses();
  this.getAddExpenses();
  this.getExpensesMonth();
  this.getBudget();
  this.showResult();
  dataInputs.forEach(function(item) {
    item.readOnly = true;
  });
  btnStart.disabled = 'true';
  btnStart.style.display = 'none';
  btnReset.style.display = 'inline-block';
};

AppData.prototype.showResult = function() {
  resultBudgetM.value = this.budgetMonth;
  resultBudgetD.value = this.budgetDay;
  resultExpM.value = this.expensesMonth;
  resultAdExp.value = this.addExpenses.join(', ');
  resultAdInc.value = this.addIncome.join(', ');
  resultIncPrd.value = this.calcSavedMoney();
  periodSelect.addEventListener('change', function() {
    resultIncPrd.value = this.calcSavedMoney();
  }.bind(this));
  resultTargM.value = this.getTargetMonth();
};

AppData.prototype.reset = function() {
  // обнуляем значения appData:
  this.budget = 0;
  this.income = {};
  this.addIncome = [];
  this.expenses = {};
  this.addExpenses = [];
  this.deposit = false;
  this.percentDeposit = 0;
  this.moneyDeposit = 0;
  this.budgetMonth = 0;
  this.budgetDay = 0;
  this.incomeMonth = 0;
  this.expensesMonth = 0;
  // чистим поля с результатами:
  resultInputs.forEach(function(item) {
    item.value = '';
  });
  // чистим поля ввода данных:
  dataInputs.forEach(function(item) {
    item.value = '';
    item.readOnly = false;
  });
  periodSelect.value = 1;
  periodAmount.textContent = periodSelect.value;
  // удаляем добавленные поля, если они были:
  if (incomeItems.length > 1) {
    if (incomeItems.length === 3) {
      incomeItems[1].remove();
      incomeItems[2].remove();
      btnAddInc.style.display = 'inline-block';
    } else {
      incomeItems[1].remove();
    }
  }
  if (expensesItems.length > 1) {
    if (expensesItems.length === 3) {
      expensesItems[1].remove();
      expensesItems[2].remove();
      btnAddExp.style.display = 'inline-block';
    } else {
      expensesItems[1].remove();
    }
  }
  // возвращаем кнопку рассчитать:
  btnReset.style.display = 'none';
  btnStart.style.display = 'inline-block';
};

// проверка вводимых в поля данных:
AppData.prototype.inputValidation = function() {
  if (this.placeholder === 'Наименование') {
    this.value = this.value.replace(/[\w]/g, '');
  } else if (this.placeholder === 'Сумма') {
    this.value = this.value.replace(/[^\d\.]/g, '');
  }
};

// дополнительный доход:
AppData.prototype.getIncome = function() {
  incomeItems.forEach(function(item) {
    let itemIncome = item.querySelector('.income-title').value,
        cashIncome = item.querySelector('.income-amount').value;
    if (itemIncome !== '' && cashIncome !== '') {
      this.income[itemIncome] = +cashIncome;
    }
  }, this);
};

// сумма доп. доходов:
AppData.prototype.getIncomeMonth = function() {
  let sum = 0;
  for (let key in this.income) {
    sum += +this.income[key];
  }
  this.incomeMonth = sum;
};

// дополнительный доход (добавление полей):
AppData.prototype.addIncomeBlock = function() {
  const cloneincomeItem = incomeItems[0].cloneNode(true);

  for (let item of cloneincomeItem.querySelectorAll('input')) {
    item.value = '';
  }

  incomeItems[0].parentNode.insertBefore(cloneincomeItem, btnAddInc);
  incomeItems = document.querySelectorAll('.income-items');

  if (incomeItems.length === 3) {
    btnAddInc.style.display = 'none';
  }
};

// возможные доходы:
AppData.prototype.getAddIncome = function() {
  inpAdIncome.forEach(function(item) {
    let itemValue = item.value.trim();
    if (itemValue !== '') {
      this.addIncome.push(itemValue);
    }
  }, this);
};

// обязательные расходы:
AppData.prototype.getExpenses = function() {
  expensesItems.forEach(function(item) {
    let itemExpenses = item.querySelector('.expenses-title').value,
        cashExpenses = item.querySelector('.expenses-amount').value;
    if (itemExpenses !== '' && cashExpenses !== '') {
      this.expenses[itemExpenses] = +cashExpenses;
    }
  }, this);
};

// обязательные расходы (добавление полей):
AppData.prototype.addExpensesBlock = function() {
  const cloneExpensesItem = expensesItems[0].cloneNode(true);

  for (let item of cloneExpensesItem.querySelectorAll('input')) {
    item.value = '';
  }

  expensesItems[0].parentNode.insertBefore(cloneExpensesItem, btnAddExp);
  expensesItems = document.querySelectorAll('.expenses-items');

  if (expensesItems.length === 3) {
    btnAddExp.style.display = 'none';
  }
};

// возможные расходы:
AppData.prototype.getAddExpenses = function() {
  let addExpenses = inpAdExpList.value.split(',');
  addExpenses.forEach(function(item) {
    item = item.trim();
    if (item !== '') {
      this.addExpenses.push(item);
    }
  }, this);
};

// сумма расходов:
AppData.prototype.getExpensesMonth = function() {
  let sum = 0;
  for (let key in this.expenses) {
    sum += +this.expenses[key];
  }
  this.expensesMonth = sum;
};

// меняет число под полоской периода расчета:
AppData.prototype.changePeriodNum = function(event) {
  periodAmount.textContent = event.target.value;
};

// доход за месяц и дневной бюджет:
AppData.prototype.getBudget = function() {
  this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
  this.budgetDay = Math.floor(this.budgetMonth / 30);
};

// накопления за период:
AppData.prototype.calcSavedMoney = function() {
  return this.budgetMonth * periodSelect.value;
};

// срок достижения цели в месяцах:
AppData.prototype.getTargetMonth = function() {
  return Math.ceil(+inpTarAmt.value / this.budgetMonth);
};

AppData.prototype.getStatusIncome = function(budgD) {
  switch (true) {
  case (budgD >= 1200):
    return (`У вас высокий уровень дохода`);
  case (1200 > budgD >= 600):
    return (`У вас средний уровень дохода`);
  case (600 > budgD >= 0):
    return (`К сожалению, ваш уровень дохода ниже среднего`);
  default:
    return (`Что-то пошло не так`);
  }
};

AppData.prototype.getInfoDeposit = function() {
  if (this.deposit) {
    let percentDeposit,
        moneyDeposit;
    do {
      percentDeposit = prompt(`Какой годовой процент?`);
    }
    while (!isNumber(percentDeposit)); // валидация числа
    this.percentDeposit = +percentDeposit;

    do {
      moneyDeposit = prompt(`Какая сумма внесена?`);
    }
    while (!isNumber(moneyDeposit)); // валидация числа
    this.moneyDeposit = +moneyDeposit;
  }
};

// обработчики событий:
AppData.prototype.eventsListeners = function() {
  // нажатие кнопки рассчитать:
  btnStart.disabled = 'true';
  inpSalaryAmt.addEventListener('input', function(event) {
    if (event.target.value.trim() !== '') {
      btnStart.removeAttribute('disabled');
    } else {
      btnStart.disabled = 'true';
    }
  });
  btnStart.addEventListener('click', this.start.bind(this));
  // нажатие кнопки сбросить:
  btnReset.addEventListener('click', this.reset.bind(this));
  // добавление полей при нажатии кнопки "+":
  btnAddInc.addEventListener('click', this.addIncomeBlock);
  btnAddExp.addEventListener('click', this.addExpensesBlock);
  // отслеживание ползунка периода расчета
  periodSelect.addEventListener('input', this.changePeriodNum);
  // проверка введенных в поля данных:
  for (let item of allNameInputs) {
    item.addEventListener('keyup', this.inputValidation);
  }
  for (let item of allSumInputs) {
    item.addEventListener('keyup', this.inputValidation);
  }
};

const appData = new AppData();

appData.eventsListeners();