
module.exports = {
    
    createScholarship: "INSERT INTO scholarship(id, name, amount, creation_date, level_term) VALUES(" + 
                                                "?, ?, ?, ?, ?) IF NOT EXISTS",

    createApplyScholarship: "INSERT INTO applied_scholarship(id, session_id, student_id, scholarship_id, scholarship_name, amount, issue_time) VALUES(" + 
                            "?, ?, ?, ?, ?, ?, ?)",
    createApplyScholarshipByStudent: "INSERT INTO applied_scholarship_by_student(id, session_id, student_id, scholarship_id, scholarship_name, amount, issue_time) VALUES(" + 
                            "?, ?, ?, ?, ?, ?, ?)",
    createScholarshipState: "INSERT INTO scholarship_state(location, id, applied_scholarship_id, date, updated_by) VALUES(" + 
                            "?, ?, ?, ?, ?)",
    createScholarshipPayment: "INSERT INTO scholarship_payment(applied_id, payment_id) VALUES(?, ?)",


    updateScholarship: "UPDATE scholarship SET amount=?, level_term=? WHERE name=? AND id=?",
    updateAppliedScholarshipAmount: "UPDATE applied_scholarship SET amount=?" +
                            "WHERE session_id=? AND student_id=? AND id=?",      
    updateAppliedScholarshipByStudentAmount: "UPDATE applied_scholarship_by_student SET amount=?" +
                            "WHERE session_id=? AND student_id=? AND id=?",      
    updateScholarshipState: "UPDATE applied_scholarship SET current_state={" +
                            "state_id:?, location:?, updated_by:?, update_time:?} " +
                            "WHERE session_id=? AND student_id=? AND id=?",      
    updateScholarshipStateByStudent: "UPDATE applied_scholarship_by_student SET current_state={" +
                            "state_id:?, location:?, updated_by:?, update_time:?} " +
                            "WHERE session_id=? AND student_id=? AND id=?",
                      
    deleteFromScholarship: "DELETE FROM scholarship WHERE name=?",
    deleteFromAppliedScholaship: "DELETE FROM applied_scholarship WHERE session_id=? AND student_id=? AND id=?",
    deleteFromAppliedScholashipByStudent: "DELETE FROM applied_scholarship_by_student WHERE session_id=? AND student_id=? AND id=?",    
    deleteFromScholashipState: "DELETE FROM scholarship_state WHERE applied_scholarship_id=?",                    

                                                    
    getScholarship: "SELECT * FROM scholarship WHERE name=?",
    getScholarships: "SELECT * FROM scholarship",
    
    getAllAppliedScholarship: "SELECT * FROM applied_scholarship",
    getAllAppliedScholarshipBySession: "SELECT * FROM applied_scholarship WHERE session_id=?",
    getAllAppliedScholarshipByStudent: "SELECT * FROM applied_scholarship_by_student WHERE student_id=?",
    getAppliedScholarship: "SELECT * FROM applied_scholarship WHERE student_id=? AND session_id=?",
    
    getScholarshipState: "SELECT * FROM scholarship_state WHERE applied_scholarship_id=?",
    getAllScholarshipState: "SELECT * FROM scholarship_state",
    getAScholarshipState: "SELECT * FROM scholarship_state WHERE applied_scholarship_id=? AND id=?",

    getScholarshipPayment: "SELECT * FROM scholarship_payment WHERE applied_id=?",

}


