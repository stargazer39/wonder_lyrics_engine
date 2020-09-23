var http = require('http'),
	fs = require('fs');

http.createServer(function (req, res) {
  fs.readFile("hand_in_hand.txt", function (err,data) {
  	res.setHeader("Access-Control-Allow-Origin", "*")
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);;
    res.end(data);
  });
}).listen(8080);

fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(80);
});