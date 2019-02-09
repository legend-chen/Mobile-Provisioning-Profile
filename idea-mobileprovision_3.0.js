var http = require('http')
var zlib = require('zlib');
var fs = require('fs');

process.chdir(__dirname);

var ProxyAddress = ProxyAddress2 = "127.0.0.1";
var ProxyPort = "8888";


var http = require('https');
var ProxyAddress2 = "developerservices2.apple.com";
var ProxyAddress = "idmsa.apple.com";
var ProxyPort = "443";

function uuid ()
{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }).toUpperCase();
};

/*
switch (res.headers['content-encoding'])
{
    // or, just use zlib.createUnzip() to handle both cases
    case 'gzip':

    	zlib.gunzip(content, function (err, decoded)
    	{
            var data = decoded.toString();
            console.log(data);
    	});
        //response.pipe(zlib.createGunzip()).pipe(output);
        break;
    case 'deflate':
        //response.pipe(zlib.createInflate()).pipe(output);
        zlib.inflate(content, function (err, decoded)
    	{
            var data = decoded.toString();
            console.log(data);
    	});
        break;
    default:
        break;
}*/

// function concatBuffer(chunks, size)
// {
//     var data = new Buffer(size);  
//     for (var i = 0, pos = 0, l = chunks.length; i < l; i++)
//     {  
//         var chunk = chunks[i];  
//         chunk.copy(data, pos);  
//         pos += chunk.length;  
//     }  
//     return data;
// }

function findObjectString(text, object, name, index)
{
	var index = index || 0;
	var identifier = "<key>" + name + "</key><string>";
	var start = text.indexOf(identifier, index);
	if (start == -1) return -1;
	start += identifier.length
	var end = text.indexOf("</string>", start);
	if (end == -1) return -1;
	object[name] = text.slice(start, end);
	return end;
}

function findKeyData(text, name)
{
	var index = index || 0;
	var identifier = "<key>" + name + "</key><data>";
	var start = text.indexOf(identifier);
	if (start == -1) return undefined;
	start += identifier.length
	var end = text.indexOf("</data>", start);
	if (end == -1) return undefined;
	return text.slice(start, end);
}

function findKeyString(text, name)
{
	var index = index || 0;
	var identifier = "<key>" + name + "</key><string>";
	var start = text.indexOf(identifier);
	if (start == -1) return undefined;
	start += identifier.length
	var end = text.indexOf("</string>", start);
	if (end == -1) return undefined;
	return text.slice(start, end);
}

function findKeyInteger(text, name)
{
	var index = index || 0;
	var identifier = "<key>" + name + "</key><integer>";
	var start = text.indexOf(identifier);
	if (start == -1) return undefined;
	start += identifier.length
	var end = text.indexOf("</integer>", start);
	if (end == -1) return undefined;
	return text.slice(start, end);
}

function RequestSessionAction(session, callback)
{
	var data = 
	{  
		"appIdKey"	:"ba2ec180e6ca6e6c6a542255453b24d6e6e5b2be0cc48bc1b0d8ad64cfe0228f",  
		"appleId"	: session.appleId, 
		"format"	:"plist",
		"password"	: session.password, 
		"protocolVersion" :"A1234",
		"userLocale":"en_US"
	};  

	//"appIdKey=ba2ec180e6ca6e6c6a542255453b24d6e6e5b2be0cc48bc1b0d8ad64cfe0228f&appleId=&format=plist&password=&protocolVersion=A1234&userLocale=en_US"
	var requestContent = require('querystring').stringify(data);

	var opt = 
	{  
	    method: "POST",  
	    //host: "idmsa.apple.com", 
	   	host: ProxyAddress,
	    //host: "localhost",   
	    //port: 443,
	    port: ProxyPort,

	    path: "https://idmsa.apple.com/IDMSWebAuth/clientDAW.cgi",

	    headers:
	    {
	    	'Host': 'idmsa.apple.com',
	    	'Proxy-Connection': 'keep-alive',
			
			'Content-Type': 'application/x-www-form-urlencoded',
			
			//'Cookie': 'dslang=US-EN; itspod=60; s_vi=[CS]v1|2C19720B85191B74-4000060480000C27[CE]; xp_ci=3z24fxlZzF0yz5AVzCdfz1Itq5laUM',
			//'Cookie': 'dslang=US-EN; itspod=43; mz_at0-586043276=AwQAAAEBAAHVJgAAAABYUO9Mp95kux0HD3QG9YmFS6QD4mM7vJk=; mz_at_ssl-586043276=AwUAAAEBAAHVJgAAAABYUPCSqTEuOhjToQ2lnPC22BaMw6EtBgs=; pldfltcid=631626e6d721412ab28478eadd621b9d043; s_vi=[CS]v1|2C19720B85191B74-4000060480000C27[CE]; X-Dsid=586043276; xp_ab=1#isj11bm+7795+tuFr0qx1; xp_abc=tuFr0qx1; xp_ci=3z24fxlZzF0yz5AVzCdfz1Itq5laUM',
			'Accept-Language': 'en-us',
			'Accept': 'text/x-xml-plist',
			//'Accept-Encoding': 'gzip, deflate',
			//'Connection': 'keep-alive',
			'Content-Length': requestContent.length,
			'User-Agent': 'Xcode'
	    }
	};  

	// console.log("Request: " + requestContent);

	var req = http.request(opt, function (res)
		{  
			// console.log("Got response: " + res.statusCode);
			// console.log("Got response headers: " + res.headers);

	        var bodyChunks = [];
	        var bodySize = 0;
	        
	        res.on('data', function (chunk)
	        {
	            // console.log("body: " + chunk);
	            // console.log(typeof chunk.copy);
	            bodyChunks.push(chunk);
	            bodySize += chunk.length;
	        });

	        res.on('end',function()
	        {
	        	var content = Buffer.concat(bodyChunks);
	        	

	        	var myacinfo = findKeyString(content.toString(), "myacinfo");
	        	//var responseID = findKeyString(content.toString(), "responseID");

	        	session.myacinfo = myacinfo;
	        	//session.responseID = responseID;
	        	// console.log(myacinfo);

	        	callback(session);
	        	//console.log(content.toString());
	        	
	        	//console.log(responseID);
	        	
	        	
	        });
	    });

	req.write(requestContent + "\n");  
	req.end();  


	req.on('error', function(e)
	{
	  	console.log("Got error: " + e.message);
	});
}

