'use strict';

// Переменные:
const income = 'фриланс',
  addExpenses = prompt(`Перечислите возможные расходы за рассчитываемый период через запятую`, `Квартплата, проездной, кредит`),
  deposit = confirm(`Есть ли у вас депозит в банке?`),
  mission = 1000000;

let money,
  expenses = [];

// Функции:
const isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const start = function() {
  do {
    money = prompt(`Ваш месячный доход?`);
  }
  while (!isNumber(money));
};
start();

const showTypeOf = function(valToCheck) {
  return typeof valToCheck;
};

const getExpensesMonth = function() {
  let sum = 0;

  for (let i = 0; i < 2; i++) {
    expenses[i] = prompt(`Введите обязательную статью расходов`);
    let amount;
    do {
      amount = prompt(`Во сколько это обойдется?`);
    }
    while (!isNumber(amount));
    sum += +amount;
  }

  console.log(expenses);
  return sum;
};

const getAccumulatedMonth = function(incAmt, outcAmt) {
  return incAmt - outcAmt;
};

const getTargetMonth = function(missionAmt, budgM) {
  return Math.ceil(missionAmt / budgM);
};

const getStatusIncome = function(budgD) {
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

// Переменные, вызывающие функции:
const expensesAmount = getExpensesMonth(),
  accumulatedMonth = getAccumulatedMonth(money, expensesAmount),
  budgetDay = Math.floor(accumulatedMonth / 30),
  period = getTargetMonth(mission, accumulatedMonth);

// Вывод результатов:
console.log(showTypeOf(money), showTypeOf(income), showTypeOf(deposit));
console.log(`Расходы за месяц: ${expensesAmount}`);
console.log(addExpenses.toLowerCase().split(', '));
console.log(
  period >= 0 ?
  `Цель будет достигнута за ${period} месяцев(-а)` : 
  `Цель не будет достигнута`
);
console.log(`Бюджет на день: ${budgetDay}`);
console.log(getStatusIncome(budgetDay));