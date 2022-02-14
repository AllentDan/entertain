import * as vscode from "vscode";

export class Util {

    static getWorkspaceConfig(config: string) {
        return vscode.workspace.getConfiguration(config) || "";
    }

}