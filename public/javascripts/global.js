//Userlist data array for filling in info box
//in a real app should define single master global and populate with properties + methods
var userListData = [];

//DOM Ready =============================
$(document).ready(function(){
  //Populate user table on page load
  populateTable();
});
//Username link click
$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
//Add User button click
$('#btnAddUser').on('click', addUser);
//Delete user button click
$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
/*note: when working with jQuery on method we need to ref a static element on the page first, so we pick tbody*/

//Functions================================
function populateTable(){
  //empty content string
  var tableContent = '';

  //jQuery AJAX call for json
  $.getJSON('/users/userlist', function(data){
    //stick the user data array into a userlist veriable in the global object, note, not good for large databases
    userListData = data;
    //for each item in JSON add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>'
    });
    //Inject the content string into HTML table
    $('#userList table tbody').html(tableContent);
  });
};

//show User info
function showUserInfo(event){
  //Prevent link from firing
  event.preventDefault();

  //get username from link rel attribute
  var thisUserName = $(this).attr('rel');

  //get index of pbject based on id val
  var arrayPosition = userListData.map(function(arrayItem){return arrayItem.username;}).indexOf(thisUserName);

  //get our user object
  var thisUserObject = userListData[arrayPosition];

  //populate info box
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);
};

// Add User
function addUser(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all user info into one object
    var newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullname').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    }

    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function( response ) {
      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addUser fieldset input').val('');

        // Update the table
        populateTable();

      }
      else {

      // If something goes wrong, alert the error message that our service returned
      alert('Error: ' + response.msg);
      }
    });
  }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

//Delete USER
function deleteUser(event){
  event.preventDefault();
  //pop up confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this user?');
  if (confirmation === true){
    $.ajax({
      type:'DELETE',
      url: '/users/deleteuser/' + $(this).attr('rel')
    }).done(function(response){
      //check for a successful blank response
      if (response.msg === ''){
      }
      else{
        alert('Error: '+response.msg);
      }
      //update table
      populateTable();
    });
  }
  else{
    //if they said no to confirm, do nothing
    return false;
  }
};
