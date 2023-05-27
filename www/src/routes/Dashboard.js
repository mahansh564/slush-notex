import React, { Fragment, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Redirect } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Header from "../components/Header";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


import first from '../graphics/1.jpg';
import second from '../graphics/2.jpg';
import third from '../graphics/3.jpg';
import fourth from '../graphics/4.jpg';

const API_URL = process.env.NODE_ENV === "production" ? "YOUR_APP_URL" : "http://localhost:5000";


const Dashboard = ({ }) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState([]);
  const { user } = useContext(AuthContext);
  const [heading, setHeading] = useState("");
  const [noteBody, setBody] = useState("");

  const [show, setShow] = useState(false);
  const [addShow, setAddShow] = useState(false);
  const [addInputs, setAddInputs] = useState({
    addHeading: "",
    addBody: ""
  });

  const { addHeading, addBody } = addInputs;

  const onAddChange = e =>
    setAddInputs({ ...addInputs, [e.target.name]: e.target.value });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseAdd = () => setAddShow(false);
  const handleShowAdd = () => setAddShow(true);

  const getNotes = async () => {
    try{
      const userid = `${user.id}`
      console.log(userid);
      const body = { userid };
      const res = await fetch(
        `${API_URL}/notes/get`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );
      const data = await res.json();
      setNotes(data);
      setAllNotes(data);
    } catch (error) {
      console.log(error.message)
    }
  };
  useEffect(() => { getNotes(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    if (searchInput.length > 0) {
      const filtered = allNotes.filter((note) => { return `${note.heading.toLowerCase()}`.includes(searchInput.toLowerCase()) });
      setNotes(filtered);
  }
  };

  const handleHeadingChange = (e) => {
    setHeading(e.target.value);
  };
  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };
  const handleCurrentNote = (note) => {
    setCurrentNote(Array(note));
    setHeading(note.heading);
    setBody(note.body);
    console.log("added");
  };
  const addNote = async () => {
    try {
      const userid = `${user.id}`
      console.log(userid);
      const body = { userid, addHeading, addBody };
      const response = await fetch(
        `${API_URL}/notes/add`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );

      const parseRes = await response.json();
      if(parseRes){
        toast("Note added!");
      }
      handleCloseAdd();
      getNotes();
      setAddInputs({
        addHeading: "",
        addBody: ""
      });

    } catch (err) {
      console.error(err.message);
    }
  }
  const editNote = async () => {
    try {
      const noteid = currentNote[0].note_id;
      const reqbody = { noteid, heading, noteBody };
      console.log(noteid);
      const res = await fetch(
        `${API_URL}/notes/edit`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(reqbody)
        }
      );

      handleClose();
      getNotes();
      handleCurrentNote(notes[0]);
      navigate(0);

    } catch (err) {
      console.error(err.message);
    }
  };
  const deleteNote = async () => {
      const noteid = currentNote[0].note_id;
      const reqbody = { noteid };
      const res = await fetch(
        `${API_URL}/notes/remove`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(reqbody)
        }
      );
      getNotes();
      setCurrentNote([]);
  };
  const AllNotes = () => (
    notes.map (note => (
                          <div className="note_comp comp0 active_note_comp" onClick={() => handleCurrentNote(note)} key={note.note_id}>
                            <div className="textSec">
                              <h5 className="noteHead">{note.heading}</h5>
                              <p className="noteContent">{note.body}</p>
                            </div>
                            <div className="faceSec">
                              <div className="face_ic fic0"></div>
                            </div>
                            <div className="flagSec">
                              <p className="mailTime" style={{"fontSize": "smaller"}}>DAY<br/>{note.created_at}</p>
                            </div>
                          </div>
                  ))
  );

  const NotNullNotes = () => (
      <div className="col">
            <div className="mainContent content_box">
              <div className="content">
                  <section className="left-content">
                    <div className="icon_content"></div>
                    <div className="headData_content">
                      <h4><b>{currentNote[0].heading}</b></h4>
                    </div>
                  </section>
                  <div className="main_note_text textarea">
                    {currentNote[0].body}
                  </div>
              </div>
            </div>
            <div className="attachments content_box">
              <div className="images_attached">
                <img src={first} className="img_att"/><img src={second} className="img_att"/><img src={third} className="img_att"/><img src={fourth} className="img_att"/>
                <img src={first} className="img_att"/><img src={fourth} className="img_att"/>
              </div>
            </div>
            <div className="bottom_content">
              <div className="buttons_content_container">
                <div className="buttons_content reply_forward" onClick={handleShow}><h5 className="edit">Edit Note</h5></div>
                <div className="buttons_content delete_button" style={{"float":"right", "marginRight": "5vw"}} onClick={deleteNote}><h5 className="share">Delete Note</h5></div>
              </div>
            </div>
      </div>);

  const NullNotes = () => (
       <div className="col">
            <div className="mainContent content_box">
              <div className="content">
                  <section className="left-content">
                    <div className="headData_content">
                      <h4><b>Select a Note :)</b></h4>
                    </div>
                  </section>
              </div>
            </div>
      </div>);

  return (
    <Fragment>
      <Header></Header>
            <div className="col-5">
              <div className="search-area inner-area">
                <i className="fas fa-search search_icon"></i>
                <input type="text" name="query" className="input_box" placeholder="SEARCH" onChange={handleSearch} value={searchInput}/>
                <div className="buttons_content add_button" onClick={handleShowAdd}><h5 className="edit"><i className="fas fa-plus add_icon"></i>&nbsp; Add Note</h5></div>
              </div>
              <div className="note-area inner-area">
                <h4 style={{color: '#fff'}}>Hi, {user.name}</h4>
                  {notes.length > 0 ? <AllNotes></AllNotes> : <p style={{"color":"white"}}>No notes yet!</p>}
              </div>
          </div>
          {currentNote.length > 0 ? <NotNullNotes></NotNullNotes> : <NullNotes></NullNotes>}

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Note</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Heading</Form.Label>
                    <Form.Control
                      type="email"
                      value={heading}
                      onChange={e => handleHeadingChange(e)}
                      autoFocus
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Body</Form.Label>
                    <Form.Control as="textarea" value={noteBody} onChange={e => handleBodyChange(e)} rows={5} />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={editNote}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={addShow} onHide={handleCloseAdd}>
              <Modal.Header closeButton>
                <Modal.Title>Add Note</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Heading</Form.Label>
                    <Form.Control
                      type="text"
                      name="addHeading"
                      value={addHeading}
                      onChange={e => onAddChange(e)}
                      autoFocus
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Body</Form.Label>
                    <Form.Control as="textarea" value={addBody} onChange={e => onAddChange(e)} rows={5} name="addBody"/>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseAdd}>
                  Close
                </Button>
                <Button variant="primary" onClick={addNote}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
    <ToastContainer></ToastContainer>
    </Fragment>
  );
};

export default Dashboard;