function ListTeamsAction(session)
{
	var dataContent = '<?xml version="1.0" encoding="UTF-8"?>\n\
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n\
<plist version="1.0">\n\
	<dict>\n\
		<key>clientId</key>\n\
		<string>XABBG36SBA</string>\n\
		<key>myacinfo</key>\n\
		<string>' + session.myacinfo + '</string>\n\
		<key>protocolVersion</key>\n\
		<string>QH65B2</string>\n\
		<key>requestId</key>\n\
		<string>' + uuid() + '</string>\n\
		<key>userLocale</key>\n\
		<array>\n\
			<string>en_US</string>\n\
		</array>\n\
	</dict>\n\
</plist>';

	var opt = 
	{  
	    method: "POST",  
	    host: ProxyAddress2,
	    //host: "localhost",   
	    port: ProxyPort,
	    //path: "/services/QH65B2/ios/listDevices.action?clientId=XABBG36SBA",
	    path: "https://developerservices2.apple.com/services/QH65B2/listTeams.action?clientId=XABBG36SBA",
	    headers: {
	    	'Host': 'developerservices2.apple.com',
	    	'Proxy-Connection': 'keep-alive',
	    	'Content-Type': 'text/x-xml-plist',
	    	'X-Xcode-Version': '7.0 (7A120f)',
	    	'Cookie': 'myacinfo=' + session.myacinfo,
			'Accept-Language': 'en-us',
			'Accept': 'text/x-xml-plist',
			'Accept-Encoding': 'gzip, deflate',
			'Content-Length': dataContent.length,
			//'Connection': 'keep-alive',
			'User-Agent': 'Xcode'
	    }
	};  

	// console.log("Request: " + dataContent);

	var req = http.request(opt, function (res)
		{  
			// console.log("Got response: " + res.statusCode);
			// console.log("Got response headers: " + res.headers);

	        var bodyChunks = [];
	        var bodySize = 0;
	        

	        res.on('data', function (chunk)
	        {
	            // console.log("body: " + chunk);
	            // console.log(typeof chunk.copy);
	            bodyChunks.push(chunk);
	            bodySize += chunk.length;
	        });

	        res.on('end',function()
	        {
	        	var content = Buffer.concat(bodyChunks);
	        	

	        	//console.log(res.headers['content-encoding'])
	        	switch (res.headers['content-encoding'])
				{
				    // or, just use zlib.createUnzip() to handle both cases
				    case 'gzip':

				    	zlib.gunzip(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            console.log(data);
				    	});
				        //response.pipe(zlib.createGunzip()).pipe(output);
				        break;
				    case 'deflate':
				        //response.pipe(zlib.createInflate()).pipe(output);
				        zlib.inflate(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            console.log(data);
				    	});
				        break;
				    default:
				        break;
				}

	        	//var myacinfo = findKeyString(content.toString(), "myacinfo");
	        	//var firstName = findKeyString(content.toString(), "firstName");

	        	//console.log(content.toString());
	        });
	    });  
	req.write(dataContent + "\n");  
	req.end();  


	req.on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
}

function ListDevicesAction(session)
{
	var dataContent = '<?xml version="1.0" encoding="UTF-8"?>\n\
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n\
<plist version="1.0">\n\
	<dict>\n\
		<key>clientId</key>\n\
		<string>XABBG36SBA</string>\n\
		<key>myacinfo</key>\n\
		<string>' + session.myacinfo + '</string>\n\
		<key>protocolVersion</key>\n\
		<string>QH65B2</string>\n\
		<key>requestId</key>\n\
		<string>' + uuid() + '</string>\n\
		<key>userLocale</key>\n\
		<array>\n\
			<string>en_US</string>\n\
		</array>\n\
		<key>DTDK_Platform</key>\n\
		<string>ios</string>\n\
		<key>teamId</key>\n\
		<string>5NZK9N5JVG</string>\n\
	</dict>\n\
</plist>';

	var opt = 
	{  
	    method: "POST",  
	    host: ProxyAddress2,
	    //host: "localhost",   
	    port: ProxyPort,

	    path: "https://developerservices2.apple.com/services/QH65B2/ios/listDevices.action?clientId=XABBG36SBA",
	    headers: {
	    	'Host': 'developerservices2.apple.com',
	    	'Proxy-Connection': 'keep-alive',
	    	'Content-Type': 'text/x-xml-plist',
	    	'X-Xcode-Version': '7.0 (7A120f)',
	    	'Cookie': 'myacinfo=' + session.myacinfo,
			'Accept-Language': 'en-us',
			'Accept': 'text/x-xml-plist',
			'Accept-Encoding': 'gzip, deflate',
			'Content-Length': dataContent.length,
			//'Connection': 'keep-alive',
			'User-Agent': 'Xcode'
	    }
	};  

	// console.log("Request: " + dataContent);

	var req = http.request(opt, function (res)
		{  
			// console.log("Got response: " + res.statusCode);
			// console.log("Got response headers: " + res.headers);

	        var bodyChunks = [];
	        var bodySize = 0;
	        

	        res.on('data', function (chunk)
	        {
	            // console.log("body: " + chunk);
	            // console.log(typeof chunk.copy);
	            bodyChunks.push(chunk);
	            bodySize += chunk.length;
	        });

	        res.on('end',function()
	        {
	        	var content = Buffer.concat(bodyChunks);

	        	// console.log(res.headers['content-encoding'])
	        	switch (res.headers['content-encoding'])
				{
				    // or, just use zlib.createUnzip() to handle both cases
				    case 'gzip':

				    	zlib.gunzip(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            console.log(data);
				    	});
				        //response.pipe(zlib.createGunzip()).pipe(output);
				        break;
				    case 'deflate':
				        //response.pipe(zlib.createInflate()).pipe(output);
				        zlib.inflate(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            console.log(data);
				    	});
				        break;
				    default:
				        break;
				}

	        	//var myacinfo = findKeyString(content.toString(), "myacinfo");
	        	//var firstName = findKeyString(content.toString(), "firstName");

	        	//console.log(content.toString());
	        });
	    });  
	req.write(dataContent + "\n");  
	req.end();  


	req.on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
}

