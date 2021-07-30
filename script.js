'use strict';

const money = 2000,
  income = 'фриланс',
  addExpenses = 'налоги, Аренда, страховка, связь',
  deposit = true,
  mission = 50000,
  period = 12,
  budgetDay = money / 30;

console.log(typeof money, typeof income, typeof deposit);
console.log(addExpenses.length);
console.log(`Период равен ${period} месяцев`);
console.log(`Цель - заработать ${mission} евро`);
console.log(addExpenses.toLowerCase().split(', '));
console.log(budgetDay);