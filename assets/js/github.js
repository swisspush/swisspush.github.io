jQuery.githubUser = function(username, callback) {
    jQuery.getJSON('https://api.github.com/users/'+username+'/repos?callback=?',callback)
}

jQuery.fn.loadRepositories = function(username) {
    var ts = new Date().getTime(); // cache expire
    var html = "<img src='/assets/themes/swisspush/images/loading.gif'>";
    if(sessionStorage) {
        ts = sessionStorage.getItem("swisspush.repos.ts") || ts;
        html = sessionStorage.getItem("swisspush.repos") || html;
    }
    this.html(html);

    var target = this;
    if(ts <= new Date().getTime()) {
        $.githubUser(username, function (data) {
            var repos = data.data; // JSON Parsing
            sortByName(repos);

            var list = $('<ul class="horizontal"/>');
            target.empty().append(list);
            $(repos).each(function () {
                if (this.name != (username.toLowerCase() + '.github.io')) {
                    list.append('<li><a title="' + this.description + '" href="' + (this.homepage ? this.homepage : this.html_url) + '">' + this.name + '</a></li>');
                }
            });
            if (sessionStorage) {
                sessionStorage.setItem("swisspush.repos", target.html());
                sessionStorage.setItem("swisspush.repos.ts", ts+1*3600*1000);
            }
        });
    }

    function sortByName(repos) {
        repos.sort(function(a,b) {
            return a.name - b.name;
        });
    }
};
