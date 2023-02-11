
module.exports = {
    test : "SELECT * FROM test",

    createASmartCard: "INSERT INTO smart_card(student_id, card_no, balance, issue, expiry, pin) VALUES(" + 
                                                "?, ?, ?, ?, ?, ?) IF NOT EXISTS",
    createASmartCardWOC: "INSERT INTO smart_card(student_id, card_no, balance, issue, expiry, pin) VALUES(" + 
                                                "?, ?, ?, ?, ?, ?)",
    createAPayment: "INSERT INTO due_payment(student_id, id, amount, due_date, fine, ispaid, transaction, type, creation_date) VALUES(" +
                                                "?, ?, ?, ?, ?, ?, ?, ?, totimestamp(now())) IF NOT EXISTS",
    createAPaymentWOC: "INSERT INTO due_payment(student_id, id, amount, due_date, fine, ispaid, transaction, type, creation_date) VALUES(" +
                                                "?, ?, ?, ?, ?, ?, ?, ?, totimestamp(now()))",
    createATransaction: "INSERT INTO transactions(id, student_id, card_no, amount, date, type, type_id, trx_id) VALUES(" + 
                                                "?, ?, ?, ?, totimestamp(now()), ?, ?, ?) IF NOT EXISTS",
    createATransactionWOC: "INSERT INTO transactions(id, student_id, card_no, amount, date, type, type_id, trx_id) VALUES(" + 
                                                "?, ?, ?, ?, totimestamp(now()), ?, ?, ?)",



    addPaymentTransaction: "UPDATE due_payment SET transaction={id: ?, trx_id: ?, card_no: ?, date: totimestamp(now())}, ispaid=True " +  
                                                "WHERE student_id=? AND id=?",
    updateCardBalance: "UPDATE smart_card SET balance=? WHERE student_id=? and card_no=?",
    updateCardInfo: "UPDATE smart_card SET balance=?, expiry=?, pin=? WHERE student_id=? and card_no=?",

    updatePaymentInfo: "UPDATE due_payment SET amount=?, fine=?, type=?, due_date=? WHERE student_id=? and id=?",



    deleteFromPayment: "DELETE FROM due_payment WHERE student_id=? AND id=?",
    
    deleteFromSmartCardForStudent: "DELETE FROM smart_card WHERE student_id=?",
    deleteFromPaymentForStudent: "DELETE FROM due_payment WHERE student_id=?",
    deleteFromTransactionForStudent: "DELETE FROM transactions WHERE student_id=?",



    getSmartCardOne: "SELECT * FROM smart_card WHERE student_id=? and card_no=?",
    getSmartCardForStudent: "SELECT * FROM smart_card WHERE student_id=?",
    getCardBalance: "SELECT balance FROM smart_card WHERE student_id=?",

    getDuePaymentOne: "SELECT * FROM due_payment WHERE student_id=? AND id=?",
    getDuePayments: "SELECT * FROM due_payment WHERE student_id=?",
    getStatusOfPayment: "SELECT ispaid FROM due_payment WHERE student_id=? AND id=?",

    getTransactions: "SELECT * FROM transactions WHERE student_id=?",
    getTransactionOne: "SELECT * FROM transactions WHERE student_id=? AND id=?"
}


