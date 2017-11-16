;"use strict";

$(function(){
  var selectedFile;
  //generate uid
  const uid = generateUID();

  $(".custom-file-control").attr("data-content", "Choose file...")

  //get a reference to database service
  var database = firebase.database();

  $("form").submit(function(e) {
    console.log('submit clicked');
    e.preventDefault();

    const email = document.getElementById("email").value;
    if (email === ""){
      alert("Please enter your email address.");
    } else {
      const patientData = gatherData();
      writeUserData(uid, patientData);
    }
  })

  function writeUserData(uid, patientData) {
    database.ref('users/' + uid).set({
      email: patientData.email,
      patientData: patientData.questData
    }, function(error){
      if (error){
        alert("Error submitting your questionnaire. Please try again.");
      } else {
        alert("We have received your request. A doctor will contact you shortly.");
        location.reload();
      }
    })
  }

  function generateUID() {
    // I generate the UID from two parts here
    // to ensure the random number provide enough bits.
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
  }

  function gatherData(){
    const questData = {
      gender: getElementBy("gender"),
      sexuallyActive: getElementBy("sexuallyActive"),
      lastSexTimeframe: getElementBy("last_sex_timeframe"),
      partnerType: getElementBy("partner_type"),
      multiplePartnerYN: getElementBy("multiple_partner_yn"),
      condomUse: getElementBy("condom_use"),
      sexActType: getCheckboxValueBy("sex_act_type"),
      partnerSTIDxYN: getElementBy("partner_dx_sti_yn"),
      symptomsDesc: getCheckboxValueBy("symptoms_desc"),
      symptomsDuration: getElementBy("smptx_duration"),
      symptomsProgress: getElementBy("smptx_progress"),
      previousSTIDx: getCheckboxValueBy("prev_sti_dx"),
      symptomsLocation: getElementBy("smptx_loc"),
      symptomsRelieveAttempt: getElementBy("smptx_relieve_attempt"),
      symptomsPrev: getElementBy("smptx_prev")
    };

    const email = getElementBy("email");
    const patientData = {email, questData}

    return patientData
  }

  function getElementBy(idName) {
    return document.getElementById(idName).value;
  }

  function getCheckboxValueBy(className) {
    const checkedValues = [];
    const checkedItems = document.querySelectorAll('.' + className +':checked');

    if (checkedItems.length > 0) {
      for (var i = 0; i < checkedItems.length; i++) {
        const value = checkedItems[i].value;
        checkedValues.push(value);
      }
    }

    return checkedValues;
  }

  //uploading files
  $("#file").on("change", function(e){
    selectedFile = e.target.files[0];
    $(".custom-file-control").attr("data-content", selectedFile.name);
    uploadFile();
  })

  function uploadFile(){
    var fileName = selectedFile.name;
    var storageRef = firebase.storage().ref('/userImages/' + fileName);
    var uploadTask = storageRef.put(selectedFile);
    const uploadPercent = document.getElementById("uploadPercentage");

    uploadTask.on('state_changed', function(snapshot){
      const percentUpload = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + '%';
      uploadPercent.innerHTML = percentUpload;

    }, function(error){
      uploadPercent.innerHTML = "Unable to upload, try again."
    }, function(){
      var downloadURL = uploadTask.snapshot.downloadURL;
      uploadPercent.style.color = "green";
      uploadPercent.innerHTML = "Upload completed!"
      $(".custom-file-control").attr("data-content", "Upload another...");
      var submitBtn = document.getElementById("submit");
      submitBtn.disabled = false;
    })
  }










})
