# Rule Engine with AST

## Objective
Developed a simple 3-tier rule engine application with a user interface, API, and backend data storage to determine user eligibility based on attributes like age, income, and spend. The system uses an Abstract Syntax Tree (AST) to represent conditional rules and allows for dynamic creation, combination, and modification of these rules.

## Data Structure
The data structure to represent the AST is defined as follows:

- **Node**
  - **type**: String indicating the node type ("operator" for AND/OR, "operand" for conditions)
  - **left**: Reference to another Node (left child)
  - **right**: Reference to another Node (right child for operators)
  - **value**: Optional value for operand nodes (e.g., number for comparisons)

## Data Storage
- **Database Choice**: MongoDB
- **Schema**:
  - **Rule**
    - **_id**: Unique identifier
    - **name**: String representing the rule name
    - **ruleString**: String representing the rule in string format
    - **ast**: Object representing the corresponding AST


## API Design
1. **create_rule(rule_string)**: 
- This function takes a string representing a rule and returns a Node object representing the corresponding AST.

2. **combine_rules(rules)**: 
- This function takes a list of rule strings and combines them into a single AST, minimizing redundant checks. It returns the root node of the combined AST.

3. **evaluate_rule(JSON data)**: 
- This function takes a JSON representing the combined rule's AST and a dictionary containing attributes (e.g., `data = {"age": 35, "salary": 60000, "experience": 3}`).
- It evaluates the rule against the provided data and returns `True` if the user is eligible based on the rule, otherwise returns `False`.

## Test Cases
1. Create individual rules from the examples using `create_rule` and verify their AST representation.
2. Combine the example rules using `combine_rules` and ensure the resulting AST reflects the combined logic.
3. Implement sample JSON data and test `evaluate_rule` for different scenarios.
4. Explore combining additional rules and test the functionality.

## Bonus Features
- Implement error handling for invalid rule strings or data formats (e.g., missing operators, invalid comparisons).
- Implement validations for attributes to be part of a catalog.
- Allow modification of existing rules using functionalities within `create_rule` or separate functions (e.g., changing operators, operand values).
- Consider extending the system to support user-defined functions within the rule language for advanced conditions.


## Running the Project:
### Tools Required:
- **VS Code**
- **Node.js**
- **MongoDB Compass** 

### Setup Instructions
1. Clone the project or download the ZIP file and extract it.
   ```bash
   git clone https://github.com/nxyzzmw/zeotap_rule-engine-using-AST.git
2. Run the following command to install necessary packages:
   ```bash
   npm install mongoose express dotenv ejs
3. Start the project:
   ```bash
   node index.js
4. Open your browser and go to:
   ```bash
   http://localhost:3000

