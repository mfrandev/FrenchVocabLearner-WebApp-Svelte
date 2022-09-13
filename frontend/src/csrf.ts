export const getCSRF = async (fetchNew: Function) => {
    const response = await fetchNew('http://localhost:3001/wow', {
        method: "GET",
        credentials: 'include'
    });
    const json = await response.json();
    return json.csrfToken;
}