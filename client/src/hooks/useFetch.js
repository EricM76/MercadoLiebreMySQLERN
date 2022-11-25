const baseURL = process.env.REACT_APP_API_URL_BASE;

export const useFetchWithoutToken = async (endpoint, method = "GET", data) => {
    const url = `${baseURL}/${endpoint}`;
    let response;

    if (method === "GET") {
        response = await fetch(url, {
            method,
        });
    }

    if (method === "POST") {
        response = await fetch(url, {
            method,
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json",
            },
        });
    }

    let result = await response.json();

    return result;
};


export const useFetchWithToken = async (endpoint, method = "GET", token, data) => {
    const url = `${baseURL}/${endpoint}`;
    let response;

    if (method === "GET") {
        response = await fetch(url, {
            method,
            headers : {
                Authorization : token
            }
        });
    }

    if (method === "POST") {
        response = await fetch(url, {
            method,
            body: data ? JSON.stringify(data) : null,
            headers: {
                "Content-type": "application/json",
                Authorization : token
            },
        });
    }

    let result = await response.json();

    return result;
};