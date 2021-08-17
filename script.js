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
      inpAdExpenses = document.querySelectorAll('.additional_expenses-item'),
      // депозит:
      depositCheck = document.querySelector('#deposit-check'),
      depositBank = document.querySelector('.deposit-bank'),
      depositAmount = document.querySelector('.deposit-amount'),
      depositPercent = document.querySelector('.deposit-percent'),
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
      // все поля ввода справа (результаты):
      resultInputs = document.querySelectorAll('.result input[type=text]'),
      // все поля для ввода наименования:
      allNameInputs = document.querySelectorAll('input[placeholder="Наименование"]'),
      // все поля для ввода суммы:
      allSumInputs = document.querySelectorAll('input[placeholder="Сумма"]'),
      // блоки доп. доходов и обяз. расходов:
      incExpItems = {
        incomeItems: document.querySelectorAll('.income-items'),
        expensesItems: document.querySelectorAll('.expenses-items')
      };

// все поля ввода слева:
let dataInputs = document.querySelectorAll('.data input[type=text]');

const isNumber = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

class AppData {
  constructor() {
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
  }

  start() {
    this.budget = +inpSalaryAmt.value;
    this.getIncExp();
    this.getIncomeMonth();
    this.getAddIncExp();
    this.getExpensesMonth();
    this.getInfoDeposit();
    this.getBudget();
    this.showResult();
    dataInputs.forEach((item) => {
      item.readOnly = true;
    });
    btnStart.disabled = 'true';
    btnStart.style.display = 'none';
    btnReset.style.display = 'inline-block';
  }

  showResult() {
    resultBudgetM.value = this.budgetMonth;
    resultBudgetD.value = this.budgetDay;
    resultExpM.value = this.expensesMonth;
    resultAdExp.value = this.addExpenses.join(', ');
    resultAdInc.value = this.addIncome.join(', ');
    resultIncPrd.value = this.calcSavedMoney();
    periodSelect.addEventListener('change', () => {
      resultIncPrd.value = this.calcSavedMoney();
    });
    resultTargM.value = this.getTargetMonth();
  }

  reset() {
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
    resultInputs.forEach((item) => {
      item.value = '';
    });
    // чистим поля ввода данных:
    dataInputs.forEach((item) => {
      item.value = '';
      item.readOnly = false;
    });
    periodSelect.value = 1;
    periodAmount.textContent = periodSelect.value;
    // удаляем добавленные поля, если они были:
    if (incExpItems.incomeItems.length > 1) {
      if (incExpItems.incomeItems.length === 3) {
        incExpItems.incomeItems[1].remove();
        incExpItems.incomeItems[2].remove();
        btnAddInc.style.display = 'inline-block';
      } else {
        incExpItems.incomeItems[1].remove();
      }
    }
    if (incExpItems.expensesItems.length > 1) {
      if (incExpItems.expensesItems.length === 3) {
        incExpItems.expensesItems[1].remove();
        incExpItems.expensesItems[2].remove();
        btnAddExp.style.display = 'inline-block';
      } else {
        incExpItems.expensesItems[1].remove();
      }
    }
    // чистим депозит:
    depositCheck.checked = false;
    this.depositHandler();
    // возвращаем кнопку рассчитать:
    btnReset.style.display = 'none';
    btnStart.style.display = 'inline-block';
  }

  // проверка вводимых в поля данных:
  inputValidation() {
    if (this.placeholder === 'Наименование') {
      this.value = this.value.replace(/[\w]/g, '');
    } else if (this.placeholder === 'Сумма' || this.placeholder === 'Процент') {
      this.value = this.value.replace(/[^\d\.]/g, '');
    }
  }

  // дополнительный доход и обязательные расходы:
  getIncExp() {
    const count = (item) => {
      const typeStr = item.className.split('-')[0],
            itemTitle = item.querySelector(`.${typeStr}-title`).value,
            itemAmount = item.querySelector(`.${typeStr}-amount`).value;

      if (itemTitle !== '' && itemAmount !== '') {
        this[typeStr][itemTitle] = +itemAmount;
      }
    };
    incExpItems.incomeItems.forEach(count);
    incExpItems.expensesItems.forEach(count);
  }

  // сумма доп. доходов:
  getIncomeMonth() {
    let sum = 0;
    for (let key in this.income) {
      sum += +this.income[key];
    }
    this.incomeMonth = sum;
  }

