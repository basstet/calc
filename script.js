'use strict';

const isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

let money;
const start = function() {
  do {
    money = prompt(`Ваш месячный доход?`);
  }
  while (!isNumber(money));
};
start();

let appData = {
  // Переменные:
  income: {},
  addIncome: [],
  expenses: {},
  addExpenses: [],
  expensesMonth: 0,
  deposit: false,
  mission: 1000000,
  period: 0,
  budget: money,
  budgetMonth: 0,
  budgetDay: 0,
  // Функции (методы):
  asking: function() {
    let addExpenses = prompt(`Перечислите возможные расходы за рассчитываемый период через запятую`);
    appData.addExpenses = addExpenses.toLowerCase().split(', ');
    appData.deposit = confirm(`Есть ли у вас депозит в банке?`);

    for (let i = 0; i < 2; i++) {
      let expName = prompt(`Введите обязательную статью расходов`);
      let expAmount;
      do {
        expAmount = prompt(`Во сколько это обойдется?`);
      }
      while (!isNumber(expAmount));

      appData.expenses[expName] = +expAmount;
    }
    console.log(appData.expenses);
  },
  getExpensesMonth: function() {
    let sum = 0;
    for (let key in appData.expenses) {
      sum += +appData.expenses[key];
    }
    return sum;
  },
  getBudget: function(incAmt, outcAmt) {
    return incAmt - outcAmt;
  },
  getTargetMonth: function(missionAmt, budgM) {
    return Math.ceil(missionAmt / budgM);
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
  }
};
appData.asking();

// Вычисления и присвоения значений:
appData.expensesMonth = appData.getExpensesMonth();
appData.budgetMonth = appData.getBudget(money, appData.expensesMonth);
appData.budgetDay = Math.floor(appData.budgetMonth / 30);
appData.period = appData.getTargetMonth(appData.mission, appData.budgetMonth);

// Вывод результатов:
console.log(`Расходы за месяц: ${appData.expensesMonth}`);
console.log(
  appData.period >= 0 ?
  `Цель будет достигнута за ${appData.period} месяцев(-а)` : 
  `Цель не будет достигнута`
);
console.log(appData.getStatusIncome(appData.budgetDay));
console.log(`Наша программа включает в себя данные:`);
for (let key in appData) {
  console.log(`${key}: ${appData[key]}`);
}