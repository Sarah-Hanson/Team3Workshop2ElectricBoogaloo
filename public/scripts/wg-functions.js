// Functions.js file by Wade Grimm, needed for Registration.html

//Global Vars
var myReg = /^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z][ ]?[0-9][ABCEGHJ-NPRSTV-Z][0-9]$/i;

//Functions Start


function fnValidatePostal(postal) {
    if (myReg.test(postal)) {
        return true;
    } else {
        return false;
    }
}


function fnFormValidate() {
    var myform = document.forms.namedItem("regForm");
    var focusSet = false;
    for (i = 0; i < myform.elements.length; i++) {
        if (myform.elements[i].type == "text" || myform.elements[i].type == "email" || myform.elements[i].type == "password" || myform.elements[i].type == "select-one") {
            if (myform.elements[i].value == "") {
                if (focusSet == false) {
                    myform.elements[i].focus();
                    focusSet = true;
                }
                myform.elements[i].style.backgroundColor = "#f0cccc";
            } else {
                focusSet = false;
                myform.elements[i].style.backgroundColor = "";
            }
        }
    }

    if (focusSet) {
        focusSet = false;
        return false;
    } else {
        if (fnValidatePostal(document.getElementById("inputpostal").value)) {
            return confirm("Continue submitting?");
        } else {
            document.getElementById("inputpostal").style.backgroundColor = "#f0cccc";
            document.getElementById("inputpostal").focus();
            return false;
        }
    }
}


function fnClearForm() {
    var myform = document.forms.namedItem("regForm");
    for (i = 0; i < myform.elements.length; i++) {
        myform.elements[i].style.backgroundColor = "";
        myform.elements[i].value = "";
    }
}