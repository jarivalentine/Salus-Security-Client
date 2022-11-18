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
}

