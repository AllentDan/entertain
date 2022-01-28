# Entertain Sample

This is a plugin for entertainment.

## VS Code API
- extension.bulkReplace

Set the content and targets of bulk replacement in settings.json. Here is an example for formatting htmls from [tables generator](https://www.tablesgenerator.com/) to sphinx style:
```
  "entertain.bulkReplace": {
    "<table>": "<table class=\"docutils\">",
	"<td r": "<td align=\"center\" r",
    "<td c": "<td align=\"center\" c",
	"<td>": "<td align=\"center\">",
    "<th r": "<th align=\"center\" r",
	"<th c": "<th align=\"center\" c",
    "<td align=\"center\">$MM": "<td>$MM",
	"<td align=\"center\" rowspan=\"2\">model config file</td>": "<td rowspan=\"2\">model config file</td>",
	"<td align=\"center\" rowspan=\"3\">model config file</td>": "<td rowspan=\"3\">model config file</td>"
  },
```

## How to customize a plugin

First, install node.js.
```
# Using Ubuntu
curl -fsSL https://deb.nodesource.com/setup_17.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -fsSL https://deb.nodesource.com/setup_17.x | bash -
apt-get install -y nodejs
```

Second, `npm install -g yo generator-code`.

Third, yo code.

Firth, install vsce: `npm i vsce -g`.

Fifth, run `vsce package`.

Finally, publish it to [marketplace](https://marketplace.visualstudio.com/).
