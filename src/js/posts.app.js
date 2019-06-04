var postsApp = (function() {

    function viewPosts() {

        let uri = `${window.location.origin}/api/posts`;
        let xhr = new XMLHttpRequest();
        xhr.open('GET', uri);
    
        xhr.setRequestHeader(
          'Content-Type',
          'application/json; charset=UTF-8'
        );
    
        xhr.send();
    
        xhr.onload = function () {
          //let app = document.getElementById('app');
          let data = JSON.parse(xhr.response);
          console.log(data);
        }
    }

    return {
      load: function(){
        //alert('LOADED'); // a "LOADED" dialog box appears in browser
        viewPosts();
      }
    }
  
  })();
  
  postsApp.load();