'use strict';

// Функции:
const showTypeOf = function(valToCheck) {
  return typeof valToCheck;
};
const getExpensesMonth = function(expAmt1, expAmt2) {
  return expAmt1 + expAmt2;
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

// Переменные:
const money = +prompt(`Ваш месячный доход?`, `70000`),
  income = 'фриланс',
  addExpenses = prompt(`Перечислите возможные расходы за рассчитываемый период через запятую`, `Квартплата, проездной, кредит`),
  deposit = confirm(`Есть ли у вас депозит в банке?`),
  mission = 1000000,
  expenses1 = prompt(`Введите обязательную статью расходов`, `аренда`),
  amount1 = +prompt(`Во сколько это обойдется?`, `20000`),
  expenses2 = prompt(`Введите обязательную статью расходов`, `страховка`),
  amount2 = +prompt(`Во сколько это обойдется?`, `5000`),
  accumulatedMonth = getAccumulatedMonth(money, getExpensesMonth(amount1, amount2)),
  budgetDay = Math.floor(accumulatedMonth / 30),
  period = getTargetMonth(mission, accumulatedMonth);

// Вывод результатов:
console.log(showTypeOf(money), showTypeOf(income), showTypeOf(deposit));
console.log(`Расходы за месяц: ${getExpensesMonth(amount1, amount2)}`);
console.log(addExpenses.toLowerCase().split(', '));
console.log(`Цель будет достигнута за ${period} месяцев(-а)`);
console.log(`Бюджет на день: ${budgetDay}`);
console.log(getStatusIncome(budgetDay));