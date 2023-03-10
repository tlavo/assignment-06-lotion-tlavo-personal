import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

function Main({
  save,
  del,
  enableSide,
  getCurrNote,
  currNote,
  note,
}) {
  const [noteContent, setNoteContent] = useState("");
  const [date, setDate] = useState(Date.now());
  const [title, setTitle] = useState("");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(getCurrNote().body);
    console.log(getCurrNote().title);
    setNoteContent(getCurrNote().body);
    setTitle(getCurrNote().title);
  }, [currNote]);

  const controlTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const controlChange = (value) => {
    setNoteContent(value);
  };

  const controlEdit = () => {
    setEditing(false);
    navigate(`/notes/${currNote}/edit`); 
  };

  const controlSave = () => {
    console.log(typeof date);
    const note = {
      id: currNote,
      title: document.getElementById("noteTopText").value,
      date: date,
      body: noteContent,
    };
    navigate(`/notes/${currNote}`); 
    save(note);
    setEditing(true);
  };

  return (
    <>
      <div
        id="mainComp"
        style={{
          overflowY: "scroll",
          height: "100vh", ...(enableSide ? { width: "80%" } : { width: "100%" }),
        }}>
        <div id="noteTop">
          <div id="leftTop">
            <input
              type="text"
              id="noteTopText"
              placeholder="Untitled"
              value={title}
              onChange={controlTitleChange}
              autoFocus
            ></input>

            <div id="currDate">
              <input
                id="calendarSelect"
                type="datetime-local"
                defaultValue={new Date(note.date - 25200000)
                  .toISOString()
                  .slice(0, 19)}
                onChange={(e) => setDate(Date.parse(e.target.value))}
              />
            </div>
          </div>

          <div id="rightTop">
            {editing ? (
              <button onClick={controlEdit} id="edit">
                &#x270E;
              </button>
            ) : (
              <button onClick={controlSave}  id="save">
                &#x1F5F9;
              </button>
            )}

            <button
              onClick={() => {
                const currNote = getCurrNote();
                if (currNote) {
                  del(currNote.id);
                }
              }}
              id="del">
                &#x1F5F7;
            </button>
          </div>
        </div>

        {!editing ? (
          <div id="noteEdit">
            <ReactQuill
              placeholder="Take a note..."
              value={noteContent}
              onChange={controlChange}
            ></ReactQuill>
          </div>
        ) : (<div id="newNoteContent" dangerouslySetInnerHTML={{__html: noteContent}}></div>)}
      </div>
    </>
  );
}

export default Main;