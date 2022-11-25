"use strict";

const URL = "https://project-ii.ti.howest.be/mars-11";
const API_KEY = "5b3ce3597851110001cf6248904fbdec39724aebbac4826fabeb415a";
const OPEN_ROUTE_BASE_URL = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}`;

async function getRoute(startlong, startlat, endlong, endlat) {
    try {
        const response = await fetch(`${OPEN_ROUTE_BASE_URL}&start=${startlong},${startlat}&end=${endlong},${endlat}`);
        const result = await response.json();
        return result.features[0];
    } catch (e) {
        console.error(e);
    }
    return null;
}

async function get(url){
    try {
        const fetchedResponse = await fetch(`${url}`);
        return await fetchedResponse.json();
    } catch (e) {
        console.error(e);
    }
    return null;
}

async function getAllUsers(){
    return get(`${URL}/api/users`);
}

async function getIncident(incidentId){
    return get(`${URL}/api/incidents/${incidentId}`);
}

async function getAllIncidents(){
    return get(`${URL}/api/incidents`);
}

async function getAllIncidentsFromUser(userId){
    return get(`${URL}/api/users/${userId}/incidents`);
}

async function getAllBystandersFromIncident(incidentId){
    return get(`${URL}/api/incidents/${incidentId}/bystanders`);
}

async function getAllAggressorsFromIncident(incidentId){
    return get(`${URL}/api/incidents/${incidentId}/aggressors`);
}

async function getAllHelpedIncidentsFromUser(userId){
    return get(`${URL}/api/users/${userId}/incidents/helped`);
}

function createBody(reporterId, latitude, longitude) {
    return {
        "reporterId": reporterId,
        "latitude": latitude,
        "longitude": longitude
    };
}

async function createIncident(reporterId, latitude, longitude){
    const options = createOptionsPost(createBody(reporterId, latitude, longitude));
    try {
        const fetchedResponse = await fetch(`${URL}/api/incidents`, options);
        return await fetchedResponse.json();
    } catch (e) {
        console.error(e);
    }
    return null;
}

function createOptionsPost(body){
    return {
        method: 'POST',
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