function ListAllDevelopmentCertsAction(session, callback)
{
	var dataContent = '<?xml version="1.0" encoding="UTF-8"?>\n\
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n\
<plist version="1.0">\n\
	<dict>\n\
		<key>clientId</key>\n\
		<string>XABBG36SBA</string>\n\
		<key>myacinfo</key>\n\
		<string>' + session.myacinfo + '</string>\n\
		<key>protocolVersion</key>\n\
		<string>QH65B2</string>\n\
		<key>requestId</key>\n\
		<string>' + uuid() + '</string>\n\
		<key>userLocale</key>\n\
		<array>\n\
			<string>en_US</string>\n\
		</array>\n\
		<key>DTDK_Platform</key>\n\
		<string>ios</string>\n\
		<key>teamId</key>\n\
		<string>5NZK9N5JVG</string>\n\
	</dict>\n\
</plist>';

	var opt = 
	{  
	    method: "POST",  
	    host: ProxyAddress2,
	    //host: "localhost",   
	    port: ProxyPort,

	    path: "https://developerservices2.apple.com/services/QH65B2/ios/listAllDevelopmentCerts.action?clientId=XABBG36SBA",
	    headers: {
	    	'Host': 'developerservices2.apple.com',
	    	'Proxy-Connection': 'keep-alive',
	    	'Content-Type': 'text/x-xml-plist',
	    	'X-Xcode-Version': '7.0 (7A120f)',
	    	'Cookie': 'myacinfo=' + session.myacinfo,
			'Accept-Language': 'en-us',
			'Accept': 'text/x-xml-plist',
			'Accept-Encoding': 'gzip, deflate',
			'Content-Length': dataContent.length,
			//'Connection': 'keep-alive',
			'User-Agent': 'Xcode'
	    }
	};  

	// console.log("Request: " + dataContent);

	var req = http.request(opt, function (res)
		{  
			// console.log("Got response: " + res.statusCode);
			// console.log("Got response headers: " + res.headers);

	        var bodyChunks = [];
	        var bodySize = 0;
	        

	        res.on('data', function (chunk)
	        {
	            // console.log("body: " + chunk);
	            // console.log(typeof chunk.copy);
	            bodyChunks.push(chunk);
	            bodySize += chunk.length;
	        });

	        res.on('end',function()
	        {
	        	var content = Buffer.concat(bodyChunks);

	        	// console.log(res.headers['content-encoding'])
	        	switch (res.headers['content-encoding'])
				{
				    // or, just use zlib.createUnzip() to handle both cases
				    case 'gzip':

				    	zlib.gunzip(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            callback(session, data);
				            // console.log(data);
				    	});
				        //response.pipe(zlib.createGunzip()).pipe(output);
				        break;
				    case 'deflate':
				        //response.pipe(zlib.createInflate()).pipe(output);
				        zlib.inflate(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            callback(session, data);
				            // console.log(data);
				    	});
				        break;
				    default:
				    	callback(session, content);
				        break;
				}

				
	        	
	        	// var myacinfo = findKeyString(content.toString(), "myacinfo");
	        	//var firstName = findKeyString(content.toString(), "firstName");

	        	//console.log(content.toString());
	        });
	    });  
	req.write(dataContent + "\n");  
	req.end();  


	req.on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
}

