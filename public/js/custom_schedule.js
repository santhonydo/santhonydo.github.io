;"use strict";

$(function(){
  //set date to today
  const date = (new Date()).toISOString().split('T')[0];
  const dateControl = document.querySelector('input[type="date"]');
  dateControl.value = date;
  dateControl.min = date;
  var selected_appt_date;

  //setup firebase auth
  var uid;

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

  //setup stripe payment
  var handler = StripeCheckout.configure({
    key: 'pk_live_8JKBU3uNaBzG8Q7LoQZsh8sb',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: function(token) {
				$.ajax({
					type: 'POST',
					data: JSON.stringify(token),
					url: 'https://api.firstdoc.co/charge',
					success: function(status){
            console.log(status);
            handleFormSubmission(token);
					},
					error: function(err){
						alert("Unable to process your card. Please try again or contact us help@treatsti.com");
					}
				})
			}
  });

  window.addEventListener('popstate', function() {
    handler.close();
  });

  //handle form submission and payment
  const book_appointment = document.getElementById('book_appointment');

  book_appointment.addEventListener('click', function(e) {
    selected_appt_date = document.getElementById('date').value;

    // Open Checkout with further options:
    handler.open({
      name: 'TreatSTI.com',
      description: 'Virtual visit appointment deposit',
      amount: 999
    });
    e.preventDefault();
  });


  const handleFormSubmission = (token) => {
    writeUserData(uid, token.email, selected_appt_date);
  }

  function writeUserData(uid, email, selected_appt_date) {
    const d = Date();
    database.ref('appointments/' + uid).set({
      date: d.toString(),
      email: email,
      appt_request_date: selected_appt_date
    }, function(error){
      if (error){
        alert("An error has occured. Please contact us at help@treatsti.com.");
        window.location = "https://treatsti.com"
      } else {
        $('#successModal').modal('show');
      }
    })
  }

  $('#successModal').on('hidden.bs.modal', function(){
    window.location = "https://treatsti.com";
  })
})
