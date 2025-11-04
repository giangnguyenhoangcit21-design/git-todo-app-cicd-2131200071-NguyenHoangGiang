const { TodoService } = require('../../js/model');
const { Controller } = require('../../js/controller');

// Mock the View because we are not testing the UI, only Controller-Model interaction.
const mockView = {
    update: jest.fn(),
    bindAddTodo: jest.fn(),
    bindToggleTodo: jest.fn(),
    bindRemoveTodo: jest.fn(),
};

describe('Controller-Service Integration Tests', () => {
    let service;
    let controller;

    beforeEach(() => {
        service = new TodoService();
        service.todos = []; // Reset singleton for tests
        controller = new Controller(service, mockView);
    });

    test('handleAddTodo should call service.addTodo and update the model', () => {
        const testText = 'Buy groceries';

        // TODO: Call the controller's handleAddTodo method with some test text.
        controller.handleAddTodo(testText);

        // Then, get the list of todos directly from the service.
        const todos = service.getTodos();

        // Assert that the service's todos array has a length of 1.
        expect(todos.length).toBe(1);

        // Assert that the text of the first todo in the service matches the input.
        expect(todos[0].text).toBe(testText);
    });

    test('handleRemoveTodo should call service.removeTodo and update the model', () => {
        const testText = 'Task to be removed';

        // TODO: First, directly add a todo to the service.
        service.addTodo(testText);
        
        // Get the ID of the new todo.
        const todoId = service.getTodos()[0].id;
        
        // Assert initial state
        expect(service.getTodos().length).toBe(1);

        // Call the controller's handleRemoveTodo method with that ID.
        controller.handleRemoveTodo(todoId);

        // Assert that the service's todos array is now empty.
        expect(service.getTodos().length).toBe(0);
    });

    // Thêm test cho handleToggleTodo để hoàn thiện
    test('handleToggleTodo should call service.toggleTodoComplete and update the model', () => {
        const testText = 'Task to be toggled';
        
        // Add a todo
        service.addTodo(testText);
        const todo = service.getTodos()[0];
        const todoId = todo.id;
        
        // Assert initial state: should be false
        expect(todo.completed).toBe(false);

        // Toggle the todo (false -> true)
        controller.handleToggleTodo(todoId);
        expect(todo.completed).toBe(true);
        
        // Toggle again (true -> false)
        controller.handleToggleTodo(todoId);
        expect(todo.completed).toBe(false);
    });
});