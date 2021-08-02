'use strict';

const money = +prompt(`Ваш месячный доход?`),
  income = 'фриланс',
  addExpenses = prompt(`Перечислите возможные расходы за рассчитываемый период через запятую`, `Квартплата, проездной, кредит`),
  deposit = confirm(`Есть ли у вас депозит в банке?`),
  mission = 1000000,
  expenses1 = prompt(`Введите обязательную статью расходов`),
  amount1 = +prompt(`Во сколько это обойдется?`),
  expenses2 = prompt(`Введите обязательную статью расходов`),
  amount2 = +prompt(`Во сколько это обойдется?`),
  budgetMonth = money - amount1 - amount2,
  budgetDay = Math.floor(budgetMonth / 30),
  period = Math.ceil(mission / budgetMonth);

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

console.log(typeof money, typeof income, typeof deposit);
console.log(addExpenses.length);
console.log(`Период равен ${period} месяцев(-а)`);
console.log(`Цель - заработать ${mission} рублей`);
console.log(addExpenses.toLowerCase().split(', '));
console.log(`Бюджет на месяц: ${budgetMonth}`);
console.log(`Цель будет достигнута за ${period} месяцев(-а)`);
console.log(`Бюджет на день: ${budgetDay}`);