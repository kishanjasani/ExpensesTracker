// Budget Controller
var budgetController = (function budgetController() {
  var Expense = function Expense(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function calcPercentage(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function getPercentage() {
    return this.percentage;
  };

  var Income = function Income(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  var calculateTotal = function calculateTotal(type) {
    var sum = 0;
    data.allItems[type].forEach((cur) => {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  return {
    allItems: function allItems(type, desc, val) {
      var newItem; var ID;

      // Id = lastid -1;
      // Create a new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based von it's 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(ID, desc, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, desc, val);
      }
      data.allItems[type].push(newItem);
      return newItem;
    },

    calculateBudget: function calculateBudget() {
      // Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      // Calculate budget
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        // Calculate percentage
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function calculatePercentages() {
      data.allItems.exp.forEach(function (curr) {
        curr.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function getPercentages() {
      var allPerc = data.allItems.exp.map(function (curr) {
        return curr.getPercentage();
      });
      return allPerc;
    },

    deleteItem: function deleteItem(type, id) {
      var ids; var index;
      ids = data.allItems[type].map(current => current.id);
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    getBudget: function getBudget() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    getTestingData: function getTestingData() {
      return data.allItems;
    }
  };
}());

// UI Controller
var UIController = (function UIController() {
  var DOMString = {
    inputType: '.add__type',
    inputDescription: '.add__desc',
    inputValue: '.add__value',
    inputBtn: '.add__submit',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expense--value',
    expensesPercentage: '.budget__expense--percentage',
    container: '.container',
    expensePerLbl: '.item__expense--percentage',
    budgetMonth: '.budget__title--month'
  };

  var formatNumber = function formatNumber(num, type) {
    var numSplit; var num; var int; var dec;
    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split('.');
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, int.length);
    }
    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  }

  var nodeForEach = function nodeForEach(list, callback) {
    for (var i=0; i < list.length; i++) {
      callback(list[i], i);
    }
  }

  return {

    getInput: function getInput() {
      return {
        type: document.querySelector(DOMString.inputType).value,
        description: document.querySelector(DOMString.inputDescription).value,
        value: parseFloat(document.querySelector(DOMString.inputValue).value)
      };
    },

    addListItem: function addListItem(obj, type) {
      var html; var newHtml; var element;
      if (type === 'inc') {
        element = DOMString.incomeContainer;
        html = '<div class="item" id="inc-%id%"><div class="item__description">%description%</div><div class="right"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMString.expenseContainer;
        html = '<div class="item" id="exp-%id%"><div class="item__description">%description%</div><div class="right"><div class="item__value">%value%</div><div class="item__expense--percentage">45%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function deleteListItem(selectorId) {
      var el;
      el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
    },

    clearFields: function clearFields() {
      var field; var fieldArr;
      field = document.querySelectorAll(`${DOMString.inputDescription}, ${DOMString.inputValue}`);
      fieldArr = Array.prototype.slice.call(field);
      fieldArr.forEach((current) => {
        current.value = '';
      });
      fieldArr[0].focus();
    },

    displayBudget: function updateBudget(obj) {
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMString.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMString.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMString.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      if (obj.percentage > 0) {
        document.querySelector(DOMString.expensesPercentage).textContent = `${obj.percentage}%`;
      } else {
        document.querySelector(DOMString.expensesPercentage).textContent = '---';
      }
    },

    displayPercentages: function displayPercentages(percentages) {
      var fields = document.querySelectorAll(DOMString.expensePerLbl);
      nodeForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }

      })
    },

    changedType: function changedType() {
      var fields = document.querySelectorAll(DOMString.inputType + ',' + DOMString.inputDescription + ',' + DOMString.inputValue);

      nodeForEach(fields, function (curr) {
        curr.classList.toggle('red-focus');
      });
    },

    displayMonth: function displayMonth() {
      var now; var months; var month; var year;
      now = new Date();
      months = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
      month = months[now.getMonth()];
      year = now.getFullYear();
      document.querySelector(DOMString.budgetMonth).textContent = month + ' ' + year;
    },

    getDOMString: function getDOMString() {
      return DOMString;
    }

  };
}());

// Main App COntroller
var controller = (function controller(bgtCtrl, uiCtrl) {
  var updateBudget = function updateBudget() {
    var budget;
    // Calculate budget
    bgtCtrl.calculateBudget();
    // return budget
    budget = bgtCtrl.getBudget();
    // display budget to UI
    uiCtrl.displayBudget(budget);
  };

  var updatePercentage = function updatePercentage() {
    // Calculate budget Controller percentages
    bgtCtrl.calculatePercentages();
    // Read percentages frtom budget controller
    var percentages = bgtCtrl.getPercentages();
    // Update the new UI with budget controller
    uiCtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function ctrlAddItem() {
    var input; var newItem;

    // Get the field input data
    input = uiCtrl.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // Add the item to budget controller
      newItem = budgetController.allItems(input.type, input.description, input.value);
      // Add the item to UI
      uiCtrl.addListItem(newItem, input.type);
      // Clear the field input
      uiCtrl.clearFields();
      // calculate and update budgets
      updateBudget();
      // Calculate and update percentage
      updatePercentage();
    }
  };

  var ctrlDeleteItem = function ctrlDeleteItem(event) {
    var itemId; var splitId; var type; var id;
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemId) {
      splitId = itemId.split('-');
      type = splitId[0];
      id = parseInt(splitId[1]);

      // Delete Item from data structure
      bgtCtrl.deleteItem(type, id);
      // Delete item from UI
      uiCtrl.deleteListItem(itemId);
      // Update budget
      updateBudget();
      // Calculate and update percentage
      updatePercentage();
    }
  };

  var setupEventListener = function setupEventListener() {
    var DOM = uiCtrl.getDOMString();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', (event) => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changedType);
  };

  return {
    init: function init() {
      console.log('Application is started');
      uiCtrl.displayMonth();
      uiCtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListener();
    }
  };
}(budgetController, UIController));

controller.init();
