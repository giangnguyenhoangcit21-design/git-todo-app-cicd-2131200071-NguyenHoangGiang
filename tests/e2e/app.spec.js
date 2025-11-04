const { test, expect, _electron: electron } = require('@playwright/test');

test('End-to-end user workflow', async () => {
    // Launch the Electron app (assuming the app's index file is in the root directory)
    const electronApp = await electron.launch({ args: ['.'] });
    const window = await electronApp.firstWindow();

    // Wait for the application to be fully loaded
    await window.waitForLoadState('domcontentloaded');

    const taskText = 'My new E2E test task';
    
    // Common locator for the newly added Todo item
    const todoItemLocator = window.locator('.todo-item', { hasText: taskText });


    // --- Task 1: Add a new todo item ---
    // 1. Find the input field
    await window.locator('#todo-input').fill(taskText);
    
    // 2. Find and click the "Add" button
    await window.locator('#add-todo-btn').click();
    
    
    // --- Task 2: Verify the todo item was added ---
    // 1. Locate the new todo item in the list and wait for it to be visible.
    await expect(todoItemLocator).toBeVisible();

    // 2. Assert that the text content contains the `taskText`.
    // Also assert that there is only one item in the list.
    const todoListItems = window.locator('#todo-list .todo-item');
    await expect(todoListItems).toHaveCount(1);
    

    // --- Task 3: Mark the todo item as complete ---
    // 1. Find the checkbox within the todo item
    const checkboxLocator = todoItemLocator.locator('input[type="checkbox"]');

    // 2. Click the checkbox
    await checkboxLocator.check();
    
    // 3. Assert that the todo item now has the 'completed' class
    await expect(todoItemLocator).toHaveClass(/completed/);
    

    // --- Task 4: Delete the todo item ---
    // 1. Find the delete button within the todo item
    const deleteButtonLocator = todoItemLocator.locator('.delete-btn');
    
    // 2. Click the delete button
    await deleteButtonLocator.click();

    // 3. Assert that the todo item is no longer visible on the page.
    await expect(todoItemLocator).toBeHidden();


    // Close the app
    await electronApp.close();
});
