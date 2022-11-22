# workflow-management-system-backend

The developed system is a workflow management system (https://master--delightful-licorice-d3ecf6.netlify.app/login) and it is a proof of concept that will be used by the Galle District Irrigation Department of Sri Lanka. Currently, most of the administrative work is carried out manually using paper-based approaches. Using this system for the management of workflows will help to reduce many overheads and to simplify management tasks. Since the system is used only by the organisation’s (Galle district irrigation department) employees, after registering through the signup page of the application, further email verification and approval from a DI (director of Irrigation) is required to enter the system. The system has several user roles and DI (Director of Irrigation) is one such user role. Only the DI can create a workflow in the system by creating any number of subtasks under the new workflow. Furthermore, any number of employees can be assigned to each subtask. The employees then must carry out the specific subtask assigned for them. 

## Components

### .github > workflows > node.js.yml 
file contains the CI (Continuous Integration) pipeline setup to run test scripts when a merge happens to the main branch of the remote repository

### node_modules
contains all the node modules used to develop the project

### config
contains various configuration files needed for the system such as allowed origins, cors options, role list of the users of the system etc.

### controller
This folder containes all the controller functions code. There is a controller file (.js file) for every model of the system (categoryController.js, mainTaskController.js etc) and authorization related controller functions can be found in this foler as well (inside authController folder). Controller functions contains the application logic.

### logs
Contains logs of various actions such as request logs, login-logout logs, errorlogs, etc.

### middleware
Contains all the middleware functions used in the server such as logging events, verifying JWT (Jason Web Tokens), email validation, etc.

### Model
Contains all the files that represent the models (Database models). There is a model for each collection in the mongoDB database. Eg. Category.js, mainTask.js, etc.

### routes
Contains the routes handling of the server. For each specific route group there is the relevant route file. Eg. authorization related routes are implemented under authRoutes folder. Maintask related routes can be found under mainTaskRoutes.js file.

### tests
Contains all the API test scripts and performance test scripts.

### Views
contains static files of the server

### .env
contains environmental variables such as secret keys need to verify jason web tokens.

### sever.js
Contains the server application

### index.js
imports the server application and runs the server.