  // дополнительный доход и обязательные расходы (добавление полей):
  addIncExpBlock(event) {
    const btnAdd = event.target,
          typeStr = btnAdd.parentNode.className,
          cloneItem = incExpItems[`${typeStr}Items`][0].cloneNode(true);

    for (let item of cloneItem.querySelectorAll('input')) {
      item.value = '';
    }

    incExpItems[`${typeStr}Items`][0].parentNode.insertBefore(cloneItem, btnAdd);
    incExpItems[`${typeStr}Items`] = document.querySelectorAll(`.${typeStr}-items`);

    for (let item of document.querySelectorAll(`.${typeStr}-items input`)) {
      item.addEventListener('input', this.inputValidation);
    }

    if (incExpItems[`${typeStr}Items`].length === 3) {
      btnAdd.style.display = 'none';
    }
    dataInputs = document.querySelectorAll('.data input[type=text]');
  }

  // возможные доходы и возможные расходы:
  getAddIncExp() {
    const count = (item) => {
      let itemValue = item.value.trim();

      if (itemValue !== '') {
        if (item.className === 'additional_income-item') {
          this.addIncome.push(itemValue);
        } else if (item.className === 'additional_expenses-item') {
          itemValue = itemValue.split(',');
          itemValue.forEach((item) => {
            item = item.trim();
            if (item !== '') {
              this.addExpenses.push(item);
            }
          });
        }
      }
    };
    inpAdIncome.forEach(count);
    inpAdExpenses.forEach(count);
  }

  // сумма расходов:
  getExpensesMonth() {
    let sum = 0;
    for (let key in this.expenses) {
      sum += +this.expenses[key];
    }
    this.expensesMonth = sum;
  }

  // меняет число под полоской периода расчета:
  changePeriodNum(event) {
    periodAmount.textContent = event.target.value;
  }

  // доход за месяц и дневной бюджет:
  getBudget() {
    const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);

    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
  }

  // накопления за период:
  calcSavedMoney() {
    return this.budgetMonth * periodSelect.value;
  }

  // срок достижения цели в месяцах:
  getTargetMonth() {
    return Math.ceil(+inpTarAmt.value / this.budgetMonth);
  }

  getStatusIncome(budgD) {
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

  // расчеты для депозита:
  getInfoDeposit() {
    if (this.deposit) {
      this.percentDeposit = depositPercent.value;
      this.moneyDeposit = depositAmount.value;
    }
  }

  // установить процентную ставку депозита:
  changePercent() {
    const selectValue = depositBank.value;
    if (selectValue === 'other') {
      depositPercent.value = '';
      depositPercent.style.display = 'inline-block';
      depositPercent.addEventListener('input', this.inputValidation);
      depositPercent.addEventListener('blur', function() {
        if (this.value > 100) {
          alert(`Введите корректное значение в поле "Процент"`);
          this.value = '';
          btnStart.disabled = 'true';
        } else if (depositPercent.value && inpSalaryAmt.value) {
          btnStart.removeAttribute('disabled');
        }
      });
      if (depositPercent.value && inpSalaryAmt.value) {
        btnStart.removeAttribute('disabled');
      }
    } else {
      depositPercent.value = selectValue;
      depositPercent.style.display = 'none';
      if (depositPercent.value && inpSalaryAmt.value) {
        btnStart.removeAttribute('disabled');
      }
    }
  }

  // депозит (показать/скрыть):
  depositHandler() {
    if (depositCheck.checked) {
      depositBank.style.display = 'inline-block';
      depositAmount.style.display = 'inline-block';
      this.deposit = true;
      depositBank.addEventListener('change', this.changePercent.bind(this));
    } else {
      depositBank.style.display = 'none';
      depositAmount.style.display = 'none';
      depositPercent.style.display = 'none';
      depositBank.value = '';
      depositAmount.value = '';
      depositPercent.value = '';
      this.deposit = false;
      depositBank.removeEventListener('change', this.changePercent.bind(this));
      if (inpSalaryAmt.value) {
        btnStart.removeAttribute('disabled');
      }
    }
  }

  // обработчики событий:
  eventsListeners() {
    // нажатие кнопки рассчитать:
    btnStart.disabled = 'true';
    inpSalaryAmt.addEventListener('input', (event) => {
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
    btnAddInc.addEventListener('click', this.addIncExpBlock.bind(this));
    btnAddExp.addEventListener('click', this.addIncExpBlock.bind(this));
    // отслеживание ползунка периода расчета
    periodSelect.addEventListener('input', this.changePeriodNum);
    // проверка введенных в поля данных:
    for (let item of allNameInputs) {
      item.addEventListener('input', this.inputValidation);
    }
    for (let item of allSumInputs) {
      item.addEventListener('input', this.inputValidation);
    }
    // есть ли депозит:
    depositCheck.addEventListener('change', this.depositHandler.bind(this));
  }
}

const appData = new AppData();

appData.eventsListeners();