// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Register the exec command
	const execCommand = vscode.commands.registerCommand('exec-terminal-command.exec', async () => {
		// Get configured commands from settings
		const config = vscode.workspace.getConfiguration('terminalCommands');
		const commands = config.get<string[]>('commands') || [];

		// Show quick pick with configured commands
		interface QuickPickItem { label: string; command: string };
		const quickPick = vscode.window.createQuickPick<QuickPickItem>();
		quickPick.items = commands.map(cmd => ({ label: cmd, command: cmd }));
		quickPick.placeholder = commands.length === 0 ? 'Type a command to execute' : 'Select or type a command to execute';
		quickPick.ignoreFocusOut = true;

		quickPick.onDidAccept(() => {
			const command = quickPick.value || (quickPick.selectedItems[0] as QuickPickItem)?.command;
			if (command) {
				executeInTerminal(command);
			}
			quickPick.dispose();
		});

		quickPick.show();
	});

	function executeInTerminal(command: string) {
		const terminal = vscode.window.createTerminal({
			name: command,
			location: vscode.TerminalLocation.Editor
		});
		
		terminal.show();
		terminal.sendText(command);
	}

	context.subscriptions.push(execCommand);
}