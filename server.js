const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const socketIO = require("socket.io");
const http = require("http");
const fs=require('fs');
const path=require('path');
var session = require('express-session');

const API_PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
//app.use(cors({origin:"http://localhost:3000",credentials:true}));
app.options('*',cors());
const router = express.Router();
/*const httpsOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./server.crt')
  }*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret: 'ssshhhhh'}));
app.use(logger("dev"));
app.use("/", router);

var {fileModel}=require('./model/model');
mongoose.Promise=global.Promise;
mongoose.connect('mongodb+srv://sam2506:sam@1pra2suj@cluster0-blbpi.mongodb.net/test?retryWrites=true',{
    useNewUrlParser: true,
    ssl: true,
    retryWrites: true,
})
//mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/filemodel");

//var server=http.createServer(httpsOptions,app);
var server=http.createServer(app);
var io=socketIO(server,{
    handlePreflightRequest: (req, res) => {
        //console.log(req.headers.origin);
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});
io.set('origins', '*:*');
// io.configure(function(){ 
//io.set("transports", ["xhr-polling"]); 
// io.set("polling duration", 10); 
// }); 
var sess,no;

app.use(function(req, res, next) {
    var allowedOrigins = ['http://0.0.0.0:3001','http://127.0.0.1:8020', 'http://localhost:8020', 'http://127.0.0.1:9000', 'https://p2pfs.herokuapp.com'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});

fileModel.watch().on('change',(data)=>{
    var id=data.documentKey._id;
    fileModel.findById(id,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            if(result.files.length>0){
                var length=result.files.length;
                io.emit('newFile',{updatedFile:result.files[length-1]})
            }
        }
    })
});

app.get('/api',function(req,res){
    console.log("new user connected");
    fileModel.find({online: true},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            if(result){
                var allUploadedFiles=[];
                result.forEach(function(user){
                    for(var iter=0;iter<user.files.length;iter++){
                        allUploadedFiles.push(user.files[iter]);
                    }
                })
                res.send({uploadedFiles: allUploadedFiles});
            }
        }
    })
})

app.post('/signup',function(req,res){
    var file=new fileModel({
        files: [],
        fname: req.body.firstName,
        lname: req.body.lastName,
        email: req.body.email,
        pwd: req.body.password,
        online: false
    });
    file.save();
    res.end();
});

app.post('/login',function(req,res){
    sess=req.session;
    fileModel.findOne({email: req.body.email},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            if(result){
                if(req.body.password===result.pwd){
                    sess.email=req.body.email;
                    fileModel.findOneAndUpdate({email: req.body.email},{online: true},function(err1,result1){
                        res.send("valid");
                    });
                }
                else{
                    console.log("Wrong email or password");
                }
            }
            else{
                console.log("you need to sign up first");
            }
        }
    }) 
})

app.post('/logout',function(req,res){
    console.log(req.body.email);
    fileModel.findOneAndUpdate({email: req.body.email},{online: false,$pull:{files:{}}},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            if(result){
                console.log("loggedout");
            }
            else
            console.log("patanhi");
            io.emit('logout',{email: req.body.email});
            res.end();
        }
    })
})

app.post('/upload',function(req,res){
    sess=req.session;
    console.log(req.body.fileName);
    console.log(req.body.fileSize);
    console.log(sess.email);
    fileModel.findOneAndUpdate({email: req.body.email},{$addToSet:{files: {Email: req.body.email,name: req.body.fileName,size: req.body.fileSize}}},function(err,result){
        if(result)
            console.log("done");  
        res.end();
    });
});

sendSignal=(roomName,size)=>{
    fileModel.find({online: true},function(err,res){
        var cnt=0;
        res.forEach(function(user){
            for(var i=0;i<user.files.length;i++){
                if(user.files[i].name===roomName){
                    var email=user.email;
                    //console.log("aur ye");
                    io.emit(''+email,{fileName: roomName,number: no});
                    no++;
                }
            }
        })
        if(((no)*1024*1024)<size)
            sendSignal(roomName,size);
        /*else{
            return;
        }*/
    })
}

io.on("connection",function(socket){
    // socket.on("filesend",function(file){
    //     io.emit("fileret",file);
    // })
    //console.log(process.env.NODE_ENV);
    socket.on('joinRoom',function(file){
        var roomName=file.fileName;
        socket.join(''+roomName);
        var room = io.sockets.adapter.rooms[''+roomName];
        var noOfClients=room.length;
        no=0;
        
        if(noOfClients>=1)
        {
            sendSignal(roomName,file.fileSize);
            //socket.leave(''+roomName);
        }
        //sendSignal(noOfClients,room,roomName,file.fileSize);

    })
    socket.on('sendFile',function(info){
        console.log("ye aaya");
        console.log(info.data);
        socket.to(''+info.room).emit('recieve',{room:info.room,data: info.data,number: info.number,size: info.size});
    })
    socket.on('leaveRoom',function(info){
        console.log(info.room);
        socket.leave(''+info.room);
        io.emit('left',{});
    })
})

if(process.env.NODE_ENV==='production'){
    //console.log('env');
    /*app.use(express.static('/client'));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'client','build','index.html'));
    })*/
}

server.listen(API_PORT,'0.0.0.0',() => console.log(`LISTENING ON PORT ${API_PORT}`));


