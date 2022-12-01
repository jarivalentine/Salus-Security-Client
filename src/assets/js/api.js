"use strict";

const URL = "https://project-ii.ti.howest.be/mars-11";
const OPEN_ROUTE_BASE_URL = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=`;

async function getRoute(startlong, startlat, endlong, endlat) {
    const fetched = await fetch("config.json");
    const configJson = await fetched.json();

    try {
        const response = await fetch(`${OPEN_ROUTE_BASE_URL}${configJson.mapsApiKey}&start=${startlong},${startlat}&end=${endlong},${endlat}`);
        const result = await response.json();
        return result.features[0];
    } catch (e) {
        console.error(e);
    }
    return null;
}

async function get(url) {
    try {
        const fetchedResponse = await fetch(`${url}`);
        return await fetchedResponse.json();
    } catch (e) {
        console.error(e);
    }
    return null;
}

async function post(url, options) {
    try {
        const fetchedResponse = await fetch(`${url}`, options);
        return await fetchedResponse.json();
    } catch (e) {
        console.error(e);
    }
    return null;
}

async function getAllUsers() {
    return get(`${URL}/api/users`);
}

async function getOneUser(userId) {
    return get(`${URL}/api/users/${userId}`);
}

async function subscribeUser(userId) {
    const options = createOptions(null, 'PUT');
    return post(`${URL}/api/users/${userId}/subscribe`, options);
}

async function unSubscribeUser(userId) {
    const options = createOptions(null, 'PUT');
    return post(`${URL}/api/users/${userId}/unsubscribe`, options);
}


async function getIncident(incidentId) {
    return get(`${URL}/api/incidents/${incidentId}`);
}

async function getAllIncidents() {
    return get(`${URL}/api/incidents`);
}

async function getAllIncidentsFromUser(userId) {
    return get(`${URL}/api/users/${userId}/incidents`);
}

async function getAllBystandersFromIncident(incidentId) {
    return get(`${URL}/api/incidents/${incidentId}/bystanders`);
}

async function getAllAggressorsFromIncident(incidentId) {
    return get(`${URL}/api/incidents/${incidentId}/aggressors`);
}

async function getAllHelpedIncidentsFromUser(userId) {
    return get(`${URL}/api/users/${userId}/incidents/helped`);
}

function createBody(reporterId, latitude, longitude) {
    return {
        "reporterId": reporterId,
        "latitude": latitude,
        "longitude": longitude
    };
}

async function createIncident(reporterId, latitude, longitude) {
    const options = createOptions(createBody(reporterId, latitude, longitude), 'POST');
    return post(`${URL}/api/incidents`, options);
}

function createOptions(body, method) {
    return {
        method: `${method}`,
        headers: {
            'Content-type': 'application/json;'
        },
        body: JSON.stringify(body)
    };
}

function remove(uri, successHandler = logJson, failureHandler = logError) {
    const request = new Request(api + uri, {
        method: 'DELETE',
    });

    call(request, successHandler, failureHandler);
}

function logJson(response) {
    response.json().then(console.log);
}

function logError(error) {
    console.log(error);
}

function call(request, successHandler, errorHandler) {
    fetch(request).then(successHandler).catch(errorHandler);
}
