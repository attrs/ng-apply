function isElement(node) {
  return !!( node && node instanceof Element || node.nodeType === 1 && node.tagName );
}

module.exports = angular.module('ngApply', [])
.service('safeApply', ['$rootScope', function($rootScope) {
  return function(scope, done) {
    if( typeof scope == 'function' ) {
      done = scope;
      scope = $rootScope;
    } else if( isElement(scope) ) {
      scope = angular.element(scope).scope();
    }
    
    if( typeof done != 'function' ) throw new TypeError('missing callback function');
    if( !scope ) throw new TypeError('not found scope');
    
    var phase = (scope.$root || scope).$$phase;
    if(phase == '$apply' || phase == '$digest') scope.$eval(function() {
      done(scope);
    });
    else scope.$apply(function() {
      done(scope);
    });
  };
}]);
