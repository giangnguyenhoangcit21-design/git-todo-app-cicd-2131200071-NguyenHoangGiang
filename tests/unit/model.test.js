const { TodoService } = require('../../js/model');

describe('TodoService Unit Tests', () => {
    let service;

    beforeEach(() => {
        // Find and delete the cached module to reset the TodoService/singleton state
        const modulePath = require.resolve('../../js/model');
        delete require.cache[modulePath];
        const NewTodoService = require('../../js/model').TodoService;

        // Create a new service instance for each test to ensure isolation
        service = new NewTodoService();
        // This is a bit of a hack to reset the singleton for testing purposes
        service.todos = [];
        service.observers = []; // Also reset observers
    });

    test('should add a new todo', () => {
        const todoText = 'Buy groceries';
        // TODO: Call the addTodo method with some text.
        service.addTodo(todoText);

        // Then, assert that the service's todos array has a length of 1.
        expect(service.getTodos().length).toBe(1);

        const newTodo = service.getTodos()[0];
        // Assert that the text of the first todo matches the input text.
        expect(newTodo.text).toBe(todoText);
        expect(newTodo.completed).toBe(false);
    });

    test('should toggle the completed state of a todo', () => {
        const todoText = 'Finish coding challenge';
        // TODO: First, add a todo.
        service.addTodo(todoText);
        
        // Then, get its ID and call the toggleTodoComplete method.
        const todoId = service.getTodos()[0].id;

        service.toggleTodoComplete(todoId);
        // Assert that the 'completed' property of that todo is now true.
        expect(service.getTodos().find(t => t.id === todoId).completed).toBe(true);

        // Call toggleTodoComplete again and assert that it's false.
        service.toggleTodoComplete(todoId);
        expect(service.getTodos().find(t => t.id === todoId).completed).toBe(false);
    });

    test('should remove a todo', () => {
        const todoText = 'Go for a run';
        // TODO: Add a todo.
        service.addTodo(todoText);
        expect(service.getTodos().length).toBe(1);

        // Get its ID and call the removeTodo method.
        const todoId = service.getTodos()[0].id;
        service.removeTodo(todoId);

        // Assert that the service's todos array is now empty (length of 0).
        expect(service.getTodos().length).toBe(0);
    });

    test('should not add a todo if text is empty', () => {
        // TODO: Call addTodo with an empty string.
        service.addTodo('');
        service.addTodo(null);
        service.addTodo(undefined);

        // Assert that the todos array still has a length of 0.
        expect(service.getTodos().length).toBe(0);
    });

    test('should notify observers when data changes', () => {
        // Mock an observer object with an update method
        const mockObserver = {
            update: jest.fn()
        };

        // Subscribe the mock observer
        service.addObserver(mockObserver);

        // Test notification on addTodo
        service.addTodo('Notify on add');
        expect(mockObserver.update).toHaveBeenCalledTimes(1);

        // Test notification on toggleTodoComplete
        const todoId = service.getTodos()[0].id;
        service.toggleTodoComplete(todoId);
        expect(mockObserver.update).toHaveBeenCalledTimes(2);

        // Test notification on removeTodo
        service.removeTodo(todoId);
        expect(mockObserver.update).toHaveBeenCalledTimes(3);

        // Verify the last call received the updated, empty list
        expect(mockObserver.update).toHaveBeenLastCalledWith([]);
    });
});