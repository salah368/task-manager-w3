const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, 'tasks.json');
const args = process.argv.slice(2);
const command = args[0];
const taskTitle = args[1];

function readTasks() {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveTasks(tasks) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

if(command === 'add') {
    if(!taskTitle) {
       console.log('Please provide a task title.');
       process.exit(1); 
    }

    const tasks = readTasks();

    const newTask = {
        id: tasks.length + 1,
        title: taskTitle
    };

    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Added task: "${taskTitle}"`);
} else if (command === 'list') {
    const tasks = readTasks();

    if(tasks.length === 0) {
        console.log('No tasks found.');
    } else {
        tasks.forEach(task => {
            console.log(`${task.id}. ${task.title}`);
        });
    }
} else {
    console.log('Unknown command. Use "add" or "list".')
}
