Zeotap_Rule Engine using AST

Objective
The goal is to develop a simple 3-tier rule engine application with a user interface, API, and backend data storage to determine user eligibility based on attributes like age, income, and spend. The system uses an Abstract Syntax Tree (AST) to represent conditional rules and allows for dynamic creation, combination, and modification of these rules.

Data Structure
Node
Type: A string indicating the node type ("operator" for AND/OR, "operand" for conditions).
Left: Reference to another Node (left child).
Right: Reference to another Node (right child for operators).
Value: An optional value for operand nodes (e.g., a number for comparisons).
Data Storage
Database Choice: MongoDB
Schema:
Rule
_id: Unique identifier.
name: String representing the rule name.
ruleString: String representing the rule in string format.
ast: Object representing the corresponding AST.
API Design
create_rule(rule_string)
Takes a string representing a rule and returns a Node object representing the corresponding AST.
combine_rules(rules)
Takes a list of rule strings and combines them into a single AST, minimizing redundant checks.
Returns the root node of the combined AST.
evaluate_rule(JSON data)
Takes a JSON representing the combined rule's AST and a dictionary containing attributes (e.g., data = {"age": 35, "salary": 60000, "experience": 3}).
Evaluates the rule against the provided data and returns True if the user is eligible based on the rule, otherwise returns False.
Test Cases
Create Individual Rules: Use create_rule to generate individual rules and verify their AST representation.
Combine Example Rules: Use combine_rules to combine the example rules and ensure the resulting AST reflects the combined logic.
Test with Sample Data: Implement sample JSON data and test evaluate_rule for different scenarios.
Combine Additional Rules: Explore combining more rules and test the functionality.
Bonus Features
Error Handling: Implement error handling for invalid rule strings or data formats (e.g., missing operators, invalid comparisons).
Attribute Validations: Implement validations to ensure attributes are part of a defined catalog.
Rule Modification: Allow modification of existing rules using functionalities within create_rule or through separate functions (e.g., changing operators, operand values).
Extended Functionality: Consider supporting user-defined functions within the rule language for advanced conditions.
Running the Project
Tools Required
VS Code
Node.js
MongoDB Compass (optional for better data visualization)
Setup Instructions
Clone the project or download the ZIP file and extract it:

bash
Copy code
Navigate to the project directory and install necessary packages:

bash
Copy code
npm install mongoose express dotenv ejs
Start the project:

bash
Copy code
node index.js
Open your browser and go to:

arduino
Copy code
http://localhost:3000
