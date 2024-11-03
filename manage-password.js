const client = require("client");
const sdk = require("node-appwrite");

const databases = new sdk.Databases(client);

var passwordDatabase;
var passwordCollection;

async function prepareDatabase() {
    try {
        // Check if database already exists
        const existingDatabases = await databases.list();
        passwordDatabase = existingDatabases.databases.find(db => db.name === 'PasswordDB');

        if (!passwordDatabase) {
            // Create new database if not existing
            passwordDatabase = await databases.create(sdk.ID.unique(), 'PasswordDB');
            console.log('Database created: PasswordDB');
        } else {
            console.log('Database already exists: PasswordDB');
        }

        // Check if collection already exists
        const existingCollections = await databases.listCollections(passwordDatabase.$id);
        passwordCollection = existingCollections.collections.find(col => col.name === 'Passwords');

        if (!passwordCollection) {
            // Create new collection if not existing
            passwordCollection = await databases.createCollection(todoDatabase.$id, sdk.ID.unique(), 'Passwords');
            console.log('Collection created: Passwords');
        } else {
            console.log('Collection already exists: Passwords');
        }

        // Check and create attributes only if not already created
        const attributes = await databases.listAttributes(todoDatabase.$id, passwordCollection.$id);
        
        if (Array.isArray(attributes) && !attributes.some(attr => attr.key === 'title')) {
            await databases.createStringAttribute(todoDatabase.$id, passwordCollection.$id, 'title', 255, true);
            console.log('Attribute created: title');
        }
        
        if (Array.isArray(attributes) && !attributes.some(attr => attr.key === 'description')) {
            await databases.createStringAttribute(todoDatabase.$id, passwordCollection.$id, 'description', 255, false, 'This is a test description');
            console.log('Attribute created: description');
        }
        
        if (Array.isArray(attributes) && !attributes.some(attr => attr.key === 'isComplete')) {
            await databases.createBooleanAttribute(todoDatabase.$id, passwordCollection.$id, 'isComplete', true);
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

        await databases.createDocument(todoDatabase.$id, passwordCollection.$id, sdk.ID.unique(), testTodo1);
        await databases.createDocument(todoDatabase.$id, passwordCollection.$id, sdk.ID.unique(), testTodo2);
        await databases.createDocument(todoDatabase.$id, passwordCollection.$id, sdk.ID.unique(), testTodo3);

        console.log('Test todos seeded successfully.');
    } catch (error) {
        console.error("Error seeding database with todos:", error);
    }
}

async function getTodos() {
    try {
        const todos = await databases.listDocuments(todoDatabase.$id, passwordCollection.$id);
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