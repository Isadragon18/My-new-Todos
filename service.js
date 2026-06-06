function filter_list(todos){
    let filtered_todos = todos.map(({title, description, status}) => ({ title, description, status}));
    filtered_todos = filtered_todos.map((t) => ({id: filtered_todos.indexOf(t) + 1, ...t}));
    return filtered_todos;
}

function active(todos){
    return todos.filter(t => !t.status);
}

function completed(todos){
    return todos.filter(t => t.status);
}

function date_get(){
    const date = new Date();
    return {day: date.getDate().toString().padStart(2, '0'), month: date.toLocaleString('default', { month: 'short' }).slice(0,3)};
}

function uq_id(todo, todos){
    let uq_id = "";
    const cur_date = new Date();
    const list_todo = todos.filter(t => t.date.month === todo.date.month && t.date.day === todo.date.day);
    if(list_todo.length === 0){ return uq_id = todo.date.day + todo.date.month + "001"; };
    const first_id = list_todo.find(t => t.uq_id.slice(-3) === "001");
    if(!first_id){ return uq_id = todo.date.day + todo.date.month + "001"; }
    const last_todo = list_todo[list_todo.length - 1];
    const last_id = parseInt(last_todo.uq_id.slice(-3));
    const new_id = (last_id + 1).toString().padStart(3, '0');
    todo.uq_id = todo.date.day + todo.date.month + new_id;
    return uq_id;
}


module.exports = {
    filter_list,
    active,
    completed,
    uq_id,
    date_get
}