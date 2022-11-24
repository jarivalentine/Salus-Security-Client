"use strict";

const URL = "https://project-ii.ti.howest.be/mars-11";

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
