class Calculator {
  constructor(historyElement, inputElement) {
    this.historyElement = historyElement;
    this.inputElement = inputElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetScreen = false;
    this.updateDisplay();
  }

  delete() {
    if (this.currentOperand === '0') return;
    if (this.currentOperand.length === 1) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
    this.updateDisplay();
  }

  appendNumber(number) {
    if (this.shouldResetScreen) {
      this.currentOperand = '';
      this.shouldResetScreen = false;
    }
    if (number === '.' && this.currentOperand.includes('.')) return;
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number;
    } else {
      this.currentOperand += number;
    }
    this.updateDisplay();
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.shouldResetScreen = true;
    this.updateDisplay();
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    // Direct mathematical evaluation logic preventing floating-point precision issues
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        if (current === 0) {
          computation = 'Error';
        } else {
          computation = prev / current;
        }
        break;
      default:
        return;
    }

    // Floating point correction (e.g., 0.1 + 0.2)
    if (typeof computation === 'number') {
      computation = Math.round(computation * 1e12) / 1e12;
    }

    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
    this.updateDisplay();
  }

  applyPercentage() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;
    this.currentOperand = (current / 100).toString();
    this.updateDisplay();
  }

  getDisplayNumber(number) {
    if (number === 'Error') return 'Error';
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.inputElement.innerText = this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
      this.historyElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${opSymbols[this.operation]}`;
    } else {
      this.historyElement.innerText = '';
    }
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  const historyElement = document.getElementById('calc-history');
  const inputElement = document.getElementById('calc-input');
  const calculator = new Calculator(historyElement, inputElement);

  // Click Handler Setup
  document.querySelector('.calc-grid').addEventListener('click', (e) => {
    const target = e.target;
    if (!target.matches('button')) return;

    if (target.classList.contains('btn-num')) calculator.appendNumber(target.dataset.val);
    if (target.classList.contains('btn-operator')) calculator.chooseOperation(target.dataset.op);
    if (target.dataset.action === 'clear') calculator.clear();
    if (target.dataset.action === 'delete') calculator.delete();
    if (target.dataset.action === 'percentage') calculator.applyPercentage();
    if (target.dataset.action === 'evaluate') calculator.compute();
  });

  // Physical Keyboard Support Mapping
  const keyMap = {
    '0': '[data-val="0"]', '1': '[data-val="1"]', '2': '[data-val="2"]',
    '3': '[data-val="3"]', '4': '[data-val="4"]', '5': '[data-val="5"]',
    '6': '[data-val="6"]', '7': '[data-val="7"]', '8': '[data-val="8"]',
    '9': '[data-val="9"]', '.': '[data-val="."]', '+': '[data-op="+"]',
    '-': '[data-op="-"]', '*': '[data-op="*"]', '/': '[data-op="/"]',
    'Enter': '[data-action="evaluate"]', '=': '[data-action="evaluate"]',
    'Backspace': '[data-action="delete"]', 'Escape': '[data-action="clear"]',
    '%': '[data-action="percentage"]'
  };

  document.addEventListener('keydown', (e) => {
    const querySelector = keyMap[e.key];
    if (!querySelector) return;
    
    e.preventDefault();
    const btn = document.querySelector(querySelector);
    if (btn) {
      btn.click();
      btn.classList.add('btn-active-kb');
      setTimeout(() => btn.classList.remove('btn-active-kb'), 100);
    }
  });
});