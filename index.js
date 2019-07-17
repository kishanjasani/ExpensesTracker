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
    inputBtn: '.add__submit'
  };

  return {

    getInput: function getInput() {
      return {
        type: document.querySelector(DOMString.inputType).value,
        description: document.querySelector(DOMString.inputDescription).value,
        value: document.querySelector(DOMString.inputValue).value
      };
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
