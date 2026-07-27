const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let expressionString = '';
let firstOperand = null;
let currentOperator = null;
let waitingForSecondOperand = false;
let memoryValue = 0;
let resetDisplayOnNextInput = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');
        const action = button.getAttribute('data-action');

        if (value !== null) {
            handleNumber(value);
            return;
        }

        if (action !== null) {
            handleAction(action);
        }
    });
});

function handleNumber(num) {
    if (resetDisplayOnNextInput) {
        currentInput = num;
        expressionString = num;
        resetDisplayOnNextInput = false;
        waitingForSecondOperand = false;
    } else {
        if (waitingForSecondOperand) {
            currentInput = num;
            waitingForSecondOperand = false;
        } else {
            if (currentInput === '0' && num !== '.') {
                currentInput = num;
            } else if (num === '.' && currentInput.includes('.')) {
                return;
            } else {
                currentInput += num;
            }
        }
        
        if (expressionString === '0' && num !== '.') {
            expressionString = num;
        } else {
            expressionString += num;
        }
    }
    updateDisplay(expressionString);
}

function handleAction(action) {
    switch (action) {
        case 'clear':
            currentInput = '0';
            expressionString = '';
            firstOperand = null;
            currentOperator = null;
            waitingForSecondOperand = false;
            resetDisplayOnNextInput = false;
            updateDisplay('0');
            break;
        case 'percent':
            currentInput = String(parseFloat(currentInput) / 100);
            expressionString = currentInput;
            updateDisplay(expressionString);
            break;
        case 'm-plus':
            memoryValue += parseFloat(currentInput);
            break;
        case 'm-minus':
            memoryValue -= parseFloat(currentInput);
            break;
        case 'add':
        case 'subtract':
        case 'multiply':
            handleOperator(action);
            break;
        case 'calculate':
            if (currentOperator === null || waitingForSecondOperand) return;
            let result = calculate(firstOperand, parseFloat(currentInput), currentOperator);
            currentInput = String(result);
            expressionString = String(result);
            firstOperand = null;
            currentOperator = null;
            waitingForSecondOperand = true;
            resetDisplayOnNextInput = true;
            updateDisplay(expressionString);
            break;
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);
    let operatorSymbol = '';
    
    if (nextOperator === 'add') operatorSymbol = '+';
    if (nextOperator === 'subtract') operatorSymbol = '-';
    if (nextOperator === 'multiply') operatorSymbol = '*';

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (currentOperator && !waitingForSecondOperand) {
        const result = calculate(firstOperand, inputValue, currentOperator);
        firstOperand = result;
        currentInput = String(result);
    }

    waitingForSecondOperand = true;
    resetDisplayOnNextInput = false;
    currentOperator = nextOperator;
    
    if (expressionString === '' || resetDisplayOnNextInput) {
        expressionString = currentInput + operatorSymbol;
    } else {
        if (['+', '-', '*'].includes(expressionString.slice(-1))) {
            expressionString = expressionString.slice(0, -1) + operatorSymbol;
        } else {
            expressionString += operatorSymbol;
        }
    }
    updateDisplay(expressionString);
}

function calculate(first, second, operator) {
    switch (operator) {
        case 'add':
            return first + second;
        case 'subtract':
            return first - second;
        case 'multiply':
            return first * second;
        default:
            return second;
    }
}

function updateDisplay(val) {
    display.value = val;
}