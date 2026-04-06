# 🎧 Lofi Radio for VS Code
A minimalist, distraction-free lofi radio player that lives in your status bar. Stay in the zone without ever leaving your editor.

## ✨ Features
- **🚫 No Ads:** Pure music, zero interruptions.
- **🪶 Lightweight:** Minimal resource usage compared to keeping a browser tab open.
- **🔘 One-Click Control:** Play or pause directly from the VS Code status bar.
- **⌨️ Keyboard Shortcut:** Toggle music with `Ctrl+Alt+L` (`Cmd+Opt+L` on macOS).
- **🛠️ Multi-Engine Support:** Works out of the box if you have `mpv`, `ffplay`, or `vlc` installed.

## 🛠️ How I Made It
This extension was built to solve a personal problem: I wanted a way to listen to lofi beats without the overhead of a web browser or the distraction of YouTube ads.

- **Stack:** Built using pure JavaScript (ES Modules) and the VS Code Extension API.
- **Logic:** It uses a "Player Resolver" system that automatically detects media players already on your system (`mpv`, `ffplay`, or `cvlc`) to stream the audio. 
- **Simplicity:** By leveraging existing system tools, the extension stays incredibly small and doesn't bundle heavy Electron-based players.

## 🚀 Installation & Setup

### Requirements
Ensure you have at least one of these media players installed on your system:
- [mpv](https://mpv.io/) (Recommended)
- [FFmpeg](https://ffmpeg.org/) (for `ffplay`)
- [VLC](https://www.videolan.org/) (for `cvlc`)

### Direct Installation (Quickest Method)
If you already have the `.vsix` file:
1.  Open **VS Code**.
2.  Go to the **Extensions** view (`Cmd+Shift+X` or `Ctrl+Shift+X`).
3.  Click the **...** (More Actions) menu in the top right of the Extensions panel.
4.  Select **Install from VSIX...**.
5.  Choose the `lofi-radio-0.0.1.vsix` file from your downloads.

### Manual Installation (From Source)
Since this is a custom-built tool, you can also build it yourself using the VS Code Extension Manager (`vsce`):

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/lofi-radio-vscode.git
   cd lofi-radio-vscode
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Package the extension:**
   ```bash
   npx vsce package
   ```

4. **Install the generated `.vsix` file:**
   ```bash
   code --install-extension lofi-radio-0.0.1.vsix
   ```

## 🎮 How to Use
- Click the **$(play) Lofi Radio** button in the bottom right of your status bar.
- Use the command palette (`Cmd+Shift+P` or `Ctrl+Shift+P`) and search for **Lofi Radio: Toggle Play/Stop**.

---
Designed by Naveen Kumar with ❤️ for developers who love the flow state.