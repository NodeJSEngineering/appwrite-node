const sdk = require("node-appwrite");

const client = new sdk.Client();

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("project id")
    .setKey("your key");

    const databases = new sdk.Databases(client);

var todoDatabase;
var todoCollection;

async function prepareDatabase() {
    todoDatabase = await databases.create(
        sdk.ID.unique(),
        'TodosDB'
    );

    todoCollection = await databases.createCollection(
        todoDatabase.$id,
        sdk.ID.unique(),
        'Todos'
    );

    await databases.createStringAttribute(
        todoDatabase.$id,
        todoCollection.$id,
        'title',
        255,
        true
    );

    await databases.createStringAttribute(
        todoDatabase.$id,
        todoCollection.$id,
        'description',
        255, false,
        'This is a test description'
    );
    await databases.createBooleanAttribute(
        todoDatabase.$id,
        todoCollection.$id,
        'isComplete',
        true
    );
}

async function seedDatabase() {
    var testTodo1 = {
        title: 'Buy apples',
        description: 'At least 2KGs',
        isComplete: true
    };

    var testTodo2 = {
        title: 'Wash the apples',
        isComplete: true
    };

    var testTodo3 = {
        title: 'Cut the apples',
        description: 'Don\'t forget to pack them in a box',
        isComplete: false
    };

    await databases.createDocument(
        todoDatabase.$id,
        todoCollection.$id,
        sdk.ID.unique(),
        testTodo1
    );
    await databases.createDocument(
        todoDatabase.$id,
        todoCollection.$id,
        sdk.ID.unique(),
        testTodo2
    );
    await databases.createDocument(
        todoDatabase.$id,
        todoCollection.$id,
        sdk.ID.unique(),
        testTodo3
    );
}

async function getTodos() {
    var todos = await databases.listDocuments(
        todoDatabase.$id,
        todoCollection.$id
    );

    todos.documents.forEach(todo => {
        console.log(`Title: ${todo.title}\nDescription: ${todo.description}\nIs Todo Complete: ${todo.isComplete}\n\n`);
    });
}

async function runAllTasks() {
    await prepareDatabase();
    await seedDatabase();
    await getTodos();
}
runAllTasks();
