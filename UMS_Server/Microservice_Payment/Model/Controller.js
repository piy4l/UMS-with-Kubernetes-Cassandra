const SqlHelper = require('./SqlHelper');
const Credentials = require('../Credentials');
const Uuid = require('cassandra-driver').types.Uuid;
const { json } = require('express');





//  creates

const createSmartCard = async function (data){
    try{
        var std = data.student_id;
        var card = data.card_no;
        var balance = data.balance;
        var pin = data.pin;
        var cur = new Date();
        var exp = new Date(cur.getFullYear() + 4, cur.getMonth(), cur.getDate());

        var data = await Credentials.db_client.execute(SqlHelper.getSmartCardForStudent, [std], { prepare: true, hints : ['int'] });
        if(data.rows.length > 0) return {status: "error", message: "Smart card already exists for this student"};

        var data = await Credentials.db_client.execute(SqlHelper.createASmartCard, 
                                                        [std, card, balance, cur, exp, pin], 
                                                        {prepare: true, hints: ['int', 'text', 'float', 'timestamp', 'timestamp', 'text']});
        return {status: "success"};
    }catch(err){
        console.log("Error in createSmartCard function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    }
}

const createSmartCards = async function (data){
    try{
        var cur = new Date();
        var exp = new Date(cur.getFullYear() + 4, cur.getMonth(), cur.getDate());
        var queries = [];

        for(var i=0; i<data.length; i++){
            var std = data[i].student_id;
            var card = data[i].card_no;
            var balance = data[i].balance;
            var pin = data[i].pin;

            var query = { query: SqlHelper.createASmartCardWOC, params: [std, card, balance, cur, exp, pin] };
            queries.push(query);
        }
        var data = await Credentials.db_client.batch(queries, { prepare: true, hints: ['int', 'text', 'float', 'timestamp', 'timestamp', 'text'] });
        return {status: "success"};
    }catch(err){
        console.log("Error in createSmartCards function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    }
}

const createPayment = async function (data){
    try{
        var std = data.student_id;
        var amount = data.amount;
        var due_date = new Date(data.due_date);
        var fine = data.fine;
        var type = data.type;
        var ispaid = false;
        var id = Uuid.random();
        
        var data = await Credentials.db_client.execute(SqlHelper.createAPayment, 
                                                        [std, id, amount, due_date, fine, ispaid, null, type], 
                                                        {prepare: true, hints: ['int', 'uuid', 'float', 'timestamp', 'float', 'boolean', 
                                                                                'payment_transaction', 'text']});
        return {status: "success", data: {id: id}};
    }catch(err){
        console.log("Error in createPayment function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    }
}

const createPayments = async function (data){
    try{
        var queries = [];

        for(var i=0; i<data.length; i++){
            var std = data[i].student_id;
            var amount = data[i].amount;
            var due_date = new Date(data[i].due_date);
            var fine = data[i].fine;
            var type = data[i].type;
            var ispaid = false;
            var id = Uuid.random();

            var query = { query: SqlHelper.createAPaymentWOC, params: [std, id, amount, due_date, fine, ispaid, null, type] };
            queries.push(query);
        }
        var data = await Credentials.db_client.batch(queries, { prepare: true, hints: ['int', 'uuid', 'float', 'timestamp', 'float', 'boolean', 
                                                                                        'payment_transaction', 'text'] });
        return {status: "success"};
    }catch(err){
        console.log("Error in createPayments function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    }
}

const createTransaction = async function (data){
    try{
        //  create transaction
        //  edit payment if needed
        //  edit smartcard
        //  types => cash_in, cash_out, course, library, medical

        var query = [], param = [], hint = [], batch_query = "";

        var std = data.student_id;
        var card_no = data.card_no;
        var amount = data.amount;
        var type = data.type;
        var type_id = data.type_id;
        var trx_id = data.trx_id;

        var mult = -1;
        if(type == "cash_in" || type == "scholarship") mult = 1;

        var transaction_id = Uuid.random();

        if(type == "cash_in" || type == "cash_out") type_id = null;

        var data = await Credentials.db_client.execute(SqlHelper.getSmartCardOne, [std, card_no], { prepare: true, hints : ['int', 'uuid'] });
        if(data.rows.length == 0) return {status: "error", message: "Smart card does not exist"};
        
        var balance = data.rows[0].balance;

        if(mult != 1 && amount > balance) {
            console.log("Error in createTransaction function in controller");
            return {status: "error", message: "Insufficient balance"};
        } 
        else if(type_id != null){
            var data = await Credentials.db_client.execute(SqlHelper.getDuePaymentOne, [std, type_id], { prepare: true, hints : ['int', 'uuid'] });
            if(amount != data.rows[0].amount) {
                console.log("Error in createTransaction function in controller");
                return {status: "error", message: "Invalid transaction data"};
            } 
        }


        query.push(SqlHelper.createATransactionWOC);
        param.push(...[transaction_id, std, card_no, amount, type, type_id, trx_id]);
        hint.push(...['uuid', 'int', 'text', 'float', 'text', 'uuid', 'text']);

        if(type_id != null){
            query.push(SqlHelper.addPaymentTransaction);
            param.push(...[transaction_id, trx_id, card_no, std, type_id]);
            hint.push(...['uuid', 'text', 'text', 'int', 'uuid']);
        }

        query.push(SqlHelper.updateCardBalance);
        param.push(...[balance + mult*amount, std, card_no]);
        hint.push(...['float', 'int', 'text']);

        batch_query = "BEGIN BATCH\n";
        for(var i=0; i<query.length; i++) batch_query += query[i] + ";\n";
        batch_query += "APPLY BATCH;\n";

        var data = await Credentials.db_client.execute(batch_query, 
                                                        param, 
                                                        {prepare: true, hints: hint});
        return {status: "success", data: {id: transaction_id}};
    }catch(err){
        console.log("Error in createTransaction function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    }
}





//  deletes

const deletePayment = async function (data){
    try{
        var std = data.student_id;
        var id = data.id;
        
        var data = await Credentials.db_client.execute(SqlHelper.getStatusOfPayment, [std, id], { prepare: true, hints : ['int', 'uuid'] });
        var status = data.rows[0].ispaid;
        
        if(! status)
            var data = await Credentials.db_client.execute(SqlHelper.deleteFromPayment, [std, id], { prepare: true, hints : ['int', 'uuid'] });
        else return {status: "error", message: "Payment is already paid, cannot delete now"};

        return {status: "success"};
    }catch(err){
        console.log("Error in deletePayment function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}

const deleteSmartCard = async function (data){
    try{
        var std = data.student_id;

        var batch_query = "BEGIN BATCH\n";
        batch_query += SqlHelper.deleteFromTransactionForStudent + ";\n";
        batch_query += SqlHelper.deleteFromPaymentForStudent + ";\n";
        batch_query += SqlHelper.deleteFromSmartCardForStudent + ";\n";
        batch_query += "APPLY BATCH;\n";

        var param = [std, std, std];
        var hint = ['int', 'int', 'int'];
        
        var data = await Credentials.db_client.execute(batch_query, param, { prepare: true, hints : hint });
        return {status: "success"};
    }catch(err){
        console.log("Error in deletePayment function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}




//  updates

const updatePayment = async function (data){
    try{
        var std = data.student_id;
        var id = data.id;
        var amount = data.amount;
        var fine = data.fine;
        var type = data.type;
        var due_date = data.due_date;
        
        var data = await Credentials.db_client.execute(SqlHelper.getDuePaymentOne, [std, id], { prepare: true, hints : ['int', 'uuid'] });
        if(data.rows.length == 0) return {status: "error", message: "Due payment does not exist"};

        var old = data.rows[0];
        var ispaid = old.ispaid;
        if(ispaid) return {status: "error", message: "Payment already done, cannot update now"};

        var data = await Credentials.db_client.execute(SqlHelper.updatePaymentInfo, 
                                                        [amount, fine, type, due_date, std, id], 
                                                        { prepare: true, hints : ['float', 'float', 'text', 'timestamp', 'int', 'uuid'] });
        return {status: "success"};
    }catch(err){
        console.log("Error in deletePayment function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}

const updatePaymentWithType = async function (data, query){
    try{
        var std = data.student_id;
        var id = data.id;
        var n_std = data.new_student_id;
        var tr_id = data.transaction_id;

        var data = await Credentials.db_client.execute(SqlHelper.getDuePaymentOne, [std, id], { prepare: true, hints : ['int', 'uuid'] });
        if(data.rows.length == 0) return {status: "error", message: "Due payment does not exist"};

        var old = data.rows[0];
        var ispaid = old.ispaid;
        if(ispaid) return {status: "error", message: "Payment already done, cannot update now"};

        if(query.type == "student"){
            var batch_query = "BEGIN BATCH\n";
            batch_query += SqlHelper.createAPaymentWOC + ";\n";
            batch_query += SqlHelper.deleteFromPayment + ";\n";
            batch_query += "APPLY BATCH;\n";

            var param = [n_std, id, old.amount, old.due_date, old.fine, old.ispaid, null, old.type];
            param.push(...[std, id]);

            var hint = ['int', 'uuid', 'float', 'timestamp', 'float', 'boolean', 'payment_transaction', 'text'];
            hint.push(...['int', 'uuid']);

            console.log(n_std);
            console.log(batch_query);
            console.log(param);
            console.log(hint);
            var data = await Credentials.db_client.execute(batch_query, param, { prepare: true, hints : hint });
            return {status: "success"};
        }
        else if(query.type == "paid"){
            var data = await Credentials.db_client.execute(SqlHelper.getTransactionOne, [std, tr_id], { prepare: true, hints : ['int', 'uuid'] });
            if(data.rows.length == 0) return {status: "error", message: "Transaction does not exist"};

            var tr = data.rows[0];
            var data = await Credentials.db_client.execute(SqlHelper.addPaymentTransaction, 
                                                            [tr.id, tr.trx_id, tr.card_no, std, id], 
                                                            { prepare: true, hints : [ 'uuid', 'text', 'text', 'text', 'int', 'uuid' ] });
            return {status: "success"};
        }
        else return {status: "error", message: "Invalid type"};
    }catch(err){
        console.log("Error in deletePayment function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}

const updateSmartCard = async function (data){
    try{
        var std = data.student_id;
        var balance = data.balance;
        var expiry = data.expiry;
        var pin = data.pin;
        var card_no = data.card_no;
        
        var data = await Credentials.db_client.execute(SqlHelper.getSmartCardOne, [std, card_no], { prepare: true, hints : ['int', 'text'] });
        if(data.rows.length == 0) return {status: "error", message: "Smart card does not exist"};

        var data = await Credentials.db_client.execute(SqlHelper.updateCardInfo,
                                                         [balance, expiry, pin, std, card_no], 
                                                         { prepare: true, hints : ['float', 'timestamp', 'text', 'int', 'text'] });
        return {status: "success"};
    }catch(err){
        console.log("Error in deletePayment function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}







//  reads

const getTransactionInfo = async function (data){
    try{
        var std = data.student_id;
        var id = data.id;
        
        var query = SqlHelper.getTransactions;
        var param = [std];
        var hint = ['int'];

        if(id != undefined){
            query = SqlHelper.getTransactionOne;
            param = [std, id];
            hint = ['int', 'uuid'];
        }
        var data = await Credentials.db_client.execute(query, param, {prepare: true, hints: hint});

        var ret;
        if(id != undefined) ret = data.rows[0];
        else ret = data.rows;
        return {status: "success", data: ret};
    }catch(err){
        console.log("Error in getDuePaymentInfo function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}

const getDuePaymentInfo = async function (data){
    try{
        var std = data.student_id;
        var id = data.id;
        
        var query = SqlHelper.getDuePayments;
        var param = [std];
        var hint = ['int'];

        if(id != undefined){
            query = SqlHelper.getDuePaymentOne;
            param = [std, id];
            hint = ['int', 'uuid'];
        }
        var data = await Credentials.db_client.execute(query, param, {prepare: true, hints: hint});
        
        var ret;
        if(id != undefined) ret = data.rows[0];
        else ret = data.rows;
        return {status: "success", data: ret};
    }catch(err){
        console.log("Error in getDuePaymentInfo function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}

const getSmartCardInfo = async function (data){
    try{
        var std = data.student_id;
        var card = data.card_no;

        var data;

        if(card == null || card == undefined)
            data = await Credentials.db_client.execute(SqlHelper.getSmartCardForStudent, [std], { prepare: true, hints : ['int'] });
        else 
            data = await Credentials.db_client.execute(SqlHelper.getSmartCardOne, [std, card], { prepare: true, hints : ['int', 'text'] });

        if(data.rows.length == 1) return {status: "success", data: data.rows[0]};
        else if(data.rows.length > 1) return {status: "success", data: data.rows};
        else return {status: "success", data: []};
    }catch(err){
        console.log("Error in getSmartCardInfo function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}

const getList = async function (data){
    try{
        var data = await Credentials.db_client.execute("SELECT * FROM " + data.table, [], { prepare: true });
        return {status: "success", data: data.rows};
    }catch(err){
        console.log("Error in getList function in controller");
        console.log(err);

        return {status: "error", message: err.message};
    } 
}






const test = async function (){
    console.log("Ekhane ashchhe!");
    console.log(SqlHelper.test);

    try{
        var data = await Credentials.db_client.execute(SqlHelper.test, [], {});
        console.log("success khaise");
        console.log(data.rows);

        return data.rows;
    }catch(err){
        console.log("error khaise");
        console.log(err);
        
        return [];
    }
}





module.exports = {
    test,

    createSmartCard,
    createSmartCards,
    createPayment,
    createPayments,
    createTransaction,

    deletePayment,
    deleteSmartCard,

    updatePayment,
    updateSmartCard,
    updatePaymentWithType,

    getSmartCardInfo,
    getDuePaymentInfo,
    getTransactionInfo,
    getList
}

