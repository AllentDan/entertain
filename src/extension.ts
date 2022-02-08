// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {treePath} from './tree';
import { SidebarProvider } from "./SidebarProvider";

let myStatusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {

	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("entertain-sidebar", sidebarProvider)
	);
	vscode.commands.executeCommand("workbench.view.extension.entertain-view");
	// register a command that is invoked when the status bar
	// item is selected
	const myCommandId = 'sample.showSelectionCount';
	context.subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
		let day = updateStatusBarItem();
		if (day == 'Workday'){
			vscode.window.showInformationMessage(`快去搬砖`);
		}else{
			vscode.window.showInformationMessage(`抵制内卷`);
		}
	}));

	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = myCommandId;
	context.subscriptions.push(myStatusBarItem);

	// register some listener that make sure the status bar 
	// item always up-to-date
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));

	// update status bar item once at start
	updateStatusBarItem();

	const generateTree = vscode.commands.registerCommand('entertain.generateTree', function (uri) {
		// The code you place here will be executed every time your command is executed
		let input = showInputBox(uri.fsPath);
	});

	context.subscriptions.push(generateTree);

	const disposable = vscode.commands.registerCommand('entertain.bulkReplace', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get the word within the selection
			let content = document.getText(selection);
			const bulkReplaceConfig = vscode.workspace.getConfiguration('entertain.bulkReplace');
			let num = 0;
			for (let key in bulkReplaceConfig) {
				// skip the function item like update
				if (num <4){
					num = num+1;
					continue;
				}
				let value = bulkReplaceConfig[key];
				content = content.replaceAll(key, value);
			}editor.edit(editBuilder => {
				editBuilder.replace(selection, content);
			});
		}
	});

	context.subscriptions.push(disposable);
}

function gettree(dir: string, num_deep: number = 9999, num_width: number = 9999){
	
	const treeArr = treePath(dir, num_deep, num_width);
	const nums = Math.max(...treeArr.map(el=>el.str.length));
	const tree = treeArr.map(el => el.str + ' '.repeat(nums-el.str.length+2)+'\n').join('');
	return tree;
}

function showInputBox(fsPath: string) {
	const generateTreeConfig = vscode.workspace.getConfiguration('entertain.generateTree');
	const num_width =  generateTreeConfig['num_width']
	const num_depth = generateTreeConfig['num_depth']
	const str = gettree(fsPath, Number(num_depth), Number(num_width));
	vscode.env.clipboard.writeText(str);
	vscode.window.showInformationMessage(`Already copied to clipboard~`);
	return;
}


function between(x:number, min:number, max:number) {
  return x >= min && x <= max;
}

function updateStatusBarItem(): string {
	let dateTime = new Date()
	let day = dateTime.getDay() <6 ? "Workday" : "Weekend";
	let hi = "Evening";
	if (between(dateTime.getHours(), 6, 12)){
		hi = "Morning";
	}
	else if (between(dateTime.getHours(), 12, 18)){
		hi = "Afternoon";
	}

	if (day == "Workday"){
		myStatusBarItem.text = `Good ${hi}, 打工人!!`;
	}else{
		myStatusBarItem.text = `Good ${hi}!!`;
	}
	myStatusBarItem.show();
	return day;
}


// this method is called when your extension is deactivated
export function deactivate() {}