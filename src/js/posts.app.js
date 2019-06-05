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
      let app = document.getElementById('app');
      let data = JSON.parse(xhr.response);
      let posts = data.posts;
      let table = '';
      let rows = '';
      //console.log(data); //this shows a success/array of the posts in the db

      //Loop each post record into it's own HTML table row, each post should
      //have a link to post view
      for (let i = 0; i < posts.length; i++) {
        rows = rows + `<tr>
          <td>
            <a href="#view-${posts[i]['slug']}">${posts[i]['title']}</a>
          </td>
          <td>${posts[i]['description']}</td>
          <td>${posts[i]['caption']}</td>
          <td>${posts[i]['body']}</td>
          <td>${posts[i]['quote']}</td>
          <td>`
            +
            (posts[i]['timeframe'] ? `${posts[i]['timeframe'].slice(0, 19).replace('T', ' ')}` : `No Timeframe Date Set`)
            +`
          </td>
        </tr>`;
      }

      //Create a posts panel, add a table to the panel, inject the rows into the
      //table
      table = `<div class="card">
        <div class="card-header clearfix">
          <h2 class="h3 float-left">Posts</h2>
          <div class="float-right">
            <a href="#create" class="btn btn-primary">New Post</a>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-striped table-hover table-bordered">
            <thead>
              <tr>
                <td>Title</td>
                <td>Description</td>
                <td>Caption</td>
                <td>Body</td>
                <td>Quote</td>
                <td>Timeframe</td>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;

      //Append the HTML to the #app
      app.innerHTML = table;
    }
  }

  function createPost() {
    var app = document.getElementById('app');

    var form = `
      <div class="card">
        <div class="card-header clearfix">
          <h2 class="h3 float-left">New Post</h2>
          <div class="float-right">
            <a href="#" class="btn btn-primary">Cancel</a>
          </div>
        </div>
        <div class="card-body">
          <form id="createPost" class="card-body">
            <div id="formMsg" class="alert alert-danger text-center">Your form has errors</div>
            <div class="row">
              <div class="form-group col-md-6">
                <label for="title">Title</label>
                <input type="text" id="title" name="title" class="form-control" required>
              </div>
              <div class="form-group col-md-6">
                <label for="published">Timeframe</label>
                <input type="datetime-local" id="timeframe" name="timeframe" class="form-control" required>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md">
                <label for="body">Story</label>
                <textarea id="body" name="body" class="form-control" rows="6" required></textarea>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label for="description">Summary</label>
                <input type="text" id="description" name="description" class="form-control" required>
              </div>
              <div class="form-group col-md-6">
                <label for="keywords">Keywords (separated by commas)</label>
                <input type="text" id="keywords" name="keywords" class="form-control" required>
              </div>
              <div class="form-group col-md-6">
              <label for="caption">Caption</label>
              <input type="text" id="caption" name="caption" class="form-control" required>
            </div>
            <div class="form-group col-md-6">
              <label for="quote">Quote</label>
              <input type="text" id="quote" name="quote" class="form-control" required>
            </div>
            <div class="form-group col-md-6">
            <label for="image">Attach Image</label>
            <input type="text" id="image" name="image" class="form-control" required>
          </div>
            </div>
            <div class="text-right">
              <input type="submit" value="Submit" class="btn btn-lg btn-primary btn-sm-block">
            </div>
          </form>
        </div>
      </div>
    `;


    app.innerHTML = form;
  }

  return {
    load: function() {
      //alert('LOADED'); // a "LOADED" dialog box appears in browser
      //viewPosts(); // stubbed out
      let hash = window.location.hash;
      let hashArray = hash.split('-');

      switch (hashArray[0]) {
        case '#create':
          //console.log('CREATE'); //check at http://localhost:3001/posts/app#create
          createPost();
          //processRequest('createPost', '/api/posts', 'POST');
          break;

        case '#view':
          console.log('VIEW');
          //viewPost(hashArray[1]);
          break;

        case '#edit':
          console.log('EDIT');
          //editPost(hashArray[1]);
          break;

        case '#delete':
          console.log('DELETE');
          //deleteView(hashArray[1]);
          break;

        default:
          viewPosts();
          break;
      }
    }
  }

})();
  
postsApp.load();

window.addEventListener("hashchange", function () {
  postsApp.load();
})