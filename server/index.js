const express = require("express");
const app = new express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = express.Router();
const loginRouter = express.Router();
const cors = require("cors");
const testPOOL = require("./DB/builder/pool").Pool;
const settings = {
  host: "server.rpsoftech.xyz",
  user: "pathshala_server",
  password: "JtYd#e$r%10PgRr",
  database: "pathshala",
  connectionLimit: 5,
  idleTimeout: 10,
  // version:"5.7.29"
};
// let con = mysql.createConnection(settings);
// con.connect(function(err) {
//   if (err) console.log(err);
//   // console.log("Connected!");
// });
const pool = new testPOOL(settings);
//  new QueryBuilder(settings, "mysql", "pool");
//escape to escape
const token = {
  accessTokenkey:
    "151c095c45243a9303453f73fb70e0f6dc0fbe8efbc2770ebe1f21e8ce94fba037fbbc060151262012c1e5f58dcb881c00aec7d82ddf1f7fd81ccd904e331682",
  refreshToken:
    "2a442f557658ce7cd403c6bfd3ee68b4ec3a9d16898d78d7dd9a54b7af9178ce97e502b0dc343882bb744b3379a2e75965ab469cb6e21a76387ee35e13ffb299",
};
const jwt = require("jsonwebtoken");

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views"));

