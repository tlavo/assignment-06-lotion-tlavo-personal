import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function Side({
  noteList,
  add,
  currNote,
  setCurrNote,
  newNoteAdded,
}) {
  const { noteId } = useParams();

  useEffect(() => {
    const index = noteList.findIndex((note) => note.id === Number(noteId));
    if (index >= 0) {
      setCurrNote(noteList[index].id);
    }
  }, [setCurrNote, noteList, noteId]);

  const timeUnits = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",    
    minute: "numeric",
  };

  const formatDate = (when) => {
    const formatted = new Date(when).toLocaleString("en-US", timeUnits);
    if (formatted === "Invalid Date") {
      return "";
    }
    return formatted;
  };

  if ((!newNoteAdded && noteList.length == 0) || noteList.length == 0) {
    return (    
      <div id="sideBar">
        <div id="sideTitle"> &nbsp;Notes
          <button onClick={add} id="add"> 
            +
          </button>
        </div>
        <div id="sideNotePreview">Click + to Add Notes</div>
      </div>
    );
  }

  return (
    <>
      <div id="sideBar">
        <div id="sideTitle"> &nbsp;Notes
          <button onClick={add} id="add">
            +
          </button>
        </div>

        {noteList.length > 0 && (
          <div
            id="noteListContainer"
            style={{ overflowY: "scroll", height: "100vh" }}
          >
            {noteList.slice(0).reverse().map((note) => (
            <Link to={`/notes/${note.id}/edit`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div
                key={note.id}
                className={`sideNoteBox ${note.id === currNote && "active"}`}
                onClick={() => {
                    setCurrNote(note.id);
                }}
                >
                <div id="noteHeader">{note.title}</div>
                <div id="datetime">{formatDate(note.date)}</div>
                <ReactQuill
                    readOnly={true}
                    id="sideBody"
                    modules={{ toolbar: false }}
                    value={note.body.slice(0, 50) + "..."}
                ></ReactQuill>
                </div>
            </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Side;