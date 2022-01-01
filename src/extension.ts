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
