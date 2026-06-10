//Fake database
let todos = [
    {title: "Todo 1", description: "This is the first todo", todo_status: true, date: {day: "01", month: "Jan"}, uq_id: "01Jan001"},
    {title: "Todo 2", description: "This is the second todo", todo_status: false, date: {day: "02", month: "Feb"}, uq_id: "02Feb001"},
    {title: "Todo 3", description: "This is the third todo", todo_status: true, date: {day: "05", month: "Jun"}, uq_id: "05Jun002"}
];

module.exports = {
    todos
}
