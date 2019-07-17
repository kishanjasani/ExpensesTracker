// Budget Controller
var budgetController = (function budgetController() {
  var Expense = function Expense(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function Income(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function calculateTotal(type) {
    var sum = 0;
    data.allItems[type].forEach((cur) => {
      sum += cur.value;
    });
    data.totals[type] = sum;
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
        data.percentage = Math.round((data.totals.inc / data.totals.exp) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function getBudget() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
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
    expenseContainer: '.expenses__list'
  };

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
        html = '<div class="item" id="income-%id%"><div class="item__description">%description%</div><div class="right"><div class="item__value">+%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMString.expenseContainer;
        html = '<div class="item" id="expenses-%id%"><div class="item__description">%description%</div><div class="right"><div class="item__value">-%value%</div><div class="budget__expense--percentage">45%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
    console.log(budget);
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
  };

  return {
    init: function init() {
      console.log('Application is started');
      setupEventListener();
    }
  };
}(budgetController, UIController));

controller.init();
