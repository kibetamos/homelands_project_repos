import React, { useState, forwardRef, useRef, useImperativeHandle, useEffect } from "react";


const GroupSelectModal = (props) => {

    return (
        <div>
            {/* Choose Contact Group Modal */}
            < div class="modal fade higherzindex background-opaque" id="addGroupModal" >
                <div class="modal-dialog" id="addGroupModalInner" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Choose Contact Group</h5>
                            <button id="hideGroupChooserBtn" type="button" class="close" onClick={props.closeContactGroup} ><span>&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form onSubmit={props.addGroups} id="chooseGroupForm">
                                <span class="d-none text-red" id="noGroupError">You have not created any Groups. <br /> Go to the  <a href="/contacts" className="text-blue">contacts</a> page to create one.</span>
                                <div id="all-contacts-group-div" class="d-none form-group">
                                    {/* <div  class="form-check mb-2">
                    <input type="checkbox" class="form-check-input" id="allcontacts" value="All Contacts" />
                    <label class="form-check-label" for="check1">All Contacts</label>
                  </div> */}
                                    {props.contactgroups.map((contact, index) =>
                                        <div class="form-check mb-2">
                                            <label class="form-check-label" for="check1">
                                                <input type="checkbox" class="form-check-input" id={contact.id} value={contact.group_name} />
                                                {contact.group_name}</label>
                                        </div>
                                    )}

                                    <button type="submit" class="btn btn-primary">Add Groups</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
            {/* Choose Contact Group Modal End*/}
        </div>
    )
}

export default GroupSelectModal;