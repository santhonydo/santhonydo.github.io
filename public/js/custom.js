;"use strict";

$(function(){
  var selectedFile;
  var downloadURLs = [];
  const submitBtn = document.getElementById("submit");
  const na = document.getElementById("na");
  var uid;

  $(".custom-file-control").attr("data-content", "Choose file...")

  //get a reference to database service
  var database = firebase.database();

  firebase.auth().signInAnonymously().catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    location.reload();
    return
  })

  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      var isAnonymous = user.isAnonymous;
      uid = user.uid;
    } else {
      //user signed out
    }
  })


  const handleFormSubmission = (token) => {
    const patientData = gatherData(token);
    writeUserData(uid, patientData);
  }

  var handler = StripeCheckout.configure({
    key: 'pk_live_8JKBU3uNaBzG8Q7LoQZsh8sb',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: function(token) {
      handleFormSubmission(token)
    }
  });

  submitBtn.addEventListener('click', function(e) {

    // Open Checkout with further options:
    handler.open({
      name: 'TreatSTI.com',
      description: 'Quick screen',
      amount: 1999
    });
    e.preventDefault();
  });

  window.addEventListener('popstate', function() {
    handler.close();
  });

  function writeUserData(uid, patientData) {
    const d = Date();
    database.ref('users/' + uid).set({
      date: d.toString(),
      email: patientData.email,
      imgURLs: downloadURLs,
      patientData: patientData.questData
    }, function(error){
      if (error){
        alert("Error submitting your questionnaire. Please contact us at help@treatsti.com.");
        window.location = "https://treatsti.com"
      } else {
        $('#successModal').modal('show');
      }
    })
  }

  $('#successModal').on('hidden.bs.modal', function(){
    window.location = "https://treatsti.com";
  })

  function gatherData(token){
    const questData = {
      gender: getElementBy("gender"),
      patDOB: getElementBy("pat_dob"),
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

    const email = token.email;
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
    if (na.checked) {
      na.checked = !na.checked
    }
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
      const percentUpload = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + '% uploaded';
      uploadPercent.innerHTML = percentUpload;

    }, function(error){
      uploadPercent.innerHTML = "Unable to upload, try again."
    }, function(){
      var downloadURL = uploadTask.snapshot.downloadURL;
      downloadURLs.push(downloadURL);
      uploadPercent.style.color = "green";

      if (downloadURLs.length === 1){
        uploadPercent.innerHTML = downloadURLs.length + ' image uploaded.'
      } else if (downloadURLs.length > 1) {
        uploadPercent.innerHTML = downloadURLs.length + ' images uploaded.'
      }

      $(".custom-file-control").attr("data-content", "Upload another...");
      // na.disabled = true;
      // submitBtn.disabled = false;
    })
  }

  // na.addEventListener("change", function(){
  //   if (this.checked) {
  //     submitBtn.disabled = false;
  //   } else {
  //     submitBtn.disabled = true;
  //   }
  // })

})
