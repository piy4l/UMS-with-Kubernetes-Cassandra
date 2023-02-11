
const cassandra = require('cassandra-driver');
const db_client = new cassandra.Client({ 
    contactPoints: ['127.0.0.1'], 
    localDataCenter: 'datacenter1', 
    keyspace: 'ums'
});



module.exports = {
    db_client
}




