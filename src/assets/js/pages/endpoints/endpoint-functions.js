"use strict";

const URL = "https://project-ii.ti.howest.be/mars-11";


async function getAllUsers(){
    try {
        const fetchedResponse = await fetch(`${URL}/api/users`);
        return await fetchedResponse.json();
    } catch (e) {
        console.error(e);
    }
    return null;
}

async function getAllIncidents(){
	try {
        const fetchedResponse = await fetch(`${URL}/api/incidents`);
        return await fetchedResponse.json();
    } catch (e) {
        console.error(e);
    }
    return null;
}

async function getAllBystandersFromIncident(incidentId){
    try {
        const fetchedResponse = await fetch(`${URL}/api/incidents/${incidentId}/bystanders`);
        return await fetchedResponse.json();
    } catch (e) {
        console.error(e);
    }
    return null;
}

async function getAllAggressorsFromIncident(incidentId){
    try {
        const fetchedResponse = await fetch(`${URL}/api/incidents/${incidentId}/aggressors`);
        return await fetchedResponse.json();
    } catch (e) {
        console.error(e);
    }
    return null;
}

async function getAllHelpedIncidentsFromUser(userId){
    try {
        const fetchedResponse = await fetch(`${URL}/api/users/${userId}/incidents/helped`);
        return await fetchedResponse.json();
    } catch (e) {
        console.error(e);
    }
    return null;
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
