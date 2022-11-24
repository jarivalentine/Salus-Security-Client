"use strict";

const URL = "https://project-ii.ti.howest.be/mars-11";

const API_KEY = "5b3ce3597851110001cf6248904fbdec39724aebbac4826fabeb415a";
const OPENROUTEBASEURL = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}`;

const users = ['1989-01-28_AL',
                '1992-02-04_SH',
                '1997-04-18_CB',
                '1997-04-18_CB2',
                '2003-06-30_CM',
                '2004-08-01_BB',
                '2000-08-12_DJ',
                '2000-10-31_LS',
                '1976-11-09_MA',
                '1978-12-22_JVD'];

async function getRoute(startlong, startlat, endlong, endlat) {
    try {
        const response = await fetch(`${OPENROUTEBASEURL}&start=${startlong},${startlat}&end=${endlong},${endlat}`);
        const result = await response.json();
        return result.features[0];
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

async function getIncidents(id) {
    try {
        const fetchedResponse = await fetch(`${URL}/api/incidents/${id}`);
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

async function getAllHelpedIncidentsFromUser(userId){
    try {
        const fetchedResponse = await fetch(`${URL}/api/users/${userId}/incidents/helped`);
        return await fetchedResponse.json();
    } catch (e) {
        console.error(e);
    }
    return null;
}

function get(uri, successHandler = logJson, failureHandler = logError) {
    const request = new Request(api + uri, {
        method: 'GET',
    });

    call(request, successHandler, failureHandler);
}

function post(uri, body, successHandler = logJson, failureHandler = logError) {
    const request = new Request(api + uri, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json;'
        },
        body: JSON.stringify(body)
    });

    call(request, successHandler, failureHandler);
}

function put(uri, body, successHandler = logJson, failureHandler = logError) {
    const request = new Request(api + uri, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json;'
        },
        body: JSON.stringify(body)
    });

    call(request, successHandler, failureHandler);
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