function ListAppIdsAction(session, callback)
{
	var dataContent = '<?xml version="1.0" encoding="UTF-8"?>\n\
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n\
<plist version="1.0">\n\
	<dict>\n\
		<key>clientId</key>\n\
		<string>XABBG36SBA</string>\n\
		<key>myacinfo</key>\n\
		<string>' + session.myacinfo + '</string>\n\
		<key>protocolVersion</key>\n\
		<string>QH65B2</string>\n\
		<key>requestId</key>\n\
		<string>' + uuid() + '</string>\n\
		<key>userLocale</key>\n\
		<array>\n\
			<string>en_US</string>\n\
		</array>\n\
		<key>DTDK_Platform</key>\n\
		<string>ios</string>\n\
		<key>teamId</key>\n\
		<string>5NZK9N5JVG</string>\n\
	</dict>\n\
</plist>';

	var opt = 
	{  
	    method: "POST",  
	    host: ProxyAddress2,
	    //host: "localhost",   
	    port: ProxyPort,

	    path: "https://developerservices2.apple.com/services/QH65B2/ios/listAppIds.action?clientId=XABBG36SBA",
	    headers: {
	    	'Host': 'developerservices2.apple.com',
	    	'Proxy-Connection': 'keep-alive',
	    	'Content-Type': 'text/x-xml-plist',
	    	'X-Xcode-Version': '7.0 (7A120f)',
	    	'Cookie': 'myacinfo=' + session.myacinfo,
			'Accept-Language': 'en-us',
			'Accept': 'text/x-xml-plist',
			'Accept-Encoding': 'gzip, deflate',
			'Content-Length': dataContent.length,
			//'Connection': 'keep-alive',
			'User-Agent': 'Xcode'
	    }
	};  

	// console.log("Request: " + dataContent);

	var req = http.request(opt, function (res)
		{  
			// console.log("Got response: " + res.statusCode);
			// console.log("Got response headers: " + res.headers);

	        var bodyChunks = [];
	        var bodySize = 0;
	        

	        res.on('data', function (chunk)
	        {
	            // console.log("body: " + chunk);
	            // console.log(typeof chunk.copy);
	            bodyChunks.push(chunk);
	            bodySize += chunk.length;
	        });

	        res.on('end',function()
	        {
	        	var content = Buffer.concat(bodyChunks);

	        	// console.log(res.headers['content-encoding'])
	        	switch (res.headers['content-encoding'])
				{
				    // or, just use zlib.createUnzip() to handle both cases
				    case 'gzip':

				    	zlib.gunzip(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            // console.log(data);
				            callback(session, data);
				    	});
				        //response.pipe(zlib.createGunzip()).pipe(output);
				        break;
				    case 'deflate':
				        //response.pipe(zlib.createInflate()).pipe(output);
				        zlib.inflate(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            callback(session, data);
				    	});
				        break;
				    default:
				    	callback(session, content.toString());
				        break;
				}

	        	//var myacinfo = findKeyString(content.toString(), "myacinfo");
	        	//var firstName = findKeyString(content.toString(), "firstName");

	        	// console.log(content.toString());
	        	
	        });
	    });  
	req.write(dataContent + "\n");  
	req.end();  


	req.on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
}

function addAppIdAction(session, callback)
{
	var dataContent = '<?xml version="1.0" encoding="UTF-8"?>\n\
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n\
<plist version="1.0">\n\
	<dict>\n\
		<key>clientId</key>\n\
		<string>XABBG36SBA</string>\n\
		<key>myacinfo</key>\n\
		<string>' + session.myacinfo + '</string>\n\
		<key>protocolVersion</key>\n\
		<string>QH65B2</string>\n\
		<key>requestId</key>\n\
		<string>' + uuid() + '</string>\n\
		<key>userLocale</key>\n\
		<array>\n\
			<string>en_US</string>\n\
		</array>\n\
		<key>entitlements</key>\n\
		<array>\n\
		</array>\n\
		<key>identifier</key>\n\
		<string>' + session.bundleId + '</string>\n\
		<key>name</key>\n\
		<string>CY-Debugger</string>\n\
		<key>teamId</key>\n\
		<string>5NZK9N5JVG</string>\n\
	</dict>\n\
</plist>';

	var opt = 
	{  
	    method: "POST",  
	    host: ProxyAddress2,
	    //host: "localhost",   
	    port: ProxyPort,

	    path: "https://developerservices2.apple.com/services/QH65B2/ios/addAppId.action?clientId=XABBG36SBA",
	    headers: {
	    	'Host': 'developerservices2.apple.com',
	    	'Proxy-Connection': 'keep-alive',
	    	'Content-Type': 'text/x-xml-plist',
	    	'X-Xcode-Version': '7.0 (7A120f)',
	    	'Cookie': 'myacinfo=' + session.myacinfo,
			'Accept-Language': 'en-us',
			'Accept': 'text/x-xml-plist',
			'Accept-Encoding': 'gzip, deflate',
			'Content-Length': dataContent.length,
			//'Connection': 'keep-alive',
			'User-Agent': 'Xcode'
	    }
	};  

	// console.log("Request: " + dataContent);

	var req = http.request(opt, function (res)
		{  
			// console.log("Got response: " + res.statusCode);
			// console.log("Got response headers: " + res.headers);

	        var bodyChunks = [];
	        var bodySize = 0;
	        

	        res.on('data', function (chunk)
	        {
	            // console.log("body: " + chunk);
	            // console.log(typeof chunk.copy);
	            bodyChunks.push(chunk);
	            bodySize += chunk.length;
	        });

	        res.on('end',function()
	        {
	        	var content = Buffer.concat(bodyChunks);

	        	// console.log(res.headers['content-encoding'])
	        	switch (res.headers['content-encoding'])
				{
				    // or, just use zlib.createUnzip() to handle both cases
				    case 'gzip':

				    	zlib.gunzip(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            // console.log(data);

				            callback(session, data);
				    	});
				        //response.pipe(zlib.createGunzip()).pipe(output);
				        break;
				    case 'deflate':
				        //response.pipe(zlib.createInflate()).pipe(output);
				        zlib.inflate(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            // console.log(data);

				            callback(session, data);
				    	});
				        break;
				    default:
				        break;
				}


	        	
	        	
	        });
	    });  
	req.write(dataContent + "\n");  
	req.end();  


	req.on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
}

