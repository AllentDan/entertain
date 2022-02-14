import * as vscode from "vscode";

export class Util {

    static getWorkspaceConfig(config: string) {
        return vscode.workspace.getConfiguration(config) || "";
    }

}

export function _saveTodo(filePath: string, todos: []) {
    const fs = require('fs');

    // convert JSON object to string
    const data = JSON.stringify(todos);

    // write JSON string to a file
    fs.writeFile(filePath, data, (err: string) => {
        if (err) {
            throw err;
        }
    });
}

export function _loadTodo(filePath: string) {
    const fs = require('fs');

    // read JSON object from file
    fs.readFile(filePath, 'utf-8', (err: string, data: string) => {
        if (err) {
            throw err;
        }

        // parse JSON object
        const todos = JSON.parse(data.toString());
        return todos;
    });
}