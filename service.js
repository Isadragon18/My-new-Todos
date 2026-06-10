//Function to filter the list of todos and return only the title, description and status of each todo
function filter_list(todos){
    let filtered_todos = todos.map(({title, description, todo_status}) => ({ title, description, status: todo_status}));
    filtered_todos = filtered_todos.map((t) => ({id: filtered_todos.indexOf(t) + 1, ...t}));
    return filtered_todos;
}
//Function to filter the list of todos and return only the active todos
function active(todos){
    let active_todos = todos.filter(t => !t.todo_status);
    active_todos = active_todos.map((t) => ({id: active_todos.indexOf(t) + 1, ...t}));
    return active_todos;
}
//Function to filter the list of todos and return only the completed todos
function completed(todos){
    let completed_todos = todos.filter(t => t.todo_status);
    completed_todos = completed_todos.map((t) => ({id: completed_todos.indexOf(t) + 1, ...t}));
    return completed_todos;
}
//Function to get the current date in the format of day and month
function date_get(){
    const date = new Date();
    return {day: date.getDate().toString().padStart(2, '0'), month: date.toLocaleString('default', { month: 'short' }).slice(0,3)};
}
//Function to generate a unique id for each todo based on the date and the number of todos created on that date
function uq_id(todo, todos){
    let uq_id = "";
    //const cur_date = new Date();
    const list_todo = todos.filter(t => t.date.month === todo.date.month && t.date.day === todo.date.day);
    if(list_todo.length === 0){ return uq_id = todo.date.day + todo.date.month + "001"; };
    const first_id = list_todo.find(t => t.uq_id.slice(-3) === "001");
    if(!first_id){ return uq_id = todo.date.day + todo.date.month + "001"; }
    const last_todo = list_todo[list_todo.length - 1];
    const last_id = parseInt(last_todo.uq_id.slice(-3));
    const new_id = (last_id + 1).toString().padStart(3, '0');
    uq_id = todo.date.day + todo.date.month + new_id;
    return uq_id;
}
//Function to filter the list of todos and return only the todos created in a particular month
function view_todos_month(todos, month){
    let month_todos = todos.filter(t => t.date.month.toLowerCase() === month.toLowerCase().slice(0,3));
    month_todos = month_todos.map((t) => ({id: month_todos.indexOf(t) + 1, ...t}));
    return month_todos;
}
//Function to sort the database to the right order
function databaseOrder(todos){
    let filtered_todos = todos.map(({uq_id, title, description, date, todo_status}) => ({ uq_id, title, description, date, status: todo_status}));
    filtered_todos = filtered_todos.map((t) => ({id: filtered_todos.indexOf(t) + 1, ...t}));
    return filtered_todos;
}

module.exports = {
    filter_list,
    active,
    completed,
    date_get,
    uq_id,
    view_todos_month,
    databaseOrder
}