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
      token.servicePackage = currentPage();
				$.ajax({
					type: 'POST',
					data: JSON.stringify(token),
					url: 'https://api.firstdoc.co/charge',
					success: function(status){
            handleFormSubmission(token);
					},
					error: function(err){
						alert("Unable to process your card. Please try again or contact us help@treatsti.com");
					}
				})
			}
  });

  submitBtn.addEventListener('click', function(e) {
    var param = currentPage();
    var price;
    var description;

    if (param === 'basic') {
      price = 1199;
      description = 'Basic service package.';
    } else if (param === 'standard') {
      price = 7999;
      description = 'Standard service package.';
    } else if (param === 'premium'){
      price = 11999;
      description = 'Premium service package.';
    }

    // Open Checkout with further options:
    handler.open({
      name: 'TreatSTI.com',
      description: description,
      amount: price
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
      servicePackage: currentPage(),
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
    })
  }

  //get current URL page

  function currentPage(){
    var urlParam = window.location.search;
    var paramSplit = urlParam.split("?");
    var param = paramSplit[1];

    return param;
  }
})
