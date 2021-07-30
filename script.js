'use strict';

let money = 2000,
    income = 'фриланс',
    addExpenses = 'налоги, Аренда, страховка, связь',
    deposit = true,
    mission = 50000,
    period = 12,
    budgetDay;

console.log('typeof money: ', typeof money);
console.log('typeof income: ', typeof income);
console.log('typeof deposit: ', typeof deposit);
console.log('addExpenses.length: ', addExpenses.length);
console.log('Период равен ' + period + ' месяцев');
console.log('Цель - заработать ' + mission + ' евро');

addExpenses = addExpenses.toLowerCase();
addExpenses = addExpenses.split(', ');
console.log('addExpenses: ', addExpenses);

budgetDay = money / 30;
console.log('budgetDay: ', budgetDay);