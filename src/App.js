import { useState, useEffect } from "react";
import Side from "./Side";
import Main from "./Main";
import { useNavigate } from "react-router-dom";

function App() {
  const [noteList, setNoteList] = useState(
    localStorage.noteList ? JSON.parse(localStorage.noteList) : []
  );

  const [currNote, setCurrNote] = useState(false);

  useEffect(() => {
    if (!localStorage.noteList) {
      localStorage.setItem("noteList", "[]");
    }
    setNoteList(JSON.parse(localStorage.noteList));
  }, []);

  useEffect(() => {
    localStorage.setItem("noteList", JSON.stringify(noteList));
  }, [noteList]);

  const [newNoteAdded, setNewNoteAdded] = useState(false);
  const [enableSide, setEnableSide] = useState(true);
  const [mainWidth, setMainWidth] = useState("100%");
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const save = (updatedNote) => {
    const updatedNotesArr = noteList.map((note) => {
      if (note.id === updatedNote.id) {
        return updatedNote;
      } else {
        return note;
      }
    });

    setNoteList(updatedNotesArr);
  };

  const textChange = (bodyText) => {
    setText(bodyText);
  };

  const add = () => {
    const maxId = noteList.length > 0 ? Math.max(...noteList.map(note => note.id)) : 0;
    const newNote = {
      id: maxId + 1,
      title: "Untitled",
      body: "",
      date: Date.now(),
    };
    setNoteList([...noteList, newNote]);
    setNewNoteAdded(true);
    setCurrNote(newNote.id);
  };

  const del = (noteId) => {
    const answer = window.confirm("Are you sure you want to delete note: \"" + getCurrNote().title + "\"");
    if (!answer) return;
  
    const newNoteList = noteList.filter((note) => note.id !== noteId);
    localStorage.removeItem(currNote.id);
    setNoteList(newNoteList);
  
    const currIndex = noteList.findIndex((note) => note.id === noteId);
    const nextNoteIndex = currIndex === 0 ? 1 : currIndex - 1;
    let nextNoteId;
    if (newNoteList.length > 0) {
      if (nextNoteIndex === newNoteList.length) {
        nextNoteId = newNoteList[0].id;
      } else {
        nextNoteId = newNoteList[nextNoteIndex].id;
      }
    } else {
      navigate(`/notes`);
      return;
    }
    setCurrNote(nextNoteId);
    navigate(`/notes/${nextNoteId}/edit`);
  };

  function getCurrNote() {
    return noteList.find((note) => note.id == currNote);
  }

  function toggleSide() {
    setEnableSide(!enableSide);
    setMainWidth({ width: !enableSide ? "80%" : "100%" });
  }

  return (
    <>
      <div id="header">
        <div id="title">Lotion</div>
        <div id="subtitle">You Got Eczema?</div>
        <div id="toggle">
          <button id="enableSide" onClick={toggleSide}>
            &#9776;
          </button>
        </div>
      </div>
      <div id="middle">
        {enableSide && (
          <Side
            noteList={noteList}
            add={add}
            currNote={currNote}
            setCurrNote={setCurrNote}
            newNoteAdded={newNoteAdded}
            textChange={textChange}
            text={text}
          ></Side>
        )}
        {noteList.map(
          (note) =>
            note.id === currNote && (
              <Main
                note={note}
                key={note.id}
                noteList={noteList}
                del={del}
                getCurrNote={getCurrNote}
                save={save}
                newNoteAdded={newNoteAdded}
                enableSide={enableSide}
                currNote={currNote}
              ></Main>
            )
        )}
        {((!newNoteAdded && noteList.length > 0 && !currNote) || noteList.length == 0) && (
          <div
            id="mainComp"
            style={enableSide ? { width: "80%" } : { width: "100%" }}>
            <div id="mainDirectionMessage">&#x2665;Select a note or create a new one&#x2665;</div>
          </div>
        )} 
      </div>
    </>
  );
}

export default App;