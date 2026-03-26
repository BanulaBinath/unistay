import re

path_js = r'c:\Users\home\Desktop\unistay\frontend\src\Components\admin\PaymentsManagement.js'
path_css = r'c:\Users\home\Desktop\unistay\frontend\src\Components\admin\PaymentsManagement.css'
tool_output_path = r'c:\Users\home\AppData\Roaming\Code\User\workspaceStorage\2f727d25876044dd948c87ab4a529bcd\GitHub.copilot-chat\chat-session-resources\d9931a6d-55a8-4926-9ee7-b1caa96dc05e\call_MHxHOUlickhRVzJMOWh2TEtzRG4__vscode-1774461764145\content.txt'

with open(tool_output_path, 'r', encoding='utf-8') as f:
    text = f.read()

js_match = re.search(r'```(?:javascript|js)\n(.*?)```', text, re.DOTALL)
if js_match:
    with open(path_js, 'w', encoding='utf-8') as f:
        f.write(js_match.group(1))

css_match = re.search(r'```css\n(.*?)```', text, re.DOTALL)
if css_match:
    # the agent suggested appending the CSS rules to the existing file
    with open(path_css, 'a', encoding='utf-8') as f:
        f.write('\n\n' + css_match.group(1))

print("Applied Cards Logic")
