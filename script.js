'use strict';

let money = 2000,
  income = 'фриланс',
  addExpenses = 'налоги, Аренда, страховка, связь',
  deposit = true,
  mission = 50000,
  period = 12,
  budgetDay = money / 30,
  expenses1,
  expenses2,
  amount1,
  amount2,
  budgetMonth;

// console.log(typeof money, typeof income, typeof deposit);
// console.log(addExpenses.length);
// console.log(`Период равен ${period} месяцев`);
// console.log(`Цель - заработать ${mission} евро`);
// console.log(addExpenses.toLowerCase().split(', '));
// console.log(budgetDay);

money = +prompt(`Ваш месячный доход?`);
addExpenses = prompt(`Перечислите возможные расходы за рассчитываемый период через запятую`, `Квартплата, проездной, кредит`);
deposit = confirm(`Есть ли у вас депозит в банке?`);

expenses1 = prompt(`Введите обязательную статью расходов`);
amount1 = +prompt(`Во сколько это обойдется?`);
expenses2 = prompt(`Введите обязательную статью расходов`);
amount2 = +prompt(`Во сколько это обойдется?`);

budgetMonth = money - amount1 - amount2;
console.log(`Бюджет на месяц: ${budgetMonth}`);

period = Math.ceil(mission / budgetMonth);
console.log(`Цель будет достигнута за ${period} месяцев(-а)`);

budgetDay = Math.floor(budgetMonth / 30);
console.log(`Бюджет на день: ${budgetDay}`);

switch (true) {
  case (budgetDay >= 1200):
    console.log(`У вас высокий уровень дохода`);
    break;
  case (1200 > budgetDay >= 600):
    console.log(`У вас средний уровень дохода`);
    break;
  case (600 > budgetDay >= 0):
    console.log(`К сожалению, ваш уровень дохода ниже среднего`);
    break;
  default:
    console.log(`Что-то пошло не так`);
}