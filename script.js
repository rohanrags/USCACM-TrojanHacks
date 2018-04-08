var app = angular.module('MyApp', ["ngRoute"]);
app.controller('MyController', function($scope,$http) {

    var qr = new QRCode("qrcode"); //for QR code

    $scope.landingDiv=true;
    $scope.loginDiv=false;
    $scope.registerDiv=false;
    $scope.studentsDashboard=false;
    $scope.recruiterDashboard=false;

    $scope.radioButton = false; //for toggle between students and recruiters in registration
    $scope.radioButton1 = false; //for toggle between students and recruiters in login
    $scope.webcamResults = false;

    $scope.dummy_data = [
        { 'Microsft' : '10'},
        { 'Twitter' : '15'},
        { 'Google' : '20' }
    ]; //todo

    $scope.student_list_data = [
      'Samarth Kulkarni' ,
      'Bhavesh Motwani',
    ];

    $scope.profile_information=null; //todo
    $scope.recruiter_information=null; //todo

    //shows the login div - element
    $scope.showlogin = function() {
      $scope.landingDiv=false;
      $scope.registerDiv=false;
      $scope.loginDiv=true;
    }

    //Activating Landing page
    $scope.home = function() {
      $scope.landingDiv=true;
      $scope.registerDiv=false;
      $scope.loginDiv=false;
      $scope.studentsDashboard=false;
      $scope.recruiterDashboard=false;
    }


    //Login function - Users can login and present the dashboard
    $scope.login = function() {
      var req;
      //console.log($scope.radioButton1);

      req = {
         method: 'POST',
         url: 'http://localhost:8081/login',
         headers: {
           'Content-Type': 'application/json'
         },
         data: {
            "email":$scope.login_email,
            "password":$scope.login_pwd,
            "type":$scope.radioButton1
          }
        }
      // console.log($scope.login_email);
      // console.log($scope.login_pwd);

      // $http(req).then(function successCallback(response) {
      //     alert("Login Success");
      //     //$scope.loginResults = response.data;
      //   }, function errorCallback(response) {
      //     alert("Login Failed");
      //     //$scope.loginResults = response.data;
      // });

      $scope.landingDiv=false;
      $scope.registerDiv=false;
      $scope.loginDiv=false;

      if($scope.radioButton1==true) {
        //student dashboard
        //assigning student data into profile field
        $scope.dummy_data_students = [
            { 'fname' : 'Rohan'},
            { 'lname' : 'Kulkarni'},
            { 'email' : 'rohankul@usc.edu' },
            { 'usc_id' : '3082323731'}
        ];

        $scope.fname=$scope.dummy_data_students[0].fname;
        $scope.lname=$scope.dummy_data_students[1].lname;
        $scope.email=$scope.dummy_data_students[2].email;
        $scope.usc_id=$scope.dummy_data_students[3].usc_id;

        //for making QR code
        var str = $scope.fname + " " + $scope.lname + " " + $scope.email + " " + $scope.usc_id;

        $scope.studentsDashboard=true;
        qr.makeCode(str); //for the time being calling here
        //todo - change to student dashboard or recruiter dashboard.
        //whatever data is displayed based on that
      } else {

        $scope.dummy_recruiter_students = [
            { 'fname' : 'Katherine'},
            { 'lname' : 'Jones'},
            { 'email' : 'kjones@microsoft.com' },
            { 'cname' : 'Microsoft'}
        ];

        $scope.fname=$scope.dummy_recruiter_students[0].fname;
        $scope.lname=$scope.dummy_recruiter_students[1].lname;
        $scope.email=$scope.dummy_recruiter_students[2].email;
        $scope.company=$scope.dummy_recruiter_students[3].cname;

        //recruiter dashboard
        $scope.recruiterDashboard=true;
        webcam(); //for the time being calling webcam function here.
      }
    }

    var webcam = function() {
      let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
        scanner.addListener('scan', function (content) {
          console.log(content);
          alert("QR Code Scanned, You have been added to the list.");
          webcamResults(content);

        });
        Instascan.Camera.getCameras().then(function (cameras) {
          if (cameras.length > 0) {
            scanner.start(cameras[0]);
          } else {
            console.error('No cameras found.');
          }
        }).catch(function (e) {
          console.error(e);
        });
    }

    //adding scanned QR Code into list
    var webcamResults = function(content) {
      var res = content.split(" ");
      $scope.student_list_data.push(res[0] + " " + res[1]);
      $scope.$apply();
    }

    //shows the register div - element
    $scope.showRegister = function() {
      $scope.landingDiv=false;
      $scope.loginDiv=false;
      $scope.registerDiv=true;
    }

    $scope.check_student = function (index) {
      console.log(index);
      var txt;
      if (confirm("Are you done with this student?")) {
        txt = "You pressed OK!";
        $scope.student_list_data.splice(index,1);
        console.log($scope.student_list_data);
        // var req = {
        //    method: 'GET',
        //    url: 'http://10.10.109.212:5000/get-students',
        //    headers: {
        //      'Content-Type': 'application/json'
        //    },
        // }
        //
        // $http(req).then(function successCallback(response) {
        //     $scope.status = response.status;
        //     $scope.data = response.data;
        //     $scope.resultsArray = response.data;
        //     console.log($scope.status);
        //     console.log($scope.data);
        //   }, function errorCallback(response) {
        //     $scope.status = response.status;
        //     $scope.data = response.data;
        //     console.log($scope.status);
        //     console.log($scope.data);
        // });

      } else {
          //do nothing
          txt = "You pressed Cancel!";
      }

    }

    //Registration function - Users can register themselves onto our database.
    $scope.register = function() {
      var req;
      if($scope.radioButton==false) {
        req = {
         method: 'POST',
         url: 'http://localhost:8081/save_student',
         headers: {
           'Content-Type': 'application/json'
         },
         data: {
            "fname":$scope.fname,
            "lname":$scope.lname,
            "cname":$scope.company,
            "email":$scope.email,
            "password":$scope.password
          }
        }
      } else {
        req = {
         method: 'POST',
         url: 'http://localhost:8081/save_student',
         headers: {
           'Content-Type': 'application/json'
         },
         data: {
            "id":$scope.usc_id,
            "fname":$scope.fname,
            "lname":$scope.lname,
            "major":$scope.major,
            "email":$scope.email,
            "password":$scope.password
          }
        }
      }

      $http(req).then(function successCallback(response) {
          console.log(response.data);
          alert("Registered Successfully, Please Login.");
        }, function errorCallback(response) {
          alert("Could not Register, Please try again.");
      });

      $scope.landingDiv=false;
      $scope.registerDiv=false;
      $scope.loginDiv=true;
    }

});
