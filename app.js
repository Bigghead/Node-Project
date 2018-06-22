const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/locations', async ( req, res ) => {
    const {  locations, unit } = req.body;

    let units = {
        si: 'km',
        imperial: 'mi'
    }

    if( locations.length === 1 ) res.status(400).json( { Error: 'No Other Locations'})

    let distance = 0;
    let locationObj = []

    locations.forEach( ( loc, i ) => {
        if( locations[i+1]){
            locationObj.push( [ locations[i], locations[i + 1 ] ] )
        } 
    } )


    Promise.all( locationObj.map( loc => {
        return axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${loc[0]}&destination=${loc[1]}&key=AIzaSyD9V-vEzlpmnbizUVPcLsFKoMbiVP_6FBs`)
    })).then( response => {
        const data = response.map( r => r.data );
        data.forEach( d => distance += ( d.routes[0].legs[0].distance.value  * ( 
            unit === 'imperial' ?  0.000621371  : 0.001) ) ) 
        res.status(200).json({ "result": { "distance": distance, "unit": units[unit] } })
    }).catch( e => console.log(e) )
       

})


app.listen( 9000, () => console.log('starting'))