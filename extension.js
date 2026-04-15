import { window, commands, StatusBarAlignment, workspace } from 'vscode';
import { spawn } from 'node:child_process';
import { platform } from 'node:os';

let myStatusBarItem;
let isPlaying = false;
let currentVolume = 70;
let playerProcess;

const STREAMS = [
  { name: 'Lofi Hip Hop', url: 'https://stream.zeno.fm/f3wvbbqmdg8uv' }
];

let currentStreamIndex = 0;

function hasCommand(command) {
    return new Promise((resolve) => {
        let check;
        
        if (platform() === 'win32') {
            // Windows: use 'where' command
            check = spawn('cmd.exe', ['/c', `where ${command}`], {
                windowsHide: true
            });
        } else {
            // Unix/macOS/Linux: use 'command -v'
            check = spawn('sh', ['-lc', `command -v ${command}`]);
        }
        
        check.on('close', (code) => resolve(code === 0));
        check.on('error', () => resolve(false));
    });
}

async function resolvePlayer() {
    if (await hasCommand('mpv')) {
        return {
            command: 'mpv',
            buildArgs: (url, volume) => [
                '--no-video',
                '--force-window=no',
                '--really-quiet',
                '--idle=no',
                `--volume=${volume}`,
                url
            ]
        };
    }

    if (await hasCommand('ffplay')) {
        return {
            command: 'ffplay',
            buildArgs: (url, volume) => [
                '-nodisp',
                '-autoexit',
                '-loglevel',
                'quiet',
                '-volume',
                String(Math.round((volume / 100) * 100)),
                url
            ]
        };
    }

    if (await hasCommand('cvlc')) {
        return {
            command: 'cvlc',
            buildArgs: (url, volume) => [
                '--intf',
                'dummy',
                '--play-and-exit',
                `--gain=${Math.max(0.01, volume / 100)}`,
                url
            ]
        };
    }

    return undefined;
}

export function activate(context) {
    console.log('Lofi Radio is now active!');

    const config = workspace.getConfiguration('lofiRadio');
    currentVolume = config.get('defaultVolume', 70);

    myStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);
    myStatusBarItem.command = 'lofi-radio.togglePlay';
    myStatusBarItem.text = `$(play) Lofi Radio`;
    myStatusBarItem.tooltip = 'Click to play lofi music';
    myStatusBarItem.show();
    
    context.subscriptions.push(myStatusBarItem);

    let disposable = commands.registerCommand('lofi-radio.togglePlay', async () => {
        if (isPlaying) {
            stopMusic();
        } else {
            await startMusic();
        }
    });

    context.subscriptions.push(disposable);
}

async function startMusic() {
    if (playerProcess) {
        return;
    }

    const player = await resolvePlayer();
    if (!player) {
        window.showErrorMessage('No headless audio player found. Install mpv, ffmpeg (ffplay), or VLC (cvlc).');
        isPlaying = false;
        myStatusBarItem.text = `$(play) Lofi Radio`;
        return;
    }

    isPlaying = true;
    myStatusBarItem.text = `$(debug-pause) Lofi Radio`;

    const currentStream = STREAMS[currentStreamIndex];
    playerProcess = spawn(player.command, player.buildArgs(currentStream.url, currentVolume), {
        stdio: 'ignore'
    });

    playerProcess.on('error', () => {
        isPlaying = false;
        playerProcess = undefined;
        myStatusBarItem.text = `$(play) Lofi Radio`;
        window.showErrorMessage('Unable to start audio player process.');
    });

    playerProcess.on('close', () => {
        playerProcess = undefined;
        if (isPlaying) {
            isPlaying = false;
            myStatusBarItem.text = `$(play) Lofi Radio`;
        }
    });
}

function stopMusic() {
    isPlaying = false;
    myStatusBarItem.text = `$(play) Lofi Radio`;

    if (playerProcess && !playerProcess.killed) {
        if (platform() === 'win32') {
            // Windows: use SIGTERM (0) or process termination
            playerProcess.kill();
        } else {
            // Unix/macOS/Linux: use SIGTERM
            playerProcess.kill('SIGTERM');
        }
    }

    playerProcess = undefined;
}

export function deactivate() {
    if (playerProcess && !playerProcess.killed) {
        if (platform() === 'win32') {
            playerProcess.kill();
        } else {
            playerProcess.kill('SIGTERM');
        }
    }
}
