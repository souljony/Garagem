angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $ionicPopup, $timeout, $ionicLoading) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});


    $scope.syncCloud = function (id) {
        $ionicLoading.show({
            template: 'Loading...'
        });
        var UserUUID = Parse.Object.extend("UserUUID");
        var query = new Parse.Query(UserUUID);

        if ($scope.users.length === 0) {
            query.find({
                success: function (_response) {
                    //console.log("myTutorSession.query: " + JSON.stringify(_response,null,2));
                    for (var i = Object.keys($scope.users).length; i < _response.length; i++) {
                        var object = _response[i];
                        var element = {};
                        element.name = object.get("name");
                        element.uuid = object.get("uuid");
                        $scope.users.push(element);
                        console.log("Data for Debug:", $scope.users);
                    }
                }
            });
        } else {
            query.get(id, {
                success: function (_resposta) {
                    var element = {};
                    element.name = _resposta.get("name");
                    element.uuid = _resposta.get("uuid");
                    $scope.users.push(element);
                    console.log("This data was added to the User");
                },
                error: function (object, error) {
                    console.log("ID of the Object:", id);
                    console.log("Object was not retrieved...");
                    // error is a Parse.Error with an error code and message.
                }
            });
        };
        $ionicLoading.hide();
    };

    ionic.Platform.ready(function () {
        bluetoothSerial.connect("20:15:07:27:33:46", $scope.connectSuccess, $scope.connectFailure);
        bluetoothSerial.read(function (data) {
            console.log(data);
        }, $scope.connectFailure);

        var device = ionic.Platform.device();
        var uuid = device.uuid;
        console.log("UUID is:", uuid);

        $scope.users = [];

        $scope.syncCloud();

    });

    var macAdress = "20:15:07:27:33:46";

    $scope.enviarString = function () {
        bluetoothSerial.write("n");
        bluetoothSerial.read(function (data) {
            console.log(data);
        }, connectFailure);
    };

    $scope.connectSuccess = function () {
        $scope.data = {}
        var connectPopup = $ionicPopup.confirm({
            title: 'Conected with Success',
            template: 'You are now connected to your system.'
        });
    };

    $scope.connectFailure = function () {
        $scope.data = {}
        var disconnectPopup = $ionicPopup.confirm({
            title: 'Failure Connecting...',
            template: 'You are NOT connected.'
        });
    };

    // Form Data for the User add
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
        $scope.loginData = {};
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogina = function () {
        console.log('Doing login', $scope.loginData.title);
        // Save the User to the temporary object.
        console.log("Saving User to the Temporary object");
        $scope.users.push($scope.loginData);
        // Save the User to the localStorage object.
        console.log("Saving User to the localStorage object");
        window.localStorage['users'] = angular.toJson($scope.users);
        console.log("LocalStorage Reading:", window.localStorage['users']);
        $scope.closeLogin();
    };

    $scope.doLogin = function () {
        console.log("Saving data for User", $scope.loginData.title);
        var UserUUID = Parse.Object.extend("UserUUID");
        var userUUID = new UserUUID();

        userUUID.set("name", $scope.loginData.title);
        userUUID.set("uuid", $scope.loginData.uuid);

        userUUID.save(null, {
            success: function (userUUID) {
                // Execute any logic that should take place after the object is saved.
                alert('New object created with objectId: ' + userUUID.id);
                $scope.syncCloud(userUUID.id);
                $scope.closeLogin();
            },
            error: function (userUUID, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });
    };

    // The MAC Addresses on the Arduino board should be SYNCED with the Administrator APP, in order to allow, or not the Garage opening.
    $scope.sync = function () {
        angular.forEach($scope.users, function (item) {
            console.log("Printing MAC numbers for the serial monitor.");
            bluetoothSerial.write(item.uuid);
            bluetoothSerial.write("\r\n");
        });
    };

})

.controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
        {
            title: 'Reggae',
            id: 1
        },
        {
            title: 'Chill',
            id: 2
        },
        {
            title: 'Dubstep',
            id: 3
        },
        {
            title: 'Indie',
            id: 4
        },
        {
            title: 'Rap',
            id: 5
        },
        {
            title: 'Cowbell',
            id: 6
        }
  ];
})

.controller('SignupCtrl', function ($scope) {
    $scope.data = {};

    $scope.signupEmail = function () {
        //Create a new user on Parse
        var user = new Parse.User();
        user.set("username", $scope.data.username);
        user.set("password", $scope.data.password);
        user.set("email", $scope.data.email);

        // other fields can be set just like with Parse.Object
        user.set("somethingelse", "like this!");

        user.signUp(null, {
            success: function (user) {
                // Hooray! Let them use the app now.
                alert("success!");
            },
            error: function (user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    };

    $scope.loginEmail = function () {

    };
})

.controller('PlaylistCtrl', function ($scope, $stateParams) {});