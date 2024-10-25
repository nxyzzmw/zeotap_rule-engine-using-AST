const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/rule_engine')//replace your db name and port number
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));
// Rule Schema and Model
const ruleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    ruleString: { type: String, required: true },
    ast: { type: Object, required: true },
});
const Rule = mongoose.model('Rule', ruleSchema);

// Node class for AST
class Node {
    constructor(type, left = null, right = null, value = null) {
        this.type = type; // "operator" or "operand"
        this.left = left;
        this.right = right;
        this.value = value;
    }
}

// Function to create an AST from a rule string
function create_rule(ruleString) {
    const operators = ruleString.match(/AND|OR/g) || [];
    const operands = ruleString.match(/(age|department|salary|experience)\s*([<>=]+)\s*([0-9'"]+)/g) || [];

    if (!operands.length) {
        throw new Error("No valid operands found in rule string.");
    }

    const root = new Node("operator", null, null, operators[0] || "AND");
    let currentNode = root;

    const firstParts = operands[0].split(/(\s*[<>=]+\s*)/).filter(Boolean);
    currentNode.left = new Node("operand", null, null, {
        field: firstParts[0].trim(),
        operator: firstParts[1].trim(),
        value: firstParts[2].trim()
    });

    for (let index = 1; index < operands.length; index++) {
        const operandParts = operands[index].split(/(\s*[<>=]+\s*)/).filter(Boolean);
        const rightNode = new Node("operand", null, null, {
            field: operandParts[0].trim(),
            operator: operandParts[1].trim(),
            value: operandParts[2].trim()
        });
        const newOperatorNode = new Node("operator", currentNode, rightNode, operators[index - 1]);
        currentNode.right = rightNode;
        currentNode = newOperatorNode;
    }

    return root;
}

// Function to combine two ASTs based on operation
function combine_rules(ast1, ast2, operation) {
    return new Node("operator", ast1, ast2, operation);
}

function evaluate_rule(node, data) {
    if (!node) throw new Error("Node is null");

    if (node.type === "operand") {
        const fieldValue = data[node.value.field];
        const comparisonValue = parseInt(node.value.value);

        if (fieldValue === undefined) throw new Error(`Field value for ${node.value.field} is undefined.`);

        switch (node.value.operator) {
            case '>': return fieldValue > comparisonValue;
            case '<': return fieldValue < comparisonValue;
            case '=':
            case '==': return fieldValue == comparisonValue;
            case '>=': return fieldValue >= comparisonValue;
            case '<=': return fieldValue <= comparisonValue;
            case '!=':
            case '<>': return fieldValue != comparisonValue;
            default: throw new Error("Invalid operator: " + node.value.operator);
        }
    } else if (node.type === "operator") {
        // Handle left and right nodes safely
        const leftResult = node.left ? evaluate_rule(node.left, data) : true;
        const rightResult = node.right ? evaluate_rule(node.right, data) : true;

        return node.value === "AND" ? leftResult && rightResult : leftResult || rightResult;
    }

    throw new Error("Invalid node type: " + node.type);
}


// Route to display all stored rules
app.get('/view_rules', async (req, res) => {
    try {
        const rules = await Rule.find();
        res.render('view_rules', { rules });
    } catch (error) {
        res.status(500).send('Error fetching rules: ' + error.message);
    }
});

// API Endpoints
app.post('/create_rule', async (req, res) => {
    const { name, ruleString } = req.body;
    try {
        const ast = create_rule(ruleString);
        const newRule = new Rule({ name, ruleString, ast });
        await newRule.save();
        res.render('rule_created', { rule: newRule });
    } catch (error) {
        res.status(400).send('Error creating rule: ' + error.message);
    }
});

app.get('/combine_rules', async (req, res) => {
    try {
        const rules = await Rule.find();
        res.render('combine_rules', { rules });
    } catch (error) {
        res.status(500).send('Error loading rules for combination: ' + error.message);
    }
});

app.post('/combine_rules', async (req, res) => {
    const { rule1, rule2, operation } = req.body;
    try {
        const ast1 = await Rule.findById(rule1);
        const ast2 = await Rule.findById(rule2);
        const combinedAst = combine_rules(ast1.ast, ast2.ast, operation);

        const combinedRule = new Rule({
            name: `${ast1.name} ${operation} ${ast2.name}`,
            ruleString: `${ast1.ruleString} ${operation} ${ast2.ruleString}`,
            ast: combinedAst,
        });
        await combinedRule.save();
        res.render('combined_rule', { rule1: ast1, rule2: ast2, operation, combinedRule });
    } catch (error) {
        res.status(400).send('Error combining rules: ' + error.message);
    }
});

app.get('/evaluate_rule', async (req, res) => {
    try {
        const rules = await Rule.find();
        res.render('evaluate_rule', { rules, evaluationResult: undefined });
    } catch (error) {
        res.status(500).send('Error loading rules for evaluation: ' + error.message);
    }
});

app.post('/evaluate_rule', async (req, res) => {
    const { ruleId, age, department, salary, experience } = req.body;

    try {
        const rule = await Rule.findById(ruleId);
        const data = { age: parseInt(age), department, salary: parseInt(salary), experience: parseInt(experience) };

        if (rule) {
            const isValid = evaluate_rule(rule.ast, data);
            res.render('evaluate_rule', { 
                rules: await Rule.find(), 
                evaluationResult: { 
                    isValid,
                    ruleName: rule.name,
                    ruleString: rule.ruleString
                } 
            });
        } else {
            res.status(404).send('Rule not found.');
        }
    } catch (error) {
        res.status(400).send('Error evaluating rule: ' + error.message);
    }
});

app.get('/', (req, res) => {
    res.render('create_rule'); 
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
