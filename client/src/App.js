import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "./axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
// import deleteCard from "./axios";
import Pusher from "pusher-js";
import Random from "random-number";
import "./App.css";
import { Button, IconButton, Typography } from "@mui/material";
import Modal from "./modal";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function App() {
  const [name, setName] = useState("");
  const [imgPath, setImgPath] = useState("");
  const [userData, setUserData] = useState([]);

  const getData = async () => {
    const req = await axios.get("/tinder/cards");
    // console.log(req);
    setUserData(req.data);
  };

  useEffect(() => {
    getData();
  }, [userData]);

  // channel.bind("deleted", removeTask());

  // useEffect(() => {
  //   const pusher = new Pusher("3f4a53efe35be9da4c17", {
  //     cluster: "eu",
  //   });

  //   const channel = pusher.subscribe("cards");
  //   channel.bind("inserted", (data) => {
  //     console.log("data recieved >>>", data);

  //     setUserData([...userData, data]);
  //   });
  // }, [userData]);

  //  Add task function
  const addTask = (newTask) => {
    console.log("This object exists in the addTask function", newTask);
    setUserData([...userData, newTask]);
  };

  // Delete Task function
  const removeTask = (id) => {
    console.log("This id is from the removeTask function", id);
    console.log();
    // const newCard = ;
    setUserData(userData.filter((data) => data._id !== id));
  };

  useEffect(() => {
    const pusher = new Pusher("3f4a53efe35be9da4c17", {
      cluster: "eu",
    });
    const channel = pusher.subscribe("cards");
    channel.bind("inserted", addTask);
    channel.bind("deleted", removeTask);
    channel.bind("updated");

    // setUserData([...userData, data]);
  }, []);

  // function responsible for POST request

  const onSubmit = (e) => {
    console.log("Clicked");
    console.log(name);
    console.log(imgPath);

    e.preventDefault();
    if (!imgPath.length || !name.length) {
      return;
    }

    const options = {
      min: 1,
      max: 1000,
      integer: true,
    };

    // addTask({ name, imgPath });

    const newCard = {
      imgUrl: imgPath,
      name: name,
      newId: Random(options),
    };

    // setUserId(Random(options));
    // console.log(Random());

    axios({
      method: "post",
      url: "/tinder/cards",
      data: newCard,
    });

    addTask(newCard);

    setName("");
    setImgPath("");
  };

  // function responsible for DELETE request

  const onDelete = (id) => {
    console.log("Clicked");
    console.log(id);

    axios({
      method: "delete",
      url: `/tinder/cards/${id}`,
    });

    removeTask(id);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "imgUrl", headerName: "ImagePath", width: 130 },
  ];

  // const rows = [
  //   { id: 1, Name: "Snow", ImagePath: "Jon" },
  //   { id: 2, Name: "new", ImagePath: "ho" },
  // ];

  const rows = userData.map(({ imgUrl, name, newId, _id }) => {
    const id = newId;
    // console.log("This is the name >>>", name);
    // console.log("This is the Image >>>", imgUrl);
    // console.log("This is the newId >>>", id);

    return { name, imgUrl, id, _id };
  });
  // const rows = [{ id: 1, Name: userData.name, ImagePath: userData.imgUrl }];
  // rows();

  return (
    <div className="app">
      <Box className="app__box1">
        <TextField
          fullWidth
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Name"
          id="fullWidth"
        />
      </Box>
      <Box className="app__box2">
        <TextField
          type="file"
          fullWidth
          id="fullWidth"
          value={imgPath}
          onChange={(e) => setImgPath(e.target.value)}
        />
      </Box>

      <Button variant="contained" onClick={onSubmit}>
        Upload
      </Button>

      <Typography
        className="app__text"
        style={{ marginTop: 40 }}
        variant="h5"
        component="h2"
      >
        User Data
      </Typography>

      <TableContainer className="app__tblcontainer" component={Paper}>
        <Table className="app__table" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Imgurl</TableCell>
              <TableCell align="right">Action</TableCell>

              {/* <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.imgUrl}</TableCell>

                <div style={{ display: "flex", justifyContent: "end" }}>
                  <IconButton
                    aria-label="delete"
                    style={{ color: "red" }}
                    onClick={() => onDelete(row._id)}
                  >
                    <DeleteIcon />
                  </IconButton>

                  {/* <p>|</p> */}

                  <IconButton aria-label="delete">
                    <Modal id={row._id} name={row.name} img={row.imgUrl} />
                  </IconButton>
                </div>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
