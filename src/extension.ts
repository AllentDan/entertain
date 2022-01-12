// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

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

	const disposable = vscode.commands.registerCommand('extension.formatTable', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get the word within the selection
			const content = document.getText(selection);
			const replaced = content.replaceAll('<table>','<table class=\'docutils\'>')
			.replaceAll('<td r','<td align="center" r').replaceAll('<td c','<td align="center" c')
			.replaceAll('<td>','<td align="center">').replaceAll('<th r','<th align="center" r')
			.replaceAll('<th c','<th align="center" c').replaceAll('<td align="center">$MM','<td>$MM')
			.replaceAll('<td align="center" rowspan="2">model config file</td>','<td rowspan="2">model config file</td>');
			editor.edit(editBuilder => {
				editBuilder.replace(selection, replaced);
			});
		}
	});

	subscriptions.push(disposable);
}


function replaceAll(string:string, search:string, replace:string) {
  return string.split(search).join(replace);
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