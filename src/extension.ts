// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {treePath, treeDepth} from './tree';

let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {

	// register a command that is invoked when the status bar
	// item is selected
	const myCommandId = 'sample.showSelectionCount';
	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
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
	subscriptions.push(myStatusBarItem);

	// register some listener that make sure the status bar 
	// item always up-to-date
	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
	subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));

	// update status bar item once at start
	updateStatusBarItem();

	const generateTree = vscode.commands.registerCommand('extension.generateTree', function (uri) {
		// The code you place here will be executed every time your command is executed
		let input = showInputBox(uri.fsPath);
	});

	subscriptions.push(generateTree);

	const disposable = vscode.commands.registerCommand('extension.bulkReplace', function () {
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

	subscriptions.push(disposable);
}

function gettree(dir: string, num_deep: number = -1){
	
	const treeArr = treePath(dir, num_deep);
	const nums = Math.max(...treeArr.map(el=>el.str.length));
	const tree = treeArr.map(el => el.str + ' '.repeat(nums-el.str.length+2)+'\n').join('');
	return tree;
}

async function showInputBox(fsPath: string) {
	const tree_depth = treeDepth(fsPath);
	const result = await vscode.window.showInputBox({
		value: '',
		valueSelection: [2, 4],
		placeHolder: `Input depth, no bigger than ${tree_depth} and no less than -${tree_depth}!`,
		validateInput:text => {
			let condition = Number(text) <= tree_depth && Number(text) >= -tree_depth
			return  condition? null : `Not bigger than ${tree_depth} and not less than -${tree_depth}!`;  // return null if validates
		}
	});
	vscode.window.showInformationMessage(`Got: ${result}, Max: ${tree_depth}`);
	const str = gettree(fsPath, Number(result));
	vscode.env.clipboard.writeText(str);
	vscode.window.showInformationMessage(`Already copied to clipboard~`);
	return result;
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