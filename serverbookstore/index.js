var express= require('express')
var app=express()

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
//cors
//var cors = require('cors')
var cors = require('cors')
//bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;
//jwt

//var jwt = require('json');
const secretKey = 'hongaibiet';

app.use(cors());
//multwr
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" ||
         file.mimetype=="image/png" ||
         file.mimetype=="image/jpg" ||
         file.mimetype=="image/jpeg"
         
         
         ){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("bookimage");

app.set("view engine","ejs")
app.set("views","./views")

app.use(express.static("public"))

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

var mongoose=require('mongoose')
mongoose.connect('mongodb+srv://phatbebong115:hIbOlbgown04SU9I@cluster0-h9nea.mongodb.net/user?retryWrites=true&w=majority', {useNewUrlParser: true,useUnifiedTopology:true},function(err){
    if(err){
        console.log("loi")
    }else{
        console.log("connect thanh cong")
    }
});
//Model
const category=require("./model/category")
const Book=require("./model/book")
const User = require("./model/user")


app.post('/api/register', (req, res) => {
	User.findOne({ username: req.body.username }, (err, item) => {
		if (item != null) {
			res.json({ kq: 0, message: 'Duplicate username' })
		} else {
			bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
				if (!err) {
					let user = new User({
						username: req.body.username,
						password: hash,
						name: req.body.name,
						email: req.body.email,
						random: '',
						active: false
					});
					user.save(err => {
						if (err) {
							res.json({ kq: 0, message: 'Save failse' + err });
						} else {
							res.json({ kq: 1, message: 'save success' })
						}
					})
				}
			})
		}
	});
});

app.post('/api/login', (req, res) => {
	User.findOne({ username: req.body.username }, (err, item) => {
		if (err) {
			res.json({ kq: 0, message: 'error:' + err });
		} else {
			bcrypt.compare(req.body.password, item.password).then(function (response) {
				if (response) {
					console.log('login success');
					let token = jwt.sign({ id: item._id, username: item.username }, secretKey);
					res.json({
						kq: 1,
						token: token
					});
					console.log(token);
				}
			});
		}
	});
});



app.listen(3000)
app.get("/",function(req,res){

    res.render("home")
})

//hIbOlbgown04SU9I
app.get("/cate",function(req,res){
    res.render("cate")
})
app.post("/cate",function(req,res){

    var newCate= new category({
        name:req.body.txtcate,
        Book_id:[]
    })
    newCate.save(function(err){
        if(err){
            console.log("save err")
            res.json({kq:0})
        }else{
            console.log("save thanhcong")
            res.json({kq:1})
        }
    })
})


app.get("/book",function(req,res){

category.find(function(err,item){
    if(err){
        res.send("err send loi")
    }else{
        console.log(item)
        res.render("book",{cates:item})
    }
})

})
app.post("/book",function(req,res){
    //upload img
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log("A Multer error occurred when uploading."); 
          res.json({kq:0})
        } else if (err) {
          console.log("An unknown error occurred when uploading." + err);
        }else{
            console.log("Upload is okay");
            console.log(req.file); // Thông tin file đã upload
            //res.send({kq:1})
            //savebook
            var book= new Book({
                name:req.body.txtname,

                image:req.file.fieldname,
                file:req.body.txtfile
            })
            
            book.save(function(err){
                if(err){
                    console.log("save book loi")
                }else{
                    category.findByIdAndUpdate({_id:req.body.selectcate},{$push:{Book_id:book._id}},
                        function(err,item){
                            if(err){
                               res.json({kq:0})
                            }else{
                                console.log(item)
                                res.json({kq:1})
                            }
            
                    })
                }
            })
        }

    });
})
app.post('/api/cate', (req, res) => {
	category.find((err, items) => {
		if (err) {
			console.log('Find error' + err);
			res.json({ kq: 0, message: 'err' });
		} else {
			res.json(items);
		}
	})
});
app.post("/api/book",function(req,res){

    
})
