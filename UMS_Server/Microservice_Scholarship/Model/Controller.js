const SqlHelper = require('./SqlHelper');
const Credentials = require('../Credentials');
const Uuid = require('cassandra-driver').types.Uuid;
const { json } = require('express');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));


//  STATES: 
//      Applied
//      Advisor
//      Hall
//      Head
//      Accepted/Rejected

const state_type = 6;
const scholarship_state = ['Applied', 'Advisor', 'Hall', 'Head', 'Accepted', 'Rejected'];
const level_term_edit = ['add', 'remove', 'set'];


const postData = async function(link, data){
    var ret = await fetch(link, {
        method: "POST", 
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    });
    return ret.json();
}

const notifyScholarshipUpdate = function(data){
    if(data.state == scholarship_state[1]){
        const link = "http://localhost:5021/scholarship/scholarship_request";
        var res = postData(link, data);
    }
}



//  creates

const createScholarship = async function (data){
    try{
        var amount = data.amount;
        var name = data.name;
        var level_term = data.level_term;
        var cur = new Date();
        var id = Uuid.random();

        if(name == undefined || name == '') return {status: "error", message: "Invalid data!"};
        else if(amount == undefined || amount == 0.0) return {status: "error", message: "Invalid data!"};
        
        var data = await Credentials.db_client.execute(SqlHelper.getScholarship, [name], 
                                                            {prepare: true, hint: ['text']});
        if(data.rows.length > 0) return {status: "error", message: "Scholarship already exists!"};

        var data = await Credentials.db_client.execute(SqlHelper.createScholarship, 
                                                        [id, name, amount, cur, level_term], 
                                                        {prepare: true, hints: ['uuid', 'text', 'float', 'timestamp', 'set<text>']});
        return {status: "success", data: {id: id}};
    }catch(err){
        console.log("Error in createScholarship function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    }
}

const createApplyScholarship = async function (data){
    try{
        //  check if exists
        //  check if level_term match
        //  check if already applied
        //  create applied scholarship
        //  create a state
        //  update current state

        var schol_name = data.scholarship_name;
        var std_id = data.student_id;
        var session_id = data.session_id;
        var level_term = data.level_term;
        var cur = new Date();

        var db_data = await Credentials.db_client.execute(SqlHelper.getScholarship, [schol_name], 
                                                            {prepare: true, hint: ['text']});
        if(db_data.rows.length == 0) return {status: "error", message: "Scholarship does not exist!"};

        var schol = db_data.rows[0];
        var allowed_lts = schol.level_term;
        
        if(allowed_lts != null){
            var okay = false;
            for(var i=0; i<allowed_lts.length; i++){
                if(allowed_lts[i] == level_term){
                    okay = true;
                    break;
                }
            }

            if(! okay) return {status: "error", message: "Scholarship not available for this level-term!"};
        }


        var db_data = await Credentials.db_client.execute(SqlHelper.getAppliedScholarship, [std_id, session_id], 
                                                                {prepare: true, hint: ['int', 'int']});
        if(db_data.rows.length > 0){
            for(var i=0; i<db_data.rows.length; i++)
                if(db_data.rows[i].scholarship_name == schol_name)
                    return {status: "error", message: "Already applied to this scholarship!"};
        }
        
        var query = [], param = [], hint = [], batch_query = "";
        var appl_id = Uuid.random();
        var state_id = Uuid.random();

        query.push(SqlHelper.createApplyScholarship);
        param.push(...[appl_id, session_id, std_id, schol.id, schol.name, schol.amount, cur]);
        hint.push(...['uuid', 'int', 'int', 'uuid', 'text', 'float', 'timestamp']);

        query.push(SqlHelper.createApplyScholarshipByStudent);
        param.push(...[appl_id, session_id, std_id, schol.id, schol.name, schol.amount, cur]);
        hint.push(...['uuid', 'int', 'int', 'uuid', 'text', 'float', 'timestamp']);

        query.push(SqlHelper.createScholarshipState);
        param.push(...['Applied', state_id, appl_id, cur, 'Student']);
        hint.push(...['text', 'uuid', 'uuid', 'timestamp', 'text']);

        query.push(SqlHelper.updateScholarshipState);
        param.push(...[state_id, 'Applied', 'Student', cur, session_id, std_id, appl_id]);
        hint.push(...['uuid', 'text', 'text', 'timestamp', 'int', 'int', 'uuid']);

        query.push(SqlHelper.updateScholarshipStateByStudent);
        param.push(...[state_id, 'Applied', 'Student', cur, session_id, std_id, appl_id]);
        hint.push(...['uuid', 'text', 'text', 'timestamp', 'int', 'int', 'uuid']);
        
        batch_query = "BEGIN BATCH\n";
        for(var i=0; i<query.length; i++) batch_query += query[i] + ";\n";
        batch_query += "APPLY BATCH;\n";

        var data = await Credentials.db_client.execute(batch_query, param, {prepare: true, hints: hint});
        return {status: "success", data: {id: appl_id, state_id: state_id}};
    }catch(err){
        console.log("Error in createApplyScholarship function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    }
}

const updateApplyState = async function (data){
    try{
        //  check if exists
        //  create a state
        //  update current state
        var inp = data;
        var appl_id = data.applied_id;
        var std_id = data.student_id;
        var session_id = data.session_id;

        var state = data.state;
        var updated_by = data.updated_by;
        var cur = new Date();

        if(updated_by == undefined || updated_by == null || updated_by == "") return {status: "error", message: "Invalid data"};

        var okay = false;
        for(var i=0; i<scholarship_state.length; i++){
            if(scholarship_state[i] == state){
                okay = true;
                break;
            }
        }
        if(! okay) return {status: "error", message: "Invalid data"};

        var record;
        var data = await Credentials.db_client.execute(SqlHelper.getAppliedScholarship, [std_id, session_id], { prepare: true, hints : ['int', 'int'] });
        if(data.rows.length == 0) return {status: "error", message: "Applied scholarship does not exist"};

        var found = false;
        for(var i=0; i<data.rows.length; i++){
            if(data.rows[i].id == appl_id){
                found = true;
                record = data.rows[i];
                break;
            }
        }
        if(! found) return {status: "error", message: "Applied scholarship data invalid"};

        if(record.current_state.location == scholarship_state[5]) return {status: "error", message: "Already rejected!"};


        var query = [], param = [], hint = [], batch_query = "";
        var state_id = Uuid.random();

        query.push(SqlHelper.createScholarshipState);
        param.push(...[state, state_id, appl_id, cur, updated_by]);
        hint.push(...['text', 'uuid', 'uuid', 'timestamp', 'text']);

        query.push(SqlHelper.updateScholarshipState);
        param.push(...[state_id, state, updated_by, cur, session_id, std_id, appl_id]);
        hint.push(...['uuid', 'text', 'text', 'timestamp', 'int', 'int', 'uuid']);

        query.push(SqlHelper.updateScholarshipStateByStudent);
        param.push(...[state_id, state, updated_by, cur, session_id, std_id, appl_id]);
        hint.push(...['uuid', 'text', 'text', 'timestamp', 'int', 'int', 'uuid']);

        
        if(state == scholarship_state[4]){            
            const link = "http://localhost:5022/payment/create_payment";
            let data = {student_id: std_id, fine:0, type: 'scholarship', amount: record.amount,
                        due_date: new Date(cur.getFullYear(), cur.getMonth()+2, cur.getDate())};

            var res = await postData(link, data);
            if(res.status != 'success') return {status: "error", message: "Cannot create payment!", result: res};
            else{
                query.push(SqlHelper.createScholarshipPayment);
                param.push(...[appl_id, res.data.id]);
                hint.push(...['uuid', 'uuid']);
            }
        }
        
        batch_query = "BEGIN BATCH\n";
        for(var i=0; i<query.length; i++) batch_query += query[i] + ";\n";
        batch_query += "APPLY BATCH;\n";

        var data = await Credentials.db_client.execute(batch_query, param, {prepare: true, hints: hint});

        notifyScholarshipUpdate(inp);
        return {status: "success", data: {id: appl_id, state_id: state_id}};
    }catch(err){
        console.log("Error in createApplyScholarship function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    }
}







//  updates

const updateScholarship = async function (inp){
    try{
        var name = inp.name;
        var id = inp.id;
        var amount = inp.amount;
        var level_term = inp.level_term;

        var record;
        
        var data = await Credentials.db_client.execute(SqlHelper.getScholarship, [name], { prepare: true, hints : ['text'] });
        if(data.rows.length == 0) return {status: "error", message: "Scholarship does not exist"};

        record = data.rows[0];
        if((id != undefined && id != "") && record.id != id) return {status: "error", message: "Scholarship data invalid"};
        
        var id = record.id;
        var new_level_term = record.level_term;

        if(amount == undefined) amount = record.amount;
        if(level_term != undefined){
            
            if(record.level_term == null && level_term.type == 'add') level_term.type = 'set';

            if(level_term.type == level_term_edit[0]) new_level_term.push(...level_term.data);
            else if(level_term.type == level_term_edit[2]) new_level_term = level_term.data;
            else if(level_term.type == level_term_edit[1] && new_level_term != null) {
                new_level_term = new_level_term.filter( function( el ) {
                    return level_term.data.indexOf( el ) < 0;
                });

            }
        } 

        var data = await Credentials.db_client.execute(SqlHelper.updateScholarship, 
                                                        [amount, new_level_term, name, id], 
                                                        { prepare: true, hints : ['float', 'set<text>', 'text', 'uuid'] });
                                                        
        return {status: "success"};
    }catch(err){
        console.log("Error in updateScholarship function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}

const updateAppliedScholarship = async function (inp){
    try{
        var id = inp.id;
        var session = inp.session;
        var std_id = inp.student_id;
        var amount = inp.amount;

        var record;
        var data = await Credentials.db_client.execute(SqlHelper.getAppliedScholarship, [std_id, session], { prepare: true, hints : ['int', 'int'] });
        if(data.rows.length == 0) return {status: "error", message: "Applied scholarship does not exist"};

        var found = false;
        for(var i=0; i<data.rows.length; i++){
            if(data.rows[i].id == id){
                found = true;
                record = data.rows[i];
                break;
            }
        }
        
        if(! found) return {status: "error", message: "Applied scholarship data invalid"};
        
        if(amount == undefined) return {status: "success"};

        var query = [], param = [], hint = [], batch_query = "";

        query.push(SqlHelper.updateAppliedScholarshipAmount);
        param.push(...[amount, session, std_id, id]);
        hint.push(...['float', 'int', 'int', 'uuid']);

        query.push(SqlHelper.updateAppliedScholarshipByStudentAmount);
        param.push(...[amount, session, std_id, id]);
        hint.push(...['float', 'int', 'int', 'uuid']);

        batch_query = "BEGIN BATCH\n";
        for(var i=0; i<query.length; i++) batch_query += query[i] + ";\n";
        batch_query += "APPLY BATCH;\n";

        var data = await Credentials.db_client.execute(batch_query, 
                                                        param, 
                                                        {prepare: true, hints: hint});                                                        
        return {status: "success"};
    }catch(err){
        console.log("Error in updateScholarship function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}








//  deletes

const deleteScholarship = async function (data){
    try{
        var name = data.name;

        var record;
        
        var data = await Credentials.db_client.execute(SqlHelper.getScholarship, [name], { prepare: true, hints : ['text'] });
        if(data.rows.length == 0) return {status: "error", message: "Scholarship does not exist"};
        
        var data = await Credentials.db_client.execute(SqlHelper.getAllAppliedScholarship, [], { prepare: true, hints : [] });
        record = data.rows;

        var param = [], hint = [];
        var batch_query = "BEGIN BATCH\n";
        for(var i=0; i<record.length; i++){

            var r = record[i];

            batch_query += SqlHelper.deleteFromAppliedScholaship + ";\n";
            batch_query += SqlHelper.deleteFromAppliedScholashipByStudent + ";\n";
            batch_query += SqlHelper.deleteFromScholashipState + ";\n";

            param.push(...[r.session_id, r.student_id, r.id, r.session_id, r.student_id, r.id, r.id]);
            hint.push(...['int', 'int', 'uuid', 'int', 'int', 'uuid', 'uuid']);
        }
        batch_query += SqlHelper.deleteFromScholarship + ";\n";
        param.push(name);
        hint.push('text');
        batch_query += "APPLY BATCH;\n";

        var data = await Credentials.db_client.execute(batch_query, param, { prepare: true, hints : hint });
        return {status: "success"};
    }catch(err){
        console.log("Error in deleteScholarship function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}

const deleteAppliedScholarship = async function (data){
    try{
        var std = data.student_id;
        var session = data.session_id;
        var appl_id = data.applied_id;

        var batch_query = "BEGIN BATCH\n";
        batch_query += SqlHelper.deleteFromAppliedScholaship + ";\n";
        batch_query += SqlHelper.deleteFromAppliedScholashipByStudent + ";\n";
        batch_query += SqlHelper.deleteFromScholashipState + ";\n";
        batch_query += "APPLY BATCH;\n";

        var param = [session, std, appl_id, session, std, appl_id, appl_id];
        var hint = ['int', 'int', 'uuid', 'int', 'int', 'uuid', 'uuid'];
        
        var data = await Credentials.db_client.execute(batch_query, param, { prepare: true, hints : hint });
        return {status: "success"};
    }catch(err){
        console.log("Error in deleteAppliedScholarship function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}









//  reads

const getScholarshipList = async function (inp){
    try{
        var level_term = inp.level_term;
        var ret;

        var data = await Credentials.db_client.execute(SqlHelper.getScholarships, [], { prepare: true });

        if(level_term == undefined) ret = data.rows;
        else {
            ret = []
            for(var i=0; i<data.rows.length; i++){
                var d = data.rows[i];

                if(d.level_term == null){
                    ret.push(d);
                    continue;
                }
                for(var j=0; j<d.level_term.length; j++){
                    if(d.level_term[j] == level_term){
                        ret.push(data.rows[i]);
                        break;
                    }
                }
            }
        }
        
        return {status: "success", data: ret};
    }catch(err){
        console.log("Error in getScholarshipList function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}

const getAScholarship = async function (data){
    try{
        var name = data.name;
        var ret;
        if(name == undefined) name = "";

        var data = await Credentials.db_client.execute(SqlHelper.getScholarship, [name], 
                            {prepare: true, hint: ['text']});
        if(data.rows.length > 0) ret = data.rows[0];
        else ret = {};
                            
        return {status: "success", data: ret};
    }catch(err){
        console.log("Error in getAScholarship function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}

const getAppliedScholarshipList = async function (inp){
    try{
        var session = inp.session;
        var std_id = inp.student_id;
        var name = inp.name;
        var ret;

        if(session != undefined && std_id != undefined){
            var data = await Credentials.db_client.execute(SqlHelper.getAppliedScholarship, [std_id, session], { prepare: true });
            ret = data.rows;
        }
        else if(session != undefined){
            var data = await Credentials.db_client.execute(SqlHelper.getAllAppliedScholarshipBySession, [session], { prepare: true });
            ret = data.rows;

        }
        else if(std_id != undefined){
            var data = await Credentials.db_client.execute(SqlHelper.getAllAppliedScholarshipByStudent, [std_id], { prepare: true });
            ret = data.rows;

        }
        else if(session == undefined && std_id == undefined){
            var data = await Credentials.db_client.execute(SqlHelper.getAllAppliedScholarship, [], { prepare: true });
            ret = data.rows;
        }
        
        if(name != undefined){
            for(var i=0; i<ret.length; i++){
                if(ret[i].scholarship_name != name) {
                    ret.splice(i, 1);
                    i--;
                }
            }
        }

        return {status: "success", data: ret};
    }catch(err){
        console.log("Error in getAppliedScholarshipList function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}

const getPendingScholarshipList = async function (inp){
    try{        
        var state = inp.state;
        var ret = (await getAppliedScholarshipList(inp)).data;
        
        for(var i=0; i<ret.length; i++){
            var st = ret[i].current_state.location;

            // if(state == undefined && ( st == scholarship_state[state_type-1] || st == scholarship_state[state_type-2] )){
            //     ret.splice(i, 1);
            //     i--;
            // }
            // else 
            if(state != undefined && state != st){
                ret.splice(i, 1);
                i--;
            }
        }
        
        return {status: "success", data: ret};
    }catch(err){
        console.log("Error in getAppliedScholarshipList function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}

const getAppliedScholarship = async function (data){
    
    try{
        var std_id = data.student_id;
        var session = data.session;
        var name = data.name;

        var data = await Credentials.db_client.execute(SqlHelper.getAppliedScholarship, [std_id, session], 
            {prepare: true, hint: ['int', 'int']});
        
        var ret = {};
                            
        for(var i=0; i<data.rows.length; i++){
            if(data.rows[i].scholarship_name == name) {
                ret = data.rows[i];
                break;
            }
        }

        if(ret.id == undefined) ret.states = [];
        else{
            var data = await Credentials.db_client.execute(SqlHelper.getScholarshipState, [ret.id], 
                {prepare: true, hint: ['uuid', 'int']});
            ret.states = data.rows;
        }

        if(ret.current_state.location == scholarship_state[state_type-2]){
            var data = await Credentials.db_client.execute(SqlHelper.getScholarshipPayment, [ret.id], 
                {prepare: true, hint: ['uuid']});
            if(data.rows.length > 0) ret.current_state.payment = data.rows[0].payment_id;
        }
                            
        return {status: "success", data: ret};
    }catch(err){
        console.log("Error in getAppliedScholarship function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}

const getScholarshipStateList = async function (inp){
    try{
        var type = inp.type;
        var appl_id = inp.applied_id;
        var ret = [];
        
        if(type == 'all'){
            var data = await Credentials.db_client.execute(SqlHelper.getAllScholarshipState, [], { prepare: true });
            ret = data.rows;
        }
        else if(type == 'single'){
            var data = await Credentials.db_client.execute(SqlHelper.getScholarshipState, [appl_id], { prepare: true });
            ret = data.rows;

            let idx = -1;
            for(var i=0; i<ret.length; i++){
                if(ret[i].location == scholarship_state[state_type-2]){
                    idx = i;
                    break;
                }
            }

            if(idx != -1){
                var data = await Credentials.db_client.execute(SqlHelper.getScholarshipPayment, [ret[0].applied_scholarship_id], 
                    {prepare: true, hint: ['uuid']});
                if(data.rows.length > 0) ret[idx].payment = data.rows[0].payment_id;
            }
        }

        return {status: "success", data: ret};
    }catch(err){
        console.log("Error in getScholarshipStateList function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}

const getScholarshipState = async function (data){
    
    try{
        var appl_id = data.applied_id;
        var id = data.id;

        var data = await Credentials.db_client.execute(SqlHelper.getAScholarshipState, [appl_id, id], 
            {prepare: true, hint: ['uuid', 'uuid']});
        
        var ret = {};
        if(data.rows.length > 0) ret = data.rows[0];

        if(ret.location == scholarship_state[state_type-2]){
            var data = await Credentials.db_client.execute(SqlHelper.getScholarshipPayment, [ret.applied_scholarship_id], 
                {prepare: true, hint: ['uuid']});
            if(data.rows.length > 0) ret.payment = data.rows[0].payment_id;
        }
                            
        return {status: "success", data: ret};
    }catch(err){
        console.log("Error in getScholarshipState function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}





module.exports = {
    createScholarship,
    createApplyScholarship,
    updateApplyState,

    updateScholarship,
    updateAppliedScholarship,

    deleteScholarship,
    deleteAppliedScholarship,
    
    getScholarshipList,
    getAScholarship,
    getAppliedScholarshipList,
    getAppliedScholarship,
    getPendingScholarshipList,
    getScholarshipStateList,
    getScholarshipState
}