function DeleteAppIdAction(session, appIdId, callback)
{
	var dataContent = 
`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
	<dict>
		<key>clientId</key>
		<string>XABBG36SBA</string>
		<key>myacinfo</key>
		<string>${session.myacinfo}</string>
		<key>protocolVersion</key>
		<string>QH65B2</string>
		<key>requestId</key>
		<string>${uuid()}</string>
		<key>userLocale</key>
		<array>
			<string>en_US</string>
		</array>
		<key>entitlements</key>
		<array>
		</array>
		<key>appIdId</key>
		<string>${appIdId}</string>
		<key>identifier</key>
		<string>${session.bundleId}</string>
		<key>name</key>
		<string>CY-Debugger</string>
		<key>teamId</key>
		<string>5NZK9N5JVG</string>
	</dict>
</plist>`;

	var opt = 
	{  
	    method: "POST",  
	    host: ProxyAddress2,
	    //host: "localhost",   
	    port: ProxyPort,

	    path: "https://developerservices2.apple.com/services/QH65B2/ios/deleteAppId.action?clientId=XABBG36SBA",
	    headers: {
	    	'Host': 'developerservices2.apple.com',
	    	'Proxy-Connection': 'keep-alive',
	    	'Content-Type': 'text/x-xml-plist',
	    	'X-Xcode-Version': '7.0 (7A120f)',
	    	'Cookie': 'myacinfo=' + session.myacinfo,
			'Accept-Language': 'en-us',
			'Accept': 'text/x-xml-plist',
			'Accept-Encoding': 'gzip, deflate',
			'Content-Length': dataContent.length,
			//'Connection': 'keep-alive',
			'User-Agent': 'Xcode'
	    }
	};  

	// console.log("Request: " + dataContent);

	var req = http.request(opt, function (res)
		{  
			// console.log("Got response: " + res.statusCode);
			// console.log("Got response headers: " + res.headers);

	        var bodyChunks = [];
	        var bodySize = 0;
	        

	        res.on('data', function (chunk)
	        {
	            // console.log("body: " + chunk);
	            // console.log(typeof chunk.copy);
	            bodyChunks.push(chunk);
	            bodySize += chunk.length;
	        });

	        res.on('end',function()
	        {
	        	var content = Buffer.concat(bodyChunks);

	        	// console.log(res.headers['content-encoding'])
	        	switch (res.headers['content-encoding'])
				{
				    // or, just use zlib.createUnzip() to handle both cases
				    case 'gzip':

				    	zlib.gunzip(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            // console.log(data);

				            callback(session, data);
				    	});
				        //response.pipe(zlib.createGunzip()).pipe(output);
				        break;
				    case 'deflate':
				        //response.pipe(zlib.createInflate()).pipe(output);
				        zlib.inflate(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            // console.log(data);

				            callback(session, data);
				    	});
				        break;
				    default:
				        break;
				}


	        	
	        	
	        });
	    });  
	req.write(dataContent + "\n");  
	req.end();  


	req.on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
}
function addDeviceIdAction(session, deviceNumber)
{
	var dataContent = '<?xml version="1.0" encoding="UTF-8"?>\n\
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n\
<plist version="1.0">\n\
	<dict>\n\
		<key>clientId</key>\n\
		<string>XABBG36SBA</string>\n\
		<key>myacinfo</key>\n\
		<string>' + session.myacinfo + '</string>\n\
		<key>protocolVersion</key>\n\
		<string>QH65B2</string>\n\
		<key>requestId</key>\n\
		<string>' + uuid() + '</string>\n\
		<key>userLocale</key>\n\
		<array>\n\
			<string>en_US</string>\n\
		</array>\n\
		<key>DTDK_Platform</key>\n\
		<string>ios</string>\n\
		<key>deviceNumber</key>\n\
		<string>' + deviceNumber + '</string>\n\
		<key>name</key>\n\
		<string>iPad</string>\n\
		<key>teamId</key>\n\
		<string>5NZK9N5JVG</string>\n\
	</dict>\n\
</plist>';

	var opt = 
	{  
	    method: "POST",  
	    host: ProxyAddress2,
	    //host: "localhost",   
	    port: ProxyPort,

	    path: "https://developerservices2.apple.com/services/QH65B2/ios/addDevice.action?clientId=XABBG36SBA",
	    headers: {
	    	'Host': 'developerservices2.apple.com',
	    	'Proxy-Connection': 'keep-alive',
	    	'Content-Type': 'text/x-xml-plist',
	    	'X-Xcode-Version': '7.0 (7A120f)',
	    	'Cookie': 'myacinfo=' + session.myacinfo,
			'Accept-Language': 'en-us',
			'Accept': 'text/x-xml-plist',
			'Accept-Encoding': 'gzip, deflate',
			'Content-Length': dataContent.length,
			//'Connection': 'keep-alive',
			'User-Agent': 'Xcode'
	    }
	};  

	// console.log("Request: " + dataContent);

	var req = http.request(opt, function (res)
		{  
			// console.log("Got response: " + res.statusCode);
			// console.log("Got response headers: " + res.headers);

	        var bodyChunks = [];
	        var bodySize = 0;
	        

	        res.on('data', function (chunk)
	        {
	            // console.log("body: " + chunk);
	            // console.log(typeof chunk.copy);
	            bodyChunks.push(chunk);
	            bodySize += chunk.length;
	        });

	        res.on('end',function()
	        {
	        	var content = Buffer.concat(bodyChunks);

	        	// console.log(res.headers['content-encoding'])
	        	switch (res.headers['content-encoding'])
				{
				    // or, just use zlib.createUnzip() to handle both cases
				    case 'gzip':

				    	zlib.gunzip(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            console.log(data);
				    	});
				        //response.pipe(zlib.createGunzip()).pipe(output);
				        break;
				    case 'deflate':
				        //response.pipe(zlib.createInflate()).pipe(output);
				        zlib.inflate(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            console.log(data);
				    	});
				        break;
				    default:
				        break;
				}

	        	//var myacinfo = findKeyString(content.toString(), "myacinfo");
	        	//var firstName = findKeyString(content.toString(), "firstName");

	        	//console.log(content.toString());
	        });
	    });  
	req.write(dataContent + "\n");  
	req.end();  


	req.on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
}

