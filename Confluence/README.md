# Confluence
## PAK to Comment XSS Payload
Create a personal access token and exfiltrate it by posting it as a comment on a page, essentially creating a backdoor into an account.

## User to Admin XSS Payload
Escalate privileges by adding a user to the "confluence-administrators" group.

## RCE via Plugin Upload XSS Payload
Get RCE by uploading a malicious plugin. You will need to host the malicious plugin on a web server reachable by the Confluence server. It is also possible to send the plugin via the POST body. However, this is not covered in this payload.