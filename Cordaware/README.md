# Cordaware best informed
**A quick note on user interaction**

The XSS payload here requires user interaction (hover). It can be made non-interactive by modifying the column names on the client overview page. This exercise is left for the reader to solve. 

## CVE-2025-0422
`CVE-2025-0422.js` is a PoC for CVE-2025-0422 ('Authenticated Remote Code Execution via ScriptVar'). It is intended to be used along `full_chain.py`.

## CVE-2025-0423
`CVE-2025-0423.py` is a script that simulates a client connecting to a Cordaware server. After connecting, it will inject an XSS payload into the client overview page. Once a user visits this page and hovers over the new/fake client, it will execute.

## Chained
`full_chain.py` combines an unauthenticated XSS (CVE-2025-0423) with a server-side RCE (CVE-2025-0422). The script simulates a fake client, which injects the XSS payload onto the client overview page. Once a user visits this page and hovers over the new/fake client, it will execute. This first stage will then fetch the rest of the payload (`CVE-2025-0422.js`) from the payload server, which is also handled by the script.

Depending on how your Coraware server is reachable, this script must be adjusted/split into two parts. (fake client + payload server). A publicly trusted SSL is probably going to be required.