let BasicPointDetailsArray = [];
let BasicPointDetails = {};
let basicsiteDetails = {};
const authenticateToken = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token1 = authHeader && authHeader.split(" ")[1];
  if (token1 == null) return res.sendStatus(401);

  jwt.verify(token1, token.accessTokenkey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    res.locals = {};
    next();
  });
};
function generateAccessToken(user) {
  return jwt.sign(user, token.accessTokenkey, { expiresIn: "1d" });
}
function generateRefreshToken(user) {
  return jwt.sign(user, token.refreshToken);
}
const gerUserDetails = async (params) => {
  const db = await pool.get_connection();
  db.select([
    "us.user_id",
    "us.unique_id",
    "ub.name",
    "ub.gender",
    "ub.mobile_no",
    "ub.dob",
    "ub.city",
    "ub.other as user_data",
    "sd.sangh_name",
  ]);
  db.from("users as us");
  db.join("user_basic as ub", "ub.user_id = us.user_id", "left");

  if (params.id && params.password) {
    db.where("us.unique_id", params.id).where("us.password", params.password);
  }
  if (params.user_id) {
    db.where("ub,user_id", params.user_id);
  }
  db.join("sangh_details as sd", "sd.sangh_id = ub.sangh", "left");
  return await db.get().finally(() => {
    db.release();
  });
};
const get_points_details = async () => {
  const db = await pool.get_connection();
  try {
    BasicPointDetailsArray = await db.order_by("id").get("points_types");
    db.release();
    BasicPointDetails = {};
    BasicPointDetailsArray.forEach((c) => {
      BasicPointDetails[c.id] = c;
    });
  } catch (e) {
    db.release();
  }
};
const getSiteBAsicDetails = async () => {
  basicsiteDetails = {};
  const db = await pool.get_connection();
  const res = await db.get("basic_details");
  db.release();
  res.forEach((c) => {
    basicsiteDetails[c.colum] = c.value;
  });
};
const addRefreshTokenandMakeEntry = async function (user, token) {
  pool.get_connection().then((qb) => {
    qb.insert("jwt_tokens", {
      user_id: user.user_id,
      token: token,
      created_at: Math.floor(Date.now() / 1000),
    }).then(() => {
      qb.release();
    });
  });
};
const calculateData = (data, type) => {
  try {
    const details = BasicPointDetails[type].details;
    let points = 0;
    if (type === 1 || type === 2) {
      if (!Array.isArray(data)) {
        new Error("s");
      }
      const multi = details.points;
      data.forEach((i) => (points += i.no_gatha * multi));
    }
    if (type === 4) {
      if (data.done) {
        points = details.points;
      }
    }
    if (type === 3) {
      if (data.done && data.day) {
        if (details.min_days) {
          if (details.perday && data.day >= details.min_days) {
            points = details.points * data.day;
          } else if (!details.perday) {
            points = details.points;
          }
        } else {
          points = details.points;
        }
      }
    }
    return points;
  } catch (e) {
    console.log(e);
    return 0;
  }
};
async function FetchPoints(data) {
  const db = await pool.get_connection();
  try {
    db.select(["user_id"]);
    if (data.group_by) {
      db.select("SUM(points) as point", false);
      db.group_by("user_id");
      if (data.group_by.type) {
        db.select("SUM(IF(point_type = 1,points*1,points*0)) as sutra", false);
        db.select("SUM(IF(point_type = 2,points*1,points*0)) as kavya", false);
        db.select("SUM(IF(point_type = 3,points*1,points*0)) as week", false);
        db.select("SUM(IF(point_type = 4,points*1,points*0)) as daily", false);
      }
      if (data.group_by.day) {
        db.group_by("day");
        db.select("day");
      }
      if (data.group_by.month) {
        db.group_by("month");
        db.select("month");
      }
      if (data.group_by.year) {
        db.group_by("year");
        db.select("year");
      }
      if (data.group_by.status) {
        db.group_by("status");
        db.select("status");
      }
      if (data.fetch_to_display) {
        db.select("SUM(IF(status = 3,points*1,points*0)) as rejected", false);
        db.select("SUM(IF(status = 4,points*1,points*0)) as approved", false);
      }
      // db.where('','')
    } else {
      db.select([
        "day",
        "month",
        "year",
        "point_type",
        "status",
        "pm.details",
        "points",
      ]);
    }
    if (data.order_by) {
      if (data.order_by === "desc") {
        db.order_by("timestamp", "desc");
      } else {
        db.order_by("timestamp");
      }
      if (data.group_by) {
        db.select("MAX(timestamp) as timestamp", false);
      }
    }
    if (typeof data.nolimit === "undefined") {
      db.limit(data.limit, data.limit * (data.stream - 1));
    }
    if (data.status) {
      db.where("pm.status", db.status);
    }
    if (data.user_id) {
      db.where("pm.user_id", data.user_id);
    }
    if (data.month) {
      db.where("pm.month", data.month);
    }
    if (data.day) {
      db.where("pm.day", data.day);
    }
    if (data.year) {
      db.where("pm.year", data.year);
    }
    if (data.point_type) {
      db.where("pm.point_type", data.point_type);
    }
    return db.get("points_main as pm").finally(() => {
      db.release();
    });
  } catch (e) {
    console.log(e);
    db.release();
    throw e;
  }
}
getSiteBAsicDetails();
get_points_details();
setInterval(()=>{
  getSiteBAsicDetails();
  get_points_details();
},10800000)
app.use("/api", router);
app.get("/basicdetails", (req, res) => {
  res.send(basicsiteDetails);
});
app.post("/restart", (req, res) => {
  if (req.body.pass && req.body.pass === "KeyurRocks") {
    setTimeout(() => {
      process.exit(1);
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});
app.get("/points_details", (req, res) => {
  res.send(BasicPointDetailsArray);
});
app.use("/test", (req, res) => {
  res.send({ data: "success" });
});
loginRouter.post("/login", (req, res) => {
  let data = req.body;
  if (data.id && data.password) {
    gerUserDetails(data)
      .then((result) => {
        if (result.length > 0) {
          res.locals = {
            success: 1,
            data: result[0],
          };
          let user = result[0];
          res.locals.data.accessToken = generateAccessToken(user);
          res.locals.data.refreshToken = generateRefreshToken(user);
          addRefreshTokenandMakeEntry(user, res.locals.data.refreshToken);
          res.send(res.locals);
        } else {
          res.send({ success: 0 });
        }
      })
      .catch((err) => res.send({ success: 0, error: err }));
  } else {
    res.send({
      success: 0,
    });
  }
});
loginRouter.get("/refreshaceesstoken", (req, res) => {
  let data = req.body;
  if (data.token && typeof data.token !== "undefined") {
    jwt.verify(data.token, token.refreshToken, (err, user) => {
      if (err) return res.sendStatus(403);
      gerUserDetails(user).then(([err, result]) => {
        if (err) return res.sendStatus(403);
        if (result.length > 0) {
          res.locals = {
            success: 1,
            data: result[0],
          };
          let user = JSON.parse(JSON.stringify(result[0]));
          res.locals.data.accessToken = generateAccessToken(user);
          res.send(res.locals);
        } else {
          res.send({ success: 0 });
        }
      });
    });
  } else {
    res.sendStatus(401);
  }
});
app.use("/loginserver", loginRouter);
app.use("/tojson/*", (req, res) => {
  res.send(req.query);
});
router.use(authenticateToken);
router.get("/islogin", (req, res) => {
  res.send({
    success: 1,
  });
});
router.get("/mydetails", (req, res) => {
  res.send({ success: 1, data: req.user });
});
router.post("/submit", async (req, res) => {
  const data = req.body;
  if (
    data.year &&
    data.month &&
    data.day &&
    data.point_type &&
    data.details &&
    data.timestamp
  ) {
    const db = await pool.get_connection();
    try {
      if(data.point_type === 3){
        if(new Date(data.timestamp * 1000).getDay() !== 6){
          new Error('Date');
        }
      }
      const time = Math.floor(Date.now() / 1000);
      const preApproved =
        BasicPointDetails[data.point_type].details.pre_approved;
      const insert_data = {
        user_id: req.user.user_id,
        day: data.day,
        month: data.month,
        year: data.year,
        point_type: data.point_type,
        status: preApproved ? 4 : 2,
        points: preApproved ? calculateData(data.details, data.point_type) : 0,
        timestamp: data.timestamp,
        details: data.details,
        created_on: time,
        edited_on: time,
      };
      let result;
      if (data.update && data.update === true && data.id) {
        delete insert_data.created_on;
        delete insert_data.month;
        delete insert_data.day;
        delete insert_data.year;
        delete insert_data.timestamp;
        result = await db.update("points_main", insert_data, {
          user_id: req.user.user_id,
          status: 2,
          id: data.id,
        });
      } else {
        result = await db.insert("points_main", insert_data, true);
      }
      db.release();
      if (result.affectedRows && result.affectedRows > 0) {
        res.send({
          success: 1,
        });
      } else {
        res.send({
          success: 0,
        });
      }
    } catch (e) {
      db.release();
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
});
router.get("/mypoints", async (req, res) => {
  try {
    let data = req.query;
    if (!data.nolimit && (!data.stream || !data.limit)) {
      throw new Error("Please send limit and stream");
    }
    if (data.group_by && typeof data.group_by === "string") {
      data.group_by = JSON.parse(data.group_by);
    }
    data.user_id = req.user.user_id;
    const result = await FetchPoints(data);
    res.send({
      success: 1,
      data: result,
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});
app.use("**/*", (req, res) => {
  res.sendStatus(404);
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});
