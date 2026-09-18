// Checklist: Event listeners (No inline onclick in HTML)
document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById('screen');
    const buttons = document.querySelectorAll('.btn');

    let currentExpression = '';
    let isEvaluated = false;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const num = button.getAttribute('data-num');
            const operator = button.getAttribute('data-operator');
            const action = button.getAttribute('data-action');

            if (num !== null) {
                handleNumber(num);
            } else if (operator !== null) {
                handleOperator(operator);
            } else if (action !== null) {
                handleAction(action);
            }

            updateDisplay();
        });
    });

    function handleNumber(num) {
        if (isEvaluated) {
            currentExpression = num === '.' ? '0.' : num;
            isEvaluated = false;
            return;
        }

        // Prevent multiple decimal points in a single number block
        if (num === '.') {
            const lastNumber = currentExpression.split(/[\+\-\*\/]/).pop();
            if (lastNumber.includes('.')) return;
            if (lastNumber === '') currentExpression += '0';
        }

        if (currentExpression === '0' && num !== '.') {
            currentExpression = num;
        } else {
            currentExpression += num;
        }
    }

    function handleOperator(op) {
        if (isEvaluated) {
            isEvaluated = false;
        }

        if (currentExpression === '' && op === '-') {
            currentExpression = '-';
            return;
        }

        if (currentExpression === '' || currentExpression === '-') return;

        // Operator chaining: Replace last operator if clicked consecutively
        const lastChar = currentExpression.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
            currentExpression = currentExpression.slice(0, -1) + op;
        } else {
            currentExpression += op;
        }
    }

    function handleAction(action) {
        if (action === 'clear') {
            currentExpression = '';
            isEvaluated = false;
        } else if (action === 'delete') {
            if (isEvaluated) {
                currentExpression = '';
                isEvaluated = false;
            } else {
                currentExpression = currentExpression.slice(0, -1);
            }
        } else if (action === 'equals') {
            calculateResult();
        }
    }

    function calculateResult() {
        if (currentExpression === '') return;

        // Checklist: Prevent division-by-zero check
        if (/\/0(?!\d)/.test(currentExpression)) {
            currentExpression = 'Error: Division by 0';
            isEvaluated = true;
            return;
        }

        try {
            // Function constructor safe evaluation for calculations
            let result = Function(`'use strict'; return (${currentExpression})`)();
            
            // Format floats to prevent long decimal overflow
            if (typeof result === 'number' && !Number.isInteger(result)) {
                result = parseFloat(result.toFixed(8));
            }

            currentExpression = result.toString();
            isEvaluated = true;
        } catch (error) {
            currentExpression = 'Error';
            isEvaluated = true;
        }
    }

    function updateDisplay() {
        // Display symbol formatting
        let formatted = currentExpression
            .replace(/\*/g, ' × ')
            .replace(/\//g, ' ÷ ')
            .replace(/\+/g, ' + ')
            .replace(/(?!^-)-/g, ' − ');

        screen.innerText = formatted || '0';
    }
});