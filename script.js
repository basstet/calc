'use strict';

// элементы DOM:
const btnStart = document.getElementById('start'),
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
      resultTargM = document.querySelector('.target_month-value');

// доп. доход (блок):
let incomeItems = document.querySelectorAll('.income-items');
// обяз. расходы (блок):
let expensesItems = document.querySelectorAll('.expenses-items');

const isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const appData = {
  // вводимые данные:
  budget: 0,
  income: {},
  addIncome: [],
  expenses: {},
  addExpenses: [],
  deposit: false,
  percentDeposit: 0,
  moneyDeposit: 0,
  // вычисляемые данные:
  budgetMonth: 0,
  budgetDay: 0,
  incomeMonth: 0,
  expensesMonth: 0,
  // функции (методы):
  start: function() {
    appData.budget = +inpSalaryAmt.value;
    appData.getIncome();
    appData.getIncomeMonth();
    appData.getAddIncome();
    appData.getExpenses();
    appData.getAddExpenses();
    appData.getExpensesMonth();
    appData.getBudget();
    appData.showResult();
  },
  showResult: function() {
    resultBudgetM.value = appData.budgetMonth;
    resultBudgetD.value = appData.budgetDay;
    resultExpM.value = appData.expensesMonth;
    resultAdExp.value = appData.addExpenses.join(', ');
    resultAdInc.value = appData.addIncome.join(', ');
    resultIncPrd.value = appData.calcSavedMoney();
    periodSelect.addEventListener('change', function() {
      resultIncPrd.value = appData.calcSavedMoney();
    });
    resultTargM.value = appData.getTargetMonth();
  },
  // дополнительный доход:
  getIncome: function() {
    incomeItems.forEach(function(item) {
      let itemIncome = item.querySelector('.income-title').value,
          cashIncome = item.querySelector('.income-amount').value;
      if (itemIncome !== '' && cashIncome !== '') {
        appData.income[itemIncome] = +cashIncome;
      }
    });
  },
  // сумма доп. доходов:
  getIncomeMonth: function() {
    let sum = 0;
    for (let key in appData.income) {
      sum += +appData.income[key];
    }
    appData.incomeMonth = sum;
  },
  // дополнительный доход (добавление полей):
  addIncomeBlock: function() {
    const cloneincomeItem = incomeItems[0].cloneNode(true);

    incomeItems[0].parentNode.insertBefore(cloneincomeItem, btnAddInc);
    incomeItems = document.querySelectorAll('.income-items');

    if (incomeItems.length === 3) {
      btnAddInc.style.display = 'none';
    }
  },
  // возможные доходы:
  getAddIncome: function() {
    inpAdIncome.forEach(function(item) {
      let itemValue = item.value.trim();
      if (itemValue !== '') {
        appData.addIncome.push(itemValue);
      }
    });
  },
  // обязательные расходы:
  getExpenses: function() {
    expensesItems.forEach(function(item) {
      let itemExpenses = item.querySelector('.expenses-title').value,
          cashExpenses = item.querySelector('.expenses-amount').value;
      if (itemExpenses !== '' && cashExpenses !== '') {
        appData.expenses[itemExpenses] = +cashExpenses;
      }
    });
  },
  // обязательные расходы (добавление полей):
  addExpensesBlock: function() {
    const cloneExpensesItem = expensesItems[0].cloneNode(true);

    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, btnAddExp);
    expensesItems = document.querySelectorAll('.expenses-items');

    if (expensesItems.length === 3) {
      btnAddExp.style.display = 'none';
    }
  },
  // возможные расходы:
  getAddExpenses: function() {
    let addExpenses = inpAdExpList.value.split(',');
    addExpenses.forEach(function(item) {
      item = item.trim();
      if (item !== '') {
        appData.addExpenses.push(item);
      }
    });
  },
  // сумма расходов:
  getExpensesMonth: function() {
    let sum = 0;
    for (let key in appData.expenses) {
      sum += +appData.expenses[key];
    }
    appData.expensesMonth = sum;
  },
  // меняет число под полоской периода расчета:
  changePeriodNum: function(event) {
    periodAmount.textContent = event.target.value;
  },
  // доход за месяц и дневной бюджет:
  getBudget: function() {
    appData.budgetMonth = appData.budget + appData.incomeMonth - appData.expensesMonth;
    appData.budgetDay = Math.floor(appData.budgetMonth / 30);
  },
  // накопления за период:
  calcSavedMoney: function() {
    return appData.budgetMonth * periodSelect.value;
  },
  // срок достижения цели в месяцах:
  getTargetMonth: function() {
    return Math.ceil(+inpTarAmt.value / appData.budgetMonth);
  },
  getStatusIncome: function(budgD) {
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
  },
  getInfoDeposit: function() {
    if (appData.deposit) {
      let percentDeposit,
          moneyDeposit;
      do {
        percentDeposit = prompt(`Какой годовой процент?`);
      }
      while (!isNumber(percentDeposit)); // валидация числа
      appData.percentDeposit = +percentDeposit;

      do {
        moneyDeposit = prompt(`Какая сумма внесена?`);
      }
      while (!isNumber(moneyDeposit)); // валидация числа
      appData.moneyDeposit = +moneyDeposit;
    }
  },
};

if (inpSalaryAmt.value === '') {
  btnStart.disabled = 'true';
} else {
  btnStart.removeAttribute('disabled');
  btnStart.addEventListener('click', appData.start);
}
inpSalaryAmt.addEventListener('change', function(event) {
  if (event.target.value !== '') {
    btnStart.removeAttribute('disabled');
    btnStart.addEventListener('click', appData.start);
  } else {
    btnStart.disabled = 'true';
  }
});
btnAddInc.addEventListener('click', appData.addIncomeBlock);
btnAddExp.addEventListener('click', appData.addExpensesBlock);
periodSelect.addEventListener('change', appData.changePeriodNum);