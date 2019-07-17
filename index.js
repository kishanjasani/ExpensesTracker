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

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
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
        value: document.querySelector(DOMString.inputValue).value
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

    getDOMString: function getDOMString() {
      return DOMString;
    }

  };
}());

// Main App COntroller
var controller = (function controller(bgtCtrl, uiCtrl) {
  var input; var newItem;
  var ctrlAddItem = function ctrlAddItem() {
    input = uiCtrl.getInput();
    newItem = budgetController.allItems(input.type, input.description, input.value);
    uiCtrl.addListItem(newItem, input.type);
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