function downloadTeamProvisioningProfile(session, appIdId, callback)
{
	var dataContent = '<?xml version="1.0" encoding="UTF-8"?>\n\
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n\
<plist version="1.0">\n\
	<dict>\n\
		<key>clientId</key>\n\
		<string>XABBG36SBA</string>\n\
		<key>myacinfo</key>\n\
		<string>' + session.myacinfo + '</string>\n\
		<key>protocolVersion</key>\n\
		<string>QH65B2</string>\n\
		<key>requestId</key>\n\
		<string>' + uuid() + '</string>\n\
		<key>userLocale</key>\n\
		<array>\n\
			<string>en_US</string>\n\
		</array>\n\
		<key>DTDK_Platform</key>\n\
		<string>ios</string>\n\
		<key>appIdId</key>\n\
		<string>' + appIdId + '</string>\n\
		<key>teamId</key>\n\
		<string>5NZK9N5JVG</string>\n\
	</dict>\n\
</plist>';

	var opt = 
	{  
	    method: "POST",  
	    host: ProxyAddress2,
	    //host: "localhost",   
	    port: ProxyPort,

	    path: "https://developerservices2.apple.com/services/QH65B2/ios/downloadTeamProvisioningProfile.action?clientId=XABBG36SBA",
	    headers: {
	    	'Host': 'developerservices2.apple.com',
	    	'Proxy-Connection': 'keep-alive',
	    	'Content-Type': 'text/x-xml-plist',
	    	'X-Xcode-Version': '7.0 (7A120f)',
	    	'Cookie': 'myacinfo=' + session.myacinfo,
			'Accept-Language': 'en-us',
			'Accept': 'text/x-xml-plist',
			'Accept-Encoding': 'gzip, deflate',
			'Content-Length': dataContent.length,
			//'Connection': 'keep-alive',
			'User-Agent': 'Xcode'
	    }
	};  

	// console.log("Request: " + dataContent);

	var req = http.request(opt, function (res)
		{  
			// console.log("Got response: " + res.statusCode);
			// console.log("Got response headers: " + res.headers);

	        var bodyChunks = [];
	        var bodySize = 0;
	        

	        res.on('data', function (chunk)
	        {
	            // console.log("body: " + chunk);
	            // console.log(typeof chunk.copy);
	            bodyChunks.push(chunk);
	            bodySize += chunk.length;
	        });

	        res.on('end',function()
	        {
	        	var content = Buffer.concat(bodyChunks);
	        	// var content = concatBuffer(bodyChunks, bodySize);

	        	// console.log(res.headers['content-encoding'])
	        	switch (res.headers['content-encoding'])
				{
				    // or, just use zlib.createUnzip() to handle both cases
				    case 'gzip':

				    	zlib.gunzip(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            // console.log(data);
				            callback(session, data);
				    	});
				        //response.pipe(zlib.createGunzip()).pipe(output);
				        break;
				    case 'deflate':
				        //response.pipe(zlib.createInflate()).pipe(output);
				        zlib.inflate(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            // console.log(data);
				            callback(session, data);
				    	});
				        break;
				    default:
				    	callback(session, content.toString());
				        break;
				}

	        	//var myacinfo = findKeyString(content.toString(), "myacinfo");
	        	//var firstName = findKeyString(content.toString(), "firstName");
	        	
	        	// console.log(content.toString());
	        });
	    });  
	req.write(dataContent + "\n");  
	req.end();  


	req.on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
}


function RevokeDevelopmentCertAction(session, serialNumber, callback)
{
	var dataContent = 
`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
	<dict>
		<key>clientId</key>
		<string>XABBG36SBA</string>
		<key>myacinfo</key>
		<string>${session.myacinfo}</string>
		<key>protocolVersion</key>
		<string>QH65B2</string>
		<key>requestId</key>
		<string>${uuid()}</string>
		<key>userLocale</key>
		<array>
			<string>en_US</string>
		</array>
		<key>entitlements</key>
		<array>
		</array>
		<key>serialNumber</key>
		<string>${serialNumber}</string>
		<key>teamId</key>
		<string>5NZK9N5JVG</string>
	</dict>
</plist>`;

	var opt = 
	{  
	    method: "POST",  
	    host: ProxyAddress2,
	    //host: "localhost",   
	    port: ProxyPort,

	    path: "https://developerservices2.apple.com/services/QH65B2/ios/revokeDevelopmentCert.action?clientId=XABBG36SBA",
	    headers: {
	    	'Host': 'developerservices2.apple.com',
	    	'Proxy-Connection': 'keep-alive',
	    	'Content-Type': 'text/x-xml-plist',
	    	'X-Xcode-Version': '7.0 (7A120f)',
	    	'Cookie': 'myacinfo=' + session.myacinfo,
			'Accept-Language': 'en-us',
			'Accept': 'text/x-xml-plist',
			'Accept-Encoding': 'gzip, deflate',
			'Content-Length': dataContent.length,
			//'Connection': 'keep-alive',
			'User-Agent': 'Xcode'
	    }
	};  

	// console.log("Request: " + dataContent);

	var req = http.request(opt, function (res)
		{  
			// console.log("Got response: " + res.statusCode);
			// console.log("Got response headers: " + res.headers);

	        var bodyChunks = [];
	        var bodySize = 0;
	        

	        res.on('data', function (chunk)
	        {
	            // console.log("body: " + chunk);
	            // console.log(typeof chunk.copy);
	            bodyChunks.push(chunk);
	            bodySize += chunk.length;
	        });

	        res.on('end',function()
	        {
	        	var content = Buffer.concat(bodyChunks);

	        	// console.log(res.headers['content-encoding'])
	        	switch (res.headers['content-encoding'])
				{
				    // or, just use zlib.createUnzip() to handle both cases
				    case 'gzip':

				    	zlib.gunzip(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            // console.log(data);

				            callback(session, data);
				    	});
				        //response.pipe(zlib.createGunzip()).pipe(output);
				        break;
				    case 'deflate':
				        //response.pipe(zlib.createInflate()).pipe(output);
				        zlib.inflate(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            // console.log(data);

				            callback(session, data);
				    	});
				        break;
				    default:
				        break;
				}


	        	
	        	
	        });
	    });  
	req.write(dataContent + "\n");  
	req.end();  


	req.on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
}

