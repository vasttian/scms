angular.module('webapp')
.controller('NewsController', ['$scope', 'NewsService', NewsController]);

function NewsController($scope, NewsService) {
  $scope.list = [];
  $scope.current = {};
  $scope.new = {};
  $scope.id = [];
  $scope.chk = false;
  var id = "";
  $scope.checkName = "Check All";
  var flag = true;
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
    $scope.chk = false;
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
    // console.log('openNewsDetailTitle:',$scope.current.title);
    // console.log('openNewsDetailContent:',$scope.current.content);
    $("#modal-detail").modal('show');
  };

  $scope.deleteNews = function(id) {
    NewsService.delete(id).then(
      function(data) {
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
    return moment(time).format('YYYY-MM-DD HH:mm:ss');
  };

  $scope.loadNews = function() {
    NewsService.list().then(
      function(data){
        // console.log('data:');
        // console.log(data);
        $scope.list = data;
        var MesId = [];
        for(var i = 0; i < $scope.list.length; i++) {
          MesId[i] = $scope.list[i].id;
        }
        $scope.mesId = MesId;
        // console.log('mesId:',$scope.mesId);
      },
      function(err){}
      );
  };

  $scope.check = function(cid, chk) {
    // console.log('val:',val);
    // console.log('chk:',chk);
    var val = $scope.mesId[cid];
    if(chk) {
      id += val+",";
    }
    else {
      // 替换选中后再次未选中
      id = id.replace(val+",",""); 
    }
    // console.log('checkedId:',id);
  };

  $scope.checkAll = function() {
    id = "";
    if(flag) {
      for(var i = 0; i < $scope.mesId.length; i++) {
        var val = $scope.mesId[i];
        id += val+",";
        $scope.chk = true;
      }
      flag = false;
      $scope.checkName = "Unselect All";
    }
    else {
      for(var i = 0; i < $scope.mesId.length; i++) {
        $scope.chk = false;
      }
      flag = true;
      $scope.checkName = "Check All";
    }
    // console.log('allId:',id);
  };

  $scope.mulDelete = function() {
    var chkId = id.split(",");
    var firstId = chkId.pop();//删除分割后的数组的最后一个空元素
    // console.log('chkId:',chkId);
    for(var i = 0; i < chkId.length; i++) {
      $scope.deleteNews(chkId[i]);
    }
    for(var i = 0; i < $scope.mesId.length; i++) {
        $scope.chk = false;
    }
  }

  $scope.loadNews();
}