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
    $scope.new.deadline = $("#inputTime").val();
    // console.log("$scope.new.deadline:",$scope.new.deadline);
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
    $scope.current.deadline = $("#updateTime").val();
    console.log("$scope.current.deadline:",$scope.current.deadline);
    NewsService.update($scope.id, $scope.current).then(
      function(data){
        $("#modal-update").modal('hide');
        $scope.loadNews();
      },
      function(err){
        $scope.editorMessage = err;
      }
      );
    // console.log($("#updateTime").val());
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


  $scope.formatTime = function(time){
    return moment(time).format('YYYY-MM-DD HH:mm:ss');
  };

  $scope.loadDetail = function(id){
    NewsService.detail(id).then(
      function(data) {
        $scope.current = data;
        // $scope.current.deadline = formatTime($scope.current.deadline);
        // console.log('$scope.current.deadline:',$scope.current.deadline);
      },
      function(err){}
      );
  };

  $scope.updateNews = function(id) {
    $scope.loadDetail(id);
    $scope.id = id;
    $("#modal-update").modal('show');
  };

  $scope.loadNews = function() {
    NewsService.list().then(
      function(data){
        // console.log('data:');
        // console.log(data);
        $scope.list = data;
        // $scope.checkboxes = new Array($scope.list.length);
        var MesId = [];
        for(var i = 0; i < $scope.list.length; i++) {
          MesId[i] = $scope.list[i].id;
        }
        $scope.mesId = MesId;
        // console.log('mesId:',$scope.mesId);
      },
      function(err) {}
      );
  };

  $scope.deleteNews = function(id) {
    NewsService.delete(id).then(
      function(data) {
        $scope.loadNews();
      },
      function(err) {}
      );
  };

  $scope.check = function(cid, chk) {
    // console.log('val:',val);
    // console.log('chk:',chk);
    var val = $scope.mesId[cid];
    // console.log('1:',$scope.chk);
    if(chk) {
      id += val+",";
      // console.log('2:',$scope.chk);
    }
    else {
      // 替换选中后再次未选中
      id = id.replace(val+",","");
      // console.log('3:',$scope.chk);
      // $scope.chk = false;
    }
    console.log('checkedId:',id);
  };

  $scope.checkAll = function() {
    // console.log('map',$scope.list.map(function(item){return item.id}));
    id = "";
    //全选
    if(flag) {
      for(var i = 0; i < $scope.list.length; i++) {
        var val = $scope.mesId[i];
        id += val+",";
      }
      $scope.chk = true;
      flag = false;
      $scope.checkName = "Unselect All";
    }
    else { // 全不选
      $scope.chk = false;
      flag = true;
      $scope.checkName = "Check All";
    }
    console.log('allId:',id);
  };

  $scope.mulDelete = function() {
    var chkId = id.split(",");
    var firstId = chkId.pop();//删除分割后的数组的最后一个空元素
    console.log('chkId:',chkId);
    for(var i = 0; i < chkId.length; i++) {
      $scope.deleteNews(chkId[i]);
    }
    chkId = "";
    id = "";
    $scope.chk = false;
    $scope.checkName = "Check All";
  }
  $scope.loadNews();
}