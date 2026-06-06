const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = new express();
const cors = require('cors');
const {todos} = require('./repo');
const {filter_list,active, completed, date_get, uq_id} = require('./service');



app.use(express.json());
app.use(cors());    




//Intro route
app.get('/', (req, res)=>{
    res.status(200).json({message: "Welcome to the API"});
});
//Get all todos
app.get('/todos', (req, res)=>{
    const list_todos = filter_list(todos);
    res.status(200).json({list: list_todos, total: list_todos.length});
});
//Get active todos
app.get('/todos/active', (req, res)=>{
    const active_todos = active(todos);
    res.status(200).json({list: active_todos, total: active_todos.length});
});
//Get completed todos
app.get('/todos/completed', (req, res)=>{
    const completed_todos = completed(todos);
    res.status(200).json({list: completed_todos, total: completed_todos.length});
});
//Get Todos by unique id
app.get('/todos/:uq_id', (req, res)=>{
    const todo = todos.find(t => t.uq_id === req.params.uq_id);
    if (!todo) {
        return res.status(404).json({message: "Todo not found"});
    }
    res.status(200).json({list: todo});
});
//Create a new todo
app.post('/todos', (req, res)=>{
    const {title, description, status} = req.body;
    if(!title || !description || status === undefined){
        return res.status(400).json({message: "Title, description and status are required"});
    }
    const date = date_get();
    let todo = {id: todos.length + 1, title, description, status, date, uq_id: uq_id(todo, todos)};
    todos.push(todo);
    res.status(201).json({message: "Todo created successfully", todo: todo});
});


app.use((req, res, err)=>{
    console.log(err);
    res.status(500).json({err: err, message: "Internal Server Error"});
});

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server is running on port https://localhost:${PORT}`);
});