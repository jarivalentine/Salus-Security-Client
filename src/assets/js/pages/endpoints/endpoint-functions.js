"use strict";

const URL = "https://project-ii.ti.howest.be/mars-11";

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

async function subscribeUser(userId){ //put
    return get(`${URL}/api/users${userId}/subscribe`);
}

async function unsubscribeUser(userId){ //put
    return get(`${URL}/api/users${userId}/unsubscribe`);
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
    }
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
    }
}
