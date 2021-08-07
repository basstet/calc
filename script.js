'use strict';

const isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

let money;
const start = function() {
  do {
    money = prompt(`Ваш месячный доход?`);
  }
  while (!isNumber(money)); // валидация числа
};
start();

const appData = {
  // Переменные:
  income: {},
  addIncome: [],
  expenses: {},
  addExpenses: [],
  expensesMonth: 0,
  deposit: false,
  percentDeposit: 0,
  moneyDeposit: 0,
  mission: 1000000,
  period: 3,
  budget: +money,
  budgetMonth: 0,
  budgetDay: 0,
  // Функции (методы):
  asking: function() {
    if (confirm(`Есть ли у вас дополнительный источник заработка?`)) {
      let itemIncome,
          cashIncome;
      do {
        itemIncome = prompt(`Какой у вас дополнительный заработок?`).trim();
      }
      while (isNumber(itemIncome)); // валидация текста
      do {
        cashIncome = prompt(`Сколько в месяц вы на этом зарабатываете?`);
      }
      while (!isNumber(cashIncome)); // валидация числа

      appData.income[itemIncome] = +cashIncome;
    }
    let addExpenses = prompt(`Перечислите возможные расходы за рассчитываемый период через запятую`);
    appData.addExpenses = addExpenses.toLowerCase().split(',');
    for (let item of appData.addExpenses) {
      let itemIndex = appData.addExpenses.indexOf(item),
          itemTrimed = item.trim();

      appData.addExpenses[itemIndex] = itemTrimed[0].toUpperCase() + itemTrimed.slice(1);
    }
    appData.deposit = confirm(`Есть ли у вас депозит в банке?`);
    appData.getInfoDeposit();

    for (let i = 0; i < 2; i++) {
      let expName,
          expAmount;
      do {
        expName = prompt(`Введите обязательную статью расходов`).trim();
      }
      while (isNumber(expName)); // валидация текста
      do {
        expAmount = prompt(`Во сколько это обойдется?`);
      }
      while (!isNumber(expAmount)); // валидация числа

      appData.expenses[expName] = +expAmount;
    }
  },
  getExpensesMonth: function() {
    let sum = 0;
    for (let key in appData.expenses) {
      sum += +appData.expenses[key];
    }
    appData.expensesMonth = sum;
  },
  getBudget: function() {
    appData.budgetMonth = money - appData.expensesMonth;
    appData.budgetDay = Math.floor(appData.budgetMonth / 30);
  },
  getTargetMonth: function() {
    return Math.ceil(appData.mission / appData.budgetMonth);
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
  calcSavedMoney: function() {
    return appData.budgetMonth * appData.period;
  }
};
appData.asking();
appData.getExpensesMonth();
appData.getBudget();
appData.getTargetMonth();

// Вывод результатов:
console.log(`Расходы за месяц: ${appData.expensesMonth}`);
console.log(
  appData.getTargetMonth() >= 0 ?
  `Цель будет достигнута за ${appData.getTargetMonth()} месяцев(-а)` : 
  `Цель не будет достигнута`
);
console.log(appData.getStatusIncome(appData.budgetDay));
console.log(`Возможные расходы: ${appData.addExpenses.join(', ')}`);

console.log(`Наша программа включает в себя данные:`);
for (let key in appData) {
  console.log(`${key}: ${appData[key]}`);
}