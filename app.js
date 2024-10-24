const sdk = require("node-appwrite");

const client = new sdk.Client();

client
    .setEndpoint("https://cloud.appwrite.io/v1") // Ensure this is the correct endpoint
    .setProject("your_project_id") // Replace with your Project ID
    .setKey("your_api_key"); // Replace with your API Key

const databases = new sdk.Databases(client);

var todoDatabase;
var todoCollection;

async function prepareDatabase() {
    try {
        // Check if database already exists
        const existingDatabases = await databases.list();
        todoDatabase = existingDatabases.databases.find(db => db.name === 'TodosDB');
        
        if (!todoDatabase) {
            // Create new database if not existing
            todoDatabase = await databases.create(sdk.ID.unique(), 'TodosDB');
            console.log('Database created: TodosDB');
        } else {
            console.log('Database already exists: TodosDB');
        }

        // Check if collection already exists
        const existingCollections = await databases.listCollections(todoDatabase.$id);
        todoCollection = existingCollections.collections.find(col => col.name === 'Todos');
        
        if (!todoCollection) {
            // Create new collection if not existing
            todoCollection = await databases.createCollection(todoDatabase.$id, sdk.ID.unique(), 'Todos');
            console.log('Collection created: Todos');
        } else {
            console.log('Collection already exists: Todos');
        }

        // Check and create attributes only if not already created
        const attributes = await databases.listAttributes(todoDatabase.$id, todoCollection.$id);
        
        if (!attributes.some(attr => attr.key === 'title')) {
            await databases.createStringAttribute(todoDatabase.$id, todoCollection.$id, 'title', 255, true);
            console.log('Attribute created: title');
        }
        
        if (!attributes.some(attr => attr.key === 'description')) {
            await databases.createStringAttribute(todoDatabase.$id, todoCollection.$id, 'description', 255, false, 'This is a test description');
            console.log('Attribute created: description');
        }
        
        if (!attributes.some(attr => attr.key === 'isComplete')) {
            await databases.createBooleanAttribute(todoDatabase.$id, todoCollection.$id, 'isComplete', true);
            console.log('Attribute created: isComplete');
        }

    } catch (error) {
        console.error("Error preparing database or attributes:", error);
    }
}

async function seedDatabase() {
    try {
        const testTodo1 = {
            title: 'Buy apples',
            description: 'At least 2KGs',
            isComplete: true
        };

        const testTodo2 = {
            title: 'Wash the apples',
            isComplete: true
        };

        const testTodo3 = {
            title: 'Cut the apples',
            description: 'Don\'t forget to pack them in a box',
            isComplete: false
        };

        await databases.createDocument(todoDatabase.$id, todoCollection.$id, sdk.ID.unique(), testTodo1);
        await databases.createDocument(todoDatabase.$id, todoCollection.$id, sdk.ID.unique(), testTodo2);
        await databases.createDocument(todoDatabase.$id, todoCollection.$id, sdk.ID.unique(), testTodo3);
        
        console.log('Test todos seeded successfully.');
    } catch (error) {
        console.error("Error seeding database with todos:", error);
    }
}

async function getTodos() {
    try {
        const todos = await databases.listDocuments(todoDatabase.$id, todoCollection.$id);
        todos.documents.forEach(todo => {
            console.log(`Title: ${todo.title}\nDescription: ${todo.description}\nIs Todo Complete: ${todo.isComplete}\n\n`);
        });
    } catch (error) {
        console.error("Error fetching todos:", error);
    }
}

async function runAllTasks() {
    await prepareDatabase();
    await seedDatabase();
    await getTodos();
}

runAllTasks();