function addXcodeDevelopmentCSR(session, csrContent, callback)
{
	var dataContent = 
`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"> 
	<dict> 
		<key>clientId</key> 
		<string>XABBG36SBA</string> 
		<key>myacinfo</key> 
		<string>${session.myacinfo}</string> 
		<key>protocolVersion</key> 
		<string>QH65B2</string> 
		<key>requestId</key> 
		<string>${uuid()}</string> 
		<key>userLocale</key> 
		<array> 
			<string>en_US</string> 
		</array> 
		<key>DTDK_Platform</key> 
		<string>ios</string> 
		<key>csrContent</key> 
		<string>${csrContent} </string> 
		<key>teamId</key> 
		<string>5NZK9N5JVG</string> 
	</dict> 
</plist>`

	var opt = 
	{  
	    method: "POST",  
	    host: ProxyAddress2,
	    //host: "localhost",   
	    port: ProxyPort,

	    path: "https://developerservices2.apple.com/services/QH65B2/ios/submitDevelopmentCSR.action?clientId=XABBG36SBA",
	    headers: {
	    	'Host': 'developerservices2.apple.com',
	    	'Proxy-Connection': 'keep-alive',
	    	'Content-Type': 'text/x-xml-plist',
	    	'X-Xcode-Version': '7.0 (7A120f)',
	    	'Cookie': 'myacinfo=' + session.myacinfo,
			'Accept-Language': 'en-us',
			'Accept': 'text/x-xml-plist',
			'Accept-Encoding': 'gzip, deflate',
			'Content-Length': dataContent.length,
			//'Connection': 'keep-alive',
			'User-Agent': 'Xcode'
	    }
	};  

	// console.log("Request: " + dataContent);

	var req = http.request(opt, function (res)
		{  
			// console.log("Got response: " + res.statusCode);
			// console.log("Got response headers: " + res.headers);

	        var bodyChunks = [];
	        var bodySize = 0;
	        

	        res.on('data', function (chunk)
	        {
	            // console.log("body: " + chunk);
	            // console.log(typeof chunk.copy);
	            bodyChunks.push(chunk);
	            bodySize += chunk.length;
	        });

	        res.on('end',function()
	        {
	        	var content = Buffer.concat(bodyChunks);
	        	// var content = concatBuffer(bodyChunks, bodySize);

	        	// console.log(res.headers['content-encoding'])
	        	switch (res.headers['content-encoding'])
				{
				    // or, just use zlib.createUnzip() to handle both cases
				    case 'gzip':

				    	zlib.gunzip(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            // console.log(data);
				            callback(session, data);
				    	});
				        //response.pipe(zlib.createGunzip()).pipe(output);
				        break;
				    case 'deflate':
				        //response.pipe(zlib.createInflate()).pipe(output);
				        zlib.inflate(content, function (err, decoded)
				    	{
				            var data = decoded.toString();
				            // console.log(data);
				            callback(session, data);
				    	});
				        break;
				    default:
				    	callback(session, content.toString());
				        break;
				}

	        	//var myacinfo = findKeyString(content.toString(), "myacinfo");
	        	//var firstName = findKeyString(content.toString(), "firstName");
	        	
	        	// console.log(content.toString());
	        });
	    });  
	req.write(dataContent + "\n");  
	req.end();  


	req.on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
}

function base64ToUint(string)
{
    var byteString = atob(string);
    var uintArray = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++)
    {
        uintArray[i] = byteString.charCodeAt(i);
    }
    return uintArray;
};

function readline(text, callback)
{
    var rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout});

    rl.question(text + " > ", function (answer) {
        rl.close();
        //console.log(answer.trim());
        callback(answer.trim())
    });
};

var session = {
	appleId: "",
	password: "",
};

session = require("./legend-settings.js").session;

function parseFromResponseOfappIdId(content)
{
	var object = {};
	var offset = 0;
	var isFound = false;

	while (offset >= 0)
	{
		offset = findObjectString(content, object, "appIdId", offset);

		if (offset == -1) break;

		offset = findObjectString(content, object, "identifier", offset);

		if (offset > 0 && object.appIdId && (object.identifier == session.bundleId))
		{
			isFound = true;
			break;
		}
	}

	return isFound ? object.appIdId : undefined;
}





function response_oldIdentifier(session, content)
{
	var appIdId = parseFromResponseOfappIdId(content);

	if (appIdId)
	{
		request_downloadTeamProvisioningProfile(session, appIdId);
	}
	else
	{
		ListAppIdsAction(session, response_newIdentifier);
	}
}

