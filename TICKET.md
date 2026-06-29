# Ticket: Add Priority Flag and Completed Tasks View

## Client Request
"I love the task manager, but I have two urgent needs. First, I need an
--priority flag on all tasks (High, Medium, Low). Second, I can't find
my completed tasks anymore — I need a way to see them."

## Requirements
1. Add a `priority` field to tasks (High, Medium, Low)
2. Add a way to view only completed tasks

## Plan
- Database: add `priority` column to Task model
- API: accept priority on task creation, add filter endpoint for completed tasks
- Frontend: priority selector when adding a task, toggle to show completed tasks