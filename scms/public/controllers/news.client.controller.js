angular.module('webapp')
.controller('NewsController', ['$scope', 'NewsService', NewsController]);

function NewsController($scope, NewsService) {
  $scope.list = [];
  $scope.current = {};
  $scope.new = {};
  $scope.id = [];
  $scope.save = function() {
    if(!$scope.new.title) {
      $scope.editorMessage = 'Title is required';
      return;
    }
    if(!$scope.new.content) {
      $scope.editorMessage = 'Content is required';
      return;
    }
    $scope.editorMessage = '';

    NewsService.save($scope.new).then(
      function(data){
        $("#modal-editor").modal('hide');
        $scope.loadNews();
      },
      function(err){
        $scope.editorMessage = err;
      }
      );
  };

  $scope.update = function() {
    if(!$scope.current.title) {
      $scope.editorMessage = 'Title is required';
      return;
    }
    if(!$scope.current.content) {
      $scope.editorMessage = 'Content is required';
      return;
    }
    $scope.editorMessage = '';

    NewsService.update($scope.id, $scope.current).then(
      function(data){
        $("#modal-update").modal('hide');
        $scope.loadNews();
      },
      function(err){
        $scope.editorMessage = err;
      }
      );
  };

  $scope.createNews = function() {
    $scope.new = {};
    $("#modal-editor").modal('show');
  };

  $scope.openNewsDetail = function(id) {
    $scope.loadDetail(id);
    console.log('openNewsDetailTitle:',$scope.current.title);
    console.log('openNewsDetailContent:',$scope.current.content);
    $("#modal-detail").modal('show');
  };

  $scope.deleteNews = function(id) {
    NewsService.delete(id).then(
      function(data) {
        console.log('delete success');
        //$scope.current = data;
        $scope.loadNews();
      },
      function(err) {

      }
    );
  };
  $scope.updateNews = function(id) {
    $scope.loadDetail(id);
    $scope.id = id;
    $("#modal-update").modal('show');
  };

  $scope.loadDetail = function(id){
    NewsService.detail(id).then(
      function(data) {
        $scope.current = data;
      },
      function(err){

      }
    );
  };

  $scope.formatTime = function(time){
    return moment(time).format('l');
  };

  $scope.loadNews = function() {
    NewsService.list().then(
      function(data){
        console.log('data:');
        console.log(data);
        $scope.list = data;
      },
      function(err){}
      );
  };

  $scope.loadNews();
}