function response_newIdentifier(session, content)
{
	var appIdId = parseFromResponseOfappIdId(content);

	if (appIdId == undefined)
	{
		addAppIdAction(session, function (session, content)
		{
			var appIdId = findKeyString(content.toString(), "appIdId");
        	var firstName = findKeyString(content.toString(), "firstName");
        
        	console.log("create appIdId " + appIdId);

        	request_downloadTeamProvisioningProfile(session, appIdId);
		});
	}
	else
	{
		DeleteAppIdAction(session, appIdId, function ()
		{
			console.log("delete appIdId " + appIdId);
			ListAppIdsAction(session, response_newIdentifier);
		});
	}
}

function request_downloadTeamProvisioningProfile(session, appIdId)
{
	console.log("request appIdId " + appIdId);

	downloadTeamProvisioningProfile(session, appIdId, function (session, content)
	{
    	var encodedProfile = findKeyData(content.toString(), "encodedProfile");
    	
			if (encodedProfile)
			{
				var timeString = new Date().toISOString();
				var dataBuffer = Buffer.from(encodedProfile, "base64");
				fs.writeFileSync(session.bundleId + "_" + timeString.slice(0, 10) + ".mobileprovision", dataBuffer);
				console.log("mobileprovision generated. " + session.bundleId);
			}
			else
			{
				var result = findKeyString(content.toString(), "resultString");
				console.log(result);
			}	
	});
}


function response_oldIdentifier(session, content)
{
	var appIdId = parseFromResponseOfappIdId(content);

	if (appIdId)
	{
		request_downloadTeamProvisioningProfile(session, appIdId);
	}
	else
	{
		ListAppIdsAction(session, response_newIdentifier);
	}
}

function query_useNewCertification(session)
{
    readline("获取旧的证书吗？", function (response)
    {
        if (response == "y")
        {
            ListAppIdsAction(session, response_oldIdentifier);
            return
        }
        else if (response == "n")
        {
        	ListAppIdsAction(session, response_newIdentifier);
            return
        }

        query_useNewCertification(session);
    })
}




var bundleIdsList = [
	// "CY-Application.Debugger",
	// "com.ereach.201401.ios.apple-eintsoft-com.VeevaSimulator",
	"Legend.ShinobiControls.Practice-TPO",
	"Legend.ShinobiControls.Practice-50x50",
	"Legend.ShinobiControls.TextKitNotepad",
];

bundleIdsList = require("./legend-settings.js").bundleIds;


RequestSessionAction(session, function (session)
	{
		for (var i=0,n=bundleIdsList.length; i<n; i++)
    	{
    		var identifier = bundleIdsList[i];
    		console.log(i + ": " + identifier);
    	}

    	function query_newIdentifier(text)
		{
		    var index = parseInt(text);

		    if (index>=0 && index<bundleIdsList.length)
		    {
		    	session.bundleId = bundleIdsList[index];

		    	ListAppIdsAction(session, function (session, content)
		    	{
		    		var appIdId = parseFromResponseOfappIdId(content);

					if (appIdId)
					{
						query_useNewCertification(session)
					}
					else
					{
						response_newIdentifier(session, content)
					}
		    	});
		    }

		    
		}


    	readline("which", query_newIdentifier)
		// session.identifier = "com.eintsoft.project.201401.ios.apple-eintsoft-com.BD";
		// session.identifier = "com.eintsoft.project.201401.ios.apple-eintsoft-com.BD-2";
		// session.identifier = "com.bd.Veeva.LScript";
		
		var csr = fs.readFileSync("CertificateSigningRequest.certSigningRequest").toString();
		// addXcodeDevelopmentCSR(session, csr, function (session, data)
		// 	{
		// 		var content = data.toString();

		// 		var resultCode = findKeyInteger(content, "resultCode");
		// 		var userString = findKeyString(content, "userString");

		// 		if (resultCode != "0")
		// 		{
		// 			console.log(userString);
		// 		}

		// 	});
		// 获取信息正常步骤
		
		// ListTeamsAction(session, function (){});
		//ListDevicesAction(session, function (){});
		//ListAppIdsAction(session, function (){})


		
		// RevokeDevelopmentCertAction(session, "E8002994D5ED27C", function (){});
  		ListAllDevelopmentCertsAction(session, function (session, data)
    		{
    			var content = data.toString();

    // 			var resultCode = findKeyInteger(content, "resultCode");
				// var userString = findKeyString(content, "userString");

				// if (resultCode != "0")
				// {
				// 	console.log(userString);
				// 	return
				// }

    			var name = findKeyString(content, "name");
    			var certContent = findKeyData(content, "certContent");


    			if (certContent)
    			{
    				var timeString = new Date().toISOString();
    				var dataBuffer = Buffer.from(certContent, "base64");
					fs.writeFileSync(name + ".cer", dataBuffer);
    			}
    			else
    			{
    				var result = findKeyString(content, "resultString");
					console.log(result);
    			}
    		});

 
  		// downloadDevelopmentCert()
    	// https://developerservices2.apple.com/services/QH65B2/ios/downloadDevelopmentCert.action?clientId=XABBG36SBA()

    	
    	// addDeviceIdAction(session, "1b76004e13805409582728766a3d341d5f912733");
		// addDeviceIdAction(session, "eeaed0cfeff6da5c1bd28a2f88d8f787d9cdf5d7");
    	
    	//ipad mini3
    	// addDeviceIdAction(session, "edd9a1344bbed957aab9872961135ec76e693a56");
    	
	});
