const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = new express();
const cors = require('cors');
//const {todos} = require('./repo');
const {filter_list,active, completed, date_get, uq_id, view_todos_month, databaseOrder} = require('./service');
const {initializeFirebase,addTodoToFirestore,getAll} = require('./firebase');
const {errorHandler} = require('./helpers');


//Json parsing middleware
app.use(express.json());
app.use(cors());
initializeFirebase();    
//Middleware to log the request method, url and time of the request
app.use((req, res, next)=>{
    console.log(`${req.method} at PORT: ${req.url} on ${new Date()}`);
    next();
});
//Get Database
async function databaseTodos() {
    const todosDatabase = await getAll();
    return todosDatabase;
    
}

//Intro route
app.get('/', (req, res) => {
    res.status(200).json({message: "Welcome to the API"});
});
//Get all todos
app.get('/todos', async(req, res)=>{
    const selected_todos = await databaseTodos();
    const list_todos = filter_list(selected_todos);
    res.status(200).json({todos: list_todos, total: list_todos.length});
});

//Get active todos
app.get('/todos/active', async (req, res)=>{
    const todos = await databaseTodos();
    let active_todos = active(todos);
    active_todos = databaseOrder(active_todos);
    res.status(200).json({list: active_todos, total: active_todos.length});
});
//Get completed todos
app.get('/todos/completed', async (req, res)=>{
    const todos = await databaseTodos();
    let completed_todos = completed(todos);
    completed_todos = databaseOrder(completed_todos)
    res.status(200).json({list: completed_todos, total: completed_todos.length});
});
//Get todos by month
app.get('/todos/month/:month', async (req, res)=>{
    const todos = await databaseTodos();
    let month_todos = view_todos_month(todos, req.params.month);
    month_todos = databaseOrder(month_todos);
    res.status(200).json({list: month_todos, total: month_todos.length});
});
//Get Todos by unique id
app.get('/todos/:uq_id', async (req, res)=>{
    const todos = await databaseTodos();
    const todo = todos.find(t => t.uq_id === req.params.uq_id);
    if (!todo) {
        return res.status(404).json({message: "Todo not found"});
    }
    res.status(200).json({list: todo});
});
//Create a new todo
app.post('/todos', async (req, res)=>{
    const {title, description, todo_status} = req.body;
    if(!title || !description || todo_status === undefined){
        return res.status(400).json({message: "Title, description and status are required"});
    }
    const date = date_get();
    const todos = await databaseTodos()
    let todo = {title, description, todo_status, date};
    todo.uq_id = uq_id(todo, todos);
    const new_todos = todos.map((t) => ({id: todos.indexOf(t) + 1, ...t}));
    addTodoToFirestore(todo);
    res.status(201).json({message: "Todo created successfully", todos: new_todos});
});
//Full Update of a particular todo
app.put('/todos/:uq_id', (req, res)=>{
    const todo = todos.find(t => t.uq_id === req.params.uq_id);
    if (!todo) {
        return res.status(404).json({message: "Todo not found"});
    }
    const {title, description, todo_status} = req.body;
    if(!title || !description || todo_status === undefined){
        return res.status(400).json({message: "Title, description and status are required"});
    }
    todo.title = title;
    todo.description = description;
    todo.todo_status = todo_status;
    res.status(200).json({message: "Todo updated successfully", todos: todos});
});
//Partial Update of a particular todo
app.patch('/todos/:uq_id', (req, res)=>{
    const todo = todos.find(t => t.uq_id === req.params.uq_id);
    if(!todo){return res.status(400).json({message: "No Todo found with that id."})}
    let {title, description, todo_status} = req.body;
    todo = {...todo, title: title || todo.title, description: description || todo.description, todo_status: todo_status === undefined ? todo.todo_status : todo_status};
    res.status(200).json({message: "Todo updated successfully", todos: todos});
});
//Delete a particular todo
app.delete('/todos/:uq_id', (req,res)=>{
    const initial_length = todos.length;
    todos = todos.filter(t => t.uq_id !== req.params.uq_id);
    if(initial_length === todos.length){return res.status(400).json({message: "Todo is not found."})}
    res.status(200).json({message: "Todo deleted successfully", todos: todos});
});
//Handle errors middleware
app.use((err, req, res, next)=>{
    console.log(err);
    res.status(500).json({err: err, message: "Internal Server Error"});
    next();
});

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
});