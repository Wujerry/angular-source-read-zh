//test minErr
var exampleMinErr = angular.$$minErr('example');
throw exampleMinErr('one', 'This {0} is {1}', 'foo', {'bar':'I am bar'});