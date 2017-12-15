;

'use strict';

var path = window.location.pathname;
var page = path.split('/').pop();
console.log(page);

//get buttons reference
var getAnswersBtn1 = document.getElementById('getAnswersBtn1');
var getAnswersBtn2 = document.getElementById('getAnswersBtn2');
var getAnswersBtn3 = document.getElementById('getAnswersBtn3');
var getAnswersFromScheduleBtn = document.getElementById('getAnswersFromScheduleBtn');
var getAnswersFromKitBtn = document.getElementById('getAnswersFromKitBtn');
var howItWorksBtn = document.getElementById('howItWorksBtn');
var stiKitsBtn = document.getElementById('stiKitsBtn');
var virtualVisitScheduleBtn = document.getElementById('virtualVisitScheduleBtn');
var qFormSubmitBtn = document.getElementById('submit');
var bookApptBtn = document.getElementById('book_appointment');

//get reference to navigation links
var aboutUsNavBtn = document.getElementById('aboutUsNavBtn');
var howItWorksNavBtn = document.getElementById('howItWorksNavBtn');
var servicesNavBtn = document.getElementById('servicesNavBtn');
var testimonialsNavBtn = document.getElementById('testimonialsNavBtn');

if (page === '' || page === 'home.html'){
  //add click event listener to 'Get Answers 1' button
  getAnswersBtn1.addEventListener('click', function(){
    console.log('You are currently on the homepage.')
    ga('send', 'event', 'Questionnaire', 'click', 'Get Answers 1');
  });

  //add click event listener to 'Get Answers 2' button
  getAnswersBtn2.addEventListener('click', function(){
    ga('send', 'event', 'Questionnaire', 'click', 'Get Answers 2');
  });

  //add click event listener to 'Get Answers 3' button
  getAnswersBtn3.addEventListener('click', function(){
    ga('send', 'event', 'Questionnaire', 'click', 'Get Answers 3');
  });

  //add click event listener to 'How It Works' button
  howItWorksBtn.addEventListener('click', function(){
    ga('send', 'event', 'More Info', 'click', 'How It Works');
  });

  //add click event listener to 'Select Your Kit' button
  stiKitsBtn.addEventListener('click', function(){
    ga('send', 'event', 'Kit Purchase', 'click', 'Select Your Kit');
  });

  //add click event listener to 'Schedule Now!' button
  virtualVisitScheduleBtn.addEventListener('click', function(){
    ga('send', 'event', 'Virtual Visit Schedule', 'click', 'Schedule Now');
  });

  //add click event listener to 'About Us Navigation Link' button
  aboutUsNavBtn.addEventListener('click', function(){
    ga('send', 'event', 'More Info', 'click', 'About Us Nav Link');
  });

  //add click event listener to 'How It Works Navigation Link' button
  howItWorksNavBtn.addEventListener('click', function(){
    ga('send', 'event', 'More Info', 'click', 'How It Works Nav Link');
  });

  //add click event listener to 'Our Services Navigation Link' button
  servicesNavBtn.addEventListener('click', function(){
    ga('send', 'event', 'More Info', 'click', 'Our Services Nav Link');
  });

  //add click event listener to 'Testimonials Navigation Link' button
  testimonialsNavBtn.addEventListener('click', function(){
    ga('send', 'event', 'More Info', 'click', 'Testimonials Nav Link');
  });
}

if (page === 'home.html' || page === 'screen.html'){
  qFormSubmitBtn.addEventListener('click', function(){
    ga('send', 'event', 'Payment', 'click', 'Submit and Pay Questionnaire');
  });
}

if (page === 'schedule.html') {
  bookApptBtn.addEventListener('click', function(){
    ga('send', 'event', 'Payment', 'click', 'Request and Pay MD Appt')
  })

  getAnswersFromScheduleBtn.addEventListener('click', function(){
    ga('send', 'event', 'Questionnaire', 'click', 'Get Answers Link From Schedule Page');
  });
}

if (page === 'kit.html'){
  getAnswersFromKitBtn.addEventListener('click', function(){
    ga('send', 'event', 'Questionnaire', 'click', 'Get Answers Link From Kit Page');
  });